import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Hero from './components/Hero';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import EventList from './pages/Events/EventList';
import EventDetails from './pages/Events/EventDetails';
import OrganizerOnboarding from './pages/Onboarding/OrganizerOnboarding';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/Events/CreateEvent';
import { AuthProvider } from './context/AuthContext';
// import ProtectedRoute from './components/ProtectedRoute'; // Will leverage later

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/events/create" element={<CreateEvent />} />
          <Route path="/events/:id/edit" element={<CreateEvent />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding/organizer" element={<OrganizerOnboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
