import { Icon } from 'shared/components/Icon/Icon';
import './StatCard.css';

interface StatCardTrend {
  value: number;
  direction: 'up' | 'down' | 'neutral';
  label?: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  colorScheme?:
    | 'blue'
    | 'green'
    | 'purple'
    | 'orange'
    | 'red'
    | 'teal'
    | 'indigo'
    | 'amber'
    | 'pink';
  subtitle?: string;
  trend?: StatCardTrend;
}

export default function StatCard({
  title,
  value,
  icon,
  colorScheme = 'blue',
  subtitle,
  trend,
}: StatCardProps) {
  const trendIcon =
    trend?.direction === 'up'
      ? 'arrow-up-right'
      : trend?.direction === 'down'
        ? 'arrow-down-right'
        : 'minus';

  return (
    <div className="stat-card">
      <div className="stat-card-body">
        <div className={`stat-card-icon bg-${colorScheme}`}>
          <Icon name={icon} />
        </div>
        <div className="stat-card-info">
          <span className="stat-card-value">{value}</span>
          <span className="stat-card-title">{title}</span>
          {subtitle && <span className="stat-card-subtitle">{subtitle}</span>}
        </div>
      </div>

      {trend && (
        <div className={`stat-card-trend stat-card-trend-${trend.direction}`}>
          <i className={`pi pi-${trendIcon}`} />
          <span>
            {trend.value}%{trend.label ? ` ${trend.label}` : ''}
          </span>
        </div>
      )}
    </div>
  );
}
