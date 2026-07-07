import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import WorkspaceFooterBar from './WorkspaceFooterBar';
// import WorkspaceFooterNav from './WorkspaceFooterNav';
import WorkspaceHeader from './WorkspaceHeader';
import './WorkspaceLayout.css';
import WorkspaceTopBar from './WorkspaceTopBar';
import WorkspaceNavbar from './WorkspaceNavbar';
import { Sidebar } from 'shared/new-components';

const BottomWaves: React.FC = () => (
  <div className="ws-bottom-waves" aria-hidden="true">
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Solid Waves (Anchored at the bottom) */}
      <path
        d="M0,750 C288,820 576,680 864,780 C1152,880 1344,750 1440,720 L1440,900 L0,900 Z"
        className="ws-bottom-wave-1"
      />
      <path
        d="M0,780 C384,880 672,720 960,820 C1248,920 1392,780 1440,750 L1440,900 L0,900 Z"
        className="ws-bottom-wave-2"
      />
      {/* Outline Waves (Same wave pattern, kept close to the bottom solid waves) */}
      <path
        d="M0,720 C288,770 576,600 864,680 C1152,760 1344,620 1440,590"
        fill="none"
        className="ws-bottom-wave-outline-1"
        strokeWidth="1.5"
      />
      <path
        d="M0,670 C288,720 576,550 864,630 C1152,710 1344,570 1440,540"
        fill="none"
        className="ws-bottom-wave-outline-2"
        strokeWidth="1.2"
      />
      <path
        d="M0,620 C288,670 576,500 864,580 C1152,660 1344,520 1440,490"
        fill="none"
        className="ws-bottom-wave-outline-3"
        strokeWidth="0.8"
      />
    </svg>
  </div>
);

export const WorkspaceLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [hasActiveSidebar, setHasActiveSidebar] = useState(false);
  const [showTopNavbar, setShowTopNavbar] = useState(false);
  const [showDesktopSidebar, setShowDesktopSidebar] = useState(false);
  const [sidebarLayoutType, setSidebarLayoutType] = useState(
    () => localStorage.getItem('sidebarLayoutType') || 'detached'
  );
  const [sidebarBgType, setSidebarBgType] = useState(
    () => localStorage.getItem('sidebarBgType') || 'default'
  );
  const [layoutWidth, setLayoutWidth] = useState('fluid');
  const [headerBehavior, setHeaderBehavior] = useState('sticky');
  const location = useLocation();

  useEffect(() => {
    // Initial read
    const savedNavbarSetting = localStorage.getItem('showTopNavbar');
    if (savedNavbarSetting === 'true') {
      setShowTopNavbar(true);
    }
    const savedDesktopSidebarSetting =
      localStorage.getItem('showDesktopSidebar');
    if (savedDesktopSidebarSetting === 'true') {
      setShowDesktopSidebar(true);
    }
    const savedSidebarLayoutType = localStorage.getItem('sidebarLayoutType');
    if (savedSidebarLayoutType) {
      setSidebarLayoutType(savedSidebarLayoutType);
    }
    const savedSidebarBgType = localStorage.getItem('sidebarBgType');
    if (savedSidebarBgType) {
      setSidebarBgType(savedSidebarBgType);
    }
    const savedLayoutWidth = localStorage.getItem('layoutWidth');
    if (savedLayoutWidth) setLayoutWidth(savedLayoutWidth);

    const savedHeaderBehavior = localStorage.getItem('headerBehavior');
    if (savedHeaderBehavior) setHeaderBehavior(savedHeaderBehavior);

    const handleToggle = () => {
      setIsMobileDrawerOpen(prev => !prev);
    };

    const handleSidebarChange = (e: Event) => {
      setHasActiveSidebar((e as CustomEvent).detail);
    };

    const handleTopNavbarChange = (e: Event) => {
      setShowTopNavbar((e as CustomEvent).detail);
    };

    const handleDesktopSidebarChange = (e: Event) => {
      setShowDesktopSidebar((e as CustomEvent).detail);
    };

    const handleLayoutTypeChange = (e: Event) => {
      setSidebarLayoutType((e as CustomEvent).detail);
    };

    const handleBgTypeChange = (e: Event) => {
      setSidebarBgType((e as CustomEvent).detail);
    };

    const handleLayoutWidthChange = (e: Event) => {
      setLayoutWidth((e as CustomEvent).detail);
    };

    const handleHeaderBehaviorChange = (e: Event) => {
      setHeaderBehavior((e as CustomEvent).detail);
    };

    window.addEventListener('toggle-mobile-sidebar', handleToggle);
    window.addEventListener('sidebar-mode-changed', handleSidebarChange);
    window.addEventListener('toggle-top-navbar', handleTopNavbarChange);
    window.addEventListener(
      'toggle-desktop-sidebar',
      handleDesktopSidebarChange
    );
    window.addEventListener(
      'change-sidebar-layout-type',
      handleLayoutTypeChange
    );
    window.addEventListener('change-sidebar-bg-type', handleBgTypeChange);
    window.addEventListener('layout-width-changed', handleLayoutWidthChange);
    window.addEventListener(
      'header-behavior-changed',
      handleHeaderBehaviorChange
    );

    return () => {
      window.removeEventListener('toggle-mobile-sidebar', handleToggle);
      window.removeEventListener('sidebar-mode-changed', handleSidebarChange);
      window.removeEventListener('toggle-top-navbar', handleTopNavbarChange);
      window.removeEventListener(
        'toggle-desktop-sidebar',
        handleDesktopSidebarChange
      );
      window.removeEventListener(
        'change-sidebar-layout-type',
        handleLayoutTypeChange
      );
      window.removeEventListener('change-sidebar-bg-type', handleBgTypeChange);
      window.removeEventListener(
        'layout-width-changed',
        handleLayoutWidthChange
      );
      window.removeEventListener(
        'header-behavior-changed',
        handleHeaderBehaviorChange
      );
    };
  }, []);

  // Close mobile drawer when path changes
  useEffect(() => {
    setIsMobileDrawerOpen(false);
  }, [location.pathname]);

  return (
    <div
      className={`ws-root layout-${layoutWidth} ${
        showDesktopSidebar ? 'has-desktop-sidebar' : ''
      } ${showDesktopSidebar ? `layout-${sidebarLayoutType}` : ''} ${
        showDesktopSidebar ? `sidebar-bg-${sidebarBgType}` : ''
      }`}
    >
      <BottomWaves />
      {showDesktopSidebar && (
        <div className="app-sidebar-wrapper desktop-sidebar">
          <Sidebar
            headerTitle="Services Portal"
            headerSubtitle="Access all administrative services"
            headerIcon="grid_view"
            items={[]}
            activeIndex={-1}
            onItemClick={() => {}}
          />
        </div>
      )}

      <div className="ws-page-container">
        {!showDesktopSidebar && <WorkspaceTopBar />}
        <div
          className={`${headerBehavior === 'sticky' ? 'sticky' : 'relative'} top-0 z-50 flex flex-col w-full shadow-sm`}
        >
          <WorkspaceHeader />
          {showTopNavbar && !showDesktopSidebar && <WorkspaceNavbar />}
        </div>
        {/* Render mobile-only sidebar drawer if active layout has no sidebar of its own */}
        {!hasActiveSidebar && (
          <>
            {isMobileDrawerOpen && (
              <div
                className="mobile-drawer-overlay"
                onClick={() => setIsMobileDrawerOpen(false)}
              />
            )}

            <div
              className={`app-sidebar-wrapper mobile-only-sidebar ${isMobileDrawerOpen ? 'mobile-open' : ''}`}
            >
              <Sidebar
                headerTitle="Services Portal"
                headerSubtitle="Access all administrative services"
                headerIcon="grid_view"
                items={[]}
                activeIndex={-1}
                onItemClick={() => {}}
              />
            </div>
          </>
        )}

        <main className="ws-main">{children}</main>
        <WorkspaceFooterBar />
      </div>
    </div>
  );
};

export default WorkspaceLayout;
