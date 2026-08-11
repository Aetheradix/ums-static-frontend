import { useState } from 'react';
import {
  FormCard,
  FormPage,
  FormPopup,
  FormGrid,
  StatusBadge,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox, DatePicker } from 'shared/components/forms';
import GridPanel from 'shared/new-components/GridPanel';
import { ToastService } from 'services';

// Mock Colleges / Applications
const dummyColleges = [
  { id: 1, name: 'Global Institute of Technology', applicationNo: 'APP-74921' },
  { id: 2, name: 'National Science College', applicationNo: 'APP-18239' },
  { id: 3, name: 'Sunrise Commerce Academy', applicationNo: 'APP-90234' },
  { id: 4, name: 'Pioneer Engineering College', applicationNo: 'APP-48231' },
  { id: 5, name: 'Govt Engineering College', applicationNo: 'APP-33921' },
];

// Meeting status variants for StatusBadge
const statusVariants: Record<
  string,
  'muted' | 'warning' | 'success' | 'danger'
> = {
  Draft: 'muted',
  Scheduled: 'warning',
  Completed: 'success',
  Cancelled: 'danger',
};

// Initial Mock Meetings
const INITIAL_MEETINGS = [
  {
    id: 1,
    meetingNo: 'SCM-2026-0001',
    meetingDate: new Date('2026-08-15'),
    meetingTime: '11:00 AM',
    meetingVenue: 'VC Chamber Conference Room, DAVV',
    meetingType: 'Regular',
    meetingStatus: 'Scheduled',
    collegeId: 1,
    collegeName: 'Global Institute of Technology',
    applicationNo: 'APP-74921',
    remarks:
      'Committee will verify classroom counts, building security parameters, and hostel capacity certificates.',
  },
  {
    id: 2,
    meetingNo: 'SCM-2026-0002',
    meetingDate: new Date('2026-08-10'),
    meetingTime: '02:30 PM',
    meetingVenue: 'Meeting Room 2, Administrative Block',
    meetingType: 'Special',
    meetingStatus: 'Draft',
    collegeId: 2,
    collegeName: 'National Science College',
    applicationNo: 'APP-18239',
    remarks:
      'Discussed land ownership titles. Resolved to seek clarified affidavit documents in next hearing.',
  },
];

export default function StandingCommitteeMeetingList() {
  const [data, setData] = useState(INITIAL_MEETINGS);
  const [showPopup, setShowPopup] = useState(false);
  const [sequenceCounter, setSequenceCounter] = useState(3);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form fields state
  const [meetingNo, setMeetingNo] = useState('');
  const [selectedCollegeId, setSelectedCollegeId] = useState<number | null>(
    null
  );
  const [applicationNumber, setApplicationNumber] = useState('');
  const [meetingDate, setMeetingDate] = useState<Date | undefined>(undefined);
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingVenue, setMeetingVenue] = useState('');
  const [meetingType, setMeetingType] = useState('Regular');
  const [meetingStatus, setMeetingStatus] = useState('Draft');
  const [remarks, setRemarks] = useState('');

  const generateMeetingNo = (index: number) => {
    const year = new Date().getFullYear();
    const sequence = String(index).padStart(4, '0');
    return `SCM-${year}-${sequence}`;
  };

  const handleOpenPopupForNew = () => {
    setEditingId(null);
    setMeetingNo(generateMeetingNo(sequenceCounter));
    setSelectedCollegeId(null);
    setApplicationNumber('');
    setMeetingDate(undefined);
    setMeetingTime('');
    setMeetingVenue('');
    setMeetingType('Regular');
    setMeetingStatus('Scheduled');
    setRemarks('');
    setShowPopup(true);
  };

  const handleOpenPopupForEdit = (item: (typeof INITIAL_MEETINGS)[0]) => {
    setEditingId(item.id);
    setMeetingNo(item.meetingNo);
    setSelectedCollegeId(item.collegeId);
    setApplicationNumber(item.applicationNo);
    setMeetingDate(item.meetingDate);
    setMeetingTime(item.meetingTime);
    setMeetingVenue(item.meetingVenue);
    setMeetingType(item.meetingType);
    setMeetingStatus(item.meetingStatus);
    setRemarks(item.remarks || '');
    setShowPopup(true);
  };

  const handleScheduleAgain = (item: (typeof INITIAL_MEETINGS)[0]) => {
    setEditingId(null);
    // Auto-generate new meeting number
    setMeetingNo(generateMeetingNo(sequenceCounter));
    setSelectedCollegeId(item.collegeId);
    setApplicationNumber(item.applicationNo);
    // Reset date/time/venue/remarks so user can reschedule
    setMeetingDate(undefined);
    setMeetingTime('');
    setMeetingVenue('');
    setMeetingType('Regular');
    setMeetingStatus('Scheduled');
    setRemarks('');
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleDelete = (id: number) => {
    setData(prev => prev.filter(item => item.id !== id));
    ToastService.success('Meeting deleted successfully.');
  };

  const handleSave = () => {
    if (!selectedCollegeId) {
      ToastService.error('Please select an application / college.');
      return;
    }
    if (!meetingDate) {
      ToastService.error('Please select meeting date.');
      return;
    }
    if (!meetingTime.trim()) {
      ToastService.error('Please enter meeting time.');
      return;
    }
    if (!meetingVenue.trim()) {
      ToastService.error('Please enter meeting venue.');
      return;
    }
    if (!remarks.trim()) {
      ToastService.error('Please enter committee discussion / remarks.');
      return;
    }

    const college = dummyColleges.find(c => c.id === selectedCollegeId);
    if (!college) return;

    if (editingId !== null) {
      // Edit mode
      setData(prev =>
        prev.map(item =>
          item.id === editingId
            ? {
                ...item,
                meetingDate,
                meetingTime,
                meetingVenue,
                meetingType,
                meetingStatus,
                remarks,
                collegeId: college.id,
                collegeName: college.name,
                applicationNo: college.applicationNo,
              }
            : item
        )
      );
      ToastService.success('Meeting details updated successfully.');
    } else {
      // Add mode
      const newMeeting = {
        id: Date.now(),
        meetingNo,
        meetingDate,
        meetingTime,
        meetingVenue,
        meetingType,
        meetingStatus,
        remarks,
        collegeId: college.id,
        collegeName: college.name,
        applicationNo: college.applicationNo,
      };
      setData(prev => [newMeeting, ...prev]);
      setSequenceCounter(prev => prev + 1);
      ToastService.success('Meeting scheduled successfully.');
    }

    handleClosePopup();
  };

  return (
    <FormPage
      title="Standing Committee Meetings"
      description="Manage standing committee schedules, draft agendas, and status logs."
    >
      <FormCard
        title="Standing Committee Meetings Directory"
        headerAction={
          <Button
            variant="primary"
            onClick={handleOpenPopupForNew}
            label="Schedule Meeting"
            icon="pi pi-calendar-plus"
          />
        }
      >
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search meetings by no, venue, or college..."
          searchFields={[
            'meetingNo',
            'meetingVenue',
            'collegeName',
            'applicationNo',
            'remarks',
          ]}
          emptyMessage="No standing committee meetings scheduled."
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '60px',
              sortable: false,
            },
            {
              field: 'meetingNo',
              header: 'Meeting No.',
              sortable: true,
            },
            {
              field: 'collegeName',
              header: 'College & Application No.',
              cell: item => (
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-700">
                    {item.collegeName}
                  </span>
                  <span className="text-xs text-gray-400">
                    {item.applicationNo}
                  </span>
                </div>
              ),
              sortable: true,
            },
            {
              field: 'meetingDate',
              header: 'Meeting Date & Time',
              cell: item => (
                <div className="flex flex-col">
                  <span>
                    {item.meetingDate
                      ? new Date(item.meetingDate).toLocaleDateString()
                      : '-'}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    {item.meetingTime}
                  </span>
                </div>
              ),
              sortable: true,
            },
            {
              field: 'meetingVenue',
              header: 'Venue',
              sortable: true,
            },
            {
              field: 'meetingType',
              header: 'Type',
              sortable: true,
            },
            {
              field: 'remarks',
              header: 'Committee Discussion / Remarks',
              sortable: true,
              cell: item => (
                <span
                  className="text-gray-600 block max-w-xs truncate"
                  title={item.remarks}
                >
                  {item.remarks || '-'}
                </span>
              ),
            },
            {
              field: 'meetingStatus',
              header: 'Status',
              sortable: true,
              cell: item => (
                <StatusBadge
                  label={item.meetingStatus}
                  variant={statusVariants[item.meetingStatus] || 'neutral'}
                />
              ),
            },
            {
              header: 'Actions',
              sortable: false,
              width: '250px',
              cell: item => (
                <div className="flex items-center gap-1.5 justify-center">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpenPopupForEdit(item)}
                    icon="pi pi-pencil"
                    label="Edit"
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleScheduleAgain(item)}
                    icon="pi pi-refresh"
                    label="Schedule Again"
                    tooltip="Schedule another meeting for this application number"
                  />
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => handleDelete(item.id)}
                    icon="pi pi-trash"
                    label="Delete"
                  />
                </div>
              ),
            },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={showPopup}
        onHide={handleClosePopup}
        title={
          editingId
            ? 'Edit Meeting Details'
            : 'Schedule Standing Committee Meeting'
        }
        size="lg"
        footer={
          <div className="flex gap-2 justify-end w-full">
            <Button
              variant="outlined"
              onClick={handleClosePopup}
              label="Cancel"
            />
            <Button
              variant="primary"
              onClick={handleSave}
              label="Save"
              icon="pi pi-check"
            />
          </div>
        }
      >
        <div className="p-4 flex flex-col gap-5">
          <FormGrid columns={2}>
            <TextBox
              label="Standing Committee Meeting No."
              value={meetingNo}
              readOnly
              placeholder="Auto-Generated"
            />

            <DropDownList
              label="Select College Application"
              defaultOptionText="Select College Application"
              placeholder="Select College Application"
              data={dummyColleges}
              textField="name"
              valueField="id"
              value={selectedCollegeId}
              onChange={val => {
                const collegeId = val as number;
                setSelectedCollegeId(collegeId);
                const college = dummyColleges.find(c => c.id === collegeId);
                if (college) {
                  setApplicationNumber(college.applicationNo);
                } else {
                  setApplicationNumber('');
                }
              }}
              required
            />
          </FormGrid>

          <FormGrid columns={2}>
            <TextBox
              label="Application Number"
              value={applicationNumber}
              readOnly
              placeholder="Application number will auto-fill"
            />

            <DatePicker
              label="Meeting Date"
              placeholder="DD/MM/YYYY"
              value={meetingDate}
              onChange={val => setMeetingDate(val || undefined)}
              required
            />
          </FormGrid>

          <FormGrid columns={2}>
            <TextBox
              label="Meeting Time"
              placeholder="e.g. 11:30 AM"
              value={meetingTime}
              onChange={val => setMeetingTime(val)}
              required
            />

            <TextBox
              label="Meeting Venue"
              placeholder="Enter meeting location/venue"
              value={meetingVenue}
              onChange={val => setMeetingVenue(val)}
              required
            />
          </FormGrid>

          <FormGrid columns={2}>
            <DropDownList
              label="Meeting Type"
              data={[
                { value: 'Regular', text: 'Regular' },
                { value: 'Special', text: 'Special' },
              ]}
              textField="text"
              valueField="value"
              value={meetingType}
              onChange={val => setMeetingType(val as string)}
              required
            />

            <DropDownList
              label="Meeting Status"
              data={[
                { value: 'Draft', text: 'Draft' },
                { value: 'Scheduled', text: 'Scheduled' },
                { value: 'Completed', text: 'Completed' },
                { value: 'Cancelled', text: 'Cancelled' },
              ]}
              textField="text"
              valueField="value"
              value={meetingStatus}
              onChange={val => setMeetingStatus(val as string)}
              required
            />
          </FormGrid>

          <TextBox
            label="Committee Discussion & Remarks"
            placeholder="Describe offline committee discussions, observations, and recommendations..."
            value={remarks}
            onChange={val => setRemarks(val)}
            required
          />
        </div>
      </FormPopup>
    </FormPage>
  );
}
