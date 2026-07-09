const BASE = 'health-management';

export const hmsUrls = {
  portal: `/${BASE}`,
  admin: {
    portal: `/${BASE}/admin`,
    dashboard: `/${BASE}/admin/dashboard`,
    settings: `/${BASE}/admin/settings`,
  },
  doctor: {
    portal: `/${BASE}/doctor`,
    dashboard: `/${BASE}/doctor/dashboard`,
  },
  pharmacist: {
    portal: `/${BASE}/pharmacist`,
    dispensary: `/${BASE}/pharmacist/dispensary`,
    stock: `/${BASE}/pharmacist/stock`,
  },
  employee: {
    portal: `/${BASE}/employee`,
    dashboard: `/${BASE}/employee/dashboard`,
  },
  memberships: `/${BASE}/memberships`,
  addMembership: `/${BASE}/memberships/add`,
  records: `/${BASE}/records`,
  addRecord: `/${BASE}/records/add`,
  doctors: `/${BASE}/doctors`,
  stock: `/${BASE}/stock`,
  addStock: `/${BASE}/stock/add`,
  prescriptions: `/${BASE}/prescriptions`,
  addPrescription: `/${BASE}/prescriptions/add`,
  dispensary: `/${BASE}/dispensary`,
  addDispense: `/${BASE}/dispensary/add`,
  appointments: `/${BASE}/appointments`,
  addAppointment: `/${BASE}/appointments/add`,
  guestUsers: `/${BASE}/guest-users`,
  addGuestUser: `/${BASE}/guest-users/add`,
  subscriptions: `/${BASE}/subscriptions`,
  reports: `/${BASE}/reports`,
  logs: `/${BASE}/logs`,
};
