import { Checkbox as PrimeCheckbox } from 'primereact/checkbox';
import type { ReactNode } from 'react';
import { Controller, type FieldValues } from 'react-hook-form';
import './CheckBoxList.css';
import InputBlock from './InputBlock';

interface CheckBoxListProps<TForm extends FieldValues, TData>
  extends
    Controls.FormProps<TForm>,
    Controls.InputBlockProps,
    Controls.InputProps {
  options: TData[];
  selectedValues?: Record<number, boolean>;
  onChange?: (values: Record<number, boolean>) => void;
  columns?: number;
  getLabel: (option: TData) => string;
  getValue: (option: TData) => number;
  getDisabled?: (option: TData) => boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  itemClassName?: string;
  renderOption?: (option: TData) => ReactNode;
}

function InnerCheckboxList<TData>({
  id,
  name,
  label,
  errorMessage,
  options,
  selectedValues = {},
  onChange,
  disabled = false,
  columns = 3,
  getLabel,
  getValue,
  getDisabled,
  required,
  subLabel,
  className = '',
  itemClassName = '',
  renderOption,
  ...rest
}: CheckBoxListProps<FieldValues, TData>) {
  const inputId = id ?? name;
  const labelId = `${inputId}-label`;

  const handleChange = (value: number, checked: boolean) => {
    onChange?.({ ...selectedValues, [value]: checked });
  };

  const rows: TData[][] = [];

  for (let i = 0; i < options.length; i += columns) {
    rows.push(options.slice(i, i + columns));
  }

  return (
    <InputBlock
      id={labelId}
      label={label}
      errorMessage={errorMessage}
      required={required}
      subLabel={subLabel}
      orientation="horizontal"
    >
      <table className={`checkbox-grid-table ${className}`}>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((option, colIndex) => {
                const optionValue = getValue(option);
                const optionLabel = getLabel(option);
                const optionDisabled = getDisabled?.(option) ?? false;
                const checked = selectedValues[optionValue] ?? false;
                const checkboxId = `${inputId}-${rowIndex}-${colIndex}`;

                return (
                  <td key={checkboxId}>
                    <label
                      htmlFor={checkboxId}
                      className={`checkbox-cell ${itemClassName} ${
                        optionDisabled ? 'text-400' : ''
                      }`}
                    >
                      <span className="checkbox-cell-content">
                        {renderOption ? renderOption(option) : optionLabel}
                      </span>

                      <PrimeCheckbox
                        inputId={checkboxId}
                        checked={checked}
                        onChange={e =>
                          handleChange(optionValue, e.checked ?? false)
                        }
                        disabled={disabled || optionDisabled}
                        {...rest}
                      />
                    </label>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </InputBlock>
  );
}

export default function CheckboxList<TForm extends FieldValues, TData>({
  name,
  control,
  options,
  selectedValues,
  onChange,
  getLabel,
  getValue,
  getDisabled,
  orientation,
  className,
  itemClassName,
  renderOption,
  ...rest
}: CheckBoxListProps<TForm, TData>) {
  if (!control || !name) {
    return (
      <InnerCheckboxList
        name={name}
        options={options}
        selectedValues={selectedValues}
        onChange={onChange}
        getLabel={getLabel}
        getValue={getValue}
        getDisabled={getDisabled}
        orientation={orientation}
        className={className}
        itemClassName={itemClassName}
        renderOption={renderOption}
        {...rest}
      />
    );
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, formState }) => (
        <InnerCheckboxList
          {...rest}
          {...field}
          options={options}
          selectedValues={field.value || {}}
          onChange={field.onChange}
          errorMessage={formState.errors[name]?.message?.toString()}
          getLabel={getLabel}
          getValue={getValue}
          getDisabled={getDisabled}
          className={className}
          itemClassName={itemClassName}
          renderOption={renderOption}
        />
      )}
    />
  );
}
