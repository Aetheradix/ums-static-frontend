import { Controller, type FieldValues } from 'react-hook-form';
import InputBlock from './InputBlock';

interface SwitchProps<TForm extends FieldValues>
  extends
    Controls.FormProps<TForm>,
    Controls.InputBlockProps,
    Controls.InputProps {
  checked?: boolean;
  onChange?: (value: boolean) => void;
  required?: boolean;
  subLabel?: string;
}

function InnerSwitch({
  id,
  name,
  label,
  errorMessage,
  checked,
  onChange,
  required,
  subLabel,
  className = '',
}: SwitchProps<FieldValues>) {
  const inputId = id ?? name;
  return (
    <InputBlock
      id={inputId}
      label={label}
      errorMessage={errorMessage}
      required={required}
      subLabel={subLabel}
      className={className}
    >
      <div
        onClick={() => onChange?.(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 ${
          checked ? 'bg-indigo-600' : 'bg-slate-200'
        }`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
    </InputBlock>
  );
}

export default function Switch<TForm extends FieldValues>({
  name,
  control,
  checked,
  onChange,
  ...rest
}: SwitchProps<TForm>) {
  if (!control || !name) {
    return (
      <InnerSwitch
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
          <InnerSwitch
            errorMessage={formState.errors[name]?.message?.toString()}
            {...rest}
            {...field}
            checked={field.value ?? false}
            onChange={field.onChange}
          />
        );
      }}
    />
  );
}
