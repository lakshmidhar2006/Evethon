import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { eventsApi } from '../../api/eventsApi';
import { registrationsApi } from '../../api/registrationsApi';
import { useAuth } from '../../hooks/useAuth';
import { Calendar, MapPin, Clock, Users, DollarSign, ArrowLeft, Loader2, CheckCircle, AlertCircle, Trash2, Edit, X } from 'lucide-react';
import { motion } from 'framer-motion';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    // State for registration
    const [registering, setRegistering] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('details'); // 'details', 'registrations', 'settings'

    const { data: event, isLoading } = useQuery({
        queryKey: ['event', id],
        queryFn: () => eventsApi.getEventById(id)
    });

    const { data: registrations, isLoading: loadingRegs } = useQuery({
        queryKey: ['eventRegistrations', id],
        queryFn: () => eventsApi.getRegistrations(id),
        enabled: !!event && !!user && (user.id === event.createdBy || user.role === 'admin')
    });

    const registerMutation = useMutation({
        mutationFn: registrationsApi.register,
        onSuccess: () => {
            setSuccess('Successfully registered!');
            setTimeout(() => navigate('/dashboard'), 2000);
        },
        onError: (err) => {
            setError(err.response?.data?.message || 'Registration failed.');
            setRegistering(false);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: eventsApi.deleteEvent,
        onSuccess: () => {
            navigate('/dashboard');
        }
    });

    const handleRegister = () => {
        if (!user) {
            navigate('/login', { state: { from: { pathname: `/events/${id}` } } });
            return;
        }
        if (user.role !== 'student') {
            setError('Only students can register for events.');
            return;
        }

        setError('');
        setRegistering(true);
        // Simple registration for now, payment integration can be added later
        registerMutation.mutate({ eventId: id });
    };

    if (isLoading) return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
    );

    if (!event) return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center text-white">
            Event not found.
        </div>
    );

    return (
        <div className="min-h-screen bg-dark-900 text-white p-6 md:p-12 font-sans">
            <div className="max-w-4xl mx-auto">

                {/* Back Link */}
                <Link to="/events" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition">
                    <ArrowLeft className="w-4 h-4" /> Back to Events
                </Link>

                <div className="bg-dark-800 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

                    {/* Event Header Image/Gradient */}
                    <div className="h-64 bg-gradient-to-r from-primary-900 to-purple-900 relative">
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${event.status === 'published' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                                }`}>
                                {event.status}
                            </span>
                            <h1 className="text-3xl md:text-5xl font-bold mt-4 text-white shadow-lg">{event.title}</h1>
                        </div>
                    </div>

                    {/* Organizer/Admin Tabs */}
                    {(user && event && (user.id === event.createdBy || user.role === 'admin')) && (
                        <div className="flex border-b border-white/10 bg-dark-900/50">
                            <button
                                onClick={() => setActiveTab('details')}
                                className={`px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'details' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-gray-400 hover:text-white'}`}
                            >
                                Event Details
                            </button>
                            <button
                                onClick={() => setActiveTab('registrations')}
                                className={`px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'registrations' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-gray-400 hover:text-white'}`}
                            >
                                Registrations ({registrations?.length || 0})
                            </button>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'settings' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-gray-400 hover:text-white'}`}
                            >
                                Settings
                            </button>
                        </div>
                    )}

                    <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Main Content */}
                        <div className="md:col-span-2 space-y-8">
                            {activeTab === 'details' && (
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">About Event</h3>
                                    <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">
                                        {event.description}
                                    </p>
                                </div>
                            )}

                            {activeTab === 'registrations' && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white mb-4">Event Registrations</h3>
                                    {loadingRegs ? (
                                        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                                    ) : registrations?.length > 0 ? (
                                        <div className="grid gap-3">
                                            {registrations.map(reg => (
                                                <div key={reg._id} className="bg-white/5 p-4 rounded-xl flex justify-between items-center">
                                                    <div>
                                                        <p className="font-bold text-white">{reg.userId?.name || 'Unknown User'}</p>
                                                        <p className="text-sm text-gray-400">{reg.userId?.email}</p>
                                                    </div>
                                                    <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-md uppercase font-bold">
                                                        {reg.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic">No registrations yet.</p>
                                    )}
                                </div>
                            )}

                            {activeTab === 'settings' && (
                                <div className="space-y-6">
                                    <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl space-y-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="text-lg font-bold text-white mb-1">Actions</h3>
                                                <p className="text-gray-400 text-sm">Manage your event.</p>
                                            </div>
                                            <button
                                                onClick={() => navigate(`/events/${event._id}/edit`)}
                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm flex items-center gap-2 transition"
                                            >
                                                <Edit className="w-4 h-4" /> Edit Event
                                            </button>
                                        </div>

                                        <div className="pt-4 border-t border-red-500/20">
                                            <h3 className="text-lg font-bold text-red-400 mb-2">Danger Zone</h3>
                                            <p className="text-gray-400 text-sm mb-4">
                                                Deleting this event will remove it permanently and cancel all registrations.
                                            </p>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this event? This cannot be undone.')) {
                                                        deleteMutation.mutate(event._id);
                                                    }
                                                }}
                                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm flex items-center gap-2 transition"
                                            >
                                                <Trash2 className="w-4 h-4" /> Delete Event
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Feedback Messages */}
                            {error && (
                                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}
                            {success && (
                                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl">
                                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                    <p>{success}</p>
                                </div>
                            )}

                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            <div className="bg-dark-900/50 rounded-2xl p-6 border border-white/5 space-y-4">
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-primary-400 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-500">Date & Time</p>
                                        <p className="font-medium text-white">
                                            {new Date(event.schedule?.start).toLocaleDateString()}
                                            <span className="block text-sm text-gray-400">
                                                {new Date(event.schedule?.start).toLocaleTimeString()}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-primary-400 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-500">Location</p>
                                        <p className="font-medium text-white">
                                            {event.location?.type === 'online' ? 'Online Event' : event.location?.address || 'TBD'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Users className="w-5 h-5 text-primary-400 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-500">Capacity</p>
                                        <p className="font-medium text-white">
                                            {event.remainingSlots} spots left
                                        </p>
                                    </div>
                                </div>

                                {event.fee > 0 && (
                                    <div className="flex items-start gap-3">
                                        <DollarSign className="w-5 h-5 text-primary-400 mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-500">Registration Fee</p>
                                            <p className="font-medium text-white text-lg">
                                                ₹{event.fee}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleRegister}
                                disabled={registering || success}
                                className={`
                                    w-full py-3.5 px-6 rounded-xl font-bold text-center transition shadow-lg
                                    ${success
                                        ? 'bg-green-600 text-white cursor-default'
                                        : 'bg-gradient-to-r from-primary-600 to-purple-600 hover:opacity-90 text-white'
                                    }
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                `}
                            >
                                {registering ? 'Processing...' : success ? 'Registered' : 'Register Now'}
                            </button>

                            {/* Organizer Info */}
                            <div className="pt-4 border-t border-white/5 text-center">
                                <p className="text-xs text-gray-500">Organized by</p>
                                <p className="text-sm font-medium text-white">{event.createdBy?.name || 'Event Organizer'}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EventDetails;
