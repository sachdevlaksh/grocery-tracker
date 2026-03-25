
// ============================================================================
// ADMIN DASHBOARD COMPONENT
// ============================================================================
// This component displays the admin dashboard for managing user access requests.
// Admins can view pending registration requests and approve/reject them.

import React, { useState, useEffect } from 'react';

// API endpoint for backend services
const API_URL = "https://grocery-tracker-be.onrender.com/api";

// ============================================================================
// ADMIN DASHBOARD COMPONENT
// ============================================================================
// Props:
// - onLogout: function to call when admin clicks logout
function AdminDashboard({ onLogout }) {
  // ============================================================================
  // STATE VARIABLES - User data
  // ============================================================================
  // List of users awaiting admin approval
  const [pending, setPending] = useState([]);
  
  // List of all approved users who have access
  const [approved, setApproved] = useState([]);
  
  // ============================================================================
  // STATE VARIABLES - UI feedback
  // ============================================================================
  // Flag to show loading state while fetching or processing
  const [loading, setLoading] = useState(false);
  
  // Error message to display to admin (empty if no error)
  const [error, setError] = useState("");

  // ============================================================================
  // EFFECT: Fetch pending and approved users on component mount
  // ============================================================================
  // Runs once when component loads to get initial data
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        // Get authentication token from localStorage
        const token = localStorage.getItem('groceryToken');
        
        // Make API call to fetch all users and their statuses
        const res = await fetch(`${API_URL}/admin/users`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        
        if (res.ok) {
          // Successfully retrieved user lists
          const data = await res.json();
          setPending(data.pending || []); // Users awaiting approval
          setApproved(data.approved || []); // Already approved users
        } else {
          // Failed to fetch users
          setError('Failed to fetch users');
        }
      } catch {
        // Network error - connection failed
        setError('Network error');
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  // ============================================================================
  // FUNCTION: approveUser
  // ============================================================================
  // Purpose: Approve a pending user registration request
  // Params: username - username of user to approve
  // Result: Moves user from pending to approved list
  const approveUser = async (username) => {
    setLoading(true);
    setError("");
    try {
      // Get authentication token from localStorage
      const token = localStorage.getItem('groceryToken');
      
      // Make API call to approve the user
      const res = await fetch(`${API_URL}/admin/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ username })
      });
      
      if (res.ok) {
        // Approval successful - refresh user lists from response
        const data = await res.json();
        setPending(data.pending || []);
        setApproved(data.approved || []);
      } else {
        // Approval failed
        setError('Failed to approve user');
      }
    } catch {
      // Network error
      setError('Network error');
    }
    setLoading(false);
  };

  // ============================================================================
  // FUNCTION: rejectUser
  // ============================================================================
  // Purpose: Reject a pending user registration request
  // Params: username - username of user to reject
  // Result: Removes user from pending list (registration denied)
  const rejectUser = async (username) => {
    setLoading(true);
    setError("");
    try {
      // Get authentication token from localStorage
      const token = localStorage.getItem('groceryToken');
      
      // Make API call to reject the user
      const res = await fetch(`${API_URL}/admin/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ username })
      });
      
      if (res.ok) {
        // Rejection successful - refresh user lists from response
        const data = await res.json();
        setPending(data.pending || []);
        setApproved(data.approved || []);
      } else {
        // Rejection failed
        setError('Failed to reject user');
      }
    } catch {
      // Network error
      setError('Network error');
    }
    setLoading(false);
  };

  // ============================================================================
  // RENDER: Admin dashboard UI
  // ============================================================================
  return (
    <div className="login-container">
      <h2>Admin Dashboard</h2>
      
      {/* Logout button - aligned to the right */}
      <button onClick={onLogout} style={{ float: 'right' }}>Logout</button>
      
      {/* Error message display */}
      {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
      
      {/* Loading indicator */}
      {loading && <div>Loading...</div>}
      
      {/* SECTION: Pending User Requests - awaiting admin approval */}
      <h3>Pending User Requests</h3>
      {pending.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <ul>
          {/* Display each pending user with approve/reject buttons */}
          {pending.map(u => (
            <li key={u.username || u} style={{ marginBottom: 10 }}>
              <b>{u.username || u}</b>
              {/* Approve button - grant user access */}
              <button 
                style={{ marginLeft: 10 }} 
                onClick={() => approveUser(u.username || u)}
              >
                Approve
              </button>
              {/* Reject button - deny user access */}
              <button 
                style={{ marginLeft: 5 }} 
                onClick={() => rejectUser(u.username || u)}
              >
                Reject
              </button>
            </li>
          ))}
        </ul>
      )}
      
      {/* SECTION: Approved Users - currently have access to the system */}
      <h3>Approved Users</h3>
      <ul>
        {/* Display list of all approved users */}
        {approved.map(u => <li key={u.username || u}>{u.username || u}</li>)}
      </ul>
    </div>
  );
}

export default AdminDashboard;
