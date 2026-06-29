import { PickList as PrimePickList } from 'primereact/picklist';
import { Controller, type FieldValues } from 'react-hook-form';
import InputBlock from './InputBlock';

interface PickListProps<TForm extends FieldValues, TData = any>
  extends Controls.FormProps<TForm>, Controls.InputBlockProps {
  source: TData[];
  target: TData[];
  onChange?: (e: { source: TData[]; target: TData[] }) => void;
  itemTemplate?: (item: TData) => React.ReactNode;
  sourceHeader?: React.ReactNode;
  targetHeader?: React.ReactNode;
  dataKey?: string;
  className?: string;
}

function InnerPickList<TData = any>({
  id,
  name,
  errorMessage,
  label,
  required,
  subLabel,
  source,
  target,
  onChange,
  itemTemplate,
  sourceHeader = 'Available Items',
  targetHeader = 'Selected Items',
  dataKey = 'id',
  className,
}: PickListProps<FieldValues, TData>) {
  const inputId = id ?? name;

  const defaultItemTemplate = (item: any) => {
    return (
      <div className="text-[13px] font-medium text-slate-300 px-2 py-1">
        {item.label || item.name || item}
      </div>
    );
  };

  return (
    <InputBlock
      label={label}
      id={inputId}
      errorMessage={errorMessage}
      required={required}
      subLabel={subLabel}
    >
      <div className={`picklist-wrapper ${className || ''}`}>
        <PrimePickList
          source={source}
          target={target}
          onChange={onChange}
          itemTemplate={itemTemplate || defaultItemTemplate}
          sourceHeader={sourceHeader}
          targetHeader={targetHeader}
          dataKey={dataKey}
          showSourceControls={false}
          showTargetControls={true}
          className="w-full text-sm"
          breakpoint="768px"
        />
      </div>
    </InputBlock>
  );
}

export default function PickList<TForm extends FieldValues, TData = any>({
  name,
  control,
  ...rest
}: PickListProps<TForm, TData>) {
  if (!control || !name) {
    return <InnerPickList name={name} {...rest} />;
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <InnerPickList
          name={name}
          errorMessage={fieldState.error?.message}
          {...rest}
          source={field.value?.source || rest.source}
          target={field.value?.target || rest.target}
          onChange={e => {
            field.onChange({ source: e.source, target: e.target });
            rest.onChange?.(e);
          }}
        />
      )}
    />
  );
}
