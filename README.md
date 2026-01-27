# Mate Vision

**Mate Vision** is a cutting-edge hybrid AI application for real-time safety and security detection. It combines a high-performance **FastAPI** backend running YOLOv8 models with a sleek, user-friendly **React Native** mobile application.

![App Banner](https://placehold.co/600x200/DC7030/FFFFFF?text=Mate+Vision)

## 🚀 Key Features

*   **Car Accident Detection**: Identify vehicle accidents instantly.
*   **Weapon Detection**: Detect security threats like firearms.
*   **Real-time Analysis**: Optimized ONNX runtime for fast inference.
*   **Cross-Platform UI**: Beautiful Expo-based mobile app (Android/iOS/Web).
*   **History Tracking**: Keep track of recent detections locally.

---

## 📚 Documentation

We have detailed documentation available in the `docs/` directory:

| Document | Description |
|----------|-------------|
| **[Architecture](./docs/ARCHITECTURE.md)** | High-level system design, data flow, and tech stack overview. |
| **[Setup Guide](./docs/SETUP.md)** | Step-by-step instructions to install and run the project from scratch. |
| **[Mobile App](./docs/MOBILE.md)** | Details on differences, components, state management, and theming. |
| **[Backend API](./docs/BACKEND.md)** | API specification, endpoints, models, and services. |

---

## 🛠 Quick Start

### 1. Backend (Python)
```bash
cd mate_vision
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 2. Mobile App (React Native)
```bash
cd mobile_app
npm install
npx expo start
```

For full details, please refer to the **[Setup Guide](./docs/SETUP.md)**.

---

## 🏗 Project Structure

```
mate_vision/
├── app/                  # FastAPI Backend
├── mobile_app/           # React Native Client
├── models/               # ONNX Models
├── docs/                 # Documentation
└── ...
```

## 📄 License

This project is licensed under the MIT License.
