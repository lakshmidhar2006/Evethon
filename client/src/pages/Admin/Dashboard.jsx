import { useQuery } from '@tanstack/react-query';
import { eventsApi } from '../../api/eventsApi';
import Loader from '../../components/Loader';
import { Calendar, Shield, CheckCircle, XCircle } from 'lucide-react';

const AdminDashboard = () => {
  const { data: allEvents, isLoading } = useQuery({
    queryKey: ['admin-all-events'],
    queryFn: () => eventsApi.getEvents({}),
  });

  if (isLoading) return <Loader />;

  const eventsByStatus = {
    draft: allEvents?.filter((e) => e.status === 'draft') || [],
    submitted: allEvents?.filter((e) => e.status === 'submitted') || [],
    approved: allEvents?.filter((e) => e.status === 'approved') || [],
    published: allEvents?.filter((e) => e.status === 'published') || [],
    closed: allEvents?.filter((e) => e.status === 'closed') || [],
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
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-brand-400 to-brand-600 p-3 rounded-2xl mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400 text-lg">Manage all events and approvals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Total Events"
            value={allEvents?.length || 0}
            icon={Calendar}
            color="bg-gradient-to-r from-brand-400 to-brand-600"
          />
          <StatCard
            title="Pending Approval"
            value={eventsByStatus.submitted.length}
            icon={Calendar}
            color="bg-gradient-to-r from-yellow-500 to-yellow-600"
          />
          <StatCard
            title="Published"
            value={eventsByStatus.published.length}
            icon={CheckCircle}
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
          <StatCard
            title="Closed"
            value={eventsByStatus.closed.length}
            icon={XCircle}
            color="bg-gradient-to-r from-red-500 to-red-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">Pending Approvals</h2>
            {eventsByStatus.submitted.length === 0 ? (
              <p className="text-gray-400">No pending approvals</p>
            ) : (
              <div className="space-y-3">
                {eventsByStatus.submitted.slice(0, 5).map((event) => (
                  <div
                    key={event._id}
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4"
                  >
                    <h4 className="font-semibold text-white mb-1">{event.title}</h4>
                    <p className="text-sm text-gray-400 line-clamp-1">{event.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      By: {event.organizer?.name || 'Unknown'}
                    </p>
                  </div>
                ))}
                {eventsByStatus.submitted.length > 5 && (
                  <p className="text-sm text-gray-400 text-center">
                    +{eventsByStatus.submitted.length - 5} more
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold mb-4 text-green-400">Recently Published</h2>
            {eventsByStatus.published.length === 0 ? (
              <p className="text-gray-400">No published events</p>
            ) : (
              <div className="space-y-3">
                {eventsByStatus.published.slice(0, 5).map((event) => (
                  <div
                    key={event._id}
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4"
                  >
                    <h4 className="font-semibold text-white mb-1">{event.title}</h4>
                    <p className="text-sm text-gray-400 line-clamp-1">{event.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-500">
                        {event.registeredCount || 0} / {event.maxParticipants || '∞'} registered
                      </p>
                    </div>
                  </div>
                ))}
                {eventsByStatus.published.length > 5 && (
                  <p className="text-sm text-gray-400 text-center">
                    +{eventsByStatus.published.length - 5} more
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
