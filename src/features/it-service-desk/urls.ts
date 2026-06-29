export const ITSM_BASE = 'it-service-desk';

export const itsmUrls = {
  portal: `/${ITSM_BASE}`,
  admin: {
    portal: `/${ITSM_BASE}/admin`,
    dashboard: `/${ITSM_BASE}/admin/dashboard`,
    ticketQueue: `/${ITSM_BASE}/admin/ticket-queue`,
    myTickets: `/${ITSM_BASE}/admin/my-tickets`,
    assignedTickets: `/${ITSM_BASE}/admin/assigned-tickets`,
    pendingApproval: `/${ITSM_BASE}/admin/pending-approval`,
    closedTickets: `/${ITSM_BASE}/admin/closed-tickets`,
    spam: `/${ITSM_BASE}/admin/spam`,
    reports: `/${ITSM_BASE}/admin/reports`,
    activityLogs: `/${ITSM_BASE}/admin/activity-logs`,
    settings: `/${ITSM_BASE}/admin/settings`,
  },
  moduleAdmin: {
    portal: `/${ITSM_BASE}/module-admin`,
    dashboard: `/${ITSM_BASE}/module-admin/dashboard`,
    ticketQueue: `/${ITSM_BASE}/module-admin/ticket-queue`,
    myTickets: `/${ITSM_BASE}/module-admin/my-tickets`,
    pendingApproval: `/${ITSM_BASE}/module-admin/pending-approval`,
    closedTickets: `/${ITSM_BASE}/module-admin/closed-tickets`,
    settings: `/${ITSM_BASE}/module-admin/settings`,
  },
  agent: {
    portal: `/${ITSM_BASE}/agent`,
    dashboard: `/${ITSM_BASE}/agent/dashboard`,
    myAssigned: `/${ITSM_BASE}/agent/my-assigned`,
    highPriority: `/${ITSM_BASE}/agent/high-priority`,
    pendingReply: `/${ITSM_BASE}/agent/pending-reply`,
    overdue: `/${ITSM_BASE}/agent/overdue`,
  },
  employee: {
    portal: `/${ITSM_BASE}/employee`,
    dashboard: `/${ITSM_BASE}/employee/dashboard`,
    myTickets: `/${ITSM_BASE}/employee/my-tickets`,
  },
  createTicket: `/${ITSM_BASE}/create-ticket`,
  ticketDetail: (id: string) => `/${ITSM_BASE}/ticket/${id}`,
  knowledgeBase: `/${ITSM_BASE}/knowledge-base`,
};
