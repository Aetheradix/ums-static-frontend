import { Controller } from 'react-hook-form';
import { Button } from 'shared/components/buttons';
import { DatePicker, TextBox } from 'shared/components/forms';
import { FormGrid } from 'shared/new-components';
import { useDraftSearchForm, type DraftSearchFormData } from './form.hook';

interface DraftSearchFormProps {
  onSubmit: (data: DraftSearchFormData) => void;
  isFetching: boolean;
}

export default function DraftSearchForm({
  onSubmit,
  isFetching,
}: DraftSearchFormProps) {
  const { register, control, handleSubmit, isValid } = useDraftSearchForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGrid columns={3}>
        <TextBox
          label="Application Number"
          placeholder="Enter Application Number"
          {...register('applicationNumber')}
          required
        />

        <Controller
          control={control}
          name="establishmentYear"
          render={({ field, fieldState }) => (
            <DatePicker
              label="Establishment Year"
              placeholder="Select establishment year"
              name={field.name}
              value={
                field.value ? new Date(field.value as number, 0, 1) : undefined
              }
              onChange={val => field.onChange(val ? val.getFullYear() : null)}
              view="year"
              dateFormat="yy"
              errorMessage={fieldState.error?.message}
              required
            />
          )}
        />

        <div className="flex items-start mt-7">
          <Button
            type="submit"
            label={isFetching ? 'Searching...' : 'Search'}
            icon="search"
            disabled={!isValid || isFetching}
          />
        </div>
      </FormGrid>
    </form>
  );
}
