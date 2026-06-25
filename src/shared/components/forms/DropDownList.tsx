import { Checkbox as PrimeCheckbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { Controller, type FieldValues } from 'react-hook-form';

import InputBlock from './InputBlock';

interface DefaultProps<TData> {
  defaultValue?: TData;
}

interface InnerDropDownProps<TData, TForm extends FieldValues>
  extends
    Controls.FormProps<TForm>,
    Controls.InputBlockProps,
    Controls.InputProps {
  data?: TData[];
  value?: TData | string | number | null;
  textField?: keyof TData;
  valueField?: keyof TData;
  onChange?: (value: TData | string | number | null) => void;
  required?: boolean;
  defaultOptionText?: string;
  filter?: boolean;
  equired?: boolean;
  appendTo?: 'self' | HTMLElement | (() => HTMLElement) | undefined | null;
  showCheckbox?: boolean;
  checkboxChecked?: boolean;
  onCheckboxChange?: (checked: boolean) => void;
  optionValue?: string;
  dataKey?: string;
}

interface DropDownProps<TData, TForm extends FieldValues>
  extends InnerDropDownProps<TData, TForm>, DefaultProps<TData> {}

function InnerDropDownList<TData = Data.DataItem<number>>({
  id,
  name,
  errorMessage,
  label,
  data,
  textField = 'text' as keyof TData,
  valueField = 'value' as keyof TData,
  onChange,
  required,
  defaultOptionText,
  filter = true,
  appendTo = 'self',
  showCheckbox,
  checkboxChecked,
  onCheckboxChange,
  ...rest
}: InnerDropDownProps<TData, FieldValues>) {
  const optionsWithDefault = [
    {
      [textField]: defaultOptionText,
      ...(textField !== valueField ? { [valueField]: null } : {}),
    } as unknown as TData,
    ...(data ?? []),
  ];

  return (
    <InputBlock
      id={id}
      label={label}
      errorMessage={errorMessage}
      required={required}
    >
      <div className="input-field-wrapper p-input-icon-left">
        {showCheckbox && (
          <div className="input-checkbox-overlay">
            <PrimeCheckbox
              checked={checkboxChecked ?? false}
              onChange={e => onCheckboxChange?.(e.checked ?? false)}
            />
          </div>
        )}
        <Dropdown
          inputId={id ?? name}
          options={!defaultOptionText ? data : optionsWithDefault}
          optionLabel={textField as string}
          onChange={e => {
            if (e.value === defaultOptionText) {
              onChange?.(null);
            } else {
              onChange?.(e.value);
            }
          }}
          invalid={!!errorMessage}
          className={`w-full ${showCheckbox ? 'pl-8' : ''}`}
          filter={filter}
          resetFilterOnHide={true}
          appendTo={appendTo}
          {...rest}
        />
      </div>
    </InputBlock>
  );
}

function ControllerDropDownList<
  TForm extends FieldValues,
  TData = Data.DataItem<number>,
>({ name, control, defaultValue, ...rest }: DropDownProps<TData, TForm>) {
  return (
    <Controller
      control={control}
      name={name!}
      render={({ field, formState }) => {
        return (
          <InnerDropDownList
            errorMessage={formState.errors[name]?.message?.toString()}
            {...rest}
            {...field}
            value={field.value ?? defaultValue}
          />
        );
      }}
    />
  );
}

export default function DropDownList<
  TForm extends FieldValues,
  TData = Data.DataItem<number>,
>({ name, control, defaultValue, ...rest }: DropDownProps<TData, TForm>) {
  if (!control || !name) {
    return <InnerDropDownList name={name} {...rest} />;
  }

  return (
    <ControllerDropDownList
      name={name}
      control={control}
      defaultValue={defaultValue}
      {...rest}
    />
  );
}
