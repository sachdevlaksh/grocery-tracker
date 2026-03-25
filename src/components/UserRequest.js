// ============================================================================
// USER REGISTRATION/REQUEST COMPONENT
// ============================================================================
// This component allows new users to request access to the grocery tracker.
// Their request is sent to the backend and must be approved by an admin.

import React, { useState } from 'react';

// ============================================================================
// USER REQUEST COMPONENT
// ============================================================================
// Props:
// - onRequest: function to call after successful registration request
// - switchToLogin: function to call when switching back to login page
function UserRequest({ onRequest, switchToLogin }) {
  // ============================================================================
  // STATE VARIABLES - Form input fields
  // ============================================================================
  // Username desired by the new user
  const [username, setUsername] = useState('');
  
  // Password desired by the new user
  const [password, setPassword] = useState('');
  
  // ============================================================================
  // STATE VARIABLES - UI feedback
  // ============================================================================
  // Message to display to user (success or error message)
  const [message, setMessage] = useState('');
  
  // Flag to show loading state while processing registration
  const [loading, setLoading] = useState(false);

  // ============================================================================
  // FUNCTION: handleSubmit
  // ============================================================================
  // Purpose: Handle user registration form submission
  // Sends registration request to backend for admin approval
  // Called when user clicks the "Request Access" button
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    // VALIDATION: Check if both fields are filled
    if (!username.trim() || !password) {
      setMessage('Please enter username and password');
      return;
    }
    
    setLoading(true); // Show loading state
    setMessage(""); // Clear previous messages
    
    try {
      // Make API call to backend registration endpoint
      const res = await fetch("https://grocery-tracker-be.onrender.com/api/register", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      // Response status 201 indicates successful creation/registration
      if (res.status === 201) {
        // Registration request successful - show success message
        setMessage('Request submitted! Wait for admin approval.');
        // Clear form fields
        setUsername('');
        setPassword('');
        // Notify parent component
        if (onRequest) onRequest();
      } else {
        // Registration failed - get error message from response
        const err = await res.json();
        setMessage(err.error || 'Registration failed');
      }
    } catch (e) {
      // Network error - show generic message
      setMessage('Network error');
    }
    setLoading(false); // Hide loading state
  };

  // ============================================================================
  // RENDER: Registration request form
  // ============================================================================
  return (
    <div className="login-container">
      <h2>Request Access</h2>
      <form onSubmit={handleSubmit}>
        {/* Username input field - desired username for new account */}
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {/* Password input field - desired password for new account */}
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* Submit button - disabled while loading */}
        <button type="submit" disabled={loading}>{loading ? 'Requesting...' : 'Request Access'}</button>
      </form>
      {/* Message display - shows success or error messages */}
      {message && <div style={{ color: 'green', marginTop: 10 }}>{message}</div>}
      {/* Link to switch back to login page */}
      <button style={{ marginTop: 10 }} onClick={switchToLogin}>Back to Login</button>
    </div>
  );
}

export default UserRequest;
