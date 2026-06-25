import { useState } from 'react';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { useFeeStore, type Program as ProgramType } from '../store/useFeeStore';
import { ToastService } from 'services';

export default function ProgramMaster() {
  const { programs, addProgram, updateProgram } = useFeeStore();
  const [popup, setPopup] = useState<{
    mode: 'closed' | 'create' | 'edit';
    data?: ProgramType;
  }>({ mode: 'closed' });
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const handleCreateOpen = () => {
    setName('');
    setCode('');
    setPopup({ mode: 'create' });
  };

  const handleEditOpen = (program: ProgramType) => {
    setName(program.name);
    setCode(program.code);
    setPopup({ mode: 'edit', data: program });
  };

  const handleSave = () => {
    if (!name.trim() || !code.trim()) {
      ToastService.error('Program Name and Code are required');
      return;
    }
    if (popup.mode === 'create') {
      addProgram({ name, code });
      ToastService.success('Program created successfully.');
    } else if (popup.mode === 'edit' && popup.data) {
      updateProgram(popup.data.id, name, code);
      ToastService.success('Program updated successfully.');
    }
    setPopup({ mode: 'closed' });
  };

  return (
    <FormPage
      title="Program Master"
      description="Define new academic programs (e.g. Undergraduate, Postgraduate)."
    >
      <FormCard>
        <GridPanel
          data={programs}
          onEdit={handleEditOpen}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '50px',
              header: 'S.No',
            },
            { field: 'code', header: 'Program Code' },
            { field: 'name', header: 'Program Name' },
          ]}
          toolbar={
            <Button
              label="Create Program"
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
        title={popup.mode === 'create' ? 'Create Program' : 'Edit Program'}
        subtitle="Specify program details."
      >
        <div className="flex flex-col gap-4 py-2">
          <TextBox
            label="Program Code"
            placeholder="e.g. UG"
            value={code}
            onChange={val => setCode(val.toUpperCase())}
            required
          />
          <TextBox
            label="Program Name"
            placeholder="e.g. Undergraduate Program"
            value={name}
            onChange={setName}
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
