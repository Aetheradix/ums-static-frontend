import { useProgrammeFeesQuery } from 'features/affiliation-management-system/settings/programme-fee/queries';
import SelectProgramme from 'features/components/SelectProgramme';
import { useProgrammesQuery } from 'features/master/other/programme/queries';
import { useSubjectsQuery } from 'features/master/subject/subjects/queries';
import type { Control } from 'react-hook-form';
import { useFieldArray, useForm } from 'react-hook-form';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { MultiSelectList } from 'shared/components/forms';
import { FormCard, FormGrid, GridPanel } from 'shared/new-components';
import './CollegeCourseDetailStep.css';

interface CollegeCourseDetailStepProps {
  control: Control<AffiliationManagementSystem.CollegeApplicationFormData>;
}

const getCourseFees = (
  courseId: number,
  courseName: string,
  programmeFees: AffiliationManagementSystem.ProgrammeFeeItem[],
  programmes: Master.Other.ProgrammeItem[]
) => {
  if (!courseId) {
    return {
      affiliationFee: 0,
      inspectionFee: 0,
      sdAmount: 0,
      courseType: '',
      courseCode: '',
    };
  }

  const selectedProgramme = programmes?.find(p => p.id === courseId);
  const fee = programmeFees?.find(f => f.programmeId === courseId);

  return {
    programmeFeeId: fee?.programmeFeeId || 0,
    affiliationFee: fee?.affiliationFee || 0,
    inspectionFee: fee?.inspectionFee || 0,
    sdAmount: fee?.securityDepositAmount || 0,
    courseType: selectedProgramme?.degreeLevelName || 'TEMPORARY',
    courseCode: courseName || 'OTHER',
  };
};

export default function CollegeCourseDetailStep({
  control,
}: CollegeCourseDetailStepProps) {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'courses',
  });

  const {
    watch: localWatch,
    reset: localReset,
    control: localControl,
  } = useForm({
    defaultValues: {
      tempCourseId: '',
      tempSubjects: [] as Master.SubjectMaster.SubjectItem[], // selected subjects array
    },
  });

  const tempCourseId = localWatch('tempCourseId');
  const tempSubjects = localWatch('tempSubjects');

  const { data: programmesRaw } = useProgrammesQuery();
  const { data: subjectsRaw } = useSubjectsQuery();
  const { data: programmeFeesRaw } = useProgrammeFeesQuery();

  const programmes = (programmesRaw || []) as Master.Other.ProgrammeItem[];
  const subjects = (subjectsRaw || []) as Master.SubjectMaster.SubjectItem[];
  const programmeFeesData = (programmeFeesRaw ||
    []) as AffiliationManagementSystem.ProgrammeFeeItem[];

  const activeSubjects = subjects.filter(item => item.isActive);

  const activeProgrammeFees = programmeFeesData.filter(item => item.isActive);

  const selectedCourse = programmes.find(p => p.id === Number(tempCourseId));
  const currentFees = getCourseFees(
    Number(tempCourseId),
    selectedCourse?.name || '',
    activeProgrammeFees,
    programmes
  );

  const handleAddCourse = () => {
    if (!tempCourseId || !tempSubjects || tempSubjects.length === 0) {
      ToastService.error('Please select both Course and at least one Subject.');
      return;
    }

    const cId = Number(tempCourseId);
    const existingCourseIndex = fields.findIndex(f => f.courseId === cId);
    const newSubjectIds = tempSubjects.map((s: any) => Number(s.id));

    if (existingCourseIndex >= 0) {
      const existingField = fields[existingCourseIndex];
      const existingSubjectIds = existingField.subjectIds || [];
      const subjectsToAdd = newSubjectIds.filter(
        id => !existingSubjectIds.includes(id)
      );

      if (subjectsToAdd.length === 0) {
        ToastService.error(
          'All selected subjects for this course have already been added.'
        );
        return;
      }

      update(existingCourseIndex, {
        ...existingField,
        subjectIds: [...existingSubjectIds, ...subjectsToAdd],
      });

      ToastService.success(
        `Added ${subjectsToAdd.length} new subject(s) to the existing course.`
      );
    } else {
      append({
        courseId: cId,
        subjectIds: newSubjectIds,
        totalAmount:
          currentFees.affiliationFee +
          currentFees.inspectionFee +
          currentFees.sdAmount,
        isFeePaid: false,
        paymentDate: '',
      });

      ToastService.success(
        `Added course with ${newSubjectIds.length} subject(s).`
      );
    }

    localReset({
      tempCourseId: '',
      tempSubjects: [],
    });
  };

  const handleRemoveCourse = (index: number) => {
    remove(index);
    ToastService.success('Course selection removed successfully.');
  };

  const selectedCourseRows = fields.map((field, rowIndex) => {
    const courseName =
      programmes.find(p => p.id === field.courseId)?.name ??
      `Course #${field.courseId}`;

    const fees = getCourseFees(
      field.courseId!,
      courseName,
      activeProgrammeFees,
      programmes
    );

    const subjectNames = (field.subjectIds || [])
      .map(sId => {
        return (
          subjects.find(s => s.id === sId)?.subjectName ?? `Subject #${sId}`
        );
      })
      .filter(Boolean)
      .join(', ');

    return {
      id: field.id,
      rowIndex,
      sNo: rowIndex + 1,
      courseType: fees.courseType,
      course: fees.courseCode,
      subjects: subjectNames,
      sdAmount: fees.sdAmount,
      affiliationFee: fees.affiliationFee,
      inspectionFee: fees.inspectionFee,
    };
  });

  return (
    <div className="flex flex-col gap-4">
      <FormCard
        title="Course Details"
        subtitle="Select the programme, subjects, and applicable course fee details."
        icon="book"
      >
        <FormGrid columns={2}>
          <SelectProgramme
            label="Course"
            defaultOptionText="Select Course"
            control={localControl}
            name="tempCourseId"
            required
          />
          <div>
            <MultiSelectList
              label="Subjects"
              control={localControl}
              name="tempSubjects"
              data={activeSubjects}
              textField="subjectName"
              placeholder="Select Subjects"
              required
            />
          </div>
        </FormGrid>

        {tempCourseId && (
          <div className="course-fee-summary-panel">
            <div className="course-fee-card course-fee-card-affiliation">
              <span className="course-fee-icon">
                <span className="icon-base">currency_rupee</span>
              </span>

              <div className="course-fee-content">
                <h4>Affiliation Fee</h4>
                <strong>₹{currentFees.affiliationFee} /-</strong>
                <p>For new courses including 1 foundation subject</p>
              </div>
            </div>

            <div className="course-fee-card course-fee-card-inspection">
              <span className="course-fee-icon">
                <span className="icon-base">find_in_page</span>
              </span>

              <div className="course-fee-content">
                <h4>Inspection Fee</h4>
                <strong>₹{currentFees.inspectionFee} /-</strong>
                <p>For new courses including 1 foundation subject</p>
              </div>
            </div>

            <div className="course-fee-card course-fee-card-fd">
              <span className="course-fee-icon">
                <span className="icon-base">account_balance</span>
              </span>

              <div className="course-fee-content">
                <h4>FD Amount</h4>
                <strong>₹{currentFees.sdAmount} /-</strong>
                <p>
                  An FD of ₹{currentFees.sdAmount} /- will be payable for new
                  courses.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            label="Add course"
            icon="plus"
            variant="primary"
            onClick={handleAddCourse}
          />
        </div>
      </FormCard>

      {fields.length > 0 && (
        <FormCard
          title="Selected Courses"
          subtitle="Review the courses added for this affiliation application."
          icon="list"
        >
          <GridPanel
            data={selectedCourseRows}
            columns={[
              {
                field: 'sNo',
                header: 'S.No',
                width: '70px',
              },
              {
                field: 'courseType',
                header: 'Course Type',
              },
              {
                field: 'course',
                header: 'Course',
              },
              {
                field: 'subjects',
                header: 'Subjects',
              },
              {
                field: 'sdAmount',
                header: 'Security Amount',
                cell: row => <span>₹{row.sdAmount}</span>,
              },
              {
                field: 'affiliationFee',
                header: 'Affiliation Fee',
                cell: row => <span>₹{row.affiliationFee}</span>,
              },
              {
                field: 'inspectionFee',
                header: 'Inspection Fee',
                cell: row => <span>₹{row.inspectionFee}</span>,
              },
              {
                header: 'Action',
                width: '80px',
                sortable: false,
                cell: row => (
                  <Button
                    type="button"
                    icon="trash"
                    variant="text"
                    className="grid-action-button grid-action-button-delete"
                    onClick={() => handleRemoveCourse(row.rowIndex)}
                  />
                ),
              },
            ]}
          />
        </FormCard>
      )}
    </div>
  );
}
