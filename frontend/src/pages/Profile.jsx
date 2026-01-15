import React from 'react';
import { motion } from 'framer-motion';
import { User, Settings, LogOut } from 'lucide-react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';

const Profile = () => {
    const navigate = useNavigate();
    const user = auth.currentUser;

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Navigation />
            <div className="p-6 md:p-12">
                <div className="max-w-3xl mx-auto">
                    <header className="mb-12">
                        <h1 className="text-3xl font-bold mb-2">Profile</h1>
                        <p className="text-slate-400">Manage your account and preferences.</p>
                    </header>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold">
                                {user?.email?.[0].toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold">{user?.email || 'User'}</h2>
                                <p className="text-slate-400">Member since 2024</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <ProfileOption icon={<User />} label="Personal Information" />
                            <ProfileOption icon={<Settings />} label="App Settings" />
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProfileOption = ({ icon, label }) => (
    <motion.button
        whileHover={{ x: 5 }}
        className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5"
    >
        <div className="flex items-center gap-4">
            <div className="text-slate-400">{icon}</div>
            <span>{label}</span>
        </div>
        <span className="text-slate-500">→</span>
    </motion.button>
);

export default Profile;
