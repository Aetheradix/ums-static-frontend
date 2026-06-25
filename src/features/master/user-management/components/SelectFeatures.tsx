import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';
import { useFeaturesQuery } from '../role-permissions/queries';

export default function SelectFeatures<T extends FieldValues>({
  label = 'Feature',
  disabled,
  ...props
}: Controls.FormProps<T> & {
  label?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  const { data, isLoading } = useFeaturesQuery();

  return (
    <DropDownList
      data={data}
      loading={isLoading}
      textField={'name'}
      optionValue={'value'}
      label={label}
      placeholder="Select Feature"
      disabled={disabled}
      {...props}
    />
  );
}
