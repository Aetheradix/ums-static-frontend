import { useSessionsQuery } from 'features/career-advancement/sessions-management/queries';
import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';

interface SelectCaSessionProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
  value?: string | number | null;
  onChange?: (value: unknown) => void;
}

export default function SelectCaSession<T extends FieldValues>({
  defaultOptionText,
  label = 'Session',
  ...props
}: SelectCaSessionProps<T> &
  Controls.InputBlockProps & { defaultOptionText?: string }) {
  const { data, isLoading } = useSessionsQuery();

  return (
    <DropDownList
      data={data}
      loading={isLoading}
      textField="sessionName"
      valueField="id"
      optionValue="id"
      label={label}
      defaultOptionText={defaultOptionText}
      placeholder={
        defaultOptionText === null || defaultOptionText === undefined
          ? `Select ${label}`
          : defaultOptionText
      }
      {...props}
    />
  );
}
