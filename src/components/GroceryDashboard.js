function GroceryDashboard({ groceries }) {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Grocery</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Weight</th>
            <th>Price (₹)</th>
            <th>Purchase Date</th>
            <th>Expiry Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {groceries.map((item) => (
            <tr key={item.id} className={item.finished === "yes" ? "finished-row" : ""}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.subcategory}</td>
              <td>{item.weight}</td>
              <td>{item.price}</td>
              <td>{item.date}</td>
              <td>{item.expiry}</td>
              <td><span className={`status-badge ${item.finished === "yes" ? "finished" : "in-stock"}`}>{item.finished === "yes" ? "✓ Finished" : "📦 In Stock"}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GroceryDashboard;
