import React, { useState } from 'react';

function UserRequest({ onRequest, switchToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setMessage('Please enter username and password');
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("https://grocery-tracker-be.onrender.com/api/register", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.status === 201) {
        setMessage('Request submitted! Wait for admin approval.');
        setUsername('');
        setPassword('');
        if (onRequest) onRequest();
      } else {
        const err = await res.json();
        setMessage(err.error || 'Registration failed');
      }
    } catch (e) {
      setMessage('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <h2>Request Access</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>{loading ? 'Requesting...' : 'Request Access'}</button>
      </form>
      {message && <div style={{ color: 'green', marginTop: 10 }}>{message}</div>}
      <button style={{ marginTop: 10 }} onClick={switchToLogin}>Back to Login</button>
    </div>
  );
}

export default UserRequest;
