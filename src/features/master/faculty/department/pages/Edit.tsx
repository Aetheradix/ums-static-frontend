import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { Loader } from 'shared/components/progress';
import { useParamsId } from 'shared/hooks/params';
import { masterUrls } from '../../../urls';
import DepartmentForm from '../components/DepartmentForm';
import { useDepartmentQuery, useUpdateDepartmentMutation } from '../queries';

const DEFAULT: Master.DepartmentForm = {
  code: '',
  name: '',
  officeTypeId: 0,
  hodName: '',
  contactNumber: '',
};

export default function Edit() {
  const navigate = useNavigate();
  const id = useParamsId();
  const { mutateAsync, isPending } = useUpdateDepartmentMutation(id);
  const { data = DEFAULT, isLoading } = useDepartmentQuery(id);

  const handleBack = useCallback(() => {
    navigate(masterUrls.department.root);
  }, [navigate]);

  async function handleSubmit(formData: Master.DepartmentForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Department updated successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to update department');
    }
  }

  return (
    <FormPage
      title="Edit Department"
      description="Update the details of the department."
    >
      <FormCard title="Department Details">
        {isLoading ? (
          <Loader />
        ) : (
          <DepartmentForm
            fetchData={data}
            isSaving={isPending}
            isEditMode
            onSubmit={handleSubmit}
          />
        )}
      </FormCard>
    </FormPage>
  );
}
