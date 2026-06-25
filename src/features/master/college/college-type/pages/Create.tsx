import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { masterUrls } from '../../../urls';
import CollegeTypeForm from '../components/CollegeTypeForm';
import { useCreateCollegeTypeMutation } from '../queries';

export default function Create() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateCollegeTypeMutation();

  const handleBack = useCallback(() => {
    navigate(masterUrls.collegeType.root);
  }, [navigate]);

  async function handleSubmit(data: CollegeMaster.CollegeTypeForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('College Type created successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to create college type');
    }
  }

  return (
    <FormPage
      title="Create College Type"
      description="Fill in the details to add a new college type."
    >
      <FormCard title="College Type Details">
        <CollegeTypeForm
          onSubmit={handleSubmit}
          isSaving={isPending}
          isEditMode={false}
        />
      </FormCard>
    </FormPage>
  );
}
