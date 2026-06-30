import { Icon } from 'shared/components/Icon/Icon';
import type { FileMovement } from '../data';

const actionIcons: Record<string, string> = {
  Created: 'add_circle',
  Forwarded: 'arrow_forward',
  Approved: 'check_circle',
  Rejected: 'cancel',
  'Sent Back': 'reply',
  Escalated: 'priority_high',
  'Put On Hold': 'pause_circle',
  Reassigned: 'swap_horiz',
  Closed: 'lock',
  Archived: 'archive',
  'Accepted Hard Copy': 'inventory',
  Revoked: 'undo',
};

const actionColors: Record<string, string> = {
  Created: 'bg-emerald-100 text-emerald-600',
  Forwarded: 'bg-blue-100 text-blue-600',
  Approved: 'bg-green-100 text-green-600',
  Rejected: 'bg-red-100 text-red-600',
  'Sent Back': 'bg-orange-100 text-orange-600',
  Closed: 'bg-gray-100 text-gray-600',
};

export default function FileMovementTimeline({
  movements,
}: {
  movements: FileMovement[];
}) {
  if (movements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300">
        <Icon name="history" className="text-4xl text-gray-300 mb-3" />
        <p className="text-sm font-medium text-gray-500">
          No movement history yet.
        </p>
      </div>
    );
  }

  return (
    <div className="relative pl-6 sm:pl-8 py-4">
      <div className="absolute left-[19px] sm:left-[27px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-100 via-blue-200 to-transparent" />
      <div className="space-y-8">
        {[...movements].reverse().map(m => {
          const colorClass =
            actionColors[m.action] || 'bg-blue-100 text-blue-600';
          const iconName = actionIcons[m.action] || 'circle';

          return (
            <div key={m.id} className="relative group">
              {/* Timeline dot */}
              <div
                className={`absolute -left-[30px] sm:-left-[38px] top-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white flex items-center justify-center shadow-sm z-10 transition-transform group-hover:scale-110 ${colorClass}`}
              >
                <Icon name={iconName} className="text-[14px] sm:text-[16px]" />
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow hover:border-blue-200">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-sm font-bold text-gray-900 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200">
                    {m.action}
                  </span>
                  <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                    <Icon name="schedule" className="text-[14px]" />
                    {m.actionDate}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-3 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100/50">
                  {m.fromUserName ? (
                    <>
                      <span className="font-semibold text-gray-800">
                        {m.fromUserName}
                      </span>
                      <Icon name="arrow_right_alt" className="text-blue-500" />
                      <span className="font-semibold text-gray-800">
                        {m.toUserName || 'System'}
                      </span>
                    </>
                  ) : (
                    <span className="font-semibold text-gray-800">
                      {m.toUserName || 'System'}
                    </span>
                  )}
                </div>

                {m.remarks && (
                  <div className="text-sm text-gray-600 bg-gray-50/80 p-3 rounded-lg border-l-2 border-blue-400 italic">
                    "{m.remarks}"
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
