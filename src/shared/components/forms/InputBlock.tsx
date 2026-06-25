import './InputBlock.css';

type Orientation = 'vertical' | 'horizontal';

export default function InputBlock(
  props: React.PropsWithChildren<
    Controls.InputBlockProps & {
      orientation?: Orientation;
      className?: string;
    }
  >
) {
  const {
    label,
    subLabel,
    id,
    required,
    errorMessage,
    children,
    orientation = 'vertical',
    className = '',
  } = props;

  return (
    <div className={`input-block ${orientation} ${className}`}>
      {/* Label */}
      {label && (
        <label htmlFor={id} className="form-label">
          <span className="label-main">
            {label}
            {subLabel && <span className="label-sub">{subLabel}</span>}
            {required && <span className="label-required">*</span>}
          </span>
        </label>
      )}

      {/* Input */}
      <div className={`input-wrapper ${errorMessage ? 'has-error' : ''}`}>
        {children}
      </div>

      {/* Error Message Underneath */}
      {errorMessage && (
        <span className="input-error-message">{errorMessage}</span>
      )}
    </div>
  );
}
