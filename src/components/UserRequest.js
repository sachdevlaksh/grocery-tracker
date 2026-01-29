import React, { useState } from 'react';

function UserRequest({ onRequest, switchToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setMessage('Please enter username and password');
      return;
    }
    // Store request in localStorage
    const requests = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
    if (requests.find(u => u.username === username)) {
      setMessage('Request already submitted.');
      return;
    }
    requests.push({ username, password });
    localStorage.setItem('pendingUsers', JSON.stringify(requests));
    setMessage('Request submitted! Wait for admin approval.');
    setUsername('');
    setPassword('');
    if (onRequest) onRequest();
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
        <button type="submit">Request Access</button>
      </form>
      {message && <div style={{ color: 'green', marginTop: 10 }}>{message}</div>}
      <button style={{ marginTop: 10 }} onClick={switchToLogin}>Back to Login</button>
    </div>
  );
}

export default UserRequest;
