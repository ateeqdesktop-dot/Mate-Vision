# Setup & Installation Guide

This guide covers how to set up the entire **Mate Vision** environment from scratch.

## Prerequisites

- **OS**: Linux, macOS, or Windows (WSL2 recommended)
- **Python**: 3.8+
- **Node.js**: 18+ (LTS)
- **Git**: Installed

---

## 1. Backend Setup (Python)

### Step 1: Clone & Navigate
```bash
git clone <repo-url>
cd mate_vision
```

### Step 2: Create Virtual Environment
```bash
# Create venv
python3 -m venv venv

# Activate venv
# Linux/macOS:
source venv/bin/activate
# Windows:
# .\venv\Scripts\activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Verify Models
Ensure ONNX models are present in the `models/` directory:
- `yolov8n_car_accident.onnx`
- `yolov8n_weapon.onnx`

### Step 5: Run Full Stack (Docker)
This will start both the Backend API and the Frontend Web App.

```bash
docker-compose up --build
```

- **Frontend**: Open `http://localhost`
- **Backend API**: Accessible at `http://localhost/api/v1`
- **Docs**: `http://localhost/docs`

---

## 2. Mobile App Setup (React Native)

### Step 1: Navigate to Folder
```bash
cd mobile_app
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
```

### Step 3: Configure Environment
Create a `.env` file in `mobile_app/`:
```bash
# Replace with your computer's local IP address
EXPO_PUBLIC_API_URL=http://192.168.1.X:8000
```
*Note: Do not use `localhost` if testing on a physical device.*

### Step 4: Start Development Server
```bash
npx expo start --clear
```

### Step 5: Run App
- **Web**: Press `w` in terminal (opens in browser).
- **Android**: Press `a` (requires Android Emulator or connected device).
- **iOS**: Press `i` (requires macOS + Simulator).
- **Physical Device**: Scan the QR code with **Expo Go** app.

---

## Troubleshooting

### "Network request failed" on Mobile
1. Ensure phone and computer are on the **same Wi-Fi**.
2. Check `EXPO_PUBLIC_API_URL` uses your computer's local IP (e.g., `192.168.1.5`), not `localhost`.
3. Check firewall settings allowing port 8000.

### "CRC Error" when building
This indicates corrupted assets. Run the fix script:
```bash
cd mobile_app/assets
node -e "const fs=require('fs'); const b=Buffer.from([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A,0,0,0,0x0D,0x49,0x48,0x44,0x52,0,0,0,1,0,0,0,1,8,6,0,0,0,0x1F,0x15,0xC4,0x89,0,0,0,0x0A,0x49,0x44,0x41,0x54,0x78,0x9C,0x63,0,1,0,0,5,0,1,0x0D,0x0A,0x2D,0xB4,0,0,0,0,0x49,0x45,0x4E,0x44,0xAE,0x42,0x60,0x82]); ['icon.png','adaptive-icon.png','favicon.png','splash-icon.png'].forEach(f=>fs.writeFileSync(f,b));"
```
