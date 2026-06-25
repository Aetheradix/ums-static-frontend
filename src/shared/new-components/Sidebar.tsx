import React, { useState, useEffect } from 'react';
import { useMenu } from 'config/menu-routes';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

export interface SidebarItem {
  label: string;
  icon?: string;
  slug?: string;
  path?: string;
}

export interface SidebarProps {
  headerTitle: string;
  headerSubtitle?: string;
  headerIcon?: string;
  items: SidebarItem[];
  activeIndex: number;
  onItemClick: (index: number) => void;
}

const mapToPiIcon = (icon: any) => {
  if (typeof icon !== 'string') return 'pi-th-large';

  const map: Record<string, string> = {
    school: 'pi-book',
    groups: 'pi-users',
    grid_view: 'pi-th-large',
    menu_book: 'pi-bookmark',
    bolt: 'pi-bolt',
    work: 'pi-briefcase',
    science: 'pi-compass',
    accessible: 'pi-user',
    credit_card: 'pi-id-card',
    desktop_windows: 'pi-desktop',
    build: 'pi-cog',
    workspace_premium: 'pi-star-fill',
    settings: 'pi-sliders-v',
    apartment: 'pi-building',
    edit_location: 'pi-map-marker',
    domain: 'pi-home',
    badge: 'pi-id-card',
  };

  return map[icon || ''] || `pi-${icon || 'th-large'}`;
};

const matchPath = (currentPath: string, targetPath?: string) => {
  if (!targetPath) return false;
  return currentPath === targetPath || currentPath.startsWith(targetPath + '/');
};

const Sidebar: React.FC<SidebarProps> = ({
  headerTitle,
  headerSubtitle,
  headerIcon = 'user',
  items,
  activeIndex,
  onItemClick,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const menuConfig = useMenu();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDark, setIsDark] = useState(() =>
    document.body.classList.contains('dark')
  );

  // Accordion states
  const [openModuleSlug, setOpenModuleSlug] = useState<string | null>(null);
  const [openSubMenuSlug, setOpenSubMenuSlug] = useState<string | null>(null);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains('dark'));
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  // Auto-expand accordion modules and submenus matching current route path
  useEffect(() => {
    const pathname = location.pathname;
    let foundModuleSlug: string | null = null;
    let foundSubMenuSlug: string | null = null;

    for (const module of menuConfig) {
      const moduleSlug = module.slug || '';

      if (module.children) {
        for (const subMenu of module.children) {
          const subMenuSlug = subMenu.slug || '';

          // Check Level 2 children (leaves)
          if (subMenu.children) {
            for (const leaf of subMenu.children) {
              if (matchPath(pathname, leaf.path)) {
                foundModuleSlug = moduleSlug;
                foundSubMenuSlug = subMenuSlug;
                break;
              }
            }
          }

          // Check Level 1 path (if leaf or matching)
          if (!foundModuleSlug && matchPath(pathname, subMenu.path)) {
            foundModuleSlug = moduleSlug;
            foundSubMenuSlug = subMenuSlug;
          }

          if (foundModuleSlug) break;
        }
      }

      // Check Level 0 path
      if (!foundModuleSlug && matchPath(pathname, module.path)) {
        foundModuleSlug = moduleSlug;
      }

      if (foundModuleSlug) break;
    }

    if (foundModuleSlug) {
      setOpenModuleSlug(foundModuleSlug);
    }
    if (foundSubMenuSlug) {
      setOpenSubMenuSlug(foundSubMenuSlug);
    }
  }, [location.pathname, menuConfig]);

  const getIcon = (iconName?: any) => {
    if (!iconName || typeof iconName !== 'string') return 'circle';

    const iconMap: Record<string, string> = {
      person_add: 'user-plus',
      assignment: 'file-edit',
      manage_accounts: 'user',
      users: 'users',
      employee: 'user',
      employees: 'users',
      settings: 'cog',
      department: 'building',
      designation: 'id-card',
      person: 'user',
      badge: 'id-card',
      vpn_key: 'key',
      assignment_ind: 'user-edit',
      edit_location: 'map-marker',
      globe: 'globe',
      folder: 'folder',
      map: 'map',
      location_city: 'building',
      grid_view: 'th-large',
      menu_book: 'book',
      apartment: 'building',
      domain: 'home',
      groups: 'users',
      work: 'briefcase',
      class: 'users',
      segment: 'align-justify',
      category: 'tags',
      article: 'file',
      school: 'book',
      bar_chart: 'chart-bar',
      notifications: 'bell',
      download: 'download',
      image: 'image',
      feed: 'list',
      assignment_turned_in: 'check-square',
      workspace_premium: 'star-fill',
      settings_accessibility: 'user',
      description: 'file',
      account_tree: 'sitemap',
      travel_explore: 'compass',
      trending_up: 'chart-line',
      event: 'calendar',
      'th-large': 'th-large',
    };

    return iconMap[iconName] || 'circle'; // Default to circle if icon doesn't exist in PrimeIcons
  };

  return (
    <aside
      className={`app-sidebar-container ${isCollapsed ? 'collapsed' : ''}`}
    >
      {/* Toggle Button - positioned half inside/outside on the top right */}
      <button
        type="button"
        className="app-sidebar-toggle-btn"
        onClick={() => setIsCollapsed(prev => !prev)}
        aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        <i className={`pi pi-chevron-${isCollapsed ? 'right' : 'left'}`} />
      </button>

      <div className="app-sidebar-header">
        <span className="app-sidebar-header-icon hidden lg:flex">
          <i className={`pi pi-${getIcon(headerIcon)}`} />
        </span>

        <div className="app-sidebar-header-text hidden lg:block">
          <h3>{headerTitle}</h3>
          {headerSubtitle && <p>{headerSubtitle}</p>}
        </div>

        {/* Mobile Logo */}
        <div className="app-sidebar-mobile-logo flex lg:hidden items-center justify-center w-full py-1">
          <img
            src="/Octagon_Logo.png"
            alt="Logo"
            className="max-h-[45px] w-auto object-contain"
          />
        </div>
      </div>

      {items.length > 0 && (
        <nav className="app-sidebar-menu" aria-label={headerTitle}>
          {items.map((item, idx) => {
            const isRouteActive =
              (item.path && matchPath(location.pathname, item.path)) ||
              (item.slug && location.pathname.includes(`/${item.slug}`));
            const isActive = isRouteActive || idx === activeIndex;

            return (
              <button
                key={item.slug || item.path || item.label || idx}
                type="button"
                className={`app-sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => onItemClick(idx)}
                aria-current={isActive ? 'page' : undefined}
              >
                <i className={`pi pi-${getIcon(item.icon)} app-sidebar-icon`} />

                <span className="app-sidebar-label">{item.label}</span>

                {isActive && (
                  <i className="pi pi-chevron-right app-sidebar-arrow" />
                )}
              </button>
            );
          })}
        </nav>
      )}

      {/* Mobile-only Main Modules (Tile Menu) Section with Collapsible Hierarchy */}
      <div className="app-sidebar-mobile-modules">
        <div className="app-sidebar-section-title">
          {items.length > 0 ? 'Switch Module' : 'All Modules'}
        </div>
        <div className="app-sidebar-modules-list">
          {menuConfig.map((module, i) => {
            const moduleSlug = module.slug || `mod-${i}`;
            const isModuleOpen = openModuleSlug === moduleSlug;
            const isModuleActive =
              module.slug && window.location.pathname.includes(module.slug);
            const mode = isDark ? 'dark' : 'light';
            const iconColorClass = `waffle-icon-${module.colorScheme || 'gray'}-${mode}`;

            return (
              <div key={moduleSlug} className="app-sidebar-accordion-group">
                {/* Level 0 Item */}
                <button
                  type="button"
                  className={`app-sidebar-module-item ${isModuleActive ? 'active' : ''} ${isModuleOpen ? 'expanded' : ''}`}
                  onClick={() => {
                    if (module.children && module.children.length > 0) {
                      setOpenModuleSlug(isModuleOpen ? null : moduleSlug);
                      setOpenSubMenuSlug(null); // Close sub-level accordion when changing top-level
                    } else if (module.path) {
                      navigate(module.path);
                    } else if (module.slug) {
                      navigate(`/home/sub-menu/${module.slug}`);
                    }
                  }}
                >
                  <span className={`app-sidebar-module-icon ${iconColorClass}`}>
                    <i className={`pi ${mapToPiIcon(module.icon)}`} />
                  </span>
                  <span className="app-sidebar-module-label">
                    {module.label}
                  </span>
                  {module.children && module.children.length > 0 ? (
                    <i
                      className={`pi pi-chevron-${isModuleOpen ? 'down' : 'right'} app-sidebar-module-arrow`}
                    />
                  ) : (
                    <i className="pi pi-chevron-right app-sidebar-module-arrow" />
                  )}
                </button>

                {/* Level 1 Sub-menus */}
                {isModuleOpen &&
                  module.children &&
                  module.children.length > 0 && (
                    <div className="app-sidebar-level1-container">
                      {module.children.map((subMenu, j) => {
                        const subMenuSlug = subMenu.slug || `sub-${i}-${j}`;
                        const isSubMenuOpen = openSubMenuSlug === subMenuSlug;
                        const isSubMenuActive =
                          subMenu.path &&
                          window.location.pathname.startsWith(subMenu.path);

                        return (
                          <div
                            key={subMenuSlug}
                            className="app-sidebar-accordion-subgroup"
                          >
                            {/* Level 1 Item */}
                            <button
                              type="button"
                              className={`app-sidebar-submenu-item ${isSubMenuActive ? 'active' : ''} ${isSubMenuOpen ? 'expanded' : ''}`}
                              onClick={() => {
                                if (
                                  subMenu.children &&
                                  subMenu.children.length > 0
                                ) {
                                  setOpenSubMenuSlug(
                                    isSubMenuOpen ? null : subMenuSlug
                                  );
                                } else if (subMenu.path) {
                                  navigate(subMenu.path);
                                }
                              }}
                            >
                              <i
                                className={`pi pi-${getIcon(subMenu.icon)} app-sidebar-submenu-icon`}
                              />
                              <span className="app-sidebar-submenu-label">
                                {subMenu.label}
                              </span>
                              {subMenu.children &&
                              subMenu.children.length > 0 ? (
                                <i
                                  className={`pi pi-chevron-${isSubMenuOpen ? 'down' : 'right'} app-sidebar-submenu-arrow`}
                                />
                              ) : (
                                subMenu.path && (
                                  <i className="pi pi-link app-sidebar-submenu-link-icon" />
                                )
                              )}
                            </button>

                            {/* Level 2 Leaf links */}
                            {isSubMenuOpen &&
                              subMenu.children &&
                              subMenu.children.length > 0 && (
                                <div className="app-sidebar-level2-container">
                                  {subMenu.children.map((leaf, k) => {
                                    const isLeafActive =
                                      leaf.path &&
                                      window.location.pathname === leaf.path;

                                    return (
                                      <button
                                        key={leaf.path || k}
                                        type="button"
                                        className={`app-sidebar-leaf-item ${isLeafActive ? 'active' : ''}`}
                                        onClick={() => {
                                          if (leaf.path) {
                                            navigate(leaf.path);
                                          }
                                        }}
                                      >
                                        <i className="pi pi-circle-fill app-sidebar-leaf-bullet" />
                                        <span className="app-sidebar-leaf-label">
                                          {leaf.label}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                          </div>
                        );
                      })}
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="app-sidebar-help-box">
        <span className="app-sidebar-help-icon">
          <i className="pi pi-headphones" />
        </span>

        <div className="app-sidebar-help-text">
          <strong>Need Help?</strong>
          <span>Visit Help Center</span>
        </div>

        <i className="pi pi-angle-right app-sidebar-help-arrow" />
      </div>
    </aside>
  );
};

export default Sidebar;
