import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { eventsApi } from '../../api/eventsApi';
import { reportsApi } from '../../api/reportsApi';
import Loader from '../../components/Loader';
import { FileText, Download, Calendar, Users } from 'lucide-react';

const Reports = () => {
  const [selectedEventId, setSelectedEventId] = useState('');
  const [downloading, setDownloading] = useState(false);

  const { data: events, isLoading } = useQuery({
    queryKey: ['admin-published-events'],
    queryFn: () => eventsApi.getEvents({ status: 'published' }),
  });

  const handleDownloadReport = async () => {
    if (!selectedEventId) return;

    setDownloading(true);
    try {
      const blob = await reportsApi.getRegistrations({ eventId: selectedEventId });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `event-registrations-${selectedEventId}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download report. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (isLoading) return <Loader />;

  const selectedEvent = events?.find((e) => e._id === selectedEventId);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-brand-400 to-brand-600 p-3 rounded-2xl mb-4">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Registration Reports</h1>
          <p className="text-gray-400 text-lg">Export registration data for published events</p>
        </div>

        <div className="card mb-6">
          <h2 className="text-2xl font-bold mb-6">Download Report</h2>

          <div className="space-y-6">
            <div>
              <label className="label">
                <Calendar className="w-4 h-4 inline mr-2" />
                Select Event
              </label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="input"
              >
                <option value="">-- Select an event --</option>
                {events?.map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.title} ({new Date(event.startDate).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>

            {selectedEvent && (
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">{selectedEvent.title}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-brand-400" />
                    <span>{new Date(selectedEvent.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-brand-400" />
                    <span>
                      {selectedEvent.registeredCount || 0} registrations
                    </span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleDownloadReport}
              className="btn-primary w-full flex items-center justify-center space-x-2"
              disabled={!selectedEventId || downloading}
            >
              <Download className="w-5 h-5" />
              <span>{downloading ? 'Downloading...' : 'Download CSV Report'}</span>
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Published Events</h2>
          {events?.length === 0 ? (
            <p className="text-gray-400">No published events found.</p>
          ) : (
            <div className="space-y-3">
              {events?.map((event) => (
                <div
                  key={event._id}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4 hover:border-brand-400 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedEventId(event._id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">{event.title}</h4>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-brand-400" />
                          <span>{new Date(event.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-brand-400" />
                          <span>
                            {event.registeredCount || 0} /{' '}
                            {event.maxParticipants || '∞'} registered
                          </span>
                        </div>
                      </div>
                    </div>
                    {event.fee > 0 && (
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Total Revenue</p>
                        <p className="text-lg font-bold text-brand-400">
                          ₹{(event.registeredCount || 0) * event.fee}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
