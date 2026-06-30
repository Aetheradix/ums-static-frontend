import { Route, Routes } from 'react-router-dom';
import AdminDashboard from './admin/Dashboard';
import AdminMenuPage from './admin/AdminMenuPage';
import TransporterRegistration from './admin/TransporterRegistration';
import VehicleRegistration from './admin/VehicleRegistration';
import DriverAttenderRegistration from './admin/DriverAttenderRegistration';
import TransporterCollegeMapping from './admin/TransporterCollegeMapping';
import VehicleCollegeMapping from './admin/VehicleCollegeMapping';
import TransporterBillUpload from './admin/TransporterBillUpload';
import VehicleInsurance from './admin/operations/VehicleInsurance';
import VehicleAllotment from './admin/operations/VehicleAllotment';
import VehicleDeAllocationTransfer from './admin/operations/VehicleDeAllocationTransfer';
import VehicleMaintenanceApproval from './admin/maintenance/VehicleMaintenanceApproval';

import StudentDashboard from './student/Dashboard';
import StudentMenuPage from './student/StudentMenuPage';
import StudentBusLiveTracking from './student/BusLiveTracking';
import StudentLeaveEntryStudent from './student/StudentLeaveEntry';
import StudentBusStopEnrollment from './student/BusStopEnrollment';
import StudentPickupDropRoute from './student/StudentPickupDrop';
import StudentPickupCancellation from './student/PickupCancellationDetails';

import CollegeDashboard from './college/Dashboard';
import CollegeMenuPage from './college/CollegeMenuPage';
import InchargeRegistration from './college/InchargeRegistration';
import RouteBusStopMapping from './college/RouteBusStopMapping';
import BusGatePass from './college/BusGatePass';
import AddBusGatePass from './college/AddBusGatePass';
import DriverVehicleMapping from './college/DriverVehicleMapping';
import RouteBusMapping from './college/RouteBusMapping';
import StudentRouteMapping from './college/StudentRouteMapping';
import StudentLeaveEntry from './college/StudentLeaveEntry';
import StudentPickupDrop from './college/StudentPickupDrop';
import BusLiveTracking from './college/BusLiveTracking';
import VehicleMaintenanceRequest from './college/maintenance/VehicleMaintenanceRequest';
import VehicleMaintenance from './college/maintenance/VehicleMaintenance';
import DriverAttenderLeaveEntry from './college/DriverAttenderLeaveEntry';
import PickupCancellationDetails from './college/PickupCancellationDetails';
import BusStopEnrollment from './college/BusStopEnrollment';

import GatePassReport from './reports/GatePassReport';
import AboutTransportManagement from './AboutTransportManagement';
import TransportManagementPortalPage from './TransportManagementPortalPage';

export default function TransportManagement() {
  return (
    <Routes>
      <Route path="" element={<TransportManagementPortalPage />} />

      {/* Admin */}
      <Route path="admin-login" element={<AdminMenuPage />} />
      <Route path="admin-login/dashboard" element={<AdminDashboard />} />
      <Route
        path="admin-login/transporter-registration"
        element={<TransporterRegistration />}
      />
      <Route
        path="admin-login/vehicle-registration"
        element={<VehicleRegistration />}
      />
      <Route
        path="admin-login/driver-attender"
        element={<DriverAttenderRegistration />}
      />
      <Route
        path="admin-login/transporter-college-mapping"
        element={<TransporterCollegeMapping />}
      />
      <Route
        path="admin-login/vehicle-college-mapping"
        element={<VehicleCollegeMapping />}
      />
      <Route
        path="admin-login/bill-upload"
        element={<TransporterBillUpload />}
      />
      <Route
        path="admin-login/vehicle-insurance"
        element={<VehicleInsurance />}
      />
      <Route
        path="admin-login/vehicle-allotment"
        element={<VehicleAllotment />}
      />
      <Route
        path="admin-login/vehicle-transfer"
        element={<VehicleDeAllocationTransfer />}
      />
      <Route
        path="admin-login/maintenance-approval"
        element={<VehicleMaintenanceApproval />}
      />

      {/* Student */}
      <Route path="student-login" element={<StudentMenuPage />} />
      <Route path="student-login/dashboard" element={<StudentDashboard />} />
      <Route
        path="student-login/live-tracking"
        element={<StudentBusLiveTracking />}
      />
      <Route
        path="student-login/student-leave"
        element={<StudentLeaveEntryStudent />}
      />
      <Route
        path="student-login/bus-stop-enrollment"
        element={<StudentBusStopEnrollment />}
      />
      <Route
        path="student-login/pickup-drop"
        element={<StudentPickupDropRoute />}
      />
      <Route
        path="student-login/pickup-cancellation"
        element={<StudentPickupCancellation />}
      />

      {/* College */}
      <Route path="college-login" element={<CollegeMenuPage />} />
      <Route path="college-login/dashboard" element={<CollegeDashboard />} />
      <Route
        path="college-login/incharge-registration"
        element={<InchargeRegistration />}
      />
      <Route
        path="college-login/route-bus-stop-mapping"
        element={<RouteBusStopMapping />}
      />
      <Route path="college-login/bus-gate-pass" element={<BusGatePass />} />
      <Route
        path="college-login/add-bus-gate-pass"
        element={<AddBusGatePass />}
      />
      <Route
        path="college-login/driver-vehicle-mapping"
        element={<DriverVehicleMapping />}
      />
      <Route
        path="college-login/route-bus-mapping"
        element={<RouteBusMapping />}
      />
      <Route
        path="college-login/student-route-mapping"
        element={<StudentRouteMapping />}
      />
      <Route
        path="college-login/student-leave"
        element={<StudentLeaveEntry />}
      />
      <Route path="college-login/pickup-drop" element={<StudentPickupDrop />} />
      <Route path="college-login/live-tracking" element={<BusLiveTracking />} />
      <Route
        path="college-login/maintenance-request"
        element={<VehicleMaintenanceRequest />}
      />
      <Route
        path="college-login/maintenance-log"
        element={<VehicleMaintenance />}
      />
      <Route
        path="college-login/staff-leave"
        element={<DriverAttenderLeaveEntry />}
      />
      <Route
        path="college-login/pickup-cancellation"
        element={<PickupCancellationDetails />}
      />
      <Route
        path="college-login/bus-stop-enrollment"
        element={<BusStopEnrollment />}
      />

      {/* Reports */}
      <Route path="reports/gate-pass-report" element={<GatePassReport />} />
      <Route path="reports/maintenance-report" element={<GatePassReport />} />
      <Route path="reports/staff-route-report" element={<GatePassReport />} />

      <Route path="about" element={<AboutTransportManagement />} />
    </Routes>
  );
}
