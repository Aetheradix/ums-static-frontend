import React, { useEffect, useState } from 'react';
import { Sidebar } from 'primereact/sidebar';

interface ThemeSettingsSidebarProps {
  visible: boolean;
  onHide: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const PREDEFINED_COLORS = [
  { name: 'Default Blue', value: '#002069' },
  { name: 'Dark Muted Blue', value: '#1b2b3d' },
  { name: 'Dark Teal', value: '#1a4a4a' },
  { name: 'Dark Gold', value: '#82660b' },
  { name: 'Dark Gray', value: '#383838' },
  { name: 'Dark Green', value: '#263b28' },
  { name: 'Deeper Slate', value: '#151e26' },
  { name: 'Deep Purple', value: '#412234' },
  { name: 'Orange', value: '#ea580c' },
];

export const ThemeSettingsSidebar: React.FC<ThemeSettingsSidebarProps> = ({
  visible,
  onHide,
  isDarkMode,
  toggleDarkMode,
}) => {
  const [activeColor, setActiveColor] = useState('#002069');

  const [showTopNavbar, setShowTopNavbar] = useState(false);

  useEffect(() => {
    const savedColor = localStorage.getItem('themeColor');
    if (savedColor) {
      setActiveColor(savedColor);
    }
    const savedNavbarSetting = localStorage.getItem('showTopNavbar');
    if (savedNavbarSetting === 'true') {
      setShowTopNavbar(true);
    }
  }, [visible]);

  const changeThemeColor = (color: string) => {
    setActiveColor(color);
    document.documentElement.style.setProperty('--color-primary', color);
    localStorage.setItem('themeColor', color);
  };

  const toggleTopNavbar = () => {
    setShowTopNavbar(prev => {
      const newState = !prev;
      localStorage.setItem('showTopNavbar', String(newState));
      window.dispatchEvent(
        new CustomEvent('toggle-top-navbar', { detail: newState })
      );
      return newState;
    });
  };

  return (
    <Sidebar
      visible={visible}
      position="right"
      onHide={onHide}
      className="w-full md:w-80"
      header={
        <h2 className="text-xl font-bold text-slate-800 dark:text-white m-0">
          Customization
        </h2>
      }
      pt={{
        header: {
          className:
            'px-6 py-4 border-b border-slate-200 dark:border-slate-700',
        },
        content: { className: 'p-6' },
      }}
    >
      <div className="flex flex-col">
        {/* Dark Mode Toggle */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Appearance
          </h3>
          <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 mb-3">
            <div className="flex items-center gap-3">
              <i
                className={`pi ${isDarkMode ? 'pi-moon' : 'pi-sun'} text-xl`}
                style={{ color: 'var(--color-primary)' }}
              />
              <div>
                <p className="font-medium text-slate-800 dark:text-zinc-200">
                  {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                </p>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Toggle application theme
                </p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 ${
                isDarkMode ? 'bg-primary' : 'bg-slate-300'
              }`}
              style={
                isDarkMode ? { backgroundColor: 'var(--color-primary)' } : {}
              }
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-3">
              <i
                className="pi pi-bars text-xl"
                style={{ color: 'var(--color-primary)' }}
              />
              <div>
                <p className="font-medium text-slate-800 dark:text-zinc-200">
                  Top Navbar
                </p>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Show secondary navigation
                </p>
              </div>
            </div>
            <button
              onClick={toggleTopNavbar}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 ${
                showTopNavbar ? 'bg-primary' : 'bg-slate-300'
              }`}
              style={
                showTopNavbar ? { backgroundColor: 'var(--color-primary)' } : {}
              }
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showTopNavbar ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Theme Color */}
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Theme Color
          </h3>
          <div className="grid grid-cols-5 gap-4">
            {PREDEFINED_COLORS.map(color => (
              <button
                key={color.value}
                onClick={() => changeThemeColor(color.value)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm ${
                  activeColor === color.value
                    ? 'ring-2 ring-offset-2 dark:ring-offset-slate-900'
                    : ''
                }`}
                style={{
                  backgroundColor: color.value,
                  ...(activeColor === color.value
                    ? ({ '--tw-ring-color': color.value } as any)
                    : {}),
                }}
                title={color.name}
              >
                {activeColor === color.value && (
                  <i className="pi pi-check text-white text-sm" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Sidebar>
  );
};
