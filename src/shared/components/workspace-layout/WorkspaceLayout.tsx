import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import WorkspaceFooterBar from './WorkspaceFooterBar';
// import WorkspaceFooterNav from './WorkspaceFooterNav';
import WorkspaceHeader from './WorkspaceHeader';
import './WorkspaceLayout.css';
import WorkspaceTopBar from './WorkspaceTopBar';
import WorkspaceNavbar from './WorkspaceNavbar';
import { Sidebar } from 'shared/new-components';

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
