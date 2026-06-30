import { useMenu } from 'config/menu-routes';
import SubMenuGrid from 'features/home/sub-menu/components/SubMenuGrid';
import SubMenuHeader from 'features/home/sub-menu/components/SubMenuHeader';
import 'features/home/sub-menu/styles/subMenu.css';

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

export default function AdminMenuPage() {
  const menuConfig = useMenu();
  const service = findModuleBySlug(menuConfig, 'admin-login');

  if (!service || !service.children) {
    return (
      <div className="p-8 text-center text-gray-500">
        No pages configured for Admin Login.
      </div>
    );
  }

  return (
    <div className="submenu-page" style={{ height: '100%', overflow: 'auto' }}>
      <div className="submenu-page-container">
        <SubMenuHeader
          serviceTitle={service.label}
          category={service.category}
        />
        <div className="mt-8">
          <SubMenuGrid items={service.children} />
        </div>
      </div>
    </div>
  );
}
