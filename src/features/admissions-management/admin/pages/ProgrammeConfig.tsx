import { useState, useEffect } from 'react';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { DropDownList, TextBox } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { Modal, ConfirmDialog } from 'shared/components/popups';
import { ToastService } from 'services';
import {
  ProgrammeConfigSeedService,
  type SeedProgrammeConfig,
} from '../../seed';
import { admissionsUrls } from '../../urls';

const CRITERIA_OPTIONS = [
  { label: 'Entrance', value: 'Entrance' },
  { label: 'Merit', value: 'Merit' },
  { label: 'Both', value: 'Both' },
];

export default function ProgrammeConfig() {
  const [programmes, setProgrammes] = useState<SeedProgrammeConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // Add state
  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newProgrammeName, setNewProgrammeName] = useState('');
  const [newCriteria, setNewCriteria] = useState<'Entrance' | 'Merit' | 'Both'>(
    'Merit'
  );

  // Delete state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await ProgrammeConfigSeedService.getAll();
    setProgrammes(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (p: SeedProgrammeConfig) => {
    setEditId(p.id);
    setEditValue(p.admissionCriteria);
  };

  const handleSave = async (id: string) => {
    await ProgrammeConfigSeedService.update(id, {
      admissionCriteria: editValue as SeedProgrammeConfig['admissionCriteria'],
    });
    ToastService.success('Admission criteria updated');
    setEditId(null);
    load();
  };

  const handleAdd = async () => {
    if (!newProgrammeName.trim()) {
      ToastService.error('Programme name is required');
      return;
    }
    setAdding(true);
    try {
      await ProgrammeConfigSeedService.add({
        programmeName: newProgrammeName,
        admissionCriteria: newCriteria,
      });
      ToastService.success('Programme added successfully');
      setShowAdd(false);
      setNewProgrammeName('');
      setNewCriteria('Merit');
      load();
    } catch (error) {
      ToastService.error('Failed to add programme');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await ProgrammeConfigSeedService.delete(deleteConfirmId);
      ToastService.success('Programme deleted successfully');
      setDeleteConfirmId(null);
      load();
    } catch (error) {
      ToastService.error('Failed to delete programme');
    }
  };

  return (
    <FormPage
      title="Programme Configuration"
      description="Configure admission criteria (Entrance / Merit / Both) for each programme."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Admissions Management', to: admissionsUrls.root },
        { label: 'Admin Portal', to: admissionsUrls.admin.root },
        { label: 'Programme Config' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={programmes}
          loading={loading}
          searchBox
          toolbar={
            <Button
              label="Add Programme"
              icon="pi pi-plus"
              variant="primary"
              onClick={() => setShowAdd(true)}
            />
          }
          pagination={true}
          columns={[
            {
              cell: (_, opt) => <span>{opt.rowIndex + 1}</span>,
              width: '50px',
              header: 'S.No',
            },
            { header: 'Programme', field: 'programmeName', sortable: true },
            {
              header: 'Admission Criteria',
              cell: (item: SeedProgrammeConfig) =>
                editId === item.id ? (
                  <DropDownList
                    value={editValue}
                    onChange={(v: any) => setEditValue(v)}
                    data={CRITERIA_OPTIONS}
                    textField="label"
                    valueField="value"
                  />
                ) : (
                  <span className="font-medium">{item.admissionCriteria}</span>
                ),
            },
            {
              header: 'Actions',
              cell: (item: SeedProgrammeConfig) =>
                editId === item.id ? (
                  <div className="flex gap-2">
                    <Button
                      label="Save"
                      variant="primary"
                      onClick={() => handleSave(item.id)}
                    />
                    <Button
                      label="Cancel"
                      variant="outlined"
                      onClick={() => setEditId(null)}
                    />
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      icon="pi pi-pencil"
                      variant="text"
                      className="text-blue-600"
                      onClick={() => startEdit(item)}
                    />
                    <Button
                      icon="pi pi-trash"
                      variant="text"
                      className="text-red-600"
                      onClick={() => setDeleteConfirmId(item.id)}
                    />
                  </div>
                ),
            },
          ]}
        />
      </FormCard>

      {/* Add Modal */}
      {showAdd && (
        <Modal
          header="Add New Programme"
          visible={showAdd}
          onHide={() => setShowAdd(false)}
        >
          <div className="p-4 flex flex-col gap-4">
            <TextBox
              label="Programme Name *"
              value={newProgrammeName}
              onChange={v => setNewProgrammeName(v as string)}
              placeholder="e.g. B.Tech Computer Science"
            />
            <DropDownList
              label="Admission Criteria *"
              value={newCriteria}
              onChange={(v: any) => setNewCriteria(v)}
              data={CRITERIA_OPTIONS}
              textField="label"
              valueField="value"
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setShowAdd(false)}
              />
              <Button
                label={adding ? 'Adding...' : 'Add Programme'}
                variant="primary"
                icon="pi pi-plus"
                isLoading={adding}
                onClick={handleAdd}
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <ConfirmDialog
          title="Delete Programme"
          visible={!!deleteConfirmId}
          onHide={() => setDeleteConfirmId(null)}
          onConfirm={handleDelete}
          message="Are you sure you want to delete this programme? This action cannot be undone."
        />
      )}
    </FormPage>
  );
}
