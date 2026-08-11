import { useState } from 'react';
import { useWatch } from 'react-hook-form';
import type { Control, FormState, Path } from 'react-hook-form';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import { Grid } from 'shared/components/grid';
import { Modal } from 'shared/components/popups';
import { FormCard, FormGrid } from 'shared/new-components';
import type { ProfileDetailsFormData } from './form.hook';

interface ProfileCoursesStepProps {
  register: (name: Path<ProfileDetailsFormData>) => {
    control: Control<ProfileDetailsFormData>;
    name: Path<ProfileDetailsFormData>;
  };
  control: Control<ProfileDetailsFormData>;
  formState: FormState<ProfileDetailsFormData>;
  existingCoursesArray: any;
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

export default function ProfileCoursesStep({
  register,
  control,
  formState,
  existingCoursesArray,
  trigger,
}: ProfileCoursesStepProps) {
  const {
    fields: courseFields,
    append: appendCourse,
    remove: removeCourse,
  } = existingCoursesArray;

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

  return (
    <>
      <div className="mb-4 text-blue-700 font-semibold border-l-2 border-blue-500 pl-2">
        Existing Courses
      </div>

      <FormCard title="EXISTING COURSES / SUBJECTS" icon="book">
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
    </>
  );
}
