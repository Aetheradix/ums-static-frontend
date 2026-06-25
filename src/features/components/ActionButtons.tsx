import { Button, ButtonPanel } from 'shared/components/buttons';

interface ActionButtonsProps {
  update?: boolean;
  isLoading?: boolean;
  onSave?: () => void;
  onReset?: () => void;
  saveLabel?: string;
}

function ActionButtons({
  update,
  isLoading,
  onSave,
  onReset,
  saveLabel,
}: ActionButtonsProps) {
  return (
    <ButtonPanel>
      {update ? (
        <>
          <Button
            label="Update"
            type="submit"
            onClick={onSave}
            icon="pencil"
            isLoading={isLoading}
          />

          <Button
            label="Reset"
            type="reset"
            onClick={() => onReset?.()}
            icon="times"
          />
        </>
      ) : (
        <>
          <Button
            label={saveLabel || 'Save'}
            type="submit"
            onClick={onSave}
            icon="save"
            isLoading={isLoading}
          />

          <Button
            label="Clear"
            type="reset"
            onClick={() => onReset?.()}
            icon="times"
          />
        </>
      )}
    </ButtonPanel>
  );
}

export default ActionButtons;
