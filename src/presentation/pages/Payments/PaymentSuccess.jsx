import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { confirmMembershipPayment } from '../../../infrastructure/api/payments/paymentService.js';

export const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, refreshUser } = useAuth();

    const [status, setStatus] = useState('pending'); // pending | success | error
    const [message, setMessage] = useState('Verificando tu pago...');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const sessionId = params.get('session_id');
        const successFlag = params.get('success');

        if (successFlag !== 'true') {
            setStatus('error');
            setMessage('No se recibió confirmación de pago.');
            return;
        }

        if (!sessionId) {
            setStatus('error');
            setMessage('No se encontró el ID de sesión de pago.');
            return;
        }

        const confirm = async () => {
            try {
                setStatus('pending');
                setMessage('Confirmando pago y actualizando membresía...');

                await confirmMembershipPayment(sessionId, user?.id);
                await refreshUser?.();

                setStatus('success');
                setMessage('Pago confirmado. Tu membresía ha sido actualizada.');

                // Redirigir al perfil después de un momento
                setTimeout(() => {
                    navigate('/profile');
                }, 1500);
            } catch (error) {
                console.error('Error confirmando pago:', error);
                const backendMessage = error?.response?.data?.message || error?.message;
                setStatus('error');
                setMessage(backendMessage || 'No se pudo confirmar el pago.');
            }
        };

        confirm();
    }, [location.search, navigate, refreshUser, user?.id]);

    const color = status === 'success' ? '#22c55e' : status === 'error' ? '#ef4444' : '#0ea5e9';

    return (
        <div style={{ padding: 24 }}>
            <div className="card" style={{ maxWidth: 520, margin: '0 auto' }}>
                <div style={{ marginBottom: 12, color }}>
                    {status === 'success' ? '✅' : status === 'error' ? '⚠️' : '⏳'}
                </div>
                <h2 style={{ marginTop: 0, marginBottom: 8 }}>Estado del pago</h2>
                <p style={{ margin: 0 }}>{message}</p>
            </div>
        </div>
    );
};
