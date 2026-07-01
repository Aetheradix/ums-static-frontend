import { useState, useEffect } from 'react';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { Modal, ConfirmDialog } from 'shared/components/popups';
import { ToastService } from 'services';
import { FeeConfigSeedService, type SeedFeeConfig } from '../../seed';
import { admissionsUrls } from '../../urls';

const CATEGORY_OPTIONS = [
  { label: 'General', value: 'General' },
  { label: 'OBC', value: 'OBC' },
  { label: 'SC/ST', value: 'SC/ST' },
  { label: 'International', value: 'International' },
];

export default function FeeConfig() {
  const [fees, setFees] = useState<SeedFeeConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editRegistration, setEditRegistration] = useState<number>(0);
  const [editRecurring, setEditRecurring] = useState<number>(0);

  // Add state
  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newProgrammeName, setNewProgrammeName] = useState('');
  const [newCategory, setNewCategory] =
    useState<SeedFeeConfig['category']>('General');
  const [newRegistration, setNewRegistration] = useState<number>(0);
  const [newRecurring, setNewRecurring] = useState<number>(0);

  // Delete state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await FeeConfigSeedService.getAll();
    setFees(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (f: SeedFeeConfig) => {
    setEditId(f.id);
    setEditRegistration(f.registrationFee);
    setEditRecurring(f.recurringFee);
  };

  const handleSave = async (id: string) => {
    await FeeConfigSeedService.update(id, {
      registrationFee: editRegistration,
      recurringFee: editRecurring,
    });
    ToastService.success('Fee configuration saved');
    setEditId(null);
    load();
  };

  const handleAdd = async () => {
    if (!newProgrammeName.trim() || !newCategory) {
      ToastService.error('Programme name and category are required');
      return;
    }
    setAdding(true);
    try {
      await FeeConfigSeedService.add({
        programmeName: newProgrammeName,
        category: newCategory,
        registrationFee: newRegistration,
        recurringFee: newRecurring,
      });
      ToastService.success('Fee configuration added successfully');
      setShowAdd(false);
      setNewProgrammeName('');
      setNewCategory('General');
      setNewRegistration(0);
      setNewRecurring(0);
      load();
    } catch (error) {
      ToastService.error('Failed to add fee configuration');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await FeeConfigSeedService.delete(deleteConfirmId);
      ToastService.success('Fee configuration deleted successfully');
      setDeleteConfirmId(null);
      load();
    } catch (error) {
      ToastService.error('Failed to delete fee configuration');
    }
  };

  return (
    <FormPage
      title="Fee Configuration"
      description="Set registration fee and recurring fee per programme and applicant category."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Admissions Management', to: admissionsUrls.root },
        { label: 'Admin Portal', to: admissionsUrls.admin.root },
        { label: 'Fee Config' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={fees}
          loading={loading}
          searchBox
          toolbar={
            <Button
              label="Add Fee Config"
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
            { header: 'Category', field: 'category', sortable: true },
            {
              header: 'Registration Fee (₹)',
              cell: (item: SeedFeeConfig) =>
                editId === item.id ? (
                  <TextBox
                    value={String(editRegistration)}
                    onChange={v => setEditRegistration(Number(v))}
                    type="number"
                  />
                ) : (
                  <span>₹{item.registrationFee.toLocaleString()}</span>
                ),
            },
            {
              header: 'Recurring Fee (₹)',
              cell: (item: SeedFeeConfig) =>
                editId === item.id ? (
                  <TextBox
                    value={String(editRecurring)}
                    onChange={v => setEditRecurring(Number(v))}
                    type="number"
                  />
                ) : (
                  <span>₹{item.recurringFee.toLocaleString()}</span>
                ),
            },
            {
              header: 'Actions',
              cell: (item: SeedFeeConfig) =>
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
          header="Add New Fee Configuration"
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
              label="Category *"
              value={newCategory}
              onChange={(v: any) => setNewCategory(v)}
              data={CATEGORY_OPTIONS}
              textField="label"
              valueField="value"
            />
            <TextBox
              label="Registration Fee (₹) *"
              value={String(newRegistration)}
              onChange={v => setNewRegistration(Number(v))}
              type="number"
            />
            <TextBox
              label="Recurring Fee (₹) *"
              value={String(newRecurring)}
              onChange={v => setNewRecurring(Number(v))}
              type="number"
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setShowAdd(false)}
              />
              <Button
                label={adding ? 'Adding...' : 'Add Fee Config'}
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
          title="Delete Fee Configuration"
          visible={!!deleteConfirmId}
          onHide={() => setDeleteConfirmId(null)}
          onConfirm={handleDelete}
          message="Are you sure you want to delete this fee configuration? This action cannot be undone."
        />
      )}
    </FormPage>
  );
}
