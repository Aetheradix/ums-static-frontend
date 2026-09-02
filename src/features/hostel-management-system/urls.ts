/** Single source of truth for every route in the Hostel Management System. */
export const HMS_BASE = '/hostel-management-system';

/** The public forum sits outside the authenticated shell. */
export const HMS_PUBLIC_BASE = '/hostel-admission';

export const hmsUrls = {
  root: HMS_BASE,

  admin: {
    root: `${HMS_BASE}/admin`,
    dashboard: `${HMS_BASE}/admin/dashboard`,
    hostelRegistration: `${HMS_BASE}/admin/hostel-registration`,
    hostelRegistrationNew: `${HMS_BASE}/admin/hostel-registration/new`,
    hostelRegistrationEdit: (id: string) =>
      `${HMS_BASE}/admin/hostel-registration/${id}`,
    monitoring: `${HMS_BASE}/admin/monitoring`,
    reports: `${HMS_BASE}/admin/reports`,
  },

  warden: {
    root: `${HMS_BASE}/warden`,
    dashboard: `${HMS_BASE}/warden/dashboard`,
    roomConfiguration: `${HMS_BASE}/warden/room-configuration`,
    facilities: `${HMS_BASE}/warden/facilities`,
    admissionRequests: `${HMS_BASE}/warden/admission-requests`,
    roomAllocation: `${HMS_BASE}/warden/room-allocation`,
    inOutEntry: `${HMS_BASE}/warden/in-out-entry`,
    leaveRequests: `${HMS_BASE}/warden/leave-requests`,
    warnings: `${HMS_BASE}/warden/warnings`,
    messMenu: `${HMS_BASE}/warden/mess-menu`,
    messFeedback: `${HMS_BASE}/warden/mess-feedback`,
    payments: `${HMS_BASE}/warden/payments`,
    visitors: `${HMS_BASE}/warden/visitors`,
    activities: `${HMS_BASE}/warden/activities`,
    attendance: `${HMS_BASE}/warden/attendance`,
    roomChangeRequests: `${HMS_BASE}/warden/room-change-requests`,
    grievances: `${HMS_BASE}/warden/grievances`,
  },

  student: {
    root: `${HMS_BASE}/student`,
    dashboard: `${HMS_BASE}/student/dashboard`,
    myRoom: `${HMS_BASE}/student/my-room`,
    inOutEntry: `${HMS_BASE}/student/in-out-entry`,
    leaveRequests: `${HMS_BASE}/student/leave-requests`,
    warnings: `${HMS_BASE}/student/warnings`,
    messMenu: `${HMS_BASE}/student/mess-menu`,
    messFeedback: `${HMS_BASE}/student/mess-feedback`,
    payments: `${HMS_BASE}/student/payments`,
    visitors: `${HMS_BASE}/student/visitors`,
    activities: `${HMS_BASE}/student/activities`,
    attendance: `${HMS_BASE}/student/attendance`,
    roomChangeRequest: `${HMS_BASE}/student/room-change-request`,
    grievances: `${HMS_BASE}/student/grievances`,
  },

  public: {
    root: HMS_PUBLIC_BASE,
    apply: `${HMS_PUBLIC_BASE}/apply`,
    track: `${HMS_PUBLIC_BASE}/track`,
  },
};
