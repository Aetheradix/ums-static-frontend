// =============================================================================
// Bill Management & Tracking — URL Constants
// =============================================================================

const BASE = '/bill-tracking';

export const billTrackingUrls = {
  root: BASE,
  dashboard: `${BASE}/dashboard`,
  billReceipt: { root: `${BASE}/bill-receipt` },
  vendorBills: { root: `${BASE}/vendor-bills` },
  employeeClaims: { root: `${BASE}/employee-claims` },
  taxDeductions: { root: `${BASE}/tax-deductions` },
  billVerification: { root: `${BASE}/bill-verification` },
  billApproval: { root: `${BASE}/bill-approval` },
  paymentProcessing: { root: `${BASE}/payment-processing` },
  bankPaymentRegister: { root: `${BASE}/bank-payment-register` },
  billTrackingStatus: { root: `${BASE}/bill-tracking-status` },
  cancelledBills: { root: `${BASE}/cancelled-bills` },
  reports: {
    root: `${BASE}/reports`,
    vendorBillsReport: `${BASE}/reports/vendor-bills-report`,
    employeeClaimsReport: `${BASE}/reports/employee-claims-report`,
    paymentReport: `${BASE}/reports/payment-report`,
    tdsReport: `${BASE}/reports/tds-report`,
  },
};
