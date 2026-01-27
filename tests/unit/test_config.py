"""
Unit tests for configuration module.
"""
import pytest
from pathlib import Path
from unittest.mock import patch
import os


class TestSettings:
    """Tests for Settings class."""

    def test_default_settings(self):
        """Test that default settings are correctly set."""
        from app.core.config import Settings

        settings = Settings()

        assert settings.api_v1_prefix == "/api/v1"
        assert settings.project_name == "YOLO Detection API"
        assert settings.confidence_threshold == 0.5
        assert settings.iou_threshold == 0.45
        assert settings.input_size == 640

    def test_custom_settings_from_env(self):
        """Test settings can be overridden by environment variables."""
        from app.core.config import Settings

        with patch.dict(os.environ, {
            "CONFIDENCE_THRESHOLD": "0.7",
            "IOU_THRESHOLD": "0.5",
            "INPUT_SIZE": "416",
        }):
            settings = Settings()

            assert settings.confidence_threshold == 0.7
            assert settings.iou_threshold == 0.5
            assert settings.input_size == 416

    def test_models_dir_default(self):
        """Test default models directory."""
        from app.core.config import Settings

        settings = Settings()
        assert settings.models_dir == Path("models")

    def test_model_filenames(self):
        """Test model filename settings."""
        from app.core.config import Settings

        settings = Settings()
        assert settings.car_accidents_model == "car_accidents.onnx"
        assert settings.weapons_model == "weapons.onnx"


class TestGetSettings:
    """Tests for get_settings function."""

    def test_get_settings_returns_settings(self):
        """Test that get_settings returns a Settings instance."""
        from app.core.config import get_settings, Settings

        settings = get_settings()
        assert isinstance(settings, Settings)

    def test_get_settings_is_cached(self):
        """Test that get_settings returns the same cached instance."""
        from app.core.config import get_settings

        settings1 = get_settings()
        settings2 = get_settings()
        assert settings1 is settings2
