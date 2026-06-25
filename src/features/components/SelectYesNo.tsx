import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';

type SelectOption = { label: string; value: string | boolean };

const yesNoOptions: SelectOption[] = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
];

const booleanOptions: SelectOption[] = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
];

interface SelectYesNoProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
  useBooleanValues?: boolean;
}

export default function SelectYesNo<T extends FieldValues>({
  defaultOptionText,
  label = 'Select',
  useBooleanValues = false,
  ...props
}: SelectYesNoProps<T> &
  Controls.InputBlockProps & { defaultOptionText?: string }) {
  const options = useBooleanValues ? booleanOptions : yesNoOptions;

  return (
    <DropDownList
      data={options}
      textField="label"
      valueField="value"
      optionValue="value"
      label={label}
      required={true}
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
