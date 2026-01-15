import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration for dht11-c3e82 project
const firebaseConfig = {
    apiKey: "AIzaSyCjHlKY2uItSerxzFfO-P5h7Kj-RpGFD6k",
    authDomain: "dht11-c3e82.firebaseapp.com",
    databaseURL: "https://dht11-c3e82-default-rtdb.firebaseio.com",
    projectId: "dht11-c3e82",
    storageBucket: "dht11-c3e82.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
