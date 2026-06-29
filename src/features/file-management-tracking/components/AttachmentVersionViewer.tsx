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
    return <p className="text-sm text-gray-400 italic">No attachments.</p>;
  }

  return (
    <div className="space-y-2">
      {active.map(a => (
        <div
          key={a.id}
          className="flex items-center justify-between p-2 border rounded bg-white"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Icon name="description" className="text-gray-400 text-lg" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {a.fileName}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>v{a.version.toFixed(1)}</span>
                <span>{(a.fileSizeKb / 1024).toFixed(1)} MB</span>
                <span>{a.uploadedByName}</span>
                <span>{a.uploadedAt}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <Button
              icon="visibility"
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
                icon="upload_file"
                variant="text"
                size="small"
                onClick={() => onReplace(a)}
                tooltip="Replace"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
