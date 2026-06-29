import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import {
  DropDownList,
  NumberBox,
  TextArea,
  TextBox,
} from 'shared/components/forms';

interface DisposalFormProps {
  onClose: () => void;
  initialData?: any;
}

const DISPOSAL_METHODS = [
  { label: 'E-Waste Scrap', value: 'E-Waste Scrap' },
  { label: 'Auction', value: 'Auction' },
  { label: 'Donation', value: 'Donation' },
  { label: 'Destroyed', value: 'Destroyed' },
];

export default function DisposalForm({
  onClose,
  initialData,
}: DisposalFormProps) {
  const [assetName, setAssetName] = useState(initialData?.assetName || '');
  const [department, setDepartment] = useState(initialData?.department || '');
  const [reason, setReason] = useState(initialData?.reason || '');
  const [method, setMethod] = useState(initialData?.method || 'E-Waste Scrap');
  const [writeOffValue, setWriteOffValue] = useState(
    initialData?.writeOffValue || 0
  );

  const isView = !!initialData;

  const handleSave = () => {
    // Mock save
    onClose();
  };

  return (
    <div className="flex flex-col h-full bg-white text-gray-800 p-6 rounded-lg">
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Asset Name / ID *
          </label>
          <TextBox
            value={assetName}
            onChange={v => setAssetName(v)}
            disabled={isView}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department *
          </label>
          <TextBox
            value={department}
            onChange={v => setDepartment(v)}
            disabled={isView}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Disposal Method *
          </label>
          <DropDownList
            data={DISPOSAL_METHODS}
            textField="label"
            valueField="value"
            value={method}
            onChange={v => setMethod(v as string)}
            disabled={isView}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Write-off Value (₹) *
          </label>
          <NumberBox
            value={writeOffValue}
            onChange={v => setWriteOffValue(v || 0)}
            disabled={isView}
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Reason for Disposal *
        </label>
        <TextArea
          value={reason}
          onChange={v => setReason(v)}
          rows={3}
          disabled={isView}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-auto">
        <Button
          label={isView ? 'Close' : 'Cancel'}
          variant="outlined"
          onClick={onClose}
        />
        {!isView && (
          <Button
            label="Submit Request"
            variant="primary"
            onClick={handleSave}
          />
        )}
      </div>
    </div>
  );
}
