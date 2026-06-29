import { Icon } from 'shared/components/Icon/Icon';
import type { DigitalNoting } from '../data';

export default function NotesheetViewer({
  notings,
}: {
  notings: DigitalNoting[];
}) {
  if (notings.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic">No notes recorded yet.</p>
    );
  }

  return (
    <div className="space-y-3">
      {[...notings].reverse().map(n => (
        <div
          key={n.id}
          className="border-l-4 border-blue-400 pl-3 py-2 bg-gray-50 rounded-r"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-800">
              {n.notedByName}
            </span>
            <span className="text-xs text-gray-400">{n.notedAt}</span>
          </div>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">
            {n.notingContent}
          </p>
          {n.digitalSignatureData && (
            <div className="mt-1 flex items-center gap-1 text-xs text-green-600">
              <Icon name="verified" className="text-sm" />
              Digitally Signed
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
