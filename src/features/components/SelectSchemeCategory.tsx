import { useSchemesCategoriesQuery } from 'features/master/schemes/scheme-category/queries';
import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';

interface SelectSchemeCategoryProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
  schemeTypeId?: number;
}

export default function SelectSchemeCategory<T extends FieldValues>({
  defaultOptionText,
  label = 'Scheme Category',
  schemeTypeId,
  ...props
}: SelectSchemeCategoryProps<T> &
  Controls.InputBlockProps & { defaultOptionText?: string }) {
  const { data, isLoading } = useSchemesCategoriesQuery();

  // Filter active and match schemeTypeId if provided
  const activeData =
    data?.filter((item: Master.Scheme.SchemeCategoryItem) => {
      if (!item.isActive) return false;
      if (schemeTypeId && item.schemeTypeId !== schemeTypeId) return false;
      return true;
    }) || [];

  return (
    <DropDownList
      data={activeData}
      loading={isLoading}
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
