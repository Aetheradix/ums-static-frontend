import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { FormPage, FormCard, StatusBadge } from 'shared/new-components';

interface Batch {
  id: string;
  name: string;
  program: string;
  startYear: number;
  endYear: number;
  status: 'Active' | 'Inactive';
}

const mockPrograms = [
  { label: 'B.Tech CSE', value: 'B.Tech CSE' },
  { label: 'B.Tech ECE', value: 'B.Tech ECE' },
  { label: 'MBA Finance', value: 'MBA Finance' },
];

const mockBatches: Batch[] = [
  {
    id: '1',
    name: 'Batch 2024-2028',
    program: 'B.Tech CSE',
    startYear: 2024,
    endYear: 2028,
    status: 'Active',
  },
  {
    id: '2',
    name: 'Batch 2023-2027',
    program: 'B.Tech CSE',
    startYear: 2023,
    endYear: 2027,
    status: 'Active',
  },
  {
    id: '3',
    name: 'Batch 2024-2026',
    program: 'MBA Finance',
    startYear: 2024,
    endYear: 2026,
    status: 'Active',
  },
];

export default function BatchMaster() {
  const [batches, setBatches] = useState<Batch[]>(mockBatches);
  const [showDialog, setShowDialog] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Partial<Batch> | null>(null);

  const openNew = () => {
    const currentYear = new Date().getFullYear();
    setEditingBatch({
      status: 'Active',
      startYear: currentYear,
      endYear: currentYear + 4,
    });
    setShowDialog(true);
  };

  const hideDialog = () => {
    setShowDialog(false);
    setEditingBatch(null);
  };

  const saveBatch = () => {
    if (
      editingBatch?.name &&
      editingBatch?.program &&
      editingBatch?.startYear &&
      editingBatch?.endYear
    ) {
      if (editingBatch.id) {
        setBatches(
          batches.map(b =>
            b.id === editingBatch.id ? ({ ...b, ...editingBatch } as Batch) : b
          )
        );
      } else {
        const newBatch = {
          ...editingBatch,
          id: Math.random().toString(36).substr(2, 9),
        } as Batch;
        setBatches([...batches, newBatch]);
      }
      hideDialog();
    }
  };

  const actionTemplate = (rowData: Batch) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          size="small"
          onClick={() => {
            setEditingBatch({ ...rowData });
            setShowDialog(true);
          }}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          size="small"
          onClick={() => setBatches(batches.filter(b => b.id !== rowData.id))}
        />
      </div>
    );
  };

  const statusTemplate = (rowData: Batch) => {
    return (
      <StatusBadge
        label={rowData.status}
        variant={rowData.status === 'Active' ? 'approved' : 'neutral'}
      />
    );
  };

  return (
    <FormPage
      title="Batch Master"
      description="Define admission batches and their duration for each program."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Student Management', to: '/student-management/admin' },
        { label: 'Batch Master' },
      ]}
    >
      <FormCard>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Batches List</h2>
          <Button label="Add Batch" icon="pi pi-plus" onClick={openNew} />
        </div>

        <DataTable
          value={batches}
          paginator
          rows={10}
          dataKey="id"
          emptyMessage="No batches found."
          className="p-datatable-sm"
        >
          <Column
            field="name"
            header="Batch Name"
            sortable
            style={{ minWidth: '200px' }}
          ></Column>
          <Column
            field="program"
            header="Program"
            sortable
            style={{ minWidth: '200px' }}
          ></Column>
          <Column field="startYear" header="Start Year" sortable></Column>
          <Column field="endYear" header="End Year" sortable></Column>
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
        style={{ width: '500px' }}
        header={editingBatch?.id ? 'Edit Batch' : 'New Batch'}
        modal
        className="p-fluid"
        onHide={hideDialog}
      >
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="field col-span-2">
            <label htmlFor="name" className="font-semibold mb-1 block">
              Batch Name *
            </label>
            <InputText
              id="name"
              value={editingBatch?.name || ''}
              onChange={e =>
                setEditingBatch({ ...editingBatch, name: e.target.value })
              }
              required
              autoFocus
              placeholder="e.g. Batch 2024-2028"
            />
          </div>

          <div className="field col-span-2">
            <label htmlFor="program" className="font-semibold mb-1 block">
              Program *
            </label>
            <Dropdown
              id="program"
              value={editingBatch?.program || null}
              options={mockPrograms}
              onChange={e =>
                setEditingBatch({ ...editingBatch, program: e.value })
              }
              placeholder="Select Program"
            />
          </div>

          <div className="field">
            <label htmlFor="startYear" className="font-semibold mb-1 block">
              Start Year *
            </label>
            <InputText
              id="startYear"
              type="number"
              value={editingBatch?.startYear?.toString() || ''}
              onChange={e =>
                setEditingBatch({
                  ...editingBatch,
                  startYear: parseInt(e.target.value),
                })
              }
            />
          </div>

          <div className="field">
            <label htmlFor="endYear" className="font-semibold mb-1 block">
              End Year *
            </label>
            <InputText
              id="endYear"
              type="number"
              value={editingBatch?.endYear?.toString() || ''}
              onChange={e =>
                setEditingBatch({
                  ...editingBatch,
                  endYear: parseInt(e.target.value),
                })
              }
            />
          </div>

          <div className="field col-span-2">
            <label htmlFor="status" className="font-semibold mb-1 block">
              Status
            </label>
            <Dropdown
              id="status"
              value={editingBatch?.status || 'Active'}
              options={['Active', 'Inactive']}
              onChange={e =>
                setEditingBatch({ ...editingBatch, status: e.value })
              }
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button
            label="Cancel"
            icon="pi pi-times"
            outlined
            onClick={hideDialog}
          />
          <Button label="Save" icon="pi pi-check" onClick={saveBatch} />
        </div>
      </Dialog>
    </FormPage>
  );
}
