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
import { DatePicker, FileUpload, TextBox } from 'shared/components/forms';
import { Grid } from 'shared/components/grid';
import GridActionButtons from 'shared/components/grid/GridActionButtons';
import { Loader } from 'shared/components/progress';
import { useCollegeRegistrationByIdQuery } from '../../college-registration-approval/queries';
import { formatDate } from 'shared/utils/dateUtils';

export interface InspectionMember {
  name: string;
  contactNumber: string;
  designation: string;
  department: string;
}

const emptyMember: InspectionMember = {
  name: '',
  contactNumber: '',
  designation: '',
  department: '',
};

export interface CollegeAssignment {
  id: number;
  collegeName: string;
  submissionDate: string;
  status: string;
  inspectionTeam: string | null;
  inspectionDate: string | null;
  applicationNumber: string;
  inspectionOrder?: File | string | null;
  members?: InspectionMember[];
}

// Mock Data matching the main college approvals mock list
const MOCK_DATA: CollegeAssignment[] = [
  {
    id: 101,
    collegeName: 'Global Institute of Technology',
    submissionDate: '2026-07-01T10:30:00Z',
    status: 'Pending Assignment',
    inspectionTeam: null,
    inspectionDate: null,
    applicationNumber: 'APP-92837',
    inspectionOrder: null,
    members: [],
  },
  {
    id: 102,
    collegeName: 'National College of Arts',
    submissionDate: '2026-06-28T14:15:00Z',
    status: 'Assigned',
    inspectionTeam:
      'Dr. A. Sharma (Professor - Physics), Prof. K. Singh (Associate Professor - Chemistry), Dr. Meena Patel (Associate Professor - Mathematics), Prof. Rajesh Verma (Professor - English)',
    inspectionDate: '2026-07-15',
    applicationNumber: 'APP-54129',
    inspectionOrder: 'inspection_order_102.pdf',
    members: [
      {
        name: 'Dr. A. Sharma',
        contactNumber: '9876543210',
        designation: 'Professor',
        department: 'Physics',
      },
      {
        name: 'Prof. K. Singh',
        contactNumber: '9876543211',
        designation: 'Associate Professor',
        department: 'Chemistry',
      },
      {
        name: 'Dr. Meena Patel',
        contactNumber: '9876543212',
        designation: 'Associate Professor',
        department: 'Mathematics',
      },
      {
        name: 'Prof. Rajesh Verma',
        contactNumber: '9876543213',
        designation: 'Professor',
        department: 'English',
      },
    ],
  },
  {
    id: 103,
    collegeName: 'Sunrise Medical College',
    submissionDate: '2026-07-05T09:00:00Z',
    status: 'Pending Assignment',
    inspectionTeam: null,
    inspectionDate: null,
    applicationNumber: 'APP-76342',
    inspectionOrder: null,
    members: [],
  },
];

export default function InspectionAssignmentList() {
  const [data, setData] = useState<CollegeAssignment[]>(MOCK_DATA);
  const [assigningId, setAssigningId] = useState<number | null>(null);
  const [members, setMembers] = useState<InspectionMember[]>([]);
  const [currentMember, setCurrentMember] =
    useState<InspectionMember>(emptyMember);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [memberError, setMemberError] = useState<string | null>(null);
  const [inspectionOrder, setInspectionOrder] = useState<File | string | null>(
    null
  );
  const [inspectionDate, setInspectionDate] = useState<Date | undefined>(
    undefined
  );
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
    if (existing?.members && existing.members.length > 0) {
      setMembers(existing.members);
    } else if (existing?.inspectionTeam) {
      const parts = existing.inspectionTeam.split(',').map(s => s.trim());
      setMembers(
        parts.map(name => ({
          name,
          contactNumber: '',
          designation: '',
          department: '',
        }))
      );
    } else {
      setMembers([]);
    }
    setCurrentMember(emptyMember);
    setEditingIndex(null);
    setMemberError(null);
    setInspectionOrder(existing?.inspectionOrder || null);
    setInspectionDate(
      existing?.inspectionDate ? new Date(existing.inspectionDate) : undefined
    );
  };

  const handleCloseAssign = () => {
    setAssigningId(null);
    setMembers([]);
    setCurrentMember(emptyMember);
    setEditingIndex(null);
    setMemberError(null);
    setInspectionOrder(null);
    setInspectionDate(undefined);
  };

  const handleAddMoreMember = () => {
    if (!currentMember.name.trim()) {
      setMemberError('Member name is required');
      return;
    }

    setMemberError(null);

    if (editingIndex !== null) {
      setMembers(prev => {
        const updated = [...prev];
        updated[editingIndex] = currentMember;
        return updated;
      });
      setEditingIndex(null);
    } else {
      setMembers(prev => [...prev, currentMember]);
    }

    setCurrentMember(emptyMember);
  };

  const handleEditMember = (index: number) => {
    setEditingIndex(index);
    setCurrentMember(members[index]);
    setMemberError(null);
  };

  const handleRemoveMember = (index: number) => {
    setMembers(prev => prev.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setCurrentMember(emptyMember);
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setCurrentMember(emptyMember);
    setMemberError(null);
  };

  const currentMemberHasName = Boolean(currentMember.name.trim());
  const effectiveMemberCount =
    members.length + (currentMemberHasName && editingIndex === null ? 1 : 0);

  const canSubmit = effectiveMemberCount >= 4 && Boolean(inspectionDate);

  const handleSubmitAssign = () => {
    const finalMembers = [...members];
    if (currentMember.name.trim()) {
      if (editingIndex !== null) {
        finalMembers[editingIndex] = currentMember;
      } else {
        finalMembers.push(currentMember);
      }
    }

    if (finalMembers.length < 4) {
      setMemberError(
        'At least 4 committee members are required for inspection assignment.'
      );
      return;
    }

    if (!inspectionDate) return;

    const teamSummary = finalMembers
      .map(m => {
        const details = [m.designation, m.department]
          .filter(Boolean)
          .join(' - ');
        return details ? `${m.name} (${details})` : m.name;
      })
      .join(', ');

    const dateString = inspectionDate
      ? `${inspectionDate.getFullYear()}-${String(inspectionDate.getMonth() + 1).padStart(2, '0')}-${String(inspectionDate.getDate()).padStart(2, '0')}`
      : null;

    setData(prev =>
      prev.map(item =>
        item.id === assigningId
          ? {
              ...item,
              status: 'Assigned',
              inspectionTeam: teamSummary,
              inspectionDate: dateString,
              inspectionOrder,
              members: finalMembers,
            }
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
              cell: item => (
                <div className="flex flex-col gap-0.5">
                  <span>{item.inspectionTeam || '-'}</span>
                  {item.inspectionOrder && (
                    <span className="text-xs text-blue-600 flex items-center gap-1 font-medium">
                      <i className="pi pi-file-pdf text-[11px]" />
                      {typeof item.inspectionOrder === 'string'
                        ? item.inspectionOrder.split('/').pop()
                        : (item.inspectionOrder as File).name}
                    </span>
                  )}
                </div>
              ),
            },
            {
              field: 'inspectionDate',
              header: 'Inspection Date',
              cell: item => (
                <span>
                  {item.inspectionDate ? formatDate(item.inspectionDate) : '-'}
                </span>
              ),
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
        size="xl"
        footer={
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
            <div>
              {effectiveMemberCount < 4 ? (
                <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium">
                  <i className="pi pi-exclamation-triangle text-amber-500" />
                  At least 4 committee members required ({effectiveMemberCount}
                  /4 added)
                </span>
              ) : (
                <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium">
                  <i className="pi pi-check text-emerald-500" />
                  Minimum 4 members requirement satisfied (
                  {effectiveMemberCount} members)
                </span>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outlined"
                onClick={handleCloseAssign}
                label="Cancel"
              />
              <Button
                variant="primary"
                onClick={handleSubmitAssign}
                disabled={!canSubmit}
                label="Assign"
              />
            </div>
          </div>
        }
      >
        <div className="p-4 flex flex-col gap-4">
          <p className="text-gray-600 text-sm">
            Enter the inspection committee members and the date on which the
            physical inspection is scheduled for the selected college.
          </p>

          {/* Top Section: Inspection Scheduled Date & Inspection Order */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 flex flex-col gap-4">
            <FormGrid columns={2}>
              <DatePicker
                label="Inspection Scheduled Date"
                placeholder="DD/MM/YYYY"
                value={inspectionDate}
                onChange={val => setInspectionDate(val || undefined)}
                required
              />
            </FormGrid>

            <FileUpload
              label="Inspection Order"
              name="inspectionOrder"
              mode="file"
              accept=".pdf,image/*"
              uploadNote="PDF or Image format only, maximum size 2 MB"
              value={inspectionOrder}
              onChange={file => setInspectionOrder(file)}
            />
          </div>

          {/* Member Details Input Section */}
          <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                  <i
                    className={
                      editingIndex !== null ? 'pi pi-pencil' : 'pi pi-user-plus'
                    }
                  />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">
                    {editingIndex !== null
                      ? `Edit Member Details (Member #${editingIndex + 1})`
                      : `Enter Committee Member Details (Member #${members.length + 1}${members.length < 4 ? ` of min. 4 required` : ''})`}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {members.length < 4
                      ? `At least 4 committee members are required. Please add ${4 - members.length} more member${4 - members.length > 1 ? 's' : ''} and click "Add More".`
                      : 'Minimum 4 members requirement satisfied. You can add additional members if needed.'}
                  </p>
                </div>
              </div>
              {editingIndex !== null && (
                <Button
                  type="button"
                  variant="outlined"
                  size="small"
                  label="Cancel Edit"
                  icon="times"
                  onClick={handleCancelEdit}
                />
              )}
            </div>

            <div
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddMoreMember();
                }
              }}
            >
              <FormGrid columns={2}>
                <TextBox
                  label="Name"
                  placeholder="e.g. Dr. John Doe"
                  value={currentMember.name}
                  onChange={val => {
                    setCurrentMember(prev => ({ ...prev, name: val }));
                    if (memberError) setMemberError(null);
                  }}
                  required
                  errorMessage={memberError || undefined}
                />

                <TextBox
                  label="Contact Number"
                  placeholder="e.g. 9876543210"
                  value={currentMember.contactNumber}
                  onChange={val =>
                    setCurrentMember(prev => ({ ...prev, contactNumber: val }))
                  }
                  maxLength={10}
                />

                <TextBox
                  label="Designation"
                  placeholder="e.g. Professor"
                  value={currentMember.designation}
                  onChange={val =>
                    setCurrentMember(prev => ({ ...prev, designation: val }))
                  }
                />

                <TextBox
                  label="Department"
                  placeholder="e.g. Computer Science"
                  value={currentMember.department}
                  onChange={val =>
                    setCurrentMember(prev => ({ ...prev, department: val }))
                  }
                />
              </FormGrid>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200 mt-2">
              <Button
                type="button"
                variant={editingIndex !== null ? 'primary' : 'outlined'}
                size="small"
                icon={editingIndex !== null ? 'check' : 'plus'}
                label={editingIndex !== null ? 'Update Member' : 'Add More'}
                onClick={handleAddMoreMember}
              />
            </div>
          </div>

          {/* Members Table / Grid Below the Fields */}
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Inspection Team Members
                </h4>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {members.length} {members.length === 1 ? 'Member' : 'Members'}
                </span>
              </div>
              {members.length >= 4 ? (
                <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <i className="pi pi-check text-[10px]" />
                  Requirement Satisfied ({members.length} members)
                </span>
              ) : (
                <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <i className="pi pi-info-circle text-[10px]" />
                  Minimum 4 members required ({members.length}/4 added)
                </span>
              )}
            </div>

            <Grid
              data={members.map((m, index) => ({
                ...m,
                originalIndex: index,
              }))}
              columns={[
                {
                  header: '#',
                  cell: (_: any, opt: any) => (
                    <span className="font-semibold text-slate-600 text-xs">
                      {opt.rowIndex + 1}
                    </span>
                  ),
                  width: '50px',
                },
                {
                  header: 'NAME',
                  cell: (item: any) => (
                    <span className="font-medium text-slate-900">
                      {item.name}
                    </span>
                  ),
                },
                {
                  header: 'CONTACT NUMBER',
                  cell: (item: any) => (
                    <span className="text-slate-600 font-mono text-xs">
                      {item.contactNumber || '-'}
                    </span>
                  ),
                },
                {
                  header: 'DESIGNATION',
                  cell: (item: any) => (
                    <span className="text-slate-700 text-sm">
                      {item.designation || '-'}
                    </span>
                  ),
                },
                {
                  header: 'DEPARTMENT',
                  cell: (item: any) => (
                    <span className="text-slate-700 text-sm">
                      {item.department || '-'}
                    </span>
                  ),
                },
              ]}
              pagination={false}
              onEdit={(item: any) => handleEditMember(item.originalIndex)}
              onRemove={(item: any) => handleRemoveMember(item.originalIndex)}
              emptyMessage="No inspection members added yet. Fill the details above and click 'Add More'."
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
                  label="Description of Building & Surroundings"
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

              <div className="border-t border-gray-100 pt-4 mb-4">
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
                </FormGrid>
                <div className="mt-2">
                  <PreviewField
                    label="Lab Equipment Details"
                    value={preview.labEquipmentDetails}
                    fullWidth
                  />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Hostel & Accommodation Details
                </h4>
                <FormGrid columns={3}>
                  <PreviewField
                    label="Hostel Available?"
                    value={preview.hostelAvailable}
                  />
                  <PreviewField
                    label="Type of Hostel"
                    value={preview.typeOfHostel}
                  />
                  <PreviewField
                    label="Boys Hostels Count"
                    value={preview.boysHostelsCount}
                  />
                  <PreviewField
                    label="Girls Hostels Count"
                    value={preview.girlsHostelsCount}
                  />
                  <PreviewField
                    label="Total Hostel Capacity"
                    value={preview.totalHostelCapacity}
                  />
                  <PreviewField
                    label="Accommodation Availability"
                    value={preview.accommodationAvailability}
                  />
                </FormGrid>
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
