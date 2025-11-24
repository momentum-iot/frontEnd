import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { Badge } from '../../components/common/Badge/Badge.jsx';
import { formatDate, calculateBMI } from '../../../shared/utils/formatters.js';
import { getMembershipInfo, MEMBERSHIP_TYPES } from '../../../shared/constants/membership.js';
import { getStatusLabel } from '../../../shared/constants/status.js';
import { getRoleLabel } from '../../../shared/constants/roles.js';
import { createMembershipCheckoutSession } from '../../../infrastructure/api/payments/paymentService.js';
import './Profile.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const Profile = () => {
    const { user, refreshUser } = useAuth();
    const location = useLocation();
    const [isPaying, setIsPaying] = useState(false);
    const [isUpgrading, setIsUpgrading] = useState(false);

    // Si volvemos del checkout (success_url con query), refrescamos el usuario para traer la membresía actualizada
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const hasCheckoutSignal = params.get('session_id') || params.get('success') === 'true';

        if (hasCheckoutSignal) {
            refreshUser?.();
        }
    }, [location.search, refreshUser]);

    if (!user) {
        return (
            <div style={{ padding: 20 }}>
                <div className="card">Cargando perfil...</div>
            </div>
        );
    }

    const membershipInfo = getMembershipInfo(user.membership);
    const bmi = calculateBMI(user.height, user.weight);

    const handlePayMembership = async () => {
        try {
            if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
                throw new Error('Falta configurar VITE_STRIPE_PUBLISHABLE_KEY en .env');
            }

            setIsPaying(true);

            const { sessionId, url } = await createMembershipCheckoutSession(user.membership);
            if (url) {
                window.location.href = url; // nueva API: redirigir usando la URL de Checkout
                return;
            }

            const stripe = await stripePromise;

            if (!stripe) {
                throw new Error('Stripe no se pudo inicializar');
            }

            const { error } = await stripe.redirectToCheckout({ sessionId });
            if (error) {
                console.error('Stripe redirect error:', error);
                alert('No se pudo redirigir al pago. Inténtalo nuevamente.');
            }
        } catch (err) {
            console.error('Payment error:', err);
            const message = err?.response?.data?.message || err?.message;
            alert(message || 'No se pudo iniciar el pago. Inténtalo nuevamente.');
        } finally {
            setIsPaying(false);
        }
    };

    const handleUpgradeMembership = async () => {
        try {
            if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
                throw new Error('Falta configurar VITE_STRIPE_PUBLISHABLE_KEY en .env');
            }

            setIsUpgrading(true);

            const { sessionId, url } = await createMembershipCheckoutSession(MEMBERSHIP_TYPES.PREMIUM);
            if (url) {
                window.location.href = url;
                return;
            }

            const stripe = await stripePromise;
            if (!stripe) {
                throw new Error('Stripe no se pudo inicializar');
            }

            const { error } = await stripe.redirectToCheckout({ sessionId });
            if (error) {
                console.error('Stripe redirect error:', error);
                alert('No se pudo redirigir al pago. Inténtalo nuevamente.');
            }
        } catch (err) {
            console.error('Upgrade payment error:', err);
            const message = err?.response?.data?.message || err?.message;
            alert(message || 'No se pudo iniciar el pago. Inténtalo nuevamente.');
        } finally {
            setIsUpgrading(false);
        }
    };

    return (
        <div style={{ padding: 20 }}>

            <div style={{ marginBottom: 24 }}>
                <h1 style={{ margin: '0 0 8px 0' }}>Mi Perfil</h1>
                <p className="muted">Información de tu cuenta</p>
            </div>


            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>

                <div className="grid" style={{ gap: 16 }}>
                    <div className="card">
                        <div className="row" style={{ gap: 16, marginBottom: 20 }}>

                            <div className="avatar" style={{
                                width: 80,
                                height: 80,
                                fontSize: 32,
                                fontWeight: 700
                            }}>
                                {user.initials}
                            </div>

                            <div>
                                <h2 style={{ margin: '0 0 8px 0' }}>{user.fullName}</h2>
                                <div className="muted" style={{ marginBottom: 8 }}>
                                    {user.email}
                                </div>
                                <div className="row" style={{ gap: 8 }}>
                                    <Badge variant={user.isAdmin ? 'success' : 'default'}>
                                        {getRoleLabel(user.role)}
                                    </Badge>
                                    <Badge status={user.status}>
                                        {getStatusLabel(user.status)}
                                    </Badge>
                                </div>
                            </div>
                        </div>


                        <table>
                            <tbody>
                                <tr>
                                    <th>Nombre completo</th>
                                    <td>{user.fullName}</td>
                                </tr>
                                <tr>
                                    <th>Email</th>
                                    <td>{user.email}</td>
                                </tr>
                                <tr>
                                    <th>Teléfono</th>
                                    <td>{user.phone || '—'}</td>
                                </tr>
                                <tr>
                                    <th>Edad</th>
                                    <td>{user.age ? `${user.age} años` : '—'}</td>
                                </tr>
                                <tr>
                                    <th>Género</th>
                                    <td>{user.gender || '—'}</td>
                                </tr>
                                <tr>
                                    <th>Fecha de nacimiento</th>
                                    <td>{user.birthday ? formatDate(user.birthday) : '—'}</td>
                                </tr>
                                <tr>
                                    <th>Contacto de emergencia</th>
                                    <td>{user.emergencyContact || '—'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>


                    <div className="card">
                        <h3 style={{ marginTop: 0 }}>Datos físicos</h3>
                        <div className="stats">
                            <div className="stat">
                                <div className="muted">Altura</div>
                                <div style={{ fontSize: 20, fontWeight: 700 }}>
                                    {user.height ? `${user.height} cm` : '—'}
                                </div>
                            </div>
                            <div className="stat">
                                <div className="muted">Peso</div>
                                <div style={{ fontSize: 20, fontWeight: 700 }}>
                                    {user.weight ? `${user.weight} kg` : '—'}
                                </div>
                            </div>
                            {bmi && (
                                <div className="stat">
                                    <div className="muted">IMC</div>
                                    <div style={{ fontSize: 20, fontWeight: 700 }}>
                                        {bmi.value}
                                    </div>
                                    <div className="muted" style={{ fontSize: 12 }}>
                                        {bmi.category}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>


                <div className="grid" style={{ gap: 16 }}>

                    <div className="card">
                        <h3 style={{ marginTop: 0 }}>Membresía</h3>
                        <div style={{
                            padding: 16,
                            background: `${membershipInfo.color}22`,
                            border: `1px solid ${membershipInfo.color}55`,
                            borderRadius: 12,
                            marginBottom: 12
                        }}>
                            <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>
                                {membershipInfo.name}
                            </div>
                            <div style={{ fontSize: 20, color: membershipInfo.color }}>
                                S/ {membershipInfo.price}/mes
                            </div>
                        </div>

                        <div style={{ fontSize: 14 }}>
                            <div style={{ fontWeight: 600, marginBottom: 8 }}>
                                Beneficios incluidos:
                            </div>
                            <ul style={{ margin: 0, paddingLeft: 20 }}>
                                {membershipInfo.benefits.map((benefit, index) => (
                                    <li key={index} style={{ marginBottom: 4 }}>
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            onClick={handlePayMembership}
                            disabled={isPaying}
                            style={{
                                marginTop: 12,
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: 10,
                                border: 'none',
                                background: membershipInfo.color,
                                color: 'white',
                                fontWeight: 700,
                                cursor: isPaying ? 'not-allowed' : 'pointer',
                                opacity: isPaying ? 0.7 : 1
                            }}
                        >
                            {isPaying ? 'Redirigiendo a Stripe...' : 'Pagar membresía con tarjeta'}
                        </button>

                        {user.membership !== MEMBERSHIP_TYPES.PREMIUM && (
                            <button
                                onClick={handleUpgradeMembership}
                                disabled={isUpgrading}
                                style={{
                                    marginTop: 8,
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: 10,
                                    border: '1px solid #111827',
                                    background: isUpgrading ? '#111827' : '#0f172a',
                                    color: 'white',
                                    fontWeight: 700,
                                    cursor: isUpgrading ? 'not-allowed' : 'pointer',
                                    opacity: isUpgrading ? 0.8 : 1
                                }}
                            >
                                {isUpgrading ? 'Redirigiendo...' : 'Mejorar a Premium'}
                            </button>
                        )}
                    </div>


                    <div className="card">
                        <h3 style={{ marginTop: 0 }}>Cuenta</h3>
                        <div className="grid" style={{ gap: 12 }}>
                            <div>
                                <div className="muted" style={{ fontSize: 12, marginBottom: 4 }}>
                                    Miembro desde
                                </div>
                                <div style={{ fontWeight: 600 }}>
                                    {user.joinDate ? formatDate(user.joinDate) : '—'}
                                </div>
                            </div>
                            <div>
                                <div className="muted" style={{ fontSize: 12, marginBottom: 4 }}>
                                    Hora de registro
                                </div>
                                <div style={{ fontWeight: 600 }}>
                                    {user.joinHour || '—'}
                                </div>
                            </div>
                            <div>
                                <div className="muted" style={{ fontSize: 12, marginBottom: 4 }}>
                                    ID de usuario
                                </div>
                                <div style={{ fontWeight: 600, fontFamily: 'monospace' }}>
                                    #{user.id}
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="card">
                        <h3 style={{ marginTop: 0 }}>Perfil</h3>
                        <div style={{ marginBottom: 8 }}>
                            <div className="row-between" style={{ marginBottom: 4 }}>
                                <span className="muted" style={{ fontSize: 12 }}>Completitud</span>
                                <span style={{ fontSize: 12, fontWeight: 600 }}>
                                    {user.profileCompleteness}%
                                </span>
                            </div>
                            <div className="progress">
                                <div style={{
                                    width: `${user.profileCompleteness}%`,
                                    background: user.profileCompleteness === 100
                                        ? '#22c55e'
                                        : '#f59e0b'
                                }} />
                            </div>
                        </div>
                        {user.profileCompleteness < 100 && (
                            <p className="muted" style={{ fontSize: 12, margin: 0 }}>
                                Completa tu perfil para acceder a todas las funciones
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
