import { useDistrictsQuery } from 'features/master/location/district/queries';
import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';

interface SelectDistrictProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
  divisionId?: number | string | null;
}

export default function SelectDistrict<T extends FieldValues>({
  defaultOptionText,
  label = 'District',
  divisionId,
  ...props
}: SelectDistrictProps<T> &
  Controls.InputBlockProps & { defaultOptionText?: string }) {
  const { data, isLoading } = useDistrictsQuery();

  const activeData =
    data?.filter((item: Master.DistrictItem) => item.isActive === true) || [];

  const filteredData =
    divisionId !== undefined
      ? activeData.filter(
          (item: Master.DistrictItem) =>
            String(item.divisionId) === String(divisionId)
        )
      : activeData;

  const isDisabled = divisionId !== undefined ? !divisionId : props.disabled;

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
