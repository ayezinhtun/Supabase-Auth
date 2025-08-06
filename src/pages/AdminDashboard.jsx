import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import LogoutButton from './Logout';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '' });
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*').order('id');
    if (error) console.error(error);
    else setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openModal = (product = null) => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
      });
      setEditId(product.id);
    } else {
      setForm({ name: '', description: '', price: '' });
      setEditId(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm({ name: '', description: '', price: '' });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      alert('Name and price are required');
      return;
    }

    if (editId) {
      const { error } = await supabase
        .from('products')
        .update({
          name: form.name,
          description: form.description,
          price: Number(form.price),
        })
        .eq('id', editId);
      if (error) return alert(error.message);
    } else {
      const { error } = await supabase.from('products').insert([
        {
          name: form.name,
          description: form.description,
          price: Number(form.price),
        },
      ]);
      if (error) return alert(error.message);
    }

    closeModal();
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) alert(error.message);
    else fetchProducts();
  };

  return (
    <div className="container mt-4">
      <div className='d-flex align-items-center justify-content-between'>
         <h2 className="mb-4">Admin Dashboard - Manage Products</h2>
          <LogoutButton/>
      </div>
     
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary" onClick={() => openModal()}>
          Add Product
        </button>
      </div>

      <table className="table table-striped table-bordered">
        <thead className="table">
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th style={{ width: '100px' }}>Price ($)</th>
            <th style={{ width: '150px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">
                No products found.
              </td>
            </tr>
          )}
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.description || '-'}</td>
              <td>{p.price.toFixed(2)}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => openModal(p)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">
                  {editId ? 'Edit Product' : 'Add Product'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    step="0.01"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  {editId ? 'Update' : 'Add'} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
