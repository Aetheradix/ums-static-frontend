import { InputTextarea } from 'primereact/inputtextarea';
import { Controller, type FieldValues } from 'react-hook-form';
import { sanitizeInput } from '../../utils/validation/config';

import InputBlock from './InputBlock';

interface TextAreaProps<TForm extends FieldValues>
  extends
    Controls.FormProps<TForm>,
    Controls.InputBlockProps,
    Controls.InputProps {
  value?: string;
  onChange?: (value: string) => void;
  rows?: number;
  cols?: number;
  autoResize?: boolean;
}

function InnerTextArea({
  id,
  name,
  value,
  errorMessage,
  label,
  onChange,
  required,
  subLabel,
  className,
  ...rest
}: TextAreaProps<FieldValues>) {
  const inputId = id ?? name;

  return (
    <InputBlock
      label={label}
      id={inputId}
      errorMessage={errorMessage}
      required={required}
      subLabel={subLabel}
    >
      <InputTextarea
        id={inputId}
        value={value || ''}
        onChange={e => onChange?.(sanitizeInput(e.target.value))}
        invalid={!!errorMessage}
        className={`w-full ${className ?? ''}`}
        {...rest}
      />
    </InputBlock>
  );
}

export default function TextArea<TForm extends FieldValues>({
  name,
  control,
  errorMessage,
  onChange,
  ...rest
}: TextAreaProps<TForm>) {
  if (!control || !name) {
    return (
      <InnerTextArea
        name={name}
        errorMessage={errorMessage}
        onChange={onChange}
        {...rest}
      />
    );
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, formState }) => (
        <InnerTextArea
          errorMessage={formState.errors[name]?.message?.toString()}
          {...rest}
          {...field}
          onChange={value => {
            const sanitizedValue = sanitizeInput(value);
            field.onChange(sanitizedValue);
            onChange?.(sanitizedValue);
          }}
        />
      )}
    />
  );
}
