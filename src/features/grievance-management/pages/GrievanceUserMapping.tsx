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

export default function GrievanceUserMapping() {
  const {
    grievanceMappings,
    setGrievanceMappings,
    addGrievanceMapping,
    grievances,
    activeRole,
    triggerNotification,
  } = useGrievance();

  const [form, setForm] = useState({
    grievanceId: '',
    userId: '',
    status: 'Active' as const,
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMapping, setViewMapping] = useState<any>(null);

  const isAdmin =
    activeRole === 'grievance_admin_staff' ||
    activeRole === 'grievance_admin_student';

  const grievanceDropdown = grievances.map(g => ({
    id: g.id,
    text: `${g.id}: ${g.member} (${g.category})`,
  }));

  const mappableUsers = USERS_LIST.filter(
    u =>
      u.id.includes('grievance_user') ||
      u.id === 'grievance_admin_staff' ||
      u.id === 'grievance_admin_student'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.grievanceId || !form.userId) {
      triggerNotification(
        'Please select a grievance and mapped user.',
        'error'
      );
      return;
    }

    if (editingId) {
      setGrievanceMappings(prev =>
        prev.map(m => (m.id === editingId ? { ...m, ...form } : m))
      );
      triggerNotification('Grievance mapping updated successfully.');
      setEditingId(null);
    } else {
      addGrievanceMapping(form);
    }

    setForm({ grievanceId: '', userId: '', status: 'Active' });
  };

  const handleEdit = (mapping: any) => {
    setForm({
      grievanceId: mapping.grievanceId,
      userId: mapping.userId,
      status: mapping.status,
    });
    setEditingId(mapping.id);
  };

  if (!isAdmin) {
    return (
      <FormPage
        title="Grievance User Mapping"
        breadcrumbs={[
          {
            label: 'Grievance Management',
            to: '/grievance-management/dashboard',
          },
          { label: 'Grievance User Mapping' },
        ]}
      >
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded shadow-sm text-center">
          <i className="pi pi-exclamation-triangle text-2xl mb-2" />
          <h2 className="font-bold text-lg">Permission Denied</h2>
          <p className="text-sm mt-1">
            Only users with role <b>grievance_admin_staff</b> or{' '}
            <b>grievance_admin_student</b> can access grievance user settings.
          </p>
        </div>
      </FormPage>
    );
  }

  return (
    <FormPage
      title="Grievance User Mapping"
      description="Map specific grievance tickets to specialized resolving agents for custom monitoring and accelerated resolution timelines"
      breadcrumbs={[
        {
          label: 'Grievance Management',
          to: '/grievance-management/dashboard',
        },
        { label: 'Settings', to: '/home/sub-menu/grievance-settings' },
        { label: 'Grievance User Mapping' },
      ]}
    >
      {/* ── Mapping Form Card ── */}
      <FormCard
        title={
          editingId ? 'Update Grievance Mapping' : 'Add Grievance User Mapping'
        }
        icon="person"
      >
        <form onSubmit={handleSubmit}>
          <FormGrid columns={3}>
            <DropDownList
              label="Select Grievance *"
              data={grievanceDropdown}
              textField="text"
              valueField="id"
              value={form.grievanceId}
              onChange={v => setForm(p => ({ ...p, grievanceId: v as string }))}
            />
            <DropDownList
              label="Select Mapped Agent *"
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
                  setForm({ grievanceId: '', userId: '', status: 'Active' });
                }}
              />
            )}
            <Button
              label="Reset"
              variant="outlined"
              onClick={() =>
                setForm({ grievanceId: '', userId: '', status: 'Active' })
              }
            />
          </div>
        </form>
      </FormCard>

      {/* ── Mapping Grid List ── */}
      <div className="mt-6">
        <FormCard title="Grievance Mappings List" icon="list">
          <GridPanel
            data={grievanceMappings}
            columns={[
              { field: 'id', header: 'ID', width: '90px' },
              { field: 'grievanceId', header: 'Grievance ID', width: '130px' },
              { field: 'userId', header: 'Mapped Agent ID' },
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
        title="Grievance User Mapping Details"
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
                  Grievance Ticket ID
                </span>
                <span className="text-gray-900 font-medium text-base">
                  {viewMapping.grievanceId}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-500 block">
                  Mapped Agent User ID
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
