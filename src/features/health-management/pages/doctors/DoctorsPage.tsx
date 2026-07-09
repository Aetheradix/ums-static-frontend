import { useMemo } from 'react';
import { FormPage, GridPanel, FormCard } from 'shared/new-components';
import { doctors } from '../../data';
import { getHmsBreadcrumbs } from '../../utils';

export default function DoctorsPage() {
  const data = useMemo(() => doctors, []);

  return (
    <FormPage
      title="Doctor Schedule"
      description="View doctor availability, specialities, and visiting hours."
      breadcrumbs={getHmsBreadcrumbs('Doctors')}
    >
      <FormCard title="All Doctors">
        <GridPanel
          data={data}
          searchBox={true}
          searchFields={[
            'universityDoctorName',
            'name',
            'speciality',
            'hospital',
          ]}
          columns={[
            {
              field: 'universityDoctorName',
              header: 'Doctor',
              cell: (r: any) => (
                <span className="font-medium">
                  {r.universityDoctorName || r.name}
                </span>
              ),
            },
            { field: 'speciality', header: 'Speciality', width: '130px' },
            { field: 'hospital', header: 'Hospital', width: '170px' },
            { field: 'visitingHoursStart', header: 'From', width: '80px' },
            { field: 'visitingHoursEnd', header: 'To', width: '80px' },
            { field: 'visitingDays', header: 'Days', width: '200px' },
            { field: 'contact', header: 'Contact', width: '130px' },
            {
              header: 'Status',
              width: '100px',
              cell: (r: any) => {
                const c =
                  r.visitingStatus === 'Available'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700';
                return (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${c}`}
                  >
                    {r.visitingStatus}
                  </span>
                );
              },
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
