import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';

const schema =
  validation.create<Master.SubjectMaster.ProgrammeSpecializationStructureForm>(
    o => ({
      programmeId: o.number().required(),
      specializationId: o.number().required(),
      modeOfEducationId: o.number().required(),
      semesterName: o.string().required(),
      subjectId: o.number().required(),
      lectureStructure: o.number().required(),
      tutorialStructure: o.number().required(),
      practicalStructure: o.number().required(),
      totalCredits: o.number().required(),
    })
  );

export function useProgrammeSpecializationStructureForm(
  submitCallback: Forms.SubmitFunc<Master.SubjectMaster.ProgrammeSpecializationStructureForm>,
  defaultValues?: Forms.FetchDataFunc<Master.SubjectMaster.ProgrammeSpecializationStructureForm>
) {
  const { register, control, handleSubmit, reset } =
    useAppForm<Master.SubjectMaster.ProgrammeSpecializationStructureForm>({
      defaultValues: defaultValues,
      resolver: validation.resolver(schema),
    });

  return {
    register,
    control,
    handleSubmit: handleSubmit(submitCallback),
    reset,
  };
}
