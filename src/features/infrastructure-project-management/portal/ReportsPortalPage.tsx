import { Navigate } from 'react-router-dom';
import { useMenu } from '../../../config/menu-routes';
import SubMenuGrid from '../../home/sub-menu/components/SubMenuGrid';
import SubMenuHeader from '../../home/sub-menu/components/SubMenuHeader';
import '../../home/sub-menu/styles/subMenu.css';

function findModuleBySlug(items: any[], slug: string): any {
  for (const item of items) {
    if (item.slug === slug) return item;
    if (item.children) {
      const found = findModuleBySlug(item.children, slug);
      if (found) return found;
    }
  }
  return undefined;
}

export default function ReportsPortalPage() {
  const menuConfig = useMenu();
  const service = findModuleBySlug(menuConfig, 'infra-reports');

  if (!service || !service.children) {
    return <Navigate to="/infrastructure-project-management" replace />;
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
}
