import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useCheck } from '../../hooks/useCheck.js';
import { Button } from '../../components/common/Button/Button.jsx';
import { Badge } from '../../components/common/Badge/Badge.jsx';
import { CreateUserModal } from '../../components/features/users/CreateUserModal.jsx';
import { authRepository } from '../../../infrastructure/api/repositories/AuthRepositoryImpl.js';
import './Dashboard.css';

const MAX_CAPACITY = 60;

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getConcurrency, concurrency } = useCheck();
  
  const [updatedAt, setUpdatedAt] = useState('');
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingPayment: 0
  });
  

  useEffect(() => {
    loadData();
    

    const interval = setInterval(() => {
      getConcurrency();
      setUpdatedAt(new Date().toLocaleTimeString());
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  const loadData = async () => {
    await getConcurrency();
    await loadStats();
    setUpdatedAt(new Date().toLocaleTimeString());
  };
  

  const loadStats = async () => {
    try {
      const users = await authRepository.getAllUsers();
      
      setStats({
        totalUsers: users.length,
        activeUsers: users.filter(u => u.status === 'ACTIVO').length,
        pendingPayment: users.filter(u => u.status === 'SIN_PAGAR').length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };
  
  
  const percentage = Math.round((concurrency / MAX_CAPACITY) * 100);
  
  
  const getOccupancyColor = () => {
    if (percentage < 50) return '#22c55e'; 
    if (percentage < 80) return '#f59e0b'; 
    return '#ef4444';
  };
  
  return (
    <div style={{ padding: 20 }}>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 24 
      }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0' }}>
            Panel de Administración
          </h1>
          <p className="muted">
            Bienvenido, {user?.name}
          </p>
        </div>
        
        <Button 
          variant="primary" 
          onClick={() => setShowCreateUserModal(true)}
        >
          + Crear Usuario
        </Button>
      </div>
      

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 16,
        marginBottom: 16
      }}>

        <div className="card">
          <div className="muted" style={{ marginBottom: 8 }}>
            Total de Usuarios
          </div>
          <div style={{ 
            fontSize: 36, 
            fontWeight: 800,
            color: 'var(--accent)'
          }}>
            {stats.totalUsers}
          </div>
          <div style={{ marginTop: 8 }}>
            <Button 
              onClick={() => navigate('/users')}
              style={{ fontSize: 13 }}
            >
              Ver todos →
            </Button>
          </div>
        </div>
        

        <div className="card">
          <div className="muted" style={{ marginBottom: 8 }}>
            Usuarios Activos
          </div>
          <div style={{ 
            fontSize: 36, 
            fontWeight: 800,
            color: '#22c55e'
          }}>
            {stats.activeUsers}
          </div>
          <div style={{ marginTop: 8 }}>
            <Badge variant="success">
              {Math.round((stats.activeUsers / stats.totalUsers) * 100) || 0}% del total
            </Badge>
          </div>
        </div>
        

        <div className="card">
          <div className="muted" style={{ marginBottom: 8 }}>
            Pagos Pendientes
          </div>
          <div style={{ 
            fontSize: 36, 
            fontWeight: 800,
            color: stats.pendingPayment > 0 ? '#f59e0b' : '#6B7280'
          }}>
            {stats.pendingPayment}
          </div>
          <div style={{ marginTop: 8 }}>
            {stats.pendingPayment > 0 ? (
              <Badge variant="warn">
                Requiere atención
              </Badge>
            ) : (
              <Badge variant="success">
                Todo al día
              </Badge>
            )}
          </div>
        </div>
        

        <div className="card">
          <div className="muted" style={{ marginBottom: 8 }}>
            En el Gimnasio Ahora
          </div>
          <div style={{ 
            fontSize: 36, 
            fontWeight: 800,
            color: getOccupancyColor()
          }}>
            {concurrency}
          </div>
          <div style={{ marginTop: 8 }}>
            <Badge variant={percentage > 80 ? 'danger' : percentage > 50 ? 'warn' : 'success'}>
              {percentage}% de capacidad
            </Badge>
          </div>
        </div>
      </div>
      

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="row-between" style={{ marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>Aforo del gimnasio</h3>
          <Badge variant={percentage > 80 ? 'danger' : percentage > 50 ? 'warn' : 'success'}>
            {percentage}%
          </Badge>
        </div>
        

        <div className="progress" style={{ marginBottom: 12 }}>
          <div style={{ 
            width: `${percentage}%`,
            background: getOccupancyColor()
          }} />
        </div>
        
        <div className="row-between">
          <span className="muted">{concurrency} / {MAX_CAPACITY} personas</span>
          <span className="muted">Actualizado: {updatedAt}</span>
        </div>
      </div>
      
      <CreateUserModal
        isOpen={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
        onSuccess={loadStats}
      />
    </div>
  );
};