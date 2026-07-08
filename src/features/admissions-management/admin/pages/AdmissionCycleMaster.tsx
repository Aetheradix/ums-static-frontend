import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { FormPage, FormCard } from 'shared/new-components';
import { ToastService } from 'services';
import { Modal } from 'shared/components/popups';
import { TextBox, DropDownList, DatePicker } from 'shared/components/forms';

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
        <TextBox
          placeholder="Search cycles..."
          className="w-full md:w-80"
          onChange={v => setGlobalFilter(v as string)}
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

      <Modal
        visible={showDialog}
        size="medium"
        header={selectedCycle.id ? 'Edit Admission Cycle' : 'Create New Cycle'}
        onHide={() => setShowDialog(false)}
      >
        <div className="p-4 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <TextBox
                label="Cycle Name *"
                value={selectedCycle.name || ''}
                onChange={v =>
                  setSelectedCycle({ ...selectedCycle, name: v as string })
                }
                placeholder="e.g. Fall 2026 Admissions"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <TextBox
                label="Academic Year"
                value={selectedCycle.academicYear || ''}
                onChange={v =>
                  setSelectedCycle({
                    ...selectedCycle,
                    academicYear: v as string,
                  })
                }
                placeholder="e.g. 2026-2027"
              />
            </div>

            <div className="col-span-1">
              <DatePicker
                label="Start Date"
                value={
                  selectedCycle.startDate
                    ? new Date(selectedCycle.startDate)
                    : undefined
                }
                onChange={v =>
                  setSelectedCycle({
                    ...selectedCycle,
                    startDate: v?.toISOString().split('T')[0],
                  })
                }
                placeholder="Select start date"
              />
            </div>

            <div className="col-span-1">
              <DatePicker
                label="End Date"
                value={
                  selectedCycle.endDate
                    ? new Date(selectedCycle.endDate)
                    : undefined
                }
                onChange={v =>
                  setSelectedCycle({
                    ...selectedCycle,
                    endDate: v?.toISOString().split('T')[0],
                  })
                }
                placeholder="Select end date"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <DropDownList
                label="Status"
                value={selectedCycle.status}
                data={[
                  { label: 'Active', value: 'Active' },
                  { label: 'Upcoming', value: 'Upcoming' },
                  { label: 'Closed', value: 'Closed' },
                ]}
                textField="label"
                valueField="value"
                onChange={(v: any) =>
                  setSelectedCycle({ ...selectedCycle, status: v })
                }
                defaultOptionText="Select Current Status"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-2">
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
        </div>
      </Modal>
    </FormPage>
  );
}
