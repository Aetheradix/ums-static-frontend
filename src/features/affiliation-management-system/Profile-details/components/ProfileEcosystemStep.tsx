import type { Control, FormState, Path } from 'react-hook-form';
import { Button } from 'shared/components/buttons';
import { DatePicker, DropDownList, TextBox } from 'shared/components/forms';
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

export default function ProfileEcosystemStep({
  register,
  control,
  formState,
  existingCoursesArray,
  teachingStaffArray,
  additionalInstitutionsArray,
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

  return (
    <>
      <div className="mb-4 text-blue-700 font-semibold border-l-2 border-blue-500 pl-2">
        Sections 4A & 4B: Existing Courses & Staff
      </div>

      <FormCard title="SECTION 4A: EXISTING COURSES / SUBJECTS" icon="book">
        <div className="flex flex-col gap-4">
          {courseFields.map((field: any, index: number) => (
            <div
              key={field.id}
              className="border border-gray-200 rounded-lg p-4 relative bg-gray-50/50"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-600">
                  Course {index + 1}
                </span>
                <Button
                  icon="trash"
                  variant="outlined"
                  onClick={() => removeCourse(index)}
                />
              </div>
              <FormGrid columns={4}>
                <DropDownList
                  label="Course Name"
                  name={`existingCourses.${index}.courseName`}
                  control={control}
                  placeholder="Select Course"
                  data={courseOptions}
                  textField="name"
                  valueField="id"
                  errorMessage={
                    formState.errors.existingCourses?.[index]?.courseName
                      ?.message as string
                  }
                  required
                />
                <TextBox
                  label="Seats"
                  placeholder="Seats"
                  {...register(`existingCourses.${index}.seats`)}
                  errorMessage={
                    formState.errors.existingCourses?.[index]?.seats
                      ?.message as string
                  }
                />
                <TextBox
                  label="Class"
                  placeholder="Class"
                  {...register(`existingCourses.${index}.class`)}
                  errorMessage={
                    formState.errors.existingCourses?.[index]?.class
                      ?.message as string
                  }
                />
                <TextBox
                  label="Year"
                  placeholder="YYYY"
                  {...register(`existingCourses.${index}.year`)}
                  errorMessage={
                    formState.errors.existingCourses?.[index]?.year
                      ?.message as string
                  }
                />
                <DropDownList
                  label="Type"
                  name={`existingCourses.${index}.type`}
                  control={control}
                  placeholder="Select Type"
                  data={[
                    { id: 'permanent', name: 'Permanent' },
                    { id: 'temporary', name: 'Temporary' },
                  ]}
                  textField="name"
                  valueField="id"
                  errorMessage={
                    formState.errors.existingCourses?.[index]?.type
                      ?.message as string
                  }
                />
                <TextBox
                  label="Conditions (If Temporary)"
                  placeholder="Conditions"
                  {...register(`existingCourses.${index}.conditions`)}
                  errorMessage={
                    formState.errors.existingCourses?.[index]?.conditions
                      ?.message as string
                  }
                />
                <DropDownList
                  label="Status of Compliance"
                  name={`existingCourses.${index}.statusOfCompliance`}
                  control={control}
                  placeholder="Select Status"
                  data={[
                    { id: 'pending', name: 'Pending' },
                    { id: 'completed', name: 'Completed' },
                  ]}
                  textField="name"
                  valueField="id"
                  errorMessage={
                    formState.errors.existingCourses?.[index]
                      ?.statusOfCompliance?.message as string
                  }
                />
              </FormGrid>
            </div>
          ))}
          <div>
            <Button
              label="Add Course"
              icon="plus"
              variant="outlined"
              onClick={() =>
                appendCourse({
                  courseName: '',
                  seats: '',
                  class: '',
                  year: '',
                  type: '',
                  conditions: '',
                  statusOfCompliance: '',
                })
              }
            />
          </div>
        </div>
      </FormCard>

      <FormCard
        title="SECTION 4B: TEACHING STAFF FOR EXISTING COURSES"
        icon="users"
      >
        <div className="flex flex-col gap-4">
          {staffFields.map((field: any, index: number) => (
            <div
              key={field.id}
              className="border border-gray-200 rounded-lg p-4 relative bg-gray-50/50"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-600">
                  Staff {index + 1}
                </span>
                <Button
                  icon="trash"
                  variant="outlined"
                  onClick={() => removeStaff(index)}
                />
              </div>
              <FormGrid columns={3}>
                <TextBox
                  label="Name"
                  placeholder="Enter Name"
                  {...register(`teachingStaff.${index}.name`)}
                  errorMessage={
                    formState.errors.teachingStaff?.[index]?.name
                      ?.message as string
                  }
                  required
                />
                <DropDownList
                  label="Role"
                  name={`teachingStaff.${index}.role`}
                  control={control}
                  placeholder="Select Role"
                  data={[
                    { id: 'principal', name: 'Principal' },
                    { id: 'hod', name: 'HOD' },
                    { id: 'assistant_professor', name: 'Assistant Professor' },
                  ]}
                  textField="name"
                  valueField="id"
                  errorMessage={
                    formState.errors.teachingStaff?.[index]?.role
                      ?.message as string
                  }
                />
                <DropDownList
                  label="Status"
                  name={`teachingStaff.${index}.status`}
                  control={control}
                  placeholder="Select Status"
                  data={[
                    { id: 'permanent', name: 'Permanent' },
                    { id: 'temporary', name: 'Temporary' },
                  ]}
                  textField="name"
                  valueField="id"
                  errorMessage={
                    formState.errors.teachingStaff?.[index]?.status
                      ?.message as string
                  }
                />
                <TextBox
                  label="Qualification"
                  placeholder="Enter Qualification"
                  {...register(`teachingStaff.${index}.qualification`)}
                  errorMessage={
                    formState.errors.teachingStaff?.[index]?.qualification
                      ?.message as string
                  }
                />
                <TextBox
                  label="Experience"
                  placeholder="Enter Experience"
                  {...register(`teachingStaff.${index}.experience`)}
                  errorMessage={
                    formState.errors.teachingStaff?.[index]?.experience
                      ?.message as string
                  }
                />
                <DatePicker
                  label="Joining Date"
                  name={`teachingStaff.${index}.joiningDate`}
                  control={control}
                  placeholder="Select Date"
                  errorMessage={
                    formState.errors.teachingStaff?.[index]?.joiningDate
                      ?.message as string
                  }
                />
                <DatePicker
                  label="Date of Birth"
                  name={`teachingStaff.${index}.dateOfBirth`}
                  control={control}
                  placeholder="Select Date"
                  errorMessage={
                    formState.errors.teachingStaff?.[index]?.dateOfBirth
                      ?.message as string
                  }
                />
                <DropDownList
                  label="Subject"
                  name={`teachingStaff.${index}.subject`}
                  control={control}
                  placeholder="Select Subject"
                  data={subjectOptions}
                  textField="name"
                  valueField="id"
                  errorMessage={
                    formState.errors.teachingStaff?.[index]?.subject
                      ?.message as string
                  }
                />
              </FormGrid>
            </div>
          ))}
          <div>
            <Button
              label="Add Staff"
              icon="plus"
              variant="outlined"
              onClick={() =>
                appendStaff({
                  name: '',
                  role: '',
                  status: '',
                  qualification: '',
                  experience: '',
                  joiningDate: null,
                  dateOfBirth: null,
                  subject: '',
                })
              }
            />
          </div>
        </div>
      </FormCard>

      <div className="mb-4 mt-6 text-blue-700 font-semibold border-l-2 border-blue-500 pl-2">
        Section 5: Additional Institutions Run by Society
      </div>
      <FormCard title="INSTITUTIONS DETAILS" icon="building">
        <div className="flex flex-col gap-4">
          {instFields.map((field: any, index: number) => (
            <div
              key={field.id}
              className="border border-gray-200 rounded-lg p-4 relative bg-gray-50/50"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-600">
                  Institution {index + 1}
                </span>
                <Button
                  icon="trash"
                  variant="outlined"
                  onClick={() => removeInst(index)}
                />
              </div>
              <FormGrid columns={4}>
                <TextBox
                  label="Institution Name"
                  placeholder="Institution Name"
                  {...register(
                    `additionalInstitutions.${index}.institutionName`
                  )}
                  errorMessage={
                    formState.errors.additionalInstitutions?.[index]
                      ?.institutionName?.message as string
                  }
                  required
                />
                <TextBox
                  label="Address"
                  placeholder="Address"
                  {...register(`additionalInstitutions.${index}.address`)}
                  errorMessage={
                    formState.errors.additionalInstitutions?.[index]?.address
                      ?.message as string
                  }
                />
                <DropDownList
                  label="Course"
                  name={`additionalInstitutions.${index}.course`}
                  control={control}
                  placeholder="Select Course"
                  data={courseOptions}
                  textField="name"
                  valueField="id"
                  errorMessage={
                    formState.errors.additionalInstitutions?.[index]?.course
                      ?.message as string
                  }
                />
                <TextBox
                  label="Seats"
                  placeholder="Seats"
                  {...register(`additionalInstitutions.${index}.seats`)}
                  errorMessage={
                    formState.errors.additionalInstitutions?.[index]?.seats
                      ?.message as string
                  }
                />
                <TextBox
                  label="Class"
                  placeholder="Class"
                  {...register(`additionalInstitutions.${index}.class`)}
                  errorMessage={
                    formState.errors.additionalInstitutions?.[index]?.class
                      ?.message as string
                  }
                />
                <TextBox
                  label="Year"
                  placeholder="YYYY"
                  {...register(`additionalInstitutions.${index}.year`)}
                  errorMessage={
                    formState.errors.additionalInstitutions?.[index]?.year
                      ?.message as string
                  }
                />
                <DropDownList
                  label="Type"
                  name={`additionalInstitutions.${index}.type`}
                  control={control}
                  placeholder="Select Type"
                  data={[
                    { id: 'permanent', name: 'Permanent' },
                    { id: 'temporary', name: 'Temporary' },
                  ]}
                  textField="name"
                  valueField="id"
                  errorMessage={
                    formState.errors.additionalInstitutions?.[index]?.type
                      ?.message as string
                  }
                />
                <TextBox
                  label="Conditions (If Temporary)"
                  placeholder="Conditions"
                  {...register(`additionalInstitutions.${index}.conditions`)}
                  errorMessage={
                    formState.errors.additionalInstitutions?.[index]?.conditions
                      ?.message as string
                  }
                />
                <DropDownList
                  label="Status of Compliance"
                  name={`additionalInstitutions.${index}.statusOfCompliance`}
                  control={control}
                  placeholder="Select Status"
                  data={[
                    { id: 'pending', name: 'Pending' },
                    { id: 'completed', name: 'Completed' },
                  ]}
                  textField="name"
                  valueField="id"
                  errorMessage={
                    formState.errors.additionalInstitutions?.[index]
                      ?.statusOfCompliance?.message as string
                  }
                />
              </FormGrid>
            </div>
          ))}
          <div>
            <Button
              label="Add Institution"
              icon="plus"
              variant="outlined"
              onClick={() =>
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
                })
              }
            />
          </div>
        </div>
      </FormCard>
    </>
  );
}
