import { useMemo } from 'react';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import {
  memberships,
  healthRecords,
  medicalStocks,
  appointments,
  doctors,
} from '../../data';

const KPI_COLORS: Record<string, { bg: string; border: string; text: string }> =
  {
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
    },
    teal: {
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      text: 'text-teal-700',
    },
    indigo: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      text: 'text-indigo-700',
    },
    red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
  };

function KpiCard({
  label,
  value,
  color = 'blue',
  icon,
}: {
  label: string;
  value: string | number;
  color?: string;
  icon?: string;
}) {
  const c = KPI_COLORS[color] ?? KPI_COLORS.blue;
  return (
    <div className={`rounded-xl border p-4 ${c.bg} ${c.border}`}>
      <div
        className={`flex items-center gap-1.5 text-xs font-medium mb-1 ${c.text} opacity-70`}
      >
        {icon && (
          <span className="material-symbols-outlined text-sm">{icon}</span>
        )}
        {label}
      </div>
      <div className={`text-2xl font-bold ${c.text}`}>{value}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const totalMemberships = useMemo(() => memberships.length, []);
  const totalRecords = useMemo(() => healthRecords.length, []);
  const totalAppointments = useMemo(() => appointments.length, []);
  const totalDoctors = useMemo(() => doctors.length, []);
  const stockItems = useMemo(() => medicalStocks.length, []);
  const lowStock = useMemo(
    () => medicalStocks.filter(s => s.quantity > 0 && s.quantity < 50).length,
    []
  );
  const outOfStock = useMemo(
    () => medicalStocks.filter(s => s.quantity === 0).length,
    []
  );
  const activeMemberships = useMemo(() => memberships.length, []);

  const recentRecords = useMemo(() => healthRecords.slice(0, 5), []);
  const upcomingAppointments = useMemo(
    () => appointments.filter(a => a.status === 'Scheduled').slice(0, 5),
    []
  );

  return (
    <FormPage
      title="Health Admin Dashboard"
      description="Overview of health center operations, memberships, records, and stock."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Health Services', to: '/health-management' },
        { label: 'Admin Dashboard' },
      ]}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="Memberships"
          value={totalMemberships}
          color="blue"
          icon="card_membership"
        />
        <KpiCard
          label="Health Records"
          value={totalRecords}
          color="green"
          icon="medical_information"
        />
        <KpiCard
          label="Appointments"
          value={totalAppointments}
          color="purple"
          icon="calendar_month"
        />
        <KpiCard
          label="Doctors"
          value={totalDoctors}
          color="teal"
          icon="stethoscope"
        />
        <KpiCard
          label="Stock Items"
          value={stockItems}
          color="indigo"
          icon="inventory_2"
        />
        <KpiCard
          label="Low Stock"
          value={lowStock}
          color="orange"
          icon="inventory"
        />
        <KpiCard
          label="Out of Stock"
          value={outOfStock}
          color="red"
          icon="block"
        />
        <KpiCard
          label="Active Memberships"
          value={activeMemberships}
          color="green"
          icon="verified"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <FormCard title="Recent Health Records">
          <GridPanel
            data={recentRecords}
            searchBox={false}
            columns={[
              {
                field: 'memberName',
                header: 'Patient',
                cell: (r: any) => (
                  <span className="font-medium">{r.memberName}</span>
                ),
              },
              { field: 'dateOfVisit', header: 'Visit Date', width: '120px' },
              {
                field: 'chiefComplaint',
                header: 'Complaint',
                cell: (r: any) => (
                  <span className="text-sm truncate block max-w-[200px]">
                    {r.chiefComplaint}
                  </span>
                ),
              },
              { field: 'createdBy', header: 'Doctor', width: '150px' },
            ]}
          />
        </FormCard>
        <FormCard title="Upcoming Appointments">
          <GridPanel
            data={upcomingAppointments}
            searchBox={false}
            columns={[
              {
                field: 'memberName',
                header: 'Patient',
                cell: (a: any) => (
                  <span className="font-medium">{a.memberName}</span>
                ),
              },
              { field: 'doctorName', header: 'Doctor', width: '150px' },
              { field: 'date', header: 'Date', width: '110px' },
              { field: 'timeSlot', header: 'Time', width: '100px' },
            ]}
          />
        </FormCard>
      </div>
    </FormPage>
  );
}
