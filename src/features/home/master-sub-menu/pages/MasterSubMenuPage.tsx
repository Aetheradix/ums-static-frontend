import { Navigate, useParams } from 'react-router-dom';
import { useMenu } from '../../../../config/menu-routes';
import MasterSubMenuGrid from '../components/MasterSubMenuGrid';
import MasterSubMenuHeader from '../components/MasterSubMenuHeader';
import '../styles/masterSubMenu.css';

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

const MasterSubMenuPage: React.FC = () => {
  const menuConfig = useMenu();
  const { moduleId } = useParams<{ moduleId: string }>();
  const service = findModuleBySlug(menuConfig, moduleId || 'master-data');

  if (!service || !service.children) {
    return <Navigate to="/home/menu" replace />;
  }

  return (
    <div className="submenu-page">
      <div className="submenu-page-container">
        <MasterSubMenuHeader
          serviceTitle={service.label}
          category={service.category}
        />
        <MasterSubMenuGrid items={service.children} />
      </div>
    </div>
  );
};

export default MasterSubMenuPage;
