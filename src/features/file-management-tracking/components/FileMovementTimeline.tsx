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

export default function FileMovementTimeline({
  movements,
}: {
  movements: FileMovement[];
}) {
  if (movements.length === 0) {
    return <p className="text-sm text-gray-400 italic">No movement history.</p>;
  }

  return (
    <div className="relative">
      {[...movements].reverse().map((m, i) => (
        <div key={m.id} className="flex gap-3 pb-4 relative">
          <div className="flex flex-col items-center">
            <Icon
              name={actionIcons[m.action] || 'circle'}
              className="text-base text-gray-500"
            />
            {i < movements.length - 1 && (
              <div className="w-px flex-1 bg-gray-200 mt-1" />
            )}
          </div>
          <div className="flex-1 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-800">
                {m.action}
              </span>
              <span className="text-xs text-gray-400">{m.actionDate}</span>
            </div>
            <div className="text-xs text-gray-500">
              {m.fromUserName && <span>{m.fromUserName} → </span>}
              {m.toUserName || '—'}
            </div>
            {m.remarks && (
              <p className="text-xs text-gray-600 mt-0.5 italic">
                "{m.remarks}"
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
