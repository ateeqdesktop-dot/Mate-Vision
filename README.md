# Mate Vision Flutter App

A beautiful, modern Flutter application for AI-powered car accident and weapon detection.

## Features

- 🎨 **Modern UI Design** - Glassmorphism, gradients, and smooth animations
- 📱 **Cross-Platform** - Works on Android, iOS, and Web
- 🏗️ **Clean Architecture** - Maintainable and scalable codebase
- 🔄 **BLoC Pattern** - Predictable state management
- 🐳 **Docker Ready** - Easy deployment with Docker

## Architecture

The app follows Clean Architecture principles with three main layers:

```
lib/
├── core/           # Configuration, theme, constants, exceptions
├── data/           # API client, models, repository implementations
├── domain/         # Entities, repository interfaces, use cases
├── presentation/   # BLoC, screens, widgets
└── main.dart       # Entry point
```

## Getting Started

### Prerequisites

- Flutter SDK 3.9+
- Dart SDK 3.9+

### Installation

1. Install dependencies:
```bash
flutter pub get
```

2. Run the app:
```bash
# For web
flutter run -d chrome

# For Android
flutter run -d android

# For iOS
flutter run -d ios
```

### Configuration

Set the API base URL using environment variable:

```bash
flutter run --dart-define=API_BASE_URL=http://your-api-server:8000
```

## Docker Deployment

### Build and run with Docker:

```bash
# Build the image
docker build -t mate-vision-app .

# Run the container
docker run -p 3000:80 mate-vision-app
```

### Using Docker Compose:

```bash
# With custom API URL
API_BASE_URL=http://your-api-server:8000 docker-compose up --build

# Default (localhost:8000)
docker-compose up --build
```

The app will be available at http://localhost:3000

## API Endpoints

The app connects to the following API endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/predict/car-accident` | POST | Detect car accidents |
| `/api/v1/predict/weapon` | POST | Detect weapons |
| `/api/v1/models` | GET | List available models |
| `/health` | GET | Health check |

## Project Structure

```
flutter_app/
├── lib/
│   ├── core/
│   │   ├── config.dart         # App configuration
│   │   ├── constants.dart      # App constants
│   │   ├── exceptions.dart     # Custom exceptions
│   │   └── theme.dart          # App theme
│   ├── data/
│   │   ├── datasources/
│   │   │   └── api_client.dart # HTTP client
│   │   ├── models/
│   │   │   └── prediction_model.dart # DTOs
│   │   └── repositories/
│   │       └── prediction_repository_impl.dart
│   ├── domain/
│   │   ├── entities/
│   │   │   └── detection_entity.dart # Domain entities
│   │   ├── repositories/
│   │   │   └── prediction_repository.dart # Interface
│   │   └── usecases/
│   │       ├── detect_car_accident_usecase.dart
│   │       └── detect_weapon_usecase.dart
│   ├── presentation/
│   │   ├── bloc/
│   │   │   ├── detection_bloc.dart
│   │   │   ├── detection_event.dart
│   │   │   └── detection_state.dart
│   │   ├── screens/
│   │   │   ├── home_screen.dart
│   │   │   └── detection_screen.dart
│   │   └── widgets/
│   │       ├── glass_card.dart
│   │       ├── gradient_button.dart
│   │       ├── detection_overlay.dart
│   │       └── loading_indicator.dart
│   ├── injection.dart          # Dependency injection
│   └── main.dart               # Entry point
├── assets/
│   └── images/
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
└── pubspec.yaml
```

## Dependencies

- `flutter_bloc` - State management
- `get_it` - Dependency injection
- `http` - HTTP client
- `image_picker` - Image selection
- `flutter_animate` - Animations
- `equatable` - Value equality

## License

This project is part of the Mate Vision AI Detection System.
