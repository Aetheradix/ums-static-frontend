import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';
import { USERS } from '../static-data';

export default function SelectUsers<T extends FieldValues>({
  label = 'User',
  disabled,
  ...props
}: Controls.FormProps<T> & {
  label?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <DropDownList
      data={USERS}
      textField={'userName'}
      optionValue={'id'}
      label={label}
      placeholder="Select User"
      disabled={disabled}
      {...props}
    />
  );
}
