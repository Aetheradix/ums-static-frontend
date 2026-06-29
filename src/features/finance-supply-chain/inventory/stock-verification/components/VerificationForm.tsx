import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';

interface VerificationFormProps {
  onClose: () => void;
  initialData?: any;
}

const STATUSES = [
  { label: 'Verified', value: 'Verified' },
  { label: 'Missing', value: 'Missing' },
  { label: 'Damaged', value: 'Damaged' },
  { label: 'Pending', value: 'Pending' },
];

export default function VerificationForm({
  onClose,
  initialData,
}: VerificationFormProps) {
  const [status, setStatus] = useState(initialData?.status || 'Pending');
  const [remarks, setRemarks] = useState(initialData?.remarks || '');

  const handleSave = () => {
    // Mock save
    onClose();
  };

  return (
    <div className="flex flex-col h-full bg-white text-gray-800 p-6 rounded-lg">
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Asset ID
          </label>
          <TextBox
            value={initialData?.assetId || ''}
            onChange={() => {}}
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Asset Name
          </label>
          <TextBox
            value={initialData?.assetName || ''}
            onChange={() => {}}
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <TextBox
            value={initialData?.department || ''}
            onChange={() => {}}
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <TextBox
            value={initialData?.location || ''}
            onChange={() => {}}
            disabled
          />
        </div>
      </div>

      <div className="border-t border-dashed border-gray-200 my-4" />

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Verification Status *
          </label>
          <DropDownList
            data={STATUSES}
            textField="label"
            valueField="value"
            value={status}
            onChange={v => setStatus(v as string)}
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Audit Remarks
        </label>
        <TextArea
          value={remarks}
          onChange={v => setRemarks(v)}
          placeholder="Enter any notes from physical audit..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-auto">
        <Button label="Cancel" variant="outlined" onClick={onClose} />
        <Button
          label="Save Verification"
          variant="primary"
          onClick={handleSave}
        />
      </div>
    </div>
  );
}
