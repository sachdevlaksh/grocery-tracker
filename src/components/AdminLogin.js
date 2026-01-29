import React, { useState } from 'react';

const ADMIN_CREDENTIALS = { username: 'admin', password: 'admin123' };

function AdminLogin({ onAdminLogin, switchToUserLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setError('');
      onAdminLogin();
    } else {
      setError('Invalid admin credentials');
    }
  };

  return (
    <div className="login-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Admin username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
      <button style={{ marginTop: 10 }} onClick={switchToUserLogin}>User Login</button>
    </div>
  );
}

export default AdminLogin;
