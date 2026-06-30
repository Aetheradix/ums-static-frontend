import { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
  Tabs,
} from 'shared/new-components';
import { tpUrls } from '../../urls';
import { Toast } from 'primereact/toast';
import { useLocalStorage } from 'shared/hooks/useLocalStorage';
import type { TabViewTabChangeEvent } from 'primereact/tabview';

export default function CompanySeasonList() {
  const location = useLocation();
  const isAdmin = location.pathname.includes('/admin/');
  const toast = useRef<Toast>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const [enrolledSeasons, setEnrolledSeasons] = useLocalStorage<any[]>(
    'tp_company_enrolled_seasons',
    [
      {
        id: 'S-001',
        code: 'PL2025-JUN',
        name: 'Placement 2025 (June Graduating)',
        enrollmentDate: '2024-05-15',
        feeStatus: 'Paid',
        status: 'Active',
      },
      {
        id: 'S-002',
        code: 'INT2024-SUM',
        name: 'Summer Internship 2024',
        enrollmentDate: '2024-02-10',
        feeStatus: 'Paid',
        status: 'Completed',
      },
    ]
  );

  const [availableSeasons, setAvailableSeasons] = useLocalStorage<any[]>(
    'tp_company_available_seasons',
    [
      {
        id: 'S-003',
        code: 'PL2026-JUN',
        name: 'Placement 2026 (Upcoming)',
        fee: '₹5,000',
        status: 'Registration Open',
      },
    ]
  );

  const handleApply = (id: string) => {
    const seasonToApply = availableSeasons.find(s => s.id === id);
    if (!seasonToApply) return;

    // Move from available to enrolled
    const newEnrolled = {
      ...seasonToApply,
      enrollmentDate: new Date().toISOString().split('T')[0],
      feeStatus: 'Pending',
      status: 'Registered',
    };

    setEnrolledSeasons([newEnrolled, ...enrolledSeasons]);
    setAvailableSeasons(availableSeasons.filter(s => s.id !== id));

    toast.current?.show({
      severity: 'success',
      summary: 'Success',
      detail: `Successfully registered for ${seasonToApply.name}`,
      life: 3000,
    });

    // Switch to enrolled tab
    setActiveIndex(0);
  };

  const enrolledContent = (
    <GridPanel
      data={enrolledSeasons}
      dataKey="id"
      emptyMessage={
        <div className="flex flex-col items-center justify-center p-8 text-gray-500">
          <i className="pi pi-calendar-times text-4xl mb-4 text-gray-300" />
          <p>Not enrolled in any seasons.</p>
          <p className="text-sm mt-1">
            Check the Available Seasons tab to register.
          </p>
        </div>
      }
      pagination
      columns={
        [
          { field: 'code', header: 'Season Code' },
          { field: 'name', header: 'Season Name' },
          { field: 'enrollmentDate', header: 'Enrolled On' },
          {
            field: 'feeStatus',
            header: 'Fee Status',
            body: (row: any) => (
              <StatusBadge
                label={row.feeStatus}
                variant={
                  row.feeStatus === 'Paid'
                    ? 'approved'
                    : row.feeStatus === 'Pending'
                      ? 'pending'
                      : 'rejected'
                }
              />
            ),
          },
          {
            field: 'status',
            header: 'Season Status',
            body: (row: any) => (
              <StatusBadge
                label={row.status}
                variant={row.status === 'Active' ? 'approved' : 'neutral'}
              />
            ),
          },
          {
            field: 'actions',
            header: 'Actions',
            body: () => (
              <button
                className="text-blue-600 hover:text-blue-800"
                title="View Details"
              >
                <i className="pi pi-eye" />
              </button>
            ),
          },
        ] as never[]
      }
    />
  );

  const availableContent = (
    <GridPanel
      data={availableSeasons}
      dataKey="id"
      emptyMessage={
        <div className="flex flex-col items-center justify-center p-8 text-gray-500">
          <i className="pi pi-inbox text-4xl mb-4 text-gray-300" />
          <p>No new seasons available.</p>
          <p className="text-sm mt-1">
            You are already enrolled in all active placement seasons.
          </p>
        </div>
      }
      columns={
        [
          { field: 'code', header: 'Season Code' },
          { field: 'name', header: 'Season Name' },
          { field: 'fee', header: 'Company Fee' },
          {
            field: 'status',
            header: 'Status',
            body: (row: any) => (
              <StatusBadge label={row.status} variant="pending" />
            ),
          },
          {
            field: 'actions',
            header: 'Actions',
            body: (row: any) => (
              <button
                onClick={() => handleApply(row.id)}
                className="rounded-md bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
              >
                Apply Now
              </button>
            ),
          },
        ] as never[]
      }
    />
  );

  return (
    <FormPage
      title={isAdmin ? 'Company Enrollments' : 'My Seasons'}
      description="Manage placement and internship seasons participation."
      breadcrumbs={[
        { label: 'Training & Placement', to: tpUrls.root },
        {
          label: isAdmin ? 'Admin Portal' : 'Company Portal',
          to: isAdmin ? tpUrls.admin.portal : tpUrls.company.portal,
        },
        { label: 'Seasons' },
      ]}
      headerAction={
        isAdmin && (
          <button
            onClick={() => alert('Manually add company to a season')}
            className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none"
          >
            <i className="pi pi-plus mr-2" />
            Add Company to Season
          </button>
        )
      }
    >
      <Toast ref={toast} />
      <FormCard>
        <Tabs
          activeIndex={activeIndex}
          onTabChange={(e: TabViewTabChangeEvent) => setActiveIndex(e.index)}
          tabs={[
            { title: 'Enrolled Seasons', content: enrolledContent },
            { title: 'Available Seasons', content: availableContent },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
