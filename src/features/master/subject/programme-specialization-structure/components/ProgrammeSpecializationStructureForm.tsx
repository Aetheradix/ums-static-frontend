import SelectCourseMode from 'features/components/SelectProgramModeOfEducation';
import SelectProgramme from 'features/components/SelectProgramme';
import SelectSpecialisation from 'features/components/SelectSpecialisation';
import SelectSubject from 'features/components/SelectSubject';
import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useProgrammeSpecializationStructureForm } from './form.hook';

interface ProgrammeSpecializationStructureFormProps {
  onSubmit: (
    data: Master.SubjectMaster.ProgrammeSpecializationStructureForm
  ) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.SubjectMaster.ProgrammeSpecializationStructureForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function ProgrammeSpecializationStructureForm(
  props: ProgrammeSpecializationStructureFormProps
) {
  const { register, handleSubmit, reset } =
    useProgrammeSpecializationStructureForm(props.onSubmit, props.fetchData);

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <SelectProgramme {...register('programmeId')} label="Programme" />
        <SelectSpecialisation
          {...register('specializationId')}
          label="Specialization"
        />
        <SelectCourseMode
          {...register('modeOfEducationId')}
          label="Mode of Education"
        />
        <TextBox
          label="Semester Name"
          placeholder="Enter Semester Name (e.g. Semester I)"
          {...register('semesterName')}
          maxLength={50}
          required
        />
        <SelectSubject {...register('subjectId')} label="Subject" />
        <TextBox
          label="Lecture Structure (Credits)"
          placeholder="Enter Lecture Credits"
          {...register('lectureStructure')}
          required
        />
        <TextBox
          label="Tutorial Structure (Credits)"
          placeholder="Enter Tutorial Credits"
          {...register('tutorialStructure')}
          required
        />
        <TextBox
          label="Practical Structure (Credits)"
          placeholder="Enter Practical Credits"
          {...register('practicalStructure')}
          required
        />
        <TextBox
          label="Total Credits"
          placeholder="Enter Total Credits"
          {...register('totalCredits')}
          required
        />
      </FormGrid>

      <FormActions
        isEditMode={props.isEditMode}
        isLoading={props.isSaving}
        onSave={handleSubmit}
        onReset={reset}
      />
    </form>
  );
}
