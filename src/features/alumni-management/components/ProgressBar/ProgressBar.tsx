interface ProgressBarProps {
  widthClass: string;
  colorScheme?: 'green' | 'amber' | 'red' | 'blue' | 'teal' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  backgroundClass?: string;
}

export default function ProgressBar({
  widthClass,
  colorScheme = 'blue',
  size = 'md',
  backgroundClass = 'bg-gray-100',
}: ProgressBarProps) {
  const heights = { sm: 'h-1.5', md: 'h-3', lg: 'h-4' };

  const colors = {
    green: 'bg-green-400',
    amber: 'bg-amber-400',
    red: 'bg-red-400',
    blue: 'bg-blue-400',
    teal: 'bg-teal-400',
    gray: 'bg-gray-400',
  };

  return (
    <div
      className={`flex-1 ${heights[size]} ${backgroundClass} rounded-full overflow-hidden`}
    >
      <div
        className={`h-full rounded-full transition-all ${colors[colorScheme]} ${widthClass}`}
      />
    </div>
  );
}
