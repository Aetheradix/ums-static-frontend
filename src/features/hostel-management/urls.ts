// ─── URL builder for the Hostel Management module (university) ───────────────

export const HOSTEL_MANAGEMENT_BASE_URL = 'hostel-management';

export const hostelManagementUrls = (base: string) => {
  const prefix = `${base}`;
  return {
    root: prefix,
    admin: `${prefix}/admin`,
    employee: `${prefix}/employee`,
    student: `${prefix}/student`,
    studentDashboard: `${prefix}/student-dashboard`,
    masters: {
      newHostelRegistration: `${prefix}/masters/new-hostel-registration`,
      buildingLayout: `${prefix}/masters/building-layout`,
      roomTypeMaster: `${prefix}/masters/room-type-master`,
      roomAssetChecklist: `${prefix}/masters/room-asset-checklist`,
      basicFacility: `${prefix}/masters/basic-facility`,
      itemCategory: `${prefix}/masters/item-category`,
      itemMaster: `${prefix}/masters/item-master`,
      shiftMaster: `${prefix}/masters/shift-master`,
      messMenu: `${prefix}/masters/mess-menu`,
    },

    studentApplication: {
      apply: `${prefix}/student-application/apply`,
      scrutinyList: `${prefix}/student-application/scrutiny-list`,
      scrutinyDetails: `${prefix}/student-application/scrutiny-details`,
      status: `${prefix}/student-application/status`,
    },
    roomManagement: {
      allotmentConfig: `${prefix}/room-management/allotment-config`,
      singleAllotment: `${prefix}/room-management/single-allotment`,
      bulkAllotment: `${prefix}/room-management/bulk-allotment`,
      allotmentRoster: `${prefix}/room-management/allotment-roster`,
      checkInList: `${prefix}/room-management/check-in-list`,
      checkInDetails: `${prefix}/room-management/check-in-details`,
      roomChangeRequest: `${prefix}/room-management/room-change-request`,
      roomChangeApproval: `${prefix}/room-management/room-change-approval`,
    },
    studentOperations: {
      gatePassRequest: `${prefix}/student-operations/gate-pass-request`,
      gatePassApproval: `${prefix}/student-operations/gate-pass-approval`,
      leaveRequest: `${prefix}/student-operations/leave-request`,
      leaveApproval: `${prefix}/student-operations/leave-approval`,
      attendanceMarking: `${prefix}/student-operations/attendance-marking`,
      visitorPreRegistration: `${prefix}/student-operations/visitor-pre-registration`,
      visitorLogbook: `${prefix}/student-operations/visitor-logbook`,
      disciplinaryAction: `${prefix}/student-operations/disciplinary-action`,
      incidentReporting: `${prefix}/student-operations/incident-reporting`,
    },
    maintenance: {
      requests: `${prefix}/maintenance/requests`,
      assignment: `${prefix}/maintenance/assignment`,
      status: `${prefix}/maintenance/status`,
      feedback: `${prefix}/maintenance/feedback`,
    },
    stock: {
      procurement: `${prefix}/stock/procurement`,
      issue: `${prefix}/stock/issue`,
      damageScrap: `${prefix}/stock/damage-scrap`,
      roomAudit: `${prefix}/stock/room-audit`,
      lowStock: `${prefix}/stock/low-stock`,
      vendors: `${prefix}/stock/vendors`,
      purchaseOrder: `${prefix}/stock/purchase-order`,
    },
    staff: {
      registration: `${prefix}/staff/registration`,
      shifts: `${prefix}/staff/shifts`,
      attendance: `${prefix}/staff/attendance`,
      performance: `${prefix}/staff/performance`,
    },
    health: {
      emergencyLog: `${prefix}/health/emergency-log`,
      sickDiet: `${prefix}/health/sick-diet`,
      firstAid: `${prefix}/health/first-aid`,
      messMenu: `${prefix}/health/mess-menu`,
      mealAttendance: `${prefix}/health/meal-attendance`,
      messFeedback: `${prefix}/health/mess-feedback`,
    },
    reports: {
      adminDashboard: `${prefix}/reports/admin-dashboard`,
      studentDashboard: `${prefix}/reports/student-dashboard`,
      wardenDashboard: `${prefix}/reports/warden-dashboard`,
      occupancy: `${prefix}/reports/occupancy`,
      revenue: `${prefix}/reports/revenue`,
      disciplinary: `${prefix}/reports/disciplinary`,
      assetInventory: `${prefix}/reports/asset-inventory`,
      staffPerformance: `${prefix}/reports/staff-performance`,
      incidentAnalysis: `${prefix}/reports/incident-analysis`,
      auditLogs: `${prefix}/reports/audit-logs`,
      settings: `${prefix}/reports/settings`,
    },
  };
};
