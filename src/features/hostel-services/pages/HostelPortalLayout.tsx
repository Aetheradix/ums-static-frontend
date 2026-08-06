import { useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from 'shared/new-components';
import { useHostelContext } from '../context/HostelContext';
import type { PortalRole } from '../context/HostelContext';
import './HostelPortalLayout.css';

// ── Menu items per portal ──

interface PortalMenuItem {
  label: string;
  icon: string;
  path: string;
}

const adminMenuItems: PortalMenuItem[] = [
  {
    label: 'Dashboard',
    icon: 'dashboard',
    path: '/hostel-services/admin/dashboard',
  },
  {
    label: 'Hostel Master',
    icon: 'apartment',
    path: '/hostel-services/admin/masters/hostel',
  },
  {
    label: 'Building Master',
    icon: 'business',
    path: '/hostel-services/admin/masters/building',
  },
  {
    label: 'Room Type Master',
    icon: 'category',
    path: '/hostel-services/admin/masters/room-type',
  },
  {
    label: 'Room & Bed Master',
    icon: 'bed',
    path: '/hostel-services/admin/masters/room-bed',
  },
  {
    label: 'Warden/Staff Master',
    icon: 'badge',
    path: '/hostel-services/admin/masters/warden-staff',
  },
  {
    label: 'Facility Master',
    icon: 'local_convenience_store',
    path: '/hostel-services/admin/masters/facility',
  },
  {
    label: 'Hostel-Facility Mapping',
    icon: 'map',
    path: '/hostel-services/admin/masters/hostel-facility-mapping',
  },
  {
    label: 'Mess/Menu Master',
    icon: 'restaurant_menu',
    path: '/hostel-services/admin/masters/mess-menu',
  },
  {
    label: 'Request Type Master',
    icon: 'report_problem',
    path: '/hostel-services/admin/masters/request-type',
  },
  {
    label: 'Fee Component Master',
    icon: 'payments',
    path: '/hostel-services/admin/masters/fee-component',
  },
  {
    label: 'Rule/Policy Master',
    icon: 'gavel',
    path: '/hostel-services/admin/masters/rule-policy',
  },
  {
    label: 'Hostel Application',
    icon: 'assignment',
    path: '/hostel-services/admin/transactions/application',
  },
  {
    label: 'Room & Bed Allocation',
    icon: 'how_to_reg',
    path: '/hostel-services/admin/transactions/allocation',
  },
  {
    label: 'Student Fee Component',
    icon: 'receipt',
    path: '/hostel-services/admin/transactions/fee-generation',
  },
  {
    label: 'Fee Collection & Receipt',
    icon: 'price_check',
    path: '/hostel-services/admin/transactions/fee-collection',
  },
  {
    label: 'Vacate / Checkout & Refund',
    icon: 'exit_to_app',
    path: '/hostel-services/admin/transactions/checkout-refund',
  },
  {
    label: 'Reports',
    icon: 'bar_chart',
    path: '/hostel-services/admin/reports',
  },
];

const wardenMenuItems: PortalMenuItem[] = [
  {
    label: 'Dashboard',
    icon: 'dashboard',
    path: '/hostel-services/warden/dashboard',
  },
  {
    label: 'Attendance Register',
    icon: 'event_available',
    path: '/hostel-services/warden/attendance',
  },
  {
    label: 'Leave & Outpass',
    icon: 'directions_walk',
    path: '/hostel-services/warden/leave-outpass',
  },
  {
    label: 'Visitor Entry/Exit Log',
    icon: 'badge',
    path: '/hostel-services/warden/visitor-log',
  },
  {
    label: 'Inventory & Stock',
    icon: 'inventory_2',
    path: '/hostel-services/warden/inventory-stock',
  },
  {
    label: 'Maintenance Tickets',
    icon: 'build',
    path: '/hostel-services/warden/maintenance-tickets',
  },
  {
    label: 'Room Change Request',
    icon: 'swap_calls',
    path: '/hostel-services/warden/room-change-request',
  },
  {
    label: 'Request / Complaint',
    icon: 'feedback',
    path: '/hostel-services/warden/request',
  },
  {
    label: 'Incident Reporting',
    icon: 'report',
    path: '/hostel-services/warden/incident-reporting',
  },
  {
    label: 'Disciplinary Action',
    icon: 'gavel',
    path: '/hostel-services/warden/disciplinary-action',
  },
  {
    label: 'Mess Menu',
    icon: 'restaurant_menu',
    path: '/hostel-services/warden/mess-menu',
  },
];

const studentMenuItems: PortalMenuItem[] = [
  {
    label: 'Hostel Application',
    icon: 'assignment',
    path: '/hostel-services/student/application',
  },
  {
    label: 'Room & Bed Allocation',
    icon: 'bed',
    path: '/hostel-services/student/allocation',
  },
  {
    label: 'Fee Payment',
    icon: 'payments',
    path: '/hostel-services/student/fee-collection',
  },
  {
    label: 'Mess Menu',
    icon: 'restaurant_menu',
    path: '/hostel-services/student/mess-menu',
  },
  {
    label: 'Inventory & Mess Quality',
    icon: 'inventory_2',
    path: '/hostel-services/student/inventory-stock',
  },
  {
    label: 'Leave & Outpass',
    icon: 'directions_walk',
    path: '/hostel-services/student/leave-outpass',
  },
  {
    label: 'Maintenance Tickets',
    icon: 'build',
    path: '/hostel-services/student/maintenance-tickets',
  },
  {
    label: 'Request / Complaint',
    icon: 'feedback',
    path: '/hostel-services/student/request',
  },
  {
    label: 'Room Change Request',
    icon: 'swap_calls',
    path: '/hostel-services/student/room-change-request',
  },
  {
    label: 'Vacate / Checkout',
    icon: 'exit_to_app',
    path: '/hostel-services/student/checkout-refund',
  },
];

const portalConfig: Record<
  PortalRole,
  { title: string; subtitle: string; icon: string; items: PortalMenuItem[] }
> = {
  admin: {
    title: 'Admin Portal',
    subtitle: 'Full hostel management access',
    icon: 'admin_panel_settings',
    items: adminMenuItems,
  },
  warden: {
    title: 'Warden Portal',
    subtitle: 'Manage your assigned hostel',
    icon: 'badge',
    items: wardenMenuItems,
  },
  student: {
    title: 'Student Portal',
    subtitle:
      'Apply for hostel, view room allocation, pay fees, and raise complaints.',
    icon: 'school',
    items: studentMenuItems,
  },
};

export default function HostelPortalLayout() {
  const { activePortal } = useHostelContext();
  const location = useLocation();
  const navigate = useNavigate();

  const config = useMemo(
    () => (activePortal ? portalConfig[activePortal] : null),
    [activePortal]
  );

  const activeIndex = useMemo(() => {
    if (!config) return -1;
    return config.items.findIndex(
      item =>
        location.pathname === item.path ||
        location.pathname.startsWith(item.path + '/')
    );
  }, [config, location.pathname]);

  if (!config || !activePortal) {
    return <Outlet />;
  }

  return (
    <div className="hostel-portal-layout flex w-full">
      {/* ── Standard Shared Sidebar Component ── */}
      <div className="app-sidebar-wrapper shrink-0">
        <Sidebar
          headerTitle={config.title}
          headerSubtitle={config.subtitle}
          headerIcon={config.icon}
          items={config.items}
          activeIndex={activeIndex}
          onItemClick={idx => {
            const item = config.items[idx];
            if (item?.path) {
              navigate(item.path);
            }
          }}
        />
      </div>

      {/* ── Main Content Area ── */}
      <div className="hostel-portal-content flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
