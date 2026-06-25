import { useLanguagePreferenceQuery } from 'features/master/other/language-preference/queries';
import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';

interface SelectLanguagePreferenceProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
}

export default function SelectLanguagePreference<T extends FieldValues>({
  defaultOptionText,
  label = 'Language Preference',
  ...props
}: SelectLanguagePreferenceProps<T> &
  Controls.InputBlockProps & {
    defaultOptionText?: string;
  }) {
  const { data, isLoading } = useLanguagePreferenceQuery();

  return (
    <DropDownList
      data={data}
      loading={isLoading}
      textField="text"
      valueField="id"
      optionValue="id"
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
