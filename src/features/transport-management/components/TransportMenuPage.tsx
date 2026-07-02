import { useMenu } from 'config/menu-routes';
import SubMenuGrid from 'features/home/sub-menu/components/SubMenuGrid';
import { Icon } from 'shared/components/Icon/Icon';
import 'features/home/sub-menu/styles/subMenu.css';
import './TransportMenuPage.css';

interface TransportMenuPageProps {
  slug: string;
  sectionLabel: string;
  sectionIcon: string;
  emptyMessage?: string;
}

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

export default function TransportMenuPage({
  slug,
  sectionIcon,
  emptyMessage = 'No pages configured.',
}: TransportMenuPageProps) {
  const menuConfig = useMenu();
  const service = findModuleBySlug(menuConfig, slug);

  if (!service || !service.children) {
    return (
      <div className="flex flex-1 items-center justify-center p-16">
        <div className="text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 mx-auto mb-4">
            <Icon name={sectionIcon} className="text-3xl" />
          </div>
          <p className="text-slate-500 dark:text-slate-400">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transport-menu-page flex-1 overflow-auto">
      {/* ── THIN ACCENT HEADER STRIP ── */}
      <div className="transport-menu-accent-strip">
        <div className="transport-menu-accent-bg" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="hex-dot"
              style={{ animationDelay: `${i * 0.4}s` }}
            />
          ))}
        </div>
        <div className="transport-menu-accent-content">
          <div className="transport-menu-icon-wrap">
            <Icon name={sectionIcon} className="text-2xl text-white" />
          </div>
          <div>
            <div className="transport-menu-eyebrow">
              <span className="live-dot" />
              Transport Management
            </div>
            <p className="transport-menu-subtitle">
              {service.description ??
                'Select a module to manage your operations.'}
            </p>
          </div>
        </div>
      </div>

      {/* ── TILES GRID ── */}
      <div className="transport-menu-body">
        <div className="transport-tile-grid-wrapper">
          <SubMenuGrid items={service.children} />
        </div>
      </div>
    </div>
  );
}
