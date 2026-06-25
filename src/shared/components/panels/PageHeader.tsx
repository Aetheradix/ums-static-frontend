import { type ReactNode, useState } from 'react';
import './Page.css';

interface Props {
  header: string;
  subHeader?: string;
  offCanvas?: ReactNode;
  showInfoIcon?: boolean;
}

export default function PageHeader({
  header,
  subHeader,
  offCanvas,
  showInfoIcon = !!offCanvas,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div>
        <h1 className="page-title">{header}</h1>

        {subHeader && (
          <p
            className={`page-subtitle ${showInfoIcon ? 'clickable' : ''}`}
            onClick={() => (showInfoIcon ? setOpen(true) : null)}
          >
            {subHeader}{' '}
            {showInfoIcon && (
              <i className="pi pi-info-circle font-bold text-success"></i>
            )}
          </p>
        )}
      </div>

      <div className={`off-canvas ${open ? 'open' : ''}`}>
        <div className="off-canvas-header">
          <h3>{header}</h3>
          <button className="close-btn" onClick={() => setOpen(false)}>
            ×
          </button>
        </div>
        <div className="off-canvas-body">
          {offCanvas || <p>Description not available.</p>}
        </div>
      </div>
      {open && <div className="backdrop" onClick={() => setOpen(false)} />}
    </>
  );
}
