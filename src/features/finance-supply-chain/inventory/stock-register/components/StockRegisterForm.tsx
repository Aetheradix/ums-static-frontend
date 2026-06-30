import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList, NumberBox, TextBox } from 'shared/components/forms';

interface StockRegisterFormProps {
  onClose: () => void;
  initialData?: any;
}

const CATEGORIES = [
  { label: 'Furniture', value: 'Furniture' },
  { label: 'IT Equipment', value: 'IT Equipment' },
  { label: 'Lab Equipment', value: 'Lab Equipment' },
  { label: 'Office Supplies', value: 'Office Supplies' },
];

const CONDITIONS = [
  { label: 'Good', value: 'Good' },
  { label: 'Fair', value: 'Fair' },
  { label: 'Damaged', value: 'Damaged' },
  { label: 'Condemned', value: 'Condemned' },
];

const STATUSES = [
  { label: 'Active', value: 'Active' },
  { label: 'In Repair', value: 'In Repair' },
  { label: 'Disposed', value: 'Disposed' },
];

export default function StockRegisterForm({
  onClose,
  initialData,
}: StockRegisterFormProps) {
  const [assetName, setAssetName] = useState(initialData?.name || '');
  const [category, setCategory] = useState(
    initialData?.category || 'Furniture'
  );
  const [department, setDepartment] = useState(initialData?.department || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [poReference, setPoReference] = useState(
    initialData?.poReference || ''
  );
  const [unitValue, setUnitValue] = useState(initialData?.unitValue || 0);
  const [condition, setCondition] = useState(initialData?.condition || 'Good');
  const [custodian, setCustodian] = useState(initialData?.custodian || '');
  const [status, setStatus] = useState(initialData?.status || 'Active');

  const handleSave = () => {
    // Mock save
    onClose();
  };

  return (
    <div className="flex flex-col h-full bg-white text-gray-800 p-6 rounded-lg">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Asset Name *
          </label>
          <TextBox
            value={assetName}
            onChange={v => setAssetName(v)}
            placeholder="e.g. Executive Chair"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <DropDownList
            data={CATEGORIES}
            textField="label"
            valueField="value"
            value={category}
            onChange={v => setCategory(v as string)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department *
          </label>
          <TextBox
            value={department}
            onChange={v => setDepartment(v)}
            placeholder="e.g. Administration"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location / Room
          </label>
          <TextBox
            value={location}
            onChange={v => setLocation(v)}
            placeholder="e.g. Rm 101"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PO Reference
          </label>
          <TextBox
            value={poReference}
            onChange={v => setPoReference(v)}
            placeholder="e.g. PO-2024-012"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unit Value (₹) *
          </label>
          <NumberBox value={unitValue} onChange={v => setUnitValue(v || 0)} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Condition
          </label>
          <DropDownList
            data={CONDITIONS}
            textField="label"
            valueField="value"
            value={condition}
            onChange={v => setCondition(v as string)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Custodian Name
          </label>
          <TextBox
            value={custodian}
            onChange={v => setCustodian(v)}
            placeholder="e.g. Mr. A. Kumar"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
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

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-auto">
        <Button label="Cancel" variant="outlined" onClick={onClose} />
        <Button
          label={initialData ? 'Save Changes' : 'Register Asset'}
          variant="primary"
          onClick={handleSave}
        />
      </div>
    </div>
  );
}
