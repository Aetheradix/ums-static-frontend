import React, { useState } from 'react';
import ServiceFilters from '../components/ServiceFilters';
import ServicesGrid from '../components/ServicesGrid';
import WelcomeBanner from '../components/WelcomeBanner';
import '../styles/menu.css';

const MenuPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('Core');

  return (
    <div className="menu-page">
      <div className="menu-page-container">
        <WelcomeBanner />
        <ServiceFilters
          activeFilter={activeFilter}
          onChangeFilter={setActiveFilter}
        />
        <ServicesGrid activeFilter={activeFilter} />
      </div>
    </div>
  );
};

export default MenuPage;
