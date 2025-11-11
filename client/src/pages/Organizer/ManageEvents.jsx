import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '../../api/eventsApi';
import { useState } from 'react';
import Loader from '../../components/Loader';
import { Calendar, MapPin, Users, Clock, DollarSign, Send, AlertCircle, CheckCircle } from 'lucide-react';

const ManageEvents = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsApi.getEventById(id),
    onSuccess: (data) => {
      setFormData({
        title: data.title,
        description: data.description,
        startDate: new Date(data.startDate).toISOString().slice(0, 16),
        endDate: data.endDate ? new Date(data.endDate).toISOString().slice(0, 16) : '',
        location: data.location || '',
        maxParticipants: data.maxParticipants || '',
        fee: data.fee || '',
        duration: data.duration || '',
        imageUrl: data.imageUrl || '',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => eventsApi.updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['event', id]);
      queryClient.invalidateQueries(['organizer-events']);
      setSuccess('Event updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to update event.');
    },
  });

  const submitMutation = useMutation({
    mutationFn: () => eventsApi.submitEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['event', id]);
      queryClient.invalidateQueries(['organizer-events']);
      setSuccess('Event submitted for approval!');
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to submit event.');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const eventData = {
      ...formData,
      maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
      fee: formData.fee ? parseFloat(formData.fee) : 0,
    };
    updateMutation.mutate(eventData);
  };

  const handleSubmit = () => {
    submitMutation.mutate();
  };

  if (isLoading || !formData) return <Loader />;

  const canEdit = event.status === 'draft' || event.status === 'approved';
  const canSubmit = event.status === 'draft';

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold">Manage Event</h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                event.status === 'published'
                  ? 'bg-brand-500/20 text-brand-300 border-brand-500/30'
                  : event.status === 'approved'
                  ? 'bg-green-500/20 text-green-300 border-green-500/30'
                  : event.status === 'submitted'
                  ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                  : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
              }`}
            >
              {event.status.toUpperCase()}
            </span>
          </div>

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

          {!isEditing ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
                <p className="text-gray-400">{event.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-gray-300">
                  <Calendar className="w-5 h-5 text-brand-400" />
                  <span>{new Date(event.startDate).toLocaleString()}</span>
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
                    <span>Max: {event.maxParticipants}</span>
                  </div>
                )}
                {event.duration && (
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Clock className="w-5 h-5 text-brand-400" />
                    <span>{event.duration}</span>
                  </div>
                )}
              </div>

              {event.fee > 0 && (
                <div className="flex items-center space-x-2 p-4 bg-brand-500/10 border border-brand-500/30 rounded-lg">
                  <DollarSign className="w-6 h-6 text-brand-400" />
                  <span className="text-xl font-bold text-brand-400">₹{event.fee}</span>
                </div>
              )}

              <div className="flex gap-4">
                <button onClick={() => navigate('/organizer/dashboard')} className="btn-outline">
                  Back to Dashboard
                </button>
                {canEdit && (
                  <button onClick={() => setIsEditing(true)} className="btn-primary">
                    Edit Event
                  </button>
                )}
                {canSubmit && (
                  <button
                    onClick={handleSubmit}
                    className="btn-primary flex items-center space-x-2"
                    disabled={submitMutation.isPending}
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitMutation.isPending ? 'Submitting...' : 'Submit for Approval'}</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="label">Event Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="textarea"
                  rows="4"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Start Date</label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="label">End Date</label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="label">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="label">Max Participants</label>
                  <input
                    type="number"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleChange}
                    className="input"
                    min="1"
                  />
                </div>
                <div>
                  <label className="label">Fee (₹)</label>
                  <input
                    type="number"
                    name="fee"
                    value={formData.fee}
                    onChange={handleChange}
                    className="input"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="label">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="label">Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageEvents;
