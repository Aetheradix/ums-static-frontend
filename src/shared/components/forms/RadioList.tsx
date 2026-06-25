import { RadioButton as PrimeRadioButton } from 'primereact/radiobutton';
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import './RadioButtonList.css';

export interface RadioOption<TValue = string | number | boolean> {
  label: string;
  value: TValue;
  disabled?: boolean;
  inputId?: string;
}

export interface RadioButtonListProps<
  TForm extends FieldValues = FieldValues,
  TValue = string | number | boolean,
> {
  name: string;
  control?: Control<TForm>;
  options: RadioOption<TValue>[];
  value?: TValue;
  onChange?: (e: { target: { name: string; value: TValue } }) => void;
  onBlur?: (e: React.FocusEvent<HTMLElement>) => void;
  errorMessage?: string;
  id?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  variant?: 'horizontal' | 'vertical';
  labelWidth?: 'sm' | 'md' | 'lg';
  optionLayout?: 'horizontal' | 'vertical';
}

export default function RadioButtonList<TForm extends FieldValues>({
  name,
  control,
  options,
  value,
  onChange,
  onBlur,
  errorMessage,
  id,
  label,
  className = '',
  disabled = false,
  required = false,
  variant = 'horizontal',
  labelWidth = 'md',
  optionLayout = 'horizontal',
}: RadioButtonListProps<TForm>) {
  const renderContent = (
    curValue: string | number | boolean | undefined,
    curError?: string,
    fieldOnBlur?: () => void,
    fieldOnChange?: (val: string | number | boolean) => void
  ) => {
    const error = curError || errorMessage;

    return (
      <div className={`form-field-wrapper radio-button-container ${className}`}>
        <div
          className={
            variant === 'vertical'
              ? 'flex flex-col gap-2'
              : 'flex flex-col md:flex-row md:items-start gap-2 md:gap-4'
          }
        >
          {label && (
            <label
              className={`
                form-field-label
                ${variant === 'horizontal' ? `radio-label-${labelWidth}` : ''}
              `}
            >
              {label}

              {required && <span className="form-required">*</span>}
            </label>
          )}

          <div className="flex-1 w-full">
            <div
              className={`flex ${
                optionLayout === 'vertical'
                  ? 'flex-col gap-2'
                  : 'flex-row gap-4 flex-wrap'
              }`}
            >
              {options.map(opt => {
                const optId =
                  opt.inputId || `${id || name}-${String(opt.value)}`;

                return (
                  <div
                    key={String(opt.value)}
                    className="flex items-center gap-2"
                  >
                    <PrimeRadioButton
                      inputId={optId}
                      name={name}
                      value={opt.value}
                      checked={curValue === opt.value}
                      disabled={disabled || opt.disabled}
                      invalid={!!error}
                      onBlur={e => {
                        fieldOnBlur?.();
                        onBlur?.(e);
                      }}
                      onChange={e => {
                        fieldOnChange?.(e.value);
                        onChange?.({ target: { name, value: e.value } });
                      }}
                    />

                    <label htmlFor={optId} className="form-option-label">
                      {opt.label}
                    </label>
                  </div>
                );
              })}
            </div>

            {error && <small className="form-error-message">{error}</small>}
          </div>
        </div>
      </div>
    );
  };

  if (!control) return renderContent(value);

  return (
    <Controller
      name={name as Path<TForm>}
      control={control}
      render={({ field, fieldState }) =>
        renderContent(
          field.value,
          fieldState.error?.message,
          field.onBlur,
          field.onChange
        )
      }
    />
  );
}
