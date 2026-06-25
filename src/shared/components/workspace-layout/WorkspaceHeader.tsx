import { useAuth } from 'auth';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WaffleMenu } from 'shared/new-components';
import './WorkspaceHeader.css';
import { ThemeSettingsSidebar } from './ThemeSettingsSidebar';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');

    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.body.classList.add('dark');
    }

    // Apply saved theme color
    const savedColor = localStorage.getItem('themeColor');
    if (savedColor) {
      document.documentElement.style.setProperty('--color-primary', savedColor);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;

      if (newMode) {
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }

      return newMode;
    });
  };

  const username = user?.profile?.name || user?.profile?.sub || 'User';
  const email = user?.profile?.email || 'No email provided';

  const initials =
    username
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'U';

  return (
    <header className="ws-header">
      <div className="ws-header-inner">
        {/* Logo */}
        <div className="ws-logo-section">
          <button
            type="button"
            className="ws-hamburger-btn"
            onClick={() =>
              window.dispatchEvent(new CustomEvent('toggle-mobile-sidebar'))
            }
            title="Toggle Navigation"
          >
            <i className="pi pi-bars" />
          </button>
          <img
            src="/Octagon_Logo.png"
            alt="Octagon Logo"
            className="w-40 max-md:w-32 p-1 object-contain rounded-lg ws-logo-image cursor-pointer"
            onClick={() => navigate('/home')}
          />
        </div>

        {/* Search */}
        <div className="ws-search-section mobile-hidden">
          <div className="ws-search-container">
            <i className="pi pi-search ws-search-icon" />

            <input
              type="text"
              className="ws-search-input"
              placeholder="Search Services, records, people..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="ws-header-actions">
          <div className="ws-action-icons">
            {/* Settings Toggle */}
            <div
              className="ws-icon-btn"
              onClick={() => setIsSettingsOpen(true)}
              title="Customization Settings"
            >
              <i className="pi pi-cog" />
            </div>

            {/* Dark Mode Toggle */}
            <div
              className="ws-icon-btn"
              onClick={toggleDarkMode}
              title="Toggle Dark Mode"
            >
              <i className={`pi ${isDarkMode ? 'pi-sun' : 'pi-moon'}`} />
            </div>

            {/* Help */}
            <div className="ws-icon-btn mobile-hidden">
              <i className="pi pi-question-circle" />
            </div>

            {/* Notification */}
            <div className="ws-notif-btn mobile-hidden">
              <i className="pi pi-bell" />

              <span className="ws-badge">1</span>
            </div>

            <WaffleMenu isDarkMode={isDarkMode} />
          </div>

          {/* User Profile */}
          <div className="relative" ref={dropdownRef}>
            <div
              className="ws-user-profile"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="ws-avatar">{initials}</div>

              <span className="ws-username">{username}</span>

              <i
                className={`pi pi-chevron-${dropdownOpen ? 'up' : 'down'} text-[10px] text-slate-500`}
              />
            </div>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="ws-profile-dropdown">
                <div className="ws-dropdown-header">
                  <p className="text-xs text-slate-400 dark:text-zinc-500 font-bold">
                    Signed in as
                  </p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200 truncate">
                    {username}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                    {email}
                  </p>
                </div>

                <button
                  type="button"
                  className="ws-dropdown-item"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/settings/my-profile');
                  }}
                >
                  <i className="pi pi-user text-sm" />
                  <span>My Profile</span>
                </button>

                <button onClick={logout} className="ws-dropdown-item-danger">
                  <i className="pi pi-sign-out text-sm" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ThemeSettingsSidebar
        visible={isSettingsOpen}
        onHide={() => setIsSettingsOpen(false)}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
    </header>
  );
};

export default Header;
