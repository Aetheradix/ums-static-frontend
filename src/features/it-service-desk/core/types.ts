export const TicketStatus = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  OPEN: 'Open',
  ASSIGNED: 'Assigned',
  ACCEPTED: 'Accepted',
  IN_PROGRESS: 'In Progress',
  WAITING_FOR_USER: 'Waiting for User',
  PENDING: 'Pending',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
  REOPENED: 'Reopened',
  ESCALATED: 'Escalated',
} as const;

export type TicketStatus = (typeof TicketStatus)[keyof typeof TicketStatus];

export const TicketPriority = {
  CRITICAL: 'Critical',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
} as const;

export type TicketPriority =
  (typeof TicketPriority)[keyof typeof TicketPriority];

export interface SLARule {
  priority: TicketPriority;
  resolutionHours: number;
  responseHours: number;
  color: string;
}

export interface TicketTimelineEvent {
  id: string;
  ticketCode: string;
  type:
    | 'created'
    | 'assigned'
    | 'accepted'
    | 'status-change'
    | 'comment'
    | 'note'
    | 'email'
    | 'escalated'
    | 'resolved'
    | 'closed'
    | 'reopened'
    | 'attachment';
  timestamp: string;
  actor: string;
  description: string;
  oldStatus?: TicketStatus;
  newStatus?: TicketStatus;
}

export interface TicketComment {
  id: string;
  ticketCode: string;
  author: string;
  authorRole: string;
  text: string;
  timestamp: string;
  isInternal: boolean;
}

export interface TicketAttachment {
  id: string;
  fileName: string;
  fileSize: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface TicketFormData {
  module: string;
  service: string;
  subService: string;
  title: string;
  description: string;
  priority: TicketPriority;
  category: string;
  impact: 'Low' | 'Medium' | 'High';
  urgency: 'Low' | 'Medium' | 'High';
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  requesterDepartment: string;
  assetTag: string;
  campusBlock: string;
  dynamicFields: Record<string, string>;
}

export interface Ticket {
  code: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  module: string;
  service: string;
  subService: string;
  category: string;
  impact: 'Low' | 'Medium' | 'High';
  urgency: 'Low' | 'Medium' | 'High';
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  requesterDepartment: string;
  assignedAgent: string;
  assignedTeam: string;
  assignedDepartment: string;
  createdDate: string;
  dueDate: string;
  closedDate?: string;
  slaDeadline: string;
  slaViolated: boolean;
  resolutionTime?: string;
  attachments: TicketAttachment[];
  comments: TicketComment[];
  timeline: TicketTimelineEvent[];
  isSpam: boolean;
  reopenCount: number;
  assetTag?: string;
}

export interface ServiceCategory {
  name: string;
  icon: string;
  services: ServiceItem[];
}

export interface ServiceItem {
  name: string;
  subServices: string[];
  dynamicFields?: DynamicField[];
}

export interface DynamicField {
  name: string;
  label: string;
  type: 'text' | 'select' | 'textarea';
  required: boolean;
  options?: string[];
}

export interface KBArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  tags: string[];
  views: number;
  rating: number;
  author: string;
  createdDate: string;
  updatedDate: string;
}

export interface KBComment {
  id: string;
  articleId: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface AgentWorkload {
  agentName: string;
  assigned: number;
  inProgress: number;
  resolved: number;
  overdue: number;
}

export interface SettingsData {
  general: {
    moduleName: string;
    defaultPriority: TicketPriority;
    autoAssign: boolean;
    allowGuestTickets: boolean;
    maxAttachments: number;
  };
  slaRules: SLARule[];
  emailTemplates: EmailTemplate[];
  autoAssignment: {
    enabled: boolean;
    method: 'round-robin' | 'least-loaded' | 'skill-based';
  };
  notificationSettings: {
    emailNotifications: boolean;
    inAppNotifications: boolean;
    dailyDigest: boolean;
  };
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  event: string;
}
