import { InputText } from 'primereact/inputtext';
import { Controller, type FieldValues } from 'react-hook-form';

import InputBlock from './InputBlock';

interface CaptchaProps<TForm extends FieldValues>
  extends
    Controls.FormProps<TForm>,
    Controls.InputBlockProps,
    Controls.InputProps {
  captchaCode: string;
  onRegenerate?: () => void;
  value?: string;
  onChange?: (value: string) => void;
}

function InnerCaptcha({
  id,
  name,
  value,
  errorMessage,
  label,
  captchaCode,
  onRegenerate,
  onChange,
  ...rest
}: CaptchaProps<FieldValues>) {
  const inputId = id ?? name;
  return (
    <InputBlock label={label} id={inputId} errorMessage={errorMessage}>
      <div className="captcha-row">
        <div
          className={`captcha-image-wrapper ${
            onRegenerate ? 'cursor-pointer' : ''
          }`}
          onClick={onRegenerate}
          title={onRegenerate ? 'Click to regenerate captcha' : undefined}
        >
          <img src={`data:image/png;base64,${captchaCode}`} />
        </div>
        {onRegenerate && (
          <span
            onClick={onRegenerate}
            className="captcha-refresh"
            title="Refresh captcha"
          >
            <i className="pi pi-sync font-bold" />
          </span>
        )}
        <InputText
          type="text"
          id={inputId}
          maxLength={6}
          value={value || ''}
          onChange={e => onChange?.(e.target.value)}
          invalid={!!errorMessage}
          placeholder="Enter captcha"
          className={`${rest.className ?? ''} flex-1 min-w-0`.trim()}
          {...rest}
        />
      </div>
    </InputBlock>
  );
}

export default function Captcha<TForm extends FieldValues>({
  name,
  control,
  errorMessage,
  captchaCode,
  onRegenerate,
  onChange,
  ...rest
}: CaptchaProps<TForm>) {
  if (!control || !name) {
    return (
      <InnerCaptcha
        name={name}
        errorMessage={errorMessage}
        captchaCode={captchaCode}
        onRegenerate={onRegenerate}
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
          <InnerCaptcha
            errorMessage={formState.errors[name]?.message?.toString()}
            captchaCode={captchaCode}
            onRegenerate={onRegenerate}
            {...rest}
            {...field}
          />
        );
      }}
    />
  );
}
