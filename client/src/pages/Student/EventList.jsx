import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { eventsApi } from '../../api/eventsApi';
import EventCard from '../../components/EventCard';
import Loader from '../../components/Loader';
import { Search, Calendar } from 'lucide-react';

const EventList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events', 'published'],
    queryFn: () => eventsApi.getEvents({ status: 'published' }),
  });

  const filteredEvents = events?.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card max-w-md text-center">
          <p className="text-red-400">Failed to load events. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-brand-400 to-brand-600 p-3 rounded-2xl mb-4">
            <Calendar className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Discover Events</h1>
          <p className="text-gray-400 text-lg">Find and register for amazing events</p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-12"
            />
          </div>
        </div>

        {filteredEvents?.length === 0 ? (
          <div className="card max-w-2xl mx-auto text-center">
            <p className="text-gray-400 text-lg">No events found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents?.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList;
