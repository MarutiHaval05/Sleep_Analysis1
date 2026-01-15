import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Apple, User } from 'lucide-react';
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
            name: 'Diet Recommendation',
            path: '/diet',
            icon: Apple,
        },
        {
            name: 'Profile',
            path: '/profile',
            icon: User,
        },
    ];

    return (
        <nav className="bg-slate-900/50 border-b border-white/10 backdrop-blur-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            Sleep Monitor
                        </h1>
                    </div>

                    {/* Navigation Items */}
                    <div className="hidden md:flex items-center space-x-1">
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
                                        whileHover={{ y: -2 }}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive
                                                ? 'bg-purple-600/20 text-purple-400'
                                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <Icon size={18} />
                                        <span className="font-medium">{item.name}</span>
                                    </motion.div>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden pb-3 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${isActive
                                        ? 'bg-purple-600/20 text-purple-400'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Icon size={18} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
