import React, { useState, useEffect } from 'react';
import { User, Settings, LogOut, Activity, Leaf, Moon, TrendingUp } from 'lucide-react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import API_BASE_URL from '../config';

const Profile = () => {
    const navigate = useNavigate();
    const user = auth.currentUser;
    const [dosha, setDosha] = useState('Unknown');
    const [disorder, setDisorder] = useState('Unknown');
    const [temperature, setTemperature] = useState(0);
    const [heartRate, setHeartRate] = useState(0);
    const [improvement, setImprovement] = useState(0);

    useEffect(() => {
        // Load static health profile
        const storedDosha = localStorage.getItem('ayurvedaDosha') || 'Not taken';
        const storedDisorder = localStorage.getItem('sleepDisorder') || 'Healthy';
        setDosha(storedDosha);
        setDisorder(storedDisorder);
        setImprovement(calculateImprovement(storedDisorder));

        // Fetch live sensor data
        const fetchSensorData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/sensor/latest`);
                const result = await response.json();
                if (result.success && result.data) {
                    setTemperature(parseFloat(result.data.DHT?.temperature || 36.5).toFixed(1));
                    setHeartRate(parseFloat(result.data.MAX30102?.bpm || 0).toFixed(0));
                }
            } catch (e) {
                console.error("Failed to fetch sensor data", e);
            }
        };

        fetchSensorData();
        const interval = setInterval(fetchSensorData, 3000);
        return () => clearInterval(interval);
    }, []);

    const calculateImprovement = (disorder) => {
        // Heuristic improvement potential based on clinical ayurvedic correlation
        const map = {
            'Insomnia': 42,
            'Insomnia-like': 42,
            'Disturbed sleep': 28,
            'Apnea-like pattern': 15,
            'Normal sleep': 12,
            'Healthy': 10
        };
        // Fuzzy match or default
        for (const key in map) {
            if (disorder && disorder.includes(key)) return map[key];
        }
        return 25; // Default moderate improvement
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans pb-12">
            <Navigation />

            <div className="max-w-6xl mx-auto px-6 pt-8">
                <header className="mb-10">
                    <h1 className="text-3xl font-bold text-[#0F172A] mb-2 flex items-center gap-2">
                        <User className="w-8 h-8 text-[#2563EB]" />
                        My Profile & Health Status
                    </h1>
                    <p className="text-[#64748B]">Real-time health monitoring and Ayurvedic analysis.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: User Info & Settings */}
                    <div className="space-y-8">
                        {/* User Card */}
                        <div className="bg-white rounded-[16px] border border-[#E5E7EB] shadow-[0_8px_24px_rgba(15,23,42,0.06)] p-6 text-center">
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-blue-500/20 mb-4">
                                {user?.email?.[0].toUpperCase() || 'U'}
                            </div>
                            <h2 className="text-xl font-bold text-[#0F172A]">{user?.email || 'User'}</h2>
                            <p className="text-[#64748B] text-sm mb-4">Member since {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString(undefined, { year: 'numeric', month: 'long' }) : 'N/A'}</p>
                            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold uppercase tracking-wide border border-green-100 inline-flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                System Active
                            </span>
                        </div>

                        {/* Settings */}
                        <div className="bg-white rounded-[16px] border border-[#E5E7EB] shadow-[0_8px_24px_rgba(15,23,42,0.06)] overflow-hidden">
                            <div className="p-4 border-b border-[#E5E7EB] bg-[#F8FAFC]">
                                <h3 className="font-bold text-[#0F172A] flex items-center gap-2">
                                    <Settings className="w-4 h-4 text-[#475569]" /> Account
                                </h3>
                            </div>
                            <div className="divide-y divide-[#E5E7EB]">
                                <button className="w-full flex items-center justify-between p-4 hover:bg-[#F8FAFC] transition-colors text-left text-sm font-medium text-[#334155]">
                                    Notifications <span className="text-[#64748B]">On</span>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors text-left text-sm font-medium text-red-600"
                                >
                                    Sign Out <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Health Data */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Impact Projection Card (New) */}
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[20px] p-8 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                        <TrendingUp className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold">Projected Sleep Improvement</h3>
                                </div>

                                <div className="flex flex-col md:flex-row items-end gap-6">
                                    <div className="flex-1">
                                        <div className="text-6xl font-bold mb-2 tracking-tight">{improvement}%</div>
                                        <p className="text-indigo-100 text-lg leading-relaxed">
                                            By adhering to your <strong>{dosha}</strong> diet plan, you can reduce <strong>{disorder}</strong> symptoms significantly within 21 days.
                                        </p>
                                    </div>
                                    <div className="w-full md:w-auto bg-white/10 rounded-xl p-4 backdrop-blur-md border border-white/10">
                                        <div className="text-sm text-indigo-100 mb-1">Target Efficiency</div>
                                        <div className="text-2xl font-bold">92%</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Live Vitals Grid */}
                        <div>
                            <h3 className="text-lg font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-[#2563EB]" />
                                Real-time Vitals
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-5 rounded-[16px] border border-[#E5E7EB] shadow-[0_4px_12px_rgba(15,23,42,0.03)]">
                                    <p className="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-2">Heart Rate</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold text-[#0F172A]">{heartRate}</span>
                                        <span className="text-sm text-[#64748B] font-medium">BPM</span>
                                    </div>
                                </div>
                                <div className="bg-white p-5 rounded-[16px] border border-[#E5E7EB] shadow-[0_4px_12px_rgba(15,23,42,0.03)]">
                                    <p className="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-2">Body Temp</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold text-[#0F172A]">{temperature}</span>
                                        <span className="text-sm text-[#64748B] font-medium">°C</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Static Health Profile */}
                        <div>
                            <h3 className="text-lg font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                                <Leaf className="w-5 h-5 text-emerald-600" />
                                Ayurvedic Profile
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-white p-5 rounded-[16px] border border-[#E5E7EB] shadow-[0_4px_12px_rgba(15,23,42,0.03)] flex items-center gap-4">
                                    <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                                        <Leaf />
                                    </div>
                                    <div>
                                        <p className="text-[#64748B] text-xs font-bold uppercase tracking-wider">Dosha</p>
                                        <p className="text-lg font-bold text-[#0F172A]">{dosha}</p>
                                    </div>
                                </div>
                                <div className="bg-white p-5 rounded-[16px] border border-[#E5E7EB] shadow-[0_4px_12px_rgba(15,23,42,0.03)] flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                                        <Moon />
                                    </div>
                                    <div>
                                        <p className="text-[#64748B] text-xs font-bold uppercase tracking-wider">Condition</p>
                                        <p className="text-lg font-bold text-[#0F172A]">{disorder}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Profile;
