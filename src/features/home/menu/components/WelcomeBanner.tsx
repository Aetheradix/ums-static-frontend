import React from 'react';
import '../styles/menu.css';

const WelcomeBanner: React.FC = () => (
  <section className="welcome-banner">
    <div className="welcome-sso-badge">
      <span className="welcome-sso-icon">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      </span>
      Logged in via UMS SSO - session expires in 86 days
    </div>

    <div className="welcome-content">
      <div>
        <h1 className="welcome-heading">
          Welcome, <span className="welcome-name">Alex Lin</span>
        </h1>
        <p className="welcome-subtext">
          Your unified workspace. Every service, every record — one tile away.
        </p>
      </div>

      <div className="welcome-actions">
        <button className="welcome-btn-outline">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          Export
        </button>
        <button className="welcome-btn-filled">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Record
        </button>
      </div>
    </div>
  </section>
);

export default WelcomeBanner;
