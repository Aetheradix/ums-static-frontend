import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { FormPage, FormCard, StatusBadge } from 'shared/new-components';

interface AcademicSession {
  id: string;
  sessionCode: string; // e.g., 2026-ODD
  sessionType: 'Odd' | 'Even' | 'Summer';
  academicYear: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Completed' | 'Upcoming';
}

const mockSessions: AcademicSession[] = [
  {
    id: 'SESS-01',
    sessionCode: '2026-ODD',
    sessionType: 'Odd',
    academicYear: '2026-2027',
    startDate: '2026-07-15',
    endDate: '2026-12-15',
    status: 'Active',
  },
  {
    id: 'SESS-02',
    sessionCode: '2027-EVEN',
    sessionType: 'Even',
    academicYear: '2026-2027',
    startDate: '2027-01-15',
    endDate: '2027-05-15',
    status: 'Upcoming',
  },
  {
    id: 'SESS-00',
    sessionCode: '2025-EVEN',
    sessionType: 'Even',
    academicYear: '2025-2026',
    startDate: '2026-01-15',
    endDate: '2026-05-15',
    status: 'Completed',
  },
];

export default function AcademicSession() {
  const [sessions, setSessions] = useState<AcademicSession[]>(mockSessions);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState<
    Partial<AcademicSession>
  >({});
  const [globalFilter, setGlobalFilter] = useState('');

  const statusTemplate = (rowData: AcademicSession) => {
    return (
      <StatusBadge
        label={rowData.status}
        variant={
          rowData.status === 'Active'
            ? 'approved'
            : rowData.status === 'Completed'
              ? 'neutral'
              : 'pending'
        }
      />
    );
  };

  const actionTemplate = (rowData: AcademicSession) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        rounded
        text
        severity="info"
        aria-label="Edit"
        onClick={() => {
          setSelectedSession({ ...rowData });
          setShowDialog(true);
        }}
      />
    </div>
  );

  const handleSave = () => {
    if (selectedSession.id) {
      setSessions(
        sessions.map(s =>
          s.id === selectedSession.id
            ? ({ ...s, ...selectedSession } as AcademicSession)
            : s
        )
      );
    } else {
      const newSession: AcademicSession = {
        ...(selectedSession as AcademicSession),
        id: `SESS-0${Math.floor(Math.random() * 10) + 3}`,
        status: selectedSession.status || 'Upcoming',
      };
      setSessions([newSession, ...sessions]);
    }
    setShowDialog(false);
    setSelectedSession({});
  };

  const header = (
    <div className="flex justify-between items-center">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          placeholder="Search sessions..."
          onChange={e => setGlobalFilter(e.target.value)}
        />
      </span>
      <Button
        label="New Session"
        icon="pi pi-plus"
        onClick={() => {
          setSelectedSession({});
          setShowDialog(true);
        }}
      />
    </div>
  );

  return (
    <FormPage
      title="Academic Session Setup"
      description="Manage academic terms, semesters, and sessions"
    >
      <FormCard>
        <DataTable
          value={sessions}
          paginator
          rows={10}
          header={header}
          globalFilter={globalFilter}
          emptyMessage="No academic sessions found."
        >
          <Column field="sessionCode" header="Session Code" sortable></Column>
          <Column field="academicYear" header="Academic Year" sortable></Column>
          <Column field="sessionType" header="Term" sortable></Column>
          <Column field="startDate" header="Start Date" sortable></Column>
          <Column field="endDate" header="End Date" sortable></Column>
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
            style={{ minWidth: '8rem' }}
          ></Column>
        </DataTable>
      </FormCard>

      <Dialog
        visible={showDialog}
        style={{ width: '550px' }}
        header={selectedSession.id ? 'Edit Session' : 'New Session'}
        modal
        onHide={() => setShowDialog(false)}
      >
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="sessionCode" className="font-semibold">
                Session Code
              </label>
              <InputText
                id="sessionCode"
                value={selectedSession.sessionCode || ''}
                onChange={e =>
                  setSelectedSession({
                    ...selectedSession,
                    sessionCode: e.target.value,
                  })
                }
                placeholder="e.g. 2026-ODD"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="academicYear" className="font-semibold">
                Academic Year
              </label>
              <InputText
                id="academicYear"
                value={selectedSession.academicYear || ''}
                onChange={e =>
                  setSelectedSession({
                    ...selectedSession,
                    academicYear: e.target.value,
                  })
                }
                placeholder="e.g. 2026-2027"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="sessionType" className="font-semibold">
              Term / Type
            </label>
            <Dropdown
              id="sessionType"
              value={selectedSession.sessionType}
              options={[
                { label: 'Odd Semester', value: 'Odd' },
                { label: 'Even Semester', value: 'Even' },
                { label: 'Summer Term', value: 'Summer' },
              ]}
              onChange={e =>
                setSelectedSession({ ...selectedSession, sessionType: e.value })
              }
              placeholder="Select Term"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="startDate" className="font-semibold">
                Start Date
              </label>
              <Calendar
                id="startDate"
                value={
                  selectedSession.startDate
                    ? new Date(selectedSession.startDate)
                    : null
                }
                onChange={e =>
                  setSelectedSession({
                    ...selectedSession,
                    startDate: e.value?.toISOString().split('T')[0],
                  })
                }
                dateFormat="yy-mm-dd"
                placeholder="Select start date"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="endDate" className="font-semibold">
                End Date
              </label>
              <Calendar
                id="endDate"
                value={
                  selectedSession.endDate
                    ? new Date(selectedSession.endDate)
                    : null
                }
                onChange={e =>
                  setSelectedSession({
                    ...selectedSession,
                    endDate: e.value?.toISOString().split('T')[0],
                  })
                }
                dateFormat="yy-mm-dd"
                placeholder="Select end date"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="status" className="font-semibold">
              Status
            </label>
            <Dropdown
              id="status"
              value={selectedSession.status}
              options={[
                { label: 'Active', value: 'Active' },
                { label: 'Upcoming', value: 'Upcoming' },
                { label: 'Completed', value: 'Completed' },
              ]}
              onChange={e =>
                setSelectedSession({ ...selectedSession, status: e.value })
              }
              placeholder="Select Status"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button
            label="Cancel"
            icon="pi pi-times"
            outlined
            onClick={() => setShowDialog(false)}
          />
          <Button label="Save" icon="pi pi-check" onClick={handleSave} />
        </div>
      </Dialog>
    </FormPage>
  );
}
