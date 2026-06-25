import React from 'react';
import { useNavigate } from 'react-router-dom';
import Tile from '../../../../shared/components/Tiles/Tile';
import '../styles/subMenu.css';

interface SubMenuGridProps {
  items: Menu.MenuItem[];
}

const SubMenuGrid: React.FC<SubMenuGridProps> = ({ items }) => {
  const navigate = useNavigate();

  return (
    <div className="submenu-grid">
      {items.map((item, index) => (
        <Tile
          key={index}
          title={item.label}
          icon={item.icon}
          colorScheme={item.colorScheme}
          description={item.description}
          onClick={item.path ? () => navigate(item.path!) : undefined}
        />
      ))}
    </div>
  );
};

export default SubMenuGrid;
