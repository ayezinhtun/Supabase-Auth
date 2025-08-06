import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import LogoutButton from './Logout';

export default function UserDashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('email, role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setProfile(data);
      }

      setLoading(false);
    }

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center mt-5">
        <p className="text-danger">No profile found.</p>
      </div>
    );
  }

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 className="card-title text-center mb-3">User Dashboard</h3>
        
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <strong>Email:</strong> {profile.email}
          </li>
          <li className="list-group-item">
            <strong>Role:</strong> {profile.role}
          </li>
        </ul>
        <LogoutButton/>
      </div>
    </div>
  );
}
