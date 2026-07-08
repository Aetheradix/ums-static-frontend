import { useState } from 'react';
import {
  FormPage,
  FormCard,
  StatusBadge,
  GridPanel,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
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

  const statusTemplate = (rowData: AdmissionCycle) => {
    let severity = 'info';
    if (rowData.status === 'Active') severity = 'success';
    if (rowData.status === 'Closed') severity = 'danger';
    if (rowData.status === 'Upcoming') severity = 'warning';

    return <StatusBadge label={rowData.status} variant={severity as any} />;
  };

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

  const toolbar = (
    <Button
      label="New Cycle"
      icon="pi pi-plus"
      onClick={() => {
        setSelectedCycle({});
        setShowDialog(true);
      }}
    />
  );

  return (
    <FormPage
      title="Admission Cycle Master"
      description="Manage academic admission cycles and timelines"
    >
      <FormCard>
        <GridPanel
          data={cycles}
          searchBox={true}
          searchFields={['id', 'name', 'academicYear', 'status']}
          toolbar={toolbar}
          onEdit={(rowData: AdmissionCycle) => {
            setSelectedCycle({ ...rowData });
            setShowDialog(true);
          }}
          onRemove={(rowData: AdmissionCycle) => {
            setCycles(cycles.filter(c => c.id !== rowData.id));
            ToastService.success('Cycle deleted successfully.');
          }}
          columns={[
            { field: 'id', header: 'Cycle ID', sortable: true },
            { field: 'name', header: 'Cycle Name', sortable: true },
            { field: 'academicYear', header: 'Academic Year', sortable: true },
            { field: 'startDate', header: 'Start Date', sortable: true },
            { field: 'endDate', header: 'End Date', sortable: true },
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
              variant="outlined"
              onClick={() => setShowDialog(false)}
            />
            <Button
              label="Save Details"
              icon="pi pi-check"
              variant="primary"
              onClick={handleSave}
            />
          </div>
        </div>
      </Modal>
    </FormPage>
  );
}
