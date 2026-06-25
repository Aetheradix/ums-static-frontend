import { Button } from 'shared/components/buttons';
import './FormActions.css';

interface FormActionsProps {
  isEditMode?: boolean;
  isLoading?: boolean;
  onSave?: () => void;
  onReset?: () => void;
  saveLabel?: string;
  align?: 'left' | 'right' | 'center';
}

const ALIGN_CLASSES: Record<string, string> = {
  left: 'form-actions-left',
  right: 'form-actions-right',
  center: 'form-actions-center',
};

export default function FormActions({
  isEditMode = false,
  isLoading = false,
  onSave,
  onReset,
  saveLabel,
  align = 'right',
}: FormActionsProps) {
  return (
    <div className={`form-actions-container ${ALIGN_CLASSES[align]}`}>
      <Button
        label="Reset"
        type="reset"
        onClick={() => onReset?.()}
        icon="times"
        variant="outlined"
      />
      <Button
        label={saveLabel || (isEditMode ? 'Update' : 'Save')}
        type="submit"
        onClick={onSave}
        icon={isEditMode ? 'pencil' : 'save'}
        isLoading={isLoading}
      />
    </div>
  );
}
