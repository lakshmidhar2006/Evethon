import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { eventsApi } from '../../api/eventsApi';
import { registrationsApi } from '../../api/registrationsApi';
import { paymentsApi } from '../../api/paymentsApi';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../../components/Loader';
import { Calendar, MapPin, Users, Clock, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsApi.getEventById(id),
  });

  const registerMutation = useMutation({
    mutationFn: registrationsApi.register,
    onSuccess: async (data) => {
      if (event.fee > 0) {
        try {
          const paymentData = await paymentsApi.checkout({
            registrationId: data._id,
            amount: event.fee,
          });

          await paymentsApi.webhook({
            paymentId: paymentData.paymentId,
            status: 'success',
          });

          setSuccess('Registration successful! Payment processed.');
          setTimeout(() => navigate('/my-registrations'), 2000);
        } catch (err) {
          setError('Registration created but payment failed. Please contact support.');
        }
      } else {
        setSuccess('Registration successful!');
        setTimeout(() => navigate('/my-registrations'), 2000);
      }
      setRegistering(false);
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setRegistering(false);
    },
  });

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'student') {
      setError('Only students can register for events.');
      return;
    }

    setError('');
    setSuccess('');
    setRegistering(true);

    registerMutation.mutate({ eventId: id });
  };

  if (isLoading) return <Loader />;

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card max-w-md text-center">
          <p className="text-red-400">Event not found.</p>
        </div>
      </div>
    );
  }

  const isEventFull = event.maxParticipants && event.registeredCount >= event.maxParticipants;
  const canRegister = user?.role === 'student' && event.status === 'published' && !isEventFull;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="card">
          {event.imageUrl && (
            <div className="mb-6 rounded-lg overflow-hidden">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          <h1 className="text-4xl font-bold mb-4">{event.title}</h1>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center space-x-2 text-gray-300">
              <Calendar className="w-5 h-5 text-brand-400" />
              <span>{new Date(event.startDate).toLocaleDateString()}</span>
            </div>

            {event.location && (
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="w-5 h-5 text-brand-400" />
                <span>{event.location}</span>
              </div>
            )}

            {event.maxParticipants && (
              <div className="flex items-center space-x-2 text-gray-300">
                <Users className="w-5 h-5 text-brand-400" />
                <span>
                  {event.registeredCount || 0} / {event.maxParticipants} participants
                </span>
              </div>
            )}

            {event.duration && (
              <div className="flex items-center space-x-2 text-gray-300">
                <Clock className="w-5 h-5 text-brand-400" />
                <span>{event.duration}</span>
              </div>
            )}
          </div>

          <div className="prose prose-invert max-w-none mb-6">
            <p className="text-gray-300 whitespace-pre-wrap">{event.description}</p>
          </div>

          {event.fee > 0 && (
            <div className="flex items-center space-x-2 mb-6 p-4 bg-brand-500/10 border border-brand-500/30 rounded-lg">
              <DollarSign className="w-6 h-6 text-brand-400" />
              <div>
                <p className="text-sm text-gray-400">Registration Fee</p>
                <p className="text-2xl font-bold text-brand-400">₹{event.fee}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-green-400 text-sm">{success}</p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/events')}
              className="btn-outline"
            >
              Back to Events
            </button>

            {canRegister && (
              <button
                onClick={handleRegister}
                className="btn-primary flex-1"
                disabled={registering}
              >
                {registering ? 'Processing...' : event.fee > 0 ? `Register & Pay ₹${event.fee}` : 'Register for Free'}
              </button>
            )}

            {isEventFull && (
              <div className="flex-1 px-6 py-2.5 bg-red-500/10 border border-red-500/30 rounded-lg text-center text-red-400 font-medium">
                Event Full
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
