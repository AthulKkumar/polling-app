// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './contexts/AuthContext';
// import { ProtectedRoute, AdminRoute, UserRoute } from './components/ProtectedRoute';
// import AuthPage from './pages/Auth/Auth';
// import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
// import UserDashboard from './pages/UserDashboard/UserDashboard';
// import './App.css';

// // Component to handle dashboard routing based on user role
// const DashboardRouter = () => {
//   const { isAdmin, loading } = useAuth();

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return isAdmin() ? <Navigate to="/admin-dashboard" replace /> : <Navigate to="/user-dashboard" replace />;
// };

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <div className="App">
//           <Routes>
//             {/* Public Route */}
//             <Route path="/auth" element={<AuthPage />} />

//             {/* Protected Routes */}
//             <Route
//               path="/dashboard"
//               element={
//                 <ProtectedRoute>
//                   <DashboardRouter />
//                 </ProtectedRoute>
//               }
//             />

//             {/* Admin Routes */}
//             <Route
//               path="/admin-dashboard"
//               element={
//                 <AdminRoute>
//                   <AdminDashboard />
//                 </AdminRoute>
//               }
//             />

//             {/* User Routes */}
//             <Route
//               path="/user-dashboard"
//               element={
//                 <UserRoute>
//                   <UserDashboard />
//                 </UserRoute>
//               }
//             />

//             {/* Default Route */}
//             <Route path="/" element={<Navigate to="/dashboard" replace />} />

//             {/* Catch all - redirect to auth */}
//             <Route path="*" element={<Navigate to="/auth" replace />} />
//           </Routes>
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute, AdminRoute, UserRoute, PublicRoute } from './components/ProtectedRoute';
import AuthPage from './pages/Auth/Auth';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import UserDashboard from './pages/UserDashboard/UserDashboard';
import './App.css';

const DashboardRouter = () => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}>Loading...</div>;
  }

  return isAdmin() ? (
    <Navigate to="/admin-dashboard" replace />
  ) : (
    <Navigate to="/user-dashboard" replace />
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Route - Redirect authenticated users */}
            <Route
              path="/auth"
              element={
                <PublicRoute>
                  <AuthPage />
                </PublicRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin-dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            {/* User Routes */}
            <Route
              path="/user-dashboard"
              element={
                <UserRoute>
                  <UserDashboard />
                </UserRoute>
              }
            />

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Catch all - redirect to dashboard (will handle auth redirect) */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
