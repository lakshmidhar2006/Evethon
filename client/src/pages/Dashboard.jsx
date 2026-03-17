import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { eventsApi } from '../api/eventsApi';
import { registrationsApi } from '../api/registrationsApi';
import { adminApi } from '../api/adminApi';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, MapPin, Plus, Loader2, Search,
    ArrowRight, Clock, Users, Zap, Settings, LogOut, X
} from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Queries
    const { data: myRegistrations, isLoading: loadingRegs } = useQuery({
        queryKey: ['myRegistrations'],
        queryFn: registrationsApi.getMyRegistrations,
        enabled: !!user && !user.isAdmin && !user.organizerEnabled
    });

    const { data: myEvents, isLoading: loadingEvents } = useQuery({
        queryKey: ['myEvents'],
        queryFn: () => eventsApi.getEvents({ organizerId: user?._id || user?.id }),
        enabled: !!user && (user.organizerEnabled || user.isAdmin)
    });

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return <div className="min-h-screen bg-[#0A0A0B]" />;

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">
            {/* Immersive Background Elements */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-aurora" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-aurora delay-5000" />
            </div>

            {/* Navbar */}
            <nav className="sticky top-0 z-50 glass border-b border-white/5 bg-dark-surface/80">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold font-outfit tracking-tight">Eventhon</span>
                    </Link>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-sm font-medium text-gray-400 capitalize">
                                {user.isAdmin ? 'System Admin' : user.organizerEnabled ? 'Professional Organizer' : 'Student Participant'}
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/10 hover:text-red-400 border border-white/5 transition-all"
                            title="Sign Out"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
                {/* Hero Greeting */}
                <header className="mb-16">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
                    >
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black font-outfit mb-4">
                                Hello, <span className="premium-gradient-text">{user.name?.split(' ')[0] || 'Member'}</span>
                            </h1>
                            <p className="text-gray-400 text-lg max-w-xl font-light leading-relaxed">
                                Welcome back to your workspace. {user.isAdmin ? 'Manage the platform ecosystem and approvals.' : user.organizerEnabled ? 'Track your events and analyze engagement.' : 'Discover and manage your event registrations.'}
                            </p>
                        </div>
                        
                        {!user.isAdmin && !user.organizerEnabled && (
                            <Link 
                                to="/events"
                                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black font-bold shadow-xl shadow-white/5 hover:bg-gray-200 transition-all hover:-translate-y-1"
                            >
                                <Search className="w-5 h-5" /> Browse Events
                            </Link>
                        )}
                    </motion.div>
                </header>

                {/* Dashboard Content */}
                <div className="transition-all duration-500">
                    {user.isAdmin ? (
                        <AdminDashboard logOut={handleLogout} />
                    ) : user.organizerEnabled ? (
                        <OrganizerDashboard events={myEvents} loading={loadingEvents} navigate={navigate} user={user} />
                    ) : (
                        <StudentDashboard registrations={myRegistrations} loading={loadingRegs} />
                    )}
                </div>
            </main>
        </div>
    );
};

// --- Sub-components with Premium Polish ---

const StudentDashboard = ({ registrations, loading }) => {
    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            <span className="text-gray-500 font-medium">Synchronizing your registrations...</span>
        </div>
    );

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold font-outfit">My Schedule</h2>
                    <p className="text-sm text-gray-500">Events you are planning to attend</p>
                </div>
            </div>

            {registrations?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {registrations.map((reg, idx) => (
                        <motion.div
                            key={reg._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card group"
                        >
                            <div className="aspect-video rounded-xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 mb-6 relative overflow-hidden">
                                <div className="absolute inset-0 bg-black/20" />
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-heavy tracking-widest ${
                                        reg.status === 'confirmed' ? 'bg-green-500 text-black' : 'bg-yellow-500 text-black'
                                    }`}>
                                        {reg.status}
                                    </span>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{reg.event?.title}</h3>
                            
                            <div className="space-y-3 mb-6 font-light text-gray-400 text-sm">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-indigo-500" />
                                    {new Date(reg.event?.schedule?.start).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-indigo-500" />
                                    {reg.event?.location?.address || 'Virtual Arena'}
                                </div>
                            </div>

                            <Link 
                                to={`/events/${reg.event?._id}`}
                                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white hover:text-black font-bold transition-all"
                            >
                                Details <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass rounded-3xl p-16 text-center border-dashed border-white/10"
                >
                    <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                        <Calendar className="w-10 h-10 text-indigo-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">No Upcoming Events</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-10 text-lg">
                        Your schedule looks clear. Why not explore some of the amazing hackathons and workshops happening now?
                    </p>
                    <Link
                        to="/events"
                        className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-white text-black font-bold shadow-xl hover:scale-105 transition-all"
                    >
                        Explore Events <Zap className="w-5 h-5 text-indigo-600" />
                    </Link>
                </motion.div>
            )}
        </div>
    );
};

const OrganizerDashboard = ({ events, loading, navigate, user }) => {
    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            <span className="text-gray-500">Retrieving your portfolio...</span>
        </div>
    );

    const stats = {
        total: events?.length || 0,
        published: events?.filter(e => e.status === 'published').length || 0,
        pending: events?.filter(e => e.status === 'submitted').length || 0,
        participants: events?.reduce((acc, e) => acc + (e.registrations?.length || 0), 0) || 0
    };

    return (
        <div className="space-y-12">
            {/* Contextual Banner for Pending Organizers */}
            {user.organizerStatus === 'pending' && (!events || events.length === 0) && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass rounded-3xl p-12 text-center border-yellow-500/20 relative overflow-hidden mb-12"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                    <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                        <Clock className="w-10 h-10 text-yellow-500 animate-pulse" />
                    </div>
                    <h3 className="text-3xl font-black mb-4 font-outfit uppercase tracking-tight">Profile Verification In Progress</h3>
                    <p className="text-gray-400 max-w-lg mx-auto mb-8 text-lg font-light leading-relaxed">
                        Our team is reviewing your credentials. You'll gain full hosting capabilities once verified. This typically takes 24 hours.
                    </p>
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 text-sm font-bold uppercase tracking-widest">
                        Status: Under Evaluation
                    </div>
                </motion.div>
            )}

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Events', value: stats.total, icon: Calendar, color: 'text-indigo-400' },
                    { label: 'Live Events', value: stats.published, icon: Zap, color: 'text-green-400' },
                    { label: 'Under Evaluation', value: stats.pending, icon: Clock, color: 'text-yellow-400' },
                    { label: 'Total Participants', value: stats.participants, icon: Users, color: 'text-purple-400' }
                ].map((stat, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-[10px] font-heavy uppercase tracking-[0.2em]">{stat.label}</p>
                                <p className="text-3xl font-black font-outfit mt-1 tracking-tight">{stat.value}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold font-outfit uppercase tracking-tight">Managed Portfolio</h2>
                    <p className="text-sm text-gray-500">Orchestrate and monitor your event lifecycle</p>
                </div>
                {user.organizerStatus === 'approved' && (
                    <button
                        onClick={() => navigate('/events/create')}
                        className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 uppercase text-xs tracking-widest"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> 
                        Deploy Event
                    </button>
                )}
            </div>

            {events?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event, idx) => (
                        <motion.div
                            key={event._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card group overflow-hidden p-0 border border-white/5 hover:border-white/20"
                        >
                            <div className="h-44 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent z-10" />
                                <div className="absolute inset-0 bg-indigo-600/20 group-hover:bg-indigo-600/30 transition-colors" />
                                <div className="absolute top-4 right-4 z-20">
                                    <span className={`px-3 py-1.5 rounded-xl text-[10px] uppercase font-black tracking-widest border backdrop-blur-md ${
                                        event.status === 'published' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                        event.status === 'submitted' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                        'bg-gray-500/20 text-gray-400 border-gray-500/30'
                                    }`}>
                                        {event.status === 'submitted' ? 'Under Evaluation' : event.status}
                                    </span>
                                </div>
                                <div className="absolute bottom-4 left-6 z-20">
                                    <h3 className="text-xl font-bold font-outfit text-white mb-1 uppercase tracking-tight">{event.title}</h3>
                                    <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                                        <Users className="w-3.5 h-3.5 text-indigo-500" /> {event.registrations?.length || 0} Participants Registered
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-white/[0.01]">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                            <p className="text-[10px] uppercase text-gray-500 font-heavy tracking-wider">Inventory</p>
                                        </div>
                                        <p className="text-sm font-bold text-white">{event.remainingSlots} / {event.totalSlots} Slots Open</p>
                                    </div>
                                    <Link 
                                        to={`/events/${event._id}`}
                                        className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white hover:text-black text-[10px] uppercase font-black tracking-widest transition-all"
                                    >
                                        Monitor
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : user.organizerStatus === 'approved' ? (
                <div className="glass rounded-3xl p-20 text-center border-dashed border-white/10">
                    <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-indigo-400">
                        <Plus className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 uppercase tracking-tight">Initiate Your Legacy</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-10 text-lg font-light leading-relaxed">
                        Your workspace is ready. Launch your first event to start building your community.
                    </p>
                    <button
                        onClick={() => navigate('/events/create')}
                        className="px-12 py-5 rounded-2xl bg-white text-black font-black shadow-2xl hover:scale-105 transition-all uppercase text-xs tracking-widest"
                    >
                        Create Your First Event
                    </button>
                </div>
            ) : null}
        </div>
    );
};

const AdminDashboard = () => {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'active' | 'partners'

    const { data: allEvents, isLoading } = useQuery({
        queryKey: ['adminEvents'],
        queryFn: () => eventsApi.getEvents(), 
    });

    const { data: pendingOrganizers, isLoading: loadingPartners } = useQuery({
        queryKey: ['pendingOrganizers'],
        queryFn: adminApi.getPendingOrganizers,
        enabled: activeTab === 'partners'
    });

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

    const approvePartnerMutation = useMutation({
        mutationFn: adminApi.approveOrganizer,
        onSuccess: () => {
            queryClient.invalidateQueries(['pendingOrganizers']);
        }
    });

    const rejectPartnerMutation = useMutation({
        mutationFn: adminApi.rejectOrganizer,
        onSuccess: () => {
            queryClient.invalidateQueries(['pendingOrganizers']);
        }
    });

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            <span className="text-gray-500">Accessing system control...</span>
        </div>
    );

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold font-outfit uppercase tracking-tight">System Control Center</h2>
                    <p className="text-sm text-gray-500">Global ecosystem oversight and quality control</p>
                </div>
                
                <div className="p-1.5 glass rounded-2xl flex gap-1 self-start overflow-x-auto max-w-full no-scrollbar">
                    {[
                        { id: 'pending', label: 'Review Queue', count: pendingEvents.length },
                        { id: 'active', label: 'Active Roster', count: activeEvents.length },
                        { id: 'partners', label: 'Partnership Requests', count: pendingOrganizers?.length || 0 }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                                activeTab === tab.id 
                                ? 'bg-white text-black shadow-lg shadow-white/10' 
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {tab.label} 
                            {tab.count > 0 && (
                                <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[10px] ${
                                    activeTab === tab.id ? 'bg-black text-white' : 'bg-white/10 text-gray-400'
                                }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div 
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                >
                    {activeTab === 'partners' ? (
                        loadingPartners ? (
                            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
                        ) : pendingOrganizers?.length > 0 ? (
                            pendingOrganizers.map((user, idx) => (
                                <motion.div 
                                    key={user._id} 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="glass-card flex items-center justify-between group p-6"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                                            <Users className="w-6 h-6 text-indigo-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold font-outfit uppercase tracking-tight">{user.organizerProfile?.organizationName || user.name}</h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-500 font-light">
                                                <span>{user.email}</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-700" />
                                                <span>{user.organizerProfile?.experienceLevel || 'New Partner'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => approvePartnerMutation.mutate(user._id)}
                                            className="px-6 py-2.5 bg-green-500 text-black font-heavy rounded-xl hover:bg-green-400 transition-all text-sm uppercase tracking-wider"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => rejectPartnerMutation.mutate(user._id)}
                                            className="px-4 py-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <EmptyQueue label="All partnership requests handled." />
                        )
                    ) : (
                        (activeTab === 'pending' ? pendingEvents : activeEvents).length > 0 ? (
                            (activeTab === 'pending' ? pendingEvents : activeEvents).map((event, idx) => (
                                <motion.div
                                    key={event._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="glass-card hover:bg-white/[0.03] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 p-6"
                                >
                                    <div className="flex items-center gap-6 flex-1">
                                        <div className={`p-4 rounded-2xl ${
                                            event.status === 'published' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                                        }`}>
                                            <Zap className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold font-outfit mb-1 uppercase tracking-tight">{event.title}</h3>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-light">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="w-4 h-4 text-indigo-400/80" /> {new Date(event.schedule?.start).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin className="w-4 h-4 text-indigo-400/80" /> {event.location?.address || 'Virtual Arena'}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Users className="w-4 h-4 text-indigo-400/80" /> {event.createdBy?.name || 'Partner'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 w-full lg:w-auto mt-2 lg:mt-0 pt-6 lg:pt-0 border-t lg:border-t-0 border-white/5 lg:justify-end">
                                        {activeTab === 'pending' ? (
                                            <>
                                                <button
                                                    onClick={() => approveMutation.mutate(event._id)}
                                                    disabled={approveMutation.isLoading}
                                                    className="flex-1 lg:flex-none px-8 py-3 bg-white text-black font-black rounded-xl hover:bg-green-500 transition-colors disabled:opacity-50 shadow-xl shadow-white/5 uppercase text-xs tracking-widest"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const reason = prompt('Provide feedback for rejection:');
                                                        if (reason) rejectMutation.mutate({ id: event._id, reason });
                                                    }}
                                                    disabled={rejectMutation.isLoading}
                                                    className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                                                >
                                                    <X className="w-6 h-6" />
                                                </button>
                                            </>
                                        ) : (
                                            <Link 
                                                to={`/events/${event._id}`} 
                                                className="px-8 py-3 glass rounded-xl font-black bg-white/5 hover:bg-white hover:text-black transition-all text-xs uppercase tracking-widest"
                                            >
                                                Inspector
                                            </Link>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <EmptyQueue label={`No ${activeTab} items requiring attention.`} />
                        )
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

const EmptyQueue = ({ label }) => (
    <div className="glass rounded-3xl py-24 text-center border-dashed border-white/10">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 opacity-30">
            <Search className="w-8 h-8" />
        </div>
        <p className="text-gray-500 text-lg font-light italic">
            Queue Clear. {label}
        </p>
    </div>
);

export default Dashboard;
