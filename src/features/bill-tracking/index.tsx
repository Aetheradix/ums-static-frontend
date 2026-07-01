import { Navigate, Route, Routes } from 'react-router-dom';

// Dashboard
import Dashboard from './dashboard';

// Screens
import BillReceipt from './bill-receipt';
import VendorBills from './vendor-bills';
import EmployeeClaims from './employee-claims';
import TaxDeductions from './tax-deductions';
import BillVerification from './bill-verification';
import BillApproval from './bill-approval';
import PaymentProcessing from './payment-processing';
import BankPaymentRegister from './bank-payment-register';
import BillTrackingStatus from './bill-tracking-status';
import CancelledBills from './cancelled-bills';
import Reports from './reports';

export default function BillTracking() {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard/*" element={<Dashboard />} />
      <Route path="bill-receipt/*" element={<BillReceipt />} />
      <Route path="vendor-bills/*" element={<VendorBills />} />
      <Route path="employee-claims/*" element={<EmployeeClaims />} />
      <Route path="tax-deductions/*" element={<TaxDeductions />} />
      <Route path="bill-verification/*" element={<BillVerification />} />
      <Route path="bill-approval/*" element={<BillApproval />} />
      <Route path="payment-processing/*" element={<PaymentProcessing />} />
      <Route path="bank-payment-register/*" element={<BankPaymentRegister />} />
      <Route path="bill-tracking-status/*" element={<BillTrackingStatus />} />
      <Route path="cancelled-bills/*" element={<CancelledBills />} />
      <Route path="reports/*" element={<Reports />} />
    </Routes>
  );
}
