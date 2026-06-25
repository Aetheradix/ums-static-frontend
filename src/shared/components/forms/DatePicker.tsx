import { Calendar } from 'primereact/calendar';
import { Checkbox as PrimeCheckbox } from 'primereact/checkbox';
import { Controller, type FieldValues } from 'react-hook-form';

import InputBlock from './InputBlock';

interface DatePickerProps<TForm extends FieldValues>
  extends
    Controls.FormProps<TForm>,
    Controls.InputBlockProps,
    Controls.InputProps {
  value?: Date;
  onChange?: (value?: Date | null) => void;
  required?: boolean;
  disabledDays?: number[];
  minDate?: Date;
  maxDate?: Date;
  appendTo?: 'self' | HTMLElement | (() => HTMLElement) | undefined | null;
  showCheckbox?: boolean;
  checkboxChecked?: boolean;
  onCheckboxChange?: (checked: boolean) => void;
  panelClassName?: string;
  showTime?: boolean;
  hourFormat?: '12' | '24';
  view?: 'date' | 'month' | 'year';
  dateFormat?: string;
}

function InnerDatePicker({
  id,
  name,
  value,
  errorMessage,
  label,
  onChange,
  required,
  appendTo = 'self',
  showCheckbox,
  checkboxChecked,
  onCheckboxChange,
  ...rest
}: DatePickerProps<FieldValues>) {
  const inputId = id ?? name;

  return (
    <InputBlock
      label={label}
      id={inputId}
      errorMessage={errorMessage}
      required={required}
    >
      <div className="p-input-icon-left datepicker-wrapper w-full">
        {showCheckbox && (
          <div className="date-picker-checkbox-container flex items-center">
            <PrimeCheckbox
              checked={checkboxChecked ?? false}
              onChange={e => onCheckboxChange?.(e.checked ?? false)}
            />
          </div>
        )}
        <Calendar
          inputId={inputId}
          value={value}
          dateFormat="dd/mm/yy"
          onChange={e => onChange?.(e.value)}
          className="w-full custom-calendar"
          invalid={!!errorMessage}
          appendTo={appendTo}
          inputStyle={{
            paddingLeft: showCheckbox ? '2.75rem' : undefined,
          }}
          {...rest}
        />
        <i className="pi pi-calendar calendar-icon" />
      </div>
    </InputBlock>
  );
}

export default function DatePicker<TForm extends FieldValues>({
  control,
  name,
  errorMessage,
  onChange,
  ...rest
}: DatePickerProps<TForm>) {
  if (!control || !name) {
    return (
      <InnerDatePicker
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
      render={({ field, fieldState }) => (
        <InnerDatePicker
          {...field}
          {...rest}
          errorMessage={fieldState.error?.message}
        />
      )}
    />
  );
}
