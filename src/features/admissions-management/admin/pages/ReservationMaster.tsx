import { useState } from 'react';
import {
  FormCard,
  FormPage,
  StatusBadge,
  GridPanel,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { Modal } from 'shared/components/popups';
import { TextBox, DropDownList, NumberBox } from 'shared/components/forms';
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

  const statusTemplate = (rowData: ReservationCategory) => {
    return (
      <StatusBadge
        label={rowData.status}
        variant={rowData.status === 'Active' ? 'success' : 'danger'}
      />
    );
  };

  const toolbar = (
    <Button label="New Category" icon="pi pi-plus" onClick={openNew} />
  );

  // Footer is now inline in Modal
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
        <GridPanel
          data={categories}
          searchBox={true}
          searchFields={['code', 'name', 'status']}
          toolbar={toolbar}
          onEdit={(rowData: ReservationCategory) => {
            setEditingCategory({ ...rowData });
            setShowDialog(true);
          }}
          onRemove={(rowData: ReservationCategory) => {
            setCategories(categories.filter(c => c.id !== rowData.id));
            ToastService.success('Category removed successfully.');
          }}
          columns={[
            { field: 'code', header: 'Code', sortable: true },
            { field: 'name', header: 'Category Name', sortable: true },
            {
              field: 'quotaPercentage',
              header: 'Quota (%)',
              cell: row => <span>{row.quotaPercentage}%</span>,
              sortable: true,
            },
            { field: 'description', header: 'Description', sortable: true },
            {
              field: 'status',
              header: 'Status',
              cell: statusTemplate,
              sortable: true,
            },
          ]}
        />
      </FormCard>

      <Modal
        visible={showDialog}
        size="medium"
        header={
          editingCategory?.id
            ? 'Edit Reservation Category'
            : 'New Reservation Category'
        }
        onHide={hideDialog}
      >
        <div className="p-4 flex flex-col gap-4">
          <TextBox
            label="Category Code *"
            value={editingCategory?.code || ''}
            onChange={v =>
              setEditingCategory({ ...editingCategory, code: v as string })
            }
            placeholder="e.g. OBC"
            autoFocus
          />

          <TextBox
            label="Category Name *"
            value={editingCategory?.name || ''}
            onChange={v =>
              setEditingCategory({ ...editingCategory, name: v as string })
            }
            placeholder="e.g. Other Backward Classes"
          />

          <NumberBox
            label="Quota Percentage (%) *"
            value={editingCategory?.quotaPercentage}
            onChange={v =>
              setEditingCategory({
                ...editingCategory,
                quotaPercentage: Number(v),
              })
            }
            placeholder="e.g. 27.5"
          />

          <TextBox
            label="Description"
            value={editingCategory?.description || ''}
            onChange={v =>
              setEditingCategory({
                ...editingCategory,
                description: v as string,
              })
            }
            placeholder="Optional description..."
          />

          <DropDownList
            label="Status"
            value={editingCategory?.status || 'Active'}
            data={[
              { label: 'Active', value: 'Active' },
              { label: 'Inactive', value: 'Inactive' },
            ]}
            textField="label"
            valueField="value"
            onChange={(v: any) =>
              setEditingCategory({
                ...editingCategory,
                status: v as 'Active' | 'Inactive',
              })
            }
            defaultOptionText="Select Status"
          />

          <div className="flex justify-end gap-2 mt-2">
            <Button
              label="Cancel"
              icon="pi pi-times"
              variant="outlined"
              onClick={hideDialog}
            />
            <Button
              label="Save Category"
              icon="pi pi-check"
              variant="primary"
              onClick={saveCategory}
              disabled={!editingCategory?.code || !editingCategory?.name}
            />
          </div>
        </div>
      </Modal>
    </FormPage>
  );
}
