// ============================================================================
// ADMIN LOGIN COMPONENT
// ============================================================================
// This component displays the login form for admin users to authenticate
// and access the admin dashboard for user management.

import React, { useState } from 'react';

// API endpoint for backend services
const API_URL = "https://grocery-tracker-be.onrender.com/api";

// ============================================================================
// ADMIN LOGIN COMPONENT
// ============================================================================
// Props:
// - onAdminLogin: function to call when admin successfully logs in
// - switchToUserLogin: function to call when switching to user login page
function AdminLogin({ onAdminLogin, switchToUserLogin }) {
  // ============================================================================
  // STATE VARIABLES - Form input fields
  // ============================================================================
  // Admin username entered by user
  const [username, setUsername] = useState('');
  
  // Admin password entered by user
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
  // Purpose: Handle admin login form submission - authenticate admin credentials
  // Called when admin clicks the "Login" button
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    setError(""); // Clear previous errors
    setLoading(true); // Show loading state
    
    try {
      // Make API call to backend admin login endpoint
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (res.ok) {
        // Admin login successful - get authentication token from response
        const data = await res.json();
        // Store token in localStorage for future API calls
        localStorage.setItem('groceryToken', data.token);
        // Notify parent component and navigate to admin dashboard
        onAdminLogin();
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
  // RENDER: Admin login form
  // ============================================================================
  return (
    <div className="login-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        {/* Admin username input field */}
        <input
          type="text"
          placeholder="Admin username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {/* Admin password input field */}
        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* Submit button - disabled while loading */}
        <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      {/* Error message display */}
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
      {/* Link to switch back to user login */}
      <button style={{ marginTop: 10 }} onClick={switchToUserLogin}>User Login</button>
    </div>
  );
}

export default AdminLogin;
