import { type ReactNode } from 'react';
import './Page.css';
import PageHeader from './PageHeader';

interface PageProps extends React.PropsWithChildren {
  header: string;
  subHeader?: string;
  offCanvas?: ReactNode;
  showInfoIcon?: boolean;
}

export default function Page({ children, ...rest }: PageProps) {
  return (
    <div className="main-page">
      <PageHeader {...rest} />
      {children}
    </div>
  );
}
