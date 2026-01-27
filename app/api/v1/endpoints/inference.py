from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from PIL import Image
import numpy as np
import io

from app.schemas.prediction import PredictionResponse, Detection, BoundingBox, ErrorResponse
from app.services.model_service import model_manager, YoloModel
from app.core.config import get_settings, Settings


router = APIRouter()


async def _run_inference(model_id: str, file: UploadFile) -> PredictionResponse:
    """Common inference logic for all models."""
    try:
        # Read and validate image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        image_array = np.array(image)

        # Get model and run inference
        model = model_manager.get_model(model_id)
        detections_raw, inference_time, width, height = model.predict(image_array)

        # Build response
        detections = [
            Detection(
                bbox=BoundingBox(**det["bbox"]),
                confidence=det["confidence"],
                class_id=det["class_id"],
                class_name=det["class_name"],
            )
            for det in detections_raw
        ]

        return PredictionResponse(
            success=True,
            model_name=model_id,
            detections=detections,
            inference_time_ms=inference_time,
            image_width=width,
            image_height=height,
        )

    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference failed: {str(e)}")


@router.post(
    "/predict/car-accident",
    response_model=PredictionResponse,
    responses={500: {"model": ErrorResponse}},
    summary="Detect car accidents",
    description="Upload an image to detect car accidents using the trained YOLO model.",
)
async def predict_car_accident(file: UploadFile = File(...)):
    """Detect car accidents in an uploaded image."""
    return await _run_inference("car_accidents", file)


@router.post(
    "/predict/weapon",
    response_model=PredictionResponse,
    responses={500: {"model": ErrorResponse}},
    summary="Detect weapons",
    description="Upload an image to detect weapons using the trained YOLO model.",
)
async def predict_weapon(file: UploadFile = File(...)):
    """Detect weapons in an uploaded image."""
    return await _run_inference("weapons", file)


@router.get(
    "/models",
    summary="List available models",
    description="Get a list of all loaded detection models.",
)
async def list_models():
    """List all available models."""
    return {"models": model_manager.list_models()}
