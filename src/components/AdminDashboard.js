
import React, { useState, useEffect } from 'react';

const API_URL = "https://grocery-tracker-be.onrender.com/api";

function AdminDashboard({ onLogout }) {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch pending and approved users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem('groceryToken');
        const res = await fetch(`${API_URL}/admin/users`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          setPending(data.pending || []);
          setApproved(data.approved || []);
        } else {
          setError('Failed to fetch users');
        }
      } catch {
        setError('Network error');
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  // Approve user via backend
  const approveUser = async (username) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('groceryToken');
      const res = await fetch(`${API_URL}/admin/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ username })
      });
      if (res.ok) {
        // Refresh user lists
        const data = await res.json();
        setPending(data.pending || []);
        setApproved(data.approved || []);
      } else {
        setError('Failed to approve user');
      }
    } catch {
      setError('Network error');
    }
    setLoading(false);
  };

  // Reject user via backend
  const rejectUser = async (username) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('groceryToken');
      const res = await fetch(`${API_URL}/admin/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ username })
      });
      if (res.ok) {
        // Refresh user lists
        const data = await res.json();
        setPending(data.pending || []);
        setApproved(data.approved || []);
      } else {
        setError('Failed to reject user');
      }
    } catch {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <h2>Admin Dashboard</h2>
      <button onClick={onLogout} style={{ float: 'right' }}>Logout</button>
      {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
      {loading && <div>Loading...</div>}
      <h3>Pending User Requests</h3>
      {pending.length === 0 ? <p>No pending requests.</p> : (
        <ul>
          {pending.map(u => (
            <li key={u.username || u} style={{ marginBottom: 10 }}>
              <b>{u.username || u}</b>
              <button style={{ marginLeft: 10 }} onClick={() => approveUser(u.username || u)}>Approve</button>
              <button style={{ marginLeft: 5 }} onClick={() => rejectUser(u.username || u)}>Reject</button>
            </li>
          ))}
        </ul>
      )}
      <h3>Approved Users</h3>
      <ul>
        {approved.map(u => <li key={u.username || u}>{u.username || u}</li>)}
      </ul>
    </div>
  );
}

export default AdminDashboard;
