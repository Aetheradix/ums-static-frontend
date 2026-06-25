import React from 'react';
import './WorkspaceLayout.css';

const TopBar: React.FC = () => (
  <div className="ws-topbar">
    <div className="ws-topbar-inner">
      <span>Octagone ERP</span>
      <div>
        <span>Help Center</span>
        <span className="ws-topbar-dot">·</span>
        <span>Status</span>
      </div>
    </div>
  </div>
);

export default TopBar;
