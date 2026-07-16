import { useNavigate } from 'react-router-dom';
import Tile from '../../components/Tiles/Tile';
import Breadcrumb, { type BreadcrumbItem } from '../Breadcrumb';
import './PortalSelector.css';

export interface PortalOption {
  title: string;
  description: string;
  icon: string;
  colorScheme:
    | 'blue'
    | 'purple'
    | 'green'
    | 'orange'
    | 'red'
    | 'pink'
    | 'teal'
    | 'indigo'
    | 'amber'
    | 'gray';
  path: string;
  badge?: string;
}

interface PortalSelectorProps {
  moduleTitle: string;
  moduleDescription?: string;
  portals: PortalOption[];
  backPath?: string;
  backLabel?: string;
  coverImage?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export default function PortalSelector({
  moduleTitle,
  moduleDescription,
  portals,
  backPath,
  backLabel = 'Home',
  coverImage,
  breadcrumbs,
}: PortalSelectorProps) {
  const navigate = useNavigate();

  return (
    <div className="portal-selector-wrapper">
      {coverImage && (
        <div className="mb-8 rounded-2xl overflow-hidden shadow-md border border-slate-200">
          <img
            src={coverImage}
            alt={moduleTitle}
            className="w-full h-48 md:h-64 object-cover"
          />
        </div>
      )}
      <div className="form-page-header">
        <div className="form-page-header-content w-full flex flex-col sm:flex-row justify-between gap-4">
          {/* Left side: Title & Description */}
          <div className="form-page-header-left flex flex-col gap-1 sm:order-1 order-2">
            <h1 className="form-page-title">{moduleTitle}</h1>
            {moduleDescription && (
              <p className="form-page-description">{moduleDescription}</p>
            )}
          </div>

          {/* Right side: Breadcrumbs and Back button */}
          <div className="form-page-header-right flex flex-col sm:items-end items-start gap-2 sm:order-2 order-1">
            <div className="form-page-breadcrumb-container flex flex-col sm:items-end items-start gap-1">
              {breadcrumbs ? (
                <Breadcrumb items={breadcrumbs} />
              ) : backPath ? (
                <Breadcrumb
                  items={[
                    { label: backLabel, to: backPath },
                    { label: moduleTitle },
                  ]}
                />
              ) : null}
              <button
                onClick={() => navigate(-1)}
                className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-[#2264dc] hover:text-[#1849a9] transition-colors mt-0.5  bg-white hover:bg-slate-100/50 px-2.5 py-1 rounded-md border border-slate-200 shadow-xs cursor-pointer"
                type="button"
              >
                <i className="pi pi-arrow-left text-[9px]" />
                <span>Back</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="portal-selector-grid">
        {portals.map((portal, index) => (
          <Tile
            key={index}
            title={portal.title}
            icon={portal.icon}
            colorScheme={portal.colorScheme}
            description={portal.description}
            badge={portal.badge}
            onClick={() => navigate(portal.path)}
          />
        ))}
      </div>
    </div>
  );
}
