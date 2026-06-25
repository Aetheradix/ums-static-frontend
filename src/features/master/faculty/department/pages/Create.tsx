import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { masterUrls } from '../../../urls';
import DepartmentForm from '../components/DepartmentForm';
import { useCreateDepartmentMutation } from '../queries';

export default function Create() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateDepartmentMutation();

  const handleBack = useCallback(() => {
    navigate(masterUrls.department.root);
  }, [navigate]);

  async function handleSubmit(data: Master.DepartmentForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Department created successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to create department');
    }
  }

  return (
    <FormPage
      title="Create Department"
      description="Fill in the details to add a new department."
    >
      <FormCard title="Department Details">
        <DepartmentForm onSubmit={handleSubmit} isSaving={isPending} />
      </FormCard>
    </FormPage>
  );
}
