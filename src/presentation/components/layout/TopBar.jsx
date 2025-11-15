import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../common/Badge/Badge.jsx';
import { Button } from '../common/Button/Button.jsx';
import { getRoleLabel } from '../../../shared/constants/roles.js';
import "./Topbar.css"

export const Topbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        if (window.confirm('¿Seguro que deseas cerrar sesión?')) {
            setLoggingOut(true);
            await logout();
            navigate('/login');
        }
    };

    return (
        <div className="topbar">

            <div className="row" style={{ flex: 1, gap: 12, alignItems: 'center' }}>

                <div className="avatar" style={{ width: 36, height: 36 }}>
                    {user?.initials}
                </div>


                <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>
                        {user?.fullName}
                    </div>
                    <div className="muted" style={{ fontSize: 12 }}>
                        {user?.email}
                    </div>
                </div>
            </div>


            <Badge variant={isAdmin ? 'success' : 'default'}>
                {getRoleLabel(user?.role)}
            </Badge>


            {user?.status && (
                <Badge status={user.status}>
                    {user.status}
                </Badge>
            )}


            <Button
                onClick={handleLogout}
                loading={loggingOut}
                variant="danger"
            >
                {loggingOut ? 'Cerrando...' : 'Salir'}
            </Button>
        </div>
    );
};