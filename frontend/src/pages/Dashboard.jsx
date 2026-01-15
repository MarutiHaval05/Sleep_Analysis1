import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Moon, Clock, Wifi, AlertCircle } from 'lucide-react';
import Navigation from '../components/Navigation';
import API_BASE_URL from '../config';

// Mock data for demonstration
const mockData = [
    { time: '22:00', heartRate: 72, motion: 10 },
    { time: '23:00', heartRate: 65, motion: 5 },
    { time: '00:00', heartRate: 58, motion: 2 },
    { time: '01:00', heartRate: 55, motion: 0 },
    { time: '02:00', heartRate: 54, motion: 1 },
    { time: '03:00', heartRate: 56, motion: 3 },
    { time: '04:00', heartRate: 53, motion: 0 },
    { time: '05:00', heartRate: 60, motion: 8 },
    { time: '06:00', heartRate: 68, motion: 15 },
];

const Dashboard = () => {
    const [hasData, setHasData] = useState(false);
    const [sensorData, setSensorData] = useState(null);

    useEffect(() => {
        // Check if user has real sensor data from Firebase
        fetchSensorData();

        // Poll for new data every 5 seconds
        const interval = setInterval(fetchSensorData, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchSensorData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/sensor/latest`);
            const result = await response.json();

            if (result.success && result.data) {
                setHasData(true);
                setSensorData(result.data);
            } else {
                setHasData(false);
            }
        } catch (error) {
            console.error('Error fetching sensor data:', error);
            setHasData(false);
        }
    };

    // Show welcome message for new users without data
    if (!hasData) {
        return (
            <div className="min-h-screen bg-slate-950 text-white">
                <Navigation />
                <div className="p-6 md:p-12">
                    <div className="max-w-4xl mx-auto">
                        <header className="mb-12">
                            <h1 className="text-3xl font-bold mb-2">Sleep Analysis</h1>
                            <p className="text-slate-400">Welcome! Connect your hardware device to start monitoring.</p>
                        </header>

                        {/* Welcome Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-2xl p-8 mb-8"
                        >
                            <div className="flex items-start gap-4 mb-6">
                                <div className="p-3 bg-purple-500/20 rounded-full">
                                    <Wifi className="w-8 h-8 text-purple-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">No Data Yet</h2>
                                    <p className="text-slate-300">
                                        You haven't connected your hardware device yet. Your sleep data will appear here once you sync your device.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-slate-900/50 rounded-xl p-6 space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-blue-400" />
                                    How to Connect Your Device
                                </h3>
                                <ol className="space-y-3 text-slate-300">
                                    <li className="flex gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 text-sm font-bold">1</span>
                                        <span>Power on your sleep monitoring hardware device</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 text-sm font-bold">2</span>
                                        <span>Ensure the device is connected to WiFi and syncing to Firebase</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 text-sm font-bold">3</span>
                                        <span>Wear the device during sleep to collect heart rate and motion data</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 text-sm font-bold">4</span>
                                        <span>Data will automatically appear in your dashboard after the first sync</span>
                                    </li>
                                </ol>
                            </div>
                        </motion.div>

                        {/* Preview Card */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-xl font-semibold mb-4">What You'll See</h3>
                            <p className="text-slate-400 mb-4">
                                Once your device is connected, you'll see real-time data including:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-slate-900/50 rounded-lg p-4">
                                    <Moon className="w-6 h-6 text-purple-400 mb-2" />
                                    <p className="text-sm font-medium">Sleep Duration</p>
                                    <p className="text-xs text-slate-400">Total hours slept</p>
                                </div>
                                <div className="bg-slate-900/50 rounded-lg p-4">
                                    <Activity className="w-6 h-6 text-blue-400 mb-2" />
                                    <p className="text-sm font-medium">Heart Rate</p>
                                    <p className="text-xs text-slate-400">Average BPM during sleep</p>
                                </div>
                                <div className="bg-slate-900/50 rounded-lg p-4">
                                    <Clock className="w-6 h-6 text-green-400 mb-2" />
                                    <p className="text-sm font-medium">Sleep Quality</p>
                                    <p className="text-xs text-slate-400">Deep sleep analysis</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show actual data when available
    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Navigation />
            <div className="p-6 md:p-12">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-12">
                        <h1 className="text-3xl font-bold mb-2">Sleep Analysis</h1>
                        <p className="text-slate-400">Overview of your last night's sleep quality.</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <StatCard
                            icon={<Moon className="text-purple-400" />}
                            label="Accel X"
                            value={sensorData?.MPU6050?.accel?.x || "0"}
                            subtext="Motion Sensor"
                        />
                        <StatCard
                            icon={<Activity className="text-blue-400" />}
                            label="Heart Rate"
                            value={`${sensorData?.MAX30102?.bpm || 0} BPM`}
                            subtext="Real-time"
                        />
                        <StatCard
                            icon={<Clock className="text-green-400" />}
                            label="IR Value"
                            value={sensorData?.MAX30102?.ir || "0"}
                            subtext="Raw Sensor"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <ChartCard title="Heart Rate Trend">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={mockData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="time" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Line type="monotone" dataKey="heartRate" stroke="#60a5fa" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartCard>

                        <ChartCard title="Motion Activity">
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={mockData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="time" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="motion" stroke="#c084fc" fill="#c084fc" fillOpacity={0.2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, subtext }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm"
    >
        <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/5 rounded-full">{icon}</div>
            <span className="text-slate-400 text-sm">{subtext}</span>
        </div>
        <h3 className="text-3xl font-bold mb-1">{value}</h3>
        <p className="text-slate-400">{label}</p>
    </motion.div>
);

const ChartCard = ({ title, children }) => (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
        <h3 className="text-xl font-semibold mb-6">{title}</h3>
        {children}
    </div>
);

export default Dashboard;
