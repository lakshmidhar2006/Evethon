import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Users, Calendar, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'organizer':
        return <Users className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'organizer':
        return '/organizer/dashboard';
      default:
        return '/events';
    }
  };

  return (
    <nav className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={user ? getDashboardLink() : '/'} className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-brand-400 to-brand-600 p-2 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
              EventSphere
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/events" className="text-gray-300 hover:text-white transition-colors">
                  Events
                </Link>

                {user.role === 'student' && (
                  <Link to="/my-registrations" className="text-gray-300 hover:text-white transition-colors">
                    My Registrations
                  </Link>
                )}

                {user.role === 'organizer' && (
                  <>
                    <Link to="/organizer/dashboard" className="text-gray-300 hover:text-white transition-colors">
                      Dashboard
                    </Link>
                    <Link to="/organizer/create" className="text-gray-300 hover:text-white transition-colors">
                      Create Event
                    </Link>
                  </>
                )}

                {user.role === 'admin' && (
                  <>
                    <Link to="/admin/dashboard" className="text-gray-300 hover:text-white transition-colors">
                      Dashboard
                    </Link>
                    <Link to="/admin/approvals" className="text-gray-300 hover:text-white transition-colors">
                      Approvals
                    </Link>
                    <Link to="/admin/reports" className="text-gray-300 hover:text-white transition-colors">
                      Reports
                    </Link>
                  </>
                )}

                <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                  {getRoleIcon()}
                  <span className="text-sm text-gray-300">{user.email}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
