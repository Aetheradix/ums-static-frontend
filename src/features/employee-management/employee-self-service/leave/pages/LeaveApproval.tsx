import { useMemo, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DatePicker, DropDownList, TextArea } from 'shared/components/forms';
import { Modal } from 'shared/components/popups';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';

interface LeaveRequest {
  id: string;
  employeeCode: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  appliedOn: string;
  alternateArrangement?: string;
}

const INITIAL_LEAVES: LeaveRequest[] = [
  {
    id: 'LV-1024',
    employeeCode: 'EMP-001',
    employeeName: 'Dr. John A. Doe',
    leaveType: 'Casual Leave',
    startDate: '2026-05-10',
    endDate: '2026-05-11',
    days: 2,
    reason: 'Family function at hometown.',
    status: 'Approved',
    appliedOn: '2026-05-01',
    alternateArrangement: 'Dr. Robert Carter',
  },
  {
    id: 'LV-0985',
    employeeCode: 'EMP-001',
    employeeName: 'Dr. John A. Doe',
    leaveType: 'Medical Leave',
    startDate: '2026-04-12',
    endDate: '2026-04-15',
    days: 4,
    reason: 'Severe throat infection and fever.',
    status: 'Approved',
    appliedOn: '2026-04-10',
    alternateArrangement: 'Dr. Robert Carter',
  },
  {
    id: 'LV-1120',
    employeeCode: 'EMP-002',
    employeeName: 'Prof. Jane Smith',
    leaveType: 'Earned Leave',
    startDate: '2026-07-01',
    endDate: '2026-07-05',
    days: 5,
    reason: 'Personal relocation work.',
    status: 'Pending',
    appliedOn: '2026-06-20',
    alternateArrangement: 'Dr. Arthur Pendelton',
  },
  {
    id: 'LV-1215',
    employeeCode: 'EMP-003',
    employeeName: 'Mr. Alice R. Johnson',
    leaveType: 'Casual Leave',
    startDate: '2026-06-15',
    endDate: '2026-06-16',
    days: 2,
    reason: 'Personal work.',
    status: 'Approved',
    appliedOn: '2026-06-12',
    alternateArrangement: 'Dr. Eve L. Miller',
  },
  {
    id: 'LV-1250',
    employeeCode: 'EMP-004',
    employeeName: 'Dr. Bob Williams',
    leaveType: 'Casual Leave',
    startDate: '2026-08-01',
    endDate: '2026-08-03',
    days: 3,
    reason: 'Paternity leave.',
    status: 'Pending',
    appliedOn: '2026-06-25',
    alternateArrangement: 'Dr. Arthur Pendelton',
  },
  {
    id: 'LV-1288',
    employeeCode: 'EMP-005',
    employeeName: 'Ms. Charlie M. Brown',
    leaveType: 'Casual Leave',
    startDate: '2026-06-28',
    endDate: '2026-06-29',
    days: 2,
    reason: 'Attending relative marriage.',
    status: 'Rejected',
    appliedOn: '2026-06-22',
    alternateArrangement: 'Prof. David Davis',
  },
];

const formatDateToString = (date: Date | null | undefined) => {
  if (!date) return '';
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export default function LeaveApproval() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>(INITIAL_LEAVES);
  const [filterLeaveType, setFilterLeaveType] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterFromDate, setFilterFromDate] = useState<Date | null>(null);
  const [filterToDate, setFilterToDate] = useState<Date | null>(null);

  // Dialog / Review State
  const [selectedRecord, setSelectedRecord] = useState<LeaveRequest | null>(
    null
  );
  const [reviewStatus, setReviewStatus] = useState<string | null>(null);
  const [reviewerRemarks, setReviewerRemarks] = useState('');
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const leaveTypes = [
    { id: 'Casual Leave', name: 'Casual Leave' },
    { id: 'Earned Leave', name: 'Earned Leave' },
    { id: 'Medical Leave', name: 'Medical Leave' },
  ];

  const statuses = [
    { id: 'Pending', name: 'Pending' },
    { id: 'Approved', name: 'Approved' },
    { id: 'Rejected', name: 'Rejected' },
  ];

  const reviewStatuses = [
    { id: 'Approved', name: 'Approved' },
    { id: 'Rejected', name: 'Rejected' },
  ];

  const handleReset = () => {
    setFilterLeaveType(null);
    setFilterStatus(null);
    setFilterFromDate(null);
    setFilterToDate(null);
  };

  const handleOpenReview = (record: LeaveRequest) => {
    setSelectedRecord(record);
    setReviewStatus(record.status === 'Pending' ? 'Approved' : record.status);
    setReviewerRemarks('');
    setIsDialogVisible(true);
  };

  const handleSubmitReview = () => {
    if (!selectedRecord) return;
    if (!reviewStatus) {
      ToastService.error('Please select a decision status.');
      return;
    }

    setLeaves(prev =>
      prev.map(item =>
        item.id === selectedRecord.id
          ? {
              ...item,
              status: reviewStatus as any,
            }
          : item
      )
    );

    ToastService.success(
      `Leave application for ${selectedRecord.employeeName} has been ${reviewStatus.toLowerCase()} successfully!`
    );
    setIsDialogVisible(false);
    setSelectedRecord(null);
  };

  const filteredLeaves = useMemo(() => {
    const fromDateStr = formatDateToString(filterFromDate);
    const toDateStr = formatDateToString(filterToDate);

    return leaves.filter(item => {
      if (filterLeaveType && item.leaveType !== filterLeaveType) return false;
      if (filterStatus && item.status !== filterStatus) return false;
      if (fromDateStr && item.appliedOn < fromDateStr) return false;
      if (toDateStr && item.appliedOn > toDateStr) return false;
      return true;
    });
  }, [leaves, filterLeaveType, filterStatus, filterFromDate, filterToDate]);

  return (
    <FormPage
      title="Leave Approval (Admin/HR)"
      description="Review and process faculty and staff leave applications. Approve, reject, or track leave requests."
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Employee Services', to: '/home/sub-menu/employee-services' },
        {
          label: 'Employee Management',
          to: '/home/sub-menu/employee-management',
        },
        { label: 'Leave Approval', to: '#' },
      ]}
    >
      <div className="flex flex-col gap-6">
        {/* Search & Filter */}
        <FormCard title="Search & Filter Leave Applications" icon="filter">
          <FormGrid columns={4}>
            <DropDownList
              label="Leave Type"
              placeholder="Select Leave Type"
              data={leaveTypes}
              textField="name"
              valueField="id"
              value={filterLeaveType}
              onChange={val => setFilterLeaveType(val as string)}
            />
            <DropDownList
              label="Status"
              placeholder="Select Status"
              data={statuses}
              textField="name"
              valueField="id"
              value={filterStatus}
              onChange={val => setFilterStatus(val as string)}
            />
            <DatePicker
              label="Applied From"
              placeholder="Select start date"
              value={filterFromDate ?? undefined}
              onChange={date => setFilterFromDate(date ?? null)}
            />
            <DatePicker
              label="Applied To"
              placeholder="Select end date"
              value={filterToDate ?? undefined}
              onChange={date => setFilterToDate(date ?? null)}
            />
          </FormGrid>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              label="Reset Filters"
              variant="outlined"
              size="small"
              onClick={handleReset}
            />
          </div>
        </FormCard>

        {/* Requests Table */}
        <FormCard
          title="Employee Leave Requests"
          subtitle="Review submitted applications and take approval decisions."
        >
          <GridPanel
            data={filteredLeaves}
            columns={[
              {
                cell: (_, option) => <span>{option.rowIndex + 1}</span>,
                width: '40px',
              },
              { field: 'id', header: 'Ref ID' },
              { field: 'employeeCode', header: 'Code' },
              {
                field: 'employeeName',
                header: 'Employee Name',
                cell: (item: LeaveRequest) => (
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {item.employeeName}
                  </span>
                ),
              },
              { field: 'leaveType', header: 'Leave Type' },
              {
                header: 'Leave Duration',
                cell: (item: LeaveRequest) => (
                  <span className="text-xs text-gray-700 dark:text-zinc-300">
                    {item.startDate} to {item.endDate}
                  </span>
                ),
              },
              {
                field: 'days',
                header: 'Days',
                cell: (item: LeaveRequest) => (
                  <span className="font-bold text-gray-800 dark:text-zinc-200">
                    {item.days}
                  </span>
                ),
              },
              {
                field: 'appliedOn',
                header: 'Applied On',
                cell: (item: LeaveRequest) => (
                  <span className="text-xs text-gray-500">
                    {item.appliedOn}
                  </span>
                ),
              },
              {
                field: 'status',
                header: 'Status',
                cell: (item: LeaveRequest) => {
                  let variant: 'approved' | 'pending' | 'rejected' = 'pending';
                  if (item.status === 'Approved') variant = 'approved';
                  if (item.status === 'Rejected') variant = 'rejected';
                  return <StatusBadge variant={variant} label={item.status} />;
                },
              },
              {
                header: 'Action',
                cell: (item: LeaveRequest) => (
                  <Button
                    label={item.status === 'Pending' ? 'Review' : 'View'}
                    icon={item.status === 'Pending' ? 'check' : 'eye'}
                    variant={item.status === 'Pending' ? 'primary' : 'outlined'}
                    size="small"
                    onClick={() => handleOpenReview(item)}
                  />
                ),
              },
            ]}
            searchBox
            searchPlaceholder="Search by name, code..."
          />
        </FormCard>
      </div>

      {/* Review Modal */}
      <Modal
        header={
          selectedRecord
            ? `Leave Request Review - ${selectedRecord.employeeName} (${selectedRecord.employeeCode})`
            : ''
        }
        visible={isDialogVisible}
        onHide={() => {
          setIsDialogVisible(false);
          setSelectedRecord(null);
        }}
        size="large"
      >
        {selectedRecord && (
          <div className="flex flex-col gap-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-semibold text-gray-700 dark:text-zinc-300 block text-xs uppercase tracking-wide">
                  Leave Type
                </span>
                <span className="text-gray-900 dark:text-white font-medium text-sm">
                  {selectedRecord.leaveType}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-zinc-300 block text-xs uppercase tracking-wide">
                  Duration
                </span>
                <span className="text-gray-900 dark:text-white font-medium text-sm">
                  {selectedRecord.startDate} to {selectedRecord.endDate} (
                  {selectedRecord.days} Days)
                </span>
              </div>
            </div>

            <div>
              <span className="font-semibold text-gray-700 dark:text-zinc-300 block text-xs uppercase tracking-wide">
                Reason for Leave
              </span>
              <p className="text-gray-800 dark:text-zinc-200 text-sm mt-1 bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-md border border-gray-100 dark:border-zinc-800">
                {selectedRecord.reason}
              </p>
            </div>

            {selectedRecord.alternateArrangement && (
              <div>
                <span className="font-semibold text-gray-700 dark:text-zinc-300 block text-xs uppercase tracking-wide">
                  Alternate Arrangement
                </span>
                <span className="text-gray-900 dark:text-white font-medium text-sm">
                  {selectedRecord.alternateArrangement}
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              {selectedRecord.status !== 'Pending' ? (
                <div>
                  <span className="font-semibold text-gray-700 block text-xs uppercase tracking-wide">
                    Decision Status
                  </span>
                  <span className="text-gray-950 font-bold text-lg">
                    {selectedRecord.status}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <DropDownList
                    label="Decision Status"
                    placeholder="Select Status"
                    data={reviewStatuses}
                    textField="name"
                    valueField="id"
                    value={reviewStatus}
                    onChange={val => setReviewStatus(val as string)}
                    required
                  />
                  <TextArea
                    label="Remarks"
                    placeholder="Enter review remarks or reason for decision."
                    value={reviewerRemarks}
                    onChange={val => setReviewerRemarks(val)}
                    rows={3}
                  />
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-zinc-800">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => {
                  setIsDialogVisible(false);
                  setSelectedRecord(null);
                }}
              />
              {selectedRecord.status === 'Pending' && (
                <Button
                  label="Submit Decision"
                  variant="primary"
                  onClick={handleSubmitReview}
                />
              )}
            </div>
          </div>
        )}
      </Modal>
    </FormPage>
  );
}
