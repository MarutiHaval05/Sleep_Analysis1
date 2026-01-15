"""
Firebase Realtime Database Configuration
Contains API credentials and configuration for Firebase connection
"""

# Firebase API Configuration
API_KEY = "AIzaSyCjHlKY2uItSerxzFfO-P5h7Kj-RpGFD6k"
DATABASE_URL = "https://dht11-c3e82-default-rtdb.firebaseio.com"

# Firebase REST API endpoint
def get_firebase_url(path=""):
    """
    Construct Firebase REST API URL
    
    Args:
        path (str): Path to the data in Firebase (e.g., 'sensor_data')
    
    Returns:
        str: Complete Firebase REST API URL
    """
    if path:
        return f"{DATABASE_URL}/{path}.json"
    return f"{DATABASE_URL}/.json"
