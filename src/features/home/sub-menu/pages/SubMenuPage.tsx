import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useMenu } from '../../../../config/menu-routes';
import { homeUrls } from '../../urls';
import SubMenuGrid from '../components/SubMenuGrid';
import SubMenuHeader from '../components/SubMenuHeader';
import '../styles/subMenu.css';

function findModuleBySlug(
  items: Menu.MenuItem[],
  slug: string
): Menu.MenuItem | undefined {
  for (const item of items) {
    if (item.slug === slug) return item;
    if (item.children) {
      const found = findModuleBySlug(item.children, slug);
      if (found) return found;
    }
  }
  return undefined;
}

const SubMenuPage: React.FC = () => {
  const menuConfig = useMenu();
  const { moduleId } = useParams<{ moduleId: string }>();
  const service = moduleId ? findModuleBySlug(menuConfig, moduleId) : undefined;

  if (!service || !service.children) {
    return <Navigate to={homeUrls.menu.root} replace />;
  }

  return (
    <div className="submenu-page">
      <div className="submenu-page-container">
        <SubMenuHeader
          serviceTitle={service.label}
          category={service.category}
        />
        <SubMenuGrid items={service.children} />
      </div>
    </div>
  );
};

export default SubMenuPage;
