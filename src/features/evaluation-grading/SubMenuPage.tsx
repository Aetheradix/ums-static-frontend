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

interface SubMenuPageProps {
  slug: string;
}

export default function SubMenuPage({ slug }: SubMenuPageProps) {
  const menuConfig = useMenu();
  const service = findModuleBySlug(menuConfig, slug);

  if (!service || !service.children) {
    return (
      <div className="p-8 text-center text-gray-500">
        No pages configured for this section.
      </div>
    );
  }

  return (
    <div className="submenu-page h-full overflow-auto">
      <div className="submenu-page-container">
        <SubMenuHeader
          serviceTitle={service.label}
          category={service.category || 'Evaluation & Grading'}
        />
        <div className="mt-8">
          <SubMenuGrid items={service.children} />
        </div>
      </div>
    </div>
  );
}
