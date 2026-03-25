
// ============================================================================
// GROCERY TRACKER MAIN APPLICATION
// ============================================================================
// This is the main App component that manages the entire application flow
// including user authentication, grocery management, and dashboard display.

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import GroceryForm from "./components/GroceryForm";
import GroceryDashboard from "./components/GroceryDashboard";
import Login from "./components/Login";
import UserRequest from "./components/UserRequest";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import "./App.css";
import "./Login.css";

// ============================================================================
// API ENDPOINTS CONFIGURATION
// ============================================================================
// Health endpoint for waking up Render server (used to keep free tier awake)
const HEALTH_URL = "https://grocery-tracker-be.onrender.com/health";
// Base API URL for all backend requests
const API_URL = "https://grocery-tracker-be.onrender.com/api";



function App() {
  // ============================================================================
  // STATE VARIABLES - Server & UI Status
  // ============================================================================
  // Message displayed when user clicks "Wake Up Server" button
  const [serverStatus, setServerStatus] = useState("");
  // Flag to prevent multiple server wake-up requests
  const [wakingUp, setWakingUp] = useState(false);
  // Current page/view: "login", "request", "admin-login", "admin-dashboard", "user-dashboard"
  const [page, setPage] = useState("login");
  
  // ============================================================================
  // STATE VARIABLES - User & Authentication
  // ============================================================================
  // Currently logged-in username
  const [user, setUser] = useState("");
  
  // ============================================================================
  // STATE VARIABLES - Grocery Management
  // ============================================================================
  // Array of all grocery items for the current user
  const [groceries, setGroceries] = useState([]);
  // Flag indicating if using localStorage (true) or backend API (false)
  const [useLocal, setUseLocal] = useState(false);
  // Sort order for grocery table: "desc" (newest first) or "asc" (oldest first)
  const [sortOrder, setSortOrder] = useState("desc");
  // Currently edited grocery item (null if not editing)
  const [editingGrocery, setEditingGrocery] = useState(null);
  
  // ============================================================================
  // STATE VARIABLES - Month Filter (for charts and statistics)
  // ============================================================================
  // Get current month and year as default (format: YYYY-MM)
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`);

  // ============================================================================
  // FUNCTION: wakeUpServer
  // ============================================================================
  // Purpose: Ping the health endpoint to wake up the Render.com free tier server
  // Note: Free tier Render servers go to sleep after inactivity
  const wakeUpServer = async () => {
    setWakingUp(true);
    setServerStatus("");
    try {
      // Use no-cors mode to ping the server - the request still wakes the server
      // even though we can't read the response due to CORS restrictions
      await fetch(HEALTH_URL, {
        method: "GET",
        mode: "no-cors"
      });
      // With no-cors, we can't read the response, but the request was sent
      // Wait a moment then assume success
      await new Promise(resolve => setTimeout(resolve, 1000));
      setServerStatus("Server pinged! It should be waking up. You can try logging in now.");
    } catch (err) {
      console.error("Wake up server error:", err);
      setServerStatus("Could not reach server. Check your network connection.");
    }
    setWakingUp(false);
  };

    // ============================================================================
    // EFFECT: Fetch groceries when user logs in
    // ============================================================================
    // Triggered whenever 'user' state changes
    // Attempts to fetch from backend, falls back to localStorage if unavailable
    useEffect(() => {
      if (!user) return; // Skip if no user is logged in
      const fetchData = async () => {
        try {
          // Get authentication token from localStorage
          const token = localStorage.getItem('groceryToken');
          // Make API call to fetch all groceries for current user
          const res = await fetch(`${API_URL}/groceries?user=${encodeURIComponent(user)}`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
          });
          if (!res.ok) throw new Error("No backend"); // If backend fails, throw error to trigger fallback
          const data = await res.json();
          setGroceries(data); // Set groceries from backend
          setUseLocal(false); // Mark that we're using backend (not localStorage)
        } catch {
          // FALLBACK: If backend is unavailable, use localStorage
          const all = localStorage.getItem("userGroceries");
          const userGroceries = all ? JSON.parse(all) : {};
          setGroceries(userGroceries[user] || []); // Load groceries for this user from localStorage
          setUseLocal(true); // Mark that we're using localStorage
        }
      };
      fetchData();
    }, [user]); // Re-run when user changes

    // ============================================================================
    // FUNCTION: addGrocery
    // ============================================================================
    // Purpose: Add a new grocery item to the system
    // Params: grocery - object containing grocery details (name, price, date, etc)
    // Behavior: Tries backend first, falls back to localStorage on failure
    const addGrocery = async (grocery) => {
      // If using localStorage, add to local storage instead of backend
      if (useLocal) {
        const newGroceries = [...groceries, { ...grocery, user }]; // Add user field to grocery
        setGroceries(newGroceries);
        // Store per user in localStorage
        const all = localStorage.getItem("userGroceries");
        const userGroceries = all ? JSON.parse(all) : {};
        userGroceries[user] = newGroceries;
        localStorage.setItem("userGroceries", JSON.stringify(userGroceries));
        return;
      }
      
      // Try to add to backend
      try {
        const token = localStorage.getItem('groceryToken');
        // POST request to backend API to create new grocery
        const res = await fetch(`${API_URL}/groceries`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ ...grocery, user })
        });
        if (!res.ok) throw new Error();
        const newGrocery = await res.json();
        setGroceries((prev) => [...prev, newGrocery]); // Add returned grocery to state
      } catch {
        // FALLBACK: If backend fails, save to localStorage
        const newGroceries = [...groceries, { ...grocery, user }];
        setGroceries(newGroceries);
        const all = localStorage.getItem("userGroceries");
        const userGroceries = all ? JSON.parse(all) : {};
        userGroceries[user] = newGroceries;
        localStorage.setItem("userGroceries", JSON.stringify(userGroceries));
        setUseLocal(true); // Mark that we switched to localStorage
      }
    };

    // ============================================================================
    // FUNCTION: deleteGrocery
    // ============================================================================
    // Purpose: Delete a grocery item from the system
    // Params: id - unique identifier of the grocery item to delete
    // Behavior: Tries backend first, falls back to localStorage on failure
    const deleteGrocery = async (id) => {
      // If using localStorage, delete from localStorage
      if (useLocal) {
        const newGroceries = groceries.filter((item) => item.id !== id); // Filter out item with matching id
        setGroceries(newGroceries);
        const all = localStorage.getItem("userGroceries");
        const userGroceries = all ? JSON.parse(all) : {};
        userGroceries[user] = newGroceries;
        localStorage.setItem("userGroceries", JSON.stringify(userGroceries));
        return;
      }
      
      // Try to delete from backend
      try {
        const token = localStorage.getItem('groceryToken');
        // DELETE request to backend API to remove grocery
        await fetch(`${API_URL}/groceries/${id}`, {
          method: "DELETE",
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        // Remove from frontend state
        setGroceries((prev) => prev.filter((item) => item.id !== id));
      } catch {
        // FALLBACK: If backend fails, delete from localStorage
        const newGroceries = groceries.filter((item) => item.id !== id);
        setGroceries(newGroceries);
        const all = localStorage.getItem("userGroceries");
        const userGroceries = all ? JSON.parse(all) : {};
        userGroceries[user] = newGroceries;
        localStorage.setItem("userGroceries", JSON.stringify(userGroceries));
        setUseLocal(true); // Mark that we switched to localStorage
      }
    };

    // ============================================================================
    // FUNCTION: startEditGrocery
    // ============================================================================
    // Purpose: Initialize edit mode by setting the grocery to be edited
    // Params: grocery - object containing the grocery item to edit
    const startEditGrocery = (grocery) => {
      setEditingGrocery(grocery); // Set the item to be edited (form will populate with its values)
    };

    // ============================================================================
    // FUNCTION: editGrocery
    // ============================================================================
    // Purpose: Update an existing grocery item in the system
    // Params: updatedGrocery - object containing updated grocery details
    // Behavior: Tries backend first, falls back to localStorage on failure
    const editGrocery = async (updatedGrocery) => {
      // If using localStorage, update in localStorage
      if (useLocal) {
        // Replace the old item with updated item (match by id)
        const newGroceries = groceries.map((item) =>
          item.id === updatedGrocery.id ? { ...updatedGrocery, user } : item
        );
        setGroceries(newGroceries);
        const all = localStorage.getItem("userGroceries");
        const userGroceries = all ? JSON.parse(all) : {};
        userGroceries[user] = newGroceries;
        localStorage.setItem("userGroceries", JSON.stringify(userGroceries));
        setEditingGrocery(null); // Exit edit mode
        return;
      }
      
      // Try to update on backend
      try {
        const token = localStorage.getItem('groceryToken');
        // PUT request to backend API to update grocery
        const res = await fetch(`${API_URL}/groceries/${updatedGrocery.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ ...updatedGrocery, user })
        });
        if (!res.ok) throw new Error();
        const saved = await res.json();
        // Update the item in state with the response from backend
        setGroceries((prev) => prev.map((item) =>
          item.id === saved.id ? saved : item
        ));
        setEditingGrocery(null); // Exit edit mode
      } catch {
        // FALLBACK: If backend fails, update in localStorage
        const newGroceries = groceries.map((item) =>
          item.id === updatedGrocery.id ? { ...updatedGrocery, user } : item
        );
        setGroceries(newGroceries);
        const all = localStorage.getItem("userGroceries");
        const userGroceries = all ? JSON.parse(all) : {};
        userGroceries[user] = newGroceries;
        localStorage.setItem("userGroceries", JSON.stringify(userGroceries));
        setEditingGrocery(null); // Exit edit mode
        setUseLocal(true); // Mark that we switched to localStorage
      }
    };

    // ============================================================================
    // ROUTING LOGIC - Display appropriate page based on current state
    // ============================================================================
    
    // Route: Admin login page
    if (page === "admin-login") {
      return <AdminLogin onAdminLogin={() => setPage("admin-dashboard")} switchToUserLogin={() => setPage("login")} />;
    }
    
    // Route: Admin dashboard
    if (page === "admin-dashboard") {
      return <AdminDashboard onLogout={() => setPage("admin-login")} />;
    }
    
    // Route: User registration/request page
    if (page === "request") {
      return <UserRequest onRequest={() => setPage("login")} switchToLogin={() => setPage("login")} />;
    }
    
    // Route: User login page
    if (!user && page === "login") {
      return (
        <div>
          <Login onLogin={(username) => {
            setUser(username); // Set logged-in user
            setPage("user-dashboard"); // Navigate to user dashboard
          }} />
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <button onClick={() => setPage("request")}>Request New User Access</button>
            <button style={{ marginLeft: 10 }} onClick={() => setPage("admin-login")}>Admin Login</button>
          </div>
          <div style={{ textAlign: 'center', marginTop: 30 }}>
            <button onClick={wakeUpServer} disabled={wakingUp}>
              {wakingUp ? "Waking up server..." : "Wake Up Server"}
            </button>
            {serverStatus && <div style={{ marginTop: 10, color: 'green' }}>{serverStatus}</div>}
          </div>
        </div>
      );
    }
    
    // Route: User dashboard (main application page with groceries and charts)
    if (user && page === "user-dashboard") {
      return (
        <div className="app">
          {/* ================================================================= */}
          {/* HEADER SECTION - App title and user info */}
          {/* ================================================================= */}
          <header className="header">
            <div className="header-content">
              <div className="header-icons">🥬 🥕 🍎 🥛</div>
              <h1>🛒 Grocery Tracker</h1>
              <p>Track your daily grocery purchases</p>
              <div className="header-icons">🧅 🥔 🍞 🎯</div>
            </div>
            <div style={{ position: 'absolute', right: 20, top: 20 }}>
              {/* Display current logged-in username */}
              <span style={{ marginRight: 10 }}>👤 {user}</span>
              {/* Logout button - clears user state and navigates back to login */}
              <button onClick={() => {
                setUser("");
                localStorage.removeItem("groceryUser");
                setPage("login");
              }}>Logout</button>
            </div>
          </header>

          {/* ================================================================= */}
          {/* SUMMARY CARDS - Month filter, total items, and total spent */}
          {/* ================================================================= */}
          <div className="summary">
            {/* MONTH FILTER CARD - Allow user to select which month to view */}
            <div className="card">
              <h3>Month Filter</h3>
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{ padding: '8px', fontSize: '14px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                {/* Generate 12 month options going back from current date */}
                {Array.from({ length: 12 }, (_, i) => {
                  const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
                  const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                  const monthLabel = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
                  return <option key={monthStr} value={monthStr}>{monthLabel}</option>;
                })}
              </select>
            </div>
            
            {/* TOTAL ITEMS CARD - Show number of groceries in selected month */}
            <div className="card">
              <h3>Total Items (This Month)</h3>
              <p>{filteredGroceries.length}</p>
            </div>
            
            {/* TOTAL SPENT CARD - Show sum of spending in selected month */}
            <div className="card">
              <h3>Total Spent (This Month)</h3>
              <p>₹{totalSpent.toFixed(2)}</p>
            </div>
          </div>

          {/* ================================================================= */}
          {/* EXPIRED ITEMS ALERT - Show expired groceries that need attention */}
          {/* ================================================================= */}
          {expiredItems.length > 0 && (
            <div className="alert alert-danger">
              <h3>🚨 Expired Items ({expiredItems.length})</h3>
              <ul>
                {expiredItems.map((item) => (
                  <li key={item.id} className="alert-item">
                    <span>
                      <strong>{item.name}</strong> - Expired on {new Date(item.expiry).toLocaleDateString()}
                    </span>
                    {/* Quick delete button for expired items */}
                    <button 
                      className="delete-btn"
                      onClick={() => deleteGrocery(item.id)}
                      title="Remove this item"
                    >
                      🗑️ Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ================================================================= */}
          {/* EXPIRING SOON ALERT - Show items expiring within 7 days */}
          {/* ================================================================= */}
          {closToExpireItems.length > 0 && (
            <div className="alert alert-warning">
              <h3>⚠️ Close to Expire ({closToExpireItems.length})</h3>
              <ul>
                {closToExpireItems.map((item) => {
                  // Calculate days remaining until expiry
                  const expiryDate = new Date(item.expiry);
                  const today = new Date();
                  const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
                  return (
                    <li key={item.id}>
                      <strong>{item.name}</strong> - Expires in {daysLeft} day{daysLeft > 1 ? 's' : ''} ({expiryDate.toLocaleDateString()})
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* ================================================================= */}
          {/* PIE CHARTS SECTION - Visualize spending by category & subcategory */}
          {/* ================================================================= */}
          <div className="charts-section">
            {/* CATEGORY CHART - Shows breakdown of spending by main categories */}
            <div className="chart-container">
              <h3>Spend by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData} // Data from category spending calculation
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ₹${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {/* Color each pie segment with a color from COLORS array */}
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value}`} /> {/* Show price on hover */}
                  <Legend /> {/* Display legend with category names */}
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* SUBCATEGORY CHART - Shows finer breakdown of spending */}
            <div className="chart-container">
              <h3>Spend by Subcategory</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={subcategoryData} // Data from subcategory spending calculation
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ₹${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {/* Color each pie segment with a color from COLORS array */}
                    {subcategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value}`} /> {/* Show price on hover */}
                  <Legend /> {/* Display legend with subcategory names */}
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ================================================================= */}
          {/* GROCERY FORM SECTION - Add or edit grocery items */}
          {/* ================================================================= */}
          <GroceryForm 
            addGrocery={addGrocery} // Pass function to add new grocery
            editingGrocery={editingGrocery} // Pass item being edited (if any)
            editGrocery={editGrocery} // Pass function to update grocery
            cancelEdit={() => setEditingGrocery(null)} // Pass function to cancel edit mode
          />

          {/* ================================================================= */}
          {/* TABLE CONTROLS - Sort and filter options for grocery table */}
          {/* ================================================================= */}
          <div className="controls">
            <label>Sort by date:</label>
            <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
              <option value="desc">Newest First</option> {/* Show most recent purchases first */}
              <option value="asc">Oldest First</option>   {/* Show oldest purchases first */}
            </select>
          </div>

          {/* ================================================================= */}
          {/* GROCERY TABLE - Display all groceries with edit/delete actions */}
          {/* ================================================================= */}
          <GroceryDashboard 
            groceries={sortedGroceries} // Pass filtered and sorted groceries
            onDelete={deleteGrocery} // Pass function to delete a grocery
            onEdit={startEditGrocery} // Pass function to start editing a grocery
          />

          {/* ================================================================= */}
          {/* FOOTER SECTION - Copyright information */}
          {/* ================================================================= */}
          <footer className="footer">
            <p>&copy; 2026 Grocery Tracker. All rights reserved.</p>
          </footer>
        </div>
      );
    }
}
export default App;
