import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { Heart, Zap, Activity } from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';
import API_BASE_URL from '../config';

const Dashboard = () => {
    const [hasData, setHasData] = useState(false);
    const [sensorData, setSensorData] = useState(null);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        fetchSensorData();
        const interval = setInterval(fetchSensorData, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchSensorData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/sensor/latest`);
            const result = await response.json();

            if (result.success && result.data) {
                setHasData(true);
                setSensorData({ ...result.data, prediction: result.prediction });

                if (result.prediction?.condition) {
                    localStorage.setItem('sleepDisorder', result.prediction.condition);
                }

                const now = new Date();
                const timeStr = now.toLocaleTimeString('en-US', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });

                setChartData(prev => {
                    const newPoint = {
                        time: timeStr,
                        heartRate: parseFloat(result.data.MAX30102?.bpm || 0),
                        gyroX: parseFloat(result.data.MPU6050?.gyro?.x || 0),
                        gyroY: parseFloat(result.data.MPU6050?.gyro?.y || 0),
                        gyroZ: parseFloat(result.data.MPU6050?.gyro?.z || 0)
                    };

                    const updated = [...prev, newPoint];
                    return updated.length > 20 ? updated.slice(-20) : updated;
                });
            } else {
                setHasData(false);
            }
        } catch (error) {
            console.error('Sensor fetch error:', error);
            setHasData(false);
        }
    };

    const Card = ({ children }) => (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_8px_24px_rgba(15,23,42,0.06)] p-6">
            {children}
        </div>
    );

    const MetricValue = ({ label, value, unit, icon: Icon }) => (
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm text-[#475569]">{label}</p>
                <div className="flex items-baseline gap-1">
                    <h3 className="text-3xl font-bold text-[#0F172A]">{value}</h3>
                    {unit && <span className="text-sm text-[#94A3B8]">{unit}</span>}
                </div>
            </div>
            {Icon && (
                <div className="p-2 bg-[#F8FAFC] rounded-lg border">
                    <Icon className="w-5 h-5 text-[#2563EB]" />
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans pb-12">
            <Navigation />

            {/* LOADING / NO DATA */}
            {!hasData && (
                <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                    <div className="bg-white p-8 rounded-2xl shadow border text-center space-y-4">
                        <div className="animate-spin h-10 w-10 border-b-2 border-[#2563EB] rounded-full mx-auto" />
                        <h3 className="text-lg font-semibold">Connecting to Device</h3>
                        <p className="text-[#64748B]">Waiting for sensor data…</p>
                    </div>
                </div>
            )}

            {/* DASHBOARD */}
            {hasData && (
                <div className="px-6 max-w-7xl mx-auto space-y-6">
                    {/* METRICS */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card>
                            <MetricValue
                                label="Heart Rate"
                                value={sensorData?.MAX30102?.bpm || 0}
                                unit="BPM"
                                icon={Heart}
                            />
                        </Card>

                        <Card>
                            <MetricValue
                                label="Temperature"
                                value={sensorData?.DHT?.temperature || 0}
                                unit="°C"
                                icon={Zap}
                            />
                        </Card>

                        <Card>
                            <MetricValue
                                label="Gyro X"
                                value={sensorData?.MPU6050?.gyro?.x || 0}
                                icon={Activity}
                            />
                        </Card>
                    </div>

                    {/* CHARTS */}
                    <div className="grid lg:grid-cols-2 gap-6">
                        <Card>
                            <h4 className="mb-4 text-sm font-medium text-[#475569]">
                                Heart Rate History
                            </h4>
                            <div className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="time" />
                                        <YAxis />
                                        <Tooltip />
                                        <Area
                                            dataKey="heartRate"
                                            stroke="#F87171"
                                            fill="#FCA5A5"
                                            isAnimationActive={false}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <Card>
                            <h4 className="mb-4 text-sm font-medium text-[#475569]">
                                Motion Sensor
                            </h4>
                            <div className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="time" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line dataKey="gyroX" stroke="#F59E0B" dot={false} />
                                        <Line dataKey="gyroY" stroke="#8B5CF6" dot={false} />
                                        <Line dataKey="gyroZ" stroke="#06B6D4" dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>

                    {/* SLEEP ANALYSIS */}
                    <Card>
                        <h3 className="text-lg font-bold mb-4">Real-time Sleep Analysis</h3>
                        <p className="text-3xl font-bold">
                            {sensorData?.prediction?.condition || 'Analyzing…'}
                        </p>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Dashboard;