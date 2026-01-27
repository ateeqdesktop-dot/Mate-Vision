# Mobile Application Documentation

## Overview

The Mate Vision mobile app is built using **React Native** and **Expo**. It serves as the client interface for capturing images and displaying detection results from the backend.

## Tech Stack

- **Core**: React Native 0.76, Expo 52
- **Language**: TypeScript 5.3
- **Routing**: Expo Router 4.0
- **State**: Zustand 5.0
- **Storage**: AsyncStorage / localStorage (Web)
- **HTTP**: Fetch API with custom wrapper

---

## Features

### 1. Object Detection
- **Car Accident Detection**: Upload or capture images of vehicle accidents.
- **Weapon Detection**: Identify firearms and weapons in images.
- **Real-time Visualization**: Bounding boxes are drawn accurately over the original image.

### 2. Theme System 🎨
The app features a "Warm Peach" theme designed for visual comfort.
- **Colors**:
  - Primary: `#DC7030` (Earth Orange)
  - Secondary: `#02656B` (Deep Teal)
  - Background: `#ECB99E` (Peach)
- **Implementation**:
  - `src/config/themes.ts`: Central color definitions.
  - `src/store/themeStore.ts`: Zustand store providing colors to components.
  - Components subscribe to theme via `useTheme()` hook.

### 3. History Tracking
- Automatically saves the last 50 detection results locally.
- Persists across app restarts using `zustand/middleware/persist`.

### 4. Cross-Platform
- **Android**: Fully supported native experience.
- **iOS**: Optimized for iOS design guidelines.
- **Web**: Responsive layout with browser compatibility fixes.

---

## Project Structure

### Screens (`/app`)
- `(tabs)/index.tsx`: Home dashboard with server status and history.
- `(tabs)/car-accident.tsx`: Interface for accident detection.
- `(tabs)/weapon.tsx`: Interface for weapon detection.
- `(tabs)/_layout.tsx`: Tab navigation configuration.

### Components (`/src/components`)
- **Core**:
  - `ui/Button.tsx`: Custom styled buttons with variants.
  - `ui/Card.tsx`: Container with shadow and border styling.
  - `ui/LoadingSpinner.tsx`: Animated loading state.
- **Feature**:
  - `ImagePicker.tsx`: Handles camera/gallery permissions and selection.
  - `DetectionResults.tsx`: Displays list of detected objects.
  - `BoundingBoxOverlay.tsx`: Draws SVG boxes over image.

### State Management (`/src/store`)
- `detectionStore.ts`:
  - Actions: `setCurrentImage`, `detect`, `setServerConnected`.
  - State: `isLoading`, `result`, `history`, `error`.
- `themeStore.ts`:
  - Provides constant theme object.

### API Layer (`/src/api`)
- `client.ts`: Generic HTTP client with error handling.
- `endpoints.ts`: Specific API methods (`predictCarAccident`, `checkHealth`).
- `types.ts`: TypeScript interfaces mirroring backend Pydantic models.

---

## Development Guide

### Adding a New Screen
1. Create file in `app/(tabs)/new-screen.tsx`.
2. Add icon in `app/(tabs)/_layout.tsx`.
3. Use `useTheme()` for styling.

### Modifying Theme
Edit `src/config/themes.ts` and update the `defaultTheme` object. All components will automatically reflect changes.

### Adding New Detection Type
1. Update `backend` to support new model.
2. Add type to `src/api/types.ts`.
3. Add endpoint method in `src/api/endpoints.ts`.
4. Create new screen or update generic handler.
