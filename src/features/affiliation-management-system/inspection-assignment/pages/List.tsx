import { useState } from 'react';
import {
  FormCard,
  FormPage,
  FormPopup,
  FormGrid,
  GridPanel,
  PreviewField,
  PreviewSection,
  PreviewSummary,
  StatusBadge,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import GridActionButtons from 'shared/components/grid/GridActionButtons';
import { Loader } from 'shared/components/progress';
import { useCollegeRegistrationByIdQuery } from '../../college-registration-approval/queries';
import { formatDate } from 'shared/utils/dateUtils';

// Mock Data matching the main college approvals mock list
const MOCK_DATA = [
  {
    id: 101,
    collegeName: 'Global Institute of Technology',
    submissionDate: '2026-07-01T10:30:00Z',
    status: 'Pending Assignment',
    inspectionTeam: null,
    applicationNumber: 'APP-92837',
  },
  {
    id: 102,
    collegeName: 'National College of Arts',
    submissionDate: '2026-06-28T14:15:00Z',
    status: 'Assigned',
    inspectionTeam: 'Dr. A. Sharma, Prof. K. Singh',
    applicationNumber: 'APP-54129',
  },
  {
    id: 103,
    collegeName: 'Sunrise Medical College',
    submissionDate: '2026-07-05T09:00:00Z',
    status: 'Pending Assignment',
    inspectionTeam: null,
    applicationNumber: 'APP-76342',
  },
];

export default function InspectionAssignmentList() {
  const [data, setData] = useState(MOCK_DATA);
  const [assigningId, setAssigningId] = useState<number | null>(null);
  const [teamMembers, setTeamMembers] = useState('');
  const [previewId, setPreviewId] = useState<number | null>(null);

  const { data: previewData, isLoading: isPreviewLoading } =
    useCollegeRegistrationByIdQuery(previewId);

  const preview: any = previewData;

  const selectedCollege = data.find(c => c.id === previewId);

  const handleOpenPreview = (id: number) => {
    setPreviewId(id);
  };

  const handleClosePreview = () => {
    setPreviewId(null);
  };

  const handleOpenAssign = (id: number) => {
    setAssigningId(id);
    const existing = data.find(item => item.id === id);
    setTeamMembers(existing?.inspectionTeam || '');
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
        title="College Affiliation Profile Review"
        subtitle="Review detailed college registration data before assignment."
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
        {isPreviewLoading ? (
          <Loader />
        ) : preview ? (
          <div className="registration-preview-content">
            <PreviewSummary
              items={[
                {
                  label: 'College Name',
                  value: preview.collegeName,
                  icon: 'building',
                },
                {
                  label: 'Application Number',
                  value: selectedCollege?.applicationNumber,
                  icon: 'file',
                },
                {
                  label: 'Verified Date',
                  value: selectedCollege?.submissionDate
                    ? formatDate(selectedCollege.submissionDate)
                    : undefined,
                  icon: 'calendar',
                },
                {
                  label: 'Inspection Status',
                  value: (
                    <StatusBadge
                      label={selectedCollege?.status || 'Pending'}
                      variant={
                        selectedCollege?.status === 'Assigned'
                          ? 'approved'
                          : 'pending'
                      }
                    />
                  ),
                  icon: 'check-circle',
                },
              ]}
            />

            <PreviewSection
              step={1}
              title="College Registration Details"
              subtitle="Basic registration details submitted by the college."
            >
              <FormGrid columns={3}>
                <PreviewField
                  label="College Name"
                  value={preview.collegeName}
                />
                <PreviewField
                  label="College Type"
                  value={
                    preview.collegeTypeId === 1
                      ? 'Government'
                      : preview.collegeTypeId === 2
                        ? 'Private'
                        : preview.collegeTypeId === 3
                          ? 'Aided'
                          : preview.collegeTypeId === 4
                            ? 'Unaided'
                            : 'Other'
                  }
                />
                <PreviewField
                  label="College Official Email"
                  value={preview.collegeEmail}
                  breakWord
                />
                <PreviewField
                  label="Principal Name"
                  value={
                    preview.affiliation?.principalDirectorName ||
                    preview.principalDirectorName
                  }
                />
                <PreviewField
                  label="Principal Mobile Number"
                  value={
                    preview.affiliation?.principalMobileNo ||
                    preview.principalMobileNo
                  }
                />
                <PreviewField
                  label="Principal Email ID"
                  value={
                    preview.affiliation?.principalEmail ||
                    preview.principalEmail
                  }
                  breakWord
                />
                <PreviewField label="State" value="Madhya Pradesh" />
                <PreviewField
                  label="District"
                  value={preview.districtName || 'Indore'}
                />
                <PreviewField
                  label="Block / Tehsil"
                  value={preview.blockTehsil || 'Indore'}
                />
                <PreviewField
                  label="PIN Code"
                  value={preview.pinCode || '452001'}
                />
                <PreviewField
                  label="College Address"
                  value={preview.collegeAddress}
                  fullWidth
                />
              </FormGrid>
            </PreviewSection>

            <PreviewSection
              step={2}
              title="Ownership & Management"
              subtitle="Ownership entity and chairman/secretary details."
            >
              <FormGrid columns={3}>
                <PreviewField
                  label="Ownership Entity Name"
                  value={preview.ownershipEntityName}
                />
                <PreviewField
                  label="Chairman Name"
                  value={preview.chairmanName}
                />
                <PreviewField
                  label="Chairman Qualification"
                  value={preview.chairmanQualification}
                />
                <PreviewField
                  label="Chairman Mobile"
                  value={preview.chairmanMobileNumber}
                />
                <PreviewField
                  label="Executive Name"
                  value={preview.executiveName}
                />
                <PreviewField
                  label="Executive Mobile"
                  value={preview.executiveMobileNumber}
                />
              </FormGrid>

              {preview.governingBodyMembers?.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Governing Body Members
                  </h4>
                  <GridPanel
                    data={preview.governingBodyMembers}
                    pagination={false}
                    columns={[
                      { field: 'memberName', header: 'Member Name' },
                      { field: 'qualification', header: 'Qualification' },
                      { field: 'age', header: 'Age' },
                      { field: 'mobileNumber', header: 'Mobile Number' },
                      { field: 'occupationAddress', header: 'Address' },
                    ]}
                  />
                </div>
              )}
            </PreviewSection>

            <PreviewSection
              step={3}
              title="Ecosystem & Academics"
              subtitle="Courses, staff and institutions details."
            >
              {preview.existingCourses?.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Proposed / Existing Courses
                  </h4>
                  <GridPanel
                    data={preview.existingCourses}
                    pagination={false}
                    columns={[
                      { field: 'courseName', header: 'Course Name' },
                      { field: 'seats', header: 'Seats' },
                      { field: 'class', header: 'Class' },
                      { field: 'type', header: 'Type' },
                      { field: 'statusOfCompliance', header: 'Status' },
                    ]}
                  />
                </div>
              )}

              {preview.teachingStaff?.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Teaching Staff
                  </h4>
                  <GridPanel
                    data={preview.teachingStaff}
                    pagination={false}
                    columns={[
                      { field: 'name', header: 'Name' },
                      { field: 'role', header: 'Role' },
                      { field: 'qualification', header: 'Qualification' },
                      { field: 'experience', header: 'Experience' },
                    ]}
                  />
                </div>
              )}

              {preview.additionalInstitutions?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Other Running Institutions
                  </h4>
                  <GridPanel
                    data={preview.additionalInstitutions}
                    pagination={false}
                    columns={[
                      { field: 'institutionName', header: 'Institution Name' },
                      { field: 'course', header: 'Course' },
                      { field: 'seats', header: 'Seats' },
                      { field: 'address', header: 'Address' },
                    ]}
                  />
                </div>
              )}
            </PreviewSection>

            <PreviewSection
              step={4}
              title="Infrastructure & Facilities"
              subtitle="Campus area, building, library and labs details."
            >
              <FormGrid columns={3}>
                <PreviewField label="Total Area" value={preview.totalArea} />
                <PreviewField
                  label="Building Type"
                  value={preview.isRentedBuilding}
                />
                <PreviewField
                  label="Quality of Building"
                  value={preview.qualityOfBuilding}
                />
                <PreviewField
                  label="Required Classrooms"
                  value={preview.requiredClassrooms}
                />
                <PreviewField
                  label="Accessible to Public"
                  value={preview.accessibleToPublic}
                />
                <PreviewField
                  label="Parking Space"
                  value={preview.parkingSpace}
                />
              </FormGrid>
              <div className="mt-2 mb-4">
                <PreviewField
                  label="Classrooms Details"
                  value={preview.classroomDetails}
                  fullWidth
                />
              </div>

              <div className="border-t border-gray-100 pt-4 mb-4">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Library Details
                </h4>
                <FormGrid columns={3}>
                  <PreviewField
                    label="Books Count"
                    value={preview.libraryBooksCount}
                  />
                  <PreviewField
                    label="Book-Student Ratio"
                    value={preview.bookStudentRatio}
                  />
                  <PreviewField
                    label="Reading Room Area"
                    value={preview.readingRoomDimensions}
                  />
                  <PreviewField
                    label="Journals Count"
                    value={preview.journalsCount}
                  />
                </FormGrid>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Laboratory & Facilities
                </h4>
                <FormGrid columns={3}>
                  <PreviewField
                    label="Laboratory Floor Space"
                    value={preview.labFloorSpace}
                  />
                  <PreviewField
                    label="Exclusive Labs"
                    value={preview.labExclusive}
                  />
                  <PreviewField
                    label="Hostel Capacity"
                    value={preview.totalHostelCapacity}
                  />
                </FormGrid>
                <div className="mt-2">
                  <PreviewField
                    label="Lab Equipment Details"
                    value={preview.labEquipmentDetails}
                    fullWidth
                  />
                </div>
              </div>
            </PreviewSection>

            <PreviewSection
              step={5}
              title="Compliance & Funding"
              subtitle="Statutory guidelines and approvals status."
            >
              <FormGrid columns={3}>
                <PreviewField
                  label="Source of Funding"
                  value={preview.sourceOfFunding}
                />
                <PreviewField
                  label="Annual Projected Income"
                  value={preview.annualProjectedIncome}
                />
                <PreviewField
                  label="Accounts Audited"
                  value={preview.accountsAudited}
                />
                <PreviewField
                  label="Statute 28 Fulfilled"
                  value={preview.statute28Fulfilled}
                />
                <PreviewField
                  label="Endowment Fund"
                  value={preview.endowmentFundDetails}
                />
              </FormGrid>
              <div className="mt-2">
                <PreviewField
                  label="MP Govt Permission Details"
                  value={preview.mpGovtPermission}
                  fullWidth
                />
              </div>
            </PreviewSection>
          </div>
        ) : (
          <p>No preview data available.</p>
        )}
      </FormPopup>
    </FormPage>
  );
}
