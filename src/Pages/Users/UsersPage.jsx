import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers } from '../../APIs/AuthAPI';
import '../../Styles/UsersPage.css';
import { useAuth } from '../../Context/AuthContext';

function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getAllUsers(user.accessToken);
        setUsers(Array.isArray(data) ? data : data.data || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError(err.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    if (user?.accessToken) {
      fetchUsers();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="users-page">
        <nav className="users-navbar">
          <Link to="/productshome" className="users-navbar-brand">🛒 ShopApp</Link>
          <div className="users-navbar-right">
            <span className="users-navbar-username">{user?.email}</span>
          </div>
        </nav>
        <main className="users-main">
          <p className="users-loading">Loading users...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="users-page">
        <nav className="users-navbar">
          <Link to="/productshome" className="users-navbar-brand">🛒 ShopApp</Link>
        </nav>
        <main className="users-main">
          <p className="users-error">Error: {error}</p>
          <Link to="/productshome" className="users-back-btn">Back to Products</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="users-page">
      <nav className="users-navbar">
        <Link to="/productshome" className="users-navbar-brand">🛒 ShopApp</Link>
        <div className="users-navbar-right">
          <span className="users-navbar-username">{user?.email}</span>
        </div>
      </nav>

      <main className="users-main">
        <div className="users-header">
          <h1 className="users-title">All Users</h1>
          <p className="users-subtitle">Total Users: {users.length}</p>
        </div>

        {users.length === 0 ? (
          <p className="users-empty">No users found</p>
        ) : (
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Full Name</th>
                  <th>Phone Number</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.email}</td>
                    <td>{u.fullName || 'N/A'}</td>
                    <td>{u.phoneNumber || 'N/A'}</td>
                    <td><span className={`users-role-badge ${u.role?.toLowerCase()}`}>{u.role}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Link to="/productshome" className="users-back-btn">Back to Products</Link>
      </main>
    </div>
  );
}

export default UsersPage;
