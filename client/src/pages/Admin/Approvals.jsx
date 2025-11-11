import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '../../api/eventsApi';
import { adminApi } from '../../api/adminApi';
import Loader from '../../components/Loader';
import { Calendar, MapPin, Users, CheckCircle, XCircle, Eye, Send } from 'lucide-react';

const Approvals = () => {
  const queryClient = useQueryClient();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filter, setFilter] = useState('submitted');

  const { data: events, isLoading } = useQuery({
    queryKey: ['admin-events', filter],
    queryFn: () => eventsApi.getEvents({ status: filter }),
  });

  const approveMutation = useMutation({
    mutationFn: adminApi.approveEvent,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-events']);
      queryClient.invalidateQueries(['admin-all-events']);
      setSelectedEvent(null);
    },
  });

  const publishMutation = useMutation({
    mutationFn: adminApi.publishEvent,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-events']);
      queryClient.invalidateQueries(['admin-all-events']);
      setSelectedEvent(null);
    },
  });

  const closeMutation = useMutation({
    mutationFn: adminApi.closeEvent,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-events']);
      queryClient.invalidateQueries(['admin-all-events']);
      setSelectedEvent(null);
    },
  });

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-brand-400 to-brand-600 p-3 rounded-2xl mb-4">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Event Approvals</h1>
          <p className="text-gray-400 text-lg">Review and manage event submissions</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          {['submitted', 'approved', 'published'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                filter === status
                  ? 'bg-brand-500 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {events?.length === 0 ? (
          <div className="card max-w-2xl mx-auto text-center">
            <p className="text-gray-400 text-lg">No events with status: {filter}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {events?.map((event) => (
                <div
                  key={event._id}
                  className={`card cursor-pointer ${
                    selectedEvent?._id === event._id ? 'border-brand-400' : ''
                  }`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-white">{event.title}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        event.status === 'published'
                          ? 'bg-brand-500/20 text-brand-300 border-brand-500/30'
                          : event.status === 'approved'
                          ? 'bg-green-500/20 text-green-300 border-green-500/30'
                          : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                      }`}
                    >
                      {event.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-brand-400" />
                      <span>{new Date(event.startDate).toLocaleDateString()}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-brand-400" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.maxParticipants && (
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-brand-400" />
                        <span>Max: {event.maxParticipants}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs text-gray-500">
                      Organizer: {event.organizer?.name || 'Unknown'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              {selectedEvent ? (
                <div className="card">
                  <h2 className="text-2xl font-bold mb-6">Event Details</h2>

                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Title</p>
                      <p className="text-white font-semibold">{selectedEvent.title}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400 mb-1">Description</p>
                      <p className="text-white">{selectedEvent.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Start Date</p>
                        <p className="text-white">
                          {new Date(selectedEvent.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      {selectedEvent.endDate && (
                        <div>
                          <p className="text-sm text-gray-400 mb-1">End Date</p>
                          <p className="text-white">
                            {new Date(selectedEvent.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>

                    {selectedEvent.location && (
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Location</p>
                        <p className="text-white">{selectedEvent.location}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      {selectedEvent.maxParticipants && (
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Max Participants</p>
                          <p className="text-white">{selectedEvent.maxParticipants}</p>
                        </div>
                      )}
                      {selectedEvent.fee > 0 && (
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Fee</p>
                          <p className="text-white">₹{selectedEvent.fee}</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-gray-400 mb-1">Organizer</p>
                      <p className="text-white">
                        {selectedEvent.organizer?.name || 'Unknown'} (
                        {selectedEvent.organizer?.email || 'N/A'})
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {selectedEvent.status === 'submitted' && (
                      <button
                        onClick={() => approveMutation.mutate(selectedEvent._id)}
                        className="btn-primary w-full flex items-center justify-center space-x-2"
                        disabled={approveMutation.isPending}
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>
                          {approveMutation.isPending ? 'Approving...' : 'Approve Event'}
                        </span>
                      </button>
                    )}

                    {selectedEvent.status === 'approved' && (
                      <button
                        onClick={() => publishMutation.mutate(selectedEvent._id)}
                        className="btn-primary w-full flex items-center justify-center space-x-2"
                        disabled={publishMutation.isPending}
                      >
                        <Send className="w-5 h-5" />
                        <span>
                          {publishMutation.isPending ? 'Publishing...' : 'Publish Event'}
                        </span>
                      </button>
                    )}

                    {selectedEvent.status === 'published' && (
                      <button
                        onClick={() => closeMutation.mutate(selectedEvent._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-300 w-full flex items-center justify-center space-x-2"
                        disabled={closeMutation.isPending}
                      >
                        <XCircle className="w-5 h-5" />
                        <span>{closeMutation.isPending ? 'Closing...' : 'Close Event'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="btn-outline w-full"
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>
              ) : (
                <div className="card text-center">
                  <Eye className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Select an event to view details and take action</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Approvals;
