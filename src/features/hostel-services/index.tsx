import { Navigate, Route, Routes } from 'react-router-dom';
import { HostelProvider } from './context/HostelContext';

// Portal selectors
import AdminPortalPage from './portal/AdminPortalPage';
import WardenPortalPage from './portal/WardenPortalPage';
import StudentPortalPage from './portal/StudentPortalPage';

// Layout wrapper with sidebar
import HostelPortalLayout from './pages/HostelPortalLayout';

// Dashboard
import Dashboard from './pages/dashboard/Dashboard';
import Reports from './pages/reports/Reports';

// Masters
import HostelMaster from './pages/masters/HostelMaster';
import BuildingMaster from './pages/masters/BuildingMaster';
import RoomTypeMaster from './pages/masters/RoomTypeMaster';
import RoomBedMaster from './pages/masters/RoomBedMaster';
import WardenStaffMaster from './pages/masters/WardenStaffMaster';
import FacilityMaster from './pages/masters/FacilityMaster';
import HostelFacilityMapping from './pages/masters/HostelFacilityMapping';
import MessMenuMaster from './pages/masters/MessMenuMaster';
import RequestTypeMaster from './pages/masters/RequestTypeMaster';
import FeeComponentMaster from './pages/masters/FeeComponentMaster';
import RulePolicyMaster from './pages/masters/RulePolicyMaster';

// Transactions & Operations
import HostelApplication from './pages/transactions/HostelApplication';
import RoomAllocation from './pages/transactions/RoomAllocation';
import FeeGeneration from './pages/transactions/FeeGeneration';
import FeeCollection from './pages/transactions/FeeCollection';
import AttendanceRegister from './pages/transactions/AttendanceRegister';
import LeaveOutpass from './pages/transactions/LeaveOutpass';
import VisitorLog from './pages/transactions/VisitorLog';
import HostelRequest from './pages/transactions/HostelRequest';
import IncidentReporting from './pages/transactions/IncidentReporting';
import DisciplinaryAction from './pages/transactions/DisciplinaryAction';
import RoomChangeRequest from './pages/transactions/RoomChangeRequest';
import StudentFacilityMapping from './pages/transactions/StudentFacilityMapping';
import CheckoutRefund from './pages/transactions/CheckoutRefund';
import InventoryStock from './pages/transactions/InventoryStock';
import MaintenanceTicketing from './pages/transactions/MaintenanceTicketing';

export default function HostelServices() {
  return (
    <HostelProvider>
      <Routes>
        {/* Redirect /hostel-services → canonical SubMenu entry point */}
        <Route
          index
          element={<Navigate to="/home/sub-menu/hostel-services" replace />}
        />

        {/* ── Admin Portal Routes ── */}
        <Route path="admin" element={<HostelPortalLayout />}>
          <Route index element={<AdminPortalPage />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Masters */}
          <Route path="masters/hostel" element={<HostelMaster />} />
          <Route path="masters/building" element={<BuildingMaster />} />
          <Route path="masters/room-type" element={<RoomTypeMaster />} />
          <Route path="masters/room-bed" element={<RoomBedMaster />} />
          <Route path="masters/warden-staff" element={<WardenStaffMaster />} />
          <Route path="masters/facility" element={<FacilityMaster />} />
          <Route
            path="masters/hostel-facility-mapping"
            element={<HostelFacilityMapping />}
          />
          <Route path="masters/mess-menu" element={<MessMenuMaster />} />
          <Route path="masters/request-type" element={<RequestTypeMaster />} />
          <Route
            path="masters/fee-component"
            element={<FeeComponentMaster />}
          />
          <Route path="masters/rule-policy" element={<RulePolicyMaster />} />

          {/* Transactions */}
          <Route
            path="transactions/application"
            element={<HostelApplication />}
          />
          <Route path="transactions/allocation" element={<RoomAllocation />} />
          <Route
            path="transactions/fee-generation"
            element={<FeeGeneration />}
          />
          <Route
            path="transactions/fee-collection"
            element={<FeeCollection />}
          />
          <Route
            path="transactions/attendance"
            element={<AttendanceRegister />}
          />
          <Route path="transactions/leave-outpass" element={<LeaveOutpass />} />
          <Route path="transactions/visitor-log" element={<VisitorLog />} />
          <Route path="transactions/request" element={<HostelRequest />} />
          <Route
            path="transactions/incident-reporting"
            element={<IncidentReporting />}
          />
          <Route
            path="transactions/disciplinary-action"
            element={<DisciplinaryAction />}
          />
          <Route
            path="transactions/room-change-request"
            element={<RoomChangeRequest />}
          />
          <Route
            path="transactions/student-facility-mapping"
            element={<StudentFacilityMapping />}
          />
          <Route
            path="transactions/checkout-refund"
            element={<CheckoutRefund />}
          />
          <Route
            path="transactions/inventory-stock"
            element={<InventoryStock />}
          />
          <Route
            path="transactions/maintenance-tickets"
            element={<MaintenanceTicketing />}
          />

          {/* Reports */}
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* ── Warden Portal Routes ── */}
        <Route path="warden" element={<HostelPortalLayout />}>
          <Route index element={<WardenPortalPage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="attendance" element={<AttendanceRegister />} />
          <Route path="leave-outpass" element={<LeaveOutpass />} />
          <Route path="visitor-log" element={<VisitorLog />} />
          <Route path="incident-reporting" element={<IncidentReporting />} />
          <Route path="request" element={<HostelRequest />} />
          <Route path="disciplinary-action" element={<DisciplinaryAction />} />
          <Route path="room-change-request" element={<RoomChangeRequest />} />
          <Route path="mess-menu" element={<MessMenuMaster />} />
          <Route path="inventory-stock" element={<InventoryStock />} />
          <Route
            path="maintenance-tickets"
            element={<MaintenanceTicketing />}
          />
        </Route>

        {/* ── Student Portal Routes ── */}
        <Route path="student" element={<HostelPortalLayout />}>
          <Route index element={<StudentPortalPage />} />
          <Route path="application" element={<HostelApplication />} />
          <Route path="allocation" element={<RoomAllocation />} />
          <Route path="fee-collection" element={<FeeCollection />} />
          <Route path="mess-menu" element={<MessMenuMaster />} />
          <Route path="inventory-stock" element={<InventoryStock />} />
          <Route path="leave-outpass" element={<LeaveOutpass />} />
          <Route path="request" element={<HostelRequest />} />
          <Route path="room-change-request" element={<RoomChangeRequest />} />
          <Route path="checkout-refund" element={<CheckoutRefund />} />
          <Route
            path="maintenance-tickets"
            element={<MaintenanceTicketing />}
          />
        </Route>
      </Routes>
    </HostelProvider>
  );
}
