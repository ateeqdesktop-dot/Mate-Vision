# Backend API Documentation

## Overview

The backend is a high-performance **FastAPI** application designed to serve ONNX models for computer vision tasks. It handles image processing, model inference, and response formatting.

## API Specification

### Base URL
`http://localhost:8000` (Local)

### Endpoints

#### 1. Heatlh Check
- **URL**: `/`
- **Method**: `GET`
- **Response**:
```json
{
  "status": "online",
  "version": "1.0.0"
}
```

#### 2. Car Accident Detection
- **URL**: `/api/v1/predict/car-accident`
- **Method**: `POST`
- **Body**: `multipart/form-data`
  - `file`: Image file (JPG/PNG)
- **Response**:
```json
{
  "success": true,
  "model_name": "yolov8n_car_accident.onnx",
  "inference_time_ms": 125.5,
  "image_width": 640,
  "image_height": 480,
  "detections": [
    {
      "bbox": {
        "x1": 100,
        "y1": 50,
        "x2": 300,
        "y2": 200
      },
      "confidence": 0.85,
      "class_id": 0,
      "class_name": "moderate_accident"
    }
  ]
}
```

#### 3. Weapon Detection
- **URL**: `/api/v1/predict/weapon`
- **Method**: `POST`
- **Body**: `multipart/form-data`
  - `file`: Image file (JPG/PNG)
- **Response**: Similar structure to car accident.

#### 4. List Models
- **URL**: `/api/v1/models`
- **Method**: `GET`
- **Response**: List of loaded ONNX models and their status.

---

## Services

### Model Service (`app/services/model_service.py`)
- **Singleton Pattern**: Ensures models are loaded only once.
- **onnxruntime**: Uses `InferenceSession` for execution.
- **Preprocessing**:
  - Letterbox resizing (padding to square).
  - Normalization (1/255.0).
  - CHW format conversion.

### Post-Processing
- **NMS (Non-Maximum Suppression)**:
  - Filters multiple boxes for the same object.
  - IoU Threshold: 0.45.
- **Confidence Filter**:
  - Threshold: 0.50.

---

## Configuration

Settings are managed in `app/core/config.py` using `pydantic-settings`.

| Variable | Default | Description |
|----------|---------|-------------|
| `API_V1_STR` | `/api/v1` | API prefix |
| `PROJECT_NAME` | `Mate Vision` | App name |
| `MODEL_PATH` | `models/` | Directory for ONNX models |
| `CONFIDENCE_THRESHOLD` | `0.5` | Min confidence to report |

---

## Error Handling

The API returns standard HTTP status codes:
- `200`: Success
- `400`: Bad Request (Invalid image format)
- `422`: Validation Error (Missing file)
- `500`: Internal Server Error (Model inference failed)
