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
  const location = useLocation();

  useEffect(() => {
    // Initial read
    const savedNavbarSetting = localStorage.getItem('showTopNavbar');
    if (savedNavbarSetting === 'true') {
      setShowTopNavbar(true);
    }

    const handleToggle = () => {
      setIsMobileDrawerOpen(prev => !prev);
    };

    const handleSidebarChange = (e: Event) => {
      setHasActiveSidebar((e as CustomEvent).detail);
    };

    const handleTopNavbarChange = (e: Event) => {
      setShowTopNavbar((e as CustomEvent).detail);
    };

    window.addEventListener('toggle-mobile-sidebar', handleToggle);
    window.addEventListener('sidebar-mode-changed', handleSidebarChange);
    window.addEventListener('toggle-top-navbar', handleTopNavbarChange);

    return () => {
      window.removeEventListener('toggle-mobile-sidebar', handleToggle);
      window.removeEventListener('sidebar-mode-changed', handleSidebarChange);
      window.removeEventListener('toggle-top-navbar', handleTopNavbarChange);
    };
  }, []);

  // Close mobile drawer when path changes
  useEffect(() => {
    setIsMobileDrawerOpen(false);
  }, [location.pathname]);

  return (
    <div className="ws-root">
      <WorkspaceTopBar />
      <div className="sticky top-0 z-50 flex flex-col w-full shadow-sm">
        <WorkspaceHeader />
        {showTopNavbar && <WorkspaceNavbar />}
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
              headerIcon="th-large"
              items={[]}
              activeIndex={-1}
              onItemClick={() => {}}
            />
          </div>
        </>
      )}

      <main className="ws-main">{children}</main>
      {/* <WorkspaceFooterNav /> */}
      <WorkspaceFooterBar />
    </div>
  );
};

export default WorkspaceLayout;
