import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import "./Sidebar.css"
import { IoBarbell } from "react-icons/io5";
import { IoSpeedometerOutline } from "react-icons/io5";
import { IoPeopleOutline } from "react-icons/io5";
import { IoPersonCircleOutline } from "react-icons/io5";

export const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="sidebar">

      <div className="brand">
        <div className="logoContainer">
          <div className="logoBox">
            <IoBarbell size={30} color="#fff" />
          </div>
        </div>
        <span style={{ marginLeft: 8 }}>Pump Up</span>
        <span className="admin">Admin</span>
      </div>


      <div className="muted" style={{ marginTop: 16, fontSize: 11, padding: '0 12px' }}>
        PRINCIPAL
      </div>

      <NavLink
        to="/"
        end
        className={({ isActive }) => `side-item ${isActive ? 'active' : ''}`}
      >
        <IoSpeedometerOutline size={20}/>
        <span style={{ marginLeft: 8 }}>Dashboard</span>
      </NavLink>

      <NavLink
        to="/users"
        className={({ isActive }) => `side-item ${isActive ? 'active' : ''}`}
      >
        <IoPeopleOutline size={20}/>
        <span style={{ marginLeft: 8 }}>Usuarios</span>
      </NavLink>


      <div className="muted" style={{ marginTop: 20, fontSize: 11, padding: '0 12px' }}>
        CONFIGURACIÓN
      </div>

      <NavLink
        to="/profile"
        className={({ isActive }) => `side-item ${isActive ? 'active' : ''}`}
      >
        <IoPersonCircleOutline size={20}/>
        <span style={{ marginLeft: 8 }}>Mi Perfil</span>
      </NavLink>


      <div style={{ marginTop: 'auto', padding: '12px' }}>
        <div
          className="muted"
          style={{
            fontSize: 11,
            padding: '8px',
            background: 'rgba(132, 194, 22, 0.1)',
            border: '1px solid rgba(132, 194, 22, 0.3)',
            borderRadius: 8
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            {user?.fullName}
          </div>
          <div style={{ fontSize: 10 }}>
            {user?.email}
          </div>
        </div>
        <div className="muted" style={{ fontSize: 10, marginTop: 8, textAlign: 'center' }}>
          v1.0 · Panel Admin
        </div>
      </div>
    </aside>
  );
};