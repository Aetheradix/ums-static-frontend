import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';
import { FEATURES } from '../static-data';

export default function SelectFeatures<T extends FieldValues>({
  label = 'Feature',
  disabled,
  ...props
}: Controls.FormProps<T> & {
  label?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <DropDownList
      data={FEATURES}
      textField={'name'}
      optionValue={'value'}
      label={label}
      placeholder="Select Feature"
      disabled={disabled}
      {...props}
    />
  );
}
