import { useNavigate } from 'react-router-dom';
import { FormPage } from 'shared/new-components';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { AffiliationFeeMasterUrls } from '../urls';

export default function List() {
  const navigate = useNavigate();

  const mockData = [
    {
      id: 1,
      category: 'General Course',
      degreeLevel: 'Graduate (UG)',
      courseType: 'General (B.A., B.Com)',
      affiliationType: '1st Year (New)',
      baseFee: 40000,
      lateFee: 2000,
      academicYear: '2024-25',
      isLateFeeApplied: true,
      baseSeats: 60,
      extraSeatRule: 'Yes (50% per 60 seats)',
      status: true,
    },
    {
      id: 2,
      category: 'Professional Course',
      degreeLevel: 'Graduate (UG)',
      courseType: 'Professional (B.B.A)',
      affiliationType: '2nd Year (Renewal)',
      baseFee: 112000,
      lateFee: 5000,
      academicYear: '2024-25',
      isLateFeeApplied: false,
      baseSeats: 60,
      extraSeatRule: 'Yes (50% per 60 seats)',
      status: true,
    },
    {
      id: 3,
      category: 'Diploma / PG Diploma',
      degreeLevel: 'Diploma',
      courseType: 'All',
      affiliationType: 'Affiliation Fee',
      baseFee: 40000,
      lateFee: 2000,
      academicYear: '2024-25',
      isLateFeeApplied: true,
      baseSeats: '-',
      extraSeatRule: 'No',
      status: true,
    },
    {
      id: 4,
      category: 'Special Services',
      degreeLevel: 'All',
      courseType: 'All',
      affiliationType: 'College Name Change',
      baseFee: 50000,
      lateFee: '-',
      academicYear: '2024-25',
      isLateFeeApplied: false,
      baseSeats: '-',
      extraSeatRule: 'No',
      status: true,
    },
    {
      id: 5,
      category: 'Permanent Affiliation',
      degreeLevel: 'All',
      courseType: 'All',
      affiliationType: 'Affiliation Fee',
      baseFee: 75000,
      lateFee: '-',
      academicYear: '2024-25',
      isLateFeeApplied: false,
      baseSeats: '-',
      extraSeatRule: 'No',
      status: true,
    },
  ];

  return (
    <FormPage
      title="Affiliation Fee Rule Engine"
      description="Manage dynamic fee rules for affiliation applications and renewals based on PDF rules."
    >
      <div className="card">
        <div className="flex justify-content-end mb-3 gap-2">
          <Button
            label="Add Course Fee"
            icon="pi pi-plus"
            onClick={() => navigate(AffiliationFeeMasterUrls.createCourse())}
          />
          <Button
            label="Add Special Fee"
            severity="secondary"
            icon="pi pi-plus"
            onClick={() => navigate(AffiliationFeeMasterUrls.createSpecial())}
          />
        </div>
        <DataTable value={mockData} responsiveLayout="scroll">
          <Column field="category" header="Fee Category" />
          <Column field="degreeLevel" header="Degree Level" />
          <Column field="courseType" header="Course Group" />
          <Column field="affiliationType" header="Application Type / Year" />
          <Column
            field="baseFee"
            header="Base Fee (₹)"
            body={(row: any) => `₹ ${row.baseFee.toLocaleString()}`}
          />
          <Column
            field="lateFee"
            header="Late Fee (₹)"
            body={(row: any) =>
              typeof row.lateFee === 'number'
                ? `₹ ${row.lateFee.toLocaleString()}`
                : row.lateFee
            }
          />
          <Column field="academicYear" header="Academic Year" />
          <Column
            field="isLateFeeApplied"
            header="Apply Late Fee"
            body={(row: any) => (
              <span
                className={`px-2 py-1 rounded text-sm ${row.isLateFeeApplied ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
              >
                {row.isLateFeeApplied ? 'Yes' : 'No'}
              </span>
            )}
          />
          <Column field="baseSeats" header="Base Seats Unit" />
          <Column field="extraSeatRule" header="Extra Seats Rule" />
          <Column
            header="Action"
            body={(row: any) => (
              <Button
                icon="pi pi-pencil"
                rounded
                text
                severity="info"
                aria-label="Edit"
                onClick={() => navigate(AffiliationFeeMasterUrls.edit(row.id))}
              />
            )}
          />
        </DataTable>
      </div>
    </FormPage>
  );
}
