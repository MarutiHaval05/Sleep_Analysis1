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
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-12">
        <Navigation />

        <div className="max-w-7xl mx-auto px-6 pt-8">
            {/* Standard Header */}
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-[#0F172A] mb-2 flex items-center gap-2">
                    <Utensils className="w-8 h-8 text-[#2563EB]" />
                    Diet Recommendation
                </h1>
                <p className="text-[#64748B]">Personalized nutrition strategy based on your Ayurvedic profile and vitals.</p>
            </header>

            {/* Context Section (Restored Style) */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 p-6 rounded-[16px] mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                        <Utensils className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-purple-900">Your Health Profile</h3>
                        <p className="text-purple-600/80 text-sm">Based on your Ayurveda Quiz & Sleep Analysis</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="px-4 py-2 bg-white rounded-lg border border-purple-100 shadow-sm text-center">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Dosha</p>
                        <p className="font-medium text-purple-700">{dosha || 'Unknown'}</p>
                    </div>
                    <div className="px-4 py-2 bg-white rounded-lg border border-purple-100 shadow-sm text-center">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Condition</p>
                        <p className="font-medium text-purple-700">{disorder || 'Unknown'}</p>
                    </div>
                    <div className="px-4 py-2 bg-white rounded-lg border border-purple-100 shadow-sm text-center">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Temp</p>
                        <p className="font-medium text-purple-700">{temperature}°C</p>
                    </div>
                </div>
            </div>

            {/* Generate Button Area */}
            <div className="flex justify-end mb-8">
                <button
                    onClick={generateRecommendation}
                    disabled={loading}
                    className="bg-[#2563EB] hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4" />
                            Generate Plan
                        </>
                    )}
                </button>
            </div>

            {/* Results Section */}
            <AnimatePresence>
                {prediction && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", bounce: 0.2 }}
                        className="space-y-8"
                    >
                        {/* Insight Text */}
                        <div className="bg-white rounded-[16px] p-6 border border-[#E5E7EB] shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
                            <h3 className="text-lg font-bold text-[#0F172A] mb-2">Strategic Insight</h3>
                            <p className="text-[#475569] leading-relaxed">
                                {prediction.recommendation_text || "Your customized plan focuses on balancing your natural constitution."}
                            </p>
                        </div>

                        {/* Harmonized Tag Grid Layout */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Recommended Grid */}
                            <div className="bg-white rounded-[16px] border border-[#E5E7EB] shadow-[0_8px_24px_rgba(15,23,42,0.06)] overflow-hidden flex flex-col">
                                <div className="p-6 border-b border-[#E5E7EB] bg-[#F8FAFC]">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-white border border-[#E2E8F0]">
                                            <CheckCircle className="w-5 h-5 text-[#475569]" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-[#0F172A] font-sans">Recommended</h3>
                                            <p className="text-[#64748B] text-xs font-medium uppercase tracking-wide">Beneficial for {dosha}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex flex-wrap gap-2">
                                        {prediction.foods_to_eat?.map((food, index) => (
                                            <motion.span
                                                key={index}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.03 }}
                                                className="inline-flex items-center px-4 py-2 rounded-lg bg-[#F8FAFC] text-[#0F172A] text-sm font-semibold border border-[#CBD5E1] hover:bg-[#F1F5F9] transition-colors cursor-default shadow-sm"
                                            >
                                                {food}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Avoid Grid */}
                            <div className="bg-white rounded-[16px] border border-[#E5E7EB] shadow-[0_8px_24px_rgba(15,23,42,0.06)] overflow-hidden flex flex-col">
                                <div className="p-6 border-b border-[#E5E7EB] bg-[#F8FAFC]">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-white border border-[#E2E8F0]">
                                            <Ban className="w-5 h-5 text-[#94A3B8]" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-[#0F172A] font-sans">Avoid</h3>
                                            <p className="text-[#64748B] text-xs font-medium uppercase tracking-wide">Aggravates {dosha}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex flex-wrap gap-2">
                                        {prediction.foods_to_avoid?.map((food, index) => (
                                            <motion.span
                                                key={index}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.03 }}
                                                className="inline-flex items-center px-4 py-2 rounded-lg bg-[#FFF1F2] text-[#9F1239] text-sm font-semibold border border-[#FECDD3] hover:bg-[#FFE4E6] transition-colors cursor-default shadow-sm"
                                            >
                                                {food}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    </div>
);
};

export default Diet;
