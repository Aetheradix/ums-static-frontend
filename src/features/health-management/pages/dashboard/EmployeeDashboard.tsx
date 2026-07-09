import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import {
  memberships,
  healthRecords,
  appointments,
  mockCurrentUser,
} from '../../data';
import { hmsUrls } from '../../urls';
import { getHmsBreadcrumbs } from '../../utils';
const KPI_COLORS: Record<string, { bg: string; border: string; text: string }> =
  {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
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

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const empId = mockCurrentUser?.id ?? 'USR-EMP-001';

  const myMemberships = useMemo(
    () => memberships.filter(m => m.memberId === empId),
    []
  );
  const myRecords = useMemo(
    () => healthRecords.filter(r => r.memberName === mockCurrentUser?.name),
    []
  );
  const myAppointments = useMemo(
    () => appointments.filter(a => a.memberId === empId).slice(0, 5),
    []
  );
  const upcomingCount = useMemo(
    () => myAppointments.filter(a => a.status === 'Scheduled').length,
    []
  );

  return (
    <FormPage
      title="My Health Dashboard"
      description="Your health records, memberships, and appointments at a glance."
      breadcrumbs={getHmsBreadcrumbs(
        'My Dashboard',
        undefined,
        'Employee Portal',
        hmsUrls.employee.portal
      )}
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="Memberships"
          value={myMemberships.length}
          color="blue"
          icon="card_membership"
        />
        <KpiCard
          label="Health Records"
          value={myRecords.length}
          color="green"
          icon="medical_information"
        />
        <KpiCard
          label="Upcoming Appointments"
          value={upcomingCount}
          color="purple"
          icon="calendar_month"
        />
        <KpiCard
          label="Total Appointments"
          value={myAppointments.length}
          color="orange"
          icon="event"
        />
      </div>

      <div className="flex gap-3 mb-6">
        <Button
          onClick={() => navigate(hmsUrls.appointments)}
          label="Book Appointment"
          icon="calendar-plus"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FormCard title="My Appointments">
          <GridPanel
            data={myAppointments}
            searchBox={false}
            columns={[
              {
                field: 'doctorName',
                header: 'Doctor',
                cell: (a: any) => (
                  <span className="font-medium">{a.doctorName}</span>
                ),
              },
              { field: 'speciality', header: 'Speciality', width: '120px' },
              { field: 'date', header: 'Date', width: '110px' },
              { field: 'timeSlot', header: 'Time', width: '100px' },
              {
                header: 'Status',
                width: '100px',
                cell: (a: any) => {
                  const colors: Record<string, string> = {
                    Scheduled: 'bg-blue-50 text-blue-700',
                    Completed: 'bg-green-50 text-green-700',
                    Cancelled: 'bg-red-50 text-red-700',
                  };
                  return (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${colors[a.status] ?? 'bg-gray-100 text-gray-600'}`}
                    >
                      {a.status}
                    </span>
                  );
                },
              },
            ]}
          />
        </FormCard>
        <FormCard title="Recent Health Records">
          <div className="space-y-3">
            {myRecords.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">
                No health records found.
              </p>
            )}
            {myRecords.map(r => (
              <div
                key={r.id}
                className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => navigate(hmsUrls.records)}
              >
                <span className="material-symbols-outlined text-green-600 text-sm mt-0.5">
                  medical_information
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {r.chiefComplaint}
                  </p>
                  <p className="text-xs text-gray-400">
                    {r.dateOfVisit} — {r.createdBy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
