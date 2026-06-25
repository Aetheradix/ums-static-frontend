import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { masterUrls } from '../../../urls';
import FacultyForm from '../components/FacultyForm';
import { useCreateFacultyMutation } from '../queries';

export default function Create() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateFacultyMutation();

  const handleBack = useCallback(() => {
    navigate(masterUrls.faculty.root);
  }, [navigate]);

  async function handleSubmit(data: Master.FacultyForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Faculty created successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to create faculty');
    }
  }

  return (
    <FormPage
      title="Create Faculty"
      description="Fill in the details to add a new faculty."
    >
      <FormCard title="Faculty Details">
        <FacultyForm onSubmit={handleSubmit} isSaving={isPending} />
      </FormCard>
    </FormPage>
  );
}
