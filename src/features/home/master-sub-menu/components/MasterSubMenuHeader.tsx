import React from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from 'shared/new-components/Breadcrumb';
import { useMenu } from '../../../../config/menu-routes';
import { homeUrls } from '../../urls';
import '../styles/masterSubMenu.css';

interface MasterSubMenuHeaderProps {
  serviceTitle: string;
  category?: string;
}

function getModulePath(
  items: Menu.MenuItem[],
  slug: string,
  currentPath: Menu.MenuItem[] = []
): Menu.MenuItem[] | undefined {
  for (const item of items) {
    if (item.slug === slug) {
      return [...currentPath, item];
    }
    if (item.children) {
      const found = getModulePath(item.children, slug, [...currentPath, item]);
      if (found) return found;
    }
  }
  return undefined;
}

const MasterSubMenuHeader: React.FC<MasterSubMenuHeaderProps> = ({
  serviceTitle,
  category,
}) => {
  const menuConfig = useMenu();
  const { moduleId } = useParams<{ moduleId: string }>();
  const path = getModulePath(menuConfig, moduleId || 'master-data');

  const breadcrumbItems = React.useMemo(() => {
    if (!path || path.length === 0) {
      return [
        { label: 'Home', to: homeUrls.menu.root },
        { label: serviceTitle },
      ];
    }

    const items: any[] = [{ label: 'Home', to: homeUrls.menu.root }];

    path.forEach((item, index) => {
      const isLast = index === path.length - 1;
      items.push({
        label: item.label,
        to: isLast
          ? undefined
          : item.slug
            ? `/home/sub-menu/${item.slug}`
            : undefined,
      });
    });

    return items;
  }, [path, serviceTitle, category]);

  return (
    <div className="submenu-header">
      <Breadcrumb items={breadcrumbItems} />
      <h1 className="submenu-title">{serviceTitle}</h1>
    </div>
  );
};

export default MasterSubMenuHeader;
