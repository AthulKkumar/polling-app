import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
// import PollCreate from '../../components/PollForm/PollForm';
import AdminPollManager from '../../components/PollForm/PollForm';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Admin Dashboard</h1>
        <div>
          <span>Welcome, {user?.username || user?.email}</span>
          <button onClick={logout} style={{ marginLeft: '10px' }}>
            Logout
          </button>
        </div>
      </header>
      
      <div>
        <h2>Admin Panel</h2>
        <p>This is the admin dashboard where admins can manage polls.</p>
        {/* Add admin functionality here */}
        {/* <PollCreate/> */}
        <AdminPollManager/>
      </div>
    </div>
  );
};

export default AdminDashboard;