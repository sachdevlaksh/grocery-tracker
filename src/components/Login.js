
import React, { useState } from 'react';


function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please enter username and password');
      return;
    }
    const users = JSON.parse(localStorage.getItem('groceryUsers') || '{}');
    if (users[username]) {
      // Login
      if (users[username] !== password) {
        setError('Incorrect password');
        return;
      }
      setError('');
      onLogin(username);
    } else {
      setError('User not approved yet. Please request access or wait for admin approval.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login / Signup</h2>
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
        <button type="submit">Continue</button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
    </div>
  );
}

export default Login;
