interface DeadlineItemProps {
  title: string;
  date: string;
  daysLeft: number;
  priority?: 'high' | 'medium' | 'low';
}

export default function DeadlineItem({
  title,
  date,
  daysLeft,
  priority = 'medium',
}: DeadlineItemProps) {
  const styles = {
    high: {
      card: 'border-l-red-500 bg-red-50',
      badge: 'bg-red-100 text-red-700',
    },
    medium: {
      card: 'border-l-amber-500 bg-amber-50',
      badge: 'bg-amber-100 text-amber-700',
    },
    low: {
      card: 'border-l-blue-500 bg-blue-50',
      badge: 'bg-blue-100 text-blue-700',
    },
  };

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border-l-4 ${styles[priority].card}`}
    >
      <div>
        <p className="text-sm font-medium text-gray-800">{title}</p>
        <p className="text-xs text-gray-500">{date}</p>
      </div>
      <span
        className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${styles[priority].badge}`}
      >
        {daysLeft > 0 ? `${daysLeft}d left` : 'Overdue'}
      </span>
    </div>
  );
}
