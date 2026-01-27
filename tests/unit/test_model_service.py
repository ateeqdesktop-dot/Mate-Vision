"""
Unit tests for model service.
"""
import pytest
import numpy as np
from pathlib import Path
from unittest.mock import patch, MagicMock

from app.services.model_service import YoloModel, ModelManager


class TestYoloModelPreprocess:
    """Tests for YoloModel preprocessing."""

    def test_preprocess_returns_correct_shape(self, mock_onnx_session):
        """Test preprocessing returns correct tensor shape."""
        with patch("onnxruntime.InferenceSession", return_value=mock_onnx_session):
            model = YoloModel(
                model_path=Path("test.onnx"),
                model_name="test",
                class_names=["class1"],
            )

            image = np.random.randint(0, 255, (480, 640, 3), dtype=np.uint8)
            tensor, scale, pad_x, pad_y, orig_w, orig_h = model.preprocess(image)

            assert tensor.shape == (1, 3, 640, 640)
            assert tensor.dtype == np.float32
            assert orig_w == 640
            assert orig_h == 480

    def test_preprocess_normalizes_values(self, mock_onnx_session):
        """Test preprocessing normalizes pixel values to 0-1."""
        with patch("onnxruntime.InferenceSession", return_value=mock_onnx_session):
            model = YoloModel(
                model_path=Path("test.onnx"),
                model_name="test",
                class_names=["class1"],
            )

            image = np.full((100, 100, 3), 255, dtype=np.uint8)
            tensor, *_ = model.preprocess(image)

            assert tensor.max() <= 1.0
            assert tensor.min() >= 0.0

    def test_preprocess_handles_different_sizes(self, mock_onnx_session):
        """Test preprocessing handles various image sizes."""
        with patch("onnxruntime.InferenceSession", return_value=mock_onnx_session):
            model = YoloModel(
                model_path=Path("test.onnx"),
                model_name="test",
                class_names=["class1"],
            )

            # Small image
            small = np.random.randint(0, 255, (100, 100, 3), dtype=np.uint8)
            tensor, *_ = model.preprocess(small)
            assert tensor.shape == (1, 3, 640, 640)

            # Large image
            large = np.random.randint(0, 255, (1080, 1920, 3), dtype=np.uint8)
            tensor, *_ = model.preprocess(large)
            assert tensor.shape == (1, 3, 640, 640)


class TestYoloModelNMS:
    """Tests for Non-Maximum Suppression."""

    def test_nms_keeps_highest_score(self, mock_onnx_session):
        """Test NMS keeps the highest scoring box."""
        with patch("onnxruntime.InferenceSession", return_value=mock_onnx_session):
            model = YoloModel(
                model_path=Path("test.onnx"),
                model_name="test",
                class_names=["class1"],
            )

            # Overlapping boxes
            boxes = np.array([
                [0, 0, 100, 100],
                [10, 10, 110, 110],
            ], dtype=np.float32)
            scores = np.array([0.9, 0.8], dtype=np.float32)

            kept = model._nms(boxes, scores, iou_threshold=0.5)

            assert len(kept) == 1
            assert kept[0] == 0  # Highest score kept

    def test_nms_keeps_separated_boxes(self, mock_onnx_session):
        """Test NMS keeps boxes that don't overlap."""
        with patch("onnxruntime.InferenceSession", return_value=mock_onnx_session):
            model = YoloModel(
                model_path=Path("test.onnx"),
                model_name="test",
                class_names=["class1"],
            )

            # Non-overlapping boxes
            boxes = np.array([
                [0, 0, 50, 50],
                [200, 200, 250, 250],
            ], dtype=np.float32)
            scores = np.array([0.9, 0.8], dtype=np.float32)

            kept = model._nms(boxes, scores, iou_threshold=0.5)

            assert len(kept) == 2

    def test_nms_empty_input(self, mock_onnx_session):
        """Test NMS handles empty input."""
        with patch("onnxruntime.InferenceSession", return_value=mock_onnx_session):
            model = YoloModel(
                model_path=Path("test.onnx"),
                model_name="test",
                class_names=["class1"],
            )

            boxes = np.array([]).reshape(0, 4)
            scores = np.array([])

            kept = model._nms(boxes, scores, iou_threshold=0.5)

            assert len(kept) == 0


class TestYoloModelPredict:
    """Tests for YoloModel prediction."""

    def test_predict_returns_detections(self, mock_onnx_session):
        """Test predict returns detection list."""
        with patch("onnxruntime.InferenceSession", return_value=mock_onnx_session):
            model = YoloModel(
                model_path=Path("test.onnx"),
                model_name="test",
                class_names=["class1"],
            )

            image = np.random.randint(0, 255, (480, 640, 3), dtype=np.uint8)
            detections, inference_time, width, height = model.predict(image)

            assert isinstance(detections, list)
            assert isinstance(inference_time, float)
            assert inference_time > 0
            assert width == 640
            assert height == 480

    def test_predict_returns_correct_structure(self, mock_onnx_session):
        """Test predictions have correct structure."""
        with patch("onnxruntime.InferenceSession", return_value=mock_onnx_session):
            model = YoloModel(
                model_path=Path("test.onnx"),
                model_name="test",
                class_names=["test_class"],
            )

            image = np.random.randint(0, 255, (480, 640, 3), dtype=np.uint8)
            detections, *_ = model.predict(image)

            if len(detections) > 0:
                det = detections[0]
                assert "bbox" in det
                assert "confidence" in det
                assert "class_id" in det
                assert "class_name" in det
                assert all(k in det["bbox"] for k in ["x1", "y1", "x2", "y2"])

    def test_predict_no_detections(self, mock_onnx_session_no_detections):
        """Test predict handles no detections."""
        with patch("onnxruntime.InferenceSession", return_value=mock_onnx_session_no_detections):
            model = YoloModel(
                model_path=Path("test.onnx"),
                model_name="test",
                class_names=["class1"],
            )

            image = np.random.randint(0, 255, (480, 640, 3), dtype=np.uint8)
            detections, *_ = model.predict(image)

            assert detections == []


class TestModelManager:
    """Tests for ModelManager class."""

    def test_load_model(self, mock_onnx_session):
        """Test loading a model."""
        with patch("onnxruntime.InferenceSession", return_value=mock_onnx_session):
            manager = ModelManager()
            manager.load_model(
                model_id="test_model",
                model_path=Path("test.onnx"),
                class_names=["class1"],
            )

            assert "test_model" in manager.list_models()

    def test_get_model(self, mock_onnx_session):
        """Test getting a loaded model."""
        with patch("onnxruntime.InferenceSession", return_value=mock_onnx_session):
            manager = ModelManager()
            manager.load_model(
                model_id="test_model",
                model_path=Path("test.onnx"),
                class_names=["class1"],
            )

            model = manager.get_model("test_model")
            assert isinstance(model, YoloModel)

    def test_get_model_not_loaded(self):
        """Test getting a model that wasn't loaded raises error."""
        manager = ModelManager()

        with pytest.raises(ValueError, match="not loaded"):
            manager.get_model("nonexistent")

    def test_list_models(self, mock_onnx_session):
        """Test listing loaded models."""
        with patch("onnxruntime.InferenceSession", return_value=mock_onnx_session):
            manager = ModelManager()
            manager.load_model("model1", Path("m1.onnx"), ["c1"])
            manager.load_model("model2", Path("m2.onnx"), ["c2"])

            models = manager.list_models()
            assert "model1" in models
            assert "model2" in models
            assert len(models) == 2
