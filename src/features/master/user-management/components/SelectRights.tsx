import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';
import { RIGHTS } from '../static-data';

export default function SelectRights<T extends FieldValues>({
  label = 'Access Right',
  disabled,
  ...props
}: Controls.FormProps<T> & {
  label?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <DropDownList
      data={RIGHTS}
      textField={'name'}
      optionValue={'value'}
      label={label}
      placeholder="Select Access Right"
      disabled={disabled}
      {...props}
    />
  );
}
