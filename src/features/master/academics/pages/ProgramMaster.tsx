import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { FormPage, FormCard, StatusBadge } from 'shared/new-components';

interface Program {
  id: string;
  code: string;
  name: string;
  department: string;
  level: string;
  duration: number; // in years
  maxIntake: number;
  status: 'Active' | 'Inactive';
}

const mockDepartments = [
  { label: 'Computer Science and Engineering', value: 'CSE' },
  { label: 'Electronics & Communication', value: 'ECE' },
  { label: 'Mechanical Engineering', value: 'ME' },
  { label: 'Civil Engineering', value: 'CE' },
  { label: 'Management Studies', value: 'MGT' },
];

const programLevels = [
  { label: 'Undergraduate (UG)', value: 'UG' },
  { label: 'Postgraduate (PG)', value: 'PG' },
  { label: 'Diploma', value: 'Diploma' },
  { label: 'Doctorate (PhD)', value: 'PhD' },
];

const initialPrograms: Program[] = [
  {
    id: '1',
    code: 'BTECH-CSE',
    name: 'B.Tech in Computer Science',
    department: 'CSE',
    level: 'UG',
    duration: 4,
    maxIntake: 120,
    status: 'Active',
  },
  {
    id: '2',
    code: 'BTECH-ECE',
    name: 'B.Tech in Electronics',
    department: 'ECE',
    level: 'UG',
    duration: 4,
    maxIntake: 60,
    status: 'Active',
  },
  {
    id: '3',
    code: 'MTECH-CSE',
    name: 'M.Tech in Computer Science',
    department: 'CSE',
    level: 'PG',
    duration: 2,
    maxIntake: 30,
    status: 'Active',
  },
  {
    id: '4',
    code: 'MBA-FIN',
    name: 'MBA in Finance',
    department: 'MGT',
    level: 'PG',
    duration: 2,
    maxIntake: 60,
    status: 'Active',
  },
];

export default function ProgramMaster() {
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [showDialog, setShowDialog] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Partial<Program> | null>(
    null
  );

  const openNew = () => {
    setEditingProgram({ status: 'Active', duration: 4, maxIntake: 60 });
    setShowDialog(true);
  };

  const hideDialog = () => {
    setShowDialog(false);
    setEditingProgram(null);
  };

  const saveProgram = () => {
    if (
      editingProgram?.code &&
      editingProgram?.name &&
      editingProgram?.department &&
      editingProgram?.level
    ) {
      if (editingProgram.id) {
        setPrograms(
          programs.map(p =>
            p.id === editingProgram.id
              ? ({ ...p, ...editingProgram } as Program)
              : p
          )
        );
      } else {
        const newProg = {
          ...editingProgram,
          id: Math.random().toString(36).substr(2, 9),
        } as Program;
        setPrograms([...programs, newProg]);
      }
      hideDialog();
    }
  };

  const actionTemplate = (rowData: Program) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          size="small"
          onClick={() => {
            setEditingProgram({ ...rowData });
            setShowDialog(true);
          }}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          size="small"
          onClick={() => setPrograms(programs.filter(p => p.id !== rowData.id))}
        />
      </div>
    );
  };

  const statusTemplate = (rowData: Program) => {
    return (
      <StatusBadge
        label={rowData.status}
        variant={rowData.status === 'Active' ? 'approved' : 'neutral'}
      />
    );
  };

  return (
    <FormPage
      title="Program Master"
      description="Define academic programs, duration, and intake capacity."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Student Management', to: '/student-management/admin' },
        { label: 'Program Master' },
      ]}
    >
      <FormCard>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Programs List</h2>
          <Button label="Add Program" icon="pi pi-plus" onClick={openNew} />
        </div>

        <DataTable
          value={programs}
          paginator
          rows={10}
          dataKey="id"
          emptyMessage="No programs found."
          className="p-datatable-sm"
        >
          <Column
            field="code"
            header="Program Code"
            sortable
            style={{ minWidth: '120px' }}
          ></Column>
          <Column
            field="name"
            header="Program Name"
            sortable
            style={{ minWidth: '250px' }}
          ></Column>
          <Column
            field="department"
            header="Department"
            sortable
            style={{ minWidth: '150px' }}
          ></Column>
          <Column field="level" header="Level" sortable></Column>
          <Column field="duration" header="Duration (Yrs)" sortable></Column>
          <Column field="maxIntake" header="Max Intake" sortable></Column>
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
        style={{ width: '600px' }}
        header={editingProgram?.id ? 'Edit Program' : 'New Program'}
        modal
        className="p-fluid"
        onHide={hideDialog}
      >
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="field">
            <label htmlFor="code" className="font-semibold mb-1 block">
              Program Code *
            </label>
            <InputText
              id="code"
              value={editingProgram?.code || ''}
              onChange={e =>
                setEditingProgram({ ...editingProgram, code: e.target.value })
              }
              required
              autoFocus
            />
          </div>
          <div className="field">
            <label htmlFor="name" className="font-semibold mb-1 block">
              Program Name *
            </label>
            <InputText
              id="name"
              value={editingProgram?.name || ''}
              onChange={e =>
                setEditingProgram({ ...editingProgram, name: e.target.value })
              }
              required
            />
          </div>

          <div className="field">
            <label htmlFor="department" className="font-semibold mb-1 block">
              Department *
            </label>
            <Dropdown
              id="department"
              value={editingProgram?.department || null}
              options={mockDepartments}
              onChange={e =>
                setEditingProgram({ ...editingProgram, department: e.value })
              }
              placeholder="Select Department"
            />
          </div>
          <div className="field">
            <label htmlFor="level" className="font-semibold mb-1 block">
              Level *
            </label>
            <Dropdown
              id="level"
              value={editingProgram?.level || null}
              options={programLevels}
              onChange={e =>
                setEditingProgram({ ...editingProgram, level: e.value })
              }
              placeholder="Select Level"
            />
          </div>

          <div className="field">
            <label htmlFor="duration" className="font-semibold mb-1 block">
              Duration (Years)
            </label>
            <InputText
              id="duration"
              type="number"
              value={editingProgram?.duration?.toString() || ''}
              onChange={e =>
                setEditingProgram({
                  ...editingProgram,
                  duration: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className="field">
            <label htmlFor="maxIntake" className="font-semibold mb-1 block">
              Max Intake Capacity
            </label>
            <InputText
              id="maxIntake"
              type="number"
              value={editingProgram?.maxIntake?.toString() || ''}
              onChange={e =>
                setEditingProgram({
                  ...editingProgram,
                  maxIntake: parseInt(e.target.value),
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
              value={editingProgram?.status || 'Active'}
              options={['Active', 'Inactive']}
              onChange={e =>
                setEditingProgram({ ...editingProgram, status: e.value })
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
          <Button label="Save" icon="pi pi-check" onClick={saveProgram} />
        </div>
      </Dialog>
    </FormPage>
  );
}
