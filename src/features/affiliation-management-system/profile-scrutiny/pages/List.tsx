import { useState } from 'react';
import {
  FormCard,
  FormPage,
  FormPopup,
  FormGrid,
  GridPanel,
  PreviewField,
  PreviewSection,
  StatusBadge,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import GridActionButtons from 'shared/components/grid/GridActionButtons';

// Mock Data
const MOCK_DATA = [
  {
    id: 1,
    collegeName: 'Global Institute of Technology',
    submissionDate: '2026-07-01T10:30:00Z',
    status: 'Pending Verification',
  },
  {
    id: 2,
    collegeName: 'National Science College',
    submissionDate: '2026-06-28T14:15:00Z',
    status: 'Verified',
  },
  {
    id: 3,
    collegeName: 'Sunrise Commerce Academy',
    submissionDate: '2026-07-05T09:00:00Z',
    status: 'Deficiency Raised',
  },
];

export default function ProfileScrutinyList() {
  const [data, setData] = useState(MOCK_DATA);
  const [previewId, setPreviewId] = useState<number | null>(null);

  const handleOpenPreview = (id: number) => {
    setPreviewId(id);
  };

  const handleClosePreview = () => {
    setPreviewId(null);
  };

  const handleAction = (status: 'Verified' | 'Deficiency Raised') => {
    setData(prev =>
      prev.map(item => (item.id === previewId ? { ...item, status } : item))
    );
    handleClosePreview();
  };

  return (
    <FormPage
      title="Profile Scrutiny & Verification"
      description="Verify detailed college profiles before forwarding them for inspection assignment."
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
              field: 'submissionDate',
              header: 'Profile Submitted On',
              cell: item => (
                <span>
                  {new Date(item.submissionDate).toLocaleDateString()}
                </span>
              ),
            },
            {
              field: 'status',
              header: 'Scrutiny Status',
              cell: item => {
                let variant: 'pending' | 'approved' | 'rejected' | 'neutral' =
                  'pending';
                if (item.status === 'Verified') variant = 'approved';
                if (item.status === 'Deficiency Raised') variant = 'rejected';
                return <StatusBadge label={item.status} variant={variant} />;
              },
            },
            {
              header: 'Actions',
              sortable: false,
              width: '140px',
              cell: item => {
                const isPending = item.status === 'Pending Verification';
                return (
                  <div className="flex items-center gap-2">
                    <GridActionButtons
                      onView={() => handleOpenPreview(item.id)}
                      viewTooltip="Review Profile"
                    />
                    {isPending && (
                      <Button
                        variant="primary"
                        size="small"
                        onClick={() => handleOpenPreview(item.id)}
                        label="Review"
                      />
                    )}
                  </div>
                );
              },
            },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={previewId !== null}
        onHide={handleClosePreview}
        title="Profile Scrutiny Review"
        subtitle="Review the detailed profile and verify the documents."
        size="xl"
        footer={
          data.find(c => c.id === previewId)?.status ===
          'Pending Verification' ? (
            <div className="flex gap-2 justify-end w-full">
              <Button
                variant="outlined"
                onClick={() => handleAction('Deficiency Raised')}
                label="Raise Deficiency"
              />
              <Button
                variant="primary"
                onClick={() => handleAction('Verified')}
                label="Verify & Forward"
              />
            </div>
          ) : (
            <div className="flex justify-end w-full">
              <Button
                variant="outlined"
                onClick={handleClosePreview}
                label="Close"
              />
            </div>
          )
        }
      >
        <div className="registration-preview-content">
          <PreviewSection step={1} title="Regulatory NOC Details">
            <FormGrid columns={2}>
              <PreviewField label="NOC Type" value="State Government NOC" />
              <PreviewField label="Reference Number" value="NOC/2026/001" />
              <PreviewField label="Issue Date" value="15 Jan 2026" />
              <PreviewField label="Status" value="Valid and Attached" />
            </FormGrid>
          </PreviewSection>

          <PreviewSection step={2} title="Infrastructure Details">
            <FormGrid columns={3}>
              <PreviewField label="Built-up Area (Sq.M)" value="5500 Sq.M" />
              <PreviewField label="Number of Classrooms" value="15" />
              <PreviewField label="Classroom Size (Sq.M)" value="66 Sq.M" />
              <PreviewField
                label="Number of Laboratories"
                value="5 Active Labs"
              />
              <PreviewField
                label="Library Books Available"
                value="10,250 Books"
              />
              <PreviewField
                label="Total Land Area & Ownership"
                value="5 Acres, Owned"
              />
              <PreviewField
                label="Total Number of Buildings"
                value="3 Buildings"
              />
              <PreviewField
                label="Physical Education Facility"
                value="Sports Grounds, Gym Hall"
              />
              <PreviewField label="Hostel Facility Available?" value="Yes" />
              <PreviewField
                label="Staff Quarter Details"
                value="10 Quarters, Fully Occupied"
              />
            </FormGrid>
          </PreviewSection>

          <PreviewSection step={3} title="Human Resources & Student Amenities">
            <FormGrid columns={2}>
              <PreviewField
                label="Teaching Faculty Details"
                value="15 PhDs, 20 NET Qualified"
              />
              <PreviewField
                label="Non-Teaching & Admin Staff"
                value="25 Total (Admin, Tech, Support)"
              />
              <PreviewField
                label="Core Facilities for Students"
                value="Fully equipped central library, state-of-the-art computer centers with 100+ PCs, modern scientific labs."
                fullWidth
              />
            </FormGrid>
          </PreviewSection>

          {data.find(c => c.id === previewId)?.status ===
            'Pending Verification' && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 font-medium m-0">
                Please review the above details carefully. If everything is
                correct, click <strong>Verify & Forward</strong> to send this
                profile for Inspection Assignment.
              </p>
            </div>
          )}
        </div>
      </FormPopup>
    </FormPage>
  );
}
