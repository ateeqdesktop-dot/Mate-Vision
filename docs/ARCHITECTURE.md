# Mate Vision Architecture

## System Overview

Mate Vision is a hybrid mobile-cloud solution for real-time object detection, specifically focused on safety incidents (Car Accidents) and security threats (Weapons).

### High-Level Diagram

```mermaid
graph TD
    Client[Mobile App (React Native)] -->|HTTP POST (Image)| API[FastAPI Backend]
    API -->|Preprocess| Pre[Image Preprocessing]
    Pre -->|Tensor| Model[ONNX Runtime]
    Model -->|Inference| YOLO[YOLOv8 Nano Model]
    YOLO -->|Postprocess| Post[NMS & Scaling]
    Post -->|JSON Response| API
    API -->|Detections| Client
```

---

## Component Details

### 1. Mobile Application (Client)
- **Framework**: React Native with Expo SDK 52.
- **Language**: TypeScript.
- **State Management**: Zustand (Global state, Theme, History).
- **Navigation**: Expo Router (File-based routing).
- **Theme System**: Dynamic single-theme architecture (Warm Peach).

### 2. Backend Server (API)
- **Framework**: FastAPI (Python).
- **Runtime**: Uvicorn (ASGI).
- **Protocol**: HTTP/1.1 (REST).
- **Validation**: Pydantic v2.

### 3. AI Inference Engine
- **Engine**: ONNX Runtime (CPU-optimized).
- **Models**:
  - `yolov8n_car_accident.onnx`: Trained on accident dataset.
  - `yolov8n_weapon.onnx`: Trained on weapon dataset.
- **Optimization**: Quantized models for faster CPU inference.

---

## Data Flow

1. **Capture**: User selects image via Gallery or Camera using `expo-image-picker`.
2. **Upload**: Image is sent as `FormData` to `/api/v1/predict/{type}`.
3. **Processing**:
   - Backend reads image bytes using Pillow.
   - Resizes to 640x640 (preserving aspect ratio with padding).
   - Normalizes pixel values (0-1).
4. **Inference**:
   - ONNX Runtime executes the graph.
   - Output includes bounding boxes (xywh) and class probabilities.
5. **Post-Processing**:
   - Non-Maximum Suppression (NMS) filters overlapping boxes.
   - Confidence thresholding removes weak detections.
   - Coordinates are rescaled back to original image dimensions.
6. **Rendering**:
   - Mobile app receives JSON response.
   - `BoundingBoxOverlay` draws SVG rectangles over the image.
   - `DetectionResults` displays confidence scores and stats.

---

## Directory Structure

```
mate_vision/
├── app/                    # Backend Source
│   ├── api/                # Routes & Endpoints
│   ├── core/               # Config & Events
│   ├── schemas/            # Data Models
│   └── services/           # Inference Logic
├── models/                 # ONNX Model Files
├── mobile_app/             # React Native Client
│   ├── app/                # Screens (Expo Router)
│   ├── src/
│   │   ├── api/            # API Integration
│   │   ├── components/     # UI Components
│   │   ├── store/          # State Stores
│   │   └── config/         # App Config
│   └── assets/             # Images & Icons
└── docs/                   # Project Documentation
```
