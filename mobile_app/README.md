# Mate Vision Mobile App

A React Native (Expo) mobile application for AI-powered car accident and weapon detection.

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based)
- **State Management**: Zustand
- **Styling**: React Native StyleSheet
- **Camera/Gallery**: expo-image-picker, expo-camera

## Project Structure

```
mobile_app/
├── app/                    # Expo Router pages
│   ├── (tabs)/             # Tab navigation
│   │   ├── index.tsx       # Home screen
│   │   ├── car-accident.tsx
│   │   └── weapon.tsx
│   └── results.tsx         # Results modal
├── src/
│   ├── api/                # API client & types
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── store/              # Zustand state store
│   ├── config/             # Environment config
│   └── utils/              # Utility functions
└── assets/                 # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
cd mobile_app
npm install
```

### Running the App

```bash
# Start Expo development server
npm start

# Or directly on platform
npm run android
npm run ios
npm run web
```

### Configuration

Set the API server URL in environment:

```bash
# Create .env file
echo "EXPO_PUBLIC_API_URL=http://192.168.1.X:8000" > .env
```

For local development, use your machine's IP address (not localhost) when testing on physical devices.

## Features

- 📷 **Image Selection**: Pick from gallery or capture with camera
- 🚗 **Car Accident Detection**: Detect car accidents in images
- 🔫 **Weapon Detection**: Detect weapons for security
- 📊 **Results Display**: View detection results with confidence scores
- 🎯 **Bounding Boxes**: Visual overlay showing detected objects
- 📜 **Detection History**: Track recent detection results
- 🔌 **Server Status**: Real-time server connection indicator

## API Integration

The app connects to the FastAPI backend endpoints:

| Endpoint | Description |
|----------|-------------|
| `POST /api/v1/predict/car-accident` | Car accident detection |
| `POST /api/v1/predict/weapon` | Weapon detection |
| `GET /api/v1/models` | List available models |
| `GET /health` | Server health check |

## Architecture

- **Feature-based folder structure** for scalability
- **Type-safe API layer** matching FastAPI schemas
- **Custom hooks** for detection and camera logic
- **Zustand store** for global state management
- **Reusable UI components** with consistent styling
