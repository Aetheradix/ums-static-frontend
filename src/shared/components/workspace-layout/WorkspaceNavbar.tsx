import { useMenu } from 'config/menu-routes';
import { TieredMenu } from 'primereact/tieredmenu';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from 'shared/components/Icon/Icon';
import './WorkspaceNavbar.css';

export const WorkspaceNavbar: React.FC = () => {
  const baseMenuItems = useMenu();
  const menuItems = useMemo(
    () => [
      {
        label: 'Home',
        icon: 'home',
        path: '/home/menu',
      },
      ...baseMenuItems,
    ],
    [baseMenuItems]
  );
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
    const updateWidths = () => {
      const widths = itemRefs.current.map(ref => ref?.offsetWidth || 0);
      setItemWidths(widths);
    };

    updateWidths();

    // Re-measure after fonts load to ensure icon widths (Material Symbols) are correctly calculated
    if (document.fonts) {
      document.fonts.ready.then(updateWidths);
    }
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
      command: hasChildren ? undefined : () => handleItemClick(item),
      items: hasChildren ? item.children.map(mapToPrimeMenuItem) : undefined,
      template: (menuItem: any, options: any) => {
        return (
          <div
            className={options.className}
            onClick={e => options.onClick(e)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              cursor: 'pointer',
            }}
          >
            <Icon
              name={(item.icon as string) || 'folder'}
              className="text-lg opacity-80"
            />
            <span className={options.labelClassName}>{menuItem.label}</span>
            {hasChildren && (
              <i className="pi pi-angle-right ml-auto text-xs opacity-70" />
            )}
          </div>
        );
      },
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
                <Icon name={(item.icon as string) || 'folder'} />
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
