import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import UserProfile from './pages/UserDashboard';

function App() {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (window.location.hash) {
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState(null, '', cleanUrl);
  }
}, []);


  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (session?.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
           .maybeSingle();

        if (error) {
          console.error('Error fetching role:', error);
        } else {
          setRole(data.role);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [session]);


  useEffect(() => {
  const getProfile = async (user) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (error || !data) {
      // Profile missing, create it
      const { error: insertError } = await supabase.from('profiles').insert([
        {
          id: user.id,
          email: user.email,
          role: 'user', // default role for new OAuth users
        },
      ]);
      if (insertError) console.error('Error creating profile:', insertError);
    }
  };

  const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      getProfile(session.user);
    }
  });

  // Also check current session on mount
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.user) getProfile(session.user);
  });

  return () => {
    authListener.subscription.unsubscribe();
  };
}, []);


  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />

        {session && role === 'admin' && (
          <Route path="/dashboard" element={<AdminDashboard />} />
        )}

        {session && role === 'manager' && (
          <Route path="/dashboard" element={<ManagerDashboard />} />
        )}

        {session && role === 'user' && (
          <Route path="/dashboard" element={<UserProfile />} />
        )}

        {/* If logged in but role is unknown */}
        {session && !role && <Route path="/dashboard" element={<div>Unauthorized</div>} />}

        {/* Default fallback */}
        <Route path="*" element={<Navigate to={session ? "/dashboard" : "/"} />} />
      </Routes>
    </Router>
  );
}

export default App;
