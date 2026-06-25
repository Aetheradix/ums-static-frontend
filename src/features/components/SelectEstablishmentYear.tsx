import { useEstablishmentYearsQuery } from 'features/master/other/establishment-year/queries';
import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';

interface SelectEstablishmentYearProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
}

export default function SelectEstablishmentYear<T extends FieldValues>({
  defaultOptionText,
  label = 'Establishment Year',
  ...props
}: SelectEstablishmentYearProps<T> &
  Controls.InputBlockProps & { defaultOptionText?: string }) {
  const { data, isLoading } = useEstablishmentYearsQuery();
  const activeData =
    data?.filter(
      (item: Master.Other.EstablishmentYearItem) => item.isActive === true
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
