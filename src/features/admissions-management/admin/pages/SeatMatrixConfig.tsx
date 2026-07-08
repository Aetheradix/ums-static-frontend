import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { DropDownList, TextBox } from 'shared/components/forms';
import { Tag } from 'primereact/tag';
import { FormPage, FormCard } from 'shared/new-components';
import { admissionsUrls } from '../../urls';
import { ToastService } from 'services';

interface SeatAllocation {
  category: string;
  quotaPercentage: number;
  calculatedSeats: number;
  manualOverrideSeats: number | null;
  finalSeats: number;
}

const mockCategories = [
  { code: 'GEN', name: 'General', quota: 50.5 },
  { code: 'OBC', name: 'OBC', quota: 27 },
  { code: 'SC', name: 'SC', quota: 15 },
  { code: 'ST', name: 'ST', quota: 7.5 },
];

const mockPrograms = [
  { label: 'B.Tech CSE', value: 'B.Tech CSE', intake: 120 },
  { label: 'B.Tech ECE', value: 'B.Tech ECE', intake: 60 },
  { label: 'MBA Finance', value: 'MBA Finance', intake: 60 },
];

export default function SeatMatrixConfig() {
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2024-2025');
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [totalIntake, setTotalIntake] = useState<number>(0);
  const [allocations, setAllocations] = useState<SeatAllocation[]>([]);

  // Automatically calculate seats when a program is selected
  useEffect(() => {
    if (selectedProgram) {
      const prog = mockPrograms.find(p => p.value === selectedProgram);
      if (prog) {
        setTotalIntake(prog.intake);

        // Calculate distribution
        let remaining = prog.intake;
        const newAllocations = mockCategories.map((cat, index) => {
          let seats = 0;
          if (index === mockCategories.length - 1) {
            // Give remaining to the last one to avoid rounding issues
            seats = remaining;
          } else {
            seats = Math.round((prog.intake * cat.quota) / 100);
            remaining -= seats;
          }

          return {
            category: cat.name,
            quotaPercentage: cat.quota,
            calculatedSeats: seats,
            manualOverrideSeats: null,
            finalSeats: seats,
          };
        });

        setAllocations(newAllocations);
      }
    } else {
      setTotalIntake(0);
      setAllocations([]);
    }
  }, [selectedProgram]);

  const handleManualOverride = (rowIndex: number, value: string) => {
    const newAllocations = [...allocations];
    const parsed = parseInt(value);

    if (!isNaN(parsed) && parsed >= 0) {
      newAllocations[rowIndex].manualOverrideSeats = parsed;
      newAllocations[rowIndex].finalSeats = parsed;
    } else if (value === '') {
      newAllocations[rowIndex].manualOverrideSeats = null;
      newAllocations[rowIndex].finalSeats =
        newAllocations[rowIndex].calculatedSeats;
    }

    setAllocations(newAllocations);
  };

  const finalSeatsEditor = (options: any) => {
    return (
      <div className="w-full max-w-[150px]">
        <TextBox
          type="number"
          value={
            options.rowData.manualOverrideSeats === null
              ? ''
              : options.rowData.manualOverrideSeats.toString()
          }
          onChange={v => handleManualOverride(options.rowIndex, v as string)}
          placeholder={options.rowData.calculatedSeats.toString()}
        />
      </div>
    );
  };

  const totalFinalSeats = allocations.reduce(
    (sum, item) => sum + item.finalSeats,
    0
  );
  const isValidMatrix = totalFinalSeats === totalIntake && totalIntake > 0;

  const handlePublish = () => {
    if (isValidMatrix) {
      ToastService.success('Seat matrix published successfully.');
    } else {
      ToastService.error(
        'Invalid matrix configuration. Please fix errors before publishing.'
      );
    }
  };

  const handleReset = () => {
    setSelectedProgram(selectedProgram); // triggers useEffect to recalculate
    ToastService.success('Seat matrix reset to system calculations.');
  };

  return (
    <FormPage
      title="Seat Matrix Configuration"
      description="Allocate total program intake across reservation categories based on configured quotas."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Admissions', to: admissionsUrls.root },
        { label: 'Admin', to: admissionsUrls.admin.dashboard },
        { label: 'Seat Matrix' },
      ]}
    >
      <div className="grid grid-cols-1 gap-6 p-fluid">
        {/* Selection Card */}
        <FormCard>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
            Select Program Context
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 flex flex-col gap-2">
              <DropDownList
                label="Academic Year"
                value={selectedAcademicYear}
                data={['2023-2024', '2024-2025', '2025-2026'].map(y => ({
                  label: y,
                  value: y,
                }))}
                textField="label"
                valueField="value"
                onChange={v => setSelectedAcademicYear(v as string)}
              />
            </div>
            <div className="col-span-1 flex flex-col gap-2">
              <DropDownList
                label="Program"
                value={selectedProgram || ''}
                data={mockPrograms}
                textField="label"
                valueField="value"
                onChange={v => setSelectedProgram(v as string)}
                defaultOptionText="Select a Program"
              />
            </div>
            <div className="col-span-1 flex flex-col gap-2">
              <label className="font-bold text-gray-700">
                Total Base Intake
              </label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded font-mono text-lg flex items-center shadow-sm">
                <i className="pi pi-users mr-2 text-blue-600"></i>
                <span className="font-semibold">
                  {totalIntake > 0 ? totalIntake : '--'}
                </span>{' '}
                <span className="ml-1 text-gray-500 text-sm">Seats</span>
              </div>
            </div>
          </div>
        </FormCard>

        {/* Matrix Card */}
        {selectedProgram && (
          <FormCard>
            <div className="mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2 border-b">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 m-0">
                  Seat Distribution Matrix
                </h2>
                <p className="text-sm text-gray-500 m-0 mt-1">
                  System calculates seats based on quotas. You can manually
                  override values by clicking on the Final Allocated Seats
                  cells.
                </p>
              </div>
              <div
                className={`px-4 py-2 rounded-lg font-bold shadow-sm border ${isValidMatrix ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}
              >
                Allocated: {totalFinalSeats} / {totalIntake}
              </div>
            </div>

            <DataTable
              value={allocations}
              editMode="cell"
              emptyMessage="Select a program to generate the matrix."
              className="p-datatable-sm"
              stripedRows
              rowHover
            >
              <Column
                field="category"
                header="Reservation Category"
                className="font-semibold text-gray-700"
              ></Column>
              <Column
                field="quotaPercentage"
                header="Quota (%)"
                body={row => (
                  <Tag value={`${row.quotaPercentage}%`} severity="info" />
                )}
              ></Column>
              <Column
                field="calculatedSeats"
                header="Calculated Seats (System)"
              ></Column>
              <Column
                field="finalSeats"
                header="Final Allocated Seats (Edit)"
                body={row => (
                  <div
                    className={`font-bold flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-100 ${row.manualOverrideSeats !== null ? 'text-orange-600' : 'text-gray-800'}`}
                  >
                    {row.finalSeats}
                    {row.manualOverrideSeats !== null && (
                      <Tag
                        value="Override"
                        severity="warning"
                        className="text-xs"
                      />
                    )}
                    <i className="pi pi-pencil text-gray-400 text-xs ml-auto opacity-0 group-hover:opacity-100 transition-opacity"></i>
                  </div>
                )}
                editor={finalSeatsEditor}
              ></Column>
            </DataTable>

            <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-4">
              <Button
                label="Reset to Calculated"
                icon="pi pi-refresh"
                text
                severity="secondary"
                onClick={handleReset}
              />
              <Button
                label="Publish Matrix"
                icon="pi pi-check"
                onClick={handlePublish}
                disabled={!isValidMatrix}
              />
            </div>

            {!isValidMatrix && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-red-600 flex items-center justify-end font-semibold shadow-sm">
                <i className="pi pi-exclamation-triangle mr-2 text-lg"></i>
                Total allocated seats must exactly match the total base intake.
              </div>
            )}
          </FormCard>
        )}
      </div>
    </FormPage>
  );
}
