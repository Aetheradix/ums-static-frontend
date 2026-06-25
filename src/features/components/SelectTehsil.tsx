import { useTehsilsQuery } from 'features/master/location/tehsil/queries';
import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';

interface SelectTehsilProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
  districtId?: number | string | null;
}

export default function SelectTehsil<T extends FieldValues>({
  defaultOptionText,
  label = 'Tehsil',
  districtId,
  ...props
}: SelectTehsilProps<T> &
  Controls.InputBlockProps & { defaultOptionText?: string }) {
  const { data, isLoading } = useTehsilsQuery();

  const activeData =
    data?.filter((item: Master.TehsilItem) => item.isActive === true) || [];

  const filteredData =
    districtId !== undefined
      ? activeData.filter(
          (item: Master.TehsilItem) =>
            String(item.districtId) === String(districtId)
        )
      : activeData;

  const isDisabled = districtId !== undefined ? !districtId : props.disabled;

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
