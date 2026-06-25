import { Avatar } from 'primereact/avatar';
import { InputText } from 'primereact/inputtext';
import './MainHeader.css';

export default function MainHeader() {
  return (
    <div className="main-header">
      {/* Left Section */}
      <div className="main-header-left">
        <img
          src="/Octagon_Logo.png"
          alt="Octagon Logo"
          className="w-10 h-10 object-contain rounded-lg ws-logo-image"
        />
      </div>

      {/* Search */}
      <div className="main-header-search-wrapper mobile-hidden">
        <div className="main-header-search-box">
          <i className="pi pi-search main-header-search-icon" />

          <InputText
            placeholder="Search Services, records, people..."
            className="main-header-search-input"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="main-header-right">
        <div className="main-header-actions">
          <i className="pi pi-question-circle main-header-action-icon" />

          <div className="main-header-notification">
            <i className="pi pi-bell main-header-action-icon" />

            <span className="main-header-badge">1</span>
          </div>

          <i className="pi pi-th-large main-header-action-icon" />
        </div>

        {/* User */}
        <div className="main-header-user">
          <Avatar
            label="AL"
            shape="circle"
            className="main-header-user-avatar"
          />

          <span className="main-header-user-name">Alex Lin</span>

          <i className="pi pi-chevron-down main-header-user-arrow" />
        </div>
      </div>
    </div>
  );
}
