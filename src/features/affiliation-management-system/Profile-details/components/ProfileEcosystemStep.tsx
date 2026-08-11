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
  existingCoursesArray: any;
  teachingStaffArray: any;
  additionalInstitutionsArray: any;
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

const FEE_MASTER: Record<string, number> = {
  btech: 50000,
  mtech: 60000,
  bsc: 25000,
  msc: 30000,
  bba: 20000,
  mba: 40000,
  bca: 25000,
  mca: 35000,
  bcom: 20000,
  mcom: 25000,
  ba: 15000,
  ma: 20000,
  diploma: 30000,
  other: 10000,
};

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
  existingCoursesArray,
  teachingStaffArray,
  additionalInstitutionsArray,
  trigger,
}: ProfileEcosystemStepProps) {
  const {
    fields: courseFields,
    append: appendCourse,
    remove: removeCourse,
  } = existingCoursesArray;
  const {
    fields: staffFields,
    append: appendStaff,
    remove: removeStaff,
  } = teachingStaffArray;
  const {
    fields: instFields,
    append: appendInst,
    remove: removeInst,
  } = additionalInstitutionsArray;

  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourseIndex, setEditingCourseIndex] = useState<number | null>(
    null
  );

  const existingCoursesWatch = useWatch({
    control,
    name: 'existingCourses',
  });

  const feeData = (existingCoursesWatch || []).map((courseItem: any) => {
    const courseId = courseItem.courseName;
    const courseName =
      courseOptions.find(o => o.id === courseId)?.name ||
      courseId ||
      'Unknown Course';
    const fee = FEE_MASTER[courseId as string] || 0;
    return { courseName, fee };
  });

  const totalFee = feeData.reduce(
    (acc: number, curr: any) => acc + curr.fee,
    0
  );

  const teachingStaffWatch = useWatch({
    control,
    name: 'teachingStaff',
  });

  const additionalInstitutionsWatch = useWatch({
    control,
    name: 'additionalInstitutions',
  });

  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaffIndex, setEditingStaffIndex] = useState<number | null>(
    null
  );

  const [isInstModalOpen, setIsInstModalOpen] = useState(false);
  const [editingInstIndex, setEditingInstIndex] = useState<number | null>(null);

  return (
    <>
      <div className="mb-4 text-blue-700 font-semibold border-l-2 border-blue-500 pl-2">
        Sections 4A & 4B: Existing Courses & Staff
      </div>

      <FormCard title="SECTION 4A: EXISTING COURSES / SUBJECTS" icon="book">
        <div className="mb-4">
          <Grid
            data={courseFields.map((field: any, index: number) => {
              const course = existingCoursesWatch?.[index] || field;
              return { ...course, originalIndex: index };
            })}
            columns={[
              {
                header: 'COURSE NAME',
                cell: (item: any) =>
                  courseOptions.find(o => o.id === item.courseName)?.name ||
                  item.courseName ||
                  '',
              },
              { header: 'SEATS', cell: (item: any) => item.seats || '' },
              { header: 'CLASS', cell: (item: any) => item.class || '' },
              { header: 'YEAR', cell: (item: any) => item.year || '' },
              {
                header: 'TYPE',
                cell: (item: any) => {
                  const typeOpts = [
                    { id: 'permanent', name: 'Permanent' },
                    { id: 'temporary', name: 'Temporary' },
                  ];
                  return (
                    typeOpts.find(o => o.id === item.type)?.name ||
                    item.type ||
                    ''
                  );
                },
              },
              {
                header: 'CONDITIONS',
                cell: (item: any) => item.conditions || '',
              },
              {
                header: 'STATUS OF COMPLIANCE',
                cell: (item: any) => {
                  const statusOpts = [
                    { id: 'pending', name: 'Pending' },
                    { id: 'completed', name: 'Completed' },
                  ];
                  return (
                    statusOpts.find(o => o.id === item.statusOfCompliance)
                      ?.name ||
                    item.statusOfCompliance ||
                    ''
                  );
                },
              },
            ]}
            pagination={false}
            onEdit={(item: any) => {
              setEditingCourseIndex(item.originalIndex);
              setIsCourseModalOpen(true);
            }}
            onRemove={(item: any) => removeCourse(item.originalIndex)}
          />
          {formState.errors.existingCourses?.root?.message && (
            <div className="p-error text-sm mt-2">
              {formState.errors.existingCourses.root.message}
            </div>
          )}
          <div className="mt-4">
            <Button
              label="Add Course"
              icon="plus"
              variant="outlined"
              onClick={() => {
                appendCourse({
                  courseName: '',
                  seats: '',
                  class: '',
                  year: '',
                  type: '',
                  conditions: '',
                  statusOfCompliance: '',
                });
                setEditingCourseIndex(courseFields.length);
                setIsCourseModalOpen(true);
              }}
            />
          </div>
        </div>

        <Modal
          header="Existing Course Details"
          visible={isCourseModalOpen}
          onHide={() => {
            if (editingCourseIndex !== null) {
              const currentCourse = existingCoursesWatch?.[editingCourseIndex];
              if (!currentCourse?.courseName) {
                removeCourse(editingCourseIndex);
              }
            }
            setIsCourseModalOpen(false);
            setEditingCourseIndex(null);
          }}
          size="large"
        >
          {editingCourseIndex !== null && (
            <div className="p-4">
              <FormGrid columns={2}>
                <DropDownList
                  label="Course Name"
                  name={`existingCourses.${editingCourseIndex}.courseName`}
                  control={control}
                  placeholder="Select Course"
                  data={courseOptions}
                  textField="name"
                  valueField="id"
                  errorMessage={
                    formState.errors.existingCourses?.[editingCourseIndex]
                      ?.courseName?.message as string
                  }
                  required
                />
                <TextBox
                  label="Seats"
                  placeholder="Seats"
                  {...register(`existingCourses.${editingCourseIndex}.seats`)}
                  errorMessage={
                    formState.errors.existingCourses?.[editingCourseIndex]
                      ?.seats?.message as string
                  }
                />
                <TextBox
                  label="Class"
                  placeholder="Class"
                  {...register(`existingCourses.${editingCourseIndex}.class`)}
                  errorMessage={
                    formState.errors.existingCourses?.[editingCourseIndex]
                      ?.class?.message as string
                  }
                />
                <TextBox
                  label="Year"
                  placeholder="YYYY"
                  {...register(`existingCourses.${editingCourseIndex}.year`)}
                  errorMessage={
                    formState.errors.existingCourses?.[editingCourseIndex]?.year
                      ?.message as string
                  }
                />
                <DropDownList
                  label="Type"
                  name={`existingCourses.${editingCourseIndex}.type`}
                  control={control}
                  placeholder="Select Type"
                  data={[
                    { id: 'permanent', name: 'Permanent' },
                    { id: 'temporary', name: 'Temporary' },
                  ]}
                  textField="name"
                  valueField="id"
                  errorMessage={
                    formState.errors.existingCourses?.[editingCourseIndex]?.type
                      ?.message as string
                  }
                />
                <TextBox
                  label="Conditions (If Temporary)"
                  placeholder="Conditions"
                  {...register(
                    `existingCourses.${editingCourseIndex}.conditions`
                  )}
                  errorMessage={
                    formState.errors.existingCourses?.[editingCourseIndex]
                      ?.conditions?.message as string
                  }
                />
                <DropDownList
                  label="Status of Compliance"
                  name={`existingCourses.${editingCourseIndex}.statusOfCompliance`}
                  control={control}
                  placeholder="Select Status"
                  data={[
                    { id: 'pending', name: 'Pending' },
                    { id: 'completed', name: 'Completed' },
                  ]}
                  textField="name"
                  valueField="id"
                  errorMessage={
                    formState.errors.existingCourses?.[editingCourseIndex]
                      ?.statusOfCompliance?.message as string
                  }
                />
              </FormGrid>
              <div className="mt-6 flex justify-end">
                <Button
                  label="Save"
                  onClick={async () => {
                    const currentCourse =
                      existingCoursesWatch?.[editingCourseIndex];
                    if (!currentCourse?.courseName) {
                      if (trigger)
                        await trigger(
                          `existingCourses.${editingCourseIndex}.courseName`
                        );
                      return;
                    }
                    if (trigger) {
                      const isValid = await trigger(
                        `existingCourses.${editingCourseIndex}`
                      );
                      if (!isValid) return;
                    }
                    setIsCourseModalOpen(false);
                    setEditingCourseIndex(null);
                  }}
                />
              </div>
            </div>
          )}
        </Modal>

        <div className="mt-8 border-t pt-6">
          <h3 className="text-sm font-semibold text-gray-700 border-b pb-2 mb-4">
            Subject-wise Fee Collection
          </h3>
          <p className="text-gray-600 mb-4 text-sm">
            Below is the automatically calculated affiliation fee based on the
            subjects/courses selected above.
          </p>
          <Grid
            data={feeData}
            columns={[
              {
                header: 'COURSE / SUBJECT',
                cell: (item: any) => item.courseName,
              },
              {
                header: 'FEE (₹)',
                cell: (item: any) =>
                  new Intl.NumberFormat('en-IN').format(item.fee),
              },
            ]}
            pagination={false}
          />
          <div className="flex justify-end items-center mt-6 p-4 bg-gray-50 border rounded font-semibold text-lg">
            <span className="mr-4">Total Amount:</span>
            <span className="text-blue-700">
              ₹ {new Intl.NumberFormat('en-IN').format(totalFee)}
            </span>
          </div>
        </div>
      </FormCard>

      <FormCard
        title="SECTION 4B: TEACHING STAFF FOR EXISTING COURSES"
        icon="users"
      >
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

      <div className="mb-4 mt-6 text-blue-700 font-semibold border-l-2 border-blue-500 pl-2">
        Section 5: Additional Institutions Run by Society
      </div>
      <FormCard title="INSTITUTIONS DETAILS" icon="building">
        <div className="mb-4">
          <Grid
            data={instFields.map((field: any, index: number) => {
              const inst = additionalInstitutionsWatch?.[index] || field;
              return { ...inst, originalIndex: index };
            })}
            columns={[
              {
                header: 'INSTITUTION NAME',
                cell: (item: any) => item.institutionName || '',
              },
              { header: 'ADDRESS', cell: (item: any) => item.address || '' },
              {
                header: 'COURSE',
                cell: (item: any) =>
                  courseOptions.find(o => o.id === item.course)?.name ||
                  item.course ||
                  '',
              },
              { header: 'SEATS', cell: (item: any) => item.seats || '' },
              { header: 'CLASS', cell: (item: any) => item.class || '' },
              { header: 'YEAR', cell: (item: any) => item.year || '' },
              {
                header: 'TYPE',
                cell: (item: any) => {
                  const typeOpts = [
                    { id: 'permanent', name: 'Permanent' },
                    { id: 'temporary', name: 'Temporary' },
                  ];
                  return (
                    typeOpts.find(o => o.id === item.type)?.name ||
                    item.type ||
                    ''
                  );
                },
              },
              {
                header: 'CONDITIONS',
                cell: (item: any) => item.conditions || '',
              },
              {
                header: 'STATUS OF COMPLIANCE',
                cell: (item: any) => {
                  const statusOpts = [
                    { id: 'pending', name: 'Pending' },
                    { id: 'completed', name: 'Completed' },
                  ];
                  return (
                    statusOpts.find(o => o.id === item.statusOfCompliance)
                      ?.name ||
                    item.statusOfCompliance ||
                    ''
                  );
                },
              },
            ]}
            pagination={false}
            onEdit={(item: any) => {
              setEditingInstIndex(item.originalIndex);
              setIsInstModalOpen(true);
            }}
            onRemove={(item: any) => removeInst(item.originalIndex)}
          />
          {formState.errors.additionalInstitutions?.root?.message && (
            <div className="p-error text-sm mt-2">
              {formState.errors.additionalInstitutions.root.message}
            </div>
          )}
          <div className="mt-4">
            <Button
              label="Add Institution"
              icon="plus"
              variant="outlined"
              onClick={() => {
                appendInst({
                  institutionName: '',
                  address: '',
                  course: '',
                  seats: '',
                  class: '',
                  year: '',
                  type: '',
                  conditions: '',
                  statusOfCompliance: '',
                });
                setEditingInstIndex(instFields.length);
                setIsInstModalOpen(true);
              }}
            />
          </div>
        </div>

        <Modal
          header="Additional Institution Details"
          visible={isInstModalOpen}
          onHide={() => {
            if (editingInstIndex !== null) {
              const currentInst =
                additionalInstitutionsWatch?.[editingInstIndex];
              if (!currentInst?.institutionName) {
                removeInst(editingInstIndex);
              }
            }
            setIsInstModalOpen(false);
            setEditingInstIndex(null);
          }}
          size="large"
        >
          {editingInstIndex !== null && (
            <div className="p-4">
              <FormGrid columns={4}>
                <TextBox
                  label="Institution Name"
                  placeholder="Institution Name"
                  {...register(
                    `additionalInstitutions.${editingInstIndex}.institutionName`
                  )}
                  errorMessage={
                    formState.errors.additionalInstitutions?.[editingInstIndex]
                      ?.institutionName?.message as string
                  }
                  required
                />
                <TextBox
                  label="Address"
                  placeholder="Address"
                  {...register(
                    `additionalInstitutions.${editingInstIndex}.address`
                  )}
                  errorMessage={
                    formState.errors.additionalInstitutions?.[editingInstIndex]
                      ?.address?.message as string
                  }
                />
                <DropDownList
                  label="Course"
                  name={`additionalInstitutions.${editingInstIndex}.course`}
                  control={control}
                  placeholder="Select Course"
                  data={courseOptions}
                  textField="name"
                  valueField="id"
                  errorMessage={
                    formState.errors.additionalInstitutions?.[editingInstIndex]
                      ?.course?.message as string
                  }
                />
                <TextBox
                  label="Seats"
                  placeholder="Seats"
                  {...register(
                    `additionalInstitutions.${editingInstIndex}.seats`
                  )}
                  errorMessage={
                    formState.errors.additionalInstitutions?.[editingInstIndex]
                      ?.seats?.message as string
                  }
                />
                <TextBox
                  label="Class"
                  placeholder="Class"
                  {...register(
                    `additionalInstitutions.${editingInstIndex}.class`
                  )}
                  errorMessage={
                    formState.errors.additionalInstitutions?.[editingInstIndex]
                      ?.class?.message as string
                  }
                />
                <TextBox
                  label="Year"
                  placeholder="YYYY"
                  {...register(
                    `additionalInstitutions.${editingInstIndex}.year`
                  )}
                  errorMessage={
                    formState.errors.additionalInstitutions?.[editingInstIndex]
                      ?.year?.message as string
                  }
                />
                <DropDownList
                  label="Type"
                  name={`additionalInstitutions.${editingInstIndex}.type`}
                  control={control}
                  placeholder="Select Type"
                  data={[
                    { id: 1, name: 'Permanent' },
                    { id: 2, name: 'Temporary' },
                  ]}
                  textField="name"
                  valueField="id"
                  errorMessage={
                    formState.errors.additionalInstitutions?.[editingInstIndex]
                      ?.type?.message as string
                  }
                />
                <TextBox
                  label="Conditions (If Temporary)"
                  placeholder="Conditions"
                  {...register(
                    `additionalInstitutions.${editingInstIndex}.conditions`
                  )}
                  errorMessage={
                    formState.errors.additionalInstitutions?.[editingInstIndex]
                      ?.conditions?.message as string
                  }
                />
                <DropDownList
                  label="Status of Compliance"
                  name={`additionalInstitutions.${editingInstIndex}.statusOfCompliance`}
                  control={control}
                  placeholder="Select Status"
                  data={[
                    { id: 'pending', name: 'Pending' },
                    { id: 'completed', name: 'Completed' },
                  ]}
                  textField="name"
                  valueField="id"
                  errorMessage={
                    formState.errors.additionalInstitutions?.[editingInstIndex]
                      ?.statusOfCompliance?.message as string
                  }
                />
              </FormGrid>
              <div className="mt-6 flex justify-end">
                <Button
                  label="Save"
                  onClick={async () => {
                    const currentInst =
                      additionalInstitutionsWatch?.[editingInstIndex];
                    if (!currentInst?.institutionName) {
                      if (trigger)
                        await trigger(
                          `additionalInstitutions.${editingInstIndex}.institutionName`
                        );
                      return;
                    }
                    if (trigger) {
                      const isValid = await trigger(
                        `additionalInstitutions.${editingInstIndex}`
                      );
                      if (!isValid) return;
                    }
                    setIsInstModalOpen(false);
                    setEditingInstIndex(null);
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
