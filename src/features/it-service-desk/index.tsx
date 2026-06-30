import { Route, Routes } from 'react-router-dom';
import ServiceDeskPortalPage from './pages/ServiceDeskPortalPage';
import AdminPortalPage from './pages/AdminPortalPage';
import ModuleAdminPortalPage from './pages/ModuleAdminPortalPage';
import AgentPortalPage from './pages/AgentPortalPage';
import EmployeePortalPage from './pages/EmployeePortalPage';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import ModuleAdminDashboard from './pages/dashboard/ModuleAdminDashboard';
import AgentDashboard from './pages/dashboard/AgentDashboard';
import EmployeeDashboard from './pages/dashboard/EmployeeDashboard';
import AdminTicketQueue from './pages/tickets/AdminTicketQueue';
import AdminMyTickets from './pages/tickets/AdminMyTickets';
import AdminAssignedTickets from './pages/tickets/AdminAssignedTickets';
import AdminPendingApproval from './pages/tickets/AdminPendingApproval';
import AdminClosedTickets from './pages/tickets/AdminClosedTickets';
import AdminSpam from './pages/tickets/AdminSpam';
import ModuleAdminTicketQueue from './pages/tickets/ModuleAdminTicketQueue';
import ModuleAdminMyTickets from './pages/tickets/ModuleAdminMyTickets';
import ModuleAdminPendingApproval from './pages/tickets/ModuleAdminPendingApproval';
import ModuleAdminClosedTickets from './pages/tickets/ModuleAdminClosedTickets';
import AgentMyAssignedTickets from './pages/tickets/AgentMyAssignedTickets';
import AgentHighPriority from './pages/tickets/AgentHighPriority';
import AgentPendingReply from './pages/tickets/AgentPendingReply';
import AgentOverdue from './pages/tickets/AgentOverdue';
import EmployeeMyTickets from './pages/tickets/EmployeeMyTickets';
import CreateTicket from './pages/tickets/CreateTicket';
import TicketDetail from './pages/tickets/TicketDetail';
import AdminReports from './pages/reports/AdminReports';
import AdminActivityLogs from './pages/activity-logs/AdminActivityLogs';
import KnowledgeBase from './pages/knowledge-base/KnowledgeBase';
import AdminSettings from './pages/settings/AdminSettings';
import ModuleAdminSettings from './pages/settings/ModuleAdminSettings';

export default function ItServiceDesk() {
  return (
    <Routes>
      <Route index element={<ServiceDeskPortalPage />} />

      {/* Admin Portal */}
      <Route path="admin" element={<AdminPortalPage />} />
      <Route path="admin/dashboard" element={<AdminDashboard />} />
      <Route path="admin/ticket-queue" element={<AdminTicketQueue />} />
      <Route path="admin/my-tickets" element={<AdminMyTickets />} />
      <Route path="admin/assigned-tickets" element={<AdminAssignedTickets />} />
      <Route path="admin/pending-approval" element={<AdminPendingApproval />} />
      <Route path="admin/closed-tickets" element={<AdminClosedTickets />} />
      <Route path="admin/spam" element={<AdminSpam />} />
      <Route path="admin/reports" element={<AdminReports />} />
      <Route path="admin/activity-logs" element={<AdminActivityLogs />} />
      <Route path="admin/settings" element={<AdminSettings />} />

      {/* Module Admin Portal */}
      <Route path="module-admin" element={<ModuleAdminPortalPage />} />
      <Route path="module-admin/dashboard" element={<ModuleAdminDashboard />} />
      <Route
        path="module-admin/ticket-queue"
        element={<ModuleAdminTicketQueue />}
      />
      <Route
        path="module-admin/my-tickets"
        element={<ModuleAdminMyTickets />}
      />
      <Route
        path="module-admin/pending-approval"
        element={<ModuleAdminPendingApproval />}
      />
      <Route
        path="module-admin/closed-tickets"
        element={<ModuleAdminClosedTickets />}
      />
      <Route path="module-admin/settings" element={<ModuleAdminSettings />} />

      {/* Agent Portal */}
      <Route path="agent" element={<AgentPortalPage />} />
      <Route path="agent/dashboard" element={<AgentDashboard />} />
      <Route path="agent/my-assigned" element={<AgentMyAssignedTickets />} />
      <Route path="agent/high-priority" element={<AgentHighPriority />} />
      <Route path="agent/pending-reply" element={<AgentPendingReply />} />
      <Route path="agent/overdue" element={<AgentOverdue />} />

      {/* Employee Portal */}
      <Route path="employee" element={<EmployeePortalPage />} />
      <Route path="employee/dashboard" element={<EmployeeDashboard />} />
      <Route path="employee/my-tickets" element={<EmployeeMyTickets />} />

      {/* Shared Pages */}
      <Route path="create-ticket" element={<CreateTicket />} />
      <Route path="ticket/:id" element={<TicketDetail />} />
      <Route path="knowledge-base" element={<KnowledgeBase />} />
    </Routes>
  );
}
