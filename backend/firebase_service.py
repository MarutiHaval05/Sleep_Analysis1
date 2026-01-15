"""
Firebase Service Module
Handles all Firebase Realtime Database operations for sensor data retrieval
"""

import requests
from datetime import datetime, timedelta
from firebase_config import get_firebase_url, API_KEY

class FirebaseService:
    """Service class for Firebase Realtime Database operations"""
    
    @staticmethod
    def get_latest_sensor_data():
        """
        Fetch the latest sensor reading from Firebase
        
        Returns:
            dict: Latest sensor data or error message
        """
        try:
            # Changed to 'sensorData' as it appears to be at the root level
            url = get_firebase_url("sensorData")
            response = requests.get(url, params={"auth": API_KEY})
            
            if response.status_code == 200:
                data = response.json()
                
                if not data:
                    return {
                        "success": False,
                        "message": "No sensor data available in Firebase"
                    }
                
                # Return the data directly
                return {
                    "success": True,
                    "data": data,
                    "timestamp": datetime.now().isoformat()
                }
            else:
                return {
                    "success": False,
                    "message": f"Firebase request failed with status {response.status_code}",
                    "error": response.text
                }
                
        except Exception as e:
            return {
                "success": False,
                "message": "Error fetching data from Firebase",
                "error": str(e)
            }
    
    @staticmethod
    def get_sensor_history(limit=100):
        """
        Fetch historical sensor data from Firebase
        
        Args:
            limit (int): Maximum number of records to fetch
        
        Returns:
            dict: Historical sensor data or error message
        """
        try:
            url = get_firebase_url("sensor_data")
            params = {
                "auth": API_KEY,
                "orderBy": '"$key"',
                "limitToLast": limit
            }
            
            response = requests.get(url, params=params)
            
            if response.status_code == 200:
                data = response.json()
                
                if not data:
                    return {
                        "success": False,
                        "message": "No historical data available"
                    }
                
                # Convert to list format for easier consumption
                history = []
                if isinstance(data, dict):
                    for timestamp, values in data.items():
                        entry = values.copy() if isinstance(values, dict) else {"value": values}
                        entry["timestamp"] = timestamp
                        history.append(entry)
                
                return {
                    "success": True,
                    "count": len(history),
                    "data": history
                }
            else:
                return {
                    "success": False,
                    "message": f"Firebase request failed with status {response.status_code}",
                    "error": response.text
                }
                
        except Exception as e:
            return {
                "success": False,
                "message": "Error fetching historical data from Firebase",
                "error": str(e)
            }
    
    @staticmethod
    def get_sensor_data_by_range(start_time=None, end_time=None):
        """
        Fetch sensor data within a specific time range
        
        Args:
            start_time (str): Start timestamp (ISO format or Firebase key)
            end_time (str): End timestamp (ISO format or Firebase key)
        
        Returns:
            dict: Sensor data within the specified range or error message
        """
        try:
            url = get_firebase_url("sensor_data")
            params = {"auth": API_KEY, "orderBy": '"$key"'}
            
            if start_time:
                params["startAt"] = f'"{start_time}"'
            if end_time:
                params["endAt"] = f'"{end_time}"'
            
            response = requests.get(url, params=params)
            
            if response.status_code == 200:
                data = response.json()
                
                if not data:
                    return {
                        "success": False,
                        "message": "No data available in the specified range"
                    }
                
                # Convert to list format
                range_data = []
                if isinstance(data, dict):
                    for timestamp, values in data.items():
                        entry = values.copy() if isinstance(values, dict) else {"value": values}
                        entry["timestamp"] = timestamp
                        range_data.append(entry)
                
                return {
                    "success": True,
                    "count": len(range_data),
                    "data": range_data,
                    "range": {
                        "start": start_time,
                        "end": end_time
                    }
                }
            else:
                return {
                    "success": False,
                    "message": f"Firebase request failed with status {response.status_code}",
                    "error": response.text
                }
                
        except Exception as e:
            return {
                "success": False,
                "message": "Error fetching range data from Firebase",
                "error": str(e)
            }
    
    @staticmethod
    def test_connection():
        """
        Test Firebase connection
        
        Returns:
            dict: Connection test result
        """
        try:
            url = get_firebase_url()
            response = requests.get(url, params={"auth": API_KEY, "shallow": "true"})
            
            if response.status_code == 200:
                return {
                    "success": True,
                    "message": "Firebase connection successful",
                    "database_url": url.replace(".json", "")
                }
            else:
                return {
                    "success": False,
                    "message": f"Connection failed with status {response.status_code}",
                    "error": response.text
                }
                
        except Exception as e:
            return {
                "success": False,
                "message": "Connection test failed",
                "error": str(e)
            }
