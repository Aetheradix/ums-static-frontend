import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Breadcrumb.css';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const breadcrumbs = useMemo(() => {
    if (items && items.length > 0) {
      return items;
    }

    const paths = location.pathname.split('/').filter(x => x);
    const generatedItems: BreadcrumbItem[] = [
      { label: 'Home', to: '/home/menu' },
    ];
    let currentPath = '';

    paths.forEach(path => {
      currentPath += `/${path}`;

      const isGuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          path
        );
      const isNumber = /^\d+$/.test(path);

      if (isGuid || isNumber) {
        return;
      }

      let label = path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      if (path.toLowerCase() === 'location') {
        label = 'Location Management';
      } else if (path.toLowerCase() === 'faculty-management') {
        label = 'Faculty Admin';
      } else if (path.toLowerCase() === 'subject') {
        label = 'Subject Management';
      } else if (path.toLowerCase() === 'grant') {
        label = 'Grants';
      } else if (path.toLowerCase() === 'schemes') {
        label = 'Schemes';
      } else if (path.toLowerCase() === 'employee-management') {
        label = 'Employee Management System';
      } else if (path.toLowerCase() === 'quick-onboarding') {
        label = 'Quick Onboarding';
      } else if (path.toLowerCase() === 'full-onboarding') {
        label = 'Full Onboarding';
      } else if (path.toLowerCase() === 'settings') {
        label = 'Settings';
      }

      let toPath = currentPath;
      if (path.toLowerCase() === 'master') {
        toPath = '/home/sub-menu/master-data';
      } else if (path.toLowerCase() === 'location') {
        toPath = '/home/sub-menu/location';
      } else if (path.toLowerCase() === 'faculty-management') {
        toPath = '/home/sub-menu/faculty-management';
      } else if (path.toLowerCase() === 'hr') {
        toPath = '/home/sub-menu/hr';
      } else if (path.toLowerCase() === 'subject') {
        toPath = '/home/sub-menu/subject';
      } else if (path.toLowerCase() === 'other') {
        toPath = '/home/sub-menu/other';
      } else if (path.toLowerCase() === 'college') {
        toPath = '/home/sub-menu/college';
      } else if (path.toLowerCase() === 'employee') {
        toPath = '/home/sub-menu/employee-management-system';
      } else if (path.toLowerCase() === 'settings') {
        toPath = '/home/sub-menu/settings';
      } else if (path.toLowerCase() === 'grant') {
        toPath = '/home/sub-menu/grant';
      } else if (path.toLowerCase() === 'schemes') {
        toPath = '/home/sub-menu/schemes';
      } else if (path.toLowerCase() === 'employee-management') {
        toPath = '/home/sub-menu/employee-management';
      } else if (path.toLowerCase() === 'settings') {
        toPath = '/home/sub-menu/settings';
      } else if (path.toLowerCase() === 'quick-onboarding') {
        toPath = '/employee-management/quick-onboarding';
      } else if (path.toLowerCase() === 'full-onboarding') {
        toPath = '/employee-management/full-onboarding';
      } else if (path.toLowerCase() === 'affiliation-management-system') {
        toPath = '/home/sub-menu/affiliation-management-system';
      } else if (path.toLowerCase() === 'affiliation-settings') {
        toPath = '/home/sub-menu/affiliation-settings';
      }

      generatedItems.push({
        label,
        to: toPath,
      });
    });

    return generatedItems;
  }, [items, location.pathname]);

  if (breadcrumbs.length <= 1 && (!items || items.length === 0)) {
    return null;
  }

  return (
    <nav className="breadcrumb-nav">
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <React.Fragment key={index}>
            {index > 0 && <span className="breadcrumb-separator">›</span>}
            {isLast ? (
              <span className="breadcrumb-item-active">{item.label}</span>
            ) : (
              <span
                className="breadcrumb-item-link"
                onClick={() => item.to && navigate(item.to)}
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
