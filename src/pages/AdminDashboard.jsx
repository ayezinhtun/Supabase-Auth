import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import LogoutButton from './Logout';
import UserManageDashoard from './UserManageDashoard';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import { useAuth } from '../context/AuthContext'; //  Use the context

const AdminDashboard = () => {
  const { role, loading } = useAuth(); // Get role from context
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    if (!loading && role) {
      fetchProducts();
    }
  }, [loading, role]);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id');

    if (error) console.error(error);
    else setProducts(data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) fetchProducts();
  };

  if (loading || !role) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="mb-4">Dashboard</h2>
        <LogoutButton />
      </div>

      {(role === 'admin' || role === 'manager') && (
        <div className="mb-3 text-end">
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            Add Product
          </button>
        </div>
      )}

      <table className="table table-striped table-bordered">
        <thead className="table">
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => setEditProduct(product)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {role === 'admin' && <UserManageDashoard />}

      {showAddModal && (
        <AddProductModal onClose={() => setShowAddModal(false)} onProductAdded={fetchProducts} />
      )}
      {editProduct && (
        <EditProductModal product={editProduct} onClose={() => setEditProduct(null)} onProductUpdated={fetchProducts} />
      )}
    </div>
  );
};

export default AdminDashboard;
 