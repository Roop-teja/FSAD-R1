import './ProgressBar.css';

const ProgressBar = ({
  value = 0,
  max = 100,
  size = 'medium',
  variant = 'primary',
  showLabel = false,
  label,
  animated = false,
  className = ''
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const classes = [
    'progress-wrapper',
    `progress-${size}`,
    className
  ].filter(Boolean).join(' ');

  const barClasses = [
    'progress-bar',
    `progress-${variant}`,
    animated && 'progress-animated'
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {(showLabel || label) && (
        <div className="progress-info">
          {label && <span className="progress-label">{label}</span>}
          {showLabel && <span className="progress-value">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className="progress-track">
        <div
          className={barClasses}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

export default ProgressBar;