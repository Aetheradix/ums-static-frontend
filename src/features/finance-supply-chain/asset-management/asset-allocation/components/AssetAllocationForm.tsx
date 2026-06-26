import type { ASSET_ALLOCATIONS } from 'features/finance-supply-chain/mock-data';
import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { TextBox, DatePicker, DropDownList } from 'shared/components/forms';
import { FormGrid } from 'shared/new-components';

type AssetAllocationItem = (typeof ASSET_ALLOCATIONS)[0];

interface AssetAllocationFormProps {
  onClose: () => void;
  initialData?: AssetAllocationItem;
  mode?: 'create' | 'edit' | 'view';
}

const DEPARTMENTS = [
  'Engineering',
  'Administration',
  'Computer Science',
  'IT Cell',
  'Library',
  'Electronics',
].map(d => ({ text: d, value: d }));

const STATUSES = ['Allocated', 'Returned'].map(s => ({ text: s, value: s }));

export default function AssetAllocationForm({
  onClose,
  initialData,
  mode = 'create',
}: AssetAllocationFormProps) {
  const isView = mode === 'view';

  const [formData, setFormData] = useState<Partial<AssetAllocationItem>>(
    initialData || {
      allocationNo: `AL-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
      status: 'Allocated',
    }
  );

  const handleSubmit = () => {
    // In a real app, this would call an API
    console.log('Submitted', formData);
    onClose();
  };

  return (
    <div className="flex flex-col gap-6">
      <FormGrid>
        <TextBox
          label="Allocation No"
          value={formData.allocationNo || ''}
          onChange={val => setFormData({ ...formData, allocationNo: val })}
          disabled
        />
        <DropDownList
          label="Status"
          value={formData.status || ''}
          data={STATUSES}
          onChange={val => setFormData({ ...formData, status: val as string })}
          disabled={isView}
        />

        <TextBox
          label="Asset Code"
          value={formData.assetCode || ''}
          onChange={val => setFormData({ ...formData, assetCode: val })}
          disabled={isView}
        />
        <TextBox
          label="Asset Name"
          value={formData.assetName || ''}
          onChange={val => setFormData({ ...formData, assetName: val })}
          disabled={isView}
        />

        <TextBox
          label="Allocated To"
          value={formData.allocatedTo || ''}
          onChange={val => setFormData({ ...formData, allocatedTo: val })}
          disabled={isView}
        />
        <DropDownList
          label="Department"
          value={formData.department || ''}
          data={DEPARTMENTS}
          onChange={val =>
            setFormData({ ...formData, department: val as string })
          }
          disabled={isView}
        />

        <DatePicker
          label="Allocation Date"
          value={
            formData.allocationDate
              ? new Date(formData.allocationDate)
              : undefined
          }
          onChange={val =>
            setFormData({
              ...formData,
              allocationDate: val ? val.toISOString().split('T')[0] : '',
            })
          }
          disabled={isView}
        />
        <DatePicker
          label="Return Date"
          value={
            formData.returnDate ? new Date(formData.returnDate) : undefined
          }
          onChange={val =>
            setFormData({
              ...formData,
              returnDate: val ? val.toISOString().split('T')[0] : '',
            })
          }
          disabled={isView}
        />
      </FormGrid>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button
          label={isView ? 'Close' : 'Cancel'}
          variant="outlined"
          onClick={onClose}
        />
        {!isView && (
          <Button
            label={mode === 'create' ? 'Allocate Asset' : 'Save Changes'}
            variant="primary"
            onClick={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
