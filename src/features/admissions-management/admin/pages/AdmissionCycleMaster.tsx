import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Tag } from 'primereact/tag';
import { FormPage, FormCard } from 'shared/new-components';
import { ToastService } from 'services';

interface AdmissionCycle {
  id: string;
  name: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Upcoming' | 'Closed';
}

const mockCycles: AdmissionCycle[] = [
  {
    id: 'AC-2026-01',
    name: 'Fall 2026 Admissions',
    academicYear: '2026-2027',
    startDate: '2026-05-01',
    endDate: '2026-08-15',
    status: 'Active',
  },
  {
    id: 'AC-2026-02',
    name: 'Spring 2027 Admissions',
    academicYear: '2026-2027',
    startDate: '2026-11-01',
    endDate: '2027-01-15',
    status: 'Upcoming',
  },
  {
    id: 'AC-2025-01',
    name: 'Fall 2025 Admissions',
    academicYear: '2025-2026',
    startDate: '2025-05-01',
    endDate: '2025-08-15',
    status: 'Closed',
  },
];

export default function AdmissionCycleMaster() {
  const [cycles, setCycles] = useState<AdmissionCycle[]>(mockCycles);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<Partial<AdmissionCycle>>(
    {}
  );
  const [globalFilter, setGlobalFilter] = useState('');

  const statusTemplate = (rowData: AdmissionCycle) => {
    let severity = 'info';
    if (rowData.status === 'Active') severity = 'success';
    if (rowData.status === 'Closed') severity = 'danger';
    if (rowData.status === 'Upcoming') severity = 'warning';

    return <Tag value={rowData.status} severity={severity as any} />;
  };

  const actionTemplate = (rowData: AdmissionCycle) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        rounded
        text
        severity="info"
        aria-label="Edit"
        tooltip="Edit Cycle"
        onClick={() => {
          setSelectedCycle({ ...rowData });
          setShowDialog(true);
        }}
      />
      <Button
        icon="pi pi-trash"
        rounded
        text
        severity="danger"
        aria-label="Delete"
        tooltip="Delete Cycle"
        onClick={() => {
          setCycles(cycles.filter(c => c.id !== rowData.id));
          ToastService.success('Cycle deleted successfully.');
        }}
      />
    </div>
  );

  const handleSave = () => {
    if (selectedCycle.id) {
      setCycles(
        cycles.map(c =>
          c.id === selectedCycle.id
            ? ({ ...c, ...selectedCycle } as AdmissionCycle)
            : c
        )
      );
      ToastService.success('Cycle updated successfully.');
    } else {
      const newCycle: AdmissionCycle = {
        ...(selectedCycle as AdmissionCycle),
        id: `AC-2026-${Math.floor(Math.random() * 100)}`,
        status: selectedCycle.status || 'Upcoming',
      };
      setCycles([newCycle, ...cycles]);
      ToastService.success('Cycle created successfully.');
    }
    setShowDialog(false);
    setSelectedCycle({});
  };

  const header = (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <span className="p-input-icon-left w-full md:w-auto">
        <i className="pi pi-search" />
        <InputText
          type="search"
          placeholder="Search cycles..."
          className="w-full md:w-80"
          onChange={e => setGlobalFilter(e.target.value)}
        />
      </span>
      <Button
        label="New Cycle"
        icon="pi pi-plus"
        onClick={() => {
          setSelectedCycle({});
          setShowDialog(true);
        }}
      />
    </div>
  );

  const dialogFooter = (
    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
      <Button
        label="Cancel"
        icon="pi pi-times"
        text
        severity="secondary"
        onClick={() => setShowDialog(false)}
      />
      <Button
        label="Save Details"
        icon="pi pi-check"
        onClick={handleSave}
        autoFocus
      />
    </div>
  );

  return (
    <FormPage
      title="Admission Cycle Master"
      description="Manage academic admission cycles and timelines"
    >
      <FormCard>
        <DataTable
          value={cycles}
          paginator
          rows={10}
          header={header}
          globalFilter={globalFilter}
          emptyMessage="No admission cycles found."
          stripedRows
          rowHover
          className="p-datatable-sm"
        >
          <Column
            field="id"
            header="Cycle ID"
            sortable
            className="font-semibold text-gray-700"
          ></Column>
          <Column field="name" header="Cycle Name" sortable></Column>
          <Column field="academicYear" header="Academic Year" sortable></Column>
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
        style={{ width: '90vw', maxWidth: '600px' }}
        header={selectedCycle.id ? 'Edit Admission Cycle' : 'Create New Cycle'}
        modal
        className="p-fluid"
        onHide={() => setShowDialog(false)}
        footer={dialogFooter}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
            <label htmlFor="name" className="font-bold text-gray-700">
              Cycle Name <span className="text-red-500">*</span>
            </label>
            <InputText
              id="name"
              value={selectedCycle.name || ''}
              onChange={e =>
                setSelectedCycle({ ...selectedCycle, name: e.target.value })
              }
              placeholder="e.g. Fall 2026 Admissions"
            />
          </div>

          <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
            <label htmlFor="academicYear" className="font-bold text-gray-700">
              Academic Year
            </label>
            <InputText
              id="academicYear"
              value={selectedCycle.academicYear || ''}
              onChange={e =>
                setSelectedCycle({
                  ...selectedCycle,
                  academicYear: e.target.value,
                })
              }
              placeholder="e.g. 2026-2027"
            />
          </div>

          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="startDate" className="font-bold text-gray-700">
              Start Date
            </label>
            <Calendar
              id="startDate"
              value={
                selectedCycle.startDate
                  ? new Date(selectedCycle.startDate)
                  : null
              }
              onChange={e =>
                setSelectedCycle({
                  ...selectedCycle,
                  startDate: e.value?.toISOString().split('T')[0],
                })
              }
              dateFormat="yy-mm-dd"
              placeholder="Select start date"
              showIcon
            />
          </div>

          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="endDate" className="font-bold text-gray-700">
              End Date
            </label>
            <Calendar
              id="endDate"
              value={
                selectedCycle.endDate ? new Date(selectedCycle.endDate) : null
              }
              onChange={e =>
                setSelectedCycle({
                  ...selectedCycle,
                  endDate: e.value?.toISOString().split('T')[0],
                })
              }
              dateFormat="yy-mm-dd"
              placeholder="Select end date"
              showIcon
            />
          </div>

          <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
            <label htmlFor="status" className="font-bold text-gray-700">
              Status
            </label>
            <Dropdown
              id="status"
              value={selectedCycle.status}
              options={[
                { label: 'Active', value: 'Active' },
                { label: 'Upcoming', value: 'Upcoming' },
                { label: 'Closed', value: 'Closed' },
              ]}
              onChange={e =>
                setSelectedCycle({ ...selectedCycle, status: e.value })
              }
              placeholder="Select Current Status"
            />
          </div>
        </div>
      </Dialog>
    </FormPage>
  );
}
