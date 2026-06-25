import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { affiliationManagementSystemUrls } from 'features/affiliation-management-system/urls';
import EstablishmentYearForm from '../components/EstablishmentYearForm';
import { useCreateEstablishmentYearMutation } from '../queries';

export default function Create() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateEstablishmentYearMutation();

  const handleBack = useCallback(() => {
    navigate(affiliationManagementSystemUrls.establishmentYear.root);
  }, [navigate]);

  async function handleSubmit(data: Master.Other.EstablishmentYearForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Establishment Year created successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to create Establishment Year');
    }
  }

  return (
    <FormPage
      title="Create Establishment Year"
      description="Fill in the details to add a new Establishment Year."
    >
      <FormCard title="Establishment Year Details">
        <EstablishmentYearForm
          onSubmit={handleSubmit}
          isSaving={isPending}
          isEditMode={false}
        />
      </FormCard>
    </FormPage>
  );
}
