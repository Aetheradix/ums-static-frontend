import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { Loader } from 'shared/components/progress';
import { useParamsId } from 'shared/hooks/params';
import { FormCard, FormPage } from 'shared/new-components';
import { masterUrls } from '../../../urls';
import DesignationForm from '../components/DesignationForm';
import { useDesignationQuery, useUpdateDesignationMutation } from '../queries';

const DEFAULT: Master.DesignationForm = {
  name: '',
};

export default function Edit() {
  const navigate = useNavigate();
  const id = useParamsId();
  const { mutateAsync, isPending } = useUpdateDesignationMutation(id);
  const { data = DEFAULT, isLoading } = useDesignationQuery(id);

  const handleBack = useCallback(() => {
    navigate(masterUrls.designation.root);
  }, [navigate]);

  if (isLoading) {
    return <Loader />;
  }

  async function handleSubmit(data: Master.DesignationForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Designation updated successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to update designation');
    }
  }

  return (
    <FormPage
      title="Edit Designation"
      description="Update the details of the designation."
    >
      <FormCard title="Designation Details">
        <DesignationForm
          fetchData={data}
          isSaving={isPending}
          isEditMode
          onSubmit={handleSubmit}
        />
      </FormCard>
    </FormPage>
  );
}
