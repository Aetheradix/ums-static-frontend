import React from 'react';
import '../styles/menu.css';

interface ServiceFiltersProps {
  activeFilter: string;
  onChangeFilter: (filter: string) => void;
}

const filters = [
  { label: 'Core', icon: 'pi-bolt' },
  { label: 'All' },
  { label: 'Academics' },
  { label: 'HR' },
  { label: 'Finance' },
  { label: 'Operation' },
];

const ServiceFilters: React.FC<ServiceFiltersProps> = ({
  activeFilter,
  onChangeFilter,
}) => (
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
          type="button"
          className={`service-filter-tab${activeFilter === filter.label ? ' active' : ''}`}
          onClick={() => onChangeFilter(filter.label)}
        >
          {filter.icon && <i className={`pi ${filter.icon}`}></i>}
          {filter.label}
        </button>
      ))}
    </div>
  </div>
);

export default ServiceFilters;
