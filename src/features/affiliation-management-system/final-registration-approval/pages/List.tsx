import { useState } from 'react';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  PreviewField,
  PreviewSection,
  StatusBadge,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';

// Mock Data
const MOCK_DATA = [
  {
    id: 1,
    collegeName: 'Global Institute of Technology',
    inspectionDate: '2026-07-06T10:30:00Z',
    inspectionTeam: 'Dr. Ramesh Kumar, Prof. Anil Sharma',
    status: 'Pending',
  },
  {
    id: 2,
    collegeName: 'National Science College',
    inspectionDate: '2026-06-30T14:15:00Z',
    inspectionTeam: 'Dr. Sunita Verma, Dr. Vivek Singh',
    status: 'Approved',
  },
  {
    id: 3,
    collegeName: 'Sunrise Commerce Academy',
    inspectionDate: '2026-07-07T09:00:00Z',
    inspectionTeam: 'Prof. K.L. Gupta, Dr. Meena Das',
    status: 'Pending',
  },
];

export default function FinalRegistrationApprovalList() {
  const [data, setData] = useState(MOCK_DATA);
  const [reviewId, setReviewId] = useState<number | null>(null);

  const handleOpenReview = (id: number) => {
    setReviewId(id);
  };

  const handleCloseReview = () => {
    setReviewId(null);
  };

  const handleAction = (status: 'Approved' | 'Rejected') => {
    setData(prev =>
      prev.map(item => (item.id === reviewId ? { ...item, status } : item))
    );
    handleCloseReview();
  };

  return (
    <FormPage
      title="Final Registration Approval"
      description="Review inspection reports and make the final decision on college affiliation."
    >
      <FormCard>
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search colleges..."
          searchFields={['collegeName']}
          emptyMessage="No colleges found."
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '60px',
              sortable: false,
            },
            {
              field: 'collegeName',
              header: 'College Name',
            },
            {
              field: 'inspectionDate',
              header: 'Inspection Date',
              cell: item => (
                <span>
                  {new Date(item.inspectionDate).toLocaleDateString()}
                </span>
              ),
            },
            {
              field: 'inspectionTeam',
              header: 'Inspection Team',
            },
            {
              field: 'status',
              header: 'Final Status',
              cell: item => {
                let variant: 'pending' | 'approved' | 'rejected' = 'pending';
                if (item.status === 'Approved') variant = 'approved';
                if (item.status === 'Rejected') variant = 'rejected';
                return <StatusBadge label={item.status} variant={variant} />;
              },
            },
            {
              header: 'Actions',
              sortable: false,
              width: '140px',
              cell: item => {
                const isPending = item.status === 'Pending';
                return isPending ? (
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => handleOpenReview(item.id)}
                    label="Review Report"
                  />
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpenReview(item.id)}
                    label="View Details"
                  />
                );
              },
            },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={reviewId !== null}
        onHide={handleCloseReview}
        title="Detailed Inspection Report"
        subtitle="Review the findings submitted by the inspection team."
        size="xl"
        footer={
          data.find(c => c.id === reviewId)?.status === 'Pending' ? (
            <div className="flex gap-2 justify-end w-full mt-4">
              <Button
                variant="outlined"
                onClick={() => handleAction('Rejected')}
                label="Reject Affiliation"
              />
              <Button
                variant="primary"
                onClick={() => handleAction('Approved')}
                label="Approve Affiliation"
              />
            </div>
          ) : (
            <div className="flex justify-end w-full mt-4">
              <Button
                variant="outlined"
                onClick={handleCloseReview}
                label="Close"
              />
            </div>
          )
        }
      >
        <div className="registration-preview-content">
          <PreviewSection step={1} title="Infrastructure & Physical Assets">
            <FormGrid columns={3}>
              <PreviewField
                label="Total Built-up Area as per norms"
                value="Compliant"
              />
              <PreviewField
                label="Number of Classrooms as per norms"
                value="Compliant"
              />
              <PreviewField
                label="Classrooms Size as per norms"
                value="Compliant"
              />
              <PreviewField
                label="Number of Laboratories as per norms"
                value="Compliant"
              />
              <PreviewField
                label="Library Books Available as per norms"
                value="Compliant"
              />
              <PreviewField
                label="Internet Facility (Bandwidth)"
                value="1 Gbps Leased Line"
              />
            </FormGrid>
          </PreviewSection>

          <PreviewSection step={2} title="Academic & Faculty Status">
            <FormGrid columns={3}>
              <PreviewField
                label="Is Principal Qualified as per norms?"
                value="Yes"
              />
              <PreviewField
                label="Are Salaries paid via Bank Account?"
                value="Yes"
              />
              <PreviewField label="Total Teaching Faculty" value="45" />
              <PreviewField
                label="Required Faculty (as per intake)"
                value="40"
              />
              <PreviewField label="Student - Teacher Ratio" value="1:18" />
            </FormGrid>
          </PreviewSection>

          <PreviewSection step={3} title="Statutory & Safety Compliances">
            <FormGrid columns={3}>
              <PreviewField
                label="Fire Safety NOC Valid Upto"
                value="12-05-2027"
              />
              <PreviewField
                label="Building Structural Safety Certificate"
                value="Verified & Valid"
              />
              <PreviewField
                label="Barrier-Free Environment (PwD Friendly)"
                value="Available"
              />
            </FormGrid>
          </PreviewSection>

          <PreviewSection step={4} title="Geo-Tagged Evidences">
            <FormGrid columns={4}>
              <PreviewField label="Main Building Front" value="Verified" />
              <PreviewField label="Laboratories" value="Verified" />
              <PreviewField label="Library & Reading Rm" value="Verified" />
              <PreviewField label="Classrooms" value="Verified" />
            </FormGrid>
          </PreviewSection>

          <PreviewSection step={5} title="Final Recommendation">
            <FormGrid columns={1}>
              <PreviewField
                label="Committee Final Decision"
                value="Recommend for Approval"
              />
              <PreviewField
                label="List Major Deficiencies (if any)"
                value="None. The college meets all fundamental requirements."
              />
              <PreviewField
                label="Overall Inspection Remarks"
                value="The campus is well maintained. Faculty is experienced and laboratories are fully equipped as per university standards. Recommended for immediate affiliation."
                fullWidth
              />
            </FormGrid>
          </PreviewSection>

          {data.find(c => c.id === reviewId)?.status === 'Pending' && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 font-medium m-0">
                Please review the detailed inspection report above. You can
                either approve or reject the final affiliation request for{' '}
                <strong>
                  {data.find(c => c.id === reviewId)?.collegeName}
                </strong>
                .
              </p>
            </div>
          )}
        </div>
      </FormPopup>
    </FormPage>
  );
}
