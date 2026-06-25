import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { Loader } from 'shared/components/progress';
import { useParamsId } from 'shared/hooks/params';
import { FormCard, FormPage } from 'shared/new-components';
import { affiliationManagementSystemUrls } from 'features/affiliation-management-system/urls';
import EstablishmentYearForm from '../components/EstablishmentYearForm';
import {
  useEstablishmentYearQuery,
  useUpdateEstablishmentYearMutation,
} from '../queries';

const DEFAULT = {
  name: '',
};

export default function Edit() {
  const navigate = useNavigate();
  const id = useParamsId();
  const { mutateAsync, isPending } = useUpdateEstablishmentYearMutation(id);
  const { data = DEFAULT, isLoading } = useEstablishmentYearQuery(id);

  const handleBack = useCallback(() => {
    navigate(affiliationManagementSystemUrls.establishmentYear.root);
  }, [navigate]);

  if (isLoading) {
    return <Loader />;
  }

  async function handleSubmit(data: Master.Other.EstablishmentYearForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Establishment Year updated successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to update Establishment Year');
    }
  }

  return (
    <FormPage
      title="Edit Establishment Year"
      description="Update the Establishment Year details."
    >
      <FormCard title="Establishment Year Details">
        <EstablishmentYearForm
          fetchData={data}
          isSaving={isPending}
          isEditMode
          onSubmit={handleSubmit}
        />
      </FormCard>
    </FormPage>
  );
}
