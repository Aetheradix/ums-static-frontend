import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { FormPage, FormCard, StatusBadge } from 'shared/new-components';

interface Course {
  id: string;
  code: string;
  name: string;
  program: string;
  type: string;
  status: 'Active' | 'Inactive';
}

const mockPrograms = [
  { label: 'B.Tech - Bachelor of Technology', value: 'B.Tech' },
  { label: 'M.Tech - Master of Technology', value: 'M.Tech' },
  { label: 'MBA - Master of Business Admin', value: 'MBA' },
  { label: 'B.Sc - Bachelor of Science', value: 'B.Sc' },
];

const mockCourses: Course[] = [
  {
    id: '1',
    code: 'CSE',
    name: 'Computer Science & Engineering',
    program: 'B.Tech',
    type: 'Full-Time',
    status: 'Active',
  },
  {
    id: '2',
    code: 'ECE',
    name: 'Electronics & Communication',
    program: 'B.Tech',
    type: 'Full-Time',
    status: 'Active',
  },
  {
    id: '3',
    code: 'FIN',
    name: 'Finance',
    program: 'MBA',
    type: 'Full-Time',
    status: 'Active',
  },
];

export default function CourseMaster() {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [showDialog, setShowDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(
    null
  );

  const openNew = () => {
    setEditingCourse({ status: 'Active', type: 'Full-Time' });
    setShowDialog(true);
  };

  const hideDialog = () => {
    setShowDialog(false);
    setEditingCourse(null);
  };

  const saveCourse = () => {
    if (editingCourse?.code && editingCourse?.name && editingCourse?.program) {
      if (editingCourse.id) {
        setCourses(
          courses.map(c =>
            c.id === editingCourse.id
              ? ({ ...c, ...editingCourse } as Course)
              : c
          )
        );
      } else {
        const newCourse = {
          ...editingCourse,
          id: Math.random().toString(36).substr(2, 9),
        } as Course;
        setCourses([...courses, newCourse]);
      }
      hideDialog();
    }
  };

  const actionTemplate = (rowData: Course) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          size="small"
          onClick={() => {
            setEditingCourse({ ...rowData });
            setShowDialog(true);
          }}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          size="small"
          onClick={() => setCourses(courses.filter(c => c.id !== rowData.id))}
        />
      </div>
    );
  };

  const statusTemplate = (rowData: Course) => {
    return (
      <StatusBadge
        label={rowData.status}
        variant={rowData.status === 'Active' ? 'approved' : 'neutral'}
      />
    );
  };

  return (
    <FormPage
      title="Course Master"
      description="Define specializations/branches under different academic programs."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Student Management', to: '/student-management/admin' },
        { label: 'Course Master' },
      ]}
    >
      <FormCard>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Courses List</h2>
          <Button label="Add Course" icon="pi pi-plus" onClick={openNew} />
        </div>

        <DataTable
          value={courses}
          paginator
          rows={10}
          dataKey="id"
          emptyMessage="No courses found."
          className="p-datatable-sm"
        >
          <Column
            field="code"
            header="Course Code"
            sortable
            style={{ minWidth: '120px' }}
          ></Column>
          <Column
            field="name"
            header="Course Name"
            sortable
            style={{ minWidth: '250px' }}
          ></Column>
          <Column
            field="program"
            header="Program"
            sortable
            style={{ minWidth: '150px' }}
          ></Column>
          <Column field="type" header="Type" sortable></Column>
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
        header={editingCourse?.id ? 'Edit Course' : 'New Course'}
        modal
        className="p-fluid"
        onHide={hideDialog}
      >
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="field">
            <label htmlFor="code" className="font-semibold mb-1 block">
              Course Code *
            </label>
            <InputText
              id="code"
              value={editingCourse?.code || ''}
              onChange={e =>
                setEditingCourse({ ...editingCourse, code: e.target.value })
              }
              required
              autoFocus
            />
          </div>
          <div className="field">
            <label htmlFor="name" className="font-semibold mb-1 block">
              Course Name *
            </label>
            <InputText
              id="name"
              value={editingCourse?.name || ''}
              onChange={e =>
                setEditingCourse({ ...editingCourse, name: e.target.value })
              }
              required
            />
          </div>

          <div className="field col-span-2">
            <label htmlFor="program" className="font-semibold mb-1 block">
              Program *
            </label>
            <Dropdown
              id="program"
              value={editingCourse?.program || null}
              options={mockPrograms}
              onChange={e =>
                setEditingCourse({ ...editingCourse, program: e.value })
              }
              placeholder="Select Program"
            />
          </div>

          <div className="field">
            <label htmlFor="type" className="font-semibold mb-1 block">
              Type
            </label>
            <Dropdown
              id="type"
              value={editingCourse?.type || 'Full-Time'}
              options={['Full-Time', 'Part-Time', 'Distance']}
              onChange={e =>
                setEditingCourse({ ...editingCourse, type: e.value })
              }
            />
          </div>

          <div className="field">
            <label htmlFor="status" className="font-semibold mb-1 block">
              Status
            </label>
            <Dropdown
              id="status"
              value={editingCourse?.status || 'Active'}
              options={['Active', 'Inactive']}
              onChange={e =>
                setEditingCourse({ ...editingCourse, status: e.value })
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
          <Button label="Save" icon="pi pi-check" onClick={saveCourse} />
        </div>
      </Dialog>
    </FormPage>
  );
}
