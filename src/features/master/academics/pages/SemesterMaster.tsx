import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { FormPage, FormCard, StatusBadge } from 'shared/new-components';

interface Semester {
  id: string;
  name: string;
  program: string;
  order: number;
  status: 'Active' | 'Inactive';
}

const mockPrograms = [
  { label: 'B.Tech CSE', value: 'B.Tech CSE' },
  { label: 'B.Tech ECE', value: 'B.Tech ECE' },
  { label: 'MBA Finance', value: 'MBA Finance' },
];

const mockSemesters: Semester[] = [
  {
    id: '1',
    name: 'Semester 1',
    program: 'B.Tech CSE',
    order: 1,
    status: 'Active',
  },
  {
    id: '2',
    name: 'Semester 2',
    program: 'B.Tech CSE',
    order: 2,
    status: 'Active',
  },
  {
    id: '3',
    name: 'Semester 1',
    program: 'MBA Finance',
    order: 1,
    status: 'Active',
  },
];

export default function SemesterMaster() {
  const [semesters, setSemesters] = useState<Semester[]>(mockSemesters);
  const [showDialog, setShowDialog] = useState(false);
  const [editingSemester, setEditingSemester] =
    useState<Partial<Semester> | null>(null);

  const openNew = () => {
    setEditingSemester({ status: 'Active', order: 1 });
    setShowDialog(true);
  };

  const hideDialog = () => {
    setShowDialog(false);
    setEditingSemester(null);
  };

  const saveSemester = () => {
    if (editingSemester?.name && editingSemester?.program) {
      if (editingSemester.id) {
        setSemesters(
          semesters.map(s =>
            s.id === editingSemester.id
              ? ({ ...s, ...editingSemester } as Semester)
              : s
          )
        );
      } else {
        const newSemester = {
          ...editingSemester,
          id: Math.random().toString(36).substr(2, 9),
        } as Semester;
        setSemesters([...semesters, newSemester]);
      }
      hideDialog();
    }
  };

  const actionTemplate = (rowData: Semester) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          size="small"
          onClick={() => {
            setEditingSemester({ ...rowData });
            setShowDialog(true);
          }}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          size="small"
          onClick={() =>
            setSemesters(semesters.filter(s => s.id !== rowData.id))
          }
        />
      </div>
    );
  };

  const statusTemplate = (rowData: Semester) => {
    return (
      <StatusBadge
        label={rowData.status}
        variant={rowData.status === 'Active' ? 'approved' : 'neutral'}
      />
    );
  };

  return (
    <FormPage
      title="Semester Master"
      description="Define semesters and their order for each program."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Student Management', to: '/student-management/admin' },
        { label: 'Semester Master' },
      ]}
    >
      <FormCard>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Semesters List
          </h2>
          <Button label="Add Semester" icon="pi pi-plus" onClick={openNew} />
        </div>

        <DataTable
          value={semesters}
          paginator
          rows={10}
          dataKey="id"
          emptyMessage="No semesters found."
          className="p-datatable-sm"
        >
          <Column
            field="name"
            header="Semester Name"
            sortable
            style={{ minWidth: '200px' }}
          ></Column>
          <Column
            field="program"
            header="Program"
            sortable
            style={{ minWidth: '200px' }}
          ></Column>
          <Column field="order" header="Order" sortable></Column>
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
        style={{ width: '450px' }}
        header={editingSemester?.id ? 'Edit Semester' : 'New Semester'}
        modal
        className="p-fluid"
        onHide={hideDialog}
      >
        <div className="flex flex-col gap-4 mt-2">
          <div className="field">
            <label htmlFor="name" className="font-semibold mb-1 block">
              Semester Name *
            </label>
            <InputText
              id="name"
              value={editingSemester?.name || ''}
              onChange={e =>
                setEditingSemester({ ...editingSemester, name: e.target.value })
              }
              required
              autoFocus
              placeholder="e.g. Semester 1"
            />
          </div>

          <div className="field">
            <label htmlFor="program" className="font-semibold mb-1 block">
              Program *
            </label>
            <Dropdown
              id="program"
              value={editingSemester?.program || null}
              options={mockPrograms}
              onChange={e =>
                setEditingSemester({ ...editingSemester, program: e.value })
              }
              placeholder="Select Program"
            />
          </div>

          <div className="field">
            <label htmlFor="order" className="font-semibold mb-1 block">
              Order (Numeric) *
            </label>
            <InputText
              id="order"
              type="number"
              value={editingSemester?.order?.toString() || ''}
              onChange={e =>
                setEditingSemester({
                  ...editingSemester,
                  order: parseInt(e.target.value),
                })
              }
            />
          </div>

          <div className="field">
            <label htmlFor="status" className="font-semibold mb-1 block">
              Status
            </label>
            <Dropdown
              id="status"
              value={editingSemester?.status || 'Active'}
              options={['Active', 'Inactive']}
              onChange={e =>
                setEditingSemester({ ...editingSemester, status: e.value })
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
          <Button label="Save" icon="pi pi-check" onClick={saveSemester} />
        </div>
      </Dialog>
    </FormPage>
  );
}
