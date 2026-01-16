import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { Utensils, Sparkles, CheckCircle, Ban } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../config';

const Diet = () => {
    const [dosha, setDosha] = useState('Unknown');
    const [disorder, setDisorder] = useState('Unknown');
    const [temperature, setTemperature] = useState(0);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const storedDosha = localStorage.getItem('ayurvedaDosha');
        const storedDisorder = localStorage.getItem('sleepDisorder');
        if (storedDosha) setDosha(storedDosha);
        if (storedDisorder) setDisorder(storedDisorder);

        const fetchSensorData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/sensor/latest`);
                const result = await response.json();
                if (result.success && result.data) {
                    setTemperature(
                        parseFloat(result.data.DHT?.temperature || 0).toFixed(1)
                    );
                }
            } catch (e) {
                console.error('Failed to fetch sensor data', e);
            }
        };

        fetchSensorData();
    }, []);

    const generateRecommendation = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_BASE_URL}/api/diet-recommendation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dosha, disorder }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch recommendations');
            }

            const result = await response.json();
            setPrediction(result);
        } catch (err) {
            console.error(err);
            setError('Failed to generate recommendation. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans pb-12">
            <Navigation />
            <div className="max-w-7xl mx-auto px-6 pt-8">
                <button onClick={generateRecommendation}>Generate</button>

                <AnimatePresence>
                    {prediction && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <p>{prediction.recommendation_text}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Diet;
