import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  className = ''
}) => {
  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-full',
    disabled && 'btn-disabled',
    loading && 'btn-loading',
    icon && `btn-icon-${iconPosition}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && (
        <span className="btn-spinner">
          <svg viewBox="0 0 24 24" fill="none" className="spinner-icon">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="10">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 12 12"
                to="360 12 12"
                dur="1s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </span>
      )}
      {icon && iconPosition === 'left' && !loading && (
        <span className="btn-icon">{icon}</span>
      )}
      <span className="btn-text">{children}</span>
      {icon && iconPosition === 'right' && !loading && (
        <span className="btn-icon">{icon}</span>
      )}
    </button>
  );
};

export default Button;