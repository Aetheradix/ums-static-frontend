import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormPage, GridPanel, FormCard } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { appointments } from '../../data';
import { hmsUrls } from '../../urls';
import { getHmsBreadcrumbs } from '../../utils';

const statusColors: Record<string, string> = {
  Scheduled: 'bg-blue-50 text-blue-700',
  Completed: 'bg-green-50 text-green-700',
  Cancelled: 'bg-red-50 text-red-700',
};

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const data = useMemo(() => appointments, []);

  return (
    <FormPage
      title="Appointments"
      description="View and manage health service appointments."
      breadcrumbs={getHmsBreadcrumbs('Appointments')}
      headerAction={
        <Button
          onClick={() => navigate(hmsUrls.addAppointment)}
          label="Book Appointment"
          icon="plus"
        />
      }
    >
      <FormCard title="All Appointments">
        <GridPanel
          data={data}
          searchBox={true}
          searchFields={[
            'memberName',
            'doctorName',
            'speciality',
            'healthCenter',
          ]}
          columns={[
            {
              field: 'memberName',
              header: 'Patient',
              cell: (r: any) => (
                <span className="font-medium">{r.memberName}</span>
              ),
            },
            { field: 'doctorName', header: 'Doctor', width: '160px' },
            { field: 'speciality', header: 'Speciality', width: '120px' },
            { field: 'date', header: 'Date', width: '110px' },
            { field: 'timeSlot', header: 'Time', width: '100px' },
            { field: 'healthCenter', header: 'Health Center', width: '160px' },
            {
              header: 'Status',
              width: '100px',
              cell: (r: any) => (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status] ?? 'bg-gray-100 text-gray-600'}`}
                >
                  {r.status}
                </span>
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
