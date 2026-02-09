import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Globe, Shield, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { eventsApi } from '../api/eventsApi';


const Hero = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [popularEvents, setPopularEvents] = useState([]);

    useEffect(() => {
        const fetchPopular = async () => {
            try {
                const data = await eventsApi.getPopularEvents();
                setPopularEvents(data);
            } catch (error) {
                console.error("Failed to fetch popular events", error);
            }
        };
        fetchPopular();
    }, []);

    const handleParticipate = () => {
        navigate('/events');
    };

    const handleOrganize = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: { pathname: '/dashboard' } } });
            return;
        }

        if (user.organizerEnabled) {
            navigate('/dashboard');
        } else {
            navigate('/onboarding/organizer');
        }
    };

    return (
        <div className="relative h-screen bg-[#0A0A0B] text-white overflow-hidden font-sans selection:bg-purple-500/30 flex flex-col">
            {/* 1. Aurora Background - Subtle & Premium */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-[#4F46E5]/10 rounded-full blur-[120px] animate-aurora mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#A855F7]/10 rounded-full blur-[120px] animate-aurora delay-2000 mix-blend-screen" />
            </div>

            {/* Navbar - Reduced height */}
            <nav className="relative z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white fill-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">Eventhon</span>
                </div>

                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
                    <button onClick={() => navigate('/events')} className="hover:text-white transition-colors duration-200">Events</button>
                    <button className="hover:text-white transition-colors duration-200">Solutions</button>
                    <button className="hover:text-white transition-colors duration-200">Pricing</button>
                </div>

                <div className="flex items-center gap-3">
                    {!isAuthenticated ? (
                        <>
                            <button onClick={() => navigate('/login')} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Log in</button>
                            <button onClick={() => navigate('/register')} className="px-4 py-2 text-sm font-medium bg-white text-black rounded-full hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                Sign Up
                            </button>
                        </>
                    ) : (
                        <button onClick={() => navigate('/dashboard')} className="px-4 py-2 text-sm font-medium bg-white/10 border border-white/5 text-white rounded-full hover:bg-white/15 transition-all">
                            Dashboard
                        </button>
                    )}
                </div>
            </nav>

            {/* Hero Content - Flex Grow to take remaining space, Centered */}
            <main className="relative z-10 flex-grow flex items-center justify-center px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

                    {/* LEFT COLUMN - Messaging */}
                    <div className="space-y-6 lg:space-y-8 flex flex-col justify-center relative z-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="space-y-4 lg:space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-300 w-fit">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                                </span>
                                Event Workflow 2.0 is here
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                                The operating system for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-white">campus events.</span>
                            </h1>

                            <p className="text-base sm:text-lg text-gray-400 max-w-lg leading-relaxed font-light">
                                Eventhon simplifies event creation and participation through automated workflows. From registration to payments, everything happens in one place.
                            </p>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <button
                                    onClick={handleParticipate}
                                    className="group px-6 py-3 rounded-full font-semibold bg-white text-black hover:bg-gray-100 transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.15)] transform active:scale-95 text-sm sm:text-base"
                                >
                                    Participate in Events
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={handleOrganize}
                                    className="px-6 py-3 rounded-full font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center gap-2 transform active:scale-95 text-sm sm:text-base"
                                >
                                    Organize an Event
                                </button>
                            </div>
                        </motion.div>

                        {/* Trust Indicators */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="pt-6 border-t border-white/5 flex gap-6 items-center text-gray-500 grayscale opacity-70"
                        >
                            <div className="flex items-center gap-2"><Globe className="w-4 h-4" /><span className="text-[10px] font-semibold tracking-wider">UNIVERSAL ACCESS</span></div>
                            <div className="flex items-center gap-2"><Shield className="w-4 h-4" /><span className="text-[10px] font-semibold tracking-wider">SECURE PAYMENTS</span></div>
                            <div className="flex items-center gap-2"><BarChart3 className="w-4 h-4" /><span className="text-[10px] font-semibold tracking-wider">REAL-TIME ANALYTICS</span></div>
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN - Discovery Gallery */}
                    <div className="relative flex flex-col gap-4 items-center lg:items-end mt-12 lg:mt-0">
                        {popularEvents.length > 0 ? (
                            popularEvents.slice(0, 3).map((event, index) => (
                                <motion.div
                                    key={event._id || index}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl w-full max-w-sm hover:bg-white/10 transition-colors flex gap-4 items-center cursor-pointer"
                                    onClick={() => navigate(`/events/${event._id}`)}
                                >
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center shrink-0">
                                        <Zap className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white line-clamp-1">{event.title}</h3>
                                        <p className="text-sm text-gray-400">{new Date(event.schedule?.start).toLocaleDateString()}</p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-500 ml-auto" />
                                </motion.div>
                            ))
                        ) : (
                            // Fallback skeleton if no events
                            [1, 2, 3].map((_, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl w-full max-w-sm h-24 animate-pulse relative" style={{ opacity: 1 - i * 0.2 }} />
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Hero;
