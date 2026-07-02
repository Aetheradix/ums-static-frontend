import { useState } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { FormCard, FormPage } from 'shared/new-components';
import { admissionsUrls } from '../../urls';
import { ToastService } from 'services';

interface ReservationCategory {
  id: string;
  code: string;
  name: string;
  quotaPercentage: number;
  description: string;
  status: 'Active' | 'Inactive';
}

const mockCategories: ReservationCategory[] = [
  {
    id: '1',
    code: 'GEN',
    name: 'General',
    quotaPercentage: 50.5,
    description: 'Unreserved Category',
    status: 'Active',
  },
  {
    id: '2',
    code: 'OBC',
    name: 'Other Backward Classes',
    quotaPercentage: 27,
    description: 'Non-creamy layer',
    status: 'Active',
  },
  {
    id: '3',
    code: 'SC',
    name: 'Scheduled Caste',
    quotaPercentage: 15,
    description: 'SC Quota',
    status: 'Active',
  },
  {
    id: '4',
    code: 'ST',
    name: 'Scheduled Tribe',
    quotaPercentage: 7.5,
    description: 'ST Quota',
    status: 'Active',
  },
];

export default function ReservationMaster() {
  const [categories, setCategories] =
    useState<ReservationCategory[]>(mockCategories);
  const [showDialog, setShowDialog] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<Partial<ReservationCategory> | null>(null);

  const openNew = () => {
    setEditingCategory({ status: 'Active', quotaPercentage: 0 });
    setShowDialog(true);
  };

  const hideDialog = () => {
    setShowDialog(false);
    setEditingCategory(null);
  };

  const saveCategory = () => {
    if (
      editingCategory?.code &&
      editingCategory?.name &&
      editingCategory?.quotaPercentage !== undefined
    ) {
      if (editingCategory.id) {
        setCategories(
          categories.map(c =>
            c.id === editingCategory.id
              ? ({ ...c, ...editingCategory } as ReservationCategory)
              : c
          )
        );
        ToastService.success('Category updated successfully.');
      } else {
        const newCat = {
          ...editingCategory,
          id: Math.random().toString(36).substr(2, 9),
        } as ReservationCategory;
        setCategories([...categories, newCat]);
        ToastService.success('Category created successfully.');
      }
      hideDialog();
    }
  };

  const actionTemplate = (rowData: ReservationCategory) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          rounded
          text
          severity="info"
          aria-label="Edit"
          tooltip="Edit Category"
          onClick={() => {
            setEditingCategory({ ...rowData });
            setShowDialog(true);
          }}
        />
        <Button
          icon="pi pi-trash"
          rounded
          text
          severity="danger"
          aria-label="Delete"
          tooltip="Delete Category"
          onClick={() => {
            setCategories(categories.filter(c => c.id !== rowData.id));
            ToastService.success('Category removed successfully.');
          }}
        />
      </div>
    );
  };

  const statusTemplate = (rowData: ReservationCategory) => {
    return (
      <Tag
        value={rowData.status}
        severity={rowData.status === 'Active' ? 'success' : 'danger'}
      />
    );
  };

  const header = (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <h2 className="text-lg font-semibold text-gray-800 m-0">
        Reservation Categories Configuration
      </h2>
      <Button label="New Category" icon="pi pi-plus" onClick={openNew} />
    </div>
  );

  const dialogFooter = (
    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
      <Button
        label="Cancel"
        icon="pi pi-times"
        text
        severity="secondary"
        onClick={hideDialog}
      />
      <Button
        label="Save Category"
        icon="pi pi-check"
        onClick={saveCategory}
        disabled={!editingCategory?.code || !editingCategory?.name}
        autoFocus
      />
    </div>
  );

  return (
    <FormPage
      title="Reservation Master"
      description="Define admission quotas and categories."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Admissions', to: admissionsUrls.root },
        { label: 'Admin', to: admissionsUrls.admin.dashboard },
        { label: 'Reservation Master' },
      ]}
    >
      <FormCard>
        <DataTable
          value={categories}
          paginator
          rows={10}
          dataKey="id"
          header={header}
          emptyMessage="No categories found."
          className="p-datatable-sm"
          stripedRows
          rowHover
        >
          <Column
            field="code"
            header="Code"
            sortable
            style={{ minWidth: '100px' }}
            className="font-semibold text-gray-700"
          ></Column>
          <Column
            field="name"
            header="Category Name"
            sortable
            style={{ minWidth: '200px' }}
          ></Column>
          <Column
            field="quotaPercentage"
            header="Quota (%)"
            body={row => `${row.quotaPercentage}%`}
            sortable
          ></Column>
          <Column
            field="description"
            header="Description"
            sortable
            style={{ minWidth: '250px' }}
          ></Column>
          <Column
            field="status"
            header="Status"
            body={statusTemplate}
            sortable
          ></Column>
          <Column
            body={actionTemplate}
            header="Actions"
            exportable={false}
            style={{ minWidth: '100px' }}
          ></Column>
        </DataTable>
      </FormCard>

      <Dialog
        visible={showDialog}
        style={{ width: '90vw', maxWidth: '500px' }}
        header={
          editingCategory?.id
            ? 'Edit Reservation Category'
            : 'New Reservation Category'
        }
        modal
        className="p-fluid"
        onHide={hideDialog}
        footer={dialogFooter}
      >
        <div className="flex flex-col gap-5 mt-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="code" className="font-bold text-gray-700">
              Category Code <span className="text-red-500">*</span>
            </label>
            <InputText
              id="code"
              value={editingCategory?.code || ''}
              onChange={e =>
                setEditingCategory({ ...editingCategory, code: e.target.value })
              }
              required
              autoFocus
              placeholder="e.g. OBC"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-bold text-gray-700">
              Category Name <span className="text-red-500">*</span>
            </label>
            <InputText
              id="name"
              value={editingCategory?.name || ''}
              onChange={e =>
                setEditingCategory({ ...editingCategory, name: e.target.value })
              }
              required
              placeholder="e.g. Other Backward Classes"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="quotaPercentage"
              className="font-bold text-gray-700"
            >
              Quota Percentage (%) <span className="text-red-500">*</span>
            </label>
            <InputText
              id="quotaPercentage"
              type="number"
              step="0.1"
              value={editingCategory?.quotaPercentage?.toString() || ''}
              onChange={e =>
                setEditingCategory({
                  ...editingCategory,
                  quotaPercentage: parseFloat(e.target.value),
                })
              }
              required
              placeholder="e.g. 27.5"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="font-bold text-gray-700">
              Description
            </label>
            <InputText
              id="description"
              value={editingCategory?.description || ''}
              onChange={e =>
                setEditingCategory({
                  ...editingCategory,
                  description: e.target.value,
                })
              }
              placeholder="Optional description..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="status" className="font-bold text-gray-700">
              Status
            </label>
            <Dropdown
              id="status"
              value={editingCategory?.status || 'Active'}
              options={['Active', 'Inactive']}
              onChange={e =>
                setEditingCategory({
                  ...editingCategory,
                  status: e.value as 'Active' | 'Inactive',
                })
              }
              placeholder="Select Status"
            />
          </div>
        </div>
      </Dialog>
    </FormPage>
  );
}
