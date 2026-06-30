import { Icon } from 'shared/components/Icon/Icon';
import type { DigitalNoting } from '../data';

export default function NotesheetViewer({
  notings,
}: {
  notings: DigitalNoting[];
}) {
  if (notings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300">
        <Icon name="edit_note" className="text-4xl text-gray-300 mb-3" />
        <p className="text-sm font-medium text-gray-500">
          No notes recorded yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {[...notings].reverse().map(n => {
        const initials = n.notedByName
          .split(' ')
          .map(w => w[0])
          .join('')
          .substring(0, 2)
          .toUpperCase();
        return (
          <div key={n.id} className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shrink-0 ring-4 ring-blue-50 mt-1">
              {initials}
            </div>
            <div className="flex-1 bg-white rounded-2xl rounded-tl-none border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow hover:border-blue-200">
              <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-900">
                    {n.notedByName}
                  </span>
                  <span className="text-xs font-medium text-gray-500 bg-white px-2.5 py-0.5 rounded-full border border-gray-200">
                    {n.notedAt}
                  </span>
                </div>
                {n.digitalSignatureData && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                    <Icon name="verified" className="text-[14px]" />
                    Digitally Signed
                  </div>
                )}
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {n.notingContent}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
