import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMenu } from 'config/menu-routes';
import { TieredMenu } from 'primereact/tieredmenu';
import './WorkspaceNavbar.css';

const getIcon = (iconName?: any) => {
  if (!iconName || typeof iconName !== 'string') return 'folder';

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

  return iconMap[iconName] || iconName;
};

export const WorkspaceNavbar: React.FC = () => {
  const menuItems = useMenu();
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState<number>(menuItems.length);
  const moreMenuRef = useRef<TieredMenu>(null);

  const [itemWidths, setItemWidths] = useState<number[]>([]);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  const handleItemClick = (item: any) => {
    const targetPath = getFirstAvailablePath(item);
    if (targetPath) {
      navigate(targetPath);
    }
  };

  const isActive = (item: any) => {
    const targetPath = getFirstAvailablePath(item);
    if (!targetPath) return false;
    return location.pathname.startsWith(
      targetPath.split('/').slice(0, 3).join('/')
    );
  };

  useEffect(() => {
    const widths = itemRefs.current.map(ref => ref?.offsetWidth || 0);
    setItemWidths(widths);
  }, [menuItems]);

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || itemWidths.length === 0) return;

      const containerWidth = containerRef.current.clientWidth;
      const moreButtonWidth = 90; // "More" button approx width
      const gap = 8; // 0.5rem flex gap

      // First check if ALL items can fit without the "More" button
      let totalNaturalWidth = 0;
      for (let i = 0; i < menuItems.length; i++) {
        totalNaturalWidth += (itemWidths[i] || 150) + (i > 0 ? gap : 0);
      }

      if (totalNaturalWidth <= containerWidth) {
        if (visibleCount !== menuItems.length) {
          setVisibleCount(menuItems.length);
        }
        return;
      }

      // If they don't fit, calculate how many can fit ALONG WITH the "More" button
      let newVisibleCount = 0;
      let currentWidth = 0;

      for (let i = 0; i < menuItems.length; i++) {
        const itemWidthWithGap = (itemWidths[i] || 150) + (i > 0 ? gap : 0);

        // Will it fit if we also add the "More" button right after it?
        // Note: we add 'gap' for the space between this item and the More button
        if (
          currentWidth + itemWidthWithGap + gap + moreButtonWidth >
          containerWidth
        ) {
          break; // This item doesn't fit
        }

        currentWidth += itemWidthWithGap;
        newVisibleCount = i + 1;
      }

      // Fallback: Ensure at least one item shows if there's any room, or 0 if it's super tiny
      if (
        newVisibleCount === 0 &&
        menuItems.length > 0 &&
        containerWidth > 50
      ) {
        newVisibleCount = 1;
      }

      if (newVisibleCount !== visibleCount) {
        setVisibleCount(newVisibleCount);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    handleResize();

    return () => {
      resizeObserver.disconnect();
    };
  }, [menuItems, visibleCount, itemWidths]);

  const mapToPrimeMenuItem = (item: any): any => {
    const hasChildren = item.children && item.children.length > 0;
    return {
      label: item.label?.replace('\n', ' '),
      icon: `pi pi-${getIcon(item.icon)}`,
      command: hasChildren ? undefined : () => handleItemClick(item),
      items: hasChildren ? item.children.map(mapToPrimeMenuItem) : undefined,
    };
  };

  const hiddenItems = menuItems.slice(visibleCount);

  const overflowMenuModel = hiddenItems.map(mapToPrimeMenuItem);

  const menuRefs = useRef<Record<string, TieredMenu | null>>({});

  const handleVisibleItemClick = (e: React.MouseEvent, item: any) => {
    if (item.children && item.children.length > 0) {
      menuRefs.current[item.slug || item.label]?.toggle(e);
    } else {
      handleItemClick(item);
    }
  };

  return (
    <div className="ws-navbar">
      <div className="ws-navbar-container" ref={containerRef}>
        {menuItems.map((item, index) => {
          const isHidden = index >= visibleCount && itemWidths.length > 0;
          const hasChildren = item.children && item.children.length > 0;
          return (
            <React.Fragment key={item.slug || index}>
              <div
                ref={el => {
                  itemRefs.current[index] = el;
                }}
                className={`ws-navbar-item ${isActive(item) ? 'active' : ''}`}
                style={{ display: isHidden ? 'none' : 'flex' }}
                onClick={e => handleVisibleItemClick(e, item)}
              >
                <i className={`pi pi-${getIcon(item.icon)}`} />
                <span>{item.label?.replace('\n', ' ')}</span>
                {hasChildren && (
                  <i className="pi pi-angle-down text-[10px] ml-1 opacity-70" />
                )}
              </div>
              {hasChildren && !isHidden && (
                <TieredMenu
                  model={item.children!.map(mapToPrimeMenuItem)}
                  popup
                  ref={el => {
                    menuRefs.current[item.slug || item.label] = el;
                  }}
                  className="ws-navbar-dropdown"
                  transitionOptions={{ timeout: 0 }}
                />
              )}
            </React.Fragment>
          );
        })}

        {hiddenItems.length > 0 && (
          <>
            <button
              className="ws-navbar-more"
              onClick={e => moreMenuRef.current?.toggle(e)}
              aria-controls="popup_menu_more"
              aria-haspopup
            >
              <span>More</span>
              <i className="pi pi-chevron-down text-xs ml-1" />
            </button>
            <TieredMenu
              model={overflowMenuModel}
              popup
              ref={moreMenuRef}
              id="popup_menu_more"
              className="ws-navbar-dropdown"
              transitionOptions={{ timeout: 0 }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default WorkspaceNavbar;
