import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function ManagerDashboard() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*').order('id');
    if (error) console.error(error);
    else setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Manager Dashboard - Product List</h2>

      {products.length === 0 ? (
        <p className="text-center">No products found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-hover align-middle">
            <thead className="table-primary">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Product Name</th>
                <th scope="col">Description</th>
                <th scope="col">Price ($)</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, index) => (
                <tr key={p.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{p.name}</td>
                  <td>{p.description || '—'}</td>
                  <td>{p.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
