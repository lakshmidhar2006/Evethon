import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { eventsApi } from '../../api/eventsApi';
import { Calendar, MapPin, Users, Clock, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    maxParticipants: '',
    fee: '',
    duration: '',
    imageUrl: '',
  });

  const createMutation = useMutation({
    mutationFn: eventsApi.createEvent,
    onSuccess: () => {
      navigate('/organizer/dashboard');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to create event. Please try again.');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const eventData = {
      ...formData,
      maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
      fee: formData.fee ? parseFloat(formData.fee) : 0,
    };

    createMutation.mutate(eventData);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-brand-400 to-brand-600 p-3 rounded-2xl mb-4">
            <Calendar className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Create New Event</h1>
          <p className="text-gray-400 text-lg">Fill in the details to create your event</p>
        </div>

        <div className="card">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">
                <Calendar className="w-4 h-4 inline mr-2" />
                Event Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input"
                placeholder="Enter event title"
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
                placeholder="Describe your event"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Start Date
                </label>
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
                <label className="label">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  End Date
                </label>
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
              <label className="label">
                <MapPin className="w-4 h-4 inline mr-2" />
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input"
                placeholder="Event location"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="label">
                  <Users className="w-4 h-4 inline mr-2" />
                  Max Participants
                </label>
                <input
                  type="number"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  className="input"
                  placeholder="100"
                  min="1"
                />
              </div>

              <div>
                <label className="label">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Fee (₹)
                </label>
                <input
                  type="number"
                  name="fee"
                  value={formData.fee}
                  onChange={handleChange}
                  className="input"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="label">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="input"
                  placeholder="2 hours"
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
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/organizer/dashboard')}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
