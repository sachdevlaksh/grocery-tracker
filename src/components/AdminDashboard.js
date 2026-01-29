import React, { useState, useEffect } from 'react';

function AdminDashboard({ onLogout }) {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);

  useEffect(() => {
    setPending(JSON.parse(localStorage.getItem('pendingUsers') || '[]'));
    setApproved(Object.keys(JSON.parse(localStorage.getItem('groceryUsers') || '{}')));
  }, []);

  const approveUser = (username, password) => {
    // Add to approved users
    const users = JSON.parse(localStorage.getItem('groceryUsers') || '{}');
    users[username] = password;
    localStorage.setItem('groceryUsers', JSON.stringify(users));
    // Remove from pending
    let requests = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
    requests = requests.filter(u => u.username !== username);
    localStorage.setItem('pendingUsers', JSON.stringify(requests));
    setPending(requests);
    setApproved(Object.keys(users));
  };

  const rejectUser = (username) => {
    let requests = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
    requests = requests.filter(u => u.username !== username);
    localStorage.setItem('pendingUsers', JSON.stringify(requests));
    setPending(requests);
  };

  return (
    <div className="login-container">
      <h2>Admin Dashboard</h2>
      <button onClick={onLogout} style={{ float: 'right' }}>Logout</button>
      <h3>Pending User Requests</h3>
      {pending.length === 0 ? <p>No pending requests.</p> : (
        <ul>
          {pending.map(u => (
            <li key={u.username} style={{ marginBottom: 10 }}>
              <b>{u.username}</b>
              <button style={{ marginLeft: 10 }} onClick={() => approveUser(u.username, u.password)}>Approve</button>
              <button style={{ marginLeft: 5 }} onClick={() => rejectUser(u.username)}>Reject</button>
            </li>
          ))}
        </ul>
      )}
      <h3>Approved Users</h3>
      <ul>
        {approved.map(u => <li key={u}>{u}</li>)}
      </ul>
    </div>
  );
}

export default AdminDashboard;
