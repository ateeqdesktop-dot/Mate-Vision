from pydantic_settings import BaseSettings
from functools import lru_cache
from pathlib import Path


class Settings(BaseSettings):
    """Application settings."""

    # API Settings
    api_v1_prefix: str = "/api/v1"
    project_name: str = "YOLO Detection API"

    # Model Settings
    models_dir: Path = Path("models")
    car_accidents_model: str = "car_accidents.onnx"
    weapons_model: str = "weapons.onnx"

    # Inference Settings
    confidence_threshold: float = 0.5
    iou_threshold: float = 0.45
    input_size: int = 640

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
