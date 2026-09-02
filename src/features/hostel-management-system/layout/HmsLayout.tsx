import { useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from 'shared/new-components';
import {
  MOCK_STUDENT_NAME,
  MOCK_WARDEN_NAME,
  useHms,
  useHmsRole,
} from '../context/HmsContext';
import type { PortalRole } from '../context/HmsContext';
import { hmsUrls } from '../urls';
import './HmsLayout.css';

interface NavItem {
  label: string;
  icon: string;
  path: string;
}

const adminNav: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', path: hmsUrls.admin.dashboard },
  {
    label: 'Hostel Registration',
    icon: 'apartment',
    path: hmsUrls.admin.hostelRegistration,
  },
  {
    label: 'Seat Monitoring',
    icon: 'monitoring',
    path: hmsUrls.admin.monitoring,
  },
  { label: 'Reports', icon: 'bar_chart', path: hmsUrls.admin.reports },
];

const wardenNav: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', path: hmsUrls.warden.dashboard },
  {
    label: 'Room Configuration',
    icon: 'meeting_room',
    path: hmsUrls.warden.roomConfiguration,
  },
  {
    label: 'Hostel Facilities',
    icon: 'checklist',
    path: hmsUrls.warden.facilities,
  },
  {
    label: 'Admission Requests',
    icon: 'how_to_reg',
    path: hmsUrls.warden.admissionRequests,
  },
  { label: 'Room Allotment', icon: 'bed', path: hmsUrls.warden.roomAllocation },
  {
    label: 'Daily Attendance',
    icon: 'event_available',
    path: hmsUrls.warden.attendance,
  },
  {
    label: 'In & Out Entry',
    icon: 'swap_horiz',
    path: hmsUrls.warden.inOutEntry,
  },
  {
    label: 'Leave Requests',
    icon: 'directions_walk',
    path: hmsUrls.warden.leaveRequests,
  },
  { label: 'Visitor Entry', icon: 'group', path: hmsUrls.warden.visitors },
  { label: 'Student Warnings', icon: 'warning', path: hmsUrls.warden.warnings },
  {
    label: 'Mess Menu',
    icon: 'restaurant_menu',
    path: hmsUrls.warden.messMenu,
  },
  {
    label: 'Mess Feedback',
    icon: 'rate_review',
    path: hmsUrls.warden.messFeedback,
  },
  { label: 'Fee & Payments', icon: 'payments', path: hmsUrls.warden.payments },
  {
    label: 'Curricular Activities',
    icon: 'sports_soccer',
    path: hmsUrls.warden.activities,
  },
  {
    label: 'Room Change Requests',
    icon: 'swap_calls',
    path: hmsUrls.warden.roomChangeRequests,
  },
  { label: 'Grievances', icon: 'flag', path: hmsUrls.warden.grievances },
];

const studentNav: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', path: hmsUrls.student.dashboard },
  { label: 'My Room', icon: 'bed', path: hmsUrls.student.myRoom },
  { label: 'Fee & Payments', icon: 'payments', path: hmsUrls.student.payments },
  {
    label: 'My Attendance',
    icon: 'event_available',
    path: hmsUrls.student.attendance,
  },
  {
    label: 'In & Out Entry',
    icon: 'swap_horiz',
    path: hmsUrls.student.inOutEntry,
  },
  {
    label: 'Leave Application',
    icon: 'directions_walk',
    path: hmsUrls.student.leaveRequests,
  },
  { label: 'My Visitors', icon: 'group', path: hmsUrls.student.visitors },
  { label: 'My Warnings', icon: 'warning', path: hmsUrls.student.warnings },
  {
    label: 'Mess Menu',
    icon: 'restaurant_menu',
    path: hmsUrls.student.messMenu,
  },
  {
    label: 'Mess Feedback',
    icon: 'rate_review',
    path: hmsUrls.student.messFeedback,
  },
  {
    label: 'Curricular Activities',
    icon: 'sports_soccer',
    path: hmsUrls.student.activities,
  },
  {
    label: 'Room Change Request',
    icon: 'swap_calls',
    path: hmsUrls.student.roomChangeRequest,
  },
  { label: 'Grievances', icon: 'flag', path: hmsUrls.student.grievances },
];

const NAV: Record<PortalRole, NavItem[]> = {
  admin: adminNav,
  warden: wardenNav,
  student: studentNav,
};

/**
 * Workspace shell for a signed-in portal. Sign-in itself is assumed — the
 * header names who is signed in so each portal reads as its own session.
 */
export default function HmsLayout() {
  const { activePortal } = useHmsRole();
  const { data } = useHms();
  const location = useLocation();
  const navigate = useNavigate();

  const wardenHostel = data.hostels.find(
    h => h.wardenName === MOCK_WARDEN_NAME
  );

  const header = useMemo(() => {
    if (activePortal === 'admin') {
      return {
        title: 'Hostel Admin',
        subtitle: 'Signed in as University Hostel Cell',
        icon: 'admin_panel_settings',
      };
    }
    if (activePortal === 'warden') {
      return {
        title: 'Hostel Warden',
        subtitle: `${MOCK_WARDEN_NAME} · ${wardenHostel?.nameEn ?? 'Hostel'}`,
        icon: 'badge',
      };
    }
    return {
      title: 'Student Portal',
      subtitle: `Signed in as ${MOCK_STUDENT_NAME}`,
      icon: 'school',
    };
  }, [activePortal, wardenHostel]);

  const items = activePortal ? NAV[activePortal] : [];

  const activeIndex = useMemo(
    () =>
      items.findIndex(
        item =>
          location.pathname === item.path ||
          location.pathname.startsWith(item.path + '/')
      ),
    [items, location.pathname]
  );

  // The portal landing page renders its own tile selector, full width.
  if (!activePortal || items.length === 0) return <Outlet />;

  return (
    <div className="hms-layout">
      <div className="hms-layout-sidebar app-sidebar-wrapper">
        <Sidebar
          headerTitle={header.title}
          headerSubtitle={header.subtitle}
          headerIcon={header.icon}
          items={items}
          activeIndex={activeIndex}
          onItemClick={index => {
            const item = items[index];
            if (item?.path) navigate(item.path);
          }}
        />
      </div>
      <div className="hms-layout-content">
        <Outlet />
      </div>
    </div>
  );
}
