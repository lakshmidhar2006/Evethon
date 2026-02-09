import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const WorkflowVisualization = ({ className = "" }) => {
    // Staggered animation for list items
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className={`relative perspective-800 group ${className}`}>
            {/* Glass Card */}
            <motion.div
                initial={{ opacity: 0, rotateX: 10, y: 40 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 bg-[#161618]/80 backdrop-blur-2xl border border-white/5 rounded-2xl p-6 shadow-2xl overflow-hidden transform transition-transform duration-500 hover:scale-[1.01] w-full"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                    </div>
                    <div className="px-2 py-0.5 bg-white/5 rounded-full text-[10px] font-mono text-gray-400 border border-white/5">
                        event_lifecycle.ts
                    </div>
                </div>

                {/* Animated Workflow Steps */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-0 relative border-l border-white/10 ml-3 pl-6 pb-2"
                >
                    {[
                        { title: 'Create Event', desc: 'Define details & tickets', color: 'bg-blue-500' },
                        { title: 'Review & Publish', desc: 'Auto-checks & approval', color: 'bg-purple-500' },
                        { title: 'Registration Open', desc: 'Payments active', color: 'bg-green-500' },
                        { title: 'Event Live', desc: 'Check-ins & participation', color: 'bg-orange-500' },
                        { title: 'Post-Event', desc: 'Analytics & certificates', color: 'bg-gray-500' }
                    ].map((step, index) => (
                        <motion.div key={index} variants={item} className="relative pb-6 last:pb-0 group/item">
                            <span className={`absolute -left-[29px] top-1 w-4 h-4 rounded-full border-[3px] border-[#161618] ${step.color} shadow-[0_0_10px_rgba(0,0,0,0.5)] group-hover/item:scale-125 transition-transform duration-300`}></span>
                            <div className="group-hover/item:translate-x-2 transition-transform duration-300">
                                <h3 className="text-sm font-semibold text-white mb-0.5 group-hover/item:text-blue-200 transition-colors">{step.title}</h3>
                                <p className="text-[10px] text-gray-500 font-medium">{step.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Floating Success Card (Parallax) */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute right-4 top-24 bg-[#1A1A1C] border border-white/10 p-3 rounded-lg shadow-2xl z-20 w-36"
                >
                    <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-white">Registration</p>
                            <p className="text-[8px] text-gray-400">Just now</p>
                        </div>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[80%] rounded-full animate-pulse" />
                    </div>
                </motion.div>

            </motion.div>
        </div>
    );
};

export default WorkflowVisualization;
