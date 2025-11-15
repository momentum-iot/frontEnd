import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { Input } from '../../components/common/Input/Input.jsx';
import { Button } from '../../components/common/Button/Button.jsx';
import { IoBarbell } from "react-icons/io5";
import './login.css';

export const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isAdmin } = useAuth();


  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  React.useEffect(() => {
    if (isAuthenticated) {

      if (isAdmin) {
        navigate('/');
      } else {

        setErrorMessage('Acceso denegado. Solo administradores pueden acceder.');
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {

        if (result.user.role !== 'ADMIN') {
          setErrorMessage('Acceso denegado. Solo administradores pueden acceder a este sistema.');
          setLoading(false);
          return;
        }


        navigate('/');
      } else {

        setErrorMessage(result.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      setErrorMessage('Error inesperado. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: '20px'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>

        <div className="logoContainerLogin">
          <div className="logoBoxLogin">
            <IoBarbell size={70} color="#fff" />
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: 32 }}>Pump Up</h1>
          <h2 style={{ margin: '0 0 8px 0', fontSize: 20 }}>Panel de Administración</h2>
          <p className="muted" style={{ fontSize: 14 }}>
            Acceso exclusivo para administradores
          </p>
        </div>


        {errorMessage && (
          <div style={{
            padding: 12,
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 8,
            color: 'var(--danger)',
            marginBottom: 16,
            fontSize: 14
          }}>
            {errorMessage}
          </div>
        )}


        <form onSubmit={handleSubmit} className="grid" style={{ gap: 16 }}>
          <Input
            label="Email de administrador"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="admin@gym.com"
            required
            autoComplete="email"
          />

          <Input
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            style={{ width: '100%', marginTop: 8 }}
          >
            {loading ? 'Verificando...' : 'Iniciar sesión'}
          </Button>
        </form>

      </div>
    </div>
  );
};