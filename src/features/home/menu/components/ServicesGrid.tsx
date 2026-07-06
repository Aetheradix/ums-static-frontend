import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenu } from '../../../../config/menu-routes';
import Tile from '../../../../shared/components/Tiles/Tile';
import { homeUrls } from '../../urls';
import '../styles/menu.css';

interface ServicesGridProps {
  activeFilter: string;
}

const categoryMapping: Record<string, string[]> = {
  Academics: ['Academic Centre', 'Examination Hub', 'Student Services'],
  HR: ['HRMS'],
  Finance: ['Finance'],
  Operation: ['Campus Facilities', 'Governance', 'Auxiliary Services', 'Other'],
};

const ServicesGrid: React.FC<ServicesGridProps> = ({ activeFilter }) => {
  const menuConfig = useMenu();
  const navigate = useNavigate();

  const getServiceDescription = (service: any) => {
    if (service.children && service.children.length > 0) {
      const maxItems = 3;
      const childNames = service.children
        .slice(0, maxItems)
        .map((child: any) => child.label.replace(/\n/g, ' '));

      const displayString = childNames.join(' • ');
      if (service.children.length > maxItems) {
        return `${displayString} & more`;
      }
      return displayString;
    }
    return service.description;
  };

  const filteredServices = menuConfig.filter(service => {
    if (activeFilter === 'Core' || activeFilter === 'All') {
      return true;
    }
    const categories = categoryMapping[activeFilter];
    if (categories && service.category) {
      return categories.includes(service.category);
    }
    return false;
  });

  return (
    <div className="services-grid">
      {filteredServices.map((service, index) => (
        <Tile
          key={service.slug || index}
          title={service.label}
          icon={service.icon}
          colorScheme={service.colorScheme}
          description={getServiceDescription(service)}
          onClick={() => {
            if (service.path) {
              navigate(service.path);
            } else if (service.slug) {
              navigate(homeUrls.subMenu.root(service.slug));
            }
          }}
        />
      ))}
    </div>
  );
};

export default ServicesGrid;
