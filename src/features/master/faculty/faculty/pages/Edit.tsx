import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { Loader } from 'shared/components/progress';
import { masterUrls } from '../../../urls';
import FacultyForm from '../components/FacultyForm';
import { useFacultyQuery, useUpdateFacultyMutation } from '../queries';

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const facultyId = Number(id);
  const { data, isLoading } = useFacultyQuery(facultyId);
  const { mutateAsync, isPending } = useUpdateFacultyMutation(facultyId);

  const handleBack = useCallback(() => {
    navigate(masterUrls.faculty.root);
  }, [navigate]);

  async function handleSubmit(formData: Master.FacultyForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Faculty updated successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to update faculty');
    }
  }

  return (
    <FormPage
      title="Edit Faculty"
      description="Update the details of the faculty."
    >
      <FormCard title="Faculty Details">
        {isLoading ? (
          <Loader />
        ) : (
          <FacultyForm
            onSubmit={handleSubmit}
            fetchData={() => Promise.resolve(data!)}
            isSaving={isPending}
            isEditMode
          />
        )}
      </FormCard>
    </FormPage>
  );
}
