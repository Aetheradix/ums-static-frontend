import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';

const DOMAIN_OPTIONS = [{ name: 'GLOBAL', value: 'GLOBAL' }];

export default function SelectDomain<T extends FieldValues>({
  label = 'Domain',
  disabled,
  ...props
}: Controls.FormProps<T> & {
  label?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <DropDownList
      data={DOMAIN_OPTIONS}
      textField={'name'}
      optionValue={'value'}
      label={label}
      placeholder="Select Domain"
      disabled={disabled}
      {...props}
    />
  );
}
