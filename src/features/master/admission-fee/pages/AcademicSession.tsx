import { useState } from 'react';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import StatusButton from 'shared/components/buttons/StatusButton';
import { TextBox, DropDownList } from 'shared/components/forms';
import {
  useFeeStore,
  type AcademicSession as SessionType,
} from '../store/useFeeStore';
import { ToastService } from 'services';

export default function AcademicSession() {
  const { sessions, addSession, updateSession } = useFeeStore();
  const [popup, setPopup] = useState<{
    mode: 'closed' | 'create' | 'edit';
    data?: SessionType;
  }>({ mode: 'closed' });
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  const handleCreateOpen = () => {
    setName('');
    setStatus('Active');
    setPopup({ mode: 'create' });
  };

  const handleEditOpen = (session: SessionType) => {
    setName(session.name);
    setStatus(session.status);
    setPopup({ mode: 'edit', data: session });
  };

  const handleToggleStatus = (session: SessionType) => {
    const nextStatus = session.status === 'Active' ? 'Inactive' : 'Active';
    updateSession(session.id, session.name, nextStatus);
    ToastService.success(`Session status updated to ${nextStatus}.`);
  };

  const handleSave = () => {
    if (!name.trim()) {
      ToastService.error('Session Name is required');
      return;
    }
    if (popup.mode === 'create') {
      addSession({ name, status });
      ToastService.success('Academic Session created successfully.');
    } else if (popup.mode === 'edit' && popup.data) {
      updateSession(popup.data.id, name, status);
      ToastService.success('Academic Session updated successfully.');
    }
    setPopup({ mode: 'closed' });
  };

  return (
    <FormPage
      title="Academic Session Master"
      description="Create and manage academic sessions and toggle their active/inactive status."
    >
      <FormCard>
        <GridPanel
          data={sessions}
          onEdit={handleEditOpen}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '50px',
              header: 'S.No',
            },
            { field: 'name', header: 'Academic Session Name' },
            {
              header: 'Status',
              cell: (item: SessionType) => (
                <StatusButton
                  value={item.status === 'Active'}
                  onClick={() => handleToggleStatus(item)}
                />
              ),
            },
          ]}
          toolbar={
            <Button
              label="Create Session"
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
        title={
          popup.mode === 'create'
            ? 'Create Academic Session'
            : 'Edit Academic Session'
        }
        subtitle="Specify academic session configuration."
      >
        <div className="flex flex-col gap-4 py-2">
          <TextBox
            label="Academic Session Name"
            placeholder="e.g. 2025-26"
            value={name}
            onChange={setName}
            required
          />
          <DropDownList
            label="Status"
            data={[
              { text: 'Active', value: 'Active' },
              { text: 'Inactive', value: 'Inactive' },
            ]}
            textField="text"
            valueField="value"
            value={status}
            onChange={val => setStatus(val as 'Active' | 'Inactive')}
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
