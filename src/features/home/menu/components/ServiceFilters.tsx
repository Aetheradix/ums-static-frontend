import React from 'react';
import '../styles/menu.css';

const filters = [
  { label: 'Favourite', active: true, icon: true },
  { label: 'All', active: false },
  { label: 'Academics', active: false },
  { label: 'HR', active: false },
  { label: 'Finance', active: false },
  { label: 'Operation', active: false },
];

const ServiceFilters: React.FC = () => (
  <div>
    <div className="service-filters-header">
      <h2 className="service-filters-title">All Services</h2>
      <a href="#" className="service-filters-link">
        Customized Tiles
        <i className="pi pi-arrow-right"></i>
      </a>
    </div>

    <div className="service-filter-tabs">
      {filters.map(filter => (
        <button
          key={filter.label}
          className={`service-filter-tab${filter.active ? ' active' : ''}`}
        >
          {filter.icon && <i className="pi pi-star-fill"></i>}
          {filter.label}
        </button>
      ))}
    </div>
  </div>
);

export default ServiceFilters;
