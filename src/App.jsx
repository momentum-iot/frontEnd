import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './presentation/context/AuthContext.jsx';
import { useAuth } from './presentation/hooks/useAuth.js';
import { Layout } from './presentation/components/layout/Layout.jsx';

import { Login } from './presentation/pages/auth/Login.jsx';
import { Dashboard } from './presentation/pages/Dashboard/Dashboard.jsx';
import { Profile } from './presentation/pages/Profile/Profile.jsx';
import { Users } from './presentation/pages/Users/Users.jsx';
import { PaymentSuccess } from './presentation/pages/Payments/PaymentSuccess.jsx';


const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();


  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--bg)'
      }}>
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>💪</div>
          <div>Verificando permisos...</div>
        </div>
      </div>
    );
  }


  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }


  if (!isAdmin) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--bg)',
        padding: 20
      }}>
        <div className="card" style={{ textAlign: 'center', padding: 40, maxWidth: 400 }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>🚫</div>
          <h2 style={{ margin: '0 0 16px 0', color: 'var(--danger)' }}>
            Acceso Denegado
          </h2>
          <p className="muted" style={{ marginBottom: 24 }}>
            Este sistema es exclusivo para administradores.
          </p>
          <button
            className="btn primary"
            onClick={() => window.location.href = '/login'}
          >
            Volver al Login
          </button>
        </div>
      </div>
    );
  }


  return children;
};


function AppRoutes() {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />


      <Route
        path="/"
        element={
          <AdminRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </AdminRoute>
        }
      />

      <Route
        path="/users"
        element={
          <AdminRoute>
            <Layout>
              <Users />
            </Layout>
          </AdminRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <AdminRoute>
            <Layout>
              <Profile />
            </Layout>
          </AdminRoute>
        }
      />

      <Route
        path="/pagos/exito"
        element={
          <AdminRoute>
            <Layout>
              <PaymentSuccess />
            </Layout>
          </AdminRoute>
        }
      />


      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
