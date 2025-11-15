import React from 'react';
import "./Button.css";

/**
 * @param {{
 *   children: React.ReactNode,
 *   onClick?: () => void,
 *   type?: "button" | "submit" | "reset",
 *   variant?: string,
 *   disabled?: boolean,
 *   loading?: boolean,
 *   className?: string
 *   style?: React.CSSProperties
 * }} props
 */

export const Button = ({
    children,
    onClick,
    type = 'button',
    variant = 'default',
    disabled = false,
    loading = false,
    style = {},
    className = '',
    ...props
}) => {

    const getVariantClass = () => {
        switch (variant) {
            case 'primary':
                return 'btn primary';
            case 'danger':
                return 'btn danger';
            default:
                return 'btn';
        }
    };

    const finalClassName = `${getVariantClass()} ${className}`.trim();

    return (
        <button
            type={type}
            className={finalClassName}
            onClick={onClick}
            disabled={disabled || loading}
            style={style}
            {...props}
        >
            {loading ? 'Cargando...' : children}
        </button>
    );
};
