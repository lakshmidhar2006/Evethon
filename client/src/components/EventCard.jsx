import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  const getStatusBadge = () => {
    const statusColors = {
      draft: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
      submitted: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      approved: 'bg-green-500/20 text-green-300 border-green-500/30',
      published: 'bg-brand-500/20 text-brand-300 border-brand-500/30',
      closed: 'bg-red-500/20 text-red-300 border-red-500/30',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[event.status] || statusColors.draft}`}>
        {event.status.toUpperCase()}
      </span>
    );
  };

  return (
    <Link to={`/events/${event._id}`}>
      <div className="card hover:scale-105 cursor-pointer group">
        {event.imageUrl && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        )}

        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-white group-hover:text-brand-400 transition-colors">
            {event.title}
          </h3>
          {getStatusBadge()}
        </div>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-2 text-sm text-gray-300">
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
              <span>
                {event.registeredCount || 0} / {event.maxParticipants} participants
              </span>
            </div>
          )}

          {event.duration && (
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-brand-400" />
              <span>{event.duration}</span>
            </div>
          )}
        </div>

        {event.fee && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Registration Fee</span>
              <span className="text-xl font-bold text-brand-400">₹{event.fee}</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default EventCard;
