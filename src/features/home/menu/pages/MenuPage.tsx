import React from 'react';
import ServiceFilters from '../components/ServiceFilters';
import ServicesGrid from '../components/ServicesGrid';
import WelcomeBanner from '../components/WelcomeBanner';
import '../styles/menu.css';

const MenuPage: React.FC = () => (
  <div className="menu-page">
    <div className="menu-page-container">
      <WelcomeBanner />
      <ServiceFilters />
      <ServicesGrid />
    </div>
  </div>
);

export default MenuPage;
