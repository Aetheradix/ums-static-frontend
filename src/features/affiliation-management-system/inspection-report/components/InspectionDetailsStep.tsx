import { Controller, type Control, type Path } from 'react-hook-form';
import {
  DatePicker,
  MultiSelectList,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import { FormCard, FormGrid } from 'shared/new-components';
import type { InspectionReportFormData } from './form.hook';

interface InspectionDetailsStepProps {
  register: (key: Path<InspectionReportFormData>) => {
    control: Control<InspectionReportFormData>;
    name: Path<InspectionReportFormData>;
  };
  control: Control<InspectionReportFormData>;
  errors: any;
}

export default function InspectionDetailsStep({
  register,
  control,
  errors,
}: InspectionDetailsStepProps) {
  return (
    <>
      <FormCard
        title="Section 1: Inspection Header"
        subtitle="Basic details of the inspection"
        icon="file-earmark-text"
      >
        <FormGrid columns={3}>
          <Controller
            control={control}
            name="inspection_date"
            render={({ field }) => (
              <DatePicker
                label="Date of Inspection"
                placeholder="dd-mm-yyyy"
                value={field.value ?? undefined}
                onChange={field.onChange}
                errorMessage={errors.inspection_date?.message}
                required
              />
            )}
          />
          <div className="col-span-2">
            <MultiSelectList
              label="Name of the Course"
              placeholder="Select Course(s)"
              name="course_name"
              control={control}
              data={[
                {
                  id: 'B.Tech Computer Science',
                  name: 'B.Tech Computer Science',
                },
                { id: 'MBA', name: 'MBA' },
                { id: 'BCA', name: 'BCA' },
                { id: 'B.Sc.', name: 'B.Sc.' },
              ]}
              textField="name"
              valueField="id"
              errorMessage={errors.course_name?.message}
            />
          </div>
          <TextBox
            label="Name of the College"
            placeholder="Enter college name"
            {...register('college_name')}
            errorMessage={errors.college_name?.message}
            required
          />
          <TextBox
            label="Name of the Foundation Society"
            placeholder="Enter society name"
            {...register('society_name')}
            errorMessage={errors.society_name?.message}
            required
          />
          <div className="col-span-3">
            <TextArea
              label="Address of the College"
              placeholder="Enter complete address"
              {...register('college_address')}
              errorMessage={errors.college_address?.message}
              rows={2}
              required
            />
          </div>
        </FormGrid>
      </FormCard>

      <FormCard
        title="Section 2: Inspection Committee Members"
        subtitle="Details of the committee members conducting the inspection"
        icon="people-fill"
      >
        <FormGrid columns={3}>
          <TextBox
            label="Member 1 — Name & Designation"
            placeholder="Name, Designation, Institution"
            {...register('member1_info')}
            errorMessage={errors.member1_info?.message}
            required
          />
          <TextBox
            label="Member 2 — Name & Designation"
            placeholder="Name, Designation, Institution"
            {...register('member2_info')}
            errorMessage={errors.member2_info?.message}
            required
          />
          <TextBox
            label="Member 3 — Name & Designation"
            placeholder="Name, Designation, Institution"
            {...register('member3_info')}
            errorMessage={errors.member3_info?.message}
          />
        </FormGrid>
      </FormCard>
    </>
  );
}
