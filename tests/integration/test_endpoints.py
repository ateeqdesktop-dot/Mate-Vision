"""
Integration tests for API endpoints.
"""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import io
from PIL import Image


class TestHealthEndpoints:
    """Tests for health check endpoints."""

    def test_root_endpoint(self, test_client):
        """Test root endpoint returns healthy status."""
        response = test_client.get("/")

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "service" in data

    def test_health_endpoint(self, test_client):
        """Test health endpoint returns model info."""
        response = test_client.get("/health")

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "models_loaded" in data


class TestModelsEndpoint:
    """Tests for models listing endpoint."""

    def test_list_models(self, test_client):
        """Test listing available models."""
        response = test_client.get("/api/v1/models")

        assert response.status_code == 200
        data = response.json()
        assert "models" in data
        assert isinstance(data["models"], list)


class TestCarAccidentPrediction:
    """Tests for car accident prediction endpoint."""

    def test_predict_car_accident_success(self, test_client, sample_image_bytes):
        """Test successful car accident prediction."""
        response = test_client.post(
            "/api/v1/predict/car-accident",
            files={"file": ("test.jpg", sample_image_bytes, "image/jpeg")},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "detections" in data
        assert "inference_time_ms" in data
        assert "image_width" in data
        assert "image_height" in data

    def test_predict_car_accident_with_png(self, test_client, small_image_bytes):
        """Test prediction with PNG image."""
        response = test_client.post(
            "/api/v1/predict/car-accident",
            files={"file": ("test.png", small_image_bytes, "image/png")},
        )

        assert response.status_code == 200
        assert response.json()["success"] is True

    def test_predict_car_accident_large_image(self, test_client, large_image_bytes):
        """Test prediction with large image."""
        response = test_client.post(
            "/api/v1/predict/car-accident",
            files={"file": ("large.jpg", large_image_bytes, "image/jpeg")},
        )

        assert response.status_code == 200

    def test_predict_car_accident_no_file(self, test_client):
        """Test prediction without file returns error."""
        response = test_client.post("/api/v1/predict/car-accident")

        assert response.status_code == 422  # Unprocessable Entity


class TestWeaponPrediction:
    """Tests for weapon prediction endpoint."""

    def test_predict_weapon_success(self, test_client, sample_image_bytes):
        """Test successful weapon prediction."""
        response = test_client.post(
            "/api/v1/predict/weapon",
            files={"file": ("test.jpg", sample_image_bytes, "image/jpeg")},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "detections" in data

    def test_predict_weapon_with_different_formats(self, test_client):
        """Test prediction accepts different image formats."""
        # Create images in different formats
        for fmt, mime in [("JPEG", "image/jpeg"), ("PNG", "image/png")]:
            img = Image.new("RGB", (200, 200), color="purple")
            buffer = io.BytesIO()
            img.save(buffer, format=fmt)
            buffer.seek(0)

            response = test_client.post(
                "/api/v1/predict/weapon",
                files={"file": (f"test.{fmt.lower()}", buffer.read(), mime)},
            )

            assert response.status_code == 200


class TestPredictionResponseFormat:
    """Tests for prediction response format validation."""

    def test_response_contains_all_fields(self, test_client, sample_image_bytes):
        """Test response contains all required fields."""
        response = test_client.post(
            "/api/v1/predict/car-accident",
            files={"file": ("test.jpg", sample_image_bytes, "image/jpeg")},
        )

        data = response.json()
        required_fields = [
            "success",
            "model_name",
            "detections",
            "inference_time_ms",
            "image_width",
            "image_height",
        ]

        for field in required_fields:
            assert field in data, f"Missing field: {field}"

    def test_detection_structure(self, test_client, sample_image_bytes):
        """Test detection objects have correct structure."""
        response = test_client.post(
            "/api/v1/predict/weapon",
            files={"file": ("test.jpg", sample_image_bytes, "image/jpeg")},
        )

        data = response.json()
        if len(data["detections"]) > 0:
            detection = data["detections"][0]
            assert "bbox" in detection
            assert "confidence" in detection
            assert "class_id" in detection
            assert "class_name" in detection

            bbox = detection["bbox"]
            assert all(k in bbox for k in ["x1", "y1", "x2", "y2"])


class TestSwaggerDocs:
    """Tests for API documentation endpoints."""

    def test_docs_endpoint(self, test_client):
        """Test Swagger UI is accessible."""
        response = test_client.get("/docs")
        assert response.status_code == 200

    def test_redoc_endpoint(self, test_client):
        """Test ReDoc is accessible."""
        response = test_client.get("/redoc")
        assert response.status_code == 200

    def test_openapi_schema(self, test_client):
        """Test OpenAPI schema is accessible."""
        response = test_client.get("/api/v1/openapi.json")
        assert response.status_code == 200
        data = response.json()
        assert "openapi" in data
        assert "paths" in data
