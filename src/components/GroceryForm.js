
import { useState, useEffect } from "react";

// Helper to get today's date in YYYY-MM-DD format
const getToday = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Helper to get date 1 year from now in YYYY-MM-DD format
const getOneYearFromNow = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().split('T')[0];
};

function GroceryForm({ addGrocery, editingGrocery, editGrocery, cancelEdit }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    subcategory: "",
    weight: "",
    price: "",
    date: getToday(),
    expiry: getOneYearFromNow(),
    finished: "no",
  });

  const [errors, setErrors] = useState({});

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
        date: getToday(),
        expiry: getOneYearFromNow(),
        finished: "no",
      });
    }
    setErrors({});
  }, [editingGrocery]);

  const validateForm = () => {
    const newErrors = {};

    // Required field: Name
    if (!form.name || form.name.trim() === "") {
      newErrors.name = "Name is required";
    }

    // Required field: Category
    if (!form.category || form.category.trim() === "") {
      newErrors.category = "Category is required";
    }

    // Required field: Price (must be a valid number)
    if (!form.price || form.price.trim() === "") {
      newErrors.price = "Price is required";
    } else if (isNaN(parseFloat(form.price)) || parseFloat(form.price) < 0) {
      newErrors.price = "Price must be a valid positive number";
    }

    // Required field: Purchase Date
    if (!form.date) {
      newErrors.date = "Purchase date is required";
    }

    // Required field: Expiry Date
    if (!form.expiry) {
      newErrors.expiry = "Expiry date is required";
    }

    // Validate expiry date is after purchase date
    if (form.date && form.expiry && new Date(form.expiry) < new Date(form.date)) {
      newErrors.expiry = "Expiry date must be after purchase date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (editingGrocery) {
      editGrocery(form);
    } else {
      addGrocery({ id: Date.now(), ...form });
    }
    setForm({
      name: "",
      category: "",
      subcategory: "",
      weight: "",
      price: "",
      date: getToday(),
      expiry: getOneYearFromNow(),
      finished: "no",
    });
    setErrors({});
  };

  const inputStyle = (field) => ({
    borderColor: errors[field] ? '#e74c3c' : undefined,
    borderWidth: errors[field] ? '2px' : undefined,
  });

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-field">
        <input 
          placeholder="Name *" 
          value={form.name}
          style={inputStyle('name')}
          onChange={(e) => setForm({ ...form, name: e.target.value })} 
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>

      <div className="form-field">
        <input 
          placeholder="Category *" 
          value={form.category}
          style={inputStyle('category')}
          onChange={(e) => setForm({ ...form, category: e.target.value })} 
        />
        {errors.category && <span className="error-text">{errors.category}</span>}
      </div>

      <div className="form-field">
        <input 
          placeholder="Subcategory" 
          value={form.subcategory}
          onChange={(e) => setForm({ ...form, subcategory: e.target.value })} 
        />
      </div>

      <div className="form-field">
        <input 
          placeholder="Weight" 
          value={form.weight}
          onChange={(e) => setForm({ ...form, weight: e.target.value })} 
        />
      </div>

      <div className="form-field">
        <input 
          type="number" 
          step="0.01"
          min="0"
          placeholder="Price *" 
          value={form.price}
          style={inputStyle('price')}
          onChange={(e) => setForm({ ...form, price: e.target.value })} 
        />
        {errors.price && <span className="error-text">{errors.price}</span>}
      </div>

      <div className="form-field">
        <label className="date-label">Purchase Date *</label>
        <input 
          type="date" 
          value={form.date}
          style={inputStyle('date')}
          onChange={(e) => setForm({ ...form, date: e.target.value })} 
        />
        {errors.date && <span className="error-text">{errors.date}</span>}
      </div>

      <div className="form-field">
        <label className="date-label">Expiry Date *</label>
        <input 
          type="date" 
          value={form.expiry}
          style={inputStyle('expiry')}
          onChange={(e) => setForm({ ...form, expiry: e.target.value })} 
        />
        {errors.expiry && <span className="error-text">{errors.expiry}</span>}
      </div>

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
