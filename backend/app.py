from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import sys

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from model_service import predict_disease
from firebase_service import FirebaseService

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "sleep-monitoring-backend"})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        result = predict_disease(data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Firebase Sensor Data Endpoints

@app.route('/api/sensor/latest', methods=['GET'])
def get_latest_sensor():
    """Get the latest sensor reading from Firebase and run prediction"""
    try:
        # 1. Fetch data from Firebase
        result = FirebaseService.get_latest_sensor_data()
        
        if result.get('success'):
            data = result.get('data', {})
            
            # 2. Extract features for prediction
            # Mapping: bvp -> Heart Rate (bpm), acc_x/y/z -> Gyro x/y/z, temp -> constant
            try:
                bpm = float(data.get('MAX30102', {}).get('bpm', 0))
                gyro = data.get('MPU6050', {}).get('gyro', {})
                acc_x = float(gyro.get('x', 0))
                acc_y = float(gyro.get('y', 0))
                acc_z = float(gyro.get('z', 0))
                
                # Extract temperature from DHT sensor (default to 36.5 if missing)
                temp = float(data.get('DHT', {}).get('temperature', 36.5))
                
                prediction_input = {
                    "bvp": bpm,
                    "acc_x": acc_x,
                    "acc_y": acc_y,
                    "acc_z": acc_z,
                    "temp": temp
                }
                
                # 3. Predict
                prediction_result = predict_disease(prediction_input)
                
                # 4. Attach prediction to result
                result['prediction'] = prediction_result
                
            except Exception as e:
                print(f"Prediction pre-processing error: {e}")
                result['prediction'] = {"error": "Failed to process data for prediction"}
            
            return jsonify(result), 200
        else:
            return jsonify(result), 404
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/sensor/history', methods=['GET'])
def get_sensor_history():
    """Get historical sensor data from Firebase"""
    try:
        limit = request.args.get('limit', default=100, type=int)
        result = FirebaseService.get_sensor_history(limit=limit)
        if result.get('success'):
            return jsonify(result), 200
        else:
            return jsonify(result), 404
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/sensor/range', methods=['GET'])
def get_sensor_range():
    """Get sensor data within a specific time range"""
    try:
        start_time = request.args.get('start')
        end_time = request.args.get('end')
        
        result = FirebaseService.get_sensor_data_by_range(start_time, end_time)
        if result.get('success'):
            return jsonify(result), 200
        else:
            return jsonify(result), 404
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/firebase/test', methods=['GET'])
def test_firebase_connection():
    """Test Firebase connection"""
    try:
        result = FirebaseService.test_connection()
        if result.get('success'):
            return jsonify(result), 200
        else:
            return jsonify(result), 500
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/diet-recommendation', methods=['POST'])
def diet_recommendation():
    try:
        data = request.json
        dosha = data.get('dosha', 'Unknown')
        disorder = data.get('disorder', 'Unknown')
        
        # Look up diet from matrix
        from diet_matrix import DIET_MATRIX, SLEEP_STATE_MAP
        
        # Normalize inputs
        dosha = dosha.capitalize() if dosha else "Vata"
        if dosha not in DIET_MATRIX:
            dosha = "Vata" # Fallback
            
        # Get sleep state index from disorder string
        # Default to 0 (Normal) if unknown
        sleep_state_index = SLEEP_STATE_MAP.get(disorder, 0)
        
        # Retrieve recommendation
        recommendation = DIET_MATRIX[dosha].get(sleep_state_index, DIET_MATRIX["Vata"][0])
        
        return jsonify({
            "condition": f"{disorder} ({dosha})",
            "foods_to_eat": recommendation["eat"],
            "foods_to_avoid": recommendation["avoid"],
            "recommendation_text": f"Based on your {dosha} Dosha and {disorder} pattern, we recommend these specific dietary adjustments."
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)

