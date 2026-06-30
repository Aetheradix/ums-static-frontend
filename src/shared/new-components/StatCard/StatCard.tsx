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

const COLOR_MAP: Record<string, string> = {
  blue: 'bg-blue-500 text-white',
  green: 'bg-green-500 text-white',
  purple: 'bg-purple-500 text-white',
  orange: 'bg-orange-500 text-white',
  red: 'bg-red-500 text-white',
  teal: 'bg-teal-500 text-white',
  indigo: 'bg-indigo-500 text-white',
  amber: 'bg-amber-500 text-white',
  pink: 'bg-pink-500 text-white',
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

  return (
    <div className="stat-card">
      <div className="stat-card-body">
        <div
          className={`stat-card-icon ${COLOR_MAP[colorScheme] || 'bg-blue-500 text-white'}`}
        >
          <Icon name={icon} />
        </div>
        <div className="stat-card-info">
          <span className="stat-card-title">{title}</span>
          <span className="stat-card-value">{value}</span>
          {subtitle && <span className="stat-card-subtitle">{subtitle}</span>}
        </div>
      </div>

      {trend && (
        <div className={`stat-card-trend stat-card-trend-${trend.direction}`}>
          <Icon name={trendIcon} className="text-xs" />
          <span>
            {trend.value}%{trend.label ? ` ${trend.label}` : ''}
          </span>
        </div>
      )}
    </div>
  );
}
