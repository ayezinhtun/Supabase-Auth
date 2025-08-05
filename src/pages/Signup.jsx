import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    const { data: signupData, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage({ type: 'danger', text: error.message });
    } else {
      const user = signupData.user;
      if (user) {
        await supabase.from('profiles').insert([
          { id: user.id, email: user.email, role: 'user' },
        ]);
        setMessage({
          type: 'success',
          text: 'Signed up! Please check your email to confirm.',
        });
        setEmail('');
        setPassword('');
      }
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Sign Up</h2>

        {message.text && (
          <div className={`alert alert-${message.type}`} role="alert">
            {message.text}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label htmlFor="signupEmail" className="form-label">Email address</label>
            <input
              id="signupEmail"
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="signupPassword" className="form-label">Password</label>
            <input
              id="signupPassword"
              type="password"
              className="form-control"
              placeholder="Enter a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
