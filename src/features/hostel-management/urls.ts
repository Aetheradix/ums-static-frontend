// ─── URL builder for the Hostel Management module ────────────────────────────

export const HOSTEL_MANAGEMENT_BASE_URL = 'hostel-management';

export const hostelManagementUrls = (base: string) => {
  const prefix = `${base}`;
  return {
    root: prefix,
    hostelRegistry: `${prefix}/hostel-registry`,
    roomConfiguration: `${prefix}/room-configuration`,
    studentApply: `${prefix}/student-apply`,
    adminDesk: `${prefix}/admin-desk`,
    roomAllotment: `${prefix}/room-allotment`,
    ledgerInvoice: `${prefix}/ledger-invoice`,
    checkIn: `${prefix}/check-in`,
  };
};
