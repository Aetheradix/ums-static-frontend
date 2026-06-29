import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import PlacementSeasonForm from '../../../components/PlacementSeasonForm';
import { useSaveSeasonMutation, useSeasonQuery } from '../../../hooks/queries';
import { tpUrls } from '../../../urls';
import type { PlacementSeasonInput } from '../../../types';

export default function PlacementSeasonEdit() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: season, isLoading } = useSeasonQuery(id);
  const { mutateAsync, isPending } = useSaveSeasonMutation();

  const handleBack = useCallback(() => {
    navigate(tpUrls.admin.settings.placementSeasons);
  }, [navigate]);

  async function handleSubmit(data: PlacementSeasonInput) {
    try {
      await mutateAsync({
        ...data,
        id,
        feeApplicableCompany: Boolean(data.feeApplicableCompany),
        feeApplicableStudent: Boolean(data.feeApplicableStudent),
        companyFeeAmount: Number(data.companyFeeAmount) || 0,
        studentFeeAmount: Number(data.studentFeeAmount) || 0,
      });
      ToastService.success('Placement season updated successfully.');
      handleBack();
    } catch (err) {
      ToastService.error(
        err instanceof Error ? err.message : 'Failed to update placement season'
      );
    }
  }

  return (
    <FormPage
      title="Update Placement Season"
      description="Edit placement season configuration."
      breadcrumbs={[
        { label: 'Training & Placement', to: tpUrls.root },
        { label: 'Admin Portal', to: tpUrls.admin.portal },
        {
          label: 'Placement Seasons',
          to: tpUrls.admin.settings.placementSeasons,
        },
        { label: 'Edit' },
      ]}
    >
      <FormCard title="Season Details">
        {!isLoading && season && (
          <PlacementSeasonForm
            defaultValues={season}
            onSubmit={handleSubmit}
            isSaving={isPending}
            isEditMode
          />
        )}
      </FormCard>
    </FormPage>
  );
}
