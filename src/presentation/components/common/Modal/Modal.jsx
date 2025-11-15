import React, { useEffect } from 'react';
import "./Modal.css"

export const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = '560px'
}) => {

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);


    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);


    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div
                className="modal"
                style={{ maxWidth }}
                onClick={(e) => e.stopPropagation()}
            >

                <div className="row-between" style={{ marginBottom: 16 }}>
                    <h3 style={{ margin: 0 }}>{title}</h3>
                    <button
                        className="btn"
                        onClick={onClose}
                        aria-label="Cerrar modal"
                    >
                        ✕
                    </button>
                </div>


                <div className="modal-content">
                    {children}
                </div>
            </div>
        </div>
    );
};