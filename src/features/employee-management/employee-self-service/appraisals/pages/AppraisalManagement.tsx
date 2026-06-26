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

interface AppraisalRecord {
  id: string;
  employeeCode: string;
  employeeName: string;
  period: string;
  reviewer: string;
  reviewerRating: string | number;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Completed';
  submissionDate: string;
  performanceGoals?: string;
  innovations?: string;
  training?: string;
}

const INITIAL_APPRAISALS: AppraisalRecord[] = [
  {
    id: 'SAR-2024-001',
    employeeCode: 'EMP-001',
    employeeName: 'Dr. John A. Doe',
    period: 'April 2024 - March 2025',
    reviewer: 'Dr. Robert Carter (HOD)',
    reviewerRating: 4,
    status: 'Completed',
    submissionDate: '2025-04-10',
    performanceGoals:
      'Accomplished AI syllabus upgrades and published 3 papers.',
    innovations: 'Built hybrid student assessment tool.',
    training: 'Attended IEEE NLP workshop.',
  },
  {
    id: 'SAR-2025-001',
    employeeCode: 'EMP-001',
    employeeName: 'Dr. John A. Doe',
    period: 'April 2025 - March 2026',
    reviewer: 'Dr. Robert Carter (HOD)',
    reviewerRating: 'Pending',
    status: 'Under Review',
    submissionDate: '2026-04-12',
    performanceGoals:
      'Developed machine learning research lab and initiated joint grants.',
  },
  {
    id: 'SAR-2024-002',
    employeeCode: 'EMP-002',
    employeeName: 'Prof. Jane Smith',
    period: 'April 2024 - March 2025',
    reviewer: 'Dr. Arthur Pendelton',
    reviewerRating: 5,
    status: 'Completed',
    submissionDate: '2025-04-15',
    performanceGoals: 'Upgraded quantum physics lab infrastructure.',
  },
  {
    id: 'SAR-2025-002',
    employeeCode: 'EMP-002',
    employeeName: 'Prof. Jane Smith',
    period: 'April 2025 - March 2026',
    reviewer: 'Dr. Arthur Pendelton',
    reviewerRating: 'Pending',
    status: 'Under Review',
    submissionDate: '2026-04-20',
    performanceGoals:
      'Started new research stream in topological quantum computer dynamics.',
  },
  {
    id: 'SAR-2025-003',
    employeeCode: 'EMP-004',
    employeeName: 'Dr. Bob Williams',
    period: 'April 2025 - March 2026',
    reviewer: 'Dr. Arthur Pendelton',
    reviewerRating: 3,
    status: 'Completed',
    submissionDate: '2026-05-02',
    performanceGoals: 'Conducted 4 specialized workshops.',
  },
  {
    id: 'SAR-2025-004',
    employeeCode: 'EMP-005',
    employeeName: 'Ms. Charlie M. Brown',
    period: 'April 2025 - March 2026',
    reviewer: 'Dr. Robert Carter (HOD)',
    reviewerRating: 'Pending',
    status: 'Submitted',
    submissionDate: '2026-05-15',
    performanceGoals: 'Optimized internal parallel data rendering engines.',
  },
];

const formatDateToString = (date: Date | null | undefined) => {
  if (!date) return '';
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export default function AppraisalManagement() {
  const [appraisals, setAppraisals] =
    useState<AppraisalRecord[]>(INITIAL_APPRAISALS);
  const [filterPeriod, setFilterPeriod] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterFromDate, setFilterFromDate] = useState<Date | null>(null);
  const [filterToDate, setFilterToDate] = useState<Date | null>(null);

  // Dialog State
  const [selectedRecord, setSelectedRecord] = useState<AppraisalRecord | null>(
    null
  );
  const [reviewerRating, setReviewerRating] = useState<string | null>(null);
  const [reviewerComments, setReviewerComments] = useState('');
  const [reviewStatus, setReviewStatus] = useState<string | null>(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const periods = [
    { id: 'April 2024 - March 2025', name: 'April 2024 - March 2025' },
    { id: 'April 2025 - March 2026', name: 'April 2025 - March 2026' },
  ];

  const statuses = [
    { id: 'Submitted', name: 'Submitted' },
    { id: 'Under Review', name: 'Under Review' },
    { id: 'Completed', name: 'Completed' },
  ];

  const reviewerRatings = [
    { id: '1', name: '1 - Poor' },
    { id: '2', name: '2 - Average' },
    { id: '3', name: '3 - Good' },
    { id: '4', name: '4 - Very Good' },
    { id: '5', name: '5 - Outstanding' },
  ];

  const reviewStatuses = [
    { id: 'Under Review', name: 'Under Review' },
    { id: 'Completed', name: 'Completed' },
  ];

  const handleReset = () => {
    setFilterPeriod(null);
    setFilterStatus(null);
    setFilterFromDate(null);
    setFilterToDate(null);
  };

  const handleOpenReview = (record: AppraisalRecord) => {
    setSelectedRecord(record);
    setReviewerRating(
      typeof record.reviewerRating === 'number'
        ? String(record.reviewerRating)
        : null
    );
    setReviewerComments('');
    setReviewStatus(record.status === 'Completed' ? 'Completed' : 'Completed');
    setIsDialogVisible(true);
  };

  const handleSubmitReview = () => {
    if (!selectedRecord) return;
    if (!reviewerRating) {
      ToastService.error('Please select a reviewer rating.');
      return;
    }
    if (!reviewStatus) {
      ToastService.error('Please select a review status.');
      return;
    }

    setAppraisals(prev =>
      prev.map(item =>
        item.id === selectedRecord.id
          ? {
              ...item,
              reviewerRating: Number(reviewerRating),
              status: reviewStatus as any,
            }
          : item
      )
    );

    ToastService.success(
      `Appraisal review for ${selectedRecord.employeeName} submitted successfully!`
    );
    setIsDialogVisible(false);
    setSelectedRecord(null);
  };

  const filteredAppraisals = useMemo(() => {
    const fromDateStr = formatDateToString(filterFromDate);
    const toDateStr = formatDateToString(filterToDate);

    return appraisals.filter(item => {
      if (filterPeriod && item.period !== filterPeriod) return false;
      if (filterStatus && item.status !== filterStatus) return false;
      if (fromDateStr && item.submissionDate < fromDateStr) return false;
      if (toDateStr && item.submissionDate > toDateStr) return false;
      return true;
    });
  }, [appraisals, filterPeriod, filterStatus, filterFromDate, filterToDate]);

  return (
    <FormPage
      title="Appraisal Management (Admin/HR)"
      description="Review and process employee Self Appraisal Reports (SAR). Evaluate and lock final performance ratings."
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Employee Services', to: '/home/sub-menu/employee-services' },
        {
          label: 'Employee Management',
          to: '/home/sub-menu/employee-management',
        },
        { label: 'Appraisals', to: '#' },
      ]}
    >
      <div className="flex flex-col gap-6">
        {/* Filter Card */}
        <FormCard title="Search & Filter Appraisals" icon="filter">
          <FormGrid columns={4}>
            <DropDownList
              label="Appraisal Period"
              placeholder="Select Period"
              data={periods}
              textField="name"
              valueField="id"
              value={filterPeriod}
              onChange={val => setFilterPeriod(val as string)}
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
              label="Submitted From"
              placeholder="Select start date"
              value={filterFromDate ?? undefined}
              onChange={date => setFilterFromDate(date ?? null)}
            />
            <DatePicker
              label="Submitted To"
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

        {/* Appraisal Records */}
        <FormCard
          title="Employee Self Appraisals"
          subtitle="Click on the Action button next to a record to rate and complete reviews."
        >
          <GridPanel
            data={filteredAppraisals}
            columns={[
              {
                cell: (_, option) => <span>{option.rowIndex + 1}</span>,
                width: '40px',
              },
              { field: 'id', header: 'SAR ID' },
              { field: 'employeeCode', header: 'Code' },
              {
                field: 'employeeName',
                header: 'Employee Name',
                cell: (item: AppraisalRecord) => (
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {item.employeeName}
                  </span>
                ),
              },
              { field: 'period', header: 'Review Period' },
              {
                field: 'reviewerRating',
                header: 'Reviewer Rating',
                cell: (item: AppraisalRecord) => (
                  <span className="font-bold text-gray-800 dark:text-zinc-200">
                    {typeof item.reviewerRating === 'number'
                      ? `${item.reviewerRating} / 5`
                      : item.reviewerRating}
                  </span>
                ),
              },
              {
                field: 'submissionDate',
                header: 'Submitted On',
                cell: (item: AppraisalRecord) => (
                  <span className="text-xs text-gray-500">
                    {item.submissionDate}
                  </span>
                ),
              },
              {
                field: 'status',
                header: 'Status',
                cell: (item: AppraisalRecord) => {
                  let variant: 'approved' | 'pending' | 'neutral' = 'neutral';
                  if (item.status === 'Completed') variant = 'approved';
                  if (
                    item.status === 'Under Review' ||
                    item.status === 'Submitted'
                  ) {
                    variant = 'pending';
                  }
                  return <StatusBadge variant={variant} label={item.status} />;
                },
              },
              {
                header: 'Action',
                cell: (item: AppraisalRecord) => (
                  <Button
                    label={
                      item.status === 'Completed' ? 'View Review' : 'Review'
                    }
                    icon={item.status === 'Completed' ? 'eye' : 'check'}
                    variant={
                      item.status === 'Completed' ? 'outlined' : 'primary'
                    }
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
            ? `Appraisal Review - ${selectedRecord.employeeName} (${selectedRecord.employeeCode})`
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
            <div>
              <span className="font-semibold text-gray-700 dark:text-zinc-300 block text-xs uppercase tracking-wide">
                Appraisal Period
              </span>
              <span className="text-gray-900 dark:text-white font-medium text-sm">
                {selectedRecord.period}
              </span>
            </div>

            <div>
              <span className="font-semibold text-gray-700 dark:text-zinc-300 block text-xs uppercase tracking-wide">
                Employee Performance Description
              </span>
              <p className="text-gray-800 dark:text-zinc-200 text-sm mt-1 bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-md border border-gray-100 dark:border-zinc-800">
                {selectedRecord.performanceGoals ||
                  'No accomplishments description provided.'}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {selectedRecord.status === 'Completed' ? (
                <div>
                  <span className="font-semibold text-gray-700 dark:text-zinc-300 block text-xs uppercase tracking-wide">
                    Reviewer Final Rating
                  </span>
                  <span className="text-gray-950 dark:text-white font-bold text-lg">
                    {selectedRecord.reviewerRating} / 5
                  </span>
                </div>
              ) : (
                <DropDownList
                  label="Assign Reviewer Rating"
                  placeholder="Select Rating"
                  data={reviewerRatings}
                  textField="name"
                  valueField="id"
                  value={reviewerRating}
                  onChange={val => setReviewerRating(val as string)}
                  required
                />
              )}
            </div>

            {selectedRecord.status !== 'Completed' && (
              <div className="grid grid-cols-1 gap-4">
                <DropDownList
                  label="Set Appraisal Status"
                  placeholder="Select Status"
                  data={reviewStatuses}
                  textField="name"
                  valueField="id"
                  value={reviewStatus}
                  onChange={val => setReviewStatus(val as string)}
                  required
                />
                <TextArea
                  label="Reviewer Remarks"
                  placeholder="Enter appraisal review remarks, objectives discussed, and feedback."
                  value={reviewerComments}
                  onChange={val => setReviewerComments(val)}
                  rows={3}
                />
              </div>
            )}

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
              {selectedRecord.status !== 'Completed' && (
                <Button
                  label="Submit Review"
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
