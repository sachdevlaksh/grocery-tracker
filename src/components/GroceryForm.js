
// ============================================================================
// GROCERY FORM COMPONENT
// ============================================================================
// This component provides a form for users to add new grocery items or edit
// existing ones. It includes validation and error handling.

import { useState, useEffect } from "react";

// ============================================================================
// HELPER FUNCTIONS - Date formatting utilities
// ============================================================================

// Helper to get today's date in YYYY-MM-DD format (used for purchase date default)
const getToday = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Helper to get date 1 year from now in YYYY-MM-DD format (used for expiry date default)
const getOneYearFromNow = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().split('T')[0];
};

// ============================================================================
// GROCERY FORM COMPONENT
// ============================================================================
// Props:
// - addGrocery: function to call when adding a new grocery
// - editingGrocery: object of the grocery being edited (null if not editing)
// - editGrocery: function to call when updating a grocery
// - cancelEdit: function to call when canceling edit mode
function GroceryForm({ addGrocery, editingGrocery, editGrocery, cancelEdit }) {
  // ============================================================================
  // STATE VARIABLES - Form data
  // ============================================================================
  // Object containing all form field values
  const [form, setForm] = useState({
    name: "",              // Grocery item name (e.g., "Tomato", "Milk")
    category: "",          // Main category (e.g., "Vegetable", "Dairy")
    subcategory: "",       // Subcategory (e.g., "Leafy", "Fresh")
    quantity: "1",         // Number of items
    weight: "",            // Weight/volume (e.g., "500g", "1L")
    price: "",             // Price in rupees
    date: getToday(),      // Purchase date (defaults to today)
    expiry: getOneYearFromNow(), // Expiry date (defaults to 1 year from now)
    finished: "no",        // Status flag (yes/no)
  });

  // ============================================================================
  // STATE VARIABLES - Form validation
  // ============================================================================
  // Object containing error messages for each field
  const [errors, setErrors] = useState({});

  // ============================================================================
  // EFFECT: Populate form when editing a grocery
  // ============================================================================
  // When editingGrocery changes (user clicks edit), populate form with that item's data
  // When no item is being edited, reset form to empty state
  useEffect(() => {
    if (editingGrocery) {
      // If in edit mode, populate form with selected grocery's values
      setForm(editingGrocery);
    } else {
      // If not in edit mode, reset form to empty state with default values
      setForm({
        name: "",
        category: "",
        subcategory: "",
        quantity: "1",
        weight: "",
        price: "",
        date: getToday(),
        expiry: getOneYearFromNow(),
        finished: "no",
      });
    }
    setErrors({}); // Clear all validation errors when entering/exiting edit mode
  }, [editingGrocery]);

  // ============================================================================
  // FUNCTION: validateForm
  // ============================================================================
  // Purpose: Validate all form fields before submitting
  // Returns: boolean - true if all validations pass, false otherwise
  // Updates: errors state with any validation errors found
  const validateForm = () => {
    const newErrors = {};

    // VALIDATION: Name field - Required
    if (!form.name || form.name.trim() === "") {
      newErrors.name = "Name is required";
    }

    // VALIDATION: Category field - Required
    if (!form.category || form.category.trim() === "") {
      newErrors.category = "Category is required";
    }

    // VALIDATION: Quantity field - Required and must be a positive integer
    if (!form.quantity || form.quantity.trim() === "") {
      newErrors.quantity = "Quantity is required";
    } else if (isNaN(parseInt(form.quantity)) || parseInt(form.quantity) < 1) {
      newErrors.quantity = "Quantity must be a positive number";
    }

    // VALIDATION: Price field - Required and must be a non-negative number
    if (!form.price || form.price.trim() === "") {
      newErrors.price = "Price is required";
    } else if (isNaN(parseFloat(form.price)) || parseFloat(form.price) < 0) {
      newErrors.price = "Price must be a valid positive number";
    }

    // VALIDATION: Purchase Date field - Required
    if (!form.date) {
      newErrors.date = "Purchase date is required";
    }

    // VALIDATION: Expiry Date field - Required
    if (!form.expiry) {
      newErrors.expiry = "Expiry date is required";
    }

    // VALIDATION: Expiry date must be after or same as purchase date
    if (form.date && form.expiry && new Date(form.expiry) < new Date(form.date)) {
      newErrors.expiry = "Expiry date must be after purchase date";
    }

    setErrors(newErrors); // Update errors state with any validation issues found
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // ============================================================================
  // FUNCTION: handleSubmit
  // ============================================================================
  // Purpose: Handle form submission (add new or edit existing grocery)
  // Called when user clicks "Add" or "Update" button
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    // Validate form before submitting
    if (!validateForm()) {
      return; // Stop if validation fails (errors are already set)
    }

    // Check if we're in edit mode
    if (editingGrocery) {
      editGrocery(form); // Update existing grocery
    } else {
      // Add new grocery with a unique ID (using current timestamp)
      addGrocery({ id: Date.now(), ...form });
    }
    
    // Reset form to empty state after successful submission
    setForm({
      name: "",
      category: "",
      subcategory: "",
      quantity: "1",
      weight: "",
      price: "",
      date: getToday(),
      expiry: getOneYearFromNow(),
      finished: "no",
    });
    setErrors({}); // Clear any validation errors
  };

  // ============================================================================
  // HELPER FUNCTION: inputStyle
  // ============================================================================
  // Purpose: Apply error styling to input fields that have validation errors
  // Returns: CSS style object with red border if field has error
  const inputStyle = (field) => ({
    borderColor: errors[field] ? '#e74c3c' : undefined,
    borderWidth: errors[field] ? '2px' : undefined,
  });

  // ============================================================================
  // RENDER: Form JSX
  // ============================================================================
  return (
    <form className="form" onSubmit={handleSubmit}>
      {/* FIELD: Grocery Name - Required field for identification */}
      <div className="form-field">
        <input 
          placeholder="Name *" 
          value={form.name}
          style={inputStyle('name')}
          onChange={(e) => setForm({ ...form, name: e.target.value })} 
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>

      {/* FIELD: Category - Required main classification (e.g., Vegetable, Dairy) */}
      <div className="form-field">
        <input 
          placeholder="Category *" 
          value={form.category}
          style={inputStyle('category')}
          onChange={(e) => setForm({ ...form, category: e.target.value })} 
        />
        {errors.category && <span className="error-text">{errors.category}</span>}
      </div>

      {/* FIELD: Subcategory - Optional subsection within category */}
      <div className="form-field">
        <input 
          placeholder="Subcategory" 
          value={form.subcategory}
          onChange={(e) => setForm({ ...form, subcategory: e.target.value })} 
        />
      </div>

      {/* FIELD: Quantity - Required number of items purchased */}
      <div className="form-field">
        <input 
          type="number"
          min="1"
          placeholder="Quantity *" 
          value={form.quantity}
          style={inputStyle('quantity')}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })} 
        />
        {errors.quantity && <span className="error-text">{errors.quantity}</span>}
      </div>

      {/* FIELD: Weight - Optional weight/volume measurement */}
      <div className="form-field">
        <input 
          placeholder="Weight" 
          value={form.weight}
          onChange={(e) => setForm({ ...form, weight: e.target.value })} 
        />
      </div>

      {/* FIELD: Price - Required cost of the item in rupees */}
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

      {/* FIELD: Purchase Date - Required date when item was bought */}
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

      {/* FIELD: Expiry Date - Required date when item expires */}
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

      {/* BUTTONS: Submit or Cancel - Different based on add vs edit mode */}
      {editingGrocery ? (
        <>
          {/* Update button when editing */}
          <button type="submit">Update</button>
          {/* Cancel edit mode */}
          <button type="button" onClick={cancelEdit}>Cancel</button>
        </>
      ) : (
        <>
          {/* Add button for new items */}
          <button type="submit">Add</button>
        </>
      )}
    </form>
  );
}

export default GroceryForm;
