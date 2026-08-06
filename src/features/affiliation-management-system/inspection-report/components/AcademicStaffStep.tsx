import { type Control, type Path } from 'react-hook-form';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid } from 'shared/new-components';
import type { InspectionReportFormData } from './form.hook';

interface AcademicStaffStepProps {
  register: (key: Path<InspectionReportFormData>) => {
    control: Control<InspectionReportFormData>;
    name: Path<InspectionReportFormData>;
  };
  control: Control<InspectionReportFormData>;
  errors: any;
}

const yesNoOptions = [
  { id: 'Yes', name: 'Yes' },
  { id: 'No', name: 'No' },
];

export default function AcademicStaffStep({
  register,
  control,
  errors,
}: AcademicStaffStepProps) {
  return (
    <>
      <FormCard
        title="Section 4: Teaching Staff — Courses Already Being Taught"
        subtitle="Current teaching staff availability and qualifications"
        icon="person-workspace"
      >
        <FormGrid columns={3}>
          <TextBox
            label="Max Teachers Required (Rules)"
            type="number"
            {...register('teachers_req_rules')}
            errorMessage={errors.teachers_req_rules?.message}
          />
          <TextBox
            label="Teaching Staff (As per Papers)"
            type="number"
            {...register('teachers_on_paper')}
            errorMessage={errors.teachers_on_paper?.message}
          />
          <TextBox
            label="Teaching Staff (Actually Present)"
            type="number"
            {...register('teachers_actually_present')}
            errorMessage={errors.teachers_actually_present?.message}
          />
          <div className="col-span-3">
            <TextArea
              label="Reason Assigned for Non-availability of Teachers"
              {...register('reason_teacher_non_availability')}
              errorMessage={errors.reason_teacher_non_availability?.message}
              rows={2}
            />
          </div>
          <DropDownList
            label="Teachers Adequately Qualified & Experienced?"
            placeholder="Select Teachers Adequately Qualified & Experienced"
            name="teachers_qualified"
            control={control}
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={errors.teachers_qualified?.message}
          />
          <DropDownList
            label="Teacher : Student Ratio Adequate?"
            placeholder="Select Teacher : Student Ratio Adequate"
            name="teacher_student_ratio_adequate"
            control={control}
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={errors.teacher_student_ratio_adequate?.message}
          />
          <TextBox
            label="Suggested Ratio (Non-medical/tech: 30:1; Medical/tech: as per norms)"
            {...register('suggested_ratio_text')}
            errorMessage={errors.suggested_ratio_text?.message}
          />
          <DropDownList
            label="Selection of Principal under Code 28?"
            placeholder="Select Selection of Principal under Code 28"
            name="principal_selection_code28"
            control={control}
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={errors.principal_selection_code28?.message}
          />
          <DropDownList
            label="Selection of Teachers under Code 28?"
            placeholder="Select Selection of Teachers under Code 28"
            name="teachers_selection_code28"
            control={control}
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={errors.teachers_selection_code28?.message}
          />
        </FormGrid>
      </FormCard>

      <FormCard
        title="Section 5: Teaching Staff — Courses Proposed to be Opened"
        subtitle="Proposed teaching staff for new courses"
        icon="person-plus"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Teaching Staff (As per Papers)"
            type="number"
            {...register('prop_teachers_on_paper')}
            errorMessage={errors.prop_teachers_on_paper?.message}
          />
          <TextBox
            label="Teaching Staff (Actually Present)"
            type="number"
            {...register('prop_teachers_actually_present')}
            errorMessage={errors.prop_teachers_actually_present?.message}
          />
          <div className="col-span-2">
            <TextArea
              label="Reason Assigned for Non-availability of Teachers"
              {...register('prop_reason_non_availability')}
              errorMessage={errors.prop_reason_non_availability?.message}
              rows={2}
            />
          </div>
          <div className="col-span-2">
            <DropDownList
              label="Available Teachers Adequately Qualified & Experienced?"
              placeholder="Select Available Teachers Adequately Qualified & Experienced"
              name="prop_teachers_qualified"
              control={control}
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={errors.prop_teachers_qualified?.message}
            />
          </div>
          <div className="col-span-2">
            <TextArea
              label="Committee Interaction with Students, Staff & Principal — Observations"
              {...register('interaction_observations')}
              errorMessage={errors.interaction_observations?.message}
              rows={3}
            />
          </div>
        </FormGrid>
      </FormCard>
    </>
  );
}
