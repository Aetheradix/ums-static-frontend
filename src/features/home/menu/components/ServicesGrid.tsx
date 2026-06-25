import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenu } from '../../../../config/menu-routes';
import Tile from '../../../../shared/components/Tiles/Tile';
import { homeUrls } from '../../urls';
import '../styles/menu.css';

const ServicesGrid: React.FC = () => {
  const menuConfig = useMenu();
  const navigate = useNavigate();

  return (
    <div className="services-grid">
      {menuConfig.map((service, index) => (
        <Tile
          key={index}
          title={service.label}
          icon={service.icon}
          colorScheme={service.colorScheme}
          onClick={() =>
            service.slug && navigate(homeUrls.subMenu.root(service.slug))
          }
        />
      ))}
    </div>
  );
};

export default ServicesGrid;
