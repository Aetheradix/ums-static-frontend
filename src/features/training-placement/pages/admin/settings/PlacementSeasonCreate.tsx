import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import PlacementSeasonForm from '../../../components/PlacementSeasonForm';
import { useSaveSeasonMutation } from '../../../hooks/queries';
import { tpUrls } from '../../../urls';
import type { PlacementSeasonInput } from '../../../types';

export default function PlacementSeasonCreate() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useSaveSeasonMutation();

  const handleBack = useCallback(() => {
    navigate(tpUrls.admin.settings.placementSeasons);
  }, [navigate]);

  async function handleSubmit(data: PlacementSeasonInput) {
    try {
      await mutateAsync({
        ...data,
        feeApplicableCompany: Boolean(data.feeApplicableCompany),
        feeApplicableStudent: Boolean(data.feeApplicableStudent),
        companyFeeAmount: Number(data.companyFeeAmount) || 0,
        studentFeeAmount: Number(data.studentFeeAmount) || 0,
      });
      ToastService.success('Placement season created successfully.');
      handleBack();
    } catch (err) {
      ToastService.error(
        err instanceof Error ? err.message : 'Failed to create placement season'
      );
    }
  }

  return (
    <FormPage
      title="Add Placement Season"
      description="Configure a new placement or internship drive season."
      breadcrumbs={[
        { label: 'Training & Placement', to: tpUrls.root },
        { label: 'Admin Portal', to: tpUrls.admin.portal },
        {
          label: 'Placement Seasons',
          to: tpUrls.admin.settings.placementSeasons,
        },
        { label: 'Add' },
      ]}
    >
      <FormCard title="Season Details">
        <PlacementSeasonForm onSubmit={handleSubmit} isSaving={isPending} />
      </FormCard>
    </FormPage>
  );
}
