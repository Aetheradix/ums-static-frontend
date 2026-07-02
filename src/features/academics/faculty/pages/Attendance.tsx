import { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { FormPage, FormCard, StatusBadge } from 'shared/new-components';

interface StudentAttendanceEntry {
  id: string;
  studentId: string;
  studentName: string;
  isPresent: boolean;
  remarks?: string;
}

const mockStudents: StudentAttendanceEntry[] = [
  {
    id: 'SAE-01',
    studentId: 'STU2023001',
    studentName: 'John Doe',
    isPresent: true,
  },
  {
    id: 'SAE-02',
    studentId: 'STU2023002',
    studentName: 'Jane Smith',
    isPresent: true,
  },
  {
    id: 'SAE-03',
    studentId: 'STU2023003',
    studentName: 'Alice Johnson',
    isPresent: false,
  },
  {
    id: 'SAE-04',
    studentId: 'STU2023004',
    studentName: 'Bob Williams',
    isPresent: true,
  },
];

export default function FacultyAttendance() {
  const [students, setStudents] =
    useState<StudentAttendanceEntry[]>(mockStudents);
  const [selectedSubject, setSelectedSubject] = useState<string>('CS-301');
  const [date, setDate] = useState<Date | null>(new Date());
  const toast = useRef<Toast>(null);

  const handleToggle = (id: string, value: boolean) => {
    setStudents(
      students.map(s => (s.id === id ? { ...s, isPresent: value } : s))
    );
  };

  const markAll = (status: boolean) => {
    setStudents(students.map(s => ({ ...s, isPresent: status })));
  };

  const submitAttendance = () => {
    toast.current?.show({
      severity: 'success',
      summary: 'Success',
      detail: 'Attendance submitted for the session',
      life: 3000,
    });
  };

  const attendanceToggleTemplate = (rowData: StudentAttendanceEntry) => {
    return (
      <div className="flex items-center justify-center gap-3">
        <span
          className={
            rowData.isPresent ? 'text-gray-400' : 'text-red-600 font-bold'
          }
        >
          Absent
        </span>
        <InputSwitch
          checked={rowData.isPresent}
          onChange={e => handleToggle(rowData.id, e.value)}
        />
        <span
          className={
            rowData.isPresent ? 'text-green-600 font-bold' : 'text-gray-400'
          }
        >
          Present
        </span>
      </div>
    );
  };

  const statusTemplate = (rowData: StudentAttendanceEntry) => {
    return (
      <StatusBadge
        label={rowData.isPresent ? 'Present' : 'Absent'}
        variant={rowData.isPresent ? 'approved' : 'rejected'}
      />
    );
  };

  const header = (
    <div className="flex justify-between items-center bg-gray-50 p-4 border-b border-gray-200">
      <div className="flex gap-4">
        <Button
          label="Mark All Present"
          icon="pi pi-check"
          severity="success"
          outlined
          size="small"
          onClick={() => markAll(true)}
        />
        <Button
          label="Mark All Absent"
          icon="pi pi-times"
          severity="danger"
          outlined
          size="small"
          onClick={() => markAll(false)}
        />
      </div>
      <Button
        label="Submit Attendance"
        icon="pi pi-save"
        severity="info"
        onClick={submitAttendance}
      />
    </div>
  );

  return (
    <FormPage
      title="Attendance Entry"
      description="Mark daily or session-wise student attendance"
    >
      <Toast ref={toast} />

      <FormCard className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">
              Select Subject/Batch:
            </label>
            <Dropdown
              value={selectedSubject}
              options={[
                { label: 'CS-301: Advanced Algorithms (L)', value: 'CS-301' },
                { label: 'CS-301P: Algorithms Lab (B1)', value: 'CS-301P' },
              ]}
              onChange={e => setSelectedSubject(e.value)}
              placeholder="Select Subject"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">
              Date of Session:
            </label>
            <Calendar
              value={date}
              onChange={e => setDate(e.value ?? null)}
              showIcon
              maxDate={new Date()}
            />
          </div>
          <div className="flex flex-col gap-2 justify-end">
            <div className="flex justify-between p-3 bg-blue-50 rounded border border-blue-100">
              <div className="text-center">
                <div className="text-xs text-blue-600 font-bold uppercase mb-1">
                  Present
                </div>
                <div className="text-xl font-black text-blue-800">
                  {students.filter(s => s.isPresent).length}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-red-600 font-bold uppercase mb-1">
                  Absent
                </div>
                <div className="text-xl font-black text-red-800">
                  {students.filter(s => !s.isPresent).length}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600 font-bold uppercase mb-1">
                  Total
                </div>
                <div className="text-xl font-black text-gray-800">
                  {students.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </FormCard>

      <FormCard className="p-0 overflow-hidden">
        <DataTable
          value={students}
          header={header}
          emptyMessage="No students found."
          responsiveLayout="scroll"
          stripedRows
          showGridlines
        >
          <Column
            field="studentId"
            header="Student ID"
            style={{ width: '20%' }}
          ></Column>
          <Column
            field="studentName"
            header="Student Name"
            style={{ width: '30%' }}
          ></Column>
          <Column
            header="Mark Attendance"
            body={attendanceToggleTemplate}
            style={{ width: '30%', textAlign: 'center' }}
          ></Column>
          <Column
            field="status"
            header="Status"
            body={statusTemplate}
            style={{ width: '20%', textAlign: 'center' }}
          ></Column>
        </DataTable>
      </FormCard>
    </FormPage>
  );
}
