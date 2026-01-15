import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, User, Leaf, Sun, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const Navigation = () => {
    const location = useLocation();

    const navItems = [
        {
            name: 'Sleep Analysis',
            path: '/dashboard',
            icon: Activity,
        },
        {
            name: 'Ayurveda',
            path: '/ayurveda',
            icon: Leaf,
        },
        {
            name: 'Recommendation',
            path: '/diet',
            icon: Star,
        },
        {
            name: 'Yoga',
            path: '/yoga',
            icon: Sun, // Importing Sun for Yoga
        },
        {
            name: 'Profile',
            path: '/profile',
            icon: User,
        },
    ];

    return (
        <div className="sticky top-0 z-50 w-full bg-[#FFFFFF] border-b border-[#E5E7EB]">
            <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-[#2563EB] rounded-lg">
                        <Activity className="text-white w-5 h-5" />
                    </div>
                    <h1 className="text-lg font-bold text-[#0F172A] tracking-tight">
                        SleepAnalysis
                    </h1>
                </div>

                {/* Navigation Items */}
                <div className="flex items-center gap-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="relative"
                            >
                                <motion.div
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${isActive
                                        ? 'bg-[#2563EB] text-white font-medium'
                                        : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
                                        }`}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Icon size={18} strokeWidth={isActive ? 2 : 2} />
                                    <span className="text-sm">{item.name}</span>
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
};

export default Navigation;
