import { useState } from 'react';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { TextBox, DropDownList } from 'shared/components/forms';
import { useFeeStore, type FeeHead as HeadType } from '../store/useFeeStore';
import { ToastService } from 'services';

const TYPICAL_HEADS = [
  'Tuition Fee',
  'Admission Fee',
  'Examination Fee',
  'Library Fee',
  'Development Fee',
  'Sports Fee',
  'Laboratory Fee',
  'Hostel Fee',
  'Transport Fee',
  'Miscellaneous Fee',
];

export default function FeeHeadMaster() {
  const { feeHeads, addFeeHead, updateFeeHead } = useFeeStore();
  const [popup, setPopup] = useState<{
    mode: 'closed' | 'create' | 'edit';
    data?: HeadType;
  }>({ mode: 'closed' });

  const [name, setName] = useState('Tuition Fee');
  const [customName, setCustomName] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const [category, setCategory] = useState('Academic');
  const [frequency, setFrequency] = useState<
    'Annual' | 'Semester-wise' | 'One-time' | 'Monthly'
  >('Semester-wise');

  const handleCreateOpen = () => {
    setName(TYPICAL_HEADS[0]);
    setCustomName('');
    setIsCustom(false);
    setCategory('Academic');
    setFrequency('Semester-wise');
    setPopup({ mode: 'create' });
  };

  const handleEditOpen = (head: HeadType) => {
    if (TYPICAL_HEADS.includes(head.name)) {
      setName(head.name);
      setIsCustom(false);
    } else {
      setName('Other');
      setCustomName(head.name);
      setIsCustom(true);
    }
    setCategory(head.category);
    setFrequency(head.frequency);
    setPopup({ mode: 'edit', data: head });
  };

  const handleSave = () => {
    const finalName = isCustom ? customName.trim() : name;
    if (!finalName) {
      ToastService.error('Fee Head Name is required');
      return;
    }
    if (!category.trim()) {
      ToastService.error('Category is required');
      return;
    }

    const headData = {
      name: finalName,
      category,
      frequency,
    };

    if (popup.mode === 'create') {
      addFeeHead(headData);
      ToastService.success('Fee Head created successfully.');
    } else if (popup.mode === 'edit' && popup.data) {
      updateFeeHead(popup.data.id, headData);
      ToastService.success('Fee Head updated successfully.');
    }
    setPopup({ mode: 'closed' });
  };

  return (
    <FormPage
      title="Fee Head Master"
      description="Create and configure various types of fee heads, their category, and billing frequency."
    >
      <FormCard>
        <GridPanel
          data={feeHeads}
          onEdit={handleEditOpen}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '50px',
              header: 'S.No',
            },
            { field: 'name', header: 'Fee Head Name' },
            { field: 'category', header: 'Category' },
            { field: 'frequency', header: 'Collection Frequency' },
          ]}
          toolbar={
            <Button
              label="Create Fee Head"
              icon="plus"
              variant="outlined"
              onClick={handleCreateOpen}
            />
          }
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={popup.mode === 'create' ? 'Create Fee Head' : 'Edit Fee Head'}
        subtitle="Define fee category and collection frequency."
      >
        <div className="flex flex-col gap-4 py-2">
          <DropDownList
            label="Fee Head Type"
            data={[
              ...TYPICAL_HEADS.map(h => ({ text: h, value: h })),
              { text: 'Other / Custom Head', value: 'Other' },
            ]}
            textField="text"
            valueField="value"
            value={isCustom ? 'Other' : name}
            onChange={val => {
              const strVal = val as string;
              if (strVal === 'Other') {
                setIsCustom(true);
                setName('Other');
              } else {
                setIsCustom(false);
                setName(strVal);
              }
            }}
            required
          />

          {isCustom && (
            <TextBox
              label="Custom Fee Head Name"
              placeholder="e.g. Sports Kit Fee"
              value={customName}
              onChange={setCustomName}
              required
            />
          )}

          <TextBox
            label="Fee Category"
            placeholder="e.g. Academic, Facility, Hostel, Transport"
            value={category}
            onChange={setCategory}
            required
          />

          <DropDownList
            label="Collection Frequency"
            data={[
              { text: 'Semester-wise', value: 'Semester-wise' },
              { text: 'Annual', value: 'Annual' },
              { text: 'Monthly', value: 'Monthly' },
              { text: 'One-time', value: 'One-time' },
            ]}
            textField="text"
            valueField="value"
            value={frequency}
            onChange={val => setFrequency(val as any)}
            required
          />

          <div className="flex justify-end gap-2 mt-4">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setPopup({ mode: 'closed' })}
            />
            <Button label="Save" variant="primary" onClick={handleSave} />
          </div>
        </div>
      </FormPopup>
    </FormPage>
  );
}
