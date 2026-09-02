import { useMemo } from 'react';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  StatCard,
  StatusBadge,
  Tabs,
} from 'shared/new-components';
import { OccupancyBar } from '../components/ui';
import { hostelOccupancy, useHms, useHmsRole } from '../context/HmsContext';
import { hmsBreadcrumbs } from '../utils/breadcrumbs';

export default function AdminReports() {
  const { data } = useHms();
  const { activePortal } = useHmsRole();

  const hostelName = (id: string) =>
    data.hostels.find(h => h.id === id)?.nameEn ?? '—';

  // ── Occupancy ─────────────────────────────────────────────────────────────
  const occupancyRows = useMemo(
    () =>
      data.hostels.map(h => {
        const o = hostelOccupancy(h, data.rooms, data.allocations);
        return {
          id: h.id,
          hostel: h.nameEn,
          type: h.type,
          rooms: o.totalRooms,
          beds: o.configuredBeds,
          allotted: o.allottedBeds,
          available: o.availableBeds,
        };
      }),
    [data.hostels, data.rooms, data.allocations]
  );

  // ── Admission pipeline ────────────────────────────────────────────────────
  const admissionRows = useMemo(
    () =>
      data.hostels.map(h => {
        const apps = data.applications.filter(
          a => a.preferredHostelId === h.id
        );
        return {
          id: h.id,
          hostel: h.nameEn,
          total: apps.length,
          pending: apps.filter(a => a.status === 'Pending').length,
          approved: apps.filter(a => a.status === 'Approved').length,
          rejected: apps.filter(a => a.status === 'Rejected').length,
        };
      }),
    [data.hostels, data.applications]
  );

  // ── Fee collection ────────────────────────────────────────────────────────
  const collectionRows = useMemo(() => {
    const types = ['Hostel Fee', 'Mess Fee', 'Caution Money', 'Fine', 'Other'];
    return types
      .map(type => {
        const rows = data.payments.filter(p => p.paymentType === type);
        return {
          id: type,
          paymentType: type,
          transactions: rows.length,
          collected: rows
            .filter(p => p.status === 'Paid')
            .reduce((s, p) => s + p.amount, 0),
          pending: rows
            .filter(p => p.status === 'Pending')
            .reduce((s, p) => s + p.amount, 0),
        };
      })
      .filter(r => r.transactions > 0);
  }, [data.payments]);

  // ── Attendance ────────────────────────────────────────────────────────────
  const attendanceRows = useMemo(
    () =>
      data.hostels.map(h => {
        const rows = data.attendance.filter(a => a.hostelId === h.id);
        const present = rows.filter(a => a.status === 'Present').length;
        return {
          id: h.id,
          hostel: h.nameEn,
          marked: rows.length,
          present,
          absent: rows.filter(a => a.status === 'Absent').length,
          onLeave: rows.filter(a => a.status === 'On Leave').length,
          rate: rows.length ? Math.round((present / rows.length) * 100) : 0,
        };
      }),
    [data.hostels, data.attendance]
  );

  // ── Grievances ────────────────────────────────────────────────────────────
  const grievanceRows = useMemo(
    () =>
      data.grievanceCategories
        .map(c => {
          const rows = data.grievances.filter(g => g.categoryId === c.id);
          return {
            id: c.id,
            category: c.name,
            department: c.department,
            total: rows.length,
            open: rows.filter(
              g => g.status === 'Open' || g.status === 'In Progress'
            ).length,
            resolved: rows.filter(
              g => g.status === 'Resolved' || g.status === 'Closed'
            ).length,
          };
        })
        .filter(r => r.total > 0),
    [data.grievanceCategories, data.grievances]
  );

  const totals = useMemo(
    () => ({
      collected: data.payments
        .filter(p => p.status === 'Paid')
        .reduce((s, p) => s + p.amount, 0),
      pending: data.payments
        .filter(p => p.status === 'Pending')
        .reduce((s, p) => s + p.amount, 0),
      applications: data.applications.length,
      grievances: data.grievances.length,
    }),
    [data.payments, data.applications, data.grievances]
  );

  return (
    <FormPage
      title="Reports"
      description="Occupancy, admissions, collections, attendance and grievances across every hostel."
      breadcrumbs={hmsBreadcrumbs(activePortal, 'Reports')}
    >
      <FormGrid columns={4}>
        <StatCard
          title="Fee Collected"
          value={`₹${totals.collected.toLocaleString()}`}
          icon="payments"
          colorScheme="green"
        />
        <StatCard
          title="Outstanding"
          value={`₹${totals.pending.toLocaleString()}`}
          icon="schedule"
          colorScheme="amber"
        />
        <StatCard
          title="Applications"
          value={totals.applications}
          icon="assignment"
          colorScheme="blue"
        />
        <StatCard
          title="Grievances"
          value={totals.grievances}
          icon="flag"
          colorScheme="red"
        />
      </FormGrid>

      <FormCard title="Report Library" icon="chart-bar">
        <Tabs
          tabs={[
            {
              title: 'Occupancy',
              content: (
                <GridPanel
                  data={occupancyRows}
                  pagination
                  emptyMessage="No hostels registered."
                  columns={[
                    { field: 'hostel', header: 'Hostel', width: 240 },
                    { field: 'type', header: 'Type', width: 100 },
                    { field: 'rooms', header: 'Rooms', width: 100 },
                    { field: 'beds', header: 'Beds', width: 100 },
                    { field: 'allotted', header: 'Allotted', width: 110 },
                    { field: 'available', header: 'Available', width: 110 },
                    {
                      header: 'Fill',
                      sortable: false,
                      width: 200,
                      cell: item => (
                        <OccupancyBar
                          allotted={item.allotted}
                          total={item.beds}
                        />
                      ),
                    },
                  ]}
                />
              ),
            },
            {
              title: 'Admissions',
              content: (
                <GridPanel
                  data={admissionRows}
                  pagination
                  emptyMessage="No applications received."
                  columns={[
                    { field: 'hostel', header: 'Hostel', width: 260 },
                    { field: 'total', header: 'Applications', width: 130 },
                    {
                      field: 'pending',
                      header: 'Pending',
                      width: 120,
                      cell: item => (
                        <StatusBadge
                          label={String(item.pending)}
                          variant={item.pending > 0 ? 'pending' : 'muted'}
                        />
                      ),
                    },
                    {
                      field: 'approved',
                      header: 'Approved',
                      width: 120,
                      cell: item => (
                        <StatusBadge
                          label={String(item.approved)}
                          variant="approved"
                        />
                      ),
                    },
                    {
                      field: 'rejected',
                      header: 'Rejected',
                      width: 120,
                      cell: item => (
                        <StatusBadge
                          label={String(item.rejected)}
                          variant={item.rejected > 0 ? 'rejected' : 'muted'}
                        />
                      ),
                    },
                  ]}
                />
              ),
            },
            {
              title: 'Fee Collection',
              content: (
                <GridPanel
                  data={collectionRows}
                  emptyMessage="No payments recorded."
                  columns={[
                    {
                      field: 'paymentType',
                      header: 'Payment Type',
                      width: 200,
                    },
                    {
                      field: 'transactions',
                      header: 'Transactions',
                      width: 140,
                    },
                    {
                      field: 'collected',
                      header: 'Collected',
                      width: 150,
                      cell: item => (
                        <span className="font-semibold text-green-700 dark:text-green-400">
                          ₹{item.collected.toLocaleString()}
                        </span>
                      ),
                    },
                    {
                      field: 'pending',
                      header: 'Outstanding',
                      width: 150,
                      cell: item => (
                        <span className="font-semibold text-amber-700 dark:text-amber-400">
                          ₹{item.pending.toLocaleString()}
                        </span>
                      ),
                    },
                  ]}
                />
              ),
            },
            {
              title: 'Attendance',
              content: (
                <GridPanel
                  data={attendanceRows}
                  emptyMessage="No attendance marked."
                  columns={[
                    { field: 'hostel', header: 'Hostel', width: 240 },
                    { field: 'marked', header: 'Entries', width: 110 },
                    { field: 'present', header: 'Present', width: 110 },
                    { field: 'absent', header: 'Absent', width: 110 },
                    { field: 'onLeave', header: 'On Leave', width: 120 },
                    {
                      field: 'rate',
                      header: 'Present %',
                      width: 130,
                      cell: item => (
                        <StatusBadge
                          label={`${item.rate}%`}
                          variant={
                            item.rate >= 80
                              ? 'success'
                              : item.rate >= 50
                                ? 'warning'
                                : 'danger'
                          }
                        />
                      ),
                    },
                  ]}
                />
              ),
            },
            {
              title: 'Grievances',
              content: (
                <GridPanel
                  data={grievanceRows}
                  emptyMessage="No grievances raised."
                  columns={[
                    { field: 'category', header: 'Category', width: 230 },
                    { field: 'department', header: 'Department', width: 200 },
                    { field: 'total', header: 'Total', width: 100 },
                    {
                      field: 'open',
                      header: 'Open',
                      width: 110,
                      cell: item => (
                        <StatusBadge
                          label={String(item.open)}
                          variant={item.open > 0 ? 'warning' : 'muted'}
                        />
                      ),
                    },
                    {
                      field: 'resolved',
                      header: 'Resolved',
                      width: 120,
                      cell: item => (
                        <StatusBadge
                          label={String(item.resolved)}
                          variant="success"
                        />
                      ),
                    },
                  ]}
                />
              ),
            },
            {
              title: 'Allotment Register',
              content: (
                <GridPanel
                  data={data.allocations}
                  pagination
                  searchBox
                  searchPlaceholder="Search by student..."
                  searchFields={['studentName', 'studentId']}
                  emptyMessage="No rooms allotted yet."
                  columns={[
                    { field: 'studentId', header: 'Student ID', width: 120 },
                    { field: 'studentName', header: 'Student', width: 200 },
                    {
                      field: 'hostelId',
                      header: 'Hostel',
                      width: 230,
                      cell: item => <>{hostelName(item.hostelId)}</>,
                    },
                    {
                      field: 'roomId',
                      header: 'Room',
                      width: 140,
                      cell: item => (
                        <>
                          {data.rooms.find(r => r.id === item.roomId)
                            ?.roomNumber ?? '—'}
                        </>
                      ),
                    },
                    { field: 'roomType', header: 'Room Type', width: 150 },
                    { field: 'allottedOn', header: 'Allotted On', width: 130 },
                    {
                      field: 'status',
                      header: 'Status',
                      width: 120,
                      cell: item => (
                        <StatusBadge
                          label={item.status}
                          variant={
                            item.status === 'Active' ? 'success' : 'muted'
                          }
                        />
                      ),
                    },
                  ]}
                />
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
