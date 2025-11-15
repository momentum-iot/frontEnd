import React from 'react';
import { getStatusClass } from '../../../../shared/constants/status.js';
import "./Badge.css"

export const Badge = ({
    children,
    variant = 'default',
    status = null,
    className = ''
}) => {

    const getVariantClass = () => {

        if (status) {
            const statusClass = getStatusClass(status);
            return `badge ${statusClass}`;
        }


        switch (variant) {
            case 'success':
                return 'badge success';
            case 'warn':
                return 'badge warn';
            case 'danger':
                return 'badge danger';
            default:
                return 'badge';
        }
    };

    const finalClassName = `${getVariantClass()} ${className}`.trim();

    return (
        <span className={finalClassName}>
            {children}
        </span>
    );
};