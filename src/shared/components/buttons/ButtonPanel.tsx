import './ButtonPanel.css';

type ButtonPanelProps = React.PropsWithChildren<{
  className?: string;
}>;

export default function ButtonPanel({
  children,
  className = '',
}: ButtonPanelProps) {
  return <div className={`button-panel ${className}`.trim()}>{children}</div>;
}
