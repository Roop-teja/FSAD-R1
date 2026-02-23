import './Card.css';

const Card = ({
  children,
  className = '',
  variant = 'default',
  hover = false,
  padding = 'normal',
  onClick
}) => {
  const classes = [
    'card',
    `card-${variant}`,
    `card-padding-${padding}`,
    hover && 'card-hover',
    onClick && 'card-clickable',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => (
  <div className={`card-header ${className}`}>{children}</div>
);

const CardBody = ({ children, className = '' }) => (
  <div className={`card-body ${className}`}>{children}</div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`card-footer ${className}`}>{children}</div>
);

const CardImage = ({ src, alt, className = '' }) => (
  <div className={`card-image ${className}`}>
    <img src={src} alt={alt} />
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`card-title ${className}`}>{children}</h3>
);

const CardSubtitle = ({ children, className = '' }) => (
  <p className={`card-subtitle ${className}`}>{children}</p>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Image = CardImage;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;

export default Card;