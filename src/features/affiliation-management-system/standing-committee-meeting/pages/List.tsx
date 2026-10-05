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
import {
  DUMMY_COLLEGES,
  INITIAL_MEETINGS,
  getCollegeProfileData,
} from '../data';
import CollegeProfileReviewModal from '../components/CollegeProfileReviewModal';

export type MeetingItem = (typeof INITIAL_MEETINGS)[0];

// Meeting status variants for StatusBadge
const statusVariants: Record<
  string,
  'muted' | 'warning' | 'success' | 'danger'
> = {
  Draft: 'muted',
  Scheduled: 'warning',
  Completed: 'success',
  Cancelled: 'danger',
  'Deficiency Raised': 'danger',
  Rejected: 'danger',
};

export default function StandingCommitteeMeetingList() {
  const [data, setData] = useState<MeetingItem[]>(INITIAL_MEETINGS);
  const [showPopup, setShowPopup] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Review Profile Modal State
  const [viewingMeeting, setViewingMeeting] = useState<MeetingItem | null>(
    null
  );

  // Section rejections stored per meeting ID: meetingId -> { stepNumber: reason }
  const [sectionRejections, setSectionRejections] = useState<
    Record<number, Record<number, string>>
  >({});

  // Form fields state for schedule/edit meeting
  const [selectedCollegeId, setSelectedCollegeId] = useState<number | null>(
    null
  );
  const [applicationNumber, setApplicationNumber] = useState('');
  const [meetingDate, setMeetingDate] = useState<Date | undefined>(undefined);
  const [membersAvailable, setMembersAvailable] = useState('');
  const [meetingStatus, setMeetingStatus] = useState('Draft');
  const [remarks, setRemarks] = useState('');

  const handleOpenView = (item: MeetingItem) => {
    setViewingMeeting(item);
  };

  const handleCloseView = () => {
    setViewingMeeting(null);
  };

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

  const handleOpenPopupForEdit = (item: MeetingItem) => {
    setEditingId(item.id);
    setSelectedCollegeId(item.collegeId);
    setApplicationNumber(item.applicationNo);
    setMeetingDate(item.meetingDate);
    setMembersAvailable(item.membersAvailable || '');
    setMeetingStatus(item.meetingStatus);
    setRemarks(item.remarks || '');
    setShowPopup(true);
  };

  const handleScheduleAgain = (item: MeetingItem) => {
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

    const college = DUMMY_COLLEGES.find(c => c.id === selectedCollegeId);
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
      const newMeeting: MeetingItem = {
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

  // Callback when section-wise deficiencies / rejections are submitted from the review modal
  const handleSectionRejectionsSubmit = (
    rejectionsMap: Record<number, string>
  ) => {
    if (!viewingMeeting) return;

    const meetingId = viewingMeeting.id;
    setSectionRejections(prev => ({
      ...prev,
      [meetingId]: rejectionsMap,
    }));

    const rejectedStepNumbers = Object.keys(rejectionsMap).map(Number);

    if (rejectedStepNumbers.length > 0) {
      const STEP_NAMES: Record<number, string> = {
        1: 'College Registration Details',
        2: 'General Info',
        3: 'Course Registration',
        4: 'Land & Building Details',
        5: 'Academic Facilities',
        6: 'Computers & Equipment',
        7: 'Teaching & Non-Teaching Staff',
        8: 'Compliance',
        9: 'Others',
        10: 'Signature & Declaration',
      };

      const deficiencySummary = rejectedStepNumbers
        .map(
          step =>
            `• Step ${step} (${STEP_NAMES[step] || 'Section'}): ${rejectionsMap[step]}`
        )
        .join('\n');

      const updatedRemarks = viewingMeeting.remarks
        ? `${viewingMeeting.remarks}\n\n[Section Deficiencies]:\n${deficiencySummary}`
        : `[Section Deficiencies]:\n${deficiencySummary}`;

      // Update the meeting status and remarks
      setData(prev =>
        prev.map(item =>
          item.id === meetingId
            ? {
                ...item,
                meetingStatus: 'Deficiency Raised',
                remarks: updatedRemarks,
              }
            : item
        )
      );

      ToastService.success(
        `Deficiencies recorded for ${rejectedStepNumbers.length} section(s) in ${viewingMeeting.collegeName}.`
      );
    } else {
      ToastService.info(
        `No section rejections marked for ${viewingMeeting.collegeName}.`
      );
    }

    setViewingMeeting(null);
  };

  const handleApproveAffiliation = (remarks?: string, decision?: string) => {
    if (!viewingMeeting) return;
    const meetingId = viewingMeeting.id;
    const chosenDecision = decision || 'Approve';
    const statusMap: Record<string, string> = {
      Approve: 'Approved',
      'Approve with Conditions': 'Approved',
      'Provisional Approval': 'Approved',
      Reject: 'Rejected',
    };
    const newStatus = statusMap[chosenDecision] || 'Approved';
    const finalRemarks =
      remarks ||
      'Affiliation approved by Standing Committee upon full review of application details.';

    setData(prev =>
      prev.map(item =>
        item.id === meetingId
          ? {
              ...item,
              meetingStatus: newStatus,
              remarks: `[${chosenDecision}]: ${finalRemarks}`,
            }
          : item
      )
    );

    if (newStatus === 'Rejected') {
      ToastService.warn(
        `Affiliation for ${viewingMeeting.collegeName} has been Rejected.`
      );
    } else {
      ToastService.success(
        `Affiliation for ${viewingMeeting.collegeName} has been marked as ${chosenDecision}.`
      );
    }
    setViewingMeeting(null);
  };

  const handleFinalRejectAffiliation = (reason: string) => {
    if (!viewingMeeting) return;
    const meetingId = viewingMeeting.id;

    setData(prev =>
      prev.map(item =>
        item.id === meetingId
          ? {
              ...item,
              meetingStatus: 'Rejected',
              remarks: reason,
            }
          : item
      )
    );

    ToastService.warn(
      `Affiliation for ${viewingMeeting.collegeName} has been Rejected.`
    );
    setViewingMeeting(null);
  };

  const currentProfile = viewingMeeting
    ? getCollegeProfileData(
        viewingMeeting.applicationNo,
        viewingMeeting.collegeName
      )
    : null;

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
              width: '280px',
              cell: item => (
                <div className="flex items-center gap-1.5 justify-center">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpenView(item)}
                    icon="pi pi-eye"
                    tooltip="View Profile Details & Inspection Review"
                    ariaLabel="View Profile"
                  />
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
                    tooltip="Delete Meeting"
                  />
                </div>
              ),
            },
          ]}
        />
      </FormCard>

      {/* Edit / Schedule Meeting Dialog */}
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
              data={DUMMY_COLLEGES}
              textField="name"
              valueField="id"
              value={selectedCollegeId}
              onChange={val => {
                const collegeId = val as number;
                setSelectedCollegeId(collegeId);
                const college = DUMMY_COLLEGES.find(c => c.id === collegeId);
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
                { value: 'Deficiency Raised', text: 'Deficiency Raised' },
                { value: 'Approved', text: 'Approved' },
                { value: 'Rejected', text: 'Rejected' },
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

      {/* College Affiliation Profile Review Modal with Section-Wise Reject */}
      {currentProfile && viewingMeeting && (
        <CollegeProfileReviewModal
          visible={viewingMeeting !== null}
          onClose={handleCloseView}
          profile={currentProfile}
          initialRejections={sectionRejections[viewingMeeting.id] || {}}
          onSubmitRejections={handleSectionRejectionsSubmit}
          onApprove={handleApproveAffiliation}
          onFinalReject={handleFinalRejectAffiliation}
        />
      )}
    </FormPage>
  );
}
