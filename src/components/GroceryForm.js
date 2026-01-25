
import { useState, useEffect } from "react";

function GroceryForm({ addGrocery, editingGrocery, editGrocery, cancelEdit }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    subcategory: "",
    weight: "",
    price: "",
    date: "",
    expiry: "",
    finished: "no",
  });

  useEffect(() => {
    if (editingGrocery) {
      setForm(editingGrocery);
    } else {
      setForm({
        name: "",
        category: "",
        subcategory: "",
        weight: "",
        price: "",
        date: "",
        expiry: "",
        finished: "no",
      });
    }
  }, [editingGrocery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingGrocery) {
      editGrocery(form);
    } else {
      addGrocery({ id: Date.now(), ...form });
    }
    setForm({ name: "", category: "", subcategory: "", weight: "", price: "", date: "", expiry: "", finished: "no" });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input placeholder="Name" value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Category" value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })} />
      <input placeholder="Subcategory" value={form.subcategory}
        onChange={(e) => setForm({ ...form, subcategory: e.target.value })} />
      <input placeholder="Weight" value={form.weight}
        onChange={(e) => setForm({ ...form, weight: e.target.value })} />
      <input type="number" placeholder="Price" value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })} />
      <input type="date" placeholder="Purchase Date" value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })} />
      <input type="date" placeholder="Expiry Date" value={form.expiry}
        onChange={(e) => setForm({ ...form, expiry: e.target.value })} />
      {editingGrocery ? (
        <>
          <button type="submit">Update</button>
          <button type="button" onClick={cancelEdit}>Cancel</button>
        </>
      ) : (
        <button type="submit">Add</button>
      )}
    </form>
  );
}

export default GroceryForm;
