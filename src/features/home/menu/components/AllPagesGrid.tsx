import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenu } from '../../../../config/menu-routes';
import { Icon } from '../../../../shared/components/Icon/Icon';
import Tile from '../../../../shared/components/Tiles/Tile';

interface LeafPage {
  label: string;
  path: string;
  icon?: React.ReactNode;
  colorScheme?: string;
  description?: string;
  breadcrumb: string;
}

interface ModuleGroup {
  moduleLabel: string;
  moduleSlug?: string;
  moduleIcon?: React.ReactNode;
  moduleColorScheme?: string;
  pages: LeafPage[];
}

function collectLeafPages(
  items: Menu.MenuItem[],
  breadcrumbParts: string[] = [],
  parentColorScheme?: string,
  parentIcon?: React.ReactNode
): LeafPage[] {
  const leaves: LeafPage[] = [];

  for (const item of items) {
    const cleanLabel = item.label.replace(/\n/g, ' ');
    const currentBreadcrumb = [...breadcrumbParts, cleanLabel];

    if (item.path && (!item.children || item.children.length === 0)) {
      leaves.push({
        label: cleanLabel,
        path: item.path,
        icon: item.icon || parentIcon,
        colorScheme: item.colorScheme || parentColorScheme,
        description: item.description,
        breadcrumb: currentBreadcrumb.slice(0, -1).join(' › '),
      });
    } else if (item.children && item.children.length > 0) {
      const childLeaves = collectLeafPages(
        item.children,
        currentBreadcrumb,
        item.colorScheme || parentColorScheme,
        item.icon || parentIcon
      );
      leaves.push(...childLeaves);
    }
  }

  return leaves;
}

interface AllPagesGridProps {
  searchQuery?: string;
}

const AllPagesGrid: React.FC<AllPagesGridProps> = ({ searchQuery = '' }) => {
  const menuConfig = useMenu();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const moduleGroups: ModuleGroup[] = useMemo(() => {
    return menuConfig
      .map(module => {
        const pages = module.children
          ? collectLeafPages(
              module.children,
              [module.label.replace(/\n/g, ' ')],
              module.colorScheme,
              module.icon
            )
          : module.path
            ? [
                {
                  label: module.label.replace(/\n/g, ' '),
                  path: module.path,
                  icon: module.icon,
                  colorScheme: module.colorScheme,
                  description: module.description,
                  breadcrumb: '',
                },
              ]
            : [];

        return {
          moduleLabel: module.label.replace(/\n/g, ' '),
          moduleSlug: module.slug,
          moduleIcon: module.icon,
          moduleColorScheme: module.colorScheme,
          pages,
        };
      })
      .filter(group => group.pages.length > 0);
  }, [menuConfig]);

  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return moduleGroups;
    const q = searchQuery.toLowerCase();
    return moduleGroups
      .map(group => ({
        ...group,
        pages: group.pages.filter(
          page =>
            page.label.toLowerCase().includes(q) ||
            page.description?.toLowerCase().includes(q) ||
            page.breadcrumb.toLowerCase().includes(q)
        ),
      }))
      .filter(group => group.pages.length > 0);
  }, [moduleGroups, searchQuery]);

  const toggleCollapse = (slug?: string) => {
    const key = slug ?? 'unknown';
    setCollapsed(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (filteredGroups.length === 0) {
    return (
      <div className="all-pages-empty">
        <i className="pi pi-search text-4xl" />
        <p>No pages found for &ldquo;{searchQuery}&rdquo;</p>
      </div>
    );
  }

  const totalPagesCount = useMemo(() => {
    return filteredGroups.reduce((acc, group) => acc + group.pages.length, 0);
  }, [filteredGroups]);

  return (
    <div className="all-pages-wrapper">
      {filteredGroups.map(group => {
        const key = group.moduleSlug ?? group.moduleLabel;
        const isCollapsed = collapsed[key];
        return (
          <div key={key} className="all-pages-section">
            {/* Module Section Header */}
            <div
              className="all-pages-section-header"
              onClick={() =>
                toggleCollapse(group.moduleSlug ?? group.moduleLabel)
              }
            >
              <div className="all-pages-section-left">
                {group.moduleIcon && (
                  <span
                    className={`all-pages-module-icon icon-scheme-${group.moduleColorScheme || 'gray'}`}
                  >
                    {typeof group.moduleIcon === 'string' ? (
                      <Icon name={group.moduleIcon} />
                    ) : (
                      group.moduleIcon
                    )}
                  </span>
                )}
                <div className="all-pages-section-info">
                  <span className="all-pages-module-name">
                    {group.moduleLabel}
                  </span>
                  <span className="all-pages-module-count">
                    {group.pages.length} out of {totalPagesCount} pages
                  </span>
                </div>
              </div>
              <i
                className={`pi ${isCollapsed ? 'pi-chevron-down' : 'pi-chevron-up'} all-pages-section-chevron`}
              />
            </div>

            {/* Pages Grid */}
            {!isCollapsed && (
              <div className="services-grid all-pages-grid">
                {group.pages.map((page, idx) => (
                  <Tile
                    key={idx}
                    title={page.label}
                    icon={page.icon}
                    colorScheme={page.colorScheme as any}
                    description={page.breadcrumb || page.description}
                    onClick={() => navigate(page.path)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AllPagesGrid;
