import { useState } from 'react';
import { useGrievance } from '../context';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  FormPopup,
} from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import type { GrievanceCategory as CatType } from '../data';

const CATEGORY_TYPE_OPTIONS = [
  { id: 'Student', text: 'Student' },
  { id: 'Employee', text: 'Employee' },
  { id: 'Public', text: 'Public' },
];

const STATUS_OPTIONS = [
  { id: 'Active', text: 'Active' },
  { id: 'Inactive', text: 'Inactive' },
];

const VISIBLE_OPTIONS = [
  { id: 'Yes', text: 'Yes' },
  { id: 'No', text: 'No' },
];

const BLANK_FORM = {
  name: '',
  type: 'Student' as 'Student' | 'Employee' | 'Public',
  status: 'Active' as 'Active' | 'Inactive',
  visible: 'Yes' as 'Yes' | 'No',
};

export default function GrievanceCategory() {
  const { categories, addCategory, updateCategory, activeRole } =
    useGrievance();
  const [form, setForm] = useState({ ...BLANK_FORM });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // View / Detail modal state
  const [viewItem, setViewItem] = useState<CatType | null>(null);
  const [isViewPopupVisible, setIsViewPopupVisible] = useState(false);

  const isAdmin =
    activeRole === 'grievance_admin_staff' ||
    activeRole === 'grievance_admin_student';

  const set = <K extends keyof typeof BLANK_FORM>(
    key: K,
    value: (typeof BLANK_FORM)[K]
  ) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (isEditing && editId) {
      updateCategory(editId, form);
      setIsEditing(false);
      setEditId(null);
    } else {
      addCategory(form);
    }
    setForm({ ...BLANK_FORM });
  };

  const handleEdit = (item: CatType) => {
    setForm({
      name: item.name,
      type: item.type,
      status: item.status,
      visible: item.visible,
    });
    setIsEditing(true);
    setEditId(item.id);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setForm({ ...BLANK_FORM });
  };

  const handleView = (item: CatType) => {
    setViewItem(item);
    setIsViewPopupVisible(true);
  };

  if (!isAdmin) {
    return (
      <FormPage
        title="Grievance Category Settings"
        breadcrumbs={[
          {
            label: 'Grievance Management',
            to: '/grievance-management/dashboard',
          },
          { label: 'Category Settings' },
        ]}
      >
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded shadow-sm text-center">
          <i className="pi pi-exclamation-triangle text-2xl mb-2" />
          <h2 className="font-bold text-lg">Permission Denied</h2>
          <p className="text-sm mt-1">
            Only users with role <b>grievance_admin_staff</b> or{' '}
            <b>grievance_admin_student</b> can access settings. Please use the
            Role Switcher at the top of the Dashboard.
          </p>
        </div>
      </FormPage>
    );
  }

  return (
    <FormPage
      title="Grievance Category Settings"
      description="Configure and manage grievance categories for students, employees, and public redressal portal"
      breadcrumbs={[
        {
          label: 'Grievance Management',
          to: '/grievance-management/dashboard',
        },
        { label: 'Settings', to: '/home/sub-menu/grievance-settings' },
        { label: 'Grievance Category' },
      ]}
    >
      {/* ── Add / Edit Form Card ── */}
      <FormCard
        title={
          isEditing ? 'Update Grievance Category' : 'Add Grievance Category'
        }
        icon="edit"
      >
        <form onSubmit={handleSubmit}>
          <FormGrid columns={4}>
            <TextBox
              label="Category Name *"
              placeholder="e.g. Hostels, Infrastructure, Exams"
              value={form.name}
              onChange={v => set('name', v)}
              required
            />
            <DropDownList
              label="Category Type *"
              data={CATEGORY_TYPE_OPTIONS}
              textField="text"
              valueField="id"
              value={form.type}
              onChange={v => set('type', v as typeof form.type)}
            />
            <DropDownList
              label="Status *"
              data={STATUS_OPTIONS}
              textField="text"
              valueField="id"
              value={form.status}
              onChange={v => set('status', v as typeof form.status)}
            />
            <DropDownList
              label="Visible *"
              data={VISIBLE_OPTIONS}
              textField="text"
              valueField="id"
              value={form.visible}
              onChange={v => set('visible', v as typeof form.visible)}
            />
          </FormGrid>

          <div className="form-actions-row mt-4">
            <Button
              label={isEditing ? 'Update Category' : 'Add Category'}
              icon="save"
              variant="primary"
              type="submit"
            />
            {isEditing && (
              <Button
                label="Cancel"
                variant="outlined"
                onClick={handleCancelEdit}
              />
            )}
            <Button
              label="Reset"
              variant="outlined"
              onClick={() => setForm({ ...BLANK_FORM })}
            />
          </div>
        </form>
      </FormCard>

      {/* ── Registered Categories Grid ── */}
      <div className="mt-6">
        <FormCard title="Configured Categories" icon="list">
          <GridPanel
            data={categories}
            columns={[
              { field: 'id', header: 'ID', width: '90px' },
              { field: 'name', header: 'Category Name' },
              {
                field: 'type',
                header: 'Type',
                cell: (item: CatType) => (
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                      item.type === 'Student'
                        ? 'bg-blue-100 text-blue-700'
                        : item.type === 'Employee'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-teal-100 text-teal-700'
                    }`}
                  >
                    {item.type}
                  </span>
                ),
              },
              {
                field: 'status',
                header: 'Status',
                cell: (item: CatType) => (
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
                field: 'visible',
                header: 'Visible',
                cell: (item: CatType) => (
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                      item.visible === 'Yes'
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-rose-50 text-rose-500'
                    }`}
                  >
                    {item.visible}
                  </span>
                ),
              },
              {
                header: 'Actions',
                sortable: false,
                cell: (item: CatType) => (
                  <div className="flex gap-2">
                    <Button
                      label="View"
                      icon="eye"
                      variant="outlined"
                      size="small"
                      onClick={() => handleView(item)}
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

      {/* ── View Detail Popup ── */}
      <FormPopup
        visible={isViewPopupVisible}
        onHide={() => setIsViewPopupVisible(false)}
        title="Grievance Category Details"
        subtitle={`Record ID: ${viewItem?.id}`}
        footer={
          <div className="flex justify-end">
            <Button
              label="Close"
              variant="primary"
              onClick={() => setIsViewPopupVisible(false)}
            />
          </div>
        }
      >
        {viewItem && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-3">
              <div>
                <span className="font-semibold text-gray-500 block">
                  Category Name
                </span>
                <span className="text-gray-900 font-medium text-base">
                  {viewItem.name}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-500 block">
                  Applicable Group (Type)
                </span>
                <span className="text-gray-900 font-medium text-base">
                  {viewItem.type}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-semibold text-gray-500 block">
                  Status
                </span>
                <span className="text-gray-900 font-medium text-base">
                  {viewItem.status}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-500 block">
                  Visible in listings
                </span>
                <span className="text-gray-900 font-medium text-base">
                  {viewItem.visible}
                </span>
              </div>
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
