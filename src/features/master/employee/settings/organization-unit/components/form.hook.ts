import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';

const schema = validation.create<Master.Employee.OrganizationUnitForm>(o => ({
  name: o.string().required().max(150).label('Organization Unit Name'),
}));

export function useOrganizationUnitForm(
  submitCallback: Forms.SubmitFunc<Master.Employee.OrganizationUnitForm>,
  defaultValues?: Forms.FetchDataFunc<Master.Employee.OrganizationUnitForm>
) {
  const { register, control, handleSubmit, reset } =
    useAppForm<Master.Employee.OrganizationUnitForm>({
      defaultValues,
      resolver: validation.resolver(schema),
    });

  return {
    register,
    control,
    handleSubmit: handleSubmit(submitCallback),
    reset,
  };
}
