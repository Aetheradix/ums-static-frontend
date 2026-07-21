import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';

interface OptionDropDownProps {
  label?: string;
  data?: Data.DataItem<string>[];
  value?: string | null;
  textField?: string;
  valueField?: string;
  onChange?: (value: string | null) => void;
  disabled?: boolean;
  required?: boolean;
  defaultOptionText?: string;
  filter?: boolean;
  className?: string;
  appendTo?: 'self' | HTMLElement | (() => HTMLElement) | undefined | null;
}

// Typed wrapper around DropDownList so callers pass string ids without fighting
// the component's generic inference. Option values are coerced to strings.
export default function OptionDropDown(props: OptionDropDownProps) {
  const { onChange, value, textField, valueField, ...rest } = props;
  return (
    <DropDownList<FieldValues, Data.DataItem<string>>
      {...rest}
      textField={textField as keyof Data.DataItem<string>}
      valueField={valueField as keyof Data.DataItem<string>}
      value={value as Data.DataItem<string> | null}
      onChange={v => {
        const out =
          v === null || v === undefined
            ? null
            : String(
                typeof v === 'object' ? (v as Data.DataItem<string>).id : v
              );
        onChange?.(out);
      }}
    />
  );
}
