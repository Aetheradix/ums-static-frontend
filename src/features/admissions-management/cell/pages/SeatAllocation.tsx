import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { FormPage, FormCard } from 'shared/new-components';
import { admissionsUrls } from '../../urls';
import { ToastService } from 'services';

interface AllocationRecord {
  id: string;
  applicationNo: string;
  name: string;
  program: string;
  category: string;
  rank: number;
  status: 'Offer Pending' | 'Offer Sent' | 'Accepted' | 'Fee Paid' | 'Declined';
}

const mockPrograms = [
  { label: 'B.Tech CSE', value: 'B.Tech CSE' },
  { label: 'MBA Finance', value: 'MBA Finance' },
];

const mockAllocations: AllocationRecord[] = [
  {
    id: '1',
    applicationNo: 'APP-2024-045',
    name: 'Alice Smith',
    program: 'B.Tech CSE',
    category: 'GEN',
    rank: 1,
    status: 'Fee Paid',
  },
  {
    id: '2',
    applicationNo: 'APP-2024-102',
    name: 'Bob Johnson',
    program: 'B.Tech CSE',
    category: 'OBC',
    rank: 2,
    status: 'Accepted',
  },
  {
    id: '3',
    applicationNo: 'APP-2024-012',
    name: 'Charlie Brown',
    program: 'B.Tech CSE',
    category: 'SC',
    rank: 3,
    status: 'Offer Sent',
  },
  {
    id: '4',
    applicationNo: 'APP-2024-088',
    name: 'Diana Prince',
    program: 'B.Tech CSE',
    category: 'GEN',
    rank: 4,
    status: 'Offer Pending',
  },
  {
    id: '5',
    applicationNo: 'APP-2024-091',
    name: 'Evan Wright',
    program: 'B.Tech CSE',
    category: 'ST',
    rank: 5,
    status: 'Declined',
  },
];

export default function SeatAllocation() {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(
    'B.Tech CSE'
  );
  const [allocations, setAllocations] =
    useState<AllocationRecord[]>(mockAllocations);
  const [sendingAll, setSendingAll] = useState(false);

  const getSeverity = (status: string) => {
    switch (status) {
      case 'Fee Paid':
        return 'success';
      case 'Accepted':
        return 'info';
      case 'Offer Sent':
        return 'warning';
      case 'Declined':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const handleSendOffer = (id: string) => {
    setAllocations(
      allocations.map(a => (a.id === id ? { ...a, status: 'Offer Sent' } : a))
    );
    ToastService.success('Admission offer sent successfully.');
  };

  const handleSendAllOffers = () => {
    setSendingAll(true);
    setTimeout(() => {
      setAllocations(
        allocations.map(a =>
          a.status === 'Offer Pending' ? { ...a, status: 'Offer Sent' } : a
        )
      );
      setSendingAll(false);
      ToastService.success('All pending admission offers have been sent.');
    }, 1500);
  };

  const actionBodyTemplate = (rowData: AllocationRecord) => {
    return (
      <div className="flex gap-2">
        {rowData.status === 'Offer Pending' && (
          <Button
            label="Send Offer"
            icon="pi pi-send"
            size="small"
            text
            severity="info"
            onClick={() => handleSendOffer(rowData.id)}
          />
        )}
        {rowData.status === 'Fee Paid' && (
          <Button
            label="View Receipt"
            icon="pi pi-file-pdf"
            size="small"
            text
            severity="success"
          />
        )}
        {rowData.status !== 'Fee Paid' &&
          rowData.status !== 'Offer Pending' && (
            <Button
              icon="pi pi-ellipsis-v"
              size="small"
              rounded
              text
              aria-label="Options"
            />
          )}
      </div>
    );
  };

  const pendingOffersCount = allocations.filter(
    a => a.status === 'Offer Pending'
  ).length;

  return (
    <FormPage
      title="Seat Allocation & Offers"
      description="Manage seat allocations, send admission offers, and track acceptance status."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Admissions', to: admissionsUrls.root },
        { label: 'Admission Cell', to: admissionsUrls.cell.dashboard },
        { label: 'Seat Allocation' },
      ]}
    >
      <FormCard>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 border-b pb-4 border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center gap-3 w-full md:w-auto">
            <label
              htmlFor="program"
              className="font-bold text-gray-700 whitespace-nowrap"
            >
              Filter by Program:
            </label>
            <Dropdown
              id="program"
              value={selectedProgram}
              options={mockPrograms}
              onChange={e => setSelectedProgram(e.value)}
              placeholder="Select a Program"
              className="w-full md:w-64"
            />
          </div>

          <Button
            label={
              sendingAll
                ? 'Sending...'
                : `Send All Pending Offers (${pendingOffersCount})`
            }
            icon={sendingAll ? 'pi pi-spin pi-spinner' : 'pi pi-envelope'}
            onClick={handleSendAllOffers}
            disabled={pendingOffersCount === 0 || sendingAll}
            severity="help"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex flex-col items-center justify-center shadow-sm">
            <span className="text-3xl font-bold text-blue-700">
              {allocations.length}
            </span>
            <span className="text-sm text-blue-600 font-medium mt-1">
              Total Allocated
            </span>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-100 flex flex-col items-center justify-center shadow-sm">
            <span className="text-3xl font-bold text-orange-700">
              {allocations.filter(a => a.status === 'Offer Sent').length}
            </span>
            <span className="text-sm text-orange-600 font-medium mt-1">
              Offers Sent
            </span>
          </div>
          <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-100 flex flex-col items-center justify-center shadow-sm">
            <span className="text-3xl font-bold text-cyan-700">
              {allocations.filter(a => a.status === 'Accepted').length}
            </span>
            <span className="text-sm text-cyan-600 font-medium mt-1">
              Offers Accepted
            </span>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-100 flex flex-col items-center justify-center shadow-sm">
            <span className="text-3xl font-bold text-green-700">
              {allocations.filter(a => a.status === 'Fee Paid').length}
            </span>
            <span className="text-sm text-green-600 font-medium mt-1">
              Fee Paid (Confirmed)
            </span>
          </div>
        </div>

        <DataTable
          value={allocations}
          paginator
          rows={10}
          dataKey="id"
          className="p-datatable-sm"
          emptyMessage="No allocations found."
          stripedRows
          rowHover
        >
          <Column
            field="rank"
            header="Rank"
            sortable
            style={{ width: '80px' }}
            className="font-bold text-gray-700"
          ></Column>
          <Column
            field="applicationNo"
            header="App No."
            style={{ minWidth: '120px' }}
          ></Column>
          <Column field="name" header="Applicant Name" sortable></Column>
          <Column
            field="category"
            header="Category"
            body={r => <Tag value={r.category} severity="info" />}
          ></Column>
          <Column
            field="status"
            header="Status"
            body={r => (
              <Tag value={r.status} severity={getSeverity(r.status)} />
            )}
            sortable
          ></Column>
          <Column
            body={actionBodyTemplate}
            header="Action"
            style={{ minWidth: '150px' }}
          ></Column>
        </DataTable>
      </FormCard>
    </FormPage>
  );
}
