import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import {
  DropDownList,
  NumberBox,
  TextArea,
  TextBox,
} from 'shared/components/forms';

interface TransferRequestFormProps {
  onClose: () => void;
  initialData?: any;
}

const DEPARTMENTS = [
  { label: 'Computer Science', value: 'Computer Science' },
  { label: 'Information Technology', value: 'Information Technology' },
  { label: 'Administration', value: 'Administration' },
  { label: 'Library', value: 'Library' },
  { label: 'Electronics', value: 'Electronics' },
];

export default function TransferRequestForm({
  onClose,
  initialData,
}: TransferRequestFormProps) {
  const [assetName, setAssetName] = useState(initialData?.assetName || '');
  const [fromDept, setFromDept] = useState(
    initialData?.fromDepartment || 'Computer Science'
  );
  const [toDept, setToDept] = useState(initialData?.toDepartment || '');
  const [quantity, setQuantity] = useState(initialData?.quantity || 1);
  const [reason, setReason] = useState(initialData?.reason || '');

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
            placeholder="e.g. Dell Optiplex 7090"
            disabled={isView}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <div className="h-[38px] flex items-center px-3 border border-gray-300 rounded bg-gray-50 text-gray-600 cursor-not-allowed">
            {initialData?.date
              ? new Date(initialData.date).toLocaleDateString()
              : new Date().toLocaleDateString()}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Department *
          </label>
          <DropDownList
            data={DEPARTMENTS}
            textField="label"
            valueField="value"
            value={fromDept}
            onChange={v => setFromDept(v as string)}
            disabled={isView}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To Department *
          </label>
          <DropDownList
            data={DEPARTMENTS}
            textField="label"
            valueField="value"
            value={toDept}
            onChange={v => setToDept(v as string)}
            disabled={isView}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity *
          </label>
          <NumberBox
            value={quantity}
            onChange={v => setQuantity(v || 1)}
            disabled={isView}
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Reason for Transfer *
        </label>
        <TextArea
          value={reason}
          onChange={v => setReason(v)}
          placeholder="Why is this asset being transferred?"
          rows={3}
          disabled={isView}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
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
