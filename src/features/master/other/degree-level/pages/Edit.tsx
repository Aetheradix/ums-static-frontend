import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { Loader } from 'shared/components/progress';
import { useParamsId } from 'shared/hooks/params';
import { FormCard, FormPage } from 'shared/new-components';
import { masterUrls } from '../../../urls';
import DegreeLevelForm from '../components/DegreeLevelForm';
import { useDegreeLevelQuery, useUpdateDegreeLevelMutation } from '../queries';

const DEFAULT: Master.Other.DegreeLevelForm = {
  name: '',
};

export default function Edit() {
  const navigate = useNavigate();
  const id = useParamsId();
  const { mutateAsync, isPending } = useUpdateDegreeLevelMutation(id);
  const { data = DEFAULT, isLoading } = useDegreeLevelQuery(id);

  const handleBack = useCallback(() => {
    navigate(masterUrls.degreeLevel.root);
  }, [navigate]);

  if (isLoading) {
    return <Loader />;
  }

  async function handleSubmit(data: Master.Other.DegreeLevelForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Degree level updated successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to update degree level');
    }
  }

  return (
    <FormPage
      title="Edit Degree Level"
      description="Update the details of the degree level."
    >
      <FormCard title="Degree Level Details">
        <DegreeLevelForm
          fetchData={data}
          isSaving={isPending}
          isEditMode
          onSubmit={handleSubmit}
        />
      </FormCard>
    </FormPage>
  );
}
