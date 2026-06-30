import type { TicketTimelineEvent } from '../data';

interface Props {
  events: TicketTimelineEvent[];
}

const iconMap: Record<string, string> = {
  created: 'add_circle',
  assigned: 'assignment_ind',
  accepted: 'check_circle',
  'status-change': 'sync_alt',
  comment: 'chat',
  note: 'lock',
  email: 'mail',
  escalated: 'warning',
  resolved: 'verified',
  closed: 'cancel',
  reopened: 'refresh',
  attachment: 'attach_file',
};

const colorMap: Record<string, string> = {
  created: 'text-green-600 bg-green-50 border-green-200',
  assigned: 'text-blue-600 bg-blue-50 border-blue-200',
  accepted: 'text-indigo-600 bg-indigo-50 border-indigo-200',
  'status-change': 'text-amber-600 bg-amber-50 border-amber-200',
  comment: 'text-gray-600 bg-gray-50 border-gray-200',
  note: 'text-purple-600 bg-purple-50 border-purple-200',
  email: 'text-teal-600 bg-teal-50 border-teal-200',
  escalated: 'text-red-600 bg-red-50 border-red-200',
  resolved: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  closed: 'text-gray-600 bg-gray-100 border-gray-300',
  reopened: 'text-orange-600 bg-orange-50 border-orange-200',
  attachment: 'text-sky-600 bg-sky-50 border-sky-200',
};

function formatTime(timestamp: string): string {
  if (timestamp.includes(', ')) {
    const parts = timestamp.split(', ');
    return parts[parts.length - 1];
  }
  return timestamp;
}

export default function Timeline({ events }: Props) {
  return (
    <div className="relative">
      {events.map((event, i) => (
        <div key={event.id} className="flex gap-3 pb-4 relative">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border ${colorMap[event.type] ?? 'text-gray-500 bg-gray-50 border-gray-200'}`}
            >
              <span className="material-symbols-outlined text-sm">
                {iconMap[event.type] ?? 'circle'}
              </span>
            </div>
            {i < events.length - 1 && (
              <div className="w-px flex-1 bg-gray-200 mt-1" />
            )}
          </div>
          <div className="flex-1 pb-2">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-gray-900">
                {event.description}
              </p>
              <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                {formatTime(event.timestamp)}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">by {event.actor}</p>
            {event.oldStatus && event.newStatus && (
              <p className="text-xs text-gray-400 mt-0.5">
                {event.oldStatus} → {event.newStatus}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
