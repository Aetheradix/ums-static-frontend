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
    status: 'Pending Assignment',
    inspectionTeam: null,
  },
  {
    id: 2,
    collegeName: 'National Science College',
    submissionDate: '2026-06-28T14:15:00Z',
    status: 'Assigned',
    inspectionTeam: 'Dr. A. Sharma, Prof. K. Singh',
  },
  {
    id: 3,
    collegeName: 'Sunrise Commerce Academy',
    submissionDate: '2026-07-05T09:00:00Z',
    status: 'Pending Assignment',
    inspectionTeam: null,
  },
];

export default function InspectionAssignmentList() {
  const [data, setData] = useState(MOCK_DATA);
  const [assigningId, setAssigningId] = useState<number | null>(null);
  const [teamMembers, setTeamMembers] = useState('');
  const [previewId, setPreviewId] = useState<number | null>(null);

  const handleOpenPreview = (id: number) => {
    setPreviewId(id);
  };

  const handleClosePreview = () => {
    setPreviewId(null);
  };

  const handleOpenAssign = (id: number) => {
    setAssigningId(id);
    setTeamMembers('');
  };

  const handleCloseAssign = () => {
    setAssigningId(null);
  };

  const handleSubmitAssign = () => {
    if (!teamMembers.trim()) return;

    setData(prev =>
      prev.map(item =>
        item.id === assigningId
          ? { ...item, status: 'Assigned', inspectionTeam: teamMembers }
          : item
      )
    );
    handleCloseAssign();
  };

  return (
    <FormPage
      title="Profile Review & Inspection Assignment"
      description="Review detailed profiles and assign inspection teams to colleges."
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
              header: 'Profile Verified On',
              cell: item => (
                <span>
                  {new Date(item.submissionDate).toLocaleDateString()}
                </span>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              cell: item => (
                <StatusBadge
                  label={item.status}
                  variant={item.status === 'Assigned' ? 'approved' : 'pending'}
                />
              ),
            },
            {
              field: 'inspectionTeam',
              header: 'Assigned Team',
              cell: item => <span>{item.inspectionTeam || '-'}</span>,
            },
            {
              header: 'Actions',
              sortable: false,
              width: '140px',
              cell: item => {
                const isPending = item.status === 'Pending Assignment';
                return (
                  <div className="flex items-center gap-2">
                    <GridActionButtons
                      onView={() => handleOpenPreview(item.id)}
                      viewTooltip="View Profile"
                    />
                    {isPending ? (
                      <Button
                        variant="primary"
                        size="small"
                        onClick={() => handleOpenAssign(item.id)}
                        label="Assign Team"
                      />
                    ) : (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleOpenAssign(item.id)}
                        label="Re-Assign"
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
        visible={assigningId !== null}
        onHide={handleCloseAssign}
        title="Assign Inspection Team"
        footer={
          <div className="flex gap-2 justify-end w-full">
            <Button
              variant="outlined"
              onClick={handleCloseAssign}
              label="Cancel"
            />
            <Button
              variant="primary"
              onClick={handleSubmitAssign}
              disabled={!teamMembers.trim()}
              label="Assign"
            />
          </div>
        }
      >
        <div className="p-4 flex flex-col gap-4">
          <p className="text-gray-600">
            Please enter the names of the inspection committee members for the
            selected college.
          </p>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Team Members
            </label>
            <input
              type="text"
              className="p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="e.g. Dr. John Doe, Prof. Jane Smith"
              value={teamMembers}
              onChange={e => setTeamMembers(e.target.value)}
            />
          </div>
        </div>
      </FormPopup>

      {/* Profile Details Preview Popup */}
      <FormPopup
        visible={previewId !== null}
        onHide={handleClosePreview}
        title="College Profile Details"
        subtitle="Review the detailed profile submitted by the college."
        size="xl"
        footer={
          <div className="flex justify-end w-full">
            <Button
              variant="outlined"
              onClick={handleClosePreview}
              label="Close"
            />
          </div>
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
            'Pending Assignment' && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 font-medium m-0">
                After reviewing this profile, you can close this window and
                proceed to <strong>Assign Team</strong> for physical inspection.
              </p>
            </div>
          )}
        </div>
      </FormPopup>
    </FormPage>
  );
}
