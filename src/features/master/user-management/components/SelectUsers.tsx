import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';
import { useUsersQuery } from '../user/queries';

export default function SelectUsers<T extends FieldValues>({
  label = 'User',
  disabled,
  ...props
}: Controls.FormProps<T> & {
  label?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  const { data, isLoading } = useUsersQuery();

  return (
    <DropDownList
      data={data}
      loading={isLoading}
      textField={'userName'}
      optionValue={'id'}
      label={label}
      placeholder="Select User"
      disabled={disabled}
      {...props}
    />
  );
}
