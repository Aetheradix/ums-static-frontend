import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { FormPage, FormCard, StatusBadge } from 'shared/new-components';

interface Subject {
  id: string;
  code: string;
  name: string;
  category: string;
  isPractical: 'Yes' | 'No';
  status: 'Active' | 'Inactive';
}

const mockSubjects: Subject[] = [
  {
    id: '1',
    code: 'SUB-CS-01',
    name: 'Data Structures',
    category: 'Core',
    isPractical: 'No',
    status: 'Active',
  },
  {
    id: '2',
    code: 'SUB-CS-02',
    name: 'Algorithms Lab',
    category: 'Core',
    isPractical: 'Yes',
    status: 'Active',
  },
  {
    id: '3',
    code: 'SUB-HU-01',
    name: 'Professional Ethics',
    category: 'Audit',
    isPractical: 'No',
    status: 'Active',
  },
  {
    id: '4',
    code: 'SUB-EE-01',
    name: 'Basic Electronics',
    category: 'Elective',
    isPractical: 'No',
    status: 'Active',
  },
];

export default function SubjectMaster() {
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [showDialog, setShowDialog] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Partial<Subject> | null>(
    null
  );

  const openNew = () => {
    setEditingSubject({
      status: 'Active',
      isPractical: 'No',
      category: 'Core',
    });
    setShowDialog(true);
  };

  const hideDialog = () => {
    setShowDialog(false);
    setEditingSubject(null);
  };

  const saveSubject = () => {
    if (editingSubject?.code && editingSubject?.name) {
      if (editingSubject.id) {
        setSubjects(
          subjects.map(s =>
            s.id === editingSubject.id
              ? ({ ...s, ...editingSubject } as Subject)
              : s
          )
        );
      } else {
        const newSubject = {
          ...editingSubject,
          id: Math.random().toString(36).substr(2, 9),
        } as Subject;
        setSubjects([...subjects, newSubject]);
      }
      hideDialog();
    }
  };

  const actionTemplate = (rowData: Subject) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          size="small"
          onClick={() => {
            setEditingSubject({ ...rowData });
            setShowDialog(true);
          }}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          size="small"
          onClick={() => setSubjects(subjects.filter(s => s.id !== rowData.id))}
        />
      </div>
    );
  };

  const statusTemplate = (rowData: Subject) => {
    return (
      <StatusBadge
        label={rowData.status}
        variant={rowData.status === 'Active' ? 'approved' : 'neutral'}
      />
    );
  };

  return (
    <FormPage
      title="Subject Master"
      description="Manage subject offerings across programs."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Student Management', to: '/master' },
        { label: 'Admin', to: '/master/dashboard' },
        { label: 'Subject Master' },
      ]}
    >
      <FormCard>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Subjects List</h2>
          <Button label="Add Subject" icon="pi pi-plus" onClick={openNew} />
        </div>

        <DataTable
          value={subjects}
          paginator
          rows={10}
          dataKey="id"
          emptyMessage="No subjects found."
          className="p-datatable-sm"
        >
          <Column
            field="code"
            header="Subject Code"
            sortable
            style={{ minWidth: '120px' }}
          ></Column>
          <Column
            field="name"
            header="Subject Name"
            sortable
            style={{ minWidth: '250px' }}
          ></Column>
          <Column field="category" header="Category" sortable></Column>
          <Column field="isPractical" header="Has Practical?" sortable></Column>
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
        header={editingSubject?.id ? 'Edit Subject' : 'New Subject'}
        modal
        className="p-fluid"
        onHide={hideDialog}
      >
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="field">
            <label htmlFor="code" className="font-semibold mb-1 block">
              Subject Code *
            </label>
            <InputText
              id="code"
              value={editingSubject?.code || ''}
              onChange={e =>
                setEditingSubject({ ...editingSubject, code: e.target.value })
              }
              required
              autoFocus
            />
          </div>
          <div className="field">
            <label htmlFor="name" className="font-semibold mb-1 block">
              Subject Name *
            </label>
            <InputText
              id="name"
              value={editingSubject?.name || ''}
              onChange={e =>
                setEditingSubject({ ...editingSubject, name: e.target.value })
              }
              required
            />
          </div>

          <div className="field">
            <label htmlFor="category" className="font-semibold mb-1 block">
              Category
            </label>
            <Dropdown
              id="category"
              value={editingSubject?.category || 'Core'}
              options={['Core', 'Elective', 'Audit']}
              onChange={e =>
                setEditingSubject({ ...editingSubject, category: e.value })
              }
            />
          </div>
          <div className="field">
            <label htmlFor="isPractical" className="font-semibold mb-1 block">
              Has Practical?
            </label>
            <Dropdown
              id="isPractical"
              value={editingSubject?.isPractical || 'No'}
              options={['Yes', 'No']}
              onChange={e =>
                setEditingSubject({ ...editingSubject, isPractical: e.value })
              }
            />
          </div>

          <div className="field col-span-2">
            <label htmlFor="status" className="font-semibold mb-1 block">
              Status
            </label>
            <Dropdown
              id="status"
              value={editingSubject?.status || 'Active'}
              options={['Active', 'Inactive']}
              onChange={e =>
                setEditingSubject({ ...editingSubject, status: e.value })
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
          <Button label="Save" icon="pi pi-check" onClick={saveSubject} />
        </div>
      </Dialog>
    </FormPage>
  );
}
