import { Sidebar } from 'primereact/sidebar';
import React, { useEffect, useState } from 'react';
import { useLanguage } from 'shared/context/useLanguage';

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
  { name: 'Orange', value: '#892f00' },
];

export const ThemeSettingsSidebar: React.FC<ThemeSettingsSidebarProps> = ({
  visible,
  onHide,
  isDarkMode,
  toggleDarkMode,
}) => {
  const { language, toggleLanguage } = useLanguage();
  const [activeColor, setActiveColor] = useState('#002069');
  const [showTopNavbar, setShowTopNavbar] = useState(false);
  const [layoutWidth, setLayoutWidth] = useState('fluid');
  const [headerBehavior, setHeaderBehavior] = useState('sticky');
  const [sidebarMode, setSidebarMode] = useState('expanded');

  useEffect(() => {
    const savedColor = localStorage.getItem('themeColor');
    if (savedColor) setActiveColor(savedColor);

    const savedNavbarSetting = localStorage.getItem('showTopNavbar');
    if (savedNavbarSetting === 'true') setShowTopNavbar(true);

    const savedLayoutWidth = localStorage.getItem('layoutWidth');
    if (savedLayoutWidth) setLayoutWidth(savedLayoutWidth);

    const savedHeaderBehavior = localStorage.getItem('headerBehavior');
    if (savedHeaderBehavior) setHeaderBehavior(savedHeaderBehavior);

    const savedSidebarMode = localStorage.getItem('sidebarMode');
    if (savedSidebarMode) setSidebarMode(savedSidebarMode);
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

  const changeLayoutWidth = (val: string) => {
    setLayoutWidth(val);
    localStorage.setItem('layoutWidth', val);
    window.dispatchEvent(
      new CustomEvent('layout-width-changed', { detail: val })
    );
  };

  const changeHeaderBehavior = (val: string) => {
    setHeaderBehavior(val);
    localStorage.setItem('headerBehavior', val);
    window.dispatchEvent(
      new CustomEvent('header-behavior-changed', { detail: val })
    );
  };

  const changeSidebarMode = (val: string) => {
    setSidebarMode(val);
    localStorage.setItem('sidebarMode', val);
    window.dispatchEvent(
      new CustomEvent('global-sidebar-mode-changed', { detail: val })
    );
  };

  const restoreDefaults = () => {
    if (isDarkMode) {
      toggleDarkMode();
    }

    changeThemeColor('#002069');

    if (showTopNavbar) toggleTopNavbar();

    changeLayoutWidth('fluid');
    changeHeaderBehavior('sticky');
    changeSidebarMode('expanded');
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
        content: { className: 'p-0' },
      }}
    >
      <div className="flex flex-col min-h-full relative">
        <div className="p-6 flex-1">
          {/* Dark Mode Toggle */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Appearance
            </h3>

            {/* Language Switch Toggle */}
            <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 mb-3">
              <div className="flex items-center gap-3">
                <i
                  className="pi pi-language text-xl"
                  style={{ color: 'var(--color-primary)' }}
                />
                <div>
                  <p className="font-medium text-slate-800 dark:text-zinc-200">
                    {language === 'hi' ? 'हिन्दी (Hindi)' : 'English (US)'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Switch application language
                  </p>
                </div>
              </div>
              <button
                onClick={toggleLanguage}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 ${
                  language === 'hi' ? 'bg-primary' : 'bg-slate-300'
                }`}
                style={
                  language === 'hi'
                    ? { backgroundColor: 'var(--color-primary)' }
                    : {}
                }
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    language === 'hi' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

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
                  showTopNavbar
                    ? { backgroundColor: 'var(--color-primary)' }
                    : {}
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

          {/* Layout Styles */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Layout Options
            </h3>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-2">
                Layout Width
              </label>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${layoutWidth === 'fluid' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'}`}
                  onClick={() => changeLayoutWidth('fluid')}
                >
                  Fluid
                </button>
                <button
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${layoutWidth === 'boxed' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'}`}
                  onClick={() => changeLayoutWidth('boxed')}
                >
                  Boxed
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-2">
                Header Behavior
              </label>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${headerBehavior === 'sticky' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'}`}
                  onClick={() => changeHeaderBehavior('sticky')}
                >
                  Sticky
                </button>
                <button
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${headerBehavior === 'static' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'}`}
                  onClick={() => changeHeaderBehavior('static')}
                >
                  Static
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-2">
                Sidebar Mode
              </label>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button
                  className={`flex-1 py-1.5 text-[11px] font-medium rounded-md transition-colors ${sidebarMode === 'expanded' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'}`}
                  onClick={() => changeSidebarMode('expanded')}
                >
                  Expanded
                </button>
                <button
                  className={`flex-1 py-1.5 text-[11px] font-medium rounded-md transition-colors ${sidebarMode === 'collapsed' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'}`}
                  onClick={() => changeSidebarMode('collapsed')}
                >
                  Collapsed
                </button>
                <button
                  className={`flex-1 py-1.5 text-[11px] font-medium rounded-md transition-colors ${sidebarMode === 'hidden' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'}`}
                  onClick={() => changeSidebarMode('hidden')}
                >
                  Hidden
                </button>
              </div>
            </div>
          </div>

          {/* Theme Color */}
          <div className="mb-6">
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

        {/* Restore Defaults */}
        <div className="border-t border-slate-200 dark:border-slate-700 p-6 bg-white dark:bg-slate-800 sticky bottom-0 z-10 mt-auto">
          <button
            onClick={restoreDefaults}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            <i className="pi pi-refresh" />
            Restore Defaults
          </button>
        </div>
      </div>
    </Sidebar>
  );
};
