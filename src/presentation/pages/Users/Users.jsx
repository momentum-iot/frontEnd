import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { authRepository } from '../../../infrastructure/api/repositories/AuthRepositoryImpl.js';
import { Badge } from '../../components/common/Badge/Badge.jsx';
import { Input } from '../../components/common/Input/Input.jsx';
import { Button } from '../../components/common/Button/Button.jsx';
import { CreateUserModal } from '../../components/features/users/CreateUserModal.jsx';
import { formatDate } from '../../../shared/utils/formatters.js';
import { getRoleLabel } from '../../../shared/constants/roles.js';
import './Users.css';

export const Users = () => {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [showCreateModal, setShowCreateModal] = useState(false);


    useEffect(() => {

        if (!isAdmin) {
            navigate('/');
            return;
        }

        loadUsers();
    }, [isAdmin, navigate]);


    useEffect(() => {
        filterUsers();
    }, [users, searchQuery, statusFilter, roleFilter]);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const allUsers = await authRepository.getAllUsers();
            setUsers(allUsers);
        } catch (error) {
            console.error('Error loading users:', error);
            alert('Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        let filtered = [...users];


        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(user =>
                user.name?.toLowerCase().includes(query) ||
                user.lastName?.toLowerCase().includes(query) ||
                user.email?.toLowerCase().includes(query)
            );
        }


        if (statusFilter !== 'ALL') {
            filtered = filtered.filter(user => user.status === statusFilter);
        }


        if (roleFilter !== 'ALL') {
            filtered = filtered.filter(user => user.role === roleFilter);
        }

        setFilteredUsers(filtered);
    };

    const handleUserClick = (userId) => {
        navigate(`/users/${userId}`);
    };

    const handleCreateSuccess = () => {
        loadUsers();
    };

    if (loading) {
        return (
            <div style={{ padding: 20 }}>
                <div className="card">Cargando usuarios...</div>
            </div>
        );
    }

    return (
        <div style={{ padding: 20 }}>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 24
            }}>
                <div>
                    <h1 style={{ margin: '0 0 8px 0' }}>Gestión de Usuarios</h1>
                    <p className="muted">
                        Total: {users.length} usuarios registrados
                    </p>
                </div>

                <Button
                    variant="primary"
                    onClick={() => setShowCreateModal(true)}
                >
                    + Crear Usuario
                </Button>
            </div>


            <div className="card" style={{ marginBottom: 16 }}>
                <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 250 }}>
                        <Input
                            placeholder="Buscar por nombre o email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} label={undefined} name={undefined} />
                    </div>

                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        style={{ minWidth: 150 }}
                    >
                        <option value="ALL">Todos los roles</option>
                        <option value="ADMIN">Administradores</option>
                        <option value="USER">Miembros</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ minWidth: 150 }}
                    >
                        <option value="ALL">Todos los estados</option>
                        <option value="ACTIVO">Activo</option>
                        <option value="SIN_PAGAR">Sin pagar</option>
                        <option value="RETIRADO">Retirado</option>
                    </select>

                    <div className="muted" style={{ alignSelf: 'center', whiteSpace: 'nowrap' }}>
                        {filteredUsers.length} de {users.length}
                    </div>
                </div>
            </div>
            <div className="card">
                {filteredUsers.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: 60,
                        color: 'var(--muted)'
                    }}>

                        <div style={{ fontSize: 16, marginBottom: 8 }}>
                            No se encontraron usuarios
                        </div>
                        {searchQuery && (
                            <div style={{ fontSize: 14 }}>
                                Intenta con otros términos de búsqueda
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="list">
                        {filteredUsers.map(user => (
                            <div
                                key={user.id}
                                className="item"
                                onClick={() => handleUserClick(user.id)}
                                style={{ cursor: 'pointer' }}
                            >

                                <div className="avatar">
                                    {user.initials}
                                </div>


                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 700, marginBottom: 2 }}>
                                        {user.fullName}
                                    </div>
                                    <div className="muted" style={{ fontSize: 13 }}>
                                        {user.email}
                                    </div>
                                </div>


                                <div style={{
                                    marginRight: 20, display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                    <Badge variant={user.role === 'ADMIN' ? 'success' : 'default'}>
                                        {getRoleLabel(user.role)}
                                    </Badge>
                                </div>


                                <div style={{
                                    textAlign: 'center',
                                    marginRight: 12,
                                    minWidth: 100,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                    <div style={{ fontSize: 12, fontWeight: 600 }}>
                                        {user.membership}
                                    </div>
                                    <div className="muted" style={{ fontSize: 11 }}>
                                        Desde {formatDate(user.joinDate)}
                                    </div>
                                </div>


                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        minWidth: 90
                                    }}
                                >
                                    <Badge status={user.status}>
                                        {user.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <CreateUserModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={handleCreateSuccess}
            />
        </div>
    );
};
