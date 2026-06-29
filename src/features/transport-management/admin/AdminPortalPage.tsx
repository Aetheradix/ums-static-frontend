import { PortalSelector } from 'shared/new-components';

export default function AdminPortalPage() {
  return (
    <PortalSelector
      backPath="/transport-management"
      backLabel="Transport Management"
      moduleTitle="Admin Login"
      moduleDescription="Manage transporters, vehicles, and global transport settings."
      portals={[
        {
          title: 'Dashboard',
          description: 'Admin transport overview.',
          path: '/transport-management/admin-login/dashboard',
          icon: 'dashboard',
          colorScheme: 'indigo',
        },
        {
          title: 'Transporter Registration Detail',
          description: 'Register and manage transporters.',
          path: '/transport-management/admin-login/transporter-registration',
          icon: 'local_shipping',
          colorScheme: 'indigo',
        },
        {
          title: 'Vehicle Registration',
          description: 'Register and manage all transport vehicles.',
          path: '/transport-management/admin-login/vehicle-registration',
          icon: 'directions_car',
          colorScheme: 'indigo',
        },
        {
          title: 'Driver & Attender Registration',
          description: 'Register drivers and attenders.',
          path: '/transport-management/admin-login/driver-attender',
          icon: 'badge',
          colorScheme: 'indigo',
        },
        {
          title: 'Transporter to College Mapping',
          description: 'Map transporters to respective colleges.',
          path: '/transport-management/admin-login/transporter-college-mapping',
          icon: 'compare_arrows',
          colorScheme: 'indigo',
        },
        {
          title: 'Vehicle to College Mapping',
          description: 'Allocate registered vehicles to colleges.',
          path: '/transport-management/admin-login/vehicle-college-mapping',
          icon: 'swap_horiz',
          colorScheme: 'indigo',
        },
        {
          title: 'Transporter Bill Upload',
          description: 'Upload and approve transporter bills.',
          path: '/transport-management/admin-login/bill-upload',
          icon: 'receipt',
          colorScheme: 'indigo',
        },
        {
          title: 'Vehicle Insurance',
          description: 'Manage vehicle insurance policies.',
          path: '/transport-management/admin-login/vehicle-insurance',
          icon: 'shield',
          colorScheme: 'indigo',
        },
        {
          title: 'Vehicle Allotment',
          description: 'Allot vehicles to departments.',
          path: '/transport-management/admin-login/vehicle-allotment',
          icon: 'assignment_turned_in',
          colorScheme: 'indigo',
        },
        {
          title: 'Vehicle Transfer/De-Allocation',
          description: 'Transfer or return allotted vehicles.',
          path: '/transport-management/admin-login/vehicle-transfer',
          icon: 'transform',
          colorScheme: 'indigo',
        },
        {
          title: 'Maintenance Approval',
          description: 'Review maintenance requests.',
          path: '/transport-management/admin-login/maintenance-approval',
          icon: 'verified',
          colorScheme: 'indigo',
        },
      ]}
    />
  );
}
