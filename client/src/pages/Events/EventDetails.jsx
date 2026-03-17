import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '../../api/eventsApi';
import { registrationsApi } from '../../api/registrationsApi';
import { useAuth } from '../../hooks/useAuth';
import { 
    Calendar, MapPin, Clock, Users, ArrowLeft, Loader2, 
    Zap, ShieldCheck, Award, BookOpen, Settings, 
    ArrowRight, X, Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

const EventDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('overview');

    // Queries
    const { data: event, isLoading, error } = useQuery({
        queryKey: ['event', id],
        queryFn: () => eventsApi.getEventById(id),
    });

    const isOrganizer = !!user && (
        user.isAdmin || 
        String(user.id || user._id) === String(event?.createdBy?._id || event?.createdBy)
    );

    const { data: registrations, isLoading: loadingRegs } = useQuery({
        queryKey: ['eventRegistrations', id],
        queryFn: () => eventsApi.getRegistrations(id),
        enabled: !!event && !!user && isOrganizer
    });

    // Mutations
    const registerMutation = useMutation({
        mutationFn: () => registrationsApi.register({ eventId: id }),
        onSuccess: () => {
            queryClient.invalidateQueries(['event', id]);
            queryClient.invalidateQueries(['myRegistrations']);
        }
    });

    // Handle WebSocket for real-time capacity updates
    useEffect(() => {
        if (!event) return;

        const socket = io('/', {
            withCredentials: true,
            path: '/socket.io'
        });

        socket.on('registration_update', (data) => {
            if (data.eventId === id) {
                queryClient.setQueryData(['event', id], (oldData) => {
                    if (!oldData) return oldData;
                    return { ...oldData, remainingSlots: data.remainingSlots };
                });
                
                if (activeTab === 'registrations') {
                    queryClient.invalidateQueries(['eventRegistrations', id]);
                }
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [id, event, queryClient, activeTab]);

    if (isLoading) return (
        <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
            <p className="text-gray-500 font-medium animate-pulse">Loading event experience...</p>
        </div>
    );

    if (error || !event) return (
        <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6">
            <div className="glass p-12 rounded-3xl text-center max-w-md border-red-500/20">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                    <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Event Not Found</h3>
                <p className="text-gray-400 mb-8">This event might have been removed or is currently unavailable.</p>
                <Link to="/events" className="px-8 py-3 bg-white text-black font-bold rounded-xl transition-all hover:bg-gray-200">
                    Back to Discovery
                </Link>
            </div>
        </div>
    );

    const isFull = event.remainingSlots <= 0;
    const isPast = new Date(event.schedule?.start) < new Date();

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white font-sans selection:bg-indigo-500/30 pb-20 overflow-x-hidden">
            {/* Immersive Hero Header */}
            <header className="relative h-[65vh] w-full overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/40 to-transparent z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B] via-transparent to-transparent z-10" />
                    <div className="w-full h-full bg-indigo-900/20 animate-pulse relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[160px] animate-aurora" />
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-16 relative z-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex flex-wrap gap-3">
                            <span className="px-4 py-1.5 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-xs font-black uppercase tracking-widest">
                                {event.category || 'Special Event'}
                            </span>
                            {isPast && (
                                <span className="px-4 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-widest">
                                    Concluded
                                </span>
                            )}
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black font-outfit tracking-tighter leading-tight max-w-4xl">
                            {event.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-8 text-lg font-light text-gray-300">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-6 h-6 text-indigo-500" />
                                <span>{new Date(event.schedule?.start).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="w-6 h-6 text-indigo-500" />
                                <span>{event.location?.address || event.location || 'Universal Arena'}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Content Tabs Navigation */}
            <div className="sticky top-0 z-50 glass border-y border-white/5 py-4">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex gap-8">
                        {[
                            { id: 'overview', label: 'Overview', icon: BookOpen },
                            { id: 'registrations', label: 'Participants', icon: Users, hidden: !isOrganizer },
                            { id: 'settings', label: 'Management', icon: Settings, hidden: !isOrganizer }
                        ].map(tab => !tab.hidden && (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative flex items-center gap-2.5 font-bold transition-all ${
                                    activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                                }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div layoutId="activeTab" className="absolute -bottom-6 left-0 right-0 h-1 bg-indigo-500 rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                         {isOrganizer ? (
                            <div className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                                Organizer Access
                            </div>
                         ) : (
                            <div className={`px-4 py-1.5 rounded-xl border font-bold text-sm ${isFull ? 'border-red-500/20 text-red-400 bg-red-500/5' : 'border-indigo-500/20 text-indigo-400 bg-indigo-500/5'}`}>
                                {isFull ? 'Waitlist Only' : `${event.remainingSlots} Seats Available`}
                            </div>
                         )}
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
                {/* Left Side: Tab Content */}
                <div className="lg:col-span-2 space-y-12">
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <motion.div 
                                key="overview"
                                initial={{ opacity: 0, x: -10 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                exit={{ opacity: 0, x: 10 }}
                                className="space-y-12"
                            >
                                <section>
                                    <h2 className="text-3xl font-black font-outfit mb-6 text-indigo-400 uppercase tracking-tighter">About the Event</h2>
                                    <div className="prose prose-invert max-w-none text-gray-400 text-lg leading-relaxed font-light whitespace-pre-wrap">
                                        {event.description}
                                    </div>
                                </section>

                                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="glass-card">
                                        <div className="p-4 bg-indigo-500/10 rounded-2xl w-fit mb-6">
                                            <ShieldCheck className="w-8 h-8 text-indigo-500" />
                                        </div>
                                        <h4 className="text-xl font-bold mb-2">Secure Entry</h4>
                                        <p className="text-gray-500 text-sm">Verified digital credentials and automated check-ins for all participants.</p>
                                    </div>
                                    <div className="glass-card">
                                        <div className="p-4 bg-purple-500/10 rounded-2xl w-fit mb-6">
                                            <Award className="w-8 h-8 text-purple-500" />
                                        </div>
                                        <h4 className="text-xl font-bold mb-2">Recognition</h4>
                                        <p className="text-gray-500 text-sm">Earn participation certificates and showcase your achievements in your profile.</p>
                                    </div>
                                </section>
                            </motion.div>
                        )}

                        {activeTab === 'registrations' && (
                            <motion.div 
                                key="registrations"
                                initial={{ opacity: 0, x: -10 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                exit={{ opacity: 0, x: 10 }}
                                className="space-y-8"
                            >
                                <div className="flex items-center justify-between">
                                    <h2 className="text-3xl font-black font-outfit text-indigo-400 uppercase tracking-tighter">Registered Participants</h2>
                                    <button className="text-sm font-bold text-gray-500 hover:text-white transition-colors underline underline-offset-4">Export Roster</button>
                                </div>
                                
                                <div className="glass overflow-hidden rounded-2xl border border-white/5">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-white/5 text-[10px] uppercase font-black tracking-widest text-gray-500">
                                                <th className="px-6 py-4">Participant</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4">Joined On</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {registrations?.map((reg, i) => (
                                                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center font-bold text-xs uppercase group-hover:scale-110 transition-transform">
                                                                {reg.userId?.name?.charAt(0) || '?'}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-white">{reg.userId?.name || 'Unknown'}</p>
                                                                <p className="text-xs text-gray-500">{reg.userId?.email || 'N/A'}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                                            reg.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                                        }`}>
                                                            {reg.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 text-sm text-gray-500">
                                                        {new Date(reg.createdAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {(!registrations || registrations.length === 0) && (
                                        <div className="py-20 text-center text-gray-500 font-light italic">No registrations found for this event yet.</div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'settings' && (
                            <motion.div 
                                key="settings"
                                initial={{ opacity: 0, x: -10 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                exit={{ opacity: 0, x: 10 }}
                                className="space-y-8 text-center py-20 glass rounded-3xl border-dashed border-white/10"
                            >
                                <h3 className="text-2xl font-bold mb-4">Management Controls</h3>
                                <p className="text-gray-500 max-w-sm mx-auto mb-10">Advanced settings for event organizers are coming soon to the platform.</p>
                                <div className="flex flex-wrap justify-center gap-4">
                                   <button 
                                        onClick={() => navigate(`/events/${event._id}/edit`)}
                                        className="px-8 py-3 rounded-xl bg-indigo-600 font-bold hover:bg-indigo-500 transition-all"
                                    >
                                        Edit Core Details
                                    </button>
                                   <button 
                                        className="px-8 py-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 font-bold hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        Cancel Event
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Side: Registration Card */}
                <div className="lg:col-span-1">
                    <div className="glass-card sticky top-28 p-8 border-indigo-500/20 shadow-2xl shadow-indigo-500/10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-500">
                                <Zap className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-gray-500">Capacity</p>
                                <p className="text-2xl font-black font-outfit">{event.remainingSlots} / <span className="text-gray-600 font-light">{event.capacity}</span> <span className="text-sm font-normal text-gray-500 ml-1">Left</span></p>
                            </div>
                        </div>

                        <div className="space-y-6 mb-10">
                            <div className="flex justify-between items-center text-sm font-medium">
                                <span className="text-gray-400">Standard Access</span>
                                <span className="text-white">{event.fee > 0 ? `₹${event.fee}` : 'Free Registration'}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-medium">
                                <span className="text-gray-400">Network Verification</span>
                                <span className="text-white">Enabled</span>
                            </div>
                            <div className="h-[1px] bg-white/5" />
                            <div className="space-y-2">
                                <p className="text-xs text-gray-500 leading-relaxed italic">By registering, you agree to our Code of Conduct and Participation terms.</p>
                            </div>
                        </div>

                        {user ? (
                            <button
                                onClick={() => registerMutation.mutate()}
                                disabled={registerMutation.isLoading || isFull || isPast || isOrganizer || registerMutation.isSuccess}
                                className={`w-full premium-button group flex items-center justify-center gap-3 overflow-hidden ${
                                    isFull || isPast || isOrganizer || registerMutation.isSuccess
                                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5' 
                                    : 'bg-white text-black hover:bg-indigo-500 hover:text-white shadow-xl shadow-white/5'
                                }`}
                            >
                                <span className="relative z-10 font-black tracking-tight text-lg">
                                    {registerMutation.isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 
                                     registerMutation.isSuccess ? 'Registered' :
                                     isOrganizer ? 'Organizer Access' :
                                     isFull ? 'Sold Out' : isPast ? 'Ended' : 'Join Now'}
                                </span>
                                {!registerMutation.isLoading && !isFull && !isPast && !isOrganizer && !registerMutation.isSuccess && (
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform relative z-10" />
                                )}
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                state={{ from: { pathname: `/events/${id}` } }}
                                className="w-full inline-flex items-center justify-center h-14 rounded-2xl bg-white text-black font-black text-lg hover:bg-gray-200 transition-all active:scale-95"
                            >
                                Sign In to Register
                            </Link>
                        )}

                        {registerMutation.isSuccess && (
                            <motion.p 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 text-center text-green-400 text-sm font-bold flex items-center justify-center gap-2"
                            >
                                <ShieldCheck className="w-4 h-4" /> Registration Verified!
                            </motion.p>
                        )}
                        {registerMutation.isError && (
                            <motion.p 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 text-center text-red-400 text-sm font-bold bg-red-400/10 p-3 rounded-xl border border-red-400/20"
                            >
                                {registerMutation.error?.response?.data?.message || 'Verification Failed'}
                            </motion.p>
                        )}
                    </div>

                    <div className="mt-8 p-6 glass rounded-2xl flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center font-black text-xs">
                           {event.createdBy?.name?.charAt(0) || 'E'}
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] uppercase font-black tracking-wider text-gray-500">Organized By</p>
                            <p className="text-sm font-bold">{event.createdBy?.name || 'Platform Organizer'}</p>
                        </div>
                        <button className="p-2 hover:text-indigo-400 transition-colors">
                            <Mail className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EventDetails;
