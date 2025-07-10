import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { UserAuthProvider } from './context/UserAuthContext';
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './admin/AdminRoutes';
import Login from './pages/Login';

function RequireAdmin({ children }) {
  const { admin } = useAdmin();
  const location = useLocation();
  if (!admin) {
    // Not logged in as admin, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

const App = () => (
  <AdminProvider>
    <CartProvider>
      <UserAuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<UserRoutes />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={
              <RequireAdmin>
                <AdminRoutes />
              </RequireAdmin>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </UserAuthProvider>
    </CartProvider>
  </AdminProvider>
);

export default App;
