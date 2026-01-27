"""
Pytest configuration and shared fixtures.
"""
import pytest
import numpy as np
from pathlib import Path
from PIL import Image
import io
from unittest.mock import Mock, patch, MagicMock

from fastapi.testclient import TestClient


# Test image fixtures
@pytest.fixture
def sample_image_bytes() -> bytes:
    """Create a sample test image as bytes."""
    img = Image.new("RGB", (640, 480), color="red")
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG")
    buffer.seek(0)
    return buffer.read()


@pytest.fixture
def sample_image_array() -> np.ndarray:
    """Create a sample test image as numpy array."""
    return np.random.randint(0, 255, (480, 640, 3), dtype=np.uint8)


@pytest.fixture
def small_image_bytes() -> bytes:
    """Create a small test image."""
    img = Image.new("RGB", (100, 100), color="blue")
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    return buffer.read()


@pytest.fixture
def large_image_bytes() -> bytes:
    """Create a large test image."""
    img = Image.new("RGB", (1920, 1080), color="green")
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG")
    buffer.seek(0)
    return buffer.read()


# Mock ONNX session fixture
@pytest.fixture
def mock_onnx_session():
    """Create a mock ONNX runtime session."""
    mock_session = MagicMock()

    # Mock input details
    mock_input = MagicMock()
    mock_input.name = "images"
    mock_input.shape = [1, 3, 640, 640]
    mock_session.get_inputs.return_value = [mock_input]

    # Mock output - YOLO format: (1, 5, 8400) for single class
    # 5 = 4 (bbox) + 1 (class score)
    mock_output = np.zeros((1, 5, 8400), dtype=np.float32)
    # Add a detection at index 0
    mock_output[0, 0, 0] = 320  # x_center
    mock_output[0, 1, 0] = 240  # y_center
    mock_output[0, 2, 0] = 100  # width
    mock_output[0, 3, 0] = 100  # height
    mock_output[0, 4, 0] = 0.9  # class score

    mock_session.run.return_value = [mock_output]

    return mock_session


@pytest.fixture
def mock_onnx_session_no_detections():
    """Create a mock ONNX session that returns no detections."""
    mock_session = MagicMock()

    mock_input = MagicMock()
    mock_input.name = "images"
    mock_input.shape = [1, 3, 640, 640]
    mock_session.get_inputs.return_value = [mock_input]

    # All zeros = no detections above threshold
    mock_output = np.zeros((1, 5, 8400), dtype=np.float32)
    mock_session.run.return_value = [mock_output]

    return mock_session


@pytest.fixture
def mock_onnx_session_multiple_detections():
    """Create a mock ONNX session with multiple detections."""
    mock_session = MagicMock()

    mock_input = MagicMock()
    mock_input.name = "images"
    mock_input.shape = [1, 3, 640, 640]
    mock_session.get_inputs.return_value = [mock_input]

    mock_output = np.zeros((1, 5, 8400), dtype=np.float32)
    # Detection 1
    mock_output[0, 0, 0] = 100
    mock_output[0, 1, 0] = 100
    mock_output[0, 2, 0] = 50
    mock_output[0, 3, 0] = 50
    mock_output[0, 4, 0] = 0.95
    # Detection 2
    mock_output[0, 0, 1] = 400
    mock_output[0, 1, 1] = 300
    mock_output[0, 2, 1] = 80
    mock_output[0, 3, 1] = 80
    mock_output[0, 4, 1] = 0.85

    mock_session.run.return_value = [mock_output]

    return mock_session


# App fixtures
@pytest.fixture
def mock_model_manager():
    """Create a mock model manager."""
    with patch("app.services.model_service.model_manager") as mock_manager:
        yield mock_manager


@pytest.fixture
def test_client(mock_model_manager):
    """Create a test client with mocked models."""
    # Mock the model loading
    mock_model = MagicMock()
    mock_model.predict.return_value = (
        [
            {
                "bbox": {"x1": 10, "y1": 20, "x2": 100, "y2": 120},
                "confidence": 0.85,
                "class_id": 0,
                "class_name": "test_class",
            }
        ],
        15.5,  # inference time
        640,   # width
        480,   # height
    )
    mock_model_manager.get_model.return_value = mock_model
    mock_model_manager.list_models.return_value = ["car_accidents", "weapons"]

    # Patch the lifespan to skip actual model loading
    with patch("app.main.model_manager", mock_model_manager):
        from app.main import create_app

        # Create app without lifespan for testing
        app = create_app()
        client = TestClient(app, raise_server_exceptions=False)
        yield client


@pytest.fixture
def test_models_dir(tmp_path) -> Path:
    """Create a temporary models directory."""
    models_dir = tmp_path / "models"
    models_dir.mkdir()
    return models_dir
