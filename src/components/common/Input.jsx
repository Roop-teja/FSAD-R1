import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import './Input.css';

const Input = ({
  type = 'text',
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  icon,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const classes = [
    'input-wrapper',
    error && 'input-error',
    disabled && 'input-disabled',
    icon && 'has-icon',
    isFocused && 'input-focused',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div className="input-container">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={inputType}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="input-field"
          {...props}
        />
        {type === 'password' && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>
      {(error || helperText) && (
        <span className={`input-helper ${error ? 'error' : ''}`}>
          {error || helperText}
        </span>
      )}
    </div>
  );
};

export default Input;