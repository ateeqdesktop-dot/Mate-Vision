from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.api.v1.router import api_router
from app.services.model_service import model_manager


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler for startup and shutdown."""
    settings = get_settings()

    # Load models on startup
    models_dir = settings.models_dir

    # Load car accidents model
    model_manager.load_model(
        model_id="car_accidents",
        model_path=models_dir / settings.car_accidents_model,
        class_names=["car_accident"],
        input_size=settings.input_size,
        confidence_threshold=settings.confidence_threshold,
        iou_threshold=settings.iou_threshold,
    )

    # Load weapons model
    model_manager.load_model(
        model_id="weapons",
        model_path=models_dir / settings.weapons_model,
        class_names=["weapon"],
        input_size=settings.input_size,
        confidence_threshold=settings.confidence_threshold,
        iou_threshold=settings.iou_threshold,
    )

    print(f"✅ Loaded models: {model_manager.list_models()}")

    yield

    # Cleanup on shutdown (if needed)
    print("🛑 Shutting down...")


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    settings = get_settings()

    app = FastAPI(
        title=settings.project_name,
        description="API for detecting car accidents and weapons using YOLO models",
        version="1.0.0",
        openapi_url=f"{settings.api_v1_prefix}/openapi.json",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include API router
    app.include_router(api_router, prefix=settings.api_v1_prefix)

    @app.get("/", tags=["health"])
    async def root():
        """Health check endpoint."""
        return {"status": "healthy", "service": settings.project_name}

    @app.get("/health", tags=["health"])
    async def health():
        """Detailed health check."""
        return {
            "status": "healthy",
            "models_loaded": model_manager.list_models(),
        }

    return app


app = create_app()
