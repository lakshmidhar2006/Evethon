import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../hooks/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowRight, CheckCircle, Store, Phone, Star, ArrowLeft } from 'lucide-react';
import WorkflowVisualization from '../../components/WorkflowVisualization';

const OrganizerOnboarding = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        organizationName: '',
        organizationType: 'Individual', // Individual, Student Club, Company
        contactNumber: '',
        eventCategories: [], // Tech, Cultural, Sports, etc.
        experienceLevel: 'Beginner' // Beginner, Intermediate, Pro
    });

    const updateProfileMutation = useMutation({
        mutationFn: async (data) => {
            const response = await axiosClient.post('/onboarding/organizer', data);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['authUser'], data.user);
            navigate('/dashboard');
        },
        onError: (err) => {
            setError(err.response?.data?.message || 'Onboarding failed');
            setLoading(false);
        }
    });

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        updateProfileMutation.mutate(formData);
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const categories = ['Tech Hackathon', 'Workshop', 'Cultural Fest', 'Sports', 'Seminar', 'Other'];

    if (!user) {
        return (
            <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
        );
    }

    const progress = (step / 3) * 100;

    return (
        <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6 font-sans selection:bg-purple-500/30 overflow-hidden relative">
            {/* Aurora Background */}
            <div className="absolute inset-0 pointer-events-none fixed">
                <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-[#4F46E5]/10 rounded-full blur-[120px] animate-aurora mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#A855F7]/10 rounded-full blur-[120px] animate-aurora delay-2000 mix-blend-screen" />
            </div>

            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

                {/* Left Side: Onboarding Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.3)] relative overflow-hidden"
                >
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                                <span className="font-bold text-white text-lg">{step}</span>
                            </div>
                            <h2 className="text-3xl font-bold text-white tracking-tight">Organizer Setup</h2>
                        </div>
                        <p className="text-gray-400 font-light ml-1">Tell us about your organization to start hosting events.</p>
                    </div>

                    {/* Progress */}
                    <div className="w-full bg-white/5 h-1.5 rounded-full mb-8 relative overflow-hidden">
                        <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            {error}
                        </div>
                    )}

                    {/* Steps */}
                    <div className="min-h-[320px]">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                        <Store className="w-5 h-5 text-purple-400" /> Organization Details
                                    </h3>
                                    <div className="space-y-6">
                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Organization Name</label>
                                            <input
                                                type="text"
                                                value={formData.organizationName}
                                                onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600 font-light"
                                                placeholder="e.g. Coding Club"
                                                autoFocus
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Type</label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {['Individual', 'Student Club', 'Company'].map(type => (
                                                    <button
                                                        key={type}
                                                        onClick={() => setFormData({ ...formData, organizationType: type })}
                                                        className={`px-2 py-3 rounded-xl text-sm font-medium border transition-all ${formData.organizationType === type ? 'bg-white text-black border-white shadow-lg scale-[1.02]' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                                                    >
                                                        {type}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                        <Phone className="w-5 h-5 text-purple-400" /> Contact Info
                                    </h3>
                                    <div className="space-y-6">
                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Contact Number</label>
                                            <input
                                                type="tel"
                                                value={formData.contactNumber}
                                                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600 font-light"
                                                placeholder="+91 99999 99999"
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                        <Star className="w-5 h-5 text-purple-400" /> Preferences
                                    </h3>
                                    <div className="space-y-6">
                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Event Categories</label>
                                            <div className="flex flex-wrap gap-2">
                                                {categories.map(cat => (
                                                    <button
                                                        key={cat}
                                                        onClick={() => {
                                                            const current = formData.eventCategories;
                                                            if (current.includes(cat)) {
                                                                setFormData({ ...formData, eventCategories: current.filter(c => c !== cat) });
                                                            } else {
                                                                setFormData({ ...formData, eventCategories: [...current, cat] });
                                                            }
                                                        }}
                                                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${formData.eventCategories.includes(cat) ? 'bg-purple-500/20 border-purple-500/50 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                                                    >
                                                        {cat}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Experience Level</label>
                                            <select
                                                value={formData.experienceLevel}
                                                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all font-light"
                                            >
                                                <option className="bg-dark-900" value="Beginner">Beginner (First time hosting)</option>
                                                <option className="bg-dark-900" value="Intermediate">Intermediate (Hosted 1-5 events)</option>
                                                <option className="bg-dark-900" value="Pro">Pro (Hosted 5+ events)</option>
                                            </select>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                        {step > 1 ? (
                            <button onClick={prevStep} className="px-6 py-2 rounded-xl text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                        ) : <div></div>}

                        {step < 3 ? (
                            <button onClick={nextStep} className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center gap-2 transform active:scale-95">
                                Next Step <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] flex items-center gap-2 transform active:scale-95"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Complete Onboarding'}
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Right Side: Workflow Visualization */}
                <div className="hidden lg:block space-y-6">
                    <div className="text-center lg:text-left mb-8">
                        <h2 className="text-3xl font-bold text-white mb-3">How it works</h2>
                        <p className="text-gray-400 font-light text-lg max-w-md">
                            We've automated the entire event lifecycle so you can focus on creating great experiences.
                        </p>
                    </div>
                    {/* Assuming WorkflowVisualization is already styled or will fit naturally. 
                        If not, we might need to wrap it in a glass container or verify it. 
                        For now, leaving it as is. */}
                    <WorkflowVisualization />
                </div>

            </div>
        </div>
    );
};

export default OrganizerOnboarding;
