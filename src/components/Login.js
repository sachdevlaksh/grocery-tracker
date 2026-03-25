
// ============================================================================
// USER LOGIN COMPONENT
// ============================================================================
// This component displays the login form for regular users to authenticate
// and access their grocery tracker dashboard.

import React, { useState } from 'react';

// API endpoint for backend services
const API_URL = "https://grocery-tracker-be.onrender.com/api";

// ============================================================================
// LOGIN COMPONENT
// ============================================================================
// Props:
// - onLogin: function to call when user successfully logs in (passes username)
function Login({ onLogin }) {
  // ============================================================================
  // STATE VARIABLES - Form input fields
  // ============================================================================
  // Username entered by user
  const [username, setUsername] = useState('');
  
  // Password entered by user
  const [password, setPassword] = useState('');
  
  // ============================================================================
  // STATE VARIABLES - UI feedback
  // ============================================================================
  // Error message to display to user (empty if no error)
  const [error, setError] = useState('');
  
  // Flag to show loading state while authenticating
  const [loading, setLoading] = useState(false);

  // ============================================================================
  // FUNCTION: handleSubmit
  // ============================================================================
  // Purpose: Handle login form submission - authenticate user credentials
  // Called when user clicks the "Login" button
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    // VALIDATION: Check if both fields are filled
    if (!username.trim() || !password) {
      setError('Please enter username and password');
      return;
    }
    
    setLoading(true); // Show loading state
    setError(''); // Clear previous errors
    
    try {
      // Make API call to backend login endpoint
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (res.ok) {
        // Login successful - get authentication token from response
        const data = await res.json();
        // Store token in localStorage for future API calls
        localStorage.setItem('groceryToken', data.token);
        // Notify parent component of successful login with username
        onLogin(username);
      } else {
        // Login failed - get error message from response
        const err = await res.json();
        setError(err.error || 'Login failed');
      }
    } catch (e) {
      // Network error - show generic message
      setError('Network error');
    }
    setLoading(false); // Hide loading state
  };

  // ============================================================================
  // RENDER: Login form
  // ============================================================================
  return (
    <div className="login-container">
      <h2>User Login</h2>
      <form onSubmit={handleSubmit}>
        {/* Username input field */}
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {/* Password input field */}
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* Submit button - disabled while loading */}
        <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      {/* Error message display */}
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
    </div>
  );
}

export default Login;
