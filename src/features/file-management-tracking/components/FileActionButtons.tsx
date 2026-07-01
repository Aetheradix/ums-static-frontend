import { Button } from 'shared/components/buttons';
import type { File } from '../data';

interface Props {
  file: File;
  onLock?: () => void;
  onUnlock?: () => void;
  onRevoke?: () => void;
  onPartFile?: () => void;
  onMerge?: () => void;
  onAbeyance?: () => void;
  onRemoveAbeyance?: () => void;
}

export default function FileActionButtons({
  file,
  onLock,
  onUnlock,
  onRevoke,
  onPartFile,
  onMerge,
  onAbeyance,
  onRemoveAbeyance,
}: Props) {
  const canLock =
    (file.currentStatus === 'Under Review' ||
      file.currentStatus === 'Forwarded') &&
    !file.isLocked;
  const canUnlock = file.isLocked;
  const canRevoke =
    file.currentStatus === 'Submitted' || file.currentStatus === 'Forwarded';
  const canPartFile =
    !file.parentFileId &&
    file.currentStatus !== 'Closed' &&
    file.currentStatus !== 'Archived';
  const canMerge =
    file.currentStatus !== 'Closed' &&
    file.currentStatus !== 'Archived' &&
    !file.mergedIntoFileId;
  const canAbeyance =
    !file.isAbeyance &&
    file.currentStatus !== 'Closed' &&
    file.currentStatus !== 'Archived';
  const canRemoveAbeyance = file.isAbeyance;

  return (
    <div className="flex flex-wrap gap-1">
      {canLock && (
        <Button
          icon="lock"
          variant="text"
          size="small"
          onClick={onLock}
          tooltip="Lock File"
        />
      )}
      {canUnlock && (
        <Button
          icon="lock_open"
          variant="text"
          size="small"
          onClick={onUnlock}
          tooltip="Unlock File"
        />
      )}
      {canRevoke && (
        <Button
          icon="undo"
          variant="text"
          size="small"
          onClick={onRevoke}
          tooltip="Revoke File"
        />
      )}
      {canPartFile && (
        <Button
          icon="call_split"
          variant="text"
          size="small"
          onClick={onPartFile}
          tooltip="Create Part File"
        />
      )}
      {canMerge && (
        <Button
          icon="merge"
          variant="text"
          size="small"
          onClick={onMerge}
          tooltip="Merge File"
        />
      )}
      {canAbeyance && (
        <Button
          icon="pause_circle"
          variant="text"
          size="small"
          onClick={onAbeyance}
          tooltip="Keep in Abeyance"
        />
      )}
      {canRemoveAbeyance && (
        <Button
          icon="play_circle"
          variant="text"
          size="small"
          onClick={onRemoveAbeyance}
          tooltip="Remove Abeyance"
        />
      )}
    </div>
  );
}
