import React from 'react';
import './WorkspaceLayout.css';

const FooterBar: React.FC = () => (
  <footer className="ws-footer-bar">
    <div className="ws-footer-bar-inner">
      <div>© 2026 Octagone ERP Systems – Enterprise Operating System</div>
      <div className="ws-footer-links">
        <span>Privacy</span>
        <span>Terms</span>
        <span>Status</span>
      </div>
    </div>
  </footer>
);

export default FooterBar;
