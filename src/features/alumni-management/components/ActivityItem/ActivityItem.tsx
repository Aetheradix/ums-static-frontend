interface ActivityItemProps {
  text: string;
  time: string;
  colorScheme?: 'green' | 'red' | 'purple' | 'blue' | 'amber' | 'teal' | 'gray';
}

export default function ActivityItem({
  text,
  time,
  colorScheme = 'gray',
}: ActivityItemProps) {
  const dotColor = {
    green: 'bg-green-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
    teal: 'bg-teal-500',
    gray: 'bg-gray-400',
  }[colorScheme];

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100">
      <div className={`w-2.5 h-2.5 mt-1.5 rounded-full shrink-0 ${dotColor}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 truncate">{text}</p>
        <p className="text-xs text-gray-400">{time}</p>
      </div>
    </div>
  );
}
