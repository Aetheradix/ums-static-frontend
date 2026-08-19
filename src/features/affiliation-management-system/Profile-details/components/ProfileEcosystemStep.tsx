import { useState } from 'react';
import { useWatch } from 'react-hook-form';
import type { Control, FormState, Path } from 'react-hook-form';
import { Button } from 'shared/components/buttons';
import { DatePicker, DropDownList, TextBox } from 'shared/components/forms';
import { Grid } from 'shared/components/grid';
import { Modal } from 'shared/components/popups';
import { FormCard, FormGrid } from 'shared/new-components';
import type { ProfileDetailsFormData } from './form.hook';

interface ProfileEcosystemStepProps {
  register: (name: Path<ProfileDetailsFormData>) => {
    control: Control<ProfileDetailsFormData>;
    name: Path<ProfileDetailsFormData>;
  };
  control: Control<ProfileDetailsFormData>;
  formState: FormState<ProfileDetailsFormData>;
  teachingStaffArray: any;
  nonTeachingStaffArray: any;
  trigger?: any;
}

const courseOptions = [
  { id: 'btech', name: 'B.Tech' },
  { id: 'mtech', name: 'M.Tech' },
  { id: 'bsc', name: 'B.Sc' },
  { id: 'msc', name: 'M.Sc' },
  { id: 'bba', name: 'BBA' },
  { id: 'mba', name: 'MBA' },
  { id: 'bca', name: 'BCA' },
  { id: 'mca', name: 'MCA' },
  { id: 'bcom', name: 'B.Com' },
  { id: 'mcom', name: 'M.Com' },
  { id: 'ba', name: 'B.A' },
  { id: 'ma', name: 'M.A' },
  { id: 'diploma', name: 'Diploma' },
  { id: 'other', name: 'Other' },
];

const subjectOptions = [
  { id: 'maths', name: 'Mathematics' },
  { id: 'physics', name: 'Physics' },
  { id: 'chemistry', name: 'Chemistry' },
  { id: 'computer_science', name: 'Computer Science' },
  { id: 'mechanical', name: 'Mechanical Engineering' },
  { id: 'civil', name: 'Civil Engineering' },
  { id: 'electrical', name: 'Electrical Engineering' },
  { id: 'english', name: 'English' },
  { id: 'biology', name: 'Biology' },
  { id: 'other', name: 'Other' },
];

const courseToSubjectMap: Record<string, string[]> = {
  btech: [
    'maths',
    'physics',
    'chemistry',
    'computer_science',
    'mechanical',
    'civil',
    'electrical',
  ],
  mtech: ['computer_science', 'mechanical', 'civil', 'electrical'],
  bsc: ['maths', 'physics', 'chemistry', 'computer_science', 'biology'],
  msc: ['maths', 'physics', 'chemistry', 'computer_science', 'biology'],
  bba: ['maths', 'english', 'other'],
  mba: ['maths', 'english', 'other'],
  bca: ['maths', 'computer_science', 'english'],
  mca: ['computer_science', 'maths'],
  bcom: ['maths', 'english', 'other'],
  mcom: ['maths', 'english', 'other'],
  ba: ['english', 'other'],
  ma: ['english', 'other'],
  diploma: [
    'maths',
    'physics',
    'chemistry',
    'mechanical',
    'civil',
    'electrical',
    'computer_science',
  ],
  other: [
    'maths',
    'physics',
    'chemistry',
    'computer_science',
    'mechanical',
    'civil',
    'electrical',
    'english',
    'biology',
    'other',
  ],
};

export default function ProfileEcosystemStep({
  register,
  control,
  formState,
  teachingStaffArray,
  nonTeachingStaffArray,
  trigger,
}: ProfileEcosystemStepProps) {
  const {
    fields: staffFields,
    append: appendStaff,
    remove: removeStaff,
  } = teachingStaffArray;
  const {
    fields: nonTeachingFields,
    append: appendNonTeaching,
    remove: removeNonTeaching,
  } = nonTeachingStaffArray;

  const teachingStaffWatch = useWatch({
    control,
    name: 'teachingStaff',
  });

  const nonTeachingStaffWatch = useWatch({
    control,
    name: 'nonTeachingStaff',
  });

  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaffIndex, setEditingStaffIndex] = useState<number | null>(
    null
  );

  const [isNonTeachingModalOpen, setIsNonTeachingModalOpen] = useState(false);
  const [editingNonTeachingIndex, setEditingNonTeachingIndex] = useState<
    number | null
  >(null);

  return (
    <>
      <FormCard title="TEACHING STAFF" icon="users">
        <div className="mb-4">
          <Grid
            data={staffFields.map((field: any, index: number) => {
              const staff = teachingStaffWatch?.[index] || field;
              return { ...staff, originalIndex: index };
            })}
            columns={[
              { header: 'NAME', cell: (item: any) => item.name || '' },
              {
                header: 'COURSE',
                cell: (item: any) =>
                  courseOptions.find(o => o.id === item.course)?.name ||
                  item.course ||
                  '',
              },
              {
                header: 'SUBJECT',
                cell: (item: any) =>
                  subjectOptions.find(o => o.id === item.subject)?.name ||
                  item.subject ||
                  '',
              },
              {
                header: 'ROLE',
                cell: (item: any) => {
                  const roleOpts = [
                    { id: 'principal', name: 'Principal' },
                    { id: 'hod', name: 'HOD' },
                    { id: 'assistant_professor', name: 'Assistant Professor' },
                  ];
                  return (
                    roleOpts.find(o => o.id === item.role)?.name ||
                    item.role ||
                    ''
                  );
                },
              },
              {
                header: 'STATUS',
                cell: (item: any) => {
                  const statusOpts = [
                    { id: 'permanent', name: 'Permanent' },
                    { id: 'temporary', name: 'Temporary' },
                  ];
                  return (
                    statusOpts.find(o => o.id === item.status)?.name ||
                    item.status ||
                    ''
                  );
                },
              },
              {
                header: 'QUALIFICATION',
                cell: (item: any) => item.qualification || '',
              },
              {
                header: 'EXPERIENCE',
                cell: (item: any) => item.experience || '',
              },
              {
                header: 'CODE 28',
                cell: (item: any) =>
                  item.collegeCode28 === 'yes'
                    ? 'Yes'
                    : item.collegeCode28 === 'no'
                      ? 'No'
                      : '',
              },
            ]}
            pagination={false}
            onEdit={(item: any) => {
              setEditingStaffIndex(item.originalIndex);
              setIsStaffModalOpen(true);
            }}
            onRemove={(item: any) => removeStaff(item.originalIndex)}
          />
          {formState.errors.teachingStaff?.root?.message && (
            <div className="p-error text-sm mt-2">
              {formState.errors.teachingStaff.root.message}
            </div>
          )}
          <div className="mt-4">
            <Button
              label="Add Staff"
              icon="plus"
              variant="outlined"
              onClick={() => {
                appendStaff({
                  name: '',
                  role: '',
                  status: '',
                  qualification: '',
                  experience: '',
                  joiningDate: null,
                  dateOfBirth: null,
                  course: '',
                  subject: '',
                  collegeCode28: '',
                });
                setEditingStaffIndex(staffFields.length);
                setIsStaffModalOpen(true);
              }}
            />
          </div>
        </div>

        <Modal
          header="Teaching Staff Details"
          visible={isStaffModalOpen}
          onHide={() => {
            if (editingStaffIndex !== null) {
              const currentStaff = teachingStaffWatch?.[editingStaffIndex];
              if (!currentStaff?.name) {
                removeStaff(editingStaffIndex);
              }
            }
            setIsStaffModalOpen(false);
            setEditingStaffIndex(null);
          }}
          size="large"
        >
          {editingStaffIndex !== null && (
            <div className="p-4">
              <FormGrid columns={3}>
                <TextBox
                  label="Name"
                  placeholder="Enter Name"
                  {...register(`teachingStaff.${editingStaffIndex}.name`)}
                  errorMessage={
                    formState.errors.teachingStaff?.[editingStaffIndex]?.name
                      ?.message as string
                  }
                  required
                />
                <DropDownList
                  label="Role"
                  name={`teachingStaff.${editingStaffIndex}.role`}
                  control={control}
                  placeholder="Select Role"
                  data={[
                    { id: 1, name: 'Principal' },
                    { id: 2, name: 'HOD' },
                    { id: 3, name: 'Assistant Professor' },
                  ]}
                  textField="name"
                  valueField="id"
                  errorMessage={
                    formState.errors.teachingStaff?.[editingStaffIndex]?.role
                      ?.message as string
                  }
                />
                <DropDownList
                  label="Status"
                  name={`teachingStaff.${editingStaffIndex}.status`}
                  control={control}
                  placeholder="Select Status"
                  data={[
                    { id: 1, name: 'Permanent' },
                    { id: 2, name: 'Temporary' },
                  ]}
                  textField="name"
                  valueField="id"
                  errorMessage={
                    formState.errors.teachingStaff?.[editingStaffIndex]?.status
                      ?.message as string
                  }
                />
                <DropDownList
                  label="Qualification"
                  name={`teachingStaff.${editingStaffIndex}.qualification`}
                  control={control}
                  placeholder="Select Qualification"
                  data={[
                    { id: 1, name: 'Ph.D' },
                    { id: 2, name: 'Post Graduate (PG)' },
                    { id: 3, name: 'Graduate (UG)' },
                    { id: 4, name: 'Diploma' },
                    { id: 5, name: 'Other' },
                  ]}
                  textField="name"
                  valueField="id"
                  errorMessage={
                    formState.errors.teachingStaff?.[editingStaffIndex]
                      ?.qualification?.message as string
                  }
                />
                <TextBox
                  label="Experience"
                  placeholder="Enter Experience"
                  {...register(`teachingStaff.${editingStaffIndex}.experience`)}
                  errorMessage={
                    formState.errors.teachingStaff?.[editingStaffIndex]
                      ?.experience?.message as string
                  }
                />
                <DatePicker
                  label="Joining Date"
                  name={`teachingStaff.${editingStaffIndex}.joiningDate`}
                  control={control}
                  placeholder="Select Date"
                  errorMessage={
                    formState.errors.teachingStaff?.[editingStaffIndex]
                      ?.joiningDate?.message as string
                  }
                />
                <DatePicker
                  label="Date of Birth"
                  name={`teachingStaff.${editingStaffIndex}.dateOfBirth`}
                  control={control}
                  placeholder="Select Date"
                  errorMessage={
                    formState.errors.teachingStaff?.[editingStaffIndex]
                      ?.dateOfBirth?.message as string
                  }
                />
                <DropDownList
                  label="Course"
                  name={`teachingStaff.${editingStaffIndex}.course`}
                  control={control}
                  placeholder="Select Course"
                  data={courseOptions}
                  textField="name"
                  valueField="id"
                  errorMessage={
                    formState.errors.teachingStaff?.[editingStaffIndex]?.course
                      ?.message as string
                  }
                />
                <DropDownList
                  label="Subject"
                  name={`teachingStaff.${editingStaffIndex}.subject`}
                  control={control}
                  placeholder={
                    teachingStaffWatch?.[editingStaffIndex]?.course
                      ? 'Select Subject'
                      : 'Select Course First'
                  }
                  data={
                    teachingStaffWatch?.[editingStaffIndex]?.course
                      ? subjectOptions.filter(sub =>
                          courseToSubjectMap[
                            teachingStaffWatch?.[editingStaffIndex]?.course
                          ]?.includes(sub.id)
                        )
                      : []
                  }
                  textField="name"
                  valueField="id"
                  errorMessage={
                    formState.errors.teachingStaff?.[editingStaffIndex]?.subject
                      ?.message as string
                  }
                  disabled={!teachingStaffWatch?.[editingStaffIndex]?.course}
                />
                <DropDownList
                  label="College Code 28?"
                  name={`teachingStaff.${editingStaffIndex}.collegeCode28`}
                  control={control}
                  placeholder="Select"
                  data={[
                    { id: 'yes', name: 'Yes' },
                    { id: 'no', name: 'No' },
                  ]}
                  textField="name"
                  valueField="id"
                  errorMessage={
                    formState.errors.teachingStaff?.[editingStaffIndex]
                      ?.collegeCode28?.message as string
                  }
                />
              </FormGrid>
              <div className="mt-6 flex justify-end">
                <Button
                  label="Save"
                  onClick={async () => {
                    const currentStaff =
                      teachingStaffWatch?.[editingStaffIndex];
                    if (!currentStaff?.name) {
                      if (trigger)
                        await trigger(
                          `teachingStaff.${editingStaffIndex}.name`
                        );
                      return;
                    }
                    if (trigger) {
                      const isValid = await trigger(
                        `teachingStaff.${editingStaffIndex}`
                      );
                      if (!isValid) return;
                    }
                    setIsStaffModalOpen(false);
                    setEditingStaffIndex(null);
                  }}
                />
              </div>
            </div>
          )}
        </Modal>
      </FormCard>

      <FormCard title="NON-TEACHING STAFF" icon="id-card">
        <div className="mb-4">
          <Grid
            data={nonTeachingFields.map((field: any, index: number) => {
              const staff = nonTeachingStaffWatch?.[index] || field;
              return { ...staff, originalIndex: index };
            })}
            columns={[
              { header: 'NAME', cell: (item: any) => item.name || '' },
              {
                header: 'DESIGNATION',
                cell: (item: any) => item.designation || '',
              },
              {
                header: 'STATUS',
                cell: (item: any) => {
                  const statusOpts = [
                    { id: 'permanent', name: 'Permanent' },
                    { id: 'temporary', name: 'Temporary' },
                  ];
                  return (
                    statusOpts.find(o => o.id === item.status)?.name ||
                    item.status ||
                    ''
                  );
                },
              },
              {
                header: 'JOINING DATE',
                cell: (item: any) =>
                  item.joiningDate
                    ? new Date(item.joiningDate).toLocaleDateString('en-IN')
                    : '',
              },
            ]}
            pagination={false}
            onEdit={(item: any) => {
              setEditingNonTeachingIndex(item.originalIndex);
              setIsNonTeachingModalOpen(true);
            }}
            onRemove={(item: any) => removeNonTeaching(item.originalIndex)}
          />
          {formState.errors.nonTeachingStaff?.root?.message && (
            <div className="p-error text-sm mt-2">
              {formState.errors.nonTeachingStaff.root.message}
            </div>
          )}
          <div className="mt-4">
            <Button
              label="Add Non-Teaching Staff"
              icon="plus"
              variant="outlined"
              onClick={() => {
                appendNonTeaching({
                  name: '',
                  designation: '',
                  status: '',
                  joiningDate: null,
                });
                setEditingNonTeachingIndex(nonTeachingFields.length);
                setIsNonTeachingModalOpen(true);
              }}
            />
          </div>
        </div>

        <Modal
          header="Non-Teaching Staff Details"
          visible={isNonTeachingModalOpen}
          onHide={() => {
            if (editingNonTeachingIndex !== null) {
              const currentStaff =
                nonTeachingStaffWatch?.[editingNonTeachingIndex];
              if (!currentStaff?.name) {
                removeNonTeaching(editingNonTeachingIndex);
              }
            }
            setIsNonTeachingModalOpen(false);
            setEditingNonTeachingIndex(null);
          }}
          size="large"
        >
          {editingNonTeachingIndex !== null && (
            <div className="p-4">
              <FormGrid columns={2}>
                <TextBox
                  label="Name"
                  placeholder="Enter Name"
                  {...register(
                    `nonTeachingStaff.${editingNonTeachingIndex}.name`
                  )}
                  errorMessage={
                    formState.errors.nonTeachingStaff?.[editingNonTeachingIndex]
                      ?.name?.message as string
                  }
                  required
                />
                <TextBox
                  label="Designation"
                  placeholder="e.g. Lab Assistant, Clerk, Peon"
                  {...register(
                    `nonTeachingStaff.${editingNonTeachingIndex}.designation`
                  )}
                  errorMessage={
                    formState.errors.nonTeachingStaff?.[editingNonTeachingIndex]
                      ?.designation?.message as string
                  }
                />
                <DropDownList
                  label="Status"
                  name={`nonTeachingStaff.${editingNonTeachingIndex}.status`}
                  control={control}
                  placeholder="Select Status"
                  data={[
                    { id: 'permanent', name: 'Permanent' },
                    { id: 'temporary', name: 'Temporary' },
                  ]}
                  textField="name"
                  valueField="id"
                  errorMessage={
                    formState.errors.nonTeachingStaff?.[editingNonTeachingIndex]
                      ?.status?.message as string
                  }
                />
                <DatePicker
                  label="Joining Date"
                  name={`nonTeachingStaff.${editingNonTeachingIndex}.joiningDate`}
                  control={control}
                  placeholder="Select Date"
                  errorMessage={
                    formState.errors.nonTeachingStaff?.[editingNonTeachingIndex]
                      ?.joiningDate?.message as string
                  }
                />
              </FormGrid>
              <div className="mt-6 flex justify-end">
                <Button
                  label="Save"
                  onClick={async () => {
                    const currentStaff =
                      nonTeachingStaffWatch?.[editingNonTeachingIndex];
                    if (!currentStaff?.name) {
                      if (trigger)
                        await trigger(
                          `nonTeachingStaff.${editingNonTeachingIndex}.name`
                        );
                      return;
                    }
                    if (trigger) {
                      const isValid = await trigger(
                        `nonTeachingStaff.${editingNonTeachingIndex}`
                      );
                      if (!isValid) return;
                    }
                    setIsNonTeachingModalOpen(false);
                    setEditingNonTeachingIndex(null);
                  }}
                />
              </div>
            </div>
          )}
        </Modal>
      </FormCard>
    </>
  );
}
