import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AddProductModal({ onClose, onProductAdded }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
  });

  const handleAdd = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('products').insert([
      {
        name: form.name,
        description: form.description,
        price: Number(form.price),
      },
    ]);
    if (error) {
      alert(error.message);
    } else {
      onProductAdded(); //refresh product
      onClose();
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <form className="modal-content" onSubmit={handleAdd}>
          <div className="modal-header">
            <h5 className="modal-title">Add Product</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <input type="text" className="form-control" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label">Price</label>
              <input type="number" className="form-control" required step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-success">Add Product</button>
          </div>
        </form>
      </div>
    </div>
  );
}
