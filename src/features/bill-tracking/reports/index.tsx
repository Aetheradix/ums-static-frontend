import { Navigate, Route, Routes } from 'react-router-dom';
import VendorBillsReport from './vendor-bills-report/pages/List';
import EmployeeClaimsReport from './employee-claims-report/pages/List';
import PaymentReport from './payment-report/pages/List';
import TdsReport from './tds-report/pages/List';

export default function Reports() {
  return (
    <Routes>
      <Route index element={<Navigate to="vendor-bills-report" replace />} />
      <Route path="vendor-bills-report/*" element={<VendorBillsReport />} />
      <Route
        path="employee-claims-report/*"
        element={<EmployeeClaimsReport />}
      />
      <Route path="payment-report/*" element={<PaymentReport />} />
      <Route path="tds-report/*" element={<TdsReport />} />
      <Route path="*" element={<VendorBillsReport />} />
    </Routes>
  );
}
