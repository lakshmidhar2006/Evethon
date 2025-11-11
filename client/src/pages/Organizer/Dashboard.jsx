import { useQuery } from '@tanstack/react-query';
import { eventsApi } from '../../api/eventsApi';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader';
import { Calendar, Plus, BarChart3, FileText } from 'lucide-react';

const OrganizerDashboard = () => {
  const { data: myEvents, isLoading } = useQuery({
    queryKey: ['organizer-events'],
    queryFn: () => eventsApi.getEvents({}),
  });

  if (isLoading) return <Loader />;

  const eventsByStatus = {
    draft: myEvents?.filter((e) => e.status === 'draft') || [],
    submitted: myEvents?.filter((e) => e.status === 'submitted') || [],
    approved: myEvents?.filter((e) => e.status === 'approved') || [],
    published: myEvents?.filter((e) => e.status === 'published') || [],
    closed: myEvents?.filter((e) => e.status === 'closed') || [],
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Organizer Dashboard</h1>
            <p className="text-gray-400 text-lg">Manage your events</p>
          </div>
          <Link to="/organizer/create" className="btn-primary flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Create Event</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Total Events"
            value={myEvents?.length || 0}
            icon={Calendar}
            color="bg-gradient-to-r from-brand-400 to-brand-600"
          />
          <StatCard
            title="Draft"
            value={eventsByStatus.draft.length}
            icon={FileText}
            color="bg-gradient-to-r from-gray-500 to-gray-600"
          />
          <StatCard
            title="Pending Approval"
            value={eventsByStatus.submitted.length}
            icon={BarChart3}
            color="bg-gradient-to-r from-yellow-500 to-yellow-600"
          />
          <StatCard
            title="Published"
            value={eventsByStatus.published.length}
            icon={Calendar}
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Your Events</h2>

          {myEvents?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">You haven't created any events yet.</p>
              <Link to="/organizer/create" className="btn-primary inline-block">
                Create Your First Event
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(eventsByStatus).map(([status, events]) =>
                events.length > 0 && (
                  <div key={status}>
                    <h3 className="text-lg font-semibold mb-3 capitalize text-brand-400">
                      {status} ({events.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {events.map((event) => (
                        <Link
                          key={event._id}
                          to={`/organizer/events/${event._id}`}
                          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4 hover:border-brand-400 transition-all duration-300"
                        >
                          <h4 className="font-semibold text-white mb-2">{event.title}</h4>
                          <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                            {event.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(event.startDate).toLocaleDateString()}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
