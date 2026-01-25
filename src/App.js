import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import GroceryForm from "./components/GroceryForm";
import GroceryDashboard from "./components/GroceryDashboard";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL || "/api";

function App() {
  const [groceries, setGroceries] = useState([]);
  const [useLocal, setUseLocal] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");
  const [editingGrocery, setEditingGrocery] = useState(null);

  // Fetch groceries from backend or localStorage
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/groceries`);
        if (!res.ok) throw new Error("No backend");
        const data = await res.json();
        setGroceries(data);
        setUseLocal(false);
      } catch {
        // fallback to localStorage
        const saved = localStorage.getItem("groceries");
        setGroceries(saved ? JSON.parse(saved) : []);
        setUseLocal(true);
      }
    };
    fetchData();
  }, []);

  const addGrocery = async (grocery) => {
    if (useLocal) {
      const newGroceries = [...groceries, grocery];
      setGroceries(newGroceries);
      localStorage.setItem("groceries", JSON.stringify(newGroceries));
      return;
    }
    try {
      const res = await fetch(`${API_URL}/groceries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(grocery)
      });
      if (!res.ok) throw new Error();
      const newGrocery = await res.json();
      setGroceries((prev) => [...prev, newGrocery]);
    } catch {
      // fallback to localStorage
      const newGroceries = [...groceries, grocery];
      setGroceries(newGroceries);
      localStorage.setItem("groceries", JSON.stringify(newGroceries));
      setUseLocal(true);
    }
  };

  const deleteGrocery = async (id) => {
    if (useLocal) {
      const newGroceries = groceries.filter((item) => item.id !== id);
      setGroceries(newGroceries);
      localStorage.setItem("groceries", JSON.stringify(newGroceries));
      return;
    }
    try {
      await fetch(`${API_URL}/groceries/${id}`, { method: "DELETE" });
      setGroceries((prev) => prev.filter((item) => item.id !== id));
    } catch {
      const newGroceries = groceries.filter((item) => item.id !== id);
      setGroceries(newGroceries);
      localStorage.setItem("groceries", JSON.stringify(newGroceries));
      setUseLocal(true);
    }
  };

  const startEditGrocery = (grocery) => {
    setEditingGrocery(grocery);
  };

  const editGrocery = async (updatedGrocery) => {
    if (useLocal) {
      const newGroceries = groceries.map((item) =>
        item.id === updatedGrocery.id ? updatedGrocery : item
      );
      setGroceries(newGroceries);
      localStorage.setItem("groceries", JSON.stringify(newGroceries));
      setEditingGrocery(null);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/groceries/${updatedGrocery.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedGrocery)
      });
      if (!res.ok) throw new Error();
      const saved = await res.json();
      setGroceries((prev) => prev.map((item) =>
        item.id === saved.id ? saved : item
      ));
      setEditingGrocery(null);
    } catch {
      const newGroceries = groceries.map((item) =>
        item.id === updatedGrocery.id ? updatedGrocery : item
      );
      setGroceries(newGroceries);
      localStorage.setItem("groceries", JSON.stringify(newGroceries));
      setEditingGrocery(null);
      setUseLocal(true);
    }
  };


  const sortedGroceries = [...groceries].sort((a, b) =>
    sortOrder === "desc"
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date)
  );

  const totalSpent = groceries.reduce(
    (sum, g) => sum + Number(g.price),
    0
  );

  const spendByCategory = groceries.reduce((acc, g) => {
    const category = g.category || "Uncategorized";
    acc[category] = (acc[category] || 0) + Number(g.price);
    return acc;
  }, {});

  const spendBySubcategory = groceries.reduce((acc, g) => {
    const subcategory = g.subcategory || "Uncategorized";
    acc[subcategory] = (acc[subcategory] || 0) + Number(g.price);
    return acc;
  }, {});

  const categoryData = Object.entries(spendByCategory).map(([name, value]) => ({
    name,
    value: Number(value),
  }));

  const subcategoryData = Object.entries(spendBySubcategory).map(([name, value]) => ({
    name,
    value: Number(value),
  }));

  const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiredItems = groceries.filter((g) => {
    const expiryDate = new Date(g.expiry);
    expiryDate.setHours(0, 0, 0, 0);
    return expiryDate < today && g.finished === "no";
  });

  const closToExpireItems = groceries.filter((g) => {
    const expiryDate = new Date(g.expiry);
    expiryDate.setHours(0, 0, 0, 0);
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry > 0 && daysUntilExpiry <= 7 && g.finished === "no";
  });


  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="header-icons">🥬 🥕 🍎 🥛</div>
          <h1>🛒 Grocery Tracker</h1>
          <p>Track your daily grocery purchases</p>
          <div className="header-icons">🧅 🥔 🍞 🎯</div>
        </div>
      </header>

      <div className="summary">
        <div className="card">
          <h3>Total Items</h3>
          <p>{groceries.length}</p>
        </div>
        <div className="card">
          <h3>Total Spent</h3>
          <p>₹{totalSpent}</p>
        </div>
      </div>

      {expiredItems.length > 0 && (
        <div className="alert alert-danger">
          <h3>🚨 Expired Items ({expiredItems.length})</h3>
          <ul>
            {expiredItems.map((item) => (
              <li key={item.id} className="alert-item">
                <span>
                  <strong>{item.name}</strong> - Expired on {new Date(item.expiry).toLocaleDateString()}
                </span>
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

      {closToExpireItems.length > 0 && (
        <div className="alert alert-warning">
          <h3>⚠️ Close to Expire ({closToExpireItems.length})</h3>
          <ul>
            {closToExpireItems.map((item) => {
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

      <div className="charts-section">
        <div className="chart-container">
          <h3>Spend by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ₹${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-container">
          <h3>Spend by Subcategory</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={subcategoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ₹${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {subcategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <GroceryForm 
        addGrocery={addGrocery} 
        editingGrocery={editingGrocery}
        editGrocery={editGrocery}
        cancelEdit={() => setEditingGrocery(null)}
      />

      <div className="controls">
        <label>Sort by date:</label>
        <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      <GroceryDashboard 
        groceries={sortedGroceries} 
        onDelete={deleteGrocery}
        onEdit={startEditGrocery}
      />

      <footer className="footer">
        <p>&copy; 2026 Grocery Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
