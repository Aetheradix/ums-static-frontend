import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumb from 'shared/new-components/Breadcrumb';
import { useMenu } from '../../../../config/menu-routes';
import { homeUrls } from '../../urls';
import '../styles/subMenu.css';

interface SubMenuHeaderProps {
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

const SubMenuHeader: React.FC<SubMenuHeaderProps> = ({
  serviceTitle,
  category,
}) => {
  const menuConfig = useMenu();
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const path = moduleId ? getModulePath(menuConfig, moduleId) : undefined;

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
    <div className="form-page-header">
      <div className="form-page-header-content w-full flex flex-col sm:flex-row justify-between gap-4">
        {/* Left side: Welcome Message */}
        <div className="form-page-header-left flex flex-col gap-1 sm:order-1 order-2">
          <h1 className="form-page-title">
            Welcome,{' '}
            <span className="submenu-name text-[#2264dc]">Aryan Patel</span>
          </h1>
          <p className="form-page-description">
            Select a submodule to manage your workspace.
          </p>
        </div>

        {/* Right side: Breadcrumb & Back Action */}
        <div className="form-page-header-right flex flex-col sm:items-end items-start gap-2 sm:order-2 order-1">
          <div className="form-page-breadcrumb-container flex flex-col sm:items-end items-start gap-1">
            <Breadcrumb items={breadcrumbItems} />
            <button
              onClick={() => navigate(-1)}
              className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-[#2264dc] hover:text-[#1849a9] transition-colors mt-0.5 bg-slate-50 hover:bg-slate-100/80 px-2.5 py-1 rounded-md border border-slate-200 shadow-sm cursor-pointer"
              type="button"
            >
              <i className="pi pi-arrow-left text-[9px]" />
              <span>Back</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubMenuHeader;
