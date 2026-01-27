"""
Unit tests for Pydantic schemas.
"""
import pytest
from pydantic import ValidationError

from app.schemas.prediction import (
    BoundingBox,
    Detection,
    PredictionResponse,
    ErrorResponse,
)


class TestBoundingBox:
    """Tests for BoundingBox schema."""

    def test_valid_bounding_box(self):
        """Test creating a valid bounding box."""
        bbox = BoundingBox(x1=10.0, y1=20.0, x2=100.0, y2=120.0)

        assert bbox.x1 == 10.0
        assert bbox.y1 == 20.0
        assert bbox.x2 == 100.0
        assert bbox.y2 == 120.0

    def test_bounding_box_with_integers(self):
        """Test bounding box accepts integers and converts to float."""
        bbox = BoundingBox(x1=10, y1=20, x2=100, y2=120)

        assert isinstance(bbox.x1, float)
        assert bbox.x1 == 10.0

    def test_bounding_box_serialization(self):
        """Test bounding box serializes correctly."""
        bbox = BoundingBox(x1=10.0, y1=20.0, x2=100.0, y2=120.0)
        data = bbox.model_dump()

        assert data == {"x1": 10.0, "y1": 20.0, "x2": 100.0, "y2": 120.0}

    def test_bounding_box_missing_field(self):
        """Test bounding box requires all fields."""
        with pytest.raises(ValidationError):
            BoundingBox(x1=10.0, y1=20.0, x2=100.0)


class TestDetection:
    """Tests for Detection schema."""

    def test_valid_detection(self):
        """Test creating a valid detection."""
        detection = Detection(
            bbox=BoundingBox(x1=10.0, y1=20.0, x2=100.0, y2=120.0),
            confidence=0.85,
            class_id=0,
            class_name="car_accident",
        )

        assert detection.confidence == 0.85
        assert detection.class_id == 0
        assert detection.class_name == "car_accident"

    def test_confidence_range_valid(self):
        """Test confidence accepts values in valid range."""
        detection = Detection(
            bbox=BoundingBox(x1=0, y1=0, x2=10, y2=10),
            confidence=0.0,
            class_id=0,
            class_name="test",
        )
        assert detection.confidence == 0.0

        detection = Detection(
            bbox=BoundingBox(x1=0, y1=0, x2=10, y2=10),
            confidence=1.0,
            class_id=0,
            class_name="test",
        )
        assert detection.confidence == 1.0

    def test_confidence_out_of_range(self):
        """Test confidence rejects values outside 0-1 range."""
        with pytest.raises(ValidationError):
            Detection(
                bbox=BoundingBox(x1=0, y1=0, x2=10, y2=10),
                confidence=1.5,
                class_id=0,
                class_name="test",
            )

        with pytest.raises(ValidationError):
            Detection(
                bbox=BoundingBox(x1=0, y1=0, x2=10, y2=10),
                confidence=-0.1,
                class_id=0,
                class_name="test",
            )


class TestPredictionResponse:
    """Tests for PredictionResponse schema."""

    def test_valid_response_with_detections(self):
        """Test creating a response with detections."""
        response = PredictionResponse(
            success=True,
            model_name="car_accidents",
            detections=[
                Detection(
                    bbox=BoundingBox(x1=10, y1=20, x2=100, y2=120),
                    confidence=0.85,
                    class_id=0,
                    class_name="car_accident",
                )
            ],
            inference_time_ms=15.5,
            image_width=640,
            image_height=480,
        )

        assert response.success is True
        assert len(response.detections) == 1
        assert response.inference_time_ms == 15.5

    def test_response_empty_detections(self):
        """Test response with no detections."""
        response = PredictionResponse(
            success=True,
            model_name="weapons",
            detections=[],
            inference_time_ms=10.0,
            image_width=1920,
            image_height=1080,
        )

        assert response.detections == []
        assert response.model_name == "weapons"

    def test_response_serialization(self):
        """Test response serializes to proper JSON structure."""
        response = PredictionResponse(
            success=True,
            model_name="test",
            detections=[],
            inference_time_ms=5.0,
            image_width=640,
            image_height=480,
        )
        data = response.model_dump()

        assert "success" in data
        assert "model_name" in data
        assert "detections" in data
        assert "inference_time_ms" in data
        assert "image_width" in data
        assert "image_height" in data


class TestErrorResponse:
    """Tests for ErrorResponse schema."""

    def test_error_response_basic(self):
        """Test creating a basic error response."""
        error = ErrorResponse(error="Something went wrong")

        assert error.success is False
        assert error.error == "Something went wrong"
        assert error.detail is None

    def test_error_response_with_detail(self):
        """Test error response with detail."""
        error = ErrorResponse(
            error="Inference failed",
            detail="Model not loaded",
        )

        assert error.error == "Inference failed"
        assert error.detail == "Model not loaded"
