import { useNavigate } from 'react-router-dom';
import Tile from '../../components/Tiles/Tile';
import Breadcrumb from '../Breadcrumb';
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
}

export default function PortalSelector({
  moduleTitle,
  moduleDescription,
  portals,
  backPath,
  backLabel = 'Home',
}: PortalSelectorProps) {
  const navigate = useNavigate();

  return (
    <div className="portal-selector-wrapper">
      <div className="portal-selector-header">
        {backPath && (
          <div className="portal-selector-back">
            <Breadcrumb
              items={[
                { label: backLabel, to: backPath },
                { label: moduleTitle },
              ]}
            />
          </div>
        )}
        <h1 className="portal-selector-title">{moduleTitle}</h1>
        {moduleDescription && (
          <p className="portal-selector-description">{moduleDescription}</p>
        )}
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
