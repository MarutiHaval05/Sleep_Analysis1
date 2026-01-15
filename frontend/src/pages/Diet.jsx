import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, AlertCircle, CheckCircle } from 'lucide-react';
import Navigation from '../components/Navigation';
import API_BASE_URL from '../config';

const Diet = () => {
    const [temperature, setTemperature] = React.useState(36.5);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [prediction, setPrediction] = React.useState(null);

    const generateRecommendation = async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Fetch latest sensor data
            const sensorResponse = await fetch(`${API_BASE_URL}/api/sensor/latest`);
            const sensorResult = await sensorResponse.json();

            let sensorData = {};
            if (sensorResult.success && sensorResult.data) {
                sensorData = sensorResult.data;
            }

            // 2. Prepare payload for prediction
            // Mapping: 
            // bvp -> ir (proxy)
            // acc_x, acc_y, acc_z -> accel.x, accel.y, accel.z
            // temp -> user input

            const payload = {
                bvp: sensorData.MAX30102?.ir || 0,
                acc_x: sensorData.MPU6050?.accel?.x || 0,
                acc_y: sensorData.MPU6050?.accel?.y || 0,
                acc_z: sensorData.MPU6050?.accel?.z || 0,
                temp: temperature,
                subject: "user" // Default subject
            };

            // 3. Call prediction API
            const predictResponse = await fetch(`${API_BASE_URL}/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await predictResponse.json();

            if (result.error) {
                throw new Error(result.error);
            }

            setPrediction(result);

        } catch (err) {
            console.error("Error generating recommendation:", err);
            setError("Failed to generate recommendation. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Navigation />
            <div className="p-6 md:p-12">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-12">
                        <h1 className="text-3xl font-bold mb-2">Diet Recommendations</h1>
                        <p className="text-slate-400">Personalized nutrition plan based on your sleep health.</p>
                    </header>

                    {/* Input Section */}
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-8">
                        <h3 className="text-xl font-semibold mb-4">Input Health Data</h3>
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1">
                                <label className="block text-slate-400 mb-2 text-sm">Body Temperature (°C)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={temperature}
                                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                />
                            </div>
                            <button
                                onClick={generateRecommendation}
                                disabled={loading}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? 'Analyzing...' : 'Generate Recommendation'}
                            </button>
                        </div>
                        {error && (
                            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Results Section */}
                    {prediction && (
                        <>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20 p-8 rounded-2xl mb-12"
                            >
                                <div className="flex items-start gap-4">
                                    <AlertCircle className="w-6 h-6 text-purple-400 mt-1" />
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Detected Pattern: {prediction.condition}</h3>
                                        <p className="text-slate-300">
                                            Based on your recent sleep analysis (using sensor data and temperature), we've adjusted your diet plan.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <h3 className="text-xl font-semibold flex items-center gap-2">
                                        <CheckCircle className="text-green-400" /> Recommended
                                    </h3>
                                    <div className="grid gap-4">
                                        {prediction.foods_to_eat?.map((food, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between"
                                            >
                                                <span>{food}</span>
                                                <Utensils className="w-4 h-4 text-slate-500" />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-xl font-semibold flex items-center gap-2">
                                        <AlertCircle className="text-red-400" /> Avoid
                                    </h3>
                                    <div className="grid gap-4">
                                        {prediction.foods_to_avoid?.map((food, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between opacity-75"
                                            >
                                                <span className="line-through text-slate-400">{food}</span>
                                                <Utensils className="w-4 h-4 text-slate-500" />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Diet;
