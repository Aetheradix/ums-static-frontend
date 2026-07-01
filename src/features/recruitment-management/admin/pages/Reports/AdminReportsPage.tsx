import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';

export default function AdminReportsPage() {
  const [filterPost, setFilterPost] = useState<string | null>(null);
  const [filterDistrict, setFilterDistrict] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const [hasSearched, setHasSearched] = useState(false);
  const [appliedStatus, setAppliedStatus] = useState<string | null>(null);

  const posts = [
    { id: 'Lab Assistant', name: 'Lab Assistant' },
    { id: 'Technician', name: 'Technician' },
    { id: 'Clerk', name: 'Clerk' },
  ];

  const districts = [
    { id: 'INDORE', name: 'INDORE' },
    { id: 'BHOPAL', name: 'BHOPAL' },
    { id: 'UJJAIN', name: 'UJJAIN' },
  ];

  const statuses = [
    { id: 'Pending', name: 'Pending' },
    { id: 'Allocated', name: 'Allocated' },
    { id: 'Joined', name: 'Joined' },
  ];

  const handleSearch = () => {
    setAppliedStatus(filterStatus);
    setHasSearched(true);
  };

  const handleReset = () => {
    setFilterPost(null);
    setFilterDistrict(null);
    setFilterStatus(null);
    setAppliedStatus(null);
    setHasSearched(false);
  };

  const mockData = [
    {
      applicationNo: 'APP2025001',
      name: 'John Doe',
      post: 'Lab Assistant',
      district: 'INDORE',
      status: 'Joined',
    },
    {
      applicationNo: 'APP2025002',
      name: 'Jane Smith',
      post: 'Technician',
      district: 'BHOPAL',
      status: 'Allocated',
    },
    {
      applicationNo: 'APP2025003',
      name: 'Mike Ross',
      post: 'Clerk',
      district: 'UJJAIN',
      status: 'Pending',
    },
  ];

  const filteredData = mockData.filter(item => {
    if (appliedStatus && item.status !== appliedStatus) return false;
    return true;
  });

  return (
    <FormPage
      title="Recruitment Reports"
      description="Track overall recruitment metrics, candidate status, and allocations."
      breadcrumbs={[
        { label: 'Recruitment Management', to: '/recruitment-management' },
        { label: 'HR / Admin', to: '/recruitment-management/admin' },
        { label: 'Reports' },
      ]}
    >
      <div className="flex flex-col gap-6">
        <FormCard title="Report Filters" icon="filter">
          <FormGrid columns={3}>
            <DropDownList
              label="Select Post"
              placeholder="All Posts"
              data={posts}
              textField="name"
              valueField="id"
              value={filterPost}
              onChange={val => setFilterPost(val as string)}
            />
            <DropDownList
              label="Select District"
              placeholder="All Districts"
              data={districts}
              textField="name"
              valueField="id"
              value={filterDistrict}
              onChange={val => setFilterDistrict(val as string)}
            />
            <DropDownList
              label="Joining Status"
              placeholder="All Statuses"
              data={statuses}
              textField="name"
              valueField="id"
              value={filterStatus}
              onChange={val => setFilterStatus(val as string)}
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
          <FormCard title="Recruitment Data" icon="table">
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
                { field: 'district', header: 'Allocated District' },
                {
                  field: 'status',
                  header: 'Joining Status',
                  cell: (item: any) => (
                    <StatusBadge
                      variant={
                        item.status === 'Joined'
                          ? 'approved'
                          : item.status === 'Allocated'
                            ? 'neutral'
                            : 'pending'
                      }
                      label={item.status}
                    />
                  ),
                },
              ]}
              searchBox
              searchPlaceholder="Search candidates by name or application number..."
            />
          </FormCard>
        )}
      </div>
    </FormPage>
  );
}
