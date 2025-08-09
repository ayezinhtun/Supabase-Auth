import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import LogoutButton from './pages/Logout';
import { useAuth } from './context/AuthContext';

function App() {
  const { session, role, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {session && role && (
          <Route path="/dashboard" element={<AdminDashboard role={role} />} />
        )}

        {session && !role && (
          <Route
            path="/dashboard"
            element={
              <div>
                Unauthorized <LogoutButton />
              </div>
            }
          />
        )}

        <Route path="*" element={<Navigate to={session ? "/dashboard" : "/"} />} />
      </Routes>
    </Router>
  );
}

export default App;
