import { InputNumber } from 'primereact/inputnumber';
import { Controller, type FieldValues } from 'react-hook-form';
import InputBlock from './InputBlock';

interface NumberBoxProps<TForm extends FieldValues>
  extends
    Controls.FormProps<TForm>,
    Controls.InputBlockProps,
    Controls.InputProps {
  value?: number;
  mode?: 'currency' | 'decimal';
  currency?: string;
  onChange?: (value?: number | null) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  max?: number;
  min?: number;
  useGrouping?: boolean;
  maxLength?: number;
}

function InnerNumberBox({
  id,
  name,
  value,
  errorMessage,
  label,
  onChange,
  required,
  subLabel,
  mode,
  maxLength,
  ...rest
}: NumberBoxProps<FieldValues>) {
  const inputId = id ?? name;

  return (
    <InputBlock
      label={label}
      id={inputId}
      errorMessage={errorMessage}
      required={required}
      subLabel={subLabel}
    >
      <InputNumber
        {...rest}
        inputId={inputId}
        value={value}
        mode={mode}
        onValueChange={e => {
          if (maxLength && e.value && e.value.toString().length > maxLength) {
            return;
          }
          onChange?.(e.value);
        }}
        onKeyDown={e => {
          if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
          }
          rest.onKeyDown?.(e);
        }}
        invalid={!!errorMessage}
        maxFractionDigits={2}
        maxLength={maxLength}
      />
    </InputBlock>
  );
}

export default function NumberBox<TForm extends FieldValues>({
  control,
  name,
  errorMessage,
  onChange,
  mode = 'decimal',
  ...rest
}: NumberBoxProps<TForm>) {
  if (!control || !name) {
    return (
      <InnerNumberBox
        name={name}
        errorMessage={errorMessage}
        onChange={onChange}
        mode={mode}
        currency="INR"
        {...rest}
      />
    );
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <InnerNumberBox
          errorMessage={fieldState.error?.message?.toString()}
          mode={mode}
          {...field}
          {...rest}
        />
      )}
    />
  );
}
