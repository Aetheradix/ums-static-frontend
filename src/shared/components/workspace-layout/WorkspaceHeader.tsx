import { useAuth } from 'auth';
import { useMenu } from 'config/menu-routes';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'shared/components/Icon/Icon';
import { WaffleMenu } from 'shared/new-components';
import { ThemeSettingsSidebar } from './ThemeSettingsSidebar';
import './WorkspaceHeader.css';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const menuConfig = useMenu();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Helper to find the first navigable route for parent menus
  const getFirstAvailablePath = (item: any): string | null => {
    if (item.path) return item.path;
    if (item.children && item.children.length > 0) {
      for (const child of item.children) {
        const path = getFirstAvailablePath(child);
        if (path) return path;
      }
    }
    return null;
  };

  // Flatten menu for search
  const flatMenu = useMemo(() => {
    const result: any[] = [];
    const flatten = (items: any[], parentLabels: string[]) => {
      for (const item of items) {
        const targetPath = getFirstAvailablePath(item);
        if (targetPath) {
          result.push({
            ...item,
            resolvedPath: targetPath,
            parentLabels,
          });
        }
        if (item.children) {
          flatten(item.children, [...parentLabels, item.label]);
        }
      }
    };
    flatten(menuConfig, []);
    return result;
  }, [menuConfig]);

  // Handle search filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = flatMenu
      .filter(item => {
        const matchLabel = item.label?.toLowerCase().includes(query);
        const matchDesc = item.description?.toLowerCase().includes(query);
        const matchParent = item.parentLabels.some((p: string) =>
          p.toLowerCase().includes(query)
        );
        return matchLabel || matchDesc || matchParent;
      })
      .slice(0, 8); // Max 8 results

    setSearchResults(results);
    setIsSearchOpen(true); // Always open when there's a query to show results or empty state
    setSelectedIndex(0);
  }, [searchQuery, flatMenu]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (!isSearchOpen || searchResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % searchResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(
        prev => (prev - 1 + searchResults.length) % searchResults.length
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = searchResults[selectedIndex];
      if (selected?.resolvedPath) {
        navigate(selected.resolvedPath);
        setSearchQuery('');
        setIsSearchOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

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

  // Helper to highlight matching text
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span
              key={index}
              className="bg-amber-100 text-amber-900 dark:bg-amber-500/30 dark:text-amber-100 font-bold rounded-sm px-[2px]"
            >
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </>
    );
  };

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

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement | Document;
      let scrollTop = 0;

      if (target === document) {
        scrollTop = window.scrollY || document.documentElement.scrollTop;
      } else {
        scrollTop = (target as HTMLElement).scrollTop || 0;
      }

      if (scrollTop > 20 && !isScrolled) {
        setIsScrolled(true);
      } else if (scrollTop <= 20 && isScrolled) {
        setIsScrolled(false);
      }
    };

    // Use capture: true to catch scroll events from any scrollable child container (like #root)
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [isScrolled]);

  return (
    <header className={`ws-header ${isScrolled ? 'scrolled' : ''}`}>
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
          <div className="ws-search-container" ref={searchContainerRef}>
            <i className="pi pi-search ws-search-icon" />

            <input
              type="text"
              className="ws-search-input"
              placeholder="Search Services, records, people..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim().length > 0) setIsSearchOpen(true);
              }}
              onKeyDown={handleSearchKeyDown}
            />

            {isSearchOpen && (
              <div className="ws-search-dropdown">
                {searchResults.length > 0 ? (
                  searchResults.map((item, idx) => (
                    <div
                      key={item.resolvedPath + idx}
                      className={`ws-search-result-item ${idx === selectedIndex ? 'selected' : ''}`}
                      onMouseDown={e => {
                        e.preventDefault(); // Prevents input blur from overriding click
                        navigate(item.resolvedPath);
                        setSearchQuery('');
                        setIsSearchOpen(false);
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                    >
                      <div className="ws-search-item-icon">
                        <Icon
                          name={(item.icon as string) || 'description'}
                          className="text-[22px] opacity-80"
                        />
                      </div>
                      <div className="ws-search-item-content">
                        <div className="ws-search-item-title">
                          {highlightText(item.label, searchQuery)}
                        </div>
                        {item.parentLabels.length > 0 && (
                          <div className="ws-search-item-path">
                            {highlightText(
                              item.parentLabels.join(' • '),
                              searchQuery
                            )}
                          </div>
                        )}
                      </div>
                      <i className="pi pi-angle-right ml-auto text-slate-300 dark:text-zinc-600 text-sm" />
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center flex flex-col items-center justify-center">
                    <i className="pi pi-search text-3xl text-slate-300 dark:text-zinc-600 mb-3" />
                    <p className="text-sm text-slate-500 font-medium">
                      No services found for "{searchQuery}"
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try checking for typos or using different keywords
                    </p>
                  </div>
                )}
              </div>
            )}
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
              className="ws-icon-btn mobile-hidden"
              onClick={toggleDarkMode}
              title="Toggle Dark Mode"
            >
              <i className={`pi ${isDarkMode ? 'pi-sun' : 'pi-moon'}`} />
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
