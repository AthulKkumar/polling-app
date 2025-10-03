import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import PollList from '../../components/PollList/PollList';

const UserDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>User Dashboard</h1>
        <div>
          <span>Welcome, {user?.username || user?.email}</span>
          <button onClick={logout} style={{ marginLeft: '10px' }}>
            Logout
          </button>
        </div>
      </header>
      
      <div>
        <h2>Available Polls</h2>
        {/* Add user functionality here */}
        <PollList/>
      </div>
    </div>
  );
};

export default UserDashboard;