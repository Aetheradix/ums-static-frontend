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

const colorClassMap: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  orange: 'bg-orange-100 text-orange-600',
  red: 'bg-red-100 text-red-600',
  teal: 'bg-teal-100 text-teal-600',
  indigo: 'bg-indigo-100 text-indigo-600',
  amber: 'bg-amber-100 text-amber-600',
  pink: 'bg-pink-100 text-pink-600',
};

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

  const iconClasses = colorClassMap[colorScheme] || colorClassMap.blue;

  return (
    <div className="stat-card">
      <div className="stat-card-body">
        <div className={`stat-card-icon ${iconClasses}`}>
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
