import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage, FormPopup } from 'shared/new-components';
import {
  KpiCard,
  PriorityBadge,
  ReplyBox,
  TicketStatusBadge,
  TicketTable,
  Timeline,
} from '../../components';
import { initialTickets, mockCurrentUser, TicketStatus } from '../../data';
import { itsmUrls } from '../../urls';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ticket = useMemo(() => initialTickets.find(t => t.code === id), [id]);
  const [showAssign, setShowAssign] = useState(false);
  const [showResolve, setShowResolve] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [noteText, setNoteText] = useState('');

  if (!ticket) {
    return (
      <FormPage
        title="Ticket Not Found"
        description="The requested ticket could not be found."
        breadcrumbs={[
          { label: 'Home', to: '/home' },
          { label: 'IT Service Desk', to: itsmUrls.portal },
          { label: 'Not Found' },
        ]}
      >
        <p className="text-gray-500">Ticket with code "{id}" does not exist.</p>
      </FormPage>
    );
  }

  const isAdmin = mockCurrentUser?.role === 'service-desk-admin';
  const isAgent = mockCurrentUser?.role === 'agent';
  const isEmployee = mockCurrentUser?.role === 'employee';
  const canAssign =
    isAdmin || (isAgent && ticket.status === TicketStatus.ASSIGNED);
  const canResolve =
    isAgent &&
    (ticket.status === TicketStatus.IN_PROGRESS ||
      ticket.status === TicketStatus.ACCEPTED);
  const canReply = isAgent || isEmployee;
  const canAddNote = isAdmin || isAgent;

  const relatedTickets = useMemo(
    () =>
      initialTickets
        .filter(
          t => t.requesterId === ticket.requesterId && t.code !== ticket.code
        )
        .slice(0, 5),
    [ticket]
  );

  const handleResolve = () => {
    ToastService.success(`Ticket ${ticket.code} marked as resolved.`);
    setShowResolve(false);
  };

  const handleAssign = () => {
    ToastService.success(`Ticket ${ticket.code} assigned successfully.`);
    setShowAssign(false);
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    ToastService.success('Reply added.');
    setReplyText('');
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    ToastService.success('Internal note added.');
    setNoteText('');
  };

  const slaColorFinal =
    ticket.priority === 'Critical'
      ? 'text-red-600'
      : ticket.priority === 'High'
        ? 'text-orange-600'
        : ticket.priority === 'Medium'
          ? 'text-amber-600'
          : 'text-green-600';

  return (
    <FormPage
      title={`Ticket ${ticket.code}`}
      description={ticket.title}
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'IT Service Desk', to: itsmUrls.portal },
        { label: ticket.code },
      ]}
      headerAction={
        <div className="flex gap-2">
          {canAssign && (
            <Button
              label="Assign"
              variant="primary"
              icon="assignment_ind"
              onClick={() => setShowAssign(true)}
            />
          )}
          {canResolve && (
            <Button
              label="Resolve"
              variant="success"
              icon="check_circle"
              onClick={() => setShowResolve(true)}
            />
          )}
          <Button
            label="Back"
            variant="outlined"
            icon="arrow_back"
            onClick={() => navigate(-1)}
          />
        </div>
      }
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Status" value="" color="blue" icon="info">
          <TicketStatusBadge status={ticket.status} />
        </KpiCard>
        <KpiCard
          label="Priority"
          value=""
          color={
            ticket.priority === 'Critical'
              ? 'red'
              : ticket.priority === 'High'
                ? 'orange'
                : ticket.priority === 'Medium'
                  ? 'amber'
                  : 'green'
          }
          icon="priority_high"
        >
          <PriorityBadge priority={ticket.priority} />
        </KpiCard>
        <KpiCard
          label="SLA Deadline"
          value={ticket.slaDeadline}
          color={ticket.slaViolated ? 'red' : 'green'}
          icon="schedule"
        />
        <KpiCard
          label="Reopened"
          value={String(ticket.reopenCount)}
          color={ticket.reopenCount > 0 ? 'amber' : 'teal'}
          icon="refresh"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <FormCard title="Details">
            <FormGrid columns={2}>
              <div>
                <p className="text-xs text-gray-500">Code</p>
                <p className="text-sm font-mono font-medium">{ticket.code}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <TicketStatusBadge status={ticket.status} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Priority</p>
                <PriorityBadge priority={ticket.priority} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Module</p>
                <p className="text-sm font-medium">{ticket.module}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Service</p>
                <p className="text-sm font-medium">{ticket.service}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Sub-Service</p>
                <p className="text-sm font-medium">{ticket.subService}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Impact</p>
                <p className="text-sm font-medium">{ticket.impact}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Urgency</p>
                <p className="text-sm font-medium">{ticket.urgency}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Category</p>
                <p className="text-sm font-medium">{ticket.category}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Department</p>
                <p className="text-sm font-medium">
                  {ticket.requesterDepartment}
                </p>
              </div>
            </FormGrid>
            <div className="mt-4">
              <p className="text-xs text-gray-500">Description</p>
              <p className="text-sm text-gray-800 mt-1 whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>
          </FormCard>

          <FormCard title="Conversation">
            <ReplyBox comments={ticket.comments} />
            {canReply && (
              <div className="mt-4 border-t border-gray-100 pt-4">
                <TextArea
                  value={replyText}
                  onChange={(v: string) => setReplyText(v)}
                  rows={3}
                  placeholder="Type your reply..."
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    label="Send Reply"
                    variant="primary"
                    icon="send"
                    disabled={!replyText.trim()}
                    onClick={handleReply}
                  />
                  {canAddNote && (
                    <Button
                      label="Add Internal Note"
                      variant="outlined"
                      icon="lock"
                      onClick={handleAddNote}
                    />
                  )}
                </div>
              </div>
            )}
            {canAddNote && (
              <div className="mt-4 border-t border-gray-100 pt-4">
                <p className="text-xs font-bold text-purple-700 mb-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    lock
                  </span>{' '}
                  Internal Note (not visible to requester)
                </p>
                <TextArea
                  value={noteText}
                  onChange={(v: string) => setNoteText(v)}
                  rows={2}
                  placeholder="Add an internal note..."
                />
                <Button
                  label="Save Note"
                  variant="outlined"
                  className="mt-2"
                  disabled={!noteText.trim()}
                  onClick={handleAddNote}
                />
              </div>
            )}
          </FormCard>

          <FormCard title="Timeline">
            <Timeline events={ticket.timeline} />
          </FormCard>

          {relatedTickets.length > 0 && (
            <FormCard title="Requester's Other Tickets">
              <TicketTable data={relatedTickets} searchBox={false} />
            </FormCard>
          )}
        </div>

        <div className="space-y-6">
          <FormCard title="Assignment">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Requester</p>
                <p className="text-sm font-medium">{ticket.requesterName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm">{ticket.requesterEmail}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Assigned Agent</p>
                <p className="text-sm font-medium">{ticket.assignedAgent}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Department</p>
                <p className="text-sm">{ticket.assignedDepartment}</p>
              </div>
            </div>
          </FormCard>

          <FormCard title="SLA Information">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Created</p>
                <p className="text-sm">{ticket.createdDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Due By</p>
                <p className={`text-sm font-bold ${slaColorFinal}`}>
                  {ticket.slaDeadline}
                </p>
              </div>
              {ticket.closedDate && (
                <div>
                  <p className="text-xs text-gray-500">Closed</p>
                  <p className="text-sm">{ticket.closedDate}</p>
                </div>
              )}
              {ticket.resolutionTime && (
                <div>
                  <p className="text-xs text-gray-500">Resolution Time</p>
                  <p className="text-sm font-medium">{ticket.resolutionTime}</p>
                </div>
              )}
              {ticket.slaViolated && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-600 text-sm">
                    warning
                  </span>
                  <span className="text-xs font-bold text-red-700">
                    SLA Violated
                  </span>
                </div>
              )}
            </div>
          </FormCard>

          {ticket.assetTag && (
            <FormCard title="Asset">
              <div>
                <p className="text-xs text-gray-500">Asset Tag</p>
                <p className="text-sm font-mono font-medium">
                  {ticket.assetTag}
                </p>
              </div>
            </FormCard>
          )}
        </div>
      </div>

      {ticket.attachments.length > 0 && (
        <FormCard title="Attachments" className="mt-6">
          <div className="flex flex-wrap gap-2">
            {ticket.attachments.map(a => (
              <div
                key={a.id}
                className="border border-gray-200 rounded-lg p-2 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-gray-400">
                  attach_file
                </span>
                <span className="text-sm">{a.fileName}</span>
                <span className="text-xs text-gray-400">({a.fileSize})</span>
              </div>
            ))}
          </div>
        </FormCard>
      )}

      <FormPopup
        visible={showAssign}
        onHide={() => setShowAssign(false)}
        title="Assign Ticket"
        subtitle={ticket.code}
        size="lg"
      >
        <FormGrid columns={2}>
          <DropDownList
            label="Department"
            data={[
              { name: 'IT Services' },
              { name: 'Network Operations' },
              { name: 'Hardware Support' },
            ]}
            textField="name"
            valueField="name"
          />
          <DropDownList
            label="Team"
            data={[
              { name: 'Campus Tier 1 Helpdesk' },
              { name: 'Network Operations Center (NOC)' },
              { name: 'High-Performance Computing Group' },
            ]}
            textField="name"
            valueField="name"
          />
          <DropDownList
            label="Agent"
            data={[
              { name: 'Er. Amit Patel' },
              { name: 'Er. Sandeep Kothari' },
              { name: 'Ms. Priya Nair' },
            ]}
            textField="name"
            valueField="name"
          />
          <DropDownList
            label="Priority"
            value={ticket.priority}
            data={[
              { name: 'Low' },
              { name: 'Medium' },
              { name: 'High' },
              { name: 'Critical' },
            ]}
            textField="name"
            valueField="name"
          />
        </FormGrid>
        <div className="flex justify-end gap-3 mt-4">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => setShowAssign(false)}
          />
          <Button label="Assign" variant="primary" onClick={handleAssign} />
        </div>
      </FormPopup>

      <FormPopup
        visible={showResolve}
        onHide={() => setShowResolve(false)}
        title="Resolve Ticket"
        subtitle={ticket.code}
        size="lg"
      >
        <TextArea
          label="Resolution Notes"
          rows={4}
          placeholder="Describe how the issue was resolved..."
        />
        <div className="flex justify-end gap-3 mt-4">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => setShowResolve(false)}
          />
          <Button
            label="Mark Resolved"
            variant="success"
            onClick={handleResolve}
          />
        </div>
      </FormPopup>
    </FormPage>
  );
}
