import { useState } from 'react';
import { useGrievance } from '../context';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  FormPopup,
} from 'shared/new-components';
import { DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { USERS_LIST } from '../data';

const STATUS_OPTIONS = [
  { id: 'Active', text: 'Active' },
  { id: 'Inactive', text: 'Inactive' },
];

export default function GrievanceCategoryUserMapping() {
  const {
    categoryMappings,
    addCategoryMapping,
    setCategoryMappings,
    categories,
    activeRole,
    triggerNotification,
  } = useGrievance();

  const [form, setForm] = useState({
    category: '',
    userId: '',
    status: 'Active' as const,
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMapping, setViewMapping] = useState<any>(null);

  const isAdmin =
    activeRole === 'grievance_admin_staff' ||
    activeRole === 'grievance_admin_student';

  const categoryDropdown = categories.map(c => ({
    id: c.name,
    text: `${c.name} (${c.type})`,
  }));
  // Filter simulated users representing 'grievance_category_user'
  const mappableUsers = USERS_LIST.filter(
    u =>
      u.id.includes('category') ||
      u.id === 'grievance_admin_staff' ||
      u.id === 'grievance_admin_student'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category || !form.userId) {
      triggerNotification('Please fill in all fields.', 'error');
      return;
    }

    if (editingId) {
      setCategoryMappings(prev =>
        prev.map(m => (m.id === editingId ? { ...m, ...form } : m))
      );
      triggerNotification('Category mapping updated successfully.');
      setEditingId(null);
    } else {
      addCategoryMapping(form);
    }

    setForm({ category: '', userId: '', status: 'Active' });
  };

  const handleEdit = (mapping: any) => {
    setForm({
      category: mapping.category,
      userId: mapping.userId,
      status: mapping.status,
    });
    setEditingId(mapping.id);
  };

  if (!isAdmin) {
    return (
      <FormPage
        title="Grievance Category User Mapping"
        breadcrumbs={[
          {
            label: 'Grievance Management',
            to: '/grievance-management/dashboard',
          },
          { label: 'Category User Mapping' },
        ]}
      >
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded shadow-sm text-center">
          <i className="pi pi-exclamation-triangle text-2xl mb-2" />
          <h2 className="font-bold text-lg">Permission Denied</h2>
          <p className="text-sm mt-1">
            Only users with role <b>grievance_admin_staff</b> or{' '}
            <b>grievance_admin_student</b> can access category mapping settings.
          </p>
        </div>
      </FormPage>
    );
  }

  return (
    <FormPage
      title="Grievance Category User Mapping"
      description="Map specific grievance categories to responsible user accounts for automated workflow and resolution tracking"
      breadcrumbs={[
        {
          label: 'Grievance Management',
          to: '/grievance-management/dashboard',
        },
        { label: 'Settings', to: '/home/sub-menu/grievance-settings' },
        { label: 'Category User Mapping' },
      ]}
    >
      {/* ── Mapping Form Card ── */}
      <FormCard
        title={editingId ? 'Update Mapping' : 'Add Category User Mapping'}
        icon="link"
      >
        <form onSubmit={handleSubmit}>
          <FormGrid columns={3}>
            <DropDownList
              label="Grievance Category *"
              data={categoryDropdown}
              textField="text"
              valueField="id"
              value={form.category}
              onChange={v => setForm(p => ({ ...p, category: v as string }))}
            />
            <DropDownList
              label="Mapped User ID *"
              data={mappableUsers}
              textField="text"
              valueField="id"
              value={form.userId}
              onChange={v => setForm(p => ({ ...p, userId: v as string }))}
            />
            <DropDownList
              label="Status *"
              data={STATUS_OPTIONS}
              textField="text"
              valueField="id"
              value={form.status}
              onChange={v =>
                setForm(p => ({ ...p, status: v as typeof form.status }))
              }
            />
          </FormGrid>

          <div className="form-actions-row mt-4">
            <Button
              label={editingId ? 'Update Mapping' : 'Save Mapping'}
              icon="save"
              variant="primary"
              type="submit"
            />
            {editingId && (
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => {
                  setEditingId(null);
                  setForm({ category: '', userId: '', status: 'Active' });
                }}
              />
            )}
            <Button
              label="Reset"
              variant="outlined"
              onClick={() =>
                setForm({ category: '', userId: '', status: 'Active' })
              }
            />
          </div>
        </form>
      </FormCard>

      {/* ── Mapping Grid List ── */}
      <div className="mt-6">
        <FormCard title="Category Mappings List" icon="list">
          <GridPanel
            data={categoryMappings}
            columns={[
              { field: 'id', header: 'ID', width: '90px' },
              { field: 'category', header: 'Grievance Category' },
              { field: 'userId', header: 'Mapped User ID' },
              {
                field: 'status',
                header: 'Status',
                cell: (item: any) => (
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                      item.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.status}
                  </span>
                ),
              },
              {
                header: 'Actions',
                sortable: false,
                cell: (item: any) => (
                  <div className="flex gap-2">
                    <Button
                      label="View"
                      icon="eye"
                      variant="outlined"
                      size="small"
                      onClick={() => setViewMapping(item)}
                    />
                    <Button
                      label="Edit"
                      icon="pencil"
                      variant="outlined"
                      size="small"
                      onClick={() => handleEdit(item)}
                    />
                  </div>
                ),
              },
            ]}
            searchBox
          />
        </FormCard>
      </div>

      {/* ── View Detail Modal ── */}
      <FormPopup
        visible={!!viewMapping}
        onHide={() => setViewMapping(null)}
        title="Category User Mapping Details"
        subtitle={`Mapping ID: ${viewMapping?.id}`}
        footer={
          <Button
            label="Close"
            variant="primary"
            onClick={() => setViewMapping(null)}
          />
        }
      >
        {viewMapping && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-3">
              <div>
                <span className="font-semibold text-gray-500 block">
                  Grievance Category
                </span>
                <span className="text-gray-900 font-medium text-base">
                  {viewMapping.category}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-500 block">
                  Mapped User ID
                </span>
                <span className="text-gray-900 font-medium text-base">
                  {viewMapping.userId}
                </span>
              </div>
            </div>
            <div>
              <span className="font-semibold text-gray-500 block">
                Current Status
              </span>
              <span className="text-gray-900 font-medium text-base">
                {viewMapping.status}
              </span>
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
