from pydantic import BaseModel, Field
from typing import List, Optional


class BoundingBox(BaseModel):
    """Bounding box coordinates."""
    x1: float = Field(..., description="Left x coordinate")
    y1: float = Field(..., description="Top y coordinate")
    x2: float = Field(..., description="Right x coordinate")
    y2: float = Field(..., description="Bottom y coordinate")


class Detection(BaseModel):
    """Single detection result."""
    bbox: BoundingBox
    confidence: float = Field(..., ge=0, le=1, description="Detection confidence")
    class_id: int = Field(..., description="Class ID")
    class_name: str = Field(..., description="Class name")


class PredictionResponse(BaseModel):
    """Response model for predictions."""
    success: bool = Field(default=True)
    model_name: str = Field(..., description="Name of the model used")
    detections: List[Detection] = Field(default_factory=list)
    inference_time_ms: float = Field(..., description="Inference time in milliseconds")
    image_width: int = Field(..., description="Original image width")
    image_height: int = Field(..., description="Original image height")


class ErrorResponse(BaseModel):
    """Error response model."""
    success: bool = Field(default=False)
    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(default=None, description="Detailed error info")
