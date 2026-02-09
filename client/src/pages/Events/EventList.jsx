import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { eventsApi } from '../../api/eventsApi';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Search, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const EventList = () => {
    const [search, setSearch] = useState('');

    const { data: events, isLoading, error } = useQuery({
        queryKey: ['events'],
        queryFn: () => eventsApi.getEvents({ status: 'published' })
    });

    const filteredEvents = events?.filter(event =>
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase())
    );

    if (isLoading) return (
        <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center text-red-400">
            Error loading events
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white p-6 md:p-12 font-sans selection:bg-purple-500/30 overflow-hidden relative">
            {/* Aurora Background */}
            <div className="absolute inset-0 pointer-events-none fixed">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#4F46E5]/10 rounded-full blur-[120px] animate-aurora mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#A855F7]/10 rounded-full blur-[120px] animate-aurora delay-2000 mix-blend-screen" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">Explore Events</h1>
                        <p className="text-gray-400 font-light text-lg">Discover what's happening on campus</p>
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-96 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl pl-12 pr-6 py-3.5 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600 text-white font-light shadow-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredEvents?.length > 0 ? (
                        filteredEvents.map((event, index) => (
                            <motion.div
                                key={event._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden hover:border-purple-500/30 hover:bg-white/10 transition-all duration-300 group shadow-lg flex flex-col h-full"
                            >
                                {/* Image Placeholder / Gradient */}
                                <div className="h-56 bg-gradient-to-br from-blue-900/40 to-purple-900/40 relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                    <div className="absolute top-4 right-4">
                                        <span className={`px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider border border-white/10 ${event.status === 'published' ? 'text-green-400 border-green-500/20' : 'text-gray-400'}`}>
                                            {event.status}
                                        </span>
                                    </div>
                                    {/* Date Badge */}
                                    <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 flex flex-col items-center min-w-[60px]">
                                        <span className="text-xs font-medium text-purple-300 uppercase">{new Date(event.schedule?.start).toLocaleString('default', { month: 'short' })}</span>
                                        <span className="text-xl font-bold text-white leading-none">{new Date(event.schedule?.start).getDate()}</span>
                                    </div>
                                </div>

                                <div className="p-7 flex flex-col flex-grow">
                                    <div className="mb-4">
                                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors line-clamp-1">{event.title}</h3>
                                        <p className="text-gray-400 text-sm line-clamp-2 font-light leading-relaxed">
                                            {event.description}
                                        </p>
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <MapPin className="w-4 h-4 text-purple-400" />
                                            <span className="truncate max-w-[120px]">{event.location?.type === 'venue' ? (event.location.address || 'On Campus') : 'Online'}</span>
                                        </div>

                                        <Link
                                            to={`/events/${event._id}`}
                                            className="px-5 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-gray-200 transition-all flex items-center gap-2 transform group-hover:translate-x-1"
                                        >
                                            Details <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-32 text-gray-500 bg-white/5 rounded-3xl border border-white/5 border-dashed">
                            <Calendar className="w-12 h-12 mb-4 opacity-20" />
                            <p className="text-lg">No events found matching your search.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default EventList;
