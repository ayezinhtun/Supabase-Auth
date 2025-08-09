import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const UserManageDashoard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    fetchUsers();
  }, []);


  const fetchUsers = async () => {
    const {data, error} = await supabase
    .from('profiles')
    .select('*');

    if(error){
      console.error('Error fetching users:', error.message);
    }else{
      setUsers(data);
    }

    setLoading(false);
  };


  const handleRoleChage = async (userId, newRole) =>{
    const {error} = await supabase
    .from('profiles')
    .update({role: newRole})
    .eq('id', userId);

    if(error){
      console.error('Error updating role:', error.message);
    }else{
      setUsers(prev => 
        prev.map(user=>
          user.id === userId ? {...user, role: newRole} : user
        )
      )
    }
  }

  if(loading) return <p>Loading users...</p>

  return (
    <div>
      <div className='container mt-5'>
        <h2 className='mb-4'>All Users</h2>
        <table className='table table-bordered'>
          <thead className='table-light'>
             <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created At</th>
          </tr>
          </thead>
          <tbody>
            {users.map(user =>(
               <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>
                  <select name="" value={ user.role } id="" onChange={e => handleRoleChage(user.id, e.target.value)} className='form-select'>
                    <option value="admin">admin</option>
                    <option value="manager">manager</option>
                    <option value="user">user</option>
                  </select>
                </td>
                <td>{user.created_at}</td>
            </tr>
            ))}
          </tbody>
         
        </table>
      </div>
    </div>
  )
}

export default UserManageDashoard
