import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { FormPage, FormCard } from 'shared/new-components';
import { admissionsUrls } from '../../urls';
import { ToastService } from 'services';

interface ConversionRecord {
  id: string;
  applicationNo: string;
  name: string;
  program: string;
  admissionDate: string;
  rollNumber: string | null;
  status: 'Pending Conversion' | 'Converted';
}

const mockPrograms = [
  { label: 'B.Tech CSE', value: 'B.Tech CSE' },
  { label: 'MBA Finance', value: 'MBA Finance' },
];

const mockRecords: ConversionRecord[] = [
  {
    id: '1',
    applicationNo: 'APP-2024-045',
    name: 'Alice Smith',
    program: 'B.Tech CSE',
    admissionDate: '2024-07-01',
    rollNumber: null,
    status: 'Pending Conversion',
  },
  {
    id: '2',
    applicationNo: 'APP-2024-102',
    name: 'Bob Johnson',
    program: 'B.Tech CSE',
    admissionDate: '2024-07-02',
    rollNumber: 'CS24001',
    status: 'Converted',
  },
  {
    id: '3',
    applicationNo: 'APP-2024-012',
    name: 'Charlie Brown',
    program: 'B.Tech CSE',
    admissionDate: '2024-07-03',
    rollNumber: null,
    status: 'Pending Conversion',
  },
  {
    id: '4',
    applicationNo: 'APP-2024-088',
    name: 'Diana Prince',
    program: 'MBA Finance',
    admissionDate: '2024-07-04',
    rollNumber: null,
    status: 'Pending Conversion',
  },
];

export default function StudentConversion() {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(
    'B.Tech CSE'
  );
  const [records, setRecords] = useState<ConversionRecord[]>(mockRecords);
  const [selectedRecords, setSelectedRecords] = useState<ConversionRecord[]>(
    []
  );
  const [converting, setConverting] = useState(false);

  const getSeverity = (status: string) => {
    return status === 'Converted' ? 'success' : 'warning';
  };

  const handleConvert = () => {
    if (selectedRecords.length === 0) return;

    setConverting(true);

    // Simulate generation of roll numbers
    setTimeout(() => {
      const updatedRecords = records.map(record => {
        const isSelected = selectedRecords.some(r => r.id === record.id);
        if (isSelected && record.status === 'Pending Conversion') {
          // Generate a fake roll number (e.g., CS24xxx)
          const prefix = record.program === 'B.Tech CSE' ? 'CS24' : 'MB24';
          const randomSuffix = Math.floor(100 + Math.random() * 900);
          return {
            ...record,
            status: 'Converted' as const,
            rollNumber: `${prefix}${randomSuffix}`,
          };
        }
        return record;
      });

      setRecords(updatedRecords);
      setSelectedRecords([]);
      setConverting(false);
      ToastService.success(
        `Successfully generated roll numbers for ${selectedRecords.length} students.`
      );
    }, 1500);
  };

  const pendingCount = records.filter(
    r => r.status === 'Pending Conversion' && r.program === selectedProgram
  ).length;
  const convertedCount = records.filter(
    r => r.status === 'Converted' && r.program === selectedProgram
  ).length;

  const isRowSelectable = (e: any) => {
    return e.data.status === 'Pending Conversion';
  };

  const rowClassName = (data: ConversionRecord) => {
    return data.status === 'Converted' ? 'opacity-70 bg-gray-50' : '';
  };

  return (
    <FormPage
      title="Student Conversion & Roll Number Generation"
      description="Convert admitted applicants into enrolled students and generate their official Roll Numbers."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Admissions', to: admissionsUrls.root },
        { label: 'Admission Cell', to: admissionsUrls.cell.dashboard },
        { label: 'Student Conversion' },
      ]}
    >
      <FormCard>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 border-b border-gray-200 pb-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3 w-full md:w-auto">
            <label
              htmlFor="program"
              className="font-bold text-gray-700 whitespace-nowrap"
            >
              Filter by Program:
            </label>
            <Dropdown
              id="program"
              value={selectedProgram}
              options={mockPrograms}
              onChange={e => {
                setSelectedProgram(e.value);
                setSelectedRecords([]);
              }}
              placeholder="Select a Program"
              className="w-full md:w-64"
            />
          </div>

          <Button
            label={
              converting
                ? 'Converting...'
                : `Generate Roll Numbers for Selected (${selectedRecords.length})`
            }
            icon={converting ? 'pi pi-spin pi-spinner' : 'pi pi-id-card'}
            onClick={handleConvert}
            disabled={selectedRecords.length === 0 || converting}
            severity="success"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-100 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-sm text-orange-600 font-medium block uppercase tracking-wider mb-1">
                Pending Conversion
              </span>
              <span className="text-3xl font-bold text-orange-700">
                {pendingCount}
              </span>
            </div>
            <i className="pi pi-user-plus text-4xl text-orange-300"></i>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-100 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-sm text-green-600 font-medium block uppercase tracking-wider mb-1">
                Successfully Converted
              </span>
              <span className="text-3xl font-bold text-green-700">
                {convertedCount}
              </span>
            </div>
            <i className="pi pi-id-card text-4xl text-green-300"></i>
          </div>
        </div>

        <div className="bg-blue-50 text-blue-800 p-4 rounded-lg border border-blue-200 text-sm mb-5 flex items-start shadow-sm">
          <i className="pi pi-info-circle mr-3 mt-0.5 text-blue-600 text-lg"></i>
          <p className="m-0 leading-relaxed">
            Only applicants who have fully paid their admission fees appear in
            this list. Select the pending applicants to generate their permanent
            University Roll Numbers and sync them to the Student Information
            System (SIS).
          </p>
        </div>

        <DataTable
          value={records.filter(r => r.program === selectedProgram)}
          paginator
          rows={10}
          dataKey="id"
          className="p-datatable-sm"
          emptyMessage="No records found for this program."
          selectionMode="checkbox"
          selection={selectedRecords}
          onSelectionChange={e => setSelectedRecords(e.value)}
          isDataSelectable={isRowSelectable}
          rowClassName={rowClassName}
          stripedRows
          rowHover
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: '3rem' }}
          ></Column>
          <Column
            field="applicationNo"
            header="App No."
            style={{ minWidth: '120px' }}
            className="font-semibold text-gray-700"
          ></Column>
          <Column field="name" header="Applicant Name" sortable></Column>
          <Column
            field="admissionDate"
            header="Admission Date"
            sortable
          ></Column>
          <Column
            field="status"
            header="Status"
            body={r => (
              <Tag value={r.status} severity={getSeverity(r.status)} />
            )}
            sortable
          ></Column>
          <Column
            field="rollNumber"
            header="Roll Number"
            body={r =>
              r.rollNumber ? (
                <span className="font-mono font-bold text-lg px-2 py-1 bg-gray-100 border rounded text-blue-800 shadow-sm">
                  {r.rollNumber}
                </span>
              ) : (
                <span className="text-gray-400 italic">Not Generated</span>
              )
            }
          ></Column>
        </DataTable>
      </FormCard>
    </FormPage>
  );
}
