function GroceryDashboard({ groceries }) {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Grocery</th>
            <th>Weight</th>
            <th>Price ($)</th>
            <th>Purchase Date</th>
          </tr>
        </thead>
        <tbody>
          {groceries.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.weight}</td>
              <td>{item.price}</td>
              <td>{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GroceryDashboard;
