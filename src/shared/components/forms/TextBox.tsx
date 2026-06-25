import { Checkbox as PrimeCheckbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { Controller, type FieldValues } from 'react-hook-form';
import { sanitizeInput } from '../../utils/validation/config';
import InputBlock from './InputBlock';

interface TextBoxProps<TForm extends FieldValues>
  extends
    Controls.FormProps<TForm>,
    Controls.InputBlockProps,
    Controls.InputProps {
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  className?: string;
  maxLength?: number;
  minLength?: number;
  autocomplete?: string;
  showCheckbox?: boolean;
  checkboxChecked?: boolean;
  onCheckboxChange?: (checked: boolean) => void;
}

function InnerTextBox({
  id,
  name,
  value,
  errorMessage,
  label,
  onChange,
  required,
  icon,
  className,
  subLabel,
  iconPosition = 'left',
  autocomplete = 'off',
  showCheckbox,
  checkboxChecked,
  onCheckboxChange,
  ...rest
}: TextBoxProps<FieldValues>) {
  const inputId = id ?? name;

  return (
    <InputBlock
      label={label}
      id={inputId}
      errorMessage={errorMessage}
      subLabel={subLabel}
      required={required}
    >
      <div className={`input-field-wrapper p-input-icon-${iconPosition}`}>
        {showCheckbox ? (
          <div className="input-checkbox-overlay">
            <PrimeCheckbox
              checked={checkboxChecked ?? false}
              onChange={e => onCheckboxChange?.(e.checked ?? false)}
            />
          </div>
        ) : icon ? (
          <i
            className={`pi pi-${icon} input-icon ${
              iconPosition === 'left' ? 'input-icon-left' : 'input-icon-right'
            }`}
          />
        ) : undefined}
        <InputText
          type="text"
          id={inputId}
          value={value || ''}
          onChange={e => onChange?.(sanitizeInput(e.target.value))}
          invalid={!!errorMessage}
          className={`${className ? className + ' ' : ''}w-full ${showCheckbox ? 'pl-11' : ''}`}
          autoComplete={autocomplete}
          {...rest}
        />
      </div>
    </InputBlock>
  );
}

export default function TextBox<TForm extends FieldValues>({
  name,
  control,
  errorMessage: hardcodedErrorMessage,
  onChange,
  ...rest
}: TextBoxProps<TForm>) {
  if (!control || !name) {
    return (
      <InnerTextBox
        name={name}
        errorMessage={hardcodedErrorMessage}
        onChange={onChange}
        {...rest}
        className="w-full"
      />
    );
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        let finalErrorMessage: string | undefined = undefined;

        if (fieldState.error) {
          if (hardcodedErrorMessage) {
            finalErrorMessage = hardcodedErrorMessage;
          } else {
            finalErrorMessage = fieldState.error.message;
          }
        }

        const shouldShowError = !!finalErrorMessage;

        return (
          <InnerTextBox
            name={name}
            errorMessage={shouldShowError ? finalErrorMessage : undefined}
            value={field.value}
            onChange={value => {
              const sanitizedValue = sanitizeInput(value);
              field.onChange(sanitizedValue);
              onChange?.(sanitizedValue);
            }}
            {...rest}
          />
        );
      }}
    />
  );
}
