import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Dashboard() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      setRole(profile?.role);
    };

    getProfile();
  }, []);

  if (!role) return <div>Loading...</div>;

  return (
    <div>
      <h2>Dashboard</h2>
      {role === 'admin' && <p>Admin - Full access</p>}
      {role === 'manager' && <p>Manager - Add/Edit/Delete products</p>}
      {role === 'user' && <p>User - View profile only</p>}
    </div>
  );
}
