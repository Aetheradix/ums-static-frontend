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
import type { Grievance, GrievanceMeeting, GrievanceNote } from '../data';
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

const MEMBER_TYPE_OPTIONS = [
  { id: 'Student', text: 'Student' },
  { id: 'Employee', text: 'Employee' },
];

const WANT_UPLOAD_OPTIONS = [
  { id: 'Yes', text: 'Yes' },
  { id: 'No', text: 'No' },
];

const MEETING_TYPE_OPTIONS = [
  { id: 'Hearing', text: 'Hearing' },
  { id: 'Committee Review', text: 'Committee Review' },
  { id: 'Internal Discussion', text: 'Internal Discussion' },
];

const NOTE_STATUS_OPTIONS = [
  { id: 'New', text: 'New' },
  { id: 'Read', text: 'Read' },
  { id: 'Accepted', text: 'Accepted' },
  { id: 'Rejected', text: 'Rejected' },
];

const BLANK_GRIEVANCE = {
  memberType: 'Student' as 'Student' | 'Employee',
  member: '',
  category: '',
  level: 'Routine' as 'Routine' | 'Mild' | 'Severe',
  priority: 'Medium' as 'High' | 'Medium' | 'Low',
  description: '',
  proposedSolution: '',
  wantUpload: 'No' as 'Yes' | 'No',
  document: '',
  declaration: false,
};

export default function Grievances() {
  const {
    grievances,
    addGrievance,
    updateGrievance,
    meetings,
    addMeeting,
    cancelMeeting,
    addMeetingMinutes,
    addResolution,
    addNoteToGrievance,
    actionOnGrievanceNote,
    categories,
    activeRole,
    setActiveRole,
    triggerNotification,
  } = useGrievance();

  const [form, setForm] = useState({ ...BLANK_GRIEVANCE });
  const [activeGrievance, setActiveGrievance] = useState<Grievance | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<
    'info' | 'meetings' | 'notes' | 'print'
  >('info');

  // Modals & form popups
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddMeetingOpen, setIsAddMeetingOpen] = useState(false);
  const [isCancelMeetingOpen, setIsCancelMeetingOpen] = useState(false);
  const [isAddMinutesOpen, setIsAddMinutesOpen] = useState(false);

  // Modal form states
  const [resText, setResText] = useState('');
  const [resDate, setResDate] = useState('');
  const [resStatus, setResStatus] = useState<'Resolved' | 'Pending'>('Pending');

  const [meetType, setMeetType] = useState('Hearing');
  const [meetAgenda, setMeetAgenda] = useState('');
  const [meetTime, setMeetTime] = useState('');
  const [meetVenue, setMeetVenue] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestMobile, setGuestMobile] = useState('');
  const [meetGuests, setMeetGuests] = useState<any[]>([]);

  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const [minutesTargetId, setMinutesTargetId] = useState<string | null>(null);
  const [minutesText, setMinutesText] = useState('');
  const [minutesDoc, setMinutesDoc] = useState('');

  const [newNoteMeetingId, setNewNoteMeetingId] = useState('');
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteVisible, setNewNoteVisible] = useState<'Yes' | 'No'>('Yes');

  const [noteResponseText, setNoteResponseText] = useState<
    Record<string, string>
  >({});
  const [noteResponseStatus, setNoteResponseStatus] = useState<
    Record<string, string>
  >({});

  const isAdmin =
    activeRole === 'grievance_admin_staff' ||
    activeRole === 'grievance_admin_student';
  const categoryDropdown = categories.map(c => ({ id: c.name, text: c.name }));

  const set = <K extends keyof typeof BLANK_GRIEVANCE>(
    key: K,
    value: (typeof BLANK_GRIEVANCE)[K]
  ) => setForm(prev => ({ ...prev, [key]: value }));

  const handleGrievanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category || !form.description.trim()) {
      triggerNotification('Please fill in category and description.', 'error');
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
        'Are you sure you want to submit this grievance? After submission, it cannot be updated.'
      )
    ) {
      const email =
        activeRole === 'student' ? 'student@stu.ac.in' : 'employee@stu.ac.in';
      const complainantName =
        activeRole === 'student'
          ? 'Aniket Sharma (STU2025CS0091)'
          : activeRole === 'employee'
            ? 'Prof. S. K. Roy (EMP-0922)'
            : form.member;

      addGrievance({
        memberType: isAdmin
          ? form.memberType
          : activeRole === 'student'
            ? 'Student'
            : 'Employee',
        member: complainantName,
        email: email,
        category: form.category,
        level: form.level,
        priority: form.priority,
        description: form.description,
        proposedSolution: form.proposedSolution,
        wantUpload: form.wantUpload,
        document: form.document,
        declaration: form.declaration,
      });

      setForm({ ...BLANK_GRIEVANCE });
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
    setActiveTab('info');
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

  const handleAddGuest = () => {
    if (!guestName || !guestEmail) {
      triggerNotification('Guest Name and Email are required.', 'error');
      return;
    }
    setMeetGuests(prev => [
      ...prev,
      { name: guestName, email: guestEmail, mobile: guestMobile },
    ]);
    setGuestName('');
    setGuestEmail('');
    setGuestMobile('');
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
      guests: meetGuests,
    });
    setMeetAgenda('');
    setMeetTime('');
    setMeetVenue('');
    setMeetGuests([]);
    setIsAddMeetingOpen(false);
  };

  const handleCancelMeetingAction = () => {
    if (!cancelTargetId || !cancelReason.trim()) return;
    cancelMeeting(cancelTargetId, cancelReason);
    setIsCancelMeetingOpen(false);
    setCancelReason('');
    setCancelTargetId(null);
  };

  const handleSaveMinutes = () => {
    if (!minutesTargetId || !minutesText.trim()) return;
    addMeetingMinutes(minutesTargetId, minutesText, minutesDoc);
    setIsAddMinutesOpen(false);
    setMinutesText('');
    setMinutesDoc('');
    setMinutesTargetId(null);
  };

  const handleAddNote = () => {
    if (!activeGrievance || !newNoteText.trim()) return;
    addNoteToGrievance(activeGrievance.id, {
      meetingId: newNoteMeetingId || 'General Discussion',
      notes: newNoteText,
      visibleToAll: newNoteVisible,
      author:
        activeRole === 'grievance_admin_staff'
          ? 'Staff Admin'
          : 'Committee Member',
    });
    setNewNoteText('');
    setNewNoteMeetingId('');
    // Refresh active grievance details modal state
    const updated = grievances.find(g => g.id === activeGrievance.id);
    if (updated) {
      setActiveGrievance(updated);
    }
  };

  const handleNoteStatusSubmit = (noteId: string) => {
    if (!activeGrievance) return;
    const response = noteResponseText[noteId] || '';
    const status = (noteResponseStatus[noteId] ||
      'Accepted') as GrievanceNote['responseStatus'];

    actionOnGrievanceNote(activeGrievance.id, noteId, response, status);

    // Refresh modal data
    const updated = grievances.find(g => g.id === activeGrievance.id);
    if (updated) {
      setActiveGrievance(updated);
    }
  };

  const handlePrint = () => {
    triggerNotification('Resolution details sent to system printer.');
    window.print();
  };

  // Filter list by role permissions
  const filteredGrievances = grievances.filter(g => {
    if (activeRole === 'student') return g.memberType === 'Student';
    if (activeRole === 'employee') return g.memberType === 'Employee';
    // Admin staff handles Employee & Public; Admin student handles Student
    if (activeRole === 'grievance_admin_staff')
      return g.memberType === 'Employee' || g.memberType === 'Public';
    if (activeRole === 'grievance_admin_student')
      return g.memberType === 'Student';
    return true;
  });

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
            `Switched role to: ${SIMULATED_ROLES.find(r => r.id === e.value)?.text}`
          );
        }}
        className="p-inputtext-sm text-sm"
      />
    </div>
  );

  return (
    <FormPage
      title="Grievances Management Portal"
      description="Register grievances, track status updates, coordinate resolution committees, and schedule redressal meetings"
      breadcrumbs={[
        {
          label: 'Grievance Management',
          to: '/grievance-management/dashboard',
        },
        { label: 'Grievances' },
      ]}
      headerAction={headerAction}
    >
      <FormGrid columns={1}>
        {/* ── Submit Grievance Section ── */}
        <FormCard title="Register New Grievance" icon="add_box">
          <form onSubmit={handleGrievanceSubmit}>
            <FormGrid columns={3}>
              {isAdmin && (
                <>
                  <DropDownList
                    label="Member Type *"
                    data={MEMBER_TYPE_OPTIONS}
                    textField="text"
                    valueField="id"
                    value={form.memberType}
                    onChange={v => set('memberType', v as any)}
                  />
                  <TextBox
                    label="Member ID & Name *"
                    placeholder="e.g. STU2026ME0043 Meera Deshmukh"
                    value={form.member}
                    onChange={v => set('member', v)}
                    required
                  />
                </>
              )}
              <DropDownList
                label="Grievance Category *"
                data={categoryDropdown}
                textField="text"
                valueField="id"
                value={form.category}
                onChange={v => set('category', v as string)}
              />
              <DropDownList
                label="Severity Level *"
                data={LEVEL_OPTIONS}
                textField="text"
                valueField="id"
                value={form.level}
                onChange={v => set('level', v as any)}
              />
              <DropDownList
                label="Priority level *"
                data={PRIORITY_OPTIONS}
                textField="text"
                valueField="id"
                value={form.priority}
                onChange={v => set('priority', v as any)}
              />
              <DropDownList
                label="Want to Upload Supporting Document?"
                data={WANT_UPLOAD_OPTIONS}
                textField="text"
                valueField="id"
                value={form.wantUpload}
                onChange={v => set('wantUpload', v as any)}
              />
              {form.wantUpload === 'Yes' && (
                <TextBox
                  label="Document File Name"
                  placeholder="e.g. medical_certificate.pdf"
                  value={form.document}
                  onChange={v => set('document', v)}
                />
              )}
            </FormGrid>

            <div className="mt-3">
              <TextArea
                label="Detailed Description of Grievance *"
                placeholder="Describe the issue in detail..."
                value={form.description}
                onChange={v => set('description', v)}
                rows={3}
                required
              />
            </div>
            <div className="mt-3">
              <TextArea
                label="Proposed / Suggested Solution"
                placeholder="Mention any solution you have in mind..."
                value={form.proposedSolution}
                onChange={v => set('proposedSolution', v)}
                rows={2}
              />
            </div>

            <div className="mt-3 bg-slate-50 p-3 border border-slate-200 rounded">
              <Checkbox
                label="I hereby declare that all details filled above are correct and authentic to the best of my knowledge."
                checked={form.declaration}
                onChange={checked => set('declaration', checked)}
              />
            </div>

            <div className="form-actions-row mt-4">
              <Button
                label="Submit Grievance"
                icon="send"
                variant="primary"
                type="submit"
              />
              <Button
                label="Reset Form"
                variant="outlined"
                onClick={() => setForm({ ...BLANK_GRIEVANCE })}
              />
            </div>
          </form>
        </FormCard>

        {/* ── Registered Grievances List ── */}
        <div className="mt-6">
          <FormCard title="Registered Grievances" icon="list">
            <GridPanel
              data={filteredGrievances}
              columns={[
                { field: 'id', header: 'Grievance ID', width: '100px' },
                { field: 'member', header: 'Complainant' },
                { field: 'category', header: 'Category' },
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
                { field: 'reportedDate', header: 'Report Date' },
                {
                  header: 'Action',
                  sortable: false,
                  cell: (item: Grievance) => (
                    <Button
                      label="View/Process"
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
        </div>
      </FormGrid>

      {/* ── Detail dialog / popup ── */}
      <FormPopup
        visible={isDetailOpen}
        onHide={() => setIsDetailOpen(false)}
        title={`Grievance Workflow Hub - ${activeGrievance?.id}`}
        subtitle={`Complainant: ${activeGrievance?.member}`}
        size="xl"
      >
        {activeGrievance && (
          <div>
            {/* Tab selection */}
            <div className="flex border-b border-slate-200 mb-4 gap-2">
              <button
                type="button"
                className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === 'info'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
                onClick={() => setActiveTab('info')}
              >
                Resolution details
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === 'meetings'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
                onClick={() => setActiveTab('meetings')}
              >
                Committee Meetings
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === 'notes'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
                onClick={() => setActiveTab('notes')}
              >
                Notes by Committee ({activeGrievance.notes?.length || 0})
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === 'print'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
                onClick={() => setActiveTab('print')}
              >
                Print Redressal Slip
              </button>
            </div>

            {/* Tab content */}
            <div className="space-y-4">
              {activeTab === 'info' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm">
                  {/* Left Column: Complaint specifications */}
                  <div className="space-y-3 bg-slate-50 p-4 border border-slate-200 rounded">
                    <h4 className="font-bold text-gray-800 border-b pb-2 mb-2">
                      Complaint Details
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-semibold text-gray-500">
                        Category:
                      </span>
                      <span className="font-medium text-gray-900">
                        {activeGrievance.category}
                      </span>

                      <span className="font-semibold text-gray-500">
                        Severity Level:
                      </span>
                      <span className="font-semibold text-orange-600">
                        {activeGrievance.level}
                      </span>

                      <span className="font-semibold text-gray-500">
                        Priority:
                      </span>
                      <span className="font-semibold text-rose-600">
                        {activeGrievance.priority}
                      </span>

                      <span className="font-semibold text-gray-500">
                        Status:
                      </span>
                      <span className="font-bold text-indigo-600">
                        {activeGrievance.status}
                      </span>

                      <span className="font-semibold text-gray-500">
                        Date Reported:
                      </span>
                      <span className="font-medium text-gray-900">
                        {activeGrievance.reportedDate}
                      </span>

                      <span className="font-semibold text-gray-500">
                        Attachment:
                      </span>
                      <span className="font-medium text-indigo-600 underline">
                        {activeGrievance.document || 'None'}
                      </span>
                    </div>

                    <div className="mt-3">
                      <p className="font-semibold text-gray-500">
                        Complainant Description:
                      </p>
                      <p className="mt-1 bg-white p-2.5 border rounded text-gray-700">
                        {activeGrievance.description}
                      </p>
                    </div>

                    <div className="mt-3">
                      <p className="font-semibold text-gray-500">
                        Proposed Solution:
                      </p>
                      <p className="mt-1 bg-white p-2.5 border rounded text-gray-700">
                        {activeGrievance.proposedSolution ||
                          'No suggestion provided.'}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Resolution administration */}
                  <div className="space-y-4 bg-slate-50 p-4 border border-slate-200 rounded">
                    <h4 className="font-bold text-gray-800 border-b pb-2 mb-2">
                      Grievance Resolution
                    </h4>
                    {isAdmin ? (
                      <>
                        <TextArea
                          label="Redressal Solution / Action taken *"
                          placeholder="Provide the detailed resolution..."
                          value={resText}
                          onChange={setResText}
                          rows={4}
                        />
                        <FormGrid columns={2}>
                          <DatePicker
                            label="Resolution Date *"
                            value={resDate ? new Date(resDate) : undefined}
                            onChange={d =>
                              setResDate(d ? d.toISOString().split('T')[0] : '')
                            }
                          />
                          <DropDownList
                            label="Redressal Status *"
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
                            label="Save Resolution"
                            icon="check"
                            variant="success"
                            onClick={submitResolution}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <span className="font-semibold text-gray-500 block">
                            Resolution State
                          </span>
                          <span className="text-emerald-700 font-bold">
                            {activeGrievance.status === 'Resolved'
                              ? 'Resolved'
                              : 'In Review / Pending'}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-500 block">
                            Resolution Date
                          </span>
                          <span>
                            {activeGrievance.resolutionDate ||
                              'Pending resolution'}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-500 block">
                            Resolution Summary
                          </span>
                          <div className="mt-1 bg-white p-3 border rounded text-gray-700">
                            {activeGrievance.resolution ||
                              'No official resolution has been recorded yet.'}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'meetings' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-gray-800">
                      Scheduled Committee Discussions
                    </h4>
                    {isAdmin && (
                      <Button
                        label="Add New Grievance Meeting"
                        icon="plus"
                        variant="primary"
                        onClick={() => setIsAddMeetingOpen(true)}
                      />
                    )}
                  </div>

                  <GridPanel
                    data={meetings.filter(
                      m => m.grievanceId === activeGrievance.id
                    )}
                    columns={[
                      { field: 'id', header: 'Meeting ID', width: '110px' },
                      { field: 'meetingType', header: 'Type' },
                      { field: 'meetingTime', header: 'Time' },
                      { field: 'venue', header: 'Venue' },
                      { field: 'agenda', header: 'Agenda' },
                      {
                        field: 'status',
                        header: 'Status',
                        cell: (item: GrievanceMeeting) => (
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold ${
                              item.status === 'Scheduled'
                                ? 'bg-indigo-100 text-indigo-700'
                                : item.status === 'Conducted'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {item.status}
                          </span>
                        ),
                      },
                      {
                        header: 'Actions',
                        sortable: false,
                        cell: (item: GrievanceMeeting) => {
                          const isSched = item.status === 'Scheduled';
                          return (
                            <div className="flex gap-2">
                              {isSched && isAdmin && (
                                <>
                                  <Button
                                    label="Add Minutes"
                                    icon="check"
                                    variant="outlined"
                                    size="small"
                                    onClick={() => {
                                      setMinutesTargetId(item.id);
                                      setIsAddMinutesOpen(true);
                                    }}
                                  />
                                  <Button
                                    label="Cancel"
                                    icon="ban"
                                    variant="danger"
                                    size="small"
                                    onClick={() => {
                                      setCancelTargetId(item.id);
                                      setIsCancelMeetingOpen(true);
                                    }}
                                  />
                                </>
                              )}
                              {item.status === 'Conducted' && (
                                <div className="text-xs text-gray-500 font-semibold italic">
                                  Minutes Filed
                                </div>
                              )}
                              {item.status === 'Cancelled' && (
                                <div className="text-xs text-red-500 font-semibold italic">
                                  Cancelled
                                </div>
                              )}
                            </div>
                          );
                        },
                      },
                    ]}
                    searchBox={false}
                  />
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-6 text-sm">
                  {/* Add Notes Section */}
                  <div className="bg-slate-50 border p-4 rounded">
                    <h4 className="font-bold text-gray-800 border-b pb-2 mb-3">
                      Add Note by Committee Member
                    </h4>
                    <FormGrid columns={3}>
                      <DropDownList
                        label="Discussion Meeting ID"
                        data={meetings
                          .filter(m => m.grievanceId === activeGrievance.id)
                          .map(m => ({ id: m.id, text: m.id }))}
                        textField="text"
                        valueField="id"
                        value={newNoteMeetingId}
                        onChange={v => setNewNoteMeetingId(v as string)}
                        defaultOptionText="-- Select Meeting (Optional) --"
                      />
                      <DropDownList
                        label="Visible To All Complainants?"
                        data={[
                          { id: 'Yes', text: 'Yes' },
                          { id: 'No', text: 'No' },
                        ]}
                        textField="text"
                        valueField="id"
                        value={newNoteVisible}
                        onChange={v => setNewNoteVisible(v as any)}
                      />
                    </FormGrid>
                    <div className="mt-3">
                      <TextArea
                        label="Notes / Comments *"
                        placeholder="Enter committee notes..."
                        value={newNoteText}
                        onChange={setNewNoteText}
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end mt-3">
                      <Button
                        label="Submit Note"
                        icon="plus"
                        variant="primary"
                        onClick={handleAddNote}
                      />
                    </div>
                  </div>

                  {/* Notes Grid with admin actions */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-800 text-base">
                      Recorded Committee Notes
                    </h4>
                    {activeGrievance.notes?.length > 0 ? (
                      activeGrievance.notes.map(n => {
                        const canUpdateResponse =
                          n.responseStatus !== 'Accepted';
                        return (
                          <div
                            key={n.id}
                            className="border border-slate-200 rounded p-4 shadow-sm bg-white space-y-3"
                          >
                            <div className="flex justify-between items-center bg-slate-50 p-2 border-b">
                              <div>
                                <span className="font-bold text-gray-800">
                                  {n.author}
                                </span>
                                <span className="text-xs text-gray-500 ml-2">
                                  Note ID: {n.id} | Meeting: {n.meetingId}
                                </span>
                              </div>
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-bold ${
                                  n.responseStatus === 'Accepted'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : n.responseStatus === 'Rejected'
                                      ? 'bg-rose-100 text-rose-700'
                                      : 'bg-indigo-100 text-indigo-700'
                                }`}
                              >
                                {n.responseStatus}
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm whitespace-pre-wrap">
                              {n.notes}
                            </p>

                            {/* Response Section */}
                            <div className="bg-slate-50 p-3 rounded border border-dashed border-slate-300">
                              <span className="font-semibold text-slate-700 block mb-2">
                                Admin Redressal Action on Note
                              </span>
                              {isAdmin && canUpdateResponse ? (
                                <div className="space-y-2">
                                  <TextBox
                                    label="Response Details"
                                    placeholder="Enter response against note..."
                                    value={
                                      noteResponseText[n.id] ?? n.response ?? ''
                                    }
                                    onChange={v =>
                                      setNoteResponseText(p => ({
                                        ...p,
                                        [n.id]: v,
                                      }))
                                    }
                                  />
                                  <div className="flex justify-between items-end">
                                    <div className="w-1/3">
                                      <DropDownList
                                        label="Action Status"
                                        data={NOTE_STATUS_OPTIONS}
                                        textField="text"
                                        valueField="id"
                                        value={
                                          noteResponseStatus[n.id] ??
                                          n.responseStatus
                                        }
                                        onChange={v =>
                                          setNoteResponseStatus(p => ({
                                            ...p,
                                            [n.id]: v as string,
                                          }))
                                        }
                                      />
                                    </div>
                                    <Button
                                      label="Submit Action"
                                      icon="check"
                                      variant="success"
                                      onClick={() =>
                                        handleNoteStatusSubmit(n.id)
                                      }
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Admin Response:
                                  </p>
                                  <p className="font-medium text-gray-800">
                                    {n.response || 'No response filed yet.'}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-500 italic text-center">
                        No notes recorded against this grievance.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'print' && (
                <div className="border border-slate-300 p-6 rounded shadow bg-white space-y-4 max-w-2xl mx-auto text-sm print-area">
                  <div className="text-center border-b pb-4">
                    <h2 className="text-xl font-bold text-gray-800 uppercase">
                      State Technological University
                    </h2>
                    <p className="text-xs text-gray-500">
                      Official Grievance Redressal Slip
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold text-gray-500">Ticket ID:</p>
                      <p className="font-bold text-gray-900">
                        {activeGrievance.id}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-500">
                        Date Reported:
                      </p>
                      <p className="font-medium text-gray-900">
                        {activeGrievance.reportedDate}
                      </p>
                    </div>
                  </div>
                  <div className="border-t pt-3">
                    <p className="font-semibold text-gray-500">
                      Complainant Details:
                    </p>
                    <p className="font-bold text-gray-800">
                      {activeGrievance.member}
                    </p>
                    <p className="text-xs text-gray-500">
                      Email: {activeGrievance.email}
                    </p>
                  </div>
                  <div className="border-t pt-3">
                    <p className="font-semibold text-gray-500">
                      Category & Severity:
                    </p>
                    <p className="font-medium text-gray-800">
                      {activeGrievance.category} | {activeGrievance.level} Level
                    </p>
                  </div>
                  <div className="border-t pt-3">
                    <p className="font-semibold text-gray-500">
                      Summary of Redressal Resolution:
                    </p>
                    <p className="text-gray-700 bg-slate-50 p-2.5 rounded border border-dashed">
                      {activeGrievance.resolution ||
                        'Resolution pending investigation.'}
                    </p>
                    {activeGrievance.resolutionDate && (
                      <p className="text-xs text-gray-500 mt-1 font-semibold">
                        Resolved On: {activeGrievance.resolutionDate}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end pt-4 border-t gap-3 print:hidden">
                    <Button
                      label="Print Slip"
                      icon="print"
                      variant="primary"
                      onClick={handlePrint}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </FormPopup>

      {/* ── Sub-Modals for Meeting Workflow ── */}

      {/* 1. Schedule meeting popup */}
      <FormPopup
        visible={isAddMeetingOpen}
        onHide={() => setIsAddMeetingOpen(false)}
        title="Schedule Grievance Committee Meeting"
        size="lg"
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
              label="Meeting Time *"
              type="datetime-local"
              value={meetTime}
              onChange={setMeetTime}
            />
          </FormGrid>
          <TextBox
            label="Venue / Meeting Location *"
            placeholder="e.g. Conference Room A, Admin Block"
            value={meetVenue}
            onChange={setMeetVenue}
          />
          <TextArea
            label="Meeting Agenda *"
            placeholder="Outline topics of discussion..."
            value={meetAgenda}
            onChange={setMeetAgenda}
            rows={2}
          />

          {/* Add Guests Section */}
          <div className="border border-slate-200 p-3 rounded bg-slate-50">
            <span className="font-semibold text-gray-700 block mb-2">
              Invite External Guests
            </span>
            <FormGrid columns={3}>
              <TextBox
                label="Guest Name"
                placeholder="e.g. Dr. A. Sen"
                value={guestName}
                onChange={setGuestName}
              />
              <TextBox
                label="Guest Email"
                placeholder="email@domain.com"
                value={guestEmail}
                onChange={setGuestEmail}
              />
              <TextBox
                label="Guest Mobile"
                placeholder="10-digit mobile"
                value={guestMobile}
                onChange={setGuestMobile}
              />
            </FormGrid>
            <div className="flex justify-end mt-2">
              <Button
                label="Add Guest"
                icon="plus"
                variant="outlined"
                onClick={handleAddGuest}
              />
            </div>
            {meetGuests.length > 0 && (
              <div className="mt-3 space-y-1">
                {meetGuests.map(g => (
                  <div
                    key={g.email}
                    className="bg-white p-2 rounded border text-xs flex justify-between"
                  >
                    <span>
                      {g.name} ({g.email})
                    </span>
                    <button
                      type="button"
                      className="pi pi-trash text-red-500 font-bold"
                      onClick={() =>
                        setMeetGuests(p => p.filter(x => x.email !== g.email))
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setIsAddMeetingOpen(false)}
            />
            <Button
              label="Schedule Meeting"
              icon="calendar"
              variant="primary"
              onClick={handleCreateMeeting}
            />
          </div>
        </div>
      </FormPopup>

      {/* 2. Cancel meeting popup */}
      <FormPopup
        visible={isCancelMeetingOpen}
        onHide={() => setIsCancelMeetingOpen(false)}
        title="Cancel Scheduled Meeting"
      >
        <div className="space-y-4">
          <TextArea
            label="Reason for Cancellation *"
            placeholder="Please enter a valid reason..."
            value={cancelReason}
            onChange={setCancelReason}
            rows={3}
          />
          <div className="flex justify-end gap-3 pt-3">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setIsCancelMeetingOpen(false)}
            />
            <Button
              label="Cancel Meeting"
              icon="ban"
              variant="danger"
              onClick={handleCancelMeetingAction}
            />
          </div>
        </div>
      </FormPopup>

      {/* 3. Add Meeting Minutes popup */}
      <FormPopup
        visible={isAddMinutesOpen}
        onHide={() => setIsAddMinutesOpen(false)}
        title="Add Meeting Minutes"
      >
        <div className="space-y-4">
          <TextArea
            label="Discussion Summary & Decision Minutes *"
            placeholder="Document the decisions made..."
            value={minutesText}
            onChange={setMinutesText}
            rows={4}
          />
          <TextBox
            label="Upload Supporting Document Name"
            placeholder="e.g. minutes_signed.pdf"
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
              icon="save"
              variant="success"
              onClick={handleSaveMinutes}
            />
          </div>
        </div>
      </FormPopup>
    </FormPage>
  );
}
