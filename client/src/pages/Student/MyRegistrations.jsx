import { useQuery } from '@tanstack/react-query';
import { registrationsApi } from '../../api/registrationsApi';
import Loader from '../../components/Loader';
import { Calendar, MapPin, CheckCircle, Clock } from 'lucide-react';

const MyRegistrations = () => {
  const { data: registrations, isLoading, error } = useQuery({
    queryKey: ['my-registrations'],
    queryFn: registrationsApi.getMyRegistrations,
  });

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card max-w-md text-center">
          <p className="text-red-400">Failed to load registrations. Please try again.</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', icon: Clock },
      confirmed: { color: 'bg-green-500/20 text-green-300 border-green-500/30', icon: CheckCircle },
      cancelled: { color: 'bg-red-500/20 text-red-300 border-red-500/30', icon: Calendar },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.color} flex items-center space-x-1`}>
        <Icon className="w-3 h-3" />
        <span>{status.toUpperCase()}</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-brand-400 to-brand-600 p-3 rounded-2xl mb-4">
            <Calendar className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">My Registrations</h1>
          <p className="text-gray-400 text-lg">View all your event registrations</p>
        </div>

        {registrations?.length === 0 ? (
          <div className="card max-w-2xl mx-auto text-center">
            <p className="text-gray-400 text-lg mb-4">You haven't registered for any events yet.</p>
            <a href="/events" className="btn-primary inline-block">
              Browse Events
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {registrations?.map((registration) => (
              <div key={registration._id} className="card">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-2xl font-bold text-white">
                        {registration.event?.title || 'Event'}
                      </h3>
                      {getStatusBadge(registration.status)}
                    </div>

                    <p className="text-gray-400 mb-4 line-clamp-2">
                      {registration.event?.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                      {registration.event?.startDate && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-brand-400" />
                          <span>
                            {new Date(registration.event.startDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      {registration.event?.location && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-brand-400" />
                          <span>{registration.event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    {registration.event?.fee > 0 && (
                      <div className="mb-2">
                        <p className="text-sm text-gray-400">Amount Paid</p>
                        <p className="text-xl font-bold text-brand-400">
                          ₹{registration.event.fee}
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      Registered on {new Date(registration.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRegistrations;
