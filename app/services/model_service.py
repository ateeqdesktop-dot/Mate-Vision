import numpy as np
import onnxruntime as ort
from pathlib import Path
from typing import List, Tuple, Dict, Any
import time


class YoloModel:
    """YOLO model wrapper for ONNX inference."""

    def __init__(
        self,
        model_path: Path,
        model_name: str,
        class_names: List[str],
        input_size: int = 640,
        confidence_threshold: float = 0.5,
        iou_threshold: float = 0.45,
    ):
        """
        Initialize YOLO model.

        Args:
            model_path: Path to ONNX model file
            model_name: Name of the model for identification
            class_names: List of class names the model can detect
            input_size: Input size for the model (assumes square)
            confidence_threshold: Minimum confidence for detections
            iou_threshold: IoU threshold for NMS
        """
        self.model_path = model_path
        self.model_name = model_name
        self.class_names = class_names
        self.input_size = input_size
        self.confidence_threshold = confidence_threshold
        self.iou_threshold = iou_threshold

        # Initialize ONNX runtime session
        self.session = ort.InferenceSession(
            str(model_path),
            providers=["CUDAExecutionProvider", "CPUExecutionProvider"],
        )

        # Get input details
        self.input_name = self.session.get_inputs()[0].name
        self.input_shape = self.session.get_inputs()[0].shape

    def preprocess(self, image: np.ndarray) -> Tuple[np.ndarray, float, float, int, int]:
        """
        Preprocess image for YOLO inference.

        Args:
            image: Input image in RGB format (H, W, C)

        Returns:
            Preprocessed image tensor, scale factors, and padding offsets
        """
        original_h, original_w = image.shape[:2]

        # Calculate scaling factor (letterbox)
        scale = min(self.input_size / original_w, self.input_size / original_h)
        new_w = int(original_w * scale)
        new_h = int(original_h * scale)

        # Resize image
        from PIL import Image
        pil_image = Image.fromarray(image)
        pil_image = pil_image.resize((new_w, new_h), Image.BILINEAR)
        resized = np.array(pil_image)

        # Create padded image (letterbox)
        padded = np.full((self.input_size, self.input_size, 3), 114, dtype=np.uint8)
        pad_x = (self.input_size - new_w) // 2
        pad_y = (self.input_size - new_h) // 2
        padded[pad_y : pad_y + new_h, pad_x : pad_x + new_w] = resized

        # Normalize and transpose
        input_tensor = padded.astype(np.float32) / 255.0
        input_tensor = input_tensor.transpose(2, 0, 1)  # HWC -> CHW
        input_tensor = np.expand_dims(input_tensor, axis=0)  # Add batch dimension

        return input_tensor, scale, pad_x, pad_y, original_w, original_h

    def postprocess(
        self,
        outputs: np.ndarray,
        scale: float,
        pad_x: int,
        pad_y: int,
        original_w: int,
        original_h: int,
    ) -> List[Dict[str, Any]]:
        """
        Postprocess YOLO outputs.

        Args:
            outputs: Raw model outputs
            scale: Scale factor used during preprocessing
            pad_x: X padding offset
            pad_y: Y padding offset
            original_w: Original image width
            original_h: Original image height

        Returns:
            List of detection dictionaries
        """
        # YOLO output shape: (1, num_classes + 4, num_anchors)
        # Transpose to (num_anchors, num_classes + 4)
        predictions = outputs[0].transpose(1, 0)

        # Extract boxes and scores
        boxes = predictions[:, :4]  # x_center, y_center, width, height
        scores = predictions[:, 4:]  # class scores

        # Get max scores and class ids
        max_scores = np.max(scores, axis=1)
        class_ids = np.argmax(scores, axis=1)

        # Filter by confidence
        mask = max_scores >= self.confidence_threshold
        boxes = boxes[mask]
        max_scores = max_scores[mask]
        class_ids = class_ids[mask]

        if len(boxes) == 0:
            return []

        # Convert from center format to corner format
        x_center, y_center, w, h = boxes[:, 0], boxes[:, 1], boxes[:, 2], boxes[:, 3]
        x1 = x_center - w / 2
        y1 = y_center - h / 2
        x2 = x_center + w / 2
        y2 = y_center + h / 2

        # Remove padding and scale back to original size
        x1 = (x1 - pad_x) / scale
        y1 = (y1 - pad_y) / scale
        x2 = (x2 - pad_x) / scale
        y2 = (y2 - pad_y) / scale

        # Clip to image boundaries
        x1 = np.clip(x1, 0, original_w)
        y1 = np.clip(y1, 0, original_h)
        x2 = np.clip(x2, 0, original_w)
        y2 = np.clip(y2, 0, original_h)

        # Apply NMS
        boxes_for_nms = np.stack([x1, y1, x2, y2], axis=1)
        indices = self._nms(boxes_for_nms, max_scores, self.iou_threshold)

        # Build results
        detections = []
        for idx in indices:
            detections.append({
                "bbox": {
                    "x1": float(x1[idx]),
                    "y1": float(y1[idx]),
                    "x2": float(x2[idx]),
                    "y2": float(y2[idx]),
                },
                "confidence": float(max_scores[idx]),
                "class_id": int(class_ids[idx]),
                "class_name": self.class_names[class_ids[idx]] if class_ids[idx] < len(self.class_names) else "unknown",
            })

        return detections

    def _nms(self, boxes: np.ndarray, scores: np.ndarray, iou_threshold: float) -> List[int]:
        """
        Non-maximum suppression.

        Args:
            boxes: Bounding boxes (N, 4)
            scores: Confidence scores (N,)
            iou_threshold: IoU threshold

        Returns:
            Indices of kept boxes
        """
        x1, y1, x2, y2 = boxes[:, 0], boxes[:, 1], boxes[:, 2], boxes[:, 3]
        areas = (x2 - x1) * (y2 - y1)
        order = scores.argsort()[::-1]

        keep = []
        while order.size > 0:
            i = order[0]
            keep.append(i)

            if order.size == 1:
                break

            xx1 = np.maximum(x1[i], x1[order[1:]])
            yy1 = np.maximum(y1[i], y1[order[1:]])
            xx2 = np.minimum(x2[i], x2[order[1:]])
            yy2 = np.minimum(y2[i], y2[order[1:]])

            w = np.maximum(0, xx2 - xx1)
            h = np.maximum(0, yy2 - yy1)
            intersection = w * h

            iou = intersection / (areas[i] + areas[order[1:]] - intersection)
            mask = iou <= iou_threshold
            order = order[1:][mask]

        return keep

    def predict(self, image: np.ndarray) -> Tuple[List[Dict[str, Any]], float]:
        """
        Run inference on an image.

        Args:
            image: Input image in RGB format (H, W, C)

        Returns:
            List of detections and inference time in milliseconds
        """
        start_time = time.time()

        # Preprocess
        input_tensor, scale, pad_x, pad_y, original_w, original_h = self.preprocess(image)

        # Run inference
        outputs = self.session.run(None, {self.input_name: input_tensor})[0]

        # Postprocess
        detections = self.postprocess(outputs, scale, pad_x, pad_y, original_w, original_h)

        inference_time = (time.time() - start_time) * 1000  # Convert to ms

        return detections, inference_time, original_w, original_h


class ModelManager:
    """Manager for loading and accessing YOLO models."""

    def __init__(self):
        self._models: Dict[str, YoloModel] = {}

    def load_model(
        self,
        model_id: str,
        model_path: Path,
        class_names: List[str],
        input_size: int = 640,
        confidence_threshold: float = 0.5,
        iou_threshold: float = 0.45,
    ) -> None:
        """Load a YOLO model."""
        self._models[model_id] = YoloModel(
            model_path=model_path,
            model_name=model_id,
            class_names=class_names,
            input_size=input_size,
            confidence_threshold=confidence_threshold,
            iou_threshold=iou_threshold,
        )

    def get_model(self, model_id: str) -> YoloModel:
        """Get a loaded model by ID."""
        if model_id not in self._models:
            raise ValueError(f"Model '{model_id}' not loaded")
        return self._models[model_id]

    def list_models(self) -> List[str]:
        """List all loaded model IDs."""
        return list(self._models.keys())


# Global model manager instance
model_manager = ModelManager()
