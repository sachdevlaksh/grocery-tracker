import { useState } from "react";

function GroceryForm({ addGrocery }) {
  const [form, setForm] = useState({
    name: "",
    weight: "",
    price: "",
    date: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addGrocery({ id: Date.now(), ...form });
    setForm({ name: "", weight: "", price: "", date: "" });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input placeholder="Name" value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Weight" value={form.weight}
        onChange={(e) => setForm({ ...form, weight: e.target.value })} />
      <input type="number" placeholder="Price" value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })} />
      <input type="date" value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })} />
      <button>Add</button>
    </form>
  );
}

export default GroceryForm;
