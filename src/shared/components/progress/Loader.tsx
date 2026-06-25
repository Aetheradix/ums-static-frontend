// import { ProgressSpinner } from 'primereact/progressspinner';
import './Loader.css';

interface LoaderProps {
  type?: 'full' | 'relative' | 'inline';
  blur?: boolean;
}

import SkeletonLoader from 'shared/new-components/skeleton/SkeletonLoader';

export default function Loader({ type = 'full' }: LoaderProps) {
  return <SkeletonLoader type={type === 'inline' ? 'card' : 'grid'} />;
}
