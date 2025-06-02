import { motion } from 'framer-motion';
import { Play, Pause, Server, Cpu, Zap, Clock, Gauge, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

const DemoSection = ({ isPlaying, setIsPlaying }) => {
  const [demoData, setDemoData] = useState({
    metrics: {
      EPSO: {
        responseTime: "85ms",
        utilization: "88%",
        energy: "92%",
        imbalance: "12%",
        makespan: "1.4s" // Added makespan
      },
      EACO: { // Changed from RR to EACO (Enhanced Ant Colony Optimization)
        responseTime: "120ms",
        utilization: "65%",
        energy: "70%",
        imbalance: "35%",
        makespan: "2.1s" // Added makespan
      }
    },
    serverLoads: [
      { id: 1, epsoload: 82, acoload: 65, status: "normal" }, // Changed rrload to acoload
      { id: 2, epsoload: 78, acoload: 70, status: "normal" },
      { id: 3, epsoload: 85, acoload: 60, status: "high" },
      { id: 4, epsoload: 80, acoload: 75, status: "normal" },
      { id: 5, epsoload: 75, acoload: 65, status: "normal" }
    ]
  });

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setDemoData(prev => {
          const newServerLoads = prev.serverLoads.map(server => {
            const variation = Math.floor(Math.random() * 5) - 2;
            return {
              ...server,
              epsoload: Math.max(70, Math.min(90, server.epsoload + variation)),
              acoload: Math.max(55, Math.min(80, server.acoload + variation * 2)), // Changed rrload to acoload
              status: server.epsoload + variation > 85 ? "high" : "normal"
            };
          });
          
          return {
            ...prev,
            serverLoads: newServerLoads
          };
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const getStatusColor = (status) => {
    switch(status) {
      case "high": return "bg-yellow-500";
      case "overloaded": return "bg-red-500";
      default: return "bg-green-500";
    }
  };

  return (
    <motion.section 
      className="px-6 py-12 bg-white relative"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{ marginTop: '-40px' }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#267b79] to-[#4fd1c5]">
              Sample Load Balancing Simulation
            </span>
          </h3>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Interactive comparison between <span className="font-semibold text-[#319694]">Enhanced ACO</span> and <span className="font-semibold text-[#4fd1c5]">EPSO</span> algorithms
          </p>
          <p className="text-sm text-gray-500 mt-2">* Displaying mock simulation results for demonstration purposes</p>
        </motion.div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[#319694]/10">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div>
              <h4 className="text-lg font-semibold text-[#319694]">Server Load Distribution</h4>
              <p className="text-sm text-gray-600 mt-1">
                {isPlaying ? "Live simulation running (mock data)" : "Simulation paused"}
              </p>
            </div>
            <div className="flex gap-3">
              <motion.button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 text-white bg-gradient-to-r from-[#319694] to-[#4fd1c5] hover:from-[#267b79] hover:to-[#319694] px-5 py-2.5 rounded-xl text-sm font-medium shadow-md transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" /> Play Demo
                  </>
                )}
              </motion.button>
              <motion.button 
                onClick={() => setIsPlaying(false)}
                className="flex items-center gap-2 text-[#319694] bg-white hover:bg-gray-50 px-5 py-2.5 rounded-xl text-sm font-medium shadow-md transition-all border border-[#319694]/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className="w-4 h-4" /> Reset
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div 
              className="bg-[#f0fdfa] p-5 rounded-xl border border-[#319694]/20"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4 text-[#4fd1c5]">
                <Zap className="w-5 h-5" />
                <h5 className="font-medium text-lg">Enhanced PSO</h5>
              </div>
              <div className="space-y-4">
                {demoData.serverLoads.map((server) => (
                  <motion.div 
                    key={`epso-${server.id}`} 
                    className="flex items-center gap-3"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div 
                      className="w-9 h-9 rounded-full bg-[#e0f7f6] flex items-center justify-center"
                      whileHover={{ rotate: 15 }}
                    >
                      <Server className="w-4 h-4 text-[#4fd1c5]" />
                    </motion.div>
                    <div className="flex-grow">
                      <div className="flex justify-between text-sm text-gray-600 mb-1.5">
                        <span>VM {server.id}</span>
                        <span>{server.epsoload}%</span>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${getStatusColor(server.status)}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${server.epsoload}%` }}
                          transition={{ 
                            type: "spring",
                            stiffness: 100,
                            damping: 15,
                            duration: 1,
                            delay: 0.3
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="bg-[#f0fdfa] p-5 rounded-xl border border-[#319694]/20"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4 text-[#319694]">
                <Cpu className="w-5 h-5" />
                <h5 className="font-medium text-lg">Enhanced ACO</h5>
              </div>
              <div className="space-y-4">
                {demoData.serverLoads.map((server) => (
                  <motion.div 
                    key={`aco-${server.id}`} 
                    className="flex items-center gap-3"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div 
                      className="w-9 h-9 rounded-full bg-[#e0f7f6] flex items-center justify-center"
                      whileHover={{ rotate: 15 }}
                    >
                      <Server className="w-4 h-4 text-[#319694]" />
                    </motion.div>
                    <div className="flex-grow">
                      <div className="flex justify-between text-sm text-gray-600 mb-1.5">
                        <span>VM {server.id}</span>
                        <span>{server.acoload}%</span>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${getStatusColor(server.acoload > 80 ? "high" : "normal")}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${server.acoload}%` }}
                          transition={{ 
                            type: "spring",
                            stiffness: 100,
                            damping: 15,
                            duration: 1,
                            delay: 0.3
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <motion.div 
              className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-[#319694]/10 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -3 }}
            >
              <div className="flex items-center gap-2 text-[#319694] mb-2">
                <Clock className="w-5 h-5" />
                <span className="text-sm font-medium">Response Time</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <motion.span 
                    className="text-2xl font-bold block"
                    key={`epso-rt-${isPlaying}`}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {demoData.metrics.EPSO.responseTime}
                  </motion.span>
                  <span className="block text-xs text-gray-500">EPSO</span>
                </div>
                <div className="text-right">
                  <motion.span 
                    className="text-lg text-gray-600 block"
                    key={`aco-rt-${isPlaying}`}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {demoData.metrics.EACO.responseTime}
                  </motion.span>
                  <span className="block text-xs text-gray-500">EACO</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-[#319694]/10 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -3 }}
            >
              <div className="flex items-center gap-2 text-[#319694] mb-2">
                <Gauge className="w-5 h-5" />
                <span className="text-sm font-medium">Utilization</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <motion.span 
                    className="text-2xl font-bold block"
                    key={`epso-util-${isPlaying}`}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {demoData.metrics.EPSO.utilization}
                  </motion.span>
                  <span className="block text-xs text-gray-500">EPSO</span>
                </div>
                <div className="text-right">
                  <motion.span 
                    className="text-lg text-gray-600 block"
                    key={`aco-util-${isPlaying}`}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {demoData.metrics.EACO.utilization}
                  </motion.span>
                  <span className="block text-xs text-gray-500">EACO</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-[#319694]/10 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ y: -3 }}
            >
              <div className="flex items-center gap-2 text-[#319694] mb-2">
                <Zap className="w-5 h-5" />
                <span className="text-sm font-medium">Energy Efficiency</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <motion.span 
                    className="text-2xl font-bold block"
                    key={`epso-energy-${isPlaying}`}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {demoData.metrics.EPSO.energy}
                  </motion.span>
                  <span className="block text-xs text-gray-500">EPSO</span>
                </div>
                <div className="text-right">
                  <motion.span 
                    className="text-lg text-gray-600 block"
                    key={`aco-energy-${isPlaying}`}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {demoData.metrics.EACO.energy}
                  </motion.span>
                  <span className="block text-xs text-gray-500">EACO</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-[#319694]/10 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ y: -3 }}
            >
              <div className="flex items-center gap-2 text-[#319694] mb-2">
                <Server className="w-5 h-5" />
                <span className="text-sm font-medium">Load Imbalance</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <motion.span 
                    className="text-2xl font-bold block"
                    key={`epso-imb-${isPlaying}`}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {demoData.metrics.EPSO.imbalance}
                  </motion.span>
                  <span className="block text-xs text-gray-500">EPSO</span>
                </div>
                <div className="text-right">
                  <motion.span 
                    className="text-lg text-gray-600 block"
                    key={`aco-imb-${isPlaying}`}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {demoData.metrics.EACO.imbalance}
                  </motion.span>
                  <span className="block text-xs text-gray-500">EACO</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-[#319694]/10 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ y: -3 }}
            >
              <div className="flex items-center gap-2 text-[#319694] mb-2">
                <Clock className="w-5 h-5" />
                <span className="text-sm font-medium">Makespan</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <motion.span 
                    className="text-2xl font-bold block"
                    key={`epso-makespan-${isPlaying}`}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {demoData.metrics.EPSO.makespan}
                  </motion.span>
                  <span className="block text-xs text-gray-500">EPSO</span>
                </div>
                <div className="text-right">
                  <motion.span 
                    className="text-lg text-gray-600 block"
                    key={`aco-makespan-${isPlaying}`}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {demoData.metrics.EACO.makespan}
                  </motion.span>
                  <span className="block text-xs text-gray-500">EACO</span>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="mt-8 pt-4 border-t border-[#319694]/10 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-sm text-gray-600">
              Interactive simulation showing mock load balancing performance metrics for demonstration purposes
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default DemoSection;