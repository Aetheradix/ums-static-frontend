import './Card.css';

interface CardProps {
  title?: string;
  note?: string;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

export default function Card({
  title,
  note,
  children,
  className = '',
  onClose,
}: CardProps) {
  return (
    <div className={`card ${className}`}>
      <div className="card-header">
        <div>
          {title && <h3 className="card-title">{title}</h3>}
          {note && <p className="card-note">{note}</p>}
        </div>

        {onClose && (
          <button
            className="card-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        )}
      </div>

      <div className="card-content">{children}</div>
    </div>
  );
}
