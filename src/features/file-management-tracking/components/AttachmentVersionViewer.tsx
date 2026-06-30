import { Button } from 'shared/components/buttons';
import { Icon } from 'shared/components/Icon/Icon';
import type { FileAttachment } from '../data';

interface Props {
  attachments: FileAttachment[];
  onDownload?: (a: FileAttachment) => void;
  onReplace?: (a: FileAttachment) => void;
}

export default function AttachmentVersionViewer({
  attachments,
  onDownload,
  onReplace,
}: Props) {
  const active = attachments.filter(a => a.isActive);

  if (active.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300">
        <Icon name="attachment" className="text-4xl text-gray-300 mb-3" />
        <p className="text-sm font-medium text-gray-500">
          No attachments found.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {active.map(a => (
        <div
          key={a.id}
          className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group flex flex-col justify-between"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Icon name="picture_as_pdf" className="text-xl" />
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="text-sm font-bold text-gray-900 truncate"
                title={a.fileName}
              >
                {a.fileName}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <span className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                  <Icon name="history" className="text-[12px]" /> v
                  {a.version.toFixed(1)}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="data_usage" className="text-[12px]" />{' '}
                  {(a.fileSizeKb / 1024).toFixed(1)} MB
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">
                Uploaded By
              </span>
              <span className="text-xs font-semibold text-gray-800 mt-0.5">
                {a.uploadedByName}
              </span>
              <span className="text-[10px] text-gray-500">{a.uploadedAt}</span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                icon="eye"
                variant="text"
                size="small"
                tooltip="Preview"
              />
              {onDownload && (
                <Button
                  icon="download"
                  variant="text"
                  size="small"
                  onClick={() => onDownload(a)}
                  tooltip="Download"
                />
              )}
              {onReplace && (
                <Button
                  icon="upload"
                  variant="text"
                  size="small"
                  onClick={() => onReplace(a)}
                  tooltip="Replace"
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
