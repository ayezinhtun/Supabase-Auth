import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

    const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');


  // Email validation: only allow gmail.com, outlook.com, hotmail.com
  const emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|hotmail\.com)$/;
  // Password validation: min 8 chars, at least 1 uppercase and 1 special char
  const passwordPattern = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

  // Email/password signup handler
  const handleSignup = async (e) => {
    e.preventDefault();

     setEmailError('');
    setPasswordError('');

    if (!emailPattern.test(email)) {
      setEmailError('Email is not valid. Use gmail.com, outlook.com, or hotmail.com only.');
      return;
    }

    if (!passwordPattern.test(password)) {
      setPasswordError('Password must be at least 8 characters long, include 1 uppercase letter and 1 special character.');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert('Error signing up: ' + error.message);
      return;
    }

    const user = data.user;
    if (user) {
      const { error: profileError } = await supabase.from('profiles').insert([
        { id: user.id, email: user.email, role: 'user' },
      ]);

      if (profileError) {
        alert('Error creating profile: ' + profileError.message);
        return;
      }

      alert('Signed up! Please check your email to confirm your account.');
      setEmail('');
      setPassword('');
    }
  };

  // OAuth sign-in handler
  const handleOAuthSignIn = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) {
      alert('OAuth sign-in error: ' + error.message);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="card p-4 shadow" style={{ maxWidth: 400, width: '100%' }}>
        <h2 className="text-center mb-4">Sign Up</h2>

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
              {emailError && <div className="text-danger mt-1">* {emailError}</div>}
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
            {passwordError && <div className="text-danger mt-1">* {passwordError}</div>}
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-3">Sign Up</button>
        </form>

        <div className="text-center mb-3">Or sign up with</div>

        <div className="d-flex justify-content-around">
          <button
            onClick={() => handleOAuthSignIn('google')}
            className="btn btn-outline-danger d-flex align-items-center"
            style={{ gap: 8 }}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
              alt="Google"
              style={{ width: 20 }}
            />
            Google
          </button>

          <button
            onClick={() => handleOAuthSignIn('github')}
            className="btn btn-outline-dark d-flex align-items-center"
            style={{ gap: 8 }}
          >
            <img
              src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
              alt="GitHub"
              style={{ width: 20 }}
            />
            GitHub
          </button>

        </div>
      </div>
    </div>
  );
}
