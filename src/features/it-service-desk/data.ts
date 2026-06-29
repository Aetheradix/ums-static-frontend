export {
  UserRole,
  RoleLabel,
  rolePermissions,
  mockCurrentUser,
  mockUsers,
  getUserById,
  getUserByName,
} from './core/roles';
export type { ITSMUser } from './core/roles';
export { TicketStatus, TicketPriority } from './core/types';
export type {
  Ticket,
  KBArticle,
  KBComment,
  TicketComment,
  TicketTimelineEvent,
  TicketAttachment,
  TicketFormData,
  ServiceCategory,
  ServiceItem,
  DynamicField,
  AgentWorkload,
  SettingsData,
  EmailTemplate,
  SLARule,
} from './core/types';
export {
  initialTickets,
  initialKBArticles,
  initialKBComments,
  serviceCategories,
  initialAgentWorkloads,
  initialSlaRules,
  initialSettings,
} from './core/mockData';
