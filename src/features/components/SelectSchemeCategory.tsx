import { useSchemesCategoriesQuery } from 'features/master/schemes/scheme-category/queries';
import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';

interface SelectSchemeCategoryProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  data?: any[];
  label?: string;
  disabled?: boolean;
  schemeTypeId?: number;
}

export default function SelectSchemeCategory<T extends FieldValues>({
  defaultOptionText,
  label = 'Scheme Category',
  data = [],
  schemeTypeId,
  ...props
}: SelectSchemeCategoryProps<T> &
  Controls.InputBlockProps & { defaultOptionText?: string }) {
  const { data: apiData } = useSchemesCategoriesQuery();
  const sourceData = data && data.length > 0 ? data : apiData;

  // Filter active and match schemeTypeId if provided
  const options =
    sourceData?.filter((item: any) => {
      if (schemeTypeId && item.schemeTypeId !== schemeTypeId) return false;
      return true;
    }) || [];

  return (
    <DropDownList
      data={options}
      textField="name"
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
