import { Avatar } from 'primereact/avatar';
import { InputText } from 'primereact/inputtext';
import { useLanguage } from 'shared/context/useLanguage';
import './MainHeader.css';

export default function MainHeader() {
  const { language, toggleLanguage } = useLanguage();
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
          <div
            className="flex items-center gap-1 cursor-pointer transition-colors duration-200 hover:text-(--primary-color)"
            onClick={toggleLanguage}
            title={language === 'en' ? 'हिन्दी में बदलें' : 'Switch to English'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
            }}
          >
            <i
              className="pi pi-globe main-header-action-icon"
              style={{ fontSize: '1.4rem' }}
            />
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
              {language === 'en' ? 'EN' : 'हिं'}
            </span>
          </div>

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

          <span className="main-header-user-name">Aryan Patel</span>

          <i className="pi pi-chevron-down main-header-user-arrow" />
        </div>
      </div>
    </div>
  );
}
