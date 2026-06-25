import { Checkbox as PrimeCheckbox } from 'primereact/checkbox';
import { Controller, type FieldValues } from 'react-hook-form';
import InputBlock from './InputBlock';

interface CheckBoxProps<TForm extends FieldValues>
  extends
    Controls.FormProps<TForm>,
    Controls.InputBlockProps,
    Controls.InputProps {
  checked?: boolean;
  onChange?: (value: boolean) => void;
  required?: boolean;
  subLabel?: string;
}

function InnerCheckBox({
  id,
  name,
  label,
  errorMessage,
  checked,
  onChange,
  required,
  subLabel,
  ...rest
}: CheckBoxProps<FieldValues>) {
  const inputId = id ?? name;
  return (
    <InputBlock
      id={inputId}
      label={label}
      errorMessage={errorMessage}
      required={required}
      subLabel={subLabel}
    >
      <PrimeCheckbox
        inputId={inputId}
        checked={checked ?? false}
        onChange={e => onChange?.(e.checked ?? false)}
        {...rest}
      />
    </InputBlock>
  );
}

export default function Checkbox<TForm extends FieldValues>({
  name,
  control,
  checked,
  onChange,
  ...rest
}: CheckBoxProps<TForm>) {
  if (!control || !name) {
    return (
      <InnerCheckBox
        name={name}
        checked={checked}
        onChange={onChange}
        {...rest}
      />
    );
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, formState }) => {
        return (
          <InnerCheckBox
            errorMessage={formState.errors[name]?.message?.toString()}
            {...rest}
            {...field}
            checked={field.value}
            onChange={field.onChange}
          />
        );
      }}
    />
  );
}
