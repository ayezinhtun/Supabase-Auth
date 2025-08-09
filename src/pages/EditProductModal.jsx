import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function EditProductModal({ product, onClose, onProductUpdated }) {
  const [form, setForm] = useState({
    name: product.name,
    description: product.description || '',
    price: product.price,
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('products')
      .update({
        name: form.name,
        description: form.description,
        price: Number(form.price),
      })
      .eq('id', product.id);

    if (error) {
      alert(error.message);
    } else {
      onProductUpdated(); // Refresh
      onClose();
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <form className="modal-content" onSubmit={handleUpdate}>
          <div className="modal-header">
            <h5 className="modal-title">Edit Product</h5>
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
            <button type="submit" className="btn btn-warning">Update Product</button>
          </div>
        </form>
      </div>
    </div>
  );
}
