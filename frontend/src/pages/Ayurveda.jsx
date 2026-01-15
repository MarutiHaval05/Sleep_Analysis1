import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, ArrowRight, RefreshCw, CheckCircle, Info, Wind, Flame, Mountain } from 'lucide-react';
import Navigation from '../components/Navigation';

const questions = [
    {
        id: 1,
        question: "How would you describe your body build?",
        options: [
            { text: "Thin, light, lean", type: "Vata" },
            { text: "Medium, athletic, muscular", type: "Pitta" },
            { text: "Heavy, solid, broad", type: "Kapha" }
        ]
    },
    {
        id: 2,
        question: "How is your appetite?",
        options: [
            { text: "Irregular, unpredictable", type: "Vata" },
            { text: "Strong, sharp, intense", type: "Pitta" },
            { text: "Slow but steady", type: "Kapha" }
        ]
    },
    {
        id: 3,
        question: "How is your digestion?",
        options: [
            { text: "Gas, bloating, constipation", type: "Vata" },
            { text: "Acidity, heartburn, quick", type: "Pitta" },
            { text: "Slow, heavy, sluggish", type: "Kapha" }
        ]
    },
    {
        id: 4,
        question: "How do you handle temperature?",
        options: [
            { text: "Cold hands/feet, hate cold", type: "Vata" },
            { text: "Feel hot easily, sweat a lot", type: "Pitta" },
            { text: "Comfortable with cold, dislike humidity", type: "Kapha" }
        ]
    },
    {
        id: 5,
        question: "What is your sleep pattern like?",
        options: [
            { text: "Light, disturbed, insomnia", type: "Vata" },
            { text: "Moderate, intense dreams", type: "Pitta" },
            { text: "Deep, long, heavy", type: "Kapha" }
        ]
    },
    {
        id: 6,
        question: "How is your energy through the day?",
        options: [
            { text: "Comes in bursts, fluctuates", type: "Vata" },
            { text: "Consistent, driven, high", type: "Pitta" },
            { text: "Slow start, steady stamina", type: "Kapha" }
        ]
    },
    {
        id: 7,
        question: "How do you respond to stress?",
        options: [
            { text: "Anxiety, worry, fear", type: "Vata" },
            { text: "Irritability, anger, frustration", type: "Pitta" },
            { text: "Withdrawal, silence, eating", type: "Kapha" }
        ]
    },
    {
        id: 8,
        question: "How is your mind and thinking style?",
        options: [
            { text: "Fast, creative, scattered", type: "Vata" },
            { text: "Sharp, focused, critical", type: "Pitta" },
            { text: "Calm, steady, slow to change", type: "Kapha" }
        ]
    },
    {
        id: 9,
        question: "How is your skin?",
        options: [
            { text: "Dry, rough, cool", type: "Vata" },
            { text: "Warm, reddish, sensitive", type: "Pitta" },
            { text: "Soft, smooth, oily", type: "Kapha" }
        ]
    },
    {
        id: 10,
        question: "How do you generally gain/lose weight?",
        options: [
            { text: "Hard to gain, easy to lose", type: "Vata" },
            { text: "Easy to gain or lose", type: "Pitta" },
            { text: "Easy to gain, hard to lose", type: "Kapha" }
        ]
    }
];

const doshaConfig = {
    Vata: {
        title: "Vata",
        subtitle: "Air & Ether",
        description: "You are energetic, creative, and flexible like the wind. However, you may tend towards anxiety, dryness, and inconsistency when out of balance.",
        recommendations: [
            "Maintain a consistent daily routine",
            "Eat warm, cooked, nourishing foods (soups, stews)",
            "Avoid cold, dry, and raw foods",
            "Practice grounding yoga and meditation",
            "Keep warm and protect from wind"
        ],
        icon: Wind,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
        border: "border-indigo-100",
        button: "bg-indigo-600 hover:bg-indigo-700"
    },
    Pitta: {
        title: "Pitta",
        subtitle: "Fire & Water",
        description: "You are fiery, intelligent, and driven. You have a sharp intellect but may be prone to anger, inflammation, and perfectionism if not cooled down.",
        recommendations: [
            "Stay cool and avoid overheating",
            "Eat cooling, sweet, and bitter foods",
            "Avoid spicy, sour, and salty foods",
            "Practice moderation and make time for play",
            "Spend time in nature, especially near water"
        ],
        icon: Flame,
        color: "text-rose-600",
        bg: "bg-rose-50",
        border: "border-rose-100",
        button: "bg-rose-600 hover:bg-rose-700"
    },
    Kapha: {
        title: "Kapha",
        subtitle: "Earth & Water",
        description: "You are stable, loyal, and calm. You provide structure and support but may tend towards sluggishness, weight gain, and attachment if you become too sedentary.",
        recommendations: [
            "Stay active and exercise regularly",
            "Eat light, warm, and spicy foods",
            "Avoid heavy, oily, and sweet foods",
            "Seek stimulation and new experiences",
            "Wake up early and avoid daytime naps"
        ],
        icon: Mountain,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-100",
        button: "bg-emerald-600 hover:bg-emerald-700"
    }
};

const Ayurveda = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [showResult, setShowResult] = useState(false);

    const handleAnswer = (type) => {
        const newAnswers = { ...answers, [currentQuestion]: type };
        setAnswers(newAnswers);

        if (currentQuestion < questions.length - 1) {
            setTimeout(() => {
                setCurrentQuestion(curr => curr + 1);
            }, 300);
        } else {
            calculateResult(newAnswers);
        }
    };

    const calculateResult = (finalAnswers) => {
        const counts = { Vata: 0, Pitta: 0, Kapha: 0 };
        Object.values(finalAnswers).forEach(type => {
            counts[type]++;
        });

        const maxCount = Math.max(...Object.values(counts));
        const dominantDosha = Object.keys(counts).find(key => counts[key] === maxCount);

        setResult(dominantDosha);
        localStorage.setItem('ayurvedaDosha', dominantDosha);

        setTimeout(() => {
            setShowResult(true);
        }, 300);
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setAnswers({});
        setResult(null);
        setShowResult(false);
    };

    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const currentDoshaConfig = result ? doshaConfig[result] : doshaConfig['Pitta'];

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans">
            <Navigation />

            <div className="p-6 md:p-12">
                <div className="max-w-3xl mx-auto">
                    <header className="mb-10 text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                <Leaf className="w-6 h-6 text-emerald-600" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Ayurveda Dosha Analysis</h1>
                        <p className="text-[#64748B]">Discover your mind-body constitution for personalized insights.</p>
                    </header>

                    <AnimatePresence mode="wait">
                        {!showResult ? (
                            <motion.div
                                key="quiz"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="w-full"
                            >
                                <div className="mb-6">
                                    <div className="flex justify-between text-xs font-semibold text-[#64748B] mb-2 uppercase tracking-wide">
                                        <span>Progress</span>
                                        <span>{Math.round(progress)}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-[#2563EB]"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                </div>

                                <div className="bg-white rounded-[16px] border border-[#E5E7EB] shadow-[0_8px_24px_rgba(15,23,42,0.06)] p-8">
                                    <h2 className="text-xl font-semibold mb-8 text-[#0F172A]">
                                        {questions[currentQuestion].question}
                                    </h2>

                                    <div className="space-y-3">
                                        {questions[currentQuestion].options.map((option, index) => (
                                            <motion.button
                                                key={index}
                                                whileHover={{ scale: 1.005 }}
                                                whileTap={{ scale: 0.99 }}
                                                onClick={() => handleAnswer(option.type)}
                                                className="w-full text-left p-4 rounded-xl border border-[#E5E7EB] hover:border-[#2563EB] hover:bg-[#F8FAFC] transition-all duration-200 flex items-center justify-between group bg-white"
                                            >
                                                <span className="text-[#334155] font-medium">{option.text}</span>
                                                <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#2563EB] transition-colors" />
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`bg-white rounded-[16px] border border-[#E5E7EB] shadow-[0_8px_24px_rgba(15,23,42,0.06)] overflow-hidden`}
                            >
                                <div className={`p-8 md:p-12 text-center border-b ${currentDoshaConfig.border} ${currentDoshaConfig.bg}`}>
                                    <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-white shadow-sm border ${currentDoshaConfig.border} flex items-center justify-center`}>
                                        <currentDoshaConfig.icon className={`w-10 h-10 ${currentDoshaConfig.color}`} />
                                    </div>

                                    <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-2">Dominant Dosha</h2>
                                    <h1 className={`text-4xl font-bold mb-2 text-[#0F172A]`}>
                                        {currentDoshaConfig.title}
                                    </h1>
                                    <p className={`text-lg font-medium ${currentDoshaConfig.color} mb-6`}>
                                        {currentDoshaConfig.subtitle}
                                    </p>
                                    <p className="text-[#475569] max-w-xl mx-auto leading-relaxed">
                                        {currentDoshaConfig.description}
                                    </p>
                                </div>

                                <div className="p-8 md:p-12">
                                    <h4 className="flex items-center gap-2 text-lg font-semibold mb-6 text-[#0F172A]">
                                        <Info className="w-5 h-5 text-[#2563EB]" />
                                        Personalized Recommendations
                                    </h4>

                                    <div className="grid md:grid-cols-2 gap-4 mb-10">
                                        {currentDoshaConfig.recommendations.map((rec, index) => (
                                            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-[#F8FAFC] border border-[#E5E7EB]">
                                                <CheckCircle className={`w-5 h-5 ${currentDoshaConfig.color} flex-shrink-0 mt-0.5`} />
                                                <span className="text-[#475569] text-sm font-medium">{rec}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="text-center">
                                        <button
                                            onClick={resetQuiz}
                                            className={`${currentDoshaConfig.button} text-white px-8 py-3 rounded-xl font-medium transition-colors inline-flex items-center gap-2 shadow-sm`}
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                            Retake Analysis
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Ayurveda;
