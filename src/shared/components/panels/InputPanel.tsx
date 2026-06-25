import './InputPanel.css';

interface Props {
  title?: string;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

export default function InputPanel({
  orientation = 'vertical',
  className = '',
  children,
}: React.PropsWithChildren<Props>) {
  return (
    <div className={`input-panel ${orientation} ${className}`}>{children}</div>
  );
}
