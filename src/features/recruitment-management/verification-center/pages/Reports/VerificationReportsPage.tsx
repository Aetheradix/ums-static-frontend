import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DatePicker, DropDownList } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';

export default function VerificationReportsPage() {
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterDateFrom, setFilterDateFrom] = useState<Date | null>(null);
  const [filterDateTo, setFilterDateTo] = useState<Date | null>(null);

  const [hasSearched, setHasSearched] = useState(false);
  const [appliedStatus, setAppliedStatus] = useState<string | null>(null);

  const statusOptions = [
    { id: 'Pending', name: 'Pending' },
    { id: 'Verified', name: 'Verified' },
    { id: 'Rejected', name: 'Rejected' },
  ];

  const handleSearch = () => {
    setAppliedStatus(filterStatus);
    setHasSearched(true);
  };

  const handleReset = () => {
    setFilterStatus(null);
    setFilterDateFrom(null);
    setFilterDateTo(null);
    setAppliedStatus(null);
    setHasSearched(false);
  };

  const mockData = [
    {
      applicationNo: 'APP2025001',
      name: 'John Doe',
      post: 'Lab Assistant',
      status: 'Verified',
      date: '2025-10-12',
    },
    {
      applicationNo: 'APP2025002',
      name: 'Jane Smith',
      post: 'Technician',
      status: 'Pending',
      date: '2025-10-14',
    },
    {
      applicationNo: 'APP2025003',
      name: 'Mike Ross',
      post: 'Assistant',
      status: 'Rejected',
      date: '2025-10-15',
    },
  ];

  const filteredData = mockData.filter(item => {
    if (appliedStatus && item.status !== appliedStatus) return false;
    return true;
  });

  return (
    <FormPage
      title="Verification Reports"
      description="Generate and view candidate document verification reports."
      breadcrumbs={[
        { label: 'Recruitment Management', to: '/recruitment-management' },
        {
          label: 'Verification Center',
          to: '/recruitment-management/verification-center',
        },
        { label: 'Reports' },
      ]}
    >
      <div className="flex flex-col gap-6">
        <FormCard title="Report Filters" icon="filter">
          <FormGrid columns={3}>
            <DropDownList
              label="Verification Status"
              placeholder="Select Status"
              data={statusOptions}
              textField="name"
              valueField="id"
              value={filterStatus}
              onChange={val => setFilterStatus(val as string)}
            />
            <DatePicker
              label="Date From"
              placeholder="Select start date"
              value={filterDateFrom ?? undefined}
              onChange={date => setFilterDateFrom(date ?? null)}
            />
            <DatePicker
              label="Date To"
              placeholder="Select end date"
              value={filterDateTo ?? undefined}
              onChange={date => setFilterDateTo(date ?? null)}
            />
          </FormGrid>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              label="Reset Filters"
              variant="outlined"
              size="small"
              onClick={handleReset}
            />
            <Button
              label="Search"
              variant="primary"
              size="small"
              onClick={handleSearch}
              icon="search"
            />
          </div>
        </FormCard>

        {hasSearched && (
          <FormCard title="Verification Data" icon="table">
            <GridPanel
              data={filteredData}
              columns={[
                {
                  cell: (_, option) => <span>{option.rowIndex + 1}</span>,
                  width: '40px',
                },
                { field: 'applicationNo', header: 'Application No' },
                { field: 'name', header: 'Candidate Name' },
                { field: 'post', header: 'Post' },
                { field: 'date', header: 'Verification Date' },
                {
                  field: 'status',
                  header: 'Status',
                  cell: (item: any) => (
                    <StatusBadge
                      variant={
                        item.status === 'Verified'
                          ? 'approved'
                          : item.status === 'Rejected'
                            ? 'rejected'
                            : 'pending'
                      }
                      label={item.status}
                    />
                  ),
                },
              ]}
              searchBox
              searchPlaceholder="Search candidates..."
            />
          </FormCard>
        )}
      </div>
    </FormPage>
  );
}
