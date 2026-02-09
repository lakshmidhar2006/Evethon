import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { eventsApi } from '../api/eventsApi';
import { registrationsApi } from '../api/registrationsApi';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Calendar, MapPin, Plus, Loader2, Search,
    ArrowRight, Clock, Users, Zap, Settings, LogOut
} from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Queries
    const { data: myRegistrations, isLoading: loadingRegs } = useQuery({
        queryKey: ['myRegistrations'],
        queryFn: registrationsApi.getMyRegistrations,
        enabled: !!user && user.role === 'student'
    });

    const { data: myEvents, isLoading: loadingEvents } = useQuery({
        queryKey: ['myEvents'],
        queryFn: () => eventsApi.getEvents({ organizerId: user?._id || user?.id }),
        enabled: !!user && (user.role === 'organizer' || user.role === 'admin')
    });

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return <div className="min-h-screen bg-[#0A0A0B]" />;

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white font-sans selection:bg-purple-500/30 overflow-hidden relative">
            {/* Aurora Background */}
            <div className="absolute inset-0 pointer-events-none fixed">
                <div className="absolute top-[-20%] left-[10%] w-[50%] h-[50%] bg-[#4F46E5]/5 rounded-full blur-[120px] animate-aurora mix-blend-screen" />
                <div className="absolute bottom-[-20%] right-[10%] w-[50%] h-[50%] bg-[#A855F7]/5 rounded-full blur-[120px] animate-aurora delay-2000 mix-blend-screen" />
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 text-2xl font-bold">
                            {user.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Hello, {user.name || 'User'}</h1>
                            <p className="text-gray-400 font-light flex items-center gap-2">
                                <span className="capitalize px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-xs text-purple-300">
                                    {user.role} Account
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                    </div>
                </div>

                {/* Dashboard Content Based on Role */}
                {user.role === 'admin' ? (
                    <AdminDashboard logOut={handleLogout} />
                ) : user.role === 'student' ? (
                    <StudentDashboard registrations={myRegistrations} loading={loadingRegs} />
                ) : (
                    <OrganizerDashboard events={myEvents} loading={loadingEvents} navigate={navigate} />
                )}

            </div>
        </div>
    );
};

// --- Sub-components ---

const StudentDashboard = ({ registrations, loading }) => {
    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Zap className="w-6 h-6 text-yellow-400" /> My Registrations
                </h2>
                <Link to="/events" className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
                    Find more events <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {registrations?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {registrations.map((reg) => (
                        <motion.div
                            key={reg._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors group relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Zap className="w-24 h-24 text-purple-500 transform rotate-12" />
                                </div>

                                <div>
                                    <span className={`inline-block px-2 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold mb-2 ${reg.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                        {reg.status}
                                    </span>
                                    <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{reg.event?.title}</h3>
                                    <p className="text-gray-400 text-sm flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(reg.event?.schedule?.start).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-sm">
                                <span className="text-gray-500">Registered on {new Date(reg.createdAt).toLocaleDateString()}</span>
                                <Link to={`/events/${reg.event?._id}`} className="text-white hover:text-purple-400 transition-colors">
                                    View Details
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="bg-white/5 border border-white/5 border-dashed rounded-3xl p-12 text-center">
                    <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No registrations yet</h3>
                    <p className="text-gray-400 max-w-md mx-auto mb-8">
                        You haven't registered for any events. Explore what's happening on campus!
                    </p>
                    <Link
                        to="/events"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors"
                    >
                        Explore Events <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            )}
        </div>
    );
};

const OrganizerDashboard = ({ events, loading, navigate }) => {
    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-blue-400" /> Managed Events
                </h2>
                <button
                    onClick={() => navigate('/events/create')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-purple-900/20"
                >
                    <Plus className="w-4 h-4" /> Create Event
                </button>
            </div>

            {events?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <motion.div
                            key={event._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all group"
                        >
                            <div className="h-40 bg-gradient-to-br from-gray-800 to-gray-900 relative">
                                <div className="absolute inset-0 bg-black/40" />
                                <div className="absolute top-4 right-4">
                                    <span className={`px-2 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold border ${event.status === 'published' ? 'bg-green-500/20 text-green-400 border-green-500/20' :
                                        event.status === 'submitted' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20' :
                                            'bg-blue-500/20 text-blue-300 border-blue-500/20'
                                        }`}>
                                        {event.status === 'submitted' ? 'Pending Approval' : event.status}
                                    </span>
                                </div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="text-lg font-bold text-white truncate">{event.title}</h3>
                                    <p className="text-sm text-gray-400 flex items-center gap-2">
                                        <Clock className="w-3 h-3" />
                                        {new Date(event.schedule?.start).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 flex items-center justify-between bg-white/[0.02]">
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                    <div className="flex items-center gap-1.5" title="Registrations">
                                        <Users className="w-4 h-4" />
                                        <span>{event.registrations?.length || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5" title="Slots Remaining">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                                        <span>{event.remainingSlots} left</span>
                                    </div>
                                </div>
                                <Link to={`/events/${event._id}`} className="text-sm font-medium text-white hover:text-purple-400 transition-colors">
                                    Manage
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="bg-white/5 border border-white/5 border-dashed rounded-3xl p-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <Plus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Create your first event</h3>
                    <p className="text-gray-400 max-w-sm mx-auto mb-8">
                        Start organizing hackathons, workshops, or meetups for the community.
                    </p>
                    <button
                        onClick={() => navigate('/events/create')}
                        className="px-8 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors"
                    >
                        Create Event
                    </button>
                </div>
            )}
        </div>
    );
};

const AdminDashboard = () => {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'active'

    // Fetch all events - filters applied client side for now or could be API
    const { data: allEvents, isLoading } = useQuery({
        queryKey: ['adminEvents'],
        queryFn: () => eventsApi.getEvents(), // Admin can see all public events? 
        // Ideally we need an endpoint to get ALL events including submitted.
        // The current getEvents might only return published?
        // Let's assume for now getEvents with no params returns what we need or we update later.
        // Actually, listing events usually returns published. 
        // We might need to pass status param.
    });

    // We need separate queries for pending and active if the API filters by default.
    // 'listEvents' in controller filters by status if provided. If not, finds ALL.
    // So 'eventsApi.getEvents()' calling '/events' without params returns ALL events (draft, submitted, approved, published).

    const pendingEvents = allEvents?.filter(e => e.status === 'submitted') || [];
    const activeEvents = allEvents?.filter(e => e.status === 'published') || [];

    const approveMutation = useMutation({
        mutationFn: eventsApi.adminApproveEvent,
        onSuccess: () => {
            queryClient.invalidateQueries(['adminEvents']);
        }
    });

    const rejectMutation = useMutation({
        mutationFn: ({ id, reason }) => eventsApi.adminRejectEvent(id, reason),
        onSuccess: () => {
            queryClient.invalidateQueries(['adminEvents']);
        }
    });

    if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Settings className="w-6 h-6 text-pink-500" /> Admin Control
                </h2>
                <div className="flex bg-white/5 rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'pending' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Pending ({pendingEvents.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'active' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Active ({activeEvents.length})
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {(activeTab === 'pending' ? pendingEvents : activeEvents).map(event => (
                    <motion.div
                        key={event._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white/5 backdrop-blur-md border border-white/5 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/10 transition-colors"
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-2 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold border ${event.status === 'published' ? 'bg-green-500/20 text-green-400 border-green-500/20' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20'
                                    }`}>
                                    {event.status === 'submitted' ? 'Pending Approval' : event.status}
                                </span>
                                <h3 className="text-xl font-bold text-white">{event.title}</h3>
                            </div>
                            <p className="text-gray-400 text-sm flex items-center gap-4">
                                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(event.schedule?.start).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {event.location}</span>
                            </p>
                        </div>

                        {activeTab === 'pending' && (
                            <div className="flex gap-3 w-full md:w-auto">
                                <button
                                    onClick={() => approveMutation.mutate(event._id)}
                                    disabled={approveMutation.isLoading}
                                    className="flex-1 md:flex-none px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold transition-colors disabled:opacity-50"
                                >
                                    {approveMutation.isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Approve'}
                                </button>
                                <button
                                    onClick={() => rejectMutation.mutate({ id: event._id, reason: 'Admin rejected' })}
                                    disabled={rejectMutation.isLoading}
                                    className="flex-1 md:flex-none px-6 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-600/50 rounded-lg font-bold transition-colors disabled:opacity-50"
                                >
                                    Reject
                                </button>
                            </div>
                        )}
                        {activeTab === 'active' && (
                            <div className="flex gap-3 w-full md:w-auto">
                                <Link to={`/events/${event._id}`} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors">
                                    View
                                </Link>
                            </div>
                        )}
                    </motion.div>
                ))}

                {(activeTab === 'pending' ? pendingEvents : activeEvents).length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No {activeTab} events found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
