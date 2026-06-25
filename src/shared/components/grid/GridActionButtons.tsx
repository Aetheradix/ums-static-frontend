import { Button } from '../buttons';
import './GridActionButtons.css';

interface GridActionButtonsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onApprove?: () => void;
  onReject?: () => void;

  viewTooltip?: string;
  editTooltip?: string;
  deleteTooltip?: string;
  approveTooltip?: string;
  rejectTooltip?: string;
}

export default function GridActionButtons({
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  viewTooltip = 'View',
  editTooltip = 'Edit',
  deleteTooltip = 'Delete',
  approveTooltip = 'Approve',
  rejectTooltip = 'Reject',
}: GridActionButtonsProps) {
  return (
    <div className="grid-action-buttons">
      {onView && (
        <Button
          icon="eye"
          variant="outlined"
          size="small"
          className="grid-action-button grid-action-button-view"
          onClick={onView}
          tooltip={viewTooltip}
          ariaLabel={viewTooltip}
        />
      )}

      {onApprove && (
        <Button
          icon="check"
          variant="outlined"
          size="small"
          className="grid-action-button grid-action-button-approve"
          onClick={onApprove}
          tooltip={approveTooltip}
          ariaLabel={approveTooltip}
        />
      )}

      {onReject && (
        <Button
          icon="times"
          variant="outlined"
          size="small"
          className="grid-action-button grid-action-button-reject"
          onClick={onReject}
          tooltip={rejectTooltip}
          ariaLabel={rejectTooltip}
        />
      )}

      {onEdit && (
        <Button
          icon="pencil"
          variant="outlined"
          size="small"
          className="grid-action-button grid-action-button-edit"
          onClick={onEdit}
          tooltip={editTooltip}
          ariaLabel={editTooltip}
        />
      )}

      {onDelete && (
        <Button
          icon="trash"
          variant="outlined"
          size="small"
          className="grid-action-button grid-action-button-delete"
          onClick={onDelete}
          tooltip={deleteTooltip}
          ariaLabel={deleteTooltip}
        />
      )}
    </div>
  );
}
