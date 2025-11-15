import React from 'react';
import "./Input.css"

export const Input = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    placeholder = '',
    error = null,
    required = false,
    disabled = false,
    className = '',
    ...props
}) => {
    return (
        <div className="input-group">

            {label && (
                <label htmlFor={name} className="input-label">
                    {label}
                    {required && <span className="text-danger"> *</span>}
                </label>
            )}


            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                className={`${error ? 'input-error' : ''} ${className}`.trim()}
                {...props}
            />


            {error && (
                <span className="error-message">
                    {error}
                </span>
            )}
        </div>
    );
};