
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

            if (result.prediction && result.prediction.condition) {
                localStorage.setItem('sleepDisorder', result.prediction.condition);
            }

            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

            setChartData(prevData => {
                const newDataPoint = {
                    time: timeStr,
                    heartRate: parseFloat(result.data.MAX30102?.bpm || 0),
                    gyroX: parseFloat(result.data.MPU6050?.gyro?.x || 0),
                    gyroY: parseFloat(result.data.MPU6050?.gyro?.y || 0),
                    gyroZ: parseFloat(result.data.MPU6050?.gyro?.z || 0)
                };

                const newData = [...prevData, newDataPoint];
                if (newData.length > 20) return newData.slice(newData.length - 20);
                return newData;
            });
        } else {
            setHasData(false);
        }
    } catch (error) {
        console.error('Error fetching sensor data:', error);
        setHasData(false);
    }
};

if (!hasData) {
    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans">
            <Navigation />
            <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                <div className="bg-white p-8 rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,0.06)] border border-[#E5E7EB] text-center space-y-4 max-w-md w-full mx-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2563EB] mx-auto"></div>
                    <h3 className="text-lg font-semibold text-[#0F172A]">Connecting to Device</h3>
                    <p className="text-[#64748B]">Please ensure the sensor device is active...</p>
                </div>
            </div>
        </div>
    )
}

const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-[16px] border border-[#E5E7EB] shadow-[0_8px_24px_rgba(15,23,42,0.06)] p-6 ${className}`}>
        {children}
    </div>
);

const MetricValue = ({ label, value, unit, icon: Icon }) => (
    <div className="flex items-start justify-between">
        <div>
            <p className="text-sm font-medium text-[#475569] mb-1">{label}</p>
            <div className="flex items-baseline gap-1">
                <h3 className="text-3xl font-bold text-[#0F172A] tracking-tight">
                    {value}
                </h3>
                {unit && <span className="text-sm font-medium text-[#94A3B8]">{unit}</span>}
            </div>
        </div>
        {Icon && (
            <div className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E5E7EB]">
                <Icon className="w-5 h-5 text-[#2563EB]" />
            </div>
        )}
    </div>
);

return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans pb-12">
        <Navigation />

        <div className="px-6 max-w-7xl mx-auto space-y-6">
            {/* Header / Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Heart Rate Metric */}
                <Card>
                    <MetricValue
                        label="Heart Rate"
                        value={sensorData?.MAX30102?.bpm || 0}
                        unit="BPM"
                        icon={Heart}
                    />
                </Card>

                {/* Temperature Metric */}
                <Card>
                    <MetricValue
                        label="Temperature"
                        value={sensorData?.DHT?.temperature || 0}
                        unit="°C"
                        icon={Zap}
                    />
                </Card>

                {/* Motion Metric */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-medium text-[#475569]">Motion Sensor</p>
                        <div className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E5E7EB]">
                            <Activity className="w-5 h-5 text-[#2563EB]" />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <span className="text-[#94A3B8] text-xs font-medium uppercase tracking-wider">Gy-X</span>
                            <p className="font-mono font-semibold text-[#0F172A] text-lg mt-0.5">{sensorData?.MPU6050?.gyro?.x || 0}</p>
                        </div>
                        <div>
                            <span className="text-[#94A3B8] text-xs font-medium uppercase tracking-wider">Gy-Y</span>
                            <p className="font-mono font-semibold text-[#0F172A] text-lg mt-0.5">{sensorData?.MPU6050?.gyro?.y || 0}</p>
                        </div>
                        <div>
                            <span className="text-[#94A3B8] text-xs font-medium uppercase tracking-wider">Gy-Z</span>
                            <p className="font-mono font-semibold text-[#0F172A] text-lg mt-0.5">{sensorData?.MPU6050?.gyro?.z || 0}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Heart Rate Chart */}
                <Card>
                    <h4 className="text-sm font-medium text-[#475569] mb-6">Heart Rate History</h4>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorHeartRate" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F87171" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#F87171" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(15, 23, 42, 0.08)" vertical={false} />
                                <XAxis
                                    dataKey="time"
                                    stroke="#94A3B8"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={{ stroke: '#E5E7EB' }}
                                    tick={{ fill: '#94A3B8' }}
                                />
                                <YAxis
                                    stroke="#94A3B8"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#94A3B8' }}
                                    domain={[0, 120]}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', color: '#0F172A' }}
                                    itemStyle={{ color: '#F87171', fontWeight: 600 }}
                                    labelStyle={{ color: '#64748B', marginBottom: '0.25rem' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="heartRate"
                                    stroke="#F87171"
                                    strokeWidth={2.5}
                                    fillOpacity={1}
                                    fill="url(#colorHeartRate)"
                                    isAnimationActive={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Motion Chart */}
                <Card>
                    <h4 className="text-sm font-medium text-[#475569] mb-6">Motion Sensor Data</h4>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(15, 23, 42, 0.08)" vertical={false} />
                                <XAxis
                                    dataKey="time"
                                    stroke="#94A3B8"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={{ stroke: '#E5E7EB' }}
                                    tick={{ fill: '#94A3B8' }}
                                />
                                <YAxis
                                    stroke="#94A3B8"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#94A3B8' }}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', color: '#0F172A' }}
                                />
                                <Line type="monotone" dataKey="gyroX" stroke="#F59E0B" strokeWidth={2} dot={false} isAnimationActive={false} name="Gyro X" />
                                <Line type="monotone" dataKey="gyroY" stroke="#8B5CF6" strokeWidth={2} dot={false} isAnimationActive={false} name="Gyro Y" />
                                <Line type="monotone" dataKey="gyroZ" stroke="#06B6D4" strokeWidth={2} dot={false} isAnimationActive={false} name="Gyro Z" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Real-time Sleep Analysis Section */}
            <Card>
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[#E5E7EB]">
                    <div className="p-2 rounded-lg bg-[#EFF6FF]">
                        <Activity className="text-[#2563EB] w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0F172A]">
                        Real-time Sleep Analysis
                    </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Current Status */}
                    <div className="bg-[#F8FAFC] rounded-xl p-8 border border-[#E5E7EB] text-center">
                        <h4 className="text-[#64748B] font-medium mb-2 uppercase text-xs tracking-wider">Current Condition</h4>
                        <div className="my-6">
                            <h2 className="text-4xl font-bold text-[#0F172A] mb-2 tracking-tight">
                                {sensorData?.prediction?.condition || "Analyzing..."}
                            </h2>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E5E7EB]">
                                <div className="w-2 h-2 rounded-full bg-[#2563EB]"></div>
                                <span className="text-sm font-medium text-[#475569]">
                                    Class: {sensorData?.prediction?.raw_prediction !== undefined ? sensorData.prediction.raw_prediction : '-'}
                                </span>
                            </div>
                        </div>
                        <p className="text-[#94A3B8] text-sm flex items-center justify-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            Live Model Inference
                        </p>
                    </div>

                    {/* Right: Model Inputs table-like view */}
                    <div>
                        <h4 className="text-[#0F172A] font-semibold mb-4 text-sm">Model Input Parameters</h4>
                        <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
                            <div className="grid grid-cols-2 divide-x divide-[#E5E7EB] border-b border-[#E5E7EB] bg-[#F8FAFC]">
                                <div className="p-4">
                                    <p className="text-xs text-[#64748B] mb-1">Heart Rate</p>
                                    <p className="text-lg font-mono font-semibold text-[#0F172A]">
                                        {sensorData?.MAX30102?.bpm || 0} <span className="text-xs text-[#94A3B8] font-sans font-normal">BPM</span>
                                    </p>
                                </div>
                                <div className="p-4">
                                    <p className="text-xs text-[#64748B] mb-1">Temperature</p>
                                    <p className="text-lg font-mono font-semibold text-[#0F172A]">
                                        {sensorData?.DHT?.temperature || 0} <span className="text-xs text-[#94A3B8] font-sans font-normal">°C</span>
                                    </p>
                                </div>
                            </div>
                            <div className="p-4 bg-white">
                                <p className="text-xs text-[#64748B] mb-3">Motion Vectors (Gyroscope)</p>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-[#F8FAFC] p-2 rounded border border-[#E5E7EB] text-center">
                                        <span className="block text-[10px] text-[#94A3B8] uppercase">X-Axis</span>
                                        <span className="font-mono text-sm font-medium text-[#2563EB]">{sensorData?.MPU6050?.gyro?.x || 0}</span>
                                    </div>
                                    <div className="bg-[#F8FAFC] p-2 rounded border border-[#E5E7EB] text-center">
                                        <span className="block text-[10px] text-[#94A3B8] uppercase">Y-Axis</span>
                                        <span className="font-mono text-sm font-medium text-[#64748B]">{sensorData?.MPU6050?.gyro?.y || 0}</span>
                                    </div>
                                    <div className="bg-[#F8FAFC] p-2 rounded border border-[#E5E7EB] text-center">
                                        <span className="block text-[10px] text-[#94A3B8] uppercase">Z-Axis</span>
                                        <span className="font-mono text-sm font-medium text-[#94A3B8]">{sensorData?.MPU6050?.gyro?.z || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    </div>
);

export default Dashboard;
