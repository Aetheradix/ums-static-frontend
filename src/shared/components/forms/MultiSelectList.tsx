import { MultiSelect } from 'primereact/multiselect';
import { Controller, type FieldValues } from 'react-hook-form';

import InputBlock from './InputBlock';

interface MultiSelectProps<TData, TForm extends FieldValues>
  extends
    Controls.FormProps<TForm>,
    Controls.InputBlockProps,
    Controls.InputProps {
  data?: TData[];
  value?: TData[];
  textField?: keyof TData;
  onChange?: (obj: TData[]) => void;
  required?: boolean;
  appendTo?: 'self' | HTMLElement | (() => HTMLElement) | undefined | null;
}

function InnerMultiSelectList<TData = Data.DataItem<number>>({
  id,
  name,
  errorMessage,
  label,
  data,
  textField = 'text' as keyof TData,
  onChange,
  required,
  appendTo = 'self',
  ...rest
}: MultiSelectProps<TData, FieldValues>) {
  const displayLabel = required && label ? `${label}` : label;
  return (
    <InputBlock
      id={id}
      label={displayLabel}
      errorMessage={errorMessage}
      required={required}
    >
      <MultiSelect
        inputId={id ?? name}
        options={data}
        optionLabel={textField as string}
        onChange={e => onChange?.(e.value)}
        invalid={!!errorMessage}
        filter={true}
        resetFilterOnHide={true}
        display="chip"
        maxSelectedLabels={1}
        selectedItemsLabel="{0} items selected"
        appendTo={appendTo}
        className="w-full flex items-center min-h-[44px]"
        {...rest}
      />
    </InputBlock>
  );
}

export default function MultiSelectList<
  TForm extends FieldValues,
  TData = Data.DataItem<number>,
>({ name, control, ...rest }: MultiSelectProps<TData, TForm>) {
  if (!control || !name) {
    return <InnerMultiSelectList name={name} {...rest} />;
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, formState }) => {
        return (
          <InnerMultiSelectList
            errorMessage={formState.errors[name]?.message?.toString()}
            {...rest}
            {...field}
          />
        );
      }}
    />
  );
}
