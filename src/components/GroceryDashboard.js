
// ============================================================================
// GROCERY DASHBOARD TABLE COMPONENT
// ============================================================================
// This component displays all grocery items in a table format with edit/delete actions.
// Shows complete details of each grocery item and allows inline actions.

// ============================================================================
// GROCERY DASHBOARD COMPONENT
// ============================================================================
// Props:
// - groceries: array of grocery items to display in the table
// - onDelete: function to call when user clicks delete button
// - onEdit: function to call when user clicks edit button
function GroceryDashboard({ groceries, onDelete, onEdit }) {
  return (
    <div className="table-wrapper">
      <table className="table">
        {/* TABLE HEADER - Column titles */}
        <thead>
          <tr>
            <th>Grocery</th>        {/* Item name */}
            <th>Category</th>       {/* Main category */}
            <th>Subcategory</th>    {/* Sub classification */}
            <th>Qty</th>            {/* Quantity purchased */}
            <th>Weight</th>         {/* Weight/volume */}
            <th>Price (₹)</th>      {/* Cost in rupees */}
            <th>Purchase Date</th>  {/* When purchased */}
            <th>Expiry Date</th>    {/* When expires */}
            <th>Status</th>         {/* Finished or In Stock */}
            <th>Actions</th>        {/* Edit/Delete buttons */}
          </tr>
        </thead>
        
        {/* TABLE BODY - Grocery items rows */}
        <tbody>
          {/* Loop through each grocery and create a table row */}
          {groceries.map((item) => (
            <tr key={item.id} className={item.finished === "yes" ? "finished-row" : ""}>
              {/* Display all grocery item properties */}
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.subcategory}</td>
              <td>{item.quantity}</td>
              <td>{item.weight}</td>
              <td>{item.price}</td>
              <td>{item.date}</td>
              <td>{item.expiry}</td>
              
              {/* Status badge - Shows visual indicator of item status */}
              <td>
                <span className={`status-badge ${item.finished === "yes" ? "finished" : "in-stock"}`}>
                  {item.finished === "yes" ? "✓ Finished" : "📦 In Stock"}
                </span>
              </td>
              
              {/* Action buttons - Edit and Delete operations */}
              <td>
                {/* Edit button - Opens form to modify this item */}
                <button 
                  className="edit-btn" 
                  onClick={() => onEdit(item)} 
                  title="Edit"
                >
                  ✏️
                </button>
                
                {/* Delete button - Removes this item from grocery list */}
                <button 
                  className="delete-btn" 
                  onClick={() => onDelete(item.id)} 
                  title="Delete"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GroceryDashboard;
