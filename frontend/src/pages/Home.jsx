import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Moon, Utensils } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 container mx-auto px-6 py-12">
                <nav className="flex justify-between items-center mb-20">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        SleepSync
                    </h1>
                    <div className="space-x-4">
                        <Link to="/login" className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
                            Login
                        </Link>
                        <Link to="/register" className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 transition-opacity">
                            Get Started
                        </Link>
                    </div>
                </nav>

                <main className="flex flex-col items-center text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                    >
                        Master Your Sleep,<br />
                        <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            Optimize Your Life
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-400 mb-12 max-w-2xl"
                    >
                        Advanced sleep monitoring powered by AI. Track your heart rate, motion, and sleep quality to receive personalized diet and health recommendations.
                    </motion.p>

                    <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl mt-12">
                        <FeatureCard
                            icon={<Moon className="w-8 h-8 text-purple-400" />}
                            title="Sleep Analysis"
                            description="Real-time tracking of sleep patterns, motion, and heart rate variability."
                        />
                        <FeatureCard
                            icon={<Activity className="w-8 h-8 text-blue-400" />}
                            title="Health Insights"
                            description="AI-driven detection of potential sleep disorders and health issues."
                        />
                        <FeatureCard
                            icon={<Utensils className="w-8 h-8 text-green-400" />}
                            title="Smart Diet"
                            description="Personalized nutrition plans based on your specific health profile."
                        />
                    </div>
                </main>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
    >
        <div className="mb-4 p-3 rounded-full bg-white/5 w-fit">
            {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-slate-400">{description}</p>
    </motion.div>
);

export default Home;
