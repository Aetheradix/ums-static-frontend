import { useMenu } from 'config/menu-routes';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import WorkspaceLayout from 'shared/components/workspace-layout/WorkspaceLayout';
import { Sidebar } from 'shared/new-components';
import './MainLayout.css';

/**
 * Paths that render a portal/landing selector — they must be full-width
 * with NO sidebar. Add any new portal-selector routes here.
 */
const PORTAL_PATHS: string[] = [
  '/employee-management',
  '/employee-management/admin-portal',
  '/employee-management/dashboard',
  '/academics',
  '/recruitment-management',
  '/admissions-management',
  '/student-management',
  '/training-placement',
  '/training-placement/admin',
  '/training-placement/dept',
  '/training-placement/company',
  '/training-placement/student',

  '/infrastructure-project-management',
  '/infrastructure-project-management/reports',

  '/student-activities-clubs',
  '/sports-management',
  '/sports-management/student',
  '/endowment-management',
  '/endowment-management/admin',
  '/endowment-management/student',
  '/sports-management/admin',
  '/sports-management/master',
  '/essential-services',
  '/essential-services/admin',
  '/essential-services/employee',
  '/estate-management',
  '/estate-management/admin',
  '/transport-management',
  '/transport-management/admin-login',
  '/transport-management/college-login',
  '/transport-management/reports',

  '/affiliation-management-system',
  '/affiliation-management-system/public',
  '/affiliation-management-system/college-login',
  '/affiliation-management-system/admin-login',
  '/policy-compliance-management',

  '/legal-case-management',
  '/legal-case-management/admin',
  '/legal-case-management/data-entry',
  '/legal-case-management/viewer',

  '/communication-management',
  '/communication-management/admin',
  '/communication-management/viewer',

  '/event-ticketing-management',
  '/event-ticketing-management/admin',
  '/event-ticketing-management/organizer',
  '/event-ticketing-management/volunteer',
  '/event-ticketing-management/attendee',

  '/timetable-management',
  '/timetable-management/admin',
  '/timetable-management/scheduler',
  '/timetable-management/faculty',
  '/timetable-management/student',
  '/evaluation-grading',
];

function isPortalPath(pathname: string): boolean {
  return PORTAL_PATHS.some(p => pathname === p || pathname === p + '/');
}

export default function MainLayout({ children }: React.PropsWithChildren) {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const menuConfig = useMenu();
  const location = useLocation();
  const navigate = useNavigate();

  // True when this route is a portal selector — no sidebar needed
  const hidesSidebar = isPortalPath(location.pathname);

  // Extract active parent module and children dynamically based on current route
  const activeModuleInfo = useMemo(() => {
    if (hidesSidebar) return null;

    function findDeepestParent(
      items: any[],
      currentPath: string
    ): { parent: any; children: any[] } | null {
      for (const item of items) {
        if (item.children && item.children.length > 0) {
          // First recurse deeper — prefer the most specific match
          const deeperMatch = findDeepestParent(item.children, currentPath);
          if (deeperMatch) return deeperMatch;

          // Then check if THIS item's children directly match the current path
          const hasDirectMatch = item.children.some(
            (child: any) =>
              child.path &&
              (currentPath === child.path ||
                currentPath.startsWith(child.path + '/') ||
                child.path.startsWith(currentPath + '/'))
          );
          if (hasDirectMatch) {
            return { parent: item, children: item.children };
          }
        }
      }
      return null;
    }
    return findDeepestParent(menuConfig, location.pathname);
  }, [location.pathname, hidesSidebar]);

  const masterTabs = useMemo(() => {
    if (hidesSidebar) return [];
    if (activeModuleInfo) return activeModuleInfo.children;
    const masterData = menuConfig.find(item => item.slug === 'master-data');
    return masterData?.children || [];
  }, [activeModuleInfo, hidesSidebar]);

  // Sidebar is visible only when we have tabs AND we're not on a portal page
  const isSidebarMode = !hidesSidebar && masterTabs.length > 0;

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
        <div className="mx-auto px-4 md:px-6 py-6 flex flex-col lg:flex-row gap-8 relative">
          {/* Mobile Drawer Backdrop Overlay */}
          {isMobileDrawerOpen && (
            <div
              className="mobile-drawer-overlay"
              onClick={() => setIsMobileDrawerOpen(false)}
            />
          )}

          {/* Sidebar Navigation Wrapper — hidden on portal pages */}
          {isSidebarMode && (
            <div
              className={`app-sidebar-wrapper ${isMobileDrawerOpen ? 'mobile-open' : ''}`}
            >
              <Sidebar
                headerTitle={activeModuleInfo?.parent?.label || 'Navigation'}
                headerSubtitle={activeModuleInfo?.parent?.description || ''}
                headerIcon={activeModuleInfo?.parent?.icon || 'grid_view'}
                items={masterTabs}
                activeIndex={activeIndex}
                onItemClick={idx => {
                  handleSidebarItemClick(idx);
                  setIsMobileDrawerOpen(false);
                }}
              />
            </div>
          )}

          {/* Mobile Close Button */}
          {isMobileDrawerOpen && isSidebarMode && (
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
