import { useDivisionsQuery } from 'features/master/location/division/queries';
import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';

interface SelectDivisionProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
  stateId?: number | string | null;
}

export default function SelectDivision<T extends FieldValues>({
  defaultOptionText,
  label = 'Division',
  stateId,
  ...props
}: SelectDivisionProps<T> &
  Controls.InputBlockProps & { defaultOptionText?: string }) {
  const { data, isLoading } = useDivisionsQuery();

  const activeData =
    data?.filter((item: Master.DivisionItem) => item.isActive === true) || [];

  const filteredData =
    stateId !== undefined
      ? activeData.filter(
          (item: Master.DivisionItem) =>
            String(item.stateId) === String(stateId)
        )
      : activeData;

  const isDisabled = stateId !== undefined ? !stateId : props.disabled;

  return (
    <DropDownList
      data={filteredData}
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
      disabled={isDisabled}
    />
  );
}
