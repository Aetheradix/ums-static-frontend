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
    collegeId: 1,
    collegeName: 'Global Institute of Technology',
    applicationNo: 'APP-74921',
    meetingDate: new Date('2026-08-15'),
    membersAvailable: 'Dr. R. K. Sen, Dr. A. Sharma, Prof. K. Singh',
    meetingStatus: 'Scheduled',
    remarks:
      'Committee will verify classroom counts, building security parameters, and hostel capacity certificates.',
  },
  {
    id: 2,
    collegeId: 2,
    collegeName: 'National Science College',
    applicationNo: 'APP-18239',
    meetingDate: new Date('2026-08-10'),
    membersAvailable: 'Dr. R. K. Sen, Prof. L. Verma',
    meetingStatus: 'Completed',
    remarks:
      'Discussed land ownership titles. Resolved to seek clarified affidavit documents in next hearing.',
  },
];

export default function StandingCommitteeMeetingList() {
  const [data, setData] = useState(INITIAL_MEETINGS);
  const [showPopup, setShowPopup] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form fields state
  const [selectedCollegeId, setSelectedCollegeId] = useState<number | null>(
    null
  );
  const [applicationNumber, setApplicationNumber] = useState('');
  const [meetingDate, setMeetingDate] = useState<Date | undefined>(undefined);
  const [membersAvailable, setMembersAvailable] = useState('');
  const [meetingStatus, setMeetingStatus] = useState('Draft');
  const [remarks, setRemarks] = useState('');

  const handleOpenPopupForNew = () => {
    setEditingId(null);
    setSelectedCollegeId(null);
    setApplicationNumber('');
    setMeetingDate(undefined);
    setMembersAvailable('');
    setMeetingStatus('Scheduled');
    setRemarks('');
    setShowPopup(true);
  };

  const handleOpenPopupForEdit = (item: (typeof INITIAL_MEETINGS)[0]) => {
    setEditingId(item.id);
    setSelectedCollegeId(item.collegeId);
    setApplicationNumber(item.applicationNo);
    setMeetingDate(item.meetingDate);
    setMembersAvailable(item.membersAvailable || '');
    setMeetingStatus(item.meetingStatus);
    setRemarks(item.remarks || '');
    setShowPopup(true);
  };

  const handleScheduleAgain = (item: (typeof INITIAL_MEETINGS)[0]) => {
    setEditingId(null);
    setSelectedCollegeId(item.collegeId);
    setApplicationNumber(item.applicationNo);
    setMeetingDate(undefined);
    setMembersAvailable('');
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
    if (!membersAvailable.trim()) {
      ToastService.error('Please enter members available.');
      return;
    }
    if (!remarks.trim()) {
      ToastService.error('Please enter committee discussion & remarks.');
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
                membersAvailable,
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
        meetingDate,
        membersAvailable,
        meetingStatus,
        remarks,
        collegeId: college.id,
        collegeName: college.name,
        applicationNo: college.applicationNo,
      };
      setData(prev => [newMeeting, ...prev]);
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
          searchPlaceholder="Search meetings by venue, or college..."
          searchFields={[
            'collegeName',
            'applicationNo',
            'remarks',
            'membersAvailable',
          ]}
          emptyMessage="No standing committee meetings scheduled."
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '60px',
              sortable: false,
            },
            {
              field: 'collegeName',
              header: 'College Name',
              cell: item => (
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-700">
                    {item.collegeName}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    {item.applicationNo}
                  </span>
                </div>
              ),
              sortable: true,
            },
            {
              field: 'meetingDate',
              header: 'Meeting Date',
              cell: item => (
                <span>
                  {item.meetingDate
                    ? new Date(item.meetingDate).toLocaleDateString()
                    : '-'}
                </span>
              ),
              sortable: true,
            },
            {
              field: 'membersAvailable',
              header: 'Members Available',
              sortable: true,
            },
            {
              field: 'remarks',
              header: 'Committee Discussion & Remark',
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
              header: 'Meeting Status',
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
            <DropDownList
              label="Select College Name"
              defaultOptionText="Select College"
              placeholder="Select College"
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

            <TextBox
              label="Application Number"
              value={applicationNumber}
              readOnly
              placeholder="Application number will auto-fill"
            />
          </FormGrid>

          <FormGrid columns={2}>
            <DatePicker
              label="Meeting Date"
              placeholder="DD/MM/YYYY"
              value={meetingDate}
              onChange={val => setMeetingDate(val || undefined)}
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
            label="Members Available"
            placeholder="Enter names of committee members present..."
            value={membersAvailable}
            onChange={val => setMembersAvailable(val)}
            required
          />

          <TextBox
            label="Committee Discussion & Remark"
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
