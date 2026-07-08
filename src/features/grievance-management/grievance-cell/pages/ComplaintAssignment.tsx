import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { complaints } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

const DEPT_OFFICERS = [
  {
    name: 'Dr. Rakesh Verma (Examination Department)',
    value: 'Examination Department|Dr. Rakesh Verma',
  },
  {
    name: 'Mr. Suresh Joshi (Finance Department)',
    value: 'Finance Department|Mr. Suresh Joshi',
  },
  {
    name: 'Maj. R.K. Singh (Hostel Administration)',
    value: 'Hostel Administration|Maj. R.K. Singh',
  },
  {
    name: 'Dr. Kavita Singh (SC/ST Cell)',
    value: 'SC/ST Cell|Dr. Kavita Singh',
  },
  {
    name: 'Dr. Sunita Rao (ICC / Women Cell)',
    value: 'ICC / Women Cell|Dr. Sunita Rao',
  },
];

export default function GrievanceCellComplaintAssignment() {
  const location = useLocation();
  const stateId = location.state?.complaintId;

  const [list, setList] = useState(complaints);
  const [selectedId, setSelectedId] = useState(
    stateId ||
      (complaints.find(c => c.assignedTo === 'Pending Assignment')?.id ?? '')
  );
  const [officerChoice, setOfficerChoice] = useState('');
  const [assignmentNote, setAssignmentNote] = useState('');

  const handleAssign = () => {
    if (!selectedId) {
      ToastService.error('Please select a complaint ticket.');
      return;
    }
    if (!officerChoice) {
      ToastService.error('Please select a nodal officer to assign.');
      return;
    }

    const [dept, officer] = officerChoice.split('|');

    setList(prev =>
      prev.map(c => {
        if (c.id === selectedId) {
          return {
            ...c,
            status: 'Assigned',
            assignedDept: dept,
            assignedTo: officer,
            timeline: [
              ...c.timeline,
              {
                id: `TL${Date.now()}`,
                action: 'Grievance Assigned',
                performedBy: 'Central Grievance Cell',
                role: 'Grievance Admin',
                date: 'Just Now',
                remarks: `Assigned to ${officer} (${dept}). Remarks: ${assignmentNote}`,
                status: 'Assigned',
                done: true,
                active: true,
              },
            ],
          };
        }
        return c;
      })
    );

    ToastService.success(`Ticket successfully assigned to ${officer}`);
    setOfficerChoice('');
    setAssignmentNote('');
  };

  const pendingTickets = list.filter(
    c => c.assignedTo === 'Pending Assignment'
  );

  return (
    <FormPage
      title="Petition Assignment Control Desk"
      description="Route unassigned incoming grievances to respective departmental nodal officers and committees."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Grievance Cell Portal', to: grvUrls.cell.portal },
        { label: 'Assignment' },
      ]}
    >
      <div
        className="grv-bottom-row"
        style={{ gridTemplateColumns: '1.5fr 1fr' }}
      >
        {/* Left Form */}
        <FormCard title="Routing Assignment Form" icon="assignment_ind">
          <FormGrid columns={1}>
            <DropDownList
              label="Select Petition Ticket for Assignment"
              data={list.map(c => ({
                name: `${c.ticketNo} — ${c.subject.substring(0, 50)}... (${c.assignedTo})`,
                value: c.id,
              }))}
              textField="name"
              optionValue="value"
              value={selectedId}
              onChange={val => setSelectedId(String(val ?? ''))}
              required
            />

            <div className="mt-2">
              <DropDownList
                label="Assign to Nodal Officer / Department Cell"
                data={DEPT_OFFICERS}
                textField="name"
                optionValue="value"
                value={officerChoice}
                onChange={val => setOfficerChoice(String(val ?? ''))}
                required
              />
            </div>

            <div className="mt-2">
              <TextArea
                label="Assignment Nodal Directions / Action Note"
                placeholder="Specify any internal directives or instructions regarding resolving this ticket..."
                value={assignmentNote}
                onChange={setAssignmentNote}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-4">
              <Button
                label="Confirm Assignment Route"
                icon="send"
                variant="primary"
                onClick={handleAssign}
              />
            </div>
          </FormGrid>
        </FormCard>

        {/* Right Info Queue */}
        <div className="space-y-4">
          <FormCard title="Pending Queue List" icon="hourglass_empty">
            {pendingTickets.length === 0 ? (
              <p className="text-xs text-slate-400">
                All registered grievances have been successfully routed.
              </p>
            ) : (
              <div className="space-y-2">
                {pendingTickets.map(c => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={`p-3 border rounded-lg text-xs cursor-pointer transition-all ${
                      selectedId === c.id
                        ? 'border-amber-500 bg-amber-50/50'
                        : 'border-slate-200 hover:border-slate-400 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono font-bold text-blue-600">
                        {c.ticketNo}
                      </span>
                      <span
                        className={`grv-status-pill ${c.priority.toLowerCase()}`}
                      >
                        {c.priority}
                      </span>
                    </div>
                    <p className="font-bold text-slate-700 leading-normal">
                      {c.subject}
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Category: {c.category}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
