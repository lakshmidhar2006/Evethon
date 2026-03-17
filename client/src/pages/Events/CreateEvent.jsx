import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { eventsApi } from '../../api/eventsApi';
import { motion } from 'framer-motion';
import {
    Calendar, MapPin, Loader2, ArrowLeft, Type, AlignLeft,
    Users, DollarSign, Clock, CheckCircle
} from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';

const CreateEvent = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuth();

    // Redirect if not organizer (double check)
    // useEffect(() => { if (user?.role !== 'organizer') navigate('/dashboard'); }, [user]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        schedule: {
            start: '',
            end: ''
        },
        location: {
            type: 'venue', // venue or online
            address: '', // if venue
            link: '' // if online
        },
        totalSlots: 100,
        fee: 0
    });

    // Fetch event details if in edit mode
    const { data: existingEvent, isLoading: loadingEvent } = useQuery({
        queryKey: ['event', id],
        queryFn: () => eventsApi.getEventById(id),
        enabled: isEditMode,
        onSuccess: (data) => {
            // Populate form
            setFormData({
                title: data.title,
                description: data.description,
                schedule: {
                    start: data.schedule?.start ? new Date(data.schedule.start).toISOString().slice(0, 16) : '',
                    end: data.schedule?.end ? new Date(data.schedule.end).toISOString().slice(0, 16) : ''
                },
                location: {
                    type: data.location?.type || 'venue',
                    address: data.location?.address || '',
                    link: data.location?.link || ''
                },
                totalSlots: data.totalSlots,
                fee: data.fee
            });
        }
    });

    const createMutation = useMutation({
        mutationFn: eventsApi.createEvent,
        onSuccess: () => {
            queryClient.invalidateQueries(['myEvents']);
            setSuccess(true);
            setLoading(false);
        },
        onError: (err) => {
            setError(err.response?.data?.message || 'Failed to create event');
            setLoading(false);
        }
    });

    const updateMutation = useMutation({
        mutationFn: (data) => eventsApi.updateEvent(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['myEvents']);
            queryClient.invalidateQueries(['event', id]);
            // Navigate back to details
            navigate(`/events/${id}`);
        },
        onError: (err) => {
            setError(err.response?.data?.message || 'Failed to update event');
            setLoading(false);
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Basic validation
        if (!formData.title || !formData.description || !formData.schedule.start || !formData.schedule.end) {
            setError('Please fill in all required fields');
            setLoading(false);
            return;
        }

        if (isEditMode) {
            updateMutation.mutate(formData);
        } else {
            createMutation.mutate(formData);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    if (user?.organizerStatus === 'pending') {
        return (
            <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6 font-sans selection:bg-purple-500/30 overflow-hidden relative">
                {/* Aurora Background */}
                <div className="absolute inset-0 pointer-events-none fixed">
                    <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-[#4F46E5]/10 rounded-full blur-[120px] animate-aurora mix-blend-screen" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#A855F7]/10 rounded-full blur-[120px] animate-aurora delay-2000 mix-blend-screen" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.3)] relative z-10 text-center flex flex-col items-center"
                >
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                        <Clock className="w-10 h-10 text-yellow-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
                    <p className="text-gray-400 mb-8 font-light">
                        Your organizer application is currently under review. Please wait for admin approval before creating events.
                    </p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </motion.div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6 font-sans selection:bg-purple-500/30 overflow-hidden relative">
                {/* Aurora Background */}
                <div className="absolute inset-0 pointer-events-none fixed">
                    <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-[#4F46E5]/10 rounded-full blur-[120px] animate-aurora mix-blend-screen" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#A855F7]/10 rounded-full blur-[120px] animate-aurora delay-2000 mix-blend-screen" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.3)] relative z-10 text-center"
                >
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Submission Successful</h2>
                    <p className="text-gray-400 mb-8">
                        Your event has been submitted. Kindly wait for the approval of admin to go live.
                    </p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6 font-sans selection:bg-purple-500/30 overflow-hidden relative" >
            {/* Aurora Background */}
            < div className="absolute inset-0 pointer-events-none fixed" >
                <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-[#4F46E5]/10 rounded-full blur-[120px] animate-aurora mix-blend-screen" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#A855F7]/10 rounded-full blur-[120px] animate-aurora delay-2000 mix-blend-screen" />
            </div >

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-4xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.3)] relative z-10"
            >
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </button>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">{isEditMode ? 'Edit Event' : 'Create New Event'}</h1>
                    <p className="text-gray-400 font-light">{isEditMode ? 'Update your event details.' : 'Fill in the details to publish your event.'}</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Basic Info */}
                    <div className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Event Title</label>
                            <div className="relative group">
                                <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600 font-light"
                                    placeholder="e.g. Annual Hackathon 2024"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Description</label>
                            <div className="relative group">
                                <AlignLeft className="absolute left-4 top-4 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="5"
                                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600 font-light resize-none"
                                    placeholder="Describe your event..."
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Start Date & Time</label>
                                <div className="relative group">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                                    <input
                                        type="datetime-local"
                                        name="schedule.start"
                                        value={formData.schedule.start}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600 font-light text-sm" // smaller text for date input
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">End Date & Time</label>
                                <div className="relative group">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                                    <input
                                        type="datetime-local"
                                        name="schedule.end"
                                        value={formData.schedule.end}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600 font-light text-sm"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Location ({formData.location.type})</label>
                            <div className="flex gap-2 mb-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData(p => ({ ...p, location: { ...p.location, type: 'venue', link: '' } }))}
                                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all ${formData.location.type === 'venue' ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-gray-400'}`}
                                >
                                    Venue
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(p => ({ ...p, location: { ...p.location, type: 'online', address: '' } }))}
                                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all ${formData.location.type === 'online' ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-gray-400'}`}
                                >
                                    Online
                                </button>
                            </div>

                            <div className="relative group">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                                {formData.location.type === 'venue' ? (
                                    <input
                                        type="text"
                                        name="location.address"
                                        value={formData.location.address}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600 font-light"
                                        placeholder="Address / Hall Number"
                                        required
                                    />
                                ) : (
                                    <input
                                        type="url"
                                        name="location.link"
                                        value={formData.location.link}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600 font-light"
                                        placeholder="Meeting Link (e.g. Zoom, Google Meet)"
                                        required
                                    />
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Success Slots</label>
                                <div className="relative group">
                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                                    <input
                                        type="number"
                                        name="totalSlots"
                                        min="1"
                                        value={formData.totalSlots}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600 font-light"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Fee (₹)</label>
                                <div className="relative group">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                                    <input
                                        type="number"
                                        name="fee"
                                        min="0"
                                        value={formData.fee}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600 font-light"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="md:col-span-2 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] flex items-center justify-center gap-2 transform active:scale-[0.99]"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isEditMode ? 'Update Event' : 'Submit Event')}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div >
    );
};

export default CreateEvent;
