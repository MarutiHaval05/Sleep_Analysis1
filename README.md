# Sleep Monitoring & Diet Recommendation System

## Project Structure
- `frontend/`: React + Vite application
- `backend/`: Python Flask application

## Setup Instructions

### Backend
1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies (if not already done):
    ```bash
    pip install -r requirements.txt
    ```
3.  **ML Model**: Place your `model.pkl` file in `backend/model/`.
4.  **Firebase Configuration**: Firebase credentials are already configured in `firebase_config.py`
5.  Start the server:
    ```bash
    python app.py
    ```
    The server runs on `http://localhost:5000`.

### Frontend
1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The app runs on `http://localhost:5173`.

## Features
- **Sleep Analysis**: View heart rate and motion data.
- **Diet Recommendations**: Get personalized diet plans based on ML predictions.
- **User Profile**: Manage your account.
- **Real-time Sensor Data**: Fetch DHT11 sensor data from Firebase Realtime Database.

## Firebase Integration

### API Endpoints

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/api/sensor/latest` | GET | Get latest sensor reading | None |
| `/api/sensor/history` | GET | Get historical sensor data | `limit` (default: 100) |
| `/api/sensor/range` | GET | Get data within time range | `start`, `end` (timestamps) |
| `/api/firebase/test` | GET | Test Firebase connection | None |

### Usage Examples

**Get Latest Sensor Data:**
```bash
curl http://localhost:5000/api/sensor/latest
```

**Get Sensor History (last 50 readings):**
```bash
curl "http://localhost:5000/api/sensor/history?limit=50"
```

**Test Firebase Connection:**
```bash
curl http://localhost:5000/api/firebase/test
```

### Testing

Run the Firebase integration test suite:
```bash
cd backend
python test_firebase.py
```

