import { useState } from "react";
import { initialGroceries } from "./data/groceryData";
import GroceryForm from "./components/GroceryForm";
import GroceryDashboard from "./components/GroceryDashboard";
import "./App.css";

function App() {
  const [groceries, setGroceries] = useState(initialGroceries);
  const [sortOrder, setSortOrder] = useState("desc");

  const addGrocery = (grocery) => {
    setGroceries([...groceries, grocery]);
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

  return (
    <div className="app">
      <header className="header">
        <h1>🛒 Grocery Tracker</h1>
        <p>Track your daily grocery purchases</p>
      </header>

      <div className="summary">
        <div className="card">
          <h3>Total Items</h3>
          <p>{groceries.length}</p>
        </div>
        <div className="card">
          <h3>Total Spent</h3>
          <p>${totalSpent}</p>
        </div>
      </div>

      <GroceryForm addGrocery={addGrocery} />

      <div className="controls">
        <label>Sort by date:</label>
        <select onChange={(e) => setSortOrder(e.target.value)}>
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      <GroceryDashboard groceries={sortedGroceries} />
    </div>
  );
}

export default App;
