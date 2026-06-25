import { useGrantCategoriesQuery } from 'features/master/grant/grant-category/queries';
import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';

interface SelectGrantCategoryProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
  grantTypeId?: number | null;
}

export default function SelectGrantCategory<T extends FieldValues>({
  defaultOptionText,
  label = 'Grant Category',
  grantTypeId,
  ...props
}: SelectGrantCategoryProps<T> &
  Controls.InputBlockProps & { defaultOptionText?: string }) {
  const { data, isLoading } = useGrantCategoriesQuery();
  const activeData =
    data?.filter(
      (item: Master.Grant.GrantCategoryItem) =>
        item.isActive === true &&
        (grantTypeId ? item.grantTypeId === grantTypeId : true)
    ) || [];

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
