import os
import joblib
import numpy as np

# Path to the model file
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model', 'sleep_disorder_rf_tuned_no_subject.pkl')

model = None

def load_model():
    global model
    print(f"[ModelService] Checking model path: {MODEL_PATH}")
    if os.path.exists(MODEL_PATH):
        try:
            print(f"[ModelService] Attempting to load model from {MODEL_PATH}...")
            model = joblib.load(MODEL_PATH)
            print(f"[ModelService] SUCCESS: Model loaded from {MODEL_PATH}")
            return True
        except Exception as e:
            print(f"[ModelService] ERROR: Failed to load model: {e}")
            import traceback
            traceback.print_exc()
            return False
    else:
        print(f"[ModelService] ERROR: Model file NOT FOUND at {MODEL_PATH}")
        print(f"[ModelService] Current working directory: {os.getcwd()}")
        print(f"[ModelService] Directory contents of {os.path.dirname(MODEL_PATH)}:")
        try:
            print(os.listdir(os.path.dirname(MODEL_PATH)))
        except Exception as e:
            print(f"Could not list directory: {e}")
        return False

# Load model on startup
load_model()

import pandas as pd

# Diet recommendations based on conditions
# Mapping of model classes (0-4) to conditions
# TODO: Verify this mapping with the user/dataset source
CLASS_MAPPING = {
    0: "Normal sleep",
    1: "Disturbed sleep",
    2: "Insomnia-like sleep",
    3: "Apnea-like pattern",
    4: "Awake" 
}

DIET_RECOMMENDATIONS = {
    "Normal sleep": {
        "recommendations": [
            "Maintain a balanced diet",
            "Stay hydrated",
            "Regular exercise",
            "Limit screen time before bed"
        ],
        "foods_to_eat": ["Balanced Mix of Carbs/Protein", "Fresh Fruits", "Nuts", "Yogurt"],
        "foods_to_avoid": ["Excessive Sugar", "Heavy Late-Night Snacks", "Caffeine late in the day"]
    },
    "Disturbed sleep": {
        "recommendations": [
            "Establish a calming bedtime routine",
            "Avoid stimulants in the evening",
            "Manage stress through relaxation techniques",
            "Ensure a comfortable sleep environment"
        ],
        "foods_to_eat": ["Chamomile Tea", "Almonds", "Warm Milk", "Bananas"],
        "foods_to_avoid": ["Spicy Foods", "Alcohol", "Caffeine", "Heavy Meals"]
    },
    "Insomnia-like sleep": {
        "recommendations": [
            "Avoid caffeine after 2 PM",
            "Drink warm milk before bed",
            "Limit alcohol consumption",
            "Maintain a consistent sleep schedule"
        ],
        "foods_to_eat": ["Kiwi", "Walnuts", "Tart Cherry Juice", "Fatty Fish"],
        "foods_to_avoid": ["Coffee", "Spicy Foods", "Aged Cheese", "Chocolate"]
    },
    "Apnea-like pattern": {
        "recommendations": [
            "Maintain a healthy weight",
            "Avoid heavy meals before bed",
            "Limit alcohol and sedatives",
            "Sleep on your side"
        ],
        "foods_to_eat": ["Vegetables", "Fruits", "Whole Grains", "Lean Proteins"],
        "foods_to_avoid": ["High-Fat Dairy", "Processed Meats", "Sugary Drinks", "Fried Foods"]
    },
    "Awake": {
         "recommendations": [
            "Engage in relaxing activities if unable to sleep",
            "Avoid checking the clock",
            "Keep the room dark and cool",
            "Only go to bed when tired"
        ],
        "foods_to_eat": ["Magnesium-rich foods", "Herbal Teas", "Light Snacks", "Turkey"],
        "foods_to_avoid": ["Caffeine", "Sugar", "Alcohol", "Large Meals"]
    }
}

def predict_disease(data):
    """
    Predict disease based on input data.
    Expected data format: { "bvp": float, "acc_x": float, "acc_y": float, "acc_z": float, "temp": float, "subject": str }
    """
    global model
    
    if not model:
        print("[ModelService] WARN: Model object is None. Attempting lazy reload...")
        success = load_model()
        if not success:
            return {"error": "Model not loaded - reload failed. Check server logs."}

    try:
        # Prepare input dataframe matching the model's training columns
        # Columns: ["bvp", "acc_x", "acc_y", "acc_z", "temp", "subject"]
        input_data = {
            "bvp": [float(data.get('bvp', 0))],
            "acc_x": [float(data.get('acc_x', 0))],
            "acc_y": [float(data.get('acc_y', 0))],
            "acc_z": [float(data.get('acc_z', 0))],
            "temp": [float(data.get('temp', 36.5))] # Default body temp
        }
        
        df = pd.DataFrame(input_data)
        
        # Predict
        prediction = model.predict(df)[0]
        
        # Convert numpy types to native python types for JSON serialization
        if hasattr(prediction, 'item'):
            prediction = prediction.item()
            
        # Map prediction to recommendations
        # The model returns an integer class (0-4)
        
        condition = CLASS_MAPPING.get(prediction, "Unknown Condition")
        result = DIET_RECOMMENDATIONS.get(condition, DIET_RECOMMENDATIONS["Normal sleep"])
        
        result["condition"] = condition
        result["source"] = "ml_model"
        result["raw_prediction"] = prediction
        
        return result

    except Exception as e:
        print(f"Prediction error: {e}")
        return {"error": f"Prediction failed: {str(e)}"}
