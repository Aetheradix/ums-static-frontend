import { Checkbox as PrimeCheckbox } from 'primereact/checkbox';

interface DeclarationProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id: string;
  text: string;
  required?: boolean;
  className?: string;
}

export default function Declaration({
  checked,
  onChange,
  id,
  text,
  required = true,
  className = '',
}: DeclarationProps) {
  return (
    <div
      className={`border rounded-xl p-5 flex items-start gap-4 transition-colors cursor-pointer select-none ${
        checked
          ? 'bg-emerald-500/10 border-emerald-500/30'
          : 'hover:border-violet-500/30'
      } ${className}`}
      onClick={() => onChange(!checked)}
    >
      <div className="flex items-center justify-center pt-0.5">
        <PrimeCheckbox
          inputId={id}
          checked={checked}
          onChange={e => onChange(e.checked ?? false)}
          className="pointer-events-none"
        />
      </div>
      <div className="flex-1">
        <label
          htmlFor={id}
          className="text-sm leading-relaxed cursor-pointer pointer-events-none block"
        >
          {text}
          {required && <span className="text-red-500 ml-1 font-bold">*</span>}
        </label>
      </div>
    </div>
  );
}
