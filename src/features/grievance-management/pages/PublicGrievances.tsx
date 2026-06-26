import { useState } from 'react';
import { useGrievance } from '../context';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  FormPopup,
} from 'shared/new-components';
import {
  TextBox,
  DropDownList,
  TextArea,
  Checkbox,
  DatePicker,
} from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { Dropdown } from 'primereact/dropdown';
import type { Grievance } from '../data';
import { SIMULATED_ROLES } from '../data';

const LEVEL_OPTIONS = [
  { id: 'Routine', text: 'Routine' },
  { id: 'Mild', text: 'Mild' },
  { id: 'Severe', text: 'Severe' },
];

const PRIORITY_OPTIONS = [
  { id: 'High', text: 'High' },
  { id: 'Medium', text: 'Medium' },
  { id: 'Low', text: 'Low' },
];

const BLANK_PUBLIC_GRIEVANCE = {
  name: '',
  contactNo: '',
  email: '',
  address: '',
  level: 'Routine' as 'Routine' | 'Mild' | 'Severe',
  priority: 'Medium' as 'High' | 'Medium' | 'Low',
  date: '',
  description: '',
  solution: '',
  upload: '',
  declaration: false,
};

const MEETING_TYPE_OPTIONS = [
  { id: 'Hearing', text: 'Hearing' },
  { id: 'Committee Review', text: 'Committee Review' },
  { id: 'Internal Discussion', text: 'Internal Discussion' },
];

export default function PublicGrievances() {
  const {
    grievances,
    addGrievance,
    updateGrievance,
    meetings,
    addMeeting,
    addMeetingMinutes,
    addResolution,
    activeRole,
    setActiveRole,
    triggerNotification,
  } = useGrievance();

  const [activeTab, setActiveTab] = useState<'form' | 'admin'>('form');
  const [form, setForm] = useState({ ...BLANK_PUBLIC_GRIEVANCE });
  const [activeGrievance, setActiveGrievance] = useState<Grievance | null>(
    null
  );

  // Modals & Popups for admin actions
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddMeetingOpen, setIsAddMeetingOpen] = useState(false);
  const [isAddMinutesOpen, setIsAddMinutesOpen] = useState(false);

  // Admin resolution action states
  const [resText, setResText] = useState('');
  const [resDate, setResDate] = useState('');
  const [resStatus, setResStatus] = useState<'Resolved' | 'Pending'>('Pending');

  // Admin meeting scheduler states
  const [meetType, setMeetType] = useState('Hearing');
  const [meetAgenda, setMeetAgenda] = useState('');
  const [meetTime, setMeetTime] = useState('');
  const [meetVenue, setMeetVenue] = useState('');

  const [minutesTargetId, setMinutesTargetId] = useState<string | null>(null);
  const [minutesText, setMinutesText] = useState('');
  const [minutesDoc, setMinutesDoc] = useState('');

  const isAdmin =
    activeRole === 'grievance_admin_staff' ||
    activeRole === 'grievance_admin_student';

  const handlePublicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.description.trim()) {
      triggerNotification(
        'Please fill in Name, Email, and Description.',
        'error'
      );
      return;
    }
    if (!form.declaration) {
      triggerNotification(
        'You must accept the declaration to submit a grievance.',
        'error'
      );
      return;
    }

    if (
      confirm(
        'Are you sure you want to submit this public grievance? Once submitted, it cannot be updated.'
      )
    ) {
      addGrievance({
        memberType: 'Public',
        member: form.name,
        email: form.email,
        contactNo: form.contactNo,
        address: form.address,
        category: 'Campus Access & Safety', // default public category
        level: form.level,
        priority: form.priority,
        description: form.description,
        proposedSolution: form.solution,
        wantUpload: form.upload ? 'Yes' : 'No',
        document: form.upload,
        declaration: form.declaration,
      });

      setForm({ ...BLANK_PUBLIC_GRIEVANCE });
    }
  };

  const handleRowClick = (item: Grievance) => {
    let currentGrievance = item;
    // Auto status change from Reported to Pending if viewed by admin
    if (isAdmin && item.status === 'Reported') {
      updateGrievance(item.id, { status: 'Pending' });
      currentGrievance = { ...item, status: 'Pending' };
      triggerNotification(`Grievance ${item.id} status changed to Pending.`);
    }

    setActiveGrievance(currentGrievance);
    setResText(currentGrievance.resolution || '');
    setResDate(currentGrievance.resolutionDate || '');
    setResStatus(
      currentGrievance.status === 'Resolved' ? 'Resolved' : 'Pending'
    );
    setIsDetailOpen(true);
  };

  const submitResolution = () => {
    if (!activeGrievance) return;
    addResolution(activeGrievance.id, resText, resDate, resStatus);
    setActiveGrievance(prev =>
      prev
        ? {
            ...prev,
            resolution: resText,
            resolutionDate: resDate,
            status: resStatus,
          }
        : null
    );
  };

  const handleCreateMeeting = () => {
    if (!activeGrievance || !meetAgenda || !meetTime || !meetVenue) {
      triggerNotification('Please enter Agenda, Date, and Venue.', 'error');
      return;
    }
    addMeeting({
      grievanceId: activeGrievance.id,
      meetingType: meetType,
      agenda: meetAgenda,
      meetingTime: meetTime,
      venue: meetVenue,
      guests: [],
    });
    setMeetAgenda('');
    setMeetTime('');
    setMeetVenue('');
    setIsAddMeetingOpen(false);
  };

  const handleSaveMinutes = () => {
    if (!minutesTargetId || !minutesText.trim()) return;
    addMeetingMinutes(minutesTargetId, minutesText, minutesDoc);
    setIsAddMinutesOpen(false);
    setMinutesText('');
    setMinutesDoc('');
    setMinutesTargetId(null);
  };

  const headerAction = (
    <div className="flex items-center gap-3 bg-white p-2 rounded shadow-sm border border-slate-200">
      <span className="text-xs font-bold text-slate-600 pl-2">
        Act As Role:
      </span>
      <Dropdown
        value={activeRole}
        options={SIMULATED_ROLES}
        optionLabel="text"
        optionValue="id"
        onChange={e => {
          setActiveRole(e.value);
          triggerNotification(
            `Switched role simulation to: ${SIMULATED_ROLES.find(r => r.id === e.value)?.text}`
          );
        }}
        className="p-inputtext-sm text-sm"
      />
    </div>
  );

  const publicGrievances = grievances.filter(g => g.memberType === 'Public');

  return (
    <FormPage
      title="Public Grievance Redressal"
      description="Public submission portal simulator and admin redressing desk for general community complaints"
      breadcrumbs={[
        {
          label: 'Grievance Management',
          to: '/grievance-management/dashboard',
        },
        { label: 'Public Grievance' },
      ]}
      headerAction={headerAction}
    >
      {/* ── Tabs selector ── */}
      <div className="flex border-b border-slate-200 mb-6 gap-2">
        <button
          type="button"
          className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'form'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
          onClick={() => setActiveTab('form')}
        >
          <i className="pi pi-globe" /> Public submission Simulator
        </button>
        <button
          type="button"
          className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'admin'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
          onClick={() => {
            if (!isAdmin) {
              triggerNotification(
                'Access restricted to Grievance Admins only.',
                'error'
              );
              return;
            }
            setActiveTab('admin');
          }}
        >
          <i className="pi pi-shield" /> Admin Redressal Desk
        </button>
      </div>

      {activeTab === 'form' && (
        <FormGrid columns={1}>
          <div className="max-w-4xl mx-auto w-full">
            <FormCard title="Public Grievance Submission Portal" icon="send">
              <p className="text-sm text-slate-500 mb-4 bg-slate-50 p-3 border rounded">
                This public form allows any community member (visitors, local
                residents, or external stakeholders) to report concerns directly
                to the university administration without requiring log in
                credentials.
              </p>
              <form onSubmit={handlePublicSubmit}>
                <FormGrid columns={2}>
                  <TextBox
                    label="Full Name *"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={v => setForm(p => ({ ...p, name: v }))}
                    required
                  />
                  <TextBox
                    label="Contact Number *"
                    placeholder="10-digit mobile number"
                    value={form.contactNo}
                    onChange={v => setForm(p => ({ ...p, contactNo: v }))}
                    required
                  />
                  <TextBox
                    label="Email ID *"
                    placeholder="e.g. name@domain.com"
                    value={form.email}
                    onChange={v => setForm(p => ({ ...p, email: v }))}
                    required
                  />
                  <TextBox
                    label="Address"
                    placeholder="Residential address"
                    value={form.address}
                    onChange={v => setForm(p => ({ ...p, address: v }))}
                  />
                  <DropDownList
                    label="Severity Level *"
                    data={LEVEL_OPTIONS}
                    textField="text"
                    valueField="id"
                    value={form.level}
                    onChange={v => setForm(p => ({ ...p, level: v as any }))}
                  />
                  <DropDownList
                    label="Priority level *"
                    data={PRIORITY_OPTIONS}
                    textField="text"
                    valueField="id"
                    value={form.priority}
                    onChange={v => setForm(p => ({ ...p, priority: v as any }))}
                  />
                  <DatePicker
                    label="Complaint Date *"
                    value={form.date ? new Date(form.date) : undefined}
                    onChange={v =>
                      setForm(p => ({
                        ...p,
                        date: v ? v.toISOString().split('T')[0] : '',
                      }))
                    }
                  />
                  <TextBox
                    label="Upload Supporting Document (Optional)"
                    placeholder="e.g. proof_photo.jpg"
                    value={form.upload}
                    onChange={v => setForm(p => ({ ...p, upload: v }))}
                  />
                </FormGrid>

                <div className="mt-3">
                  <TextArea
                    label="Grievance Details Description *"
                    placeholder="Explain the complaint clearly..."
                    value={form.description}
                    onChange={v => setForm(p => ({ ...p, description: v }))}
                    rows={3}
                    required
                  />
                </div>
                <div className="mt-3">
                  <TextArea
                    label="Suggested Resolution / Action"
                    placeholder="What action do you expect from the university?"
                    value={form.solution}
                    onChange={v => setForm(p => ({ ...p, solution: v }))}
                    rows={2}
                  />
                </div>

                <div className="mt-3 bg-slate-50 p-3 border border-slate-200 rounded">
                  <Checkbox
                    label="I declare that the information provided above is true and correct to the best of my knowledge."
                    checked={form.declaration}
                    onChange={checked =>
                      setForm(p => ({ ...p, declaration: checked }))
                    }
                  />
                </div>

                <div className="form-actions-row mt-4">
                  <Button
                    label="Submit Public Grievance"
                    icon="send"
                    variant="primary"
                    type="submit"
                  />
                  <Button
                    label="Reset Form"
                    variant="outlined"
                    onClick={() => setForm({ ...BLANK_PUBLIC_GRIEVANCE })}
                  />
                </div>
              </form>
            </FormCard>
          </div>
        </FormGrid>
      )}

      {activeTab === 'admin' && (
        <FormGrid columns={1}>
          <FormCard title="Registered Public Complaints" icon="shield">
            <GridPanel
              data={publicGrievances}
              columns={[
                { field: 'id', header: 'Grievance ID', width: '100px' },
                { field: 'member', header: 'Public Complainant' },
                { field: 'email', header: 'Email ID' },
                {
                  field: 'level',
                  header: 'Level',
                  cell: (item: Grievance) => (
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${
                        item.level === 'Severe'
                          ? 'bg-red-100 text-red-700'
                          : item.level === 'Mild'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {item.level}
                    </span>
                  ),
                },
                {
                  field: 'priority',
                  header: 'Priority',
                  cell: (item: Grievance) => (
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${
                        item.priority === 'High'
                          ? 'bg-rose-100 text-rose-700'
                          : item.priority === 'Medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-sky-100 text-sky-700'
                      }`}
                    >
                      {item.priority}
                    </span>
                  ),
                },
                {
                  field: 'status',
                  header: 'Status',
                  cell: (item: Grievance) => (
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${
                        item.status === 'Reported'
                          ? 'bg-amber-100 text-amber-700'
                          : item.status === 'Pending'
                            ? 'bg-orange-100 text-orange-700'
                            : item.status === 'Resolved'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.status}
                    </span>
                  ),
                },
                { field: 'reportedDate', header: 'Submitted Date' },
                {
                  header: 'Action',
                  sortable: false,
                  cell: (item: Grievance) => (
                    <Button
                      label="Process Ticket"
                      icon="folder-open"
                      variant="outlined"
                      size="small"
                      onClick={() => handleRowClick(item)}
                    />
                  ),
                },
              ]}
              searchBox
            />
          </FormCard>
        </FormGrid>
      )}

      {/* ── Admin Grievance processing detail popup ── */}
      <FormPopup
        visible={isDetailOpen}
        onHide={() => setIsDetailOpen(false)}
        title={`Action on Public Grievance - ${activeGrievance?.id}`}
        subtitle={`Submitted by: ${activeGrievance?.member} (${activeGrievance?.email})`}
        size="xl"
      >
        {activeGrievance && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm">
            {/* Left Info Column */}
            <div className="space-y-3 bg-slate-50 p-4 border border-slate-200 rounded">
              <h4 className="font-bold text-gray-800 border-b pb-2">
                Ticket Specifications
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold text-gray-500">
                  Contact Number:
                </span>
                <span className="font-medium text-gray-900">
                  {activeGrievance.contactNo || 'N/A'}
                </span>

                <span className="font-semibold text-gray-500">Address:</span>
                <span className="font-medium text-gray-900">
                  {activeGrievance.address || 'N/A'}
                </span>

                <span className="font-semibold text-gray-500">
                  Grievance Level:
                </span>
                <span className="font-semibold text-orange-600">
                  {activeGrievance.level}
                </span>

                <span className="font-semibold text-gray-500">Priority:</span>
                <span className="font-semibold text-rose-600">
                  {activeGrievance.priority}
                </span>

                <span className="font-semibold text-gray-500">Attachment:</span>
                <span className="font-semibold text-indigo-600 underline">
                  {activeGrievance.document || 'None'}
                </span>
              </div>
              <div className="mt-3">
                <span className="font-semibold text-gray-500 block">
                  Description:
                </span>
                <p className="mt-1 bg-white p-2.5 border rounded text-gray-700">
                  {activeGrievance.description}
                </p>
              </div>
              <div className="mt-3">
                <span className="font-semibold text-gray-500 block">
                  Proposed Solution:
                </span>
                <p className="mt-1 bg-white p-2.5 border rounded text-gray-700">
                  {activeGrievance.proposedSolution || 'N/A'}
                </p>
              </div>

              {/* Scheduled Meetings list */}
              <div className="mt-4 pt-3 border-t">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-800">
                    Associated Meetings
                  </span>
                  <Button
                    label="Schedule Review"
                    icon="calendar"
                    size="small"
                    onClick={() => setIsAddMeetingOpen(true)}
                  />
                </div>
                {meetings.filter(m => m.grievanceId === activeGrievance.id)
                  .length > 0 ? (
                  meetings
                    .filter(m => m.grievanceId === activeGrievance.id)
                    .map(m => (
                      <div
                        key={m.id}
                        className="bg-white p-2 rounded border mb-2 flex justify-between items-center text-xs"
                      >
                        <div>
                          <p className="font-bold text-gray-800">
                            {m.meetingType} ({m.id})
                          </p>
                          <p className="text-gray-500">
                            {m.meetingTime} @ {m.venue}
                          </p>
                        </div>
                        {m.status === 'Scheduled' && (
                          <Button
                            label="Add Minutes"
                            icon="check"
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              setMinutesTargetId(m.id);
                              setIsAddMinutesOpen(true);
                            }}
                          />
                        )}
                      </div>
                    ))
                ) : (
                  <span className="text-gray-400 italic text-xs">
                    No meetings scheduled.
                  </span>
                )}
              </div>
            </div>

            {/* Right Action Column */}
            <div className="space-y-4 bg-slate-50 p-4 border border-slate-200 rounded">
              <h4 className="font-bold text-gray-800 border-b pb-2">
                Resolution Audit
              </h4>
              <TextArea
                label="Action Description / Administrative Solution *"
                placeholder="Document resolution actions..."
                value={resText}
                onChange={resText => setResText(resText)}
                rows={4}
              />
              <FormGrid columns={2}>
                <DatePicker
                  label="Resolved Date *"
                  value={resDate ? new Date(resDate) : undefined}
                  onChange={v =>
                    setResDate(v ? v.toISOString().split('T')[0] : '')
                  }
                />
                <DropDownList
                  label="Status *"
                  data={[
                    { id: 'Resolved', text: 'Resolved' },
                    { id: 'Pending', text: 'Pending' },
                  ]}
                  textField="text"
                  valueField="id"
                  value={resStatus}
                  onChange={v => setResStatus(v as any)}
                />
              </FormGrid>
              <div className="flex justify-end pt-3">
                <Button
                  label="Save Redressal"
                  icon="check"
                  variant="success"
                  onClick={submitResolution}
                />
              </div>
            </div>
          </div>
        )}
      </FormPopup>

      {/* Scheduler Modal */}
      <FormPopup
        visible={isAddMeetingOpen}
        onHide={() => setIsAddMeetingOpen(false)}
        title="Schedule Public Grievance Meeting"
      >
        <div className="space-y-4">
          <FormGrid columns={2}>
            <DropDownList
              label="Meeting Type *"
              data={MEETING_TYPE_OPTIONS}
              textField="text"
              valueField="id"
              value={meetType}
              onChange={v => setMeetType(v as string)}
            />
            <TextBox
              label="Time *"
              type="datetime-local"
              value={meetTime}
              onChange={setMeetTime}
            />
          </FormGrid>
          <TextBox
            label="Venue *"
            placeholder="Senate Hall / Zoom"
            value={meetVenue}
            onChange={setMeetVenue}
          />
          <TextArea
            label="Agenda *"
            placeholder="Define agenda..."
            value={meetAgenda}
            onChange={setMeetAgenda}
            rows={2}
          />
          <div className="flex justify-end gap-3 pt-3">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setIsAddMeetingOpen(false)}
            />
            <Button
              label="Schedule"
              icon="calendar"
              variant="primary"
              onClick={handleCreateMeeting}
            />
          </div>
        </div>
      </FormPopup>

      {/* Add Minutes Modal */}
      <FormPopup
        visible={isAddMinutesOpen}
        onHide={() => setIsAddMinutesOpen(false)}
        title="Add Meeting Minutes"
      >
        <div className="space-y-4">
          <TextArea
            label="Minutes Details *"
            placeholder="Enter minutes details..."
            value={minutesText}
            onChange={setMinutesText}
            rows={3}
          />
          <TextBox
            label="Minutes Document"
            placeholder="minutes_signed.pdf"
            value={minutesDoc}
            onChange={setMinutesDoc}
          />
          <div className="flex justify-end gap-3 pt-3">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setIsAddMinutesOpen(false)}
            />
            <Button
              label="Save Minutes"
              variant="success"
              onClick={handleSaveMinutes}
            />
          </div>
        </div>
      </FormPopup>
    </FormPage>
  );
}
