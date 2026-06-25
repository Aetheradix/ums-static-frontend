import { Link } from 'react-router';
import './Button.css';

type ButtonSize = 'small' | 'medium' | 'large';

interface LinkButtonProps {
  to: string;
  label: string;
  icon?: string;
  size?: ButtonSize;
}

export default function LinkButton(props: LinkButtonProps) {
  const { size = 'medium' } = props;
  const hasIcon = !!props.icon;
  const className = `p-component p-button p-button-outlined button-size-${size}${hasIcon ? ' p-button-icon-left' : ''}`;
  return (
    <Link to={props.to} className={className}>
      {hasIcon ? (
        <span className={`p-button-icon pi pi-${props.icon}`}></span>
      ) : undefined}
      {props.label}
    </Link>
  );
}
