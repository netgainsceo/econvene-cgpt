// Login/Signup form using Supabase
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const fn = isSignUp ? supabase.auth.signUp : supabase.auth.signInWithPassword;
    const { data, error } = await fn({ email, password });
    setLoading(false);
    if (error) return alert(error.message);
    localStorage.setItem('jwt', data.session?.access_token || '');
    window.location.href = '/';
  };

  return (
    <div style={{ maxWidth: 320, margin: '2rem auto' }}>
      <h3>{isSignUp ? 'Sign Up' : 'Login'}</h3>
      <form onSubmit={handleAuth}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={{ width: '100%', marginBottom: 8 }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{ width: '100%', marginBottom: 8 }}
        />
        <button type="submit" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Login'}
        </button>
      </form>
      <p style={{ marginTop: 8 }}>
        {isSignUp ? 'Have an account?' : "Don't have an account?"}{' '}
        <button onClick={() => setIsSignUp(!isSignUp)} style={{ color: 'blue' }}>
          {isSignUp ? 'Login' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
}
