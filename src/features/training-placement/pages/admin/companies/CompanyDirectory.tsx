import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormCard, FormPage, GridPanel, Tabs } from 'shared/new-components';
import { tpUrls } from '../../../urls';
import { Toast } from 'primereact/toast';
import type { TabViewTabChangeEvent } from 'primereact/tabview';

export default function CompanyDirectory() {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [search, setSearch] = useState('');

  const mockCompanies = [
    {
      id: 'COMP-001',
      name: 'Infosys Technologies Ltd',
      hrEmail: 'hr@infosys.com',
      website: 'infosys.com',
      status: 'Active',
      verification: 'Approved',
    },
    {
      id: 'COMP-002',
      name: 'Tech Mahindra',
      hrEmail: 'careers@techmahindra.com',
      website: 'techmahindra.com',
      status: 'Active',
      verification: 'Approved',
    },
  ];

  const mockPending = [
    {
      id: 'COMP-003',
      name: 'Startup XYZ',
      hrEmail: 'founder@startupxyz.com',
      website: 'startupxyz.com',
      status: 'Profile Pending',
      verification: 'Pending',
    },
  ];

  const filteredCompanies = mockCompanies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleBulkApprove = () => {
    toast.current?.show({
      severity: 'success',
      summary: 'Approved',
      detail: 'Selected companies have been approved.',
      life: 3000,
    });
  };

  const handleImport = () => {
    toast.current?.show({
      severity: 'info',
      summary: 'Import Started',
      detail: 'Processing file import...',
      life: 3000,
    });
  };

  const allContent = (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <div className="relative w-full sm:w-64">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            <i className="pi pi-search" />
          </span>
          <input
            type="text"
            placeholder="Search companies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-md border border-gray-300 py-1.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => navigate(tpUrls.admin.companyAdd)}
          className="flex items-center gap-2 whitespace-nowrap rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <i className="pi pi-plus" />
          Add Company
        </button>
      </div>
      <GridPanel
        data={filteredCompanies}
        dataKey="id"
        emptyMessage="No companies found."
        pagination
        onEdit={(row: any) => navigate(tpUrls.admin.companyEdit(row.id))}
        columns={
          [
            { field: 'name', header: 'Company Name' },
            { field: 'hrEmail', header: 'HR Email' },
            { field: 'website', header: 'Website' },
            { field: 'status', header: 'Profile Status' },
          ] as never[]
        }
      />
    </div>
  );

  const verificationContent = (
    <div>
      <div className="mb-4">
        <button
          onClick={handleBulkApprove}
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          Bulk Approve Selected
        </button>
      </div>
      <GridPanel
        data={mockPending}
        dataKey="id"
        emptyMessage={
          <div className="flex flex-col items-center justify-center p-8 text-gray-500">
            <i className="pi pi-check-circle text-4xl mb-4 text-gray-300" />
            <p>No pending verifications.</p>
            <p className="text-sm mt-1">
              All company profiles have been reviewed.
            </p>
          </div>
        }
        columns={
          [
            { field: 'name', header: 'Company Name' },
            { field: 'hrEmail', header: 'HR Email' },
            { field: 'website', header: 'Website' },
            { field: 'verification', header: 'Status' },
            {
              field: 'actions',
              header: 'Actions',
              body: (row: any) => (
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      toast.current?.show({
                        severity: 'success',
                        summary: 'Approved',
                        detail: `${row.name} has been approved.`,
                        life: 3000,
                      })
                    }
                    className="text-green-600 hover:text-green-800 p-1"
                    title="Approve"
                  >
                    <i className="pi pi-check" />
                  </button>
                  <button
                    onClick={() => navigate(tpUrls.admin.companyView(row.id))}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Review"
                  >
                    <i className="pi pi-eye" />
                  </button>
                </div>
              ),
            },
          ] as never[]
        }
      />
    </div>
  );

  const importContent = (
    <div className="p-8 text-center border-2 border-dashed border-gray-300 rounded-lg">
      <i className="pi pi-cloud-upload text-4xl text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900">Import Companies</h3>
      <p className="text-sm text-gray-500 mt-1">
        Upload an Excel file to bulk import companies.
      </p>
      <button
        onClick={handleImport}
        className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Select File
      </button>
    </div>
  );

  return (
    <FormPage
      title="Company Directory"
      description="Manage all recruiting companies, verification requests, and bulk imports."
      breadcrumbs={[
        { label: 'Training & Placement', to: tpUrls.root },
        { label: 'Admin Portal', to: tpUrls.admin.portal },
        { label: 'Companies' },
      ]}
    >
      <Toast ref={toast} />
      <FormCard>
        <Tabs
          activeIndex={activeIndex}
          onTabChange={(e: TabViewTabChangeEvent) => setActiveIndex(e.index)}
          tabs={[
            { title: 'All Companies', content: allContent },
            {
              title: 'Verification Requests (1)',
              content: verificationContent,
            },
            { title: 'Import', content: importContent },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
