import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DropDownList, Switch, TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { PLACEMENT_SEASON_STATUS } from '../constants';
import type { PlacementSeason, PlacementSeasonInput } from '../types';

interface PlacementSeasonFormProps {
  defaultValues?: PlacementSeason;
  onSubmit: (data: PlacementSeasonInput) => Promise<void>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

const statusOptions = PLACEMENT_SEASON_STATUS.map((s: string) => ({
  id: s,
  name: s,
}));

export default function PlacementSeasonForm({
  defaultValues,
  onSubmit,
  isSaving,
  isEditMode,
}: PlacementSeasonFormProps) {
  const { control, handleSubmit, reset, watch } = useForm<PlacementSeasonInput>(
    {
      defaultValues: defaultValues ?? {
        code: '',
        name: '',
        feeApplicableCompany: false,
        companyFeeAmount: 0,
        feeApplicableStudent: false,
        studentFeeAmount: 0,
        status: 'Active',
        academicYear: '2024-25',
      },
    }
  );

  const feeCompany = watch('feeApplicableCompany');
  const feeStudent = watch('feeApplicableStudent');

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGrid columns={2}>
        <TextBox
          label="Season Code"
          placeholder="e.g. PL2025-JUN"
          name="code"
          control={control}
          maxLength={20}
          required
        />
        <TextBox
          label="Season Name"
          placeholder="e.g. June-July 2025 Drive"
          name="name"
          control={control}
          maxLength={100}
          required
        />
        <TextBox
          label="Academic Year"
          placeholder="e.g. 2024-25"
          name="academicYear"
          control={control}
          required
        />
        <DropDownList
          label="Status"
          name="status"
          control={control}
          data={statusOptions}
          textField="name"
          valueField="id"
          required
        />
        <Switch
          label="Fee Applicable for Company"
          name="feeApplicableCompany"
          control={control}
        />
        {feeCompany && (
          <TextBox
            label="Company Fee Amount (₹)"
            type="number"
            name="companyFeeAmount"
            control={control}
          />
        )}
        <Switch
          label="Fee Applicable for Student"
          name="feeApplicableStudent"
          control={control}
        />
        {feeStudent && (
          <TextBox
            label="Student Fee Amount (₹)"
            type="number"
            name="studentFeeAmount"
            control={control}
          />
        )}
      </FormGrid>

      <FormActions
        isEditMode={isEditMode}
        isLoading={isSaving}
        onSave={handleSubmit(onSubmit)}
        onReset={() => reset()}
      />
    </form>
  );
}
