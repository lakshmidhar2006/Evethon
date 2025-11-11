import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import EventList from './pages/Student/EventList';
import EventDetails from './pages/Student/EventDetails';
import MyRegistrations from './pages/Student/MyRegistrations';
import OrganizerDashboard from './pages/Organizer/Dashboard';
import CreateEvent from './pages/Organizer/CreateEvent';
import ManageEvents from './pages/Organizer/ManageEvents';
import AdminDashboard from './pages/Admin/Dashboard';
import Approvals from './pages/Admin/Approvals';
import Reports from './pages/Admin/Reports';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen">
            <Navbar />
            <Routes>
              <Route path="/" element={<Navigate to="/events" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/events" element={<EventList />} />
              <Route path="/events/:id" element={<EventDetails />} />

              <Route
                path="/my-registrations"
                element={
                  <ProtectedRoute roles={['student']}>
                    <MyRegistrations />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/organizer/dashboard"
                element={
                  <ProtectedRoute roles={['organizer', 'admin']}>
                    <OrganizerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizer/create"
                element={
                  <ProtectedRoute roles={['organizer', 'admin']}>
                    <CreateEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizer/events/:id"
                element={
                  <ProtectedRoute roles={['organizer', 'admin']}>
                    <ManageEvents />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/approvals"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <Approvals />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <Reports />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/events" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
