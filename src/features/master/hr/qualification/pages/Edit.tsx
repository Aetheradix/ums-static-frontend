import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { Loader } from 'shared/components/progress';
import { useParamsId } from 'shared/hooks/params';
import { FormCard, FormPage } from 'shared/new-components';
import { masterUrls } from '../../../urls';
import QualificationForm from '../components/QualificationForm';
import {
  useQualificationQuery,
  useUpdateQualificationMutation,
} from '../queries';

const DEFAULT: Master.HR.QualificationForm = {
  name: '',
  subject: '',
  code: '',
  isActive: true,
};

export default function Edit() {
  const navigate = useNavigate();
  const id = useParamsId();
  const { mutateAsync, isPending } = useUpdateQualificationMutation(id);
  const { data = DEFAULT, isLoading } = useQualificationQuery(id);

  const handleBack = useCallback(() => {
    navigate(masterUrls.qualification.root);
  }, [navigate]);

  async function handleSubmit(formData: Master.HR.QualificationForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Qualification updated successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to update qualification');
    }
  }

  return (
    <FormPage
      title="Edit Qualification"
      description="Update the details of the qualification."
    >
      <FormCard title="Qualification Details">
        {isLoading ? (
          <Loader />
        ) : (
          <QualificationForm
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
