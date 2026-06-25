import { useMenu } from 'config/menu-routes';
import React, { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import WorkspaceLayout from 'shared/components/workspace-layout/WorkspaceLayout';
import { Sidebar } from 'shared/new-components';
import './MainLayout.css';

export default function MainLayout({ children }: React.PropsWithChildren) {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const menuConfig = useMenu();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract active parent module and children dynamically based on current route
  const activeModuleInfo = useMemo(() => {
    function findParentAndChildren(
      items: any[],
      currentPath: string
    ): { parent: any; children: any[] } | null {
      for (const item of items) {
        if (item.children && item.children.length > 0) {
          const hasMatchingChild = item.children.some(
            (child: any) =>
              child.path &&
              (currentPath.startsWith(child.path) ||
                child.path.startsWith(currentPath))
          );
          if (hasMatchingChild) {
            return { parent: item, children: item.children };
          }
          const found = findParentAndChildren(item.children, currentPath);
          if (found) return found;
        }
      }
      return null;
    }
    return findParentAndChildren(menuConfig, location.pathname);
  }, [location.pathname]);

  const masterTabs = useMemo(() => {
    if (activeModuleInfo) return activeModuleInfo.children;
    const masterData = menuConfig.find(item => item.slug === 'master-data');
    return masterData?.children || [];
  }, [activeModuleInfo]);

  const isSidebarMode = true; // Forced sidebar mode for all pages

  // Sync active index based on current path
  const activeIndex = useMemo(() => {
    const path = location.pathname;
    return masterTabs.findIndex(
      tab =>
        tab.path && (path.startsWith(tab.path) || tab.path.startsWith(path))
    );
  }, [location.pathname, masterTabs]);

  const handleTabChange = (e: { index: number }) => {
    const targetTab = masterTabs[e.index];
    if (targetTab?.path) {
      navigate(targetTab.path);
    }
  };

  const handleSidebarItemClick = (index: number) => {
    handleTabChange({ index });
  };

  const sidebarIcon = 'th-large';

  useEffect(() => {
    const handleToggle = () => {
      setIsMobileDrawerOpen(prev => !prev);
    };
    window.addEventListener('toggle-mobile-sidebar', handleToggle);
    return () => {
      window.removeEventListener('toggle-mobile-sidebar', handleToggle);
    };
  }, []);

  useEffect(() => {
    const handleRequest = () => {
      window.dispatchEvent(
        new CustomEvent('sidebar-mode-changed', { detail: isSidebarMode })
      );
    };
    window.addEventListener('request-sidebar-status', handleRequest);
    window.dispatchEvent(
      new CustomEvent('sidebar-mode-changed', { detail: isSidebarMode })
    );

    return () => {
      window.removeEventListener('request-sidebar-status', handleRequest);
      window.dispatchEvent(
        new CustomEvent('sidebar-mode-changed', { detail: false })
      );
    };
  }, [isSidebarMode]);

  return (
    <WorkspaceLayout>
      {/* Main Page Content */}
      <div className="main-layout-content">
        <div className="mx-auto px-6 py-6 pb-16 flex flex-col lg:flex-row gap-8 relative">
          {/* Mobile Drawer Backdrop Overlay */}
          {isMobileDrawerOpen && (
            <div
              className="mobile-drawer-overlay"
              onClick={() => setIsMobileDrawerOpen(false)}
            />
          )}

          {/* Sidebar Navigation Wrapper */}
          <div
            className={`app-sidebar-wrapper ${isMobileDrawerOpen ? 'mobile-open' : ''}`}
          >
            <Sidebar
              headerTitle={activeModuleInfo?.parent?.label || 'Navigation'}
              headerSubtitle={activeModuleInfo?.parent?.description || ''}
              headerIcon={sidebarIcon}
              items={masterTabs}
              activeIndex={activeIndex}
              onItemClick={idx => {
                handleSidebarItemClick(idx);
                setIsMobileDrawerOpen(false); // Close drawer after navigation
              }}
            />
          </div>

          {/* Mobile Close Button - Fixed to viewport, half inside and half outside the 300px sidebar */}
          {isMobileDrawerOpen && (
            <button
              type="button"
              className="app-sidebar-mobile-close-btn"
              style={{
                position: 'fixed',
                left: '284px',
                top: '35px',
                zIndex: 1050,
              }}
              onClick={() => setIsMobileDrawerOpen(false)}
              aria-label="Close Sidebar"
            >
              <i className="pi pi-times" />
            </button>
          )}

          {/* Sub-route Content */}
          <main className="sis-main-content-area">{children}</main>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
