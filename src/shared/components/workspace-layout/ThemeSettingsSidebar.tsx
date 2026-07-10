import { Sidebar } from 'primereact/sidebar';
import React, { useEffect, useState } from 'react';
import { useLanguage } from 'shared/context/useLanguage';
import DropDownList from 'shared/components/forms/DropDownList';

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
  { name: 'Orange', value: '#772500' },
];

export const ThemeSettingsSidebar: React.FC<ThemeSettingsSidebarProps> = ({
  visible,
  onHide,
  isDarkMode,
  toggleDarkMode,
}) => {
  const { language, setLanguage } = useLanguage();
  const [activeColor, setActiveColor] = useState('#002069');
  const [showTopNavbar, setShowTopNavbar] = useState(false);
  const [showDesktopSidebar, setShowDesktopSidebar] = useState(false);
  const [sidebarLayoutType, setSidebarLayoutType] = useState('detached');
  const [sidebarBgType, setSidebarBgType] = useState('default');
  const [layoutWidth, setLayoutWidth] = useState('fluid');
  const [headerBehavior, setHeaderBehavior] = useState('sticky');
  const [sidebarMode, setSidebarMode] = useState('expanded');

  useEffect(() => {
    const savedColor = localStorage.getItem('themeColor');
    if (savedColor) setActiveColor(savedColor);

    const savedNavbarSetting = localStorage.getItem('showTopNavbar');
    if (savedNavbarSetting === 'true') setShowTopNavbar(true);

    const savedDesktopSidebarSetting =
      localStorage.getItem('showDesktopSidebar');
    if (savedDesktopSidebarSetting === 'true') setShowDesktopSidebar(true);

    const savedSidebarLayoutType =
      localStorage.getItem('sidebarLayoutType') || 'detached';
    setSidebarLayoutType(savedSidebarLayoutType);

    const savedSidebarBgType =
      localStorage.getItem('sidebarBgType') || 'default';
    setSidebarBgType(savedSidebarBgType);

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

      if (newState) {
        setShowDesktopSidebar(false);
        localStorage.setItem('showDesktopSidebar', 'false');
        window.dispatchEvent(
          new CustomEvent('toggle-desktop-sidebar', { detail: false })
        );
      }

      return newState;
    });
  };

  const toggleDesktopSidebar = () => {
    setShowDesktopSidebar(prev => {
      const newState = !prev;
      localStorage.setItem('showDesktopSidebar', String(newState));
      window.dispatchEvent(
        new CustomEvent('toggle-desktop-sidebar', { detail: newState })
      );

      if (newState) {
        setShowTopNavbar(false);
        localStorage.setItem('showTopNavbar', 'false');
        window.dispatchEvent(
          new CustomEvent('toggle-top-navbar', { detail: false })
        );
      }

      return newState;
    });
  };

  const changeSidebarLayoutType = (val: string) => {
    setSidebarLayoutType(val);
    localStorage.setItem('sidebarLayoutType', val);
    window.dispatchEvent(
      new CustomEvent('change-sidebar-layout-type', { detail: val })
    );
  };

  const changeSidebarBgType = (val: string) => {
    setSidebarBgType(val);
    localStorage.setItem('sidebarBgType', val);
    window.dispatchEvent(
      new CustomEvent('change-sidebar-bg-type', { detail: val })
    );
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
    if (showDesktopSidebar) toggleDesktopSidebar();
    changeSidebarLayoutType('detached');
    changeSidebarBgType('default');

    changeLayoutWidth('fluid');
    changeHeaderBehavior('sticky');
    changeSidebarMode('expanded');
  };

  return (
    <Sidebar
      visible={visible}
      position="right"
      onHide={onHide}
      className="w-full md:w-80 theme-settings-sidebar"
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

            {/* Language Switch Dropdown */}
            <div className="flex flex-col gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 mb-3">
              <div className="flex items-center gap-3">
                <i className="pi pi-language text-xl text-slate-500 dark:text-zinc-400" />
                <div>
                  <p className="font-medium text-slate-800 dark:text-zinc-200">
                    Language
                  </p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Select application language
                  </p>
                </div>
              </div>
              <div className="w-full">
                <DropDownList
                  data={[
                    { text: 'English (US)', value: 'en' },
                    { text: 'हिन्दी (Hindi)', value: 'hi' },
                  ]}
                  value={language}
                  onChange={val => {
                    if (val) setLanguage(val as 'en' | 'hi');
                  }}
                  filter={false}
                  textField="text"
                  valueField="value"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 mb-3">
              <div className="flex items-center gap-3">
                <i
                  className={`pi ${isDarkMode ? 'pi-moon' : 'pi-sun'} text-xl text-slate-500 dark:text-zinc-400`}
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
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 p-0 shrink-0 ${
                  isDarkMode ? 'bg-primary' : 'bg-slate-300 dark:bg-zinc-700'
                }`}
                style={
                  isDarkMode ? { backgroundColor: 'var(--color-primary)' } : {}
                }
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 mb-3">
              <div className="flex items-center gap-3">
                <i className="pi pi-bars text-xl text-slate-500 dark:text-zinc-400" />
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
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 p-0 shrink-0 ${
                  showTopNavbar ? 'bg-primary' : 'bg-slate-300 dark:bg-zinc-700'
                }`}
                style={
                  showTopNavbar
                    ? { backgroundColor: 'var(--color-primary)' }
                    : {}
                }
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showTopNavbar ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex flex-col gap-2 p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <i className="pi pi-objects-column text-xl text-slate-500 dark:text-zinc-400" />
                  <div>
                    <p className="font-medium text-slate-800 dark:text-zinc-200">
                      Desktop Sidebar
                    </p>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Show navigation sidebar on desktop
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleDesktopSidebar}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 p-0 shrink-0 ${
                    showDesktopSidebar
                      ? 'bg-primary'
                      : 'bg-slate-300 dark:bg-zinc-700'
                  }`}
                  style={
                    showDesktopSidebar
                      ? { backgroundColor: 'var(--color-primary)' }
                      : {}
                  }
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      showDesktopSidebar ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {showDesktopSidebar && (
                <div className="flex flex-col gap-3 pt-3 border-t border-slate-200 dark:border-slate-700/50 mt-1">
                  <div className="flex flex-col gap-1.5">
                    <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400">
                      Sidebar Style
                    </label>
                    <div className="flex bg-slate-200/60 dark:bg-slate-900 p-1 rounded-lg">
                      <button
                        type="button"
                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                          sidebarLayoutType === 'detached'
                            ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white'
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                        }`}
                        onClick={() => changeSidebarLayoutType('detached')}
                      >
                        Detached
                      </button>
                      <button
                        type="button"
                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                          sidebarLayoutType === 'flat'
                            ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white'
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                        }`}
                        onClick={() => changeSidebarLayoutType('flat')}
                      >
                        Flat
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                    <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400">
                      Sidebar Fill Theme
                    </label>
                    <div className="flex bg-slate-200/60 dark:bg-slate-900 p-1 rounded-lg">
                      <button
                        type="button"
                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                          sidebarBgType === 'default'
                            ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white'
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                        }`}
                        onClick={() => changeSidebarBgType('default')}
                      >
                        Default
                      </button>
                      <button
                        type="button"
                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                          sidebarBgType === 'primary'
                            ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white'
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                        }`}
                        onClick={() => changeSidebarBgType('primary')}
                      >
                        Primary Color
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
