import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  StatCard,
  StatusBadge,
} from 'shared/new-components';
import { EmptyState, OccupancyBar, SectionNote } from '../components/ui';
import { hostelOccupancy, useHms, useHmsRole } from '../context/HmsContext';
import type { Hostel } from '../context/HmsContext';
import { hmsBreadcrumbs } from '../utils/breadcrumbs';
import { hmsUrls } from '../urls';

export default function AdminDashboard() {
  const { data } = useHms();
  const { activePortal } = useHmsRole();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const occupancies = data.hostels.map(h =>
      hostelOccupancy(h, data.rooms, data.allocations)
    );
    const configuredBeds = occupancies.reduce(
      (s, o) => s + o.configuredBeds,
      0
    );
    const allottedBeds = occupancies.reduce((s, o) => s + o.allottedBeds, 0);
    const collected = data.payments
      .filter(p => p.status === 'Paid')
      .reduce((s, p) => s + p.amount, 0);

    return {
      hostels: data.hostels.length,
      configuredBeds,
      allottedBeds,
      availableBeds: Math.max(configuredBeds - allottedBeds, 0),
      pendingApplications: data.applications.filter(a => a.status === 'Pending')
        .length,
      openGrievances: data.grievances.filter(
        g => g.status === 'Open' || g.status === 'In Progress'
      ).length,
      collected,
      pendingDues: data.payments
        .filter(p => p.status === 'Pending')
        .reduce((s, p) => s + p.amount, 0),
    };
  }, [data]);

  const districtName = (id: string) =>
    data.districts.find(d => d.id === id)?.name ?? '—';

  const recentApplications = useMemo(
    () =>
      [...data.applications]
        .sort((a, b) => b.submittedOn.localeCompare(a.submittedOn))
        .slice(0, 5),
    [data.applications]
  );

  return (
    <FormPage
      title="Hostel Admin Dashboard"
      description="Capacity, admissions and collections across every hostel on the system."
      breadcrumbs={hmsBreadcrumbs(activePortal, 'Dashboard')}
      headerAction={
        <Button
          label="Register a Hostel"
          icon="plus"
          variant="primary"
          onClick={() => navigate(hmsUrls.admin.hostelRegistration)}
        />
      }
    >
      <FormGrid columns={4}>
        <StatCard
          title="Hostels"
          value={stats.hostels}
          icon="apartment"
          colorScheme="blue"
          subtitle="Registered on the system"
        />
        <StatCard
          title="Beds Configured"
          value={stats.configuredBeds}
          icon="bed"
          colorScheme="indigo"
          subtitle="Across all room types"
        />
        <StatCard
          title="Beds Allotted"
          value={stats.allottedBeds}
          icon="how_to_reg"
          colorScheme="green"
          subtitle={`${stats.availableBeds} still free`}
        />
        <StatCard
          title="Pending Admissions"
          value={stats.pendingApplications}
          icon="hourglass_top"
          colorScheme="amber"
          subtitle="Awaiting a warden decision"
        />
      </FormGrid>

      <FormGrid columns={3}>
        <StatCard
          title="Fee Collected"
          value={`₹${stats.collected.toLocaleString()}`}
          icon="payments"
          colorScheme="teal"
          subtitle="Hostel, mess and caution money"
        />
        <StatCard
          title="Outstanding Dues"
          value={`₹${stats.pendingDues.toLocaleString()}`}
          icon="schedule"
          colorScheme="orange"
        />
        <StatCard
          title="Open Grievances"
          value={stats.openGrievances}
          icon="flag"
          colorScheme="red"
          subtitle="Across all hostels"
        />
      </FormGrid>

      {stats.configuredBeds === 0 && (
        <SectionNote tone="warning" title="No rooms configured yet">
          Wardens set up their rooms from the Hostel Warden portal. Until then,
          bed figures stay at zero even though hostels are registered.
        </SectionNote>
      )}

      <FormCard
        title="Hostel-wise Occupancy"
        subtitle="Beds configured against beds allotted, hostel by hostel."
        icon="chart-bar"
        headerAction={
          <Button
            label="Seat Monitoring"
            icon="arrow-right"
            variant="outlined"
            size="small"
            onClick={() => navigate(hmsUrls.admin.monitoring)}
          />
        }
      >
        <GridPanel<Hostel>
          data={data.hostels}
          pagination
          emptyMessage="No hostels registered yet."
          columns={[
            {
              field: 'nameEn',
              header: 'Hostel',
              width: 240,
              cell: item => (
                <div className="flex flex-col">
                  <span className="font-semibold">{item.nameEn}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {item.code} · {districtName(item.districtId)}
                  </span>
                </div>
              ),
            },
            {
              field: 'type',
              header: 'Type',
              width: 100,
              cell: item => (
                <StatusBadge
                  label={item.type}
                  variant={item.type === 'Girls' ? 'info' : 'neutral'}
                />
              ),
            },
            {
              field: 'capacity',
              header: 'Occupancy',
              width: 200,
              cell: item => {
                const o = hostelOccupancy(item, data.rooms, data.allocations);
                return (
                  <OccupancyBar
                    allotted={o.allottedBeds}
                    total={o.configuredBeds}
                  />
                );
              },
            },
            {
              header: 'Seats Remaining',
              sortable: false,
              width: 140,
              cell: item => {
                const o = hostelOccupancy(item, data.rooms, data.allocations);
                return (
                  <StatusBadge
                    label={`${o.availableBeds} free`}
                    variant={
                      o.availableBeds === 0
                        ? 'danger'
                        : o.availableBeds <= 3
                          ? 'warning'
                          : 'success'
                    }
                  />
                );
              },
            },
            {
              field: 'wardenName',
              header: 'Warden',
              width: 170,
              cell: item => <>{item.wardenName || '—'}</>,
            },
          ]}
        />
      </FormCard>

      <FormCard
        title="Latest Admission Requests"
        subtitle="The five most recent applications from the public forum."
        icon="inbox"
      >
        {recentApplications.length === 0 ? (
          <EmptyState
            icon="inbox"
            title="No applications yet"
            hint="Applications submitted from the public forum show up here."
          />
        ) : (
          <GridPanel
            data={recentApplications}
            columns={[
              {
                field: 'applicationNo',
                header: 'Application No.',
                width: 160,
                cell: item => (
                  <span className="font-mono text-xs">
                    {item.applicationNo}
                  </span>
                ),
              },
              {
                field: 'studentName',
                header: 'Student',
                width: 200,
                cell: item => (
                  <div className="flex flex-col">
                    <span className="font-semibold">{item.studentName}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {item.rollNumber}
                    </span>
                  </div>
                ),
              },
              {
                field: 'preferredHostelId',
                header: 'Applied Hostel',
                width: 200,
                cell: item => (
                  <>
                    {data.hostels.find(h => h.id === item.preferredHostelId)
                      ?.nameEn ?? '—'}
                  </>
                ),
              },
              { field: 'submittedOn', header: 'Submitted', width: 130 },
              {
                field: 'status',
                header: 'Status',
                width: 120,
                cell: item => (
                  <StatusBadge
                    label={item.status}
                    variant={
                      item.status === 'Approved'
                        ? 'approved'
                        : item.status === 'Rejected'
                          ? 'rejected'
                          : 'pending'
                    }
                  />
                ),
              },
            ]}
          />
        )}
      </FormCard>
    </FormPage>
  );
}
