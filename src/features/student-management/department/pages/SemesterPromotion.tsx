import { useState } from 'react';
import { DropDownList } from 'shared/components/forms';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ToastService } from 'services';
import { FormPage, FormCard, StatusBadge } from 'shared/new-components';
import { studentManagementUrls } from '../../urls';

export default function SemesterPromotion() {
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const batches = [
    { label: 'B.Tech CSE - 2024 (Semester 4)', value: 'BTech_CSE_2024_S4' },
    { label: 'B.Tech ECE - 2024 (Semester 4)', value: 'BTech_ECE_2024_S4' },
    { label: 'MBA - 2025 (Semester 2)', value: 'MBA_2025_S2' },
  ];

  const studentsData = [
    {
      id: 'STU001',
      name: 'John Doe',
      rollNo: 'CSE24001',
      cgpa: 8.5,
      backlogs: 0,
      eligible: true,
    },
    {
      id: 'STU002',
      name: 'Jane Smith',
      rollNo: 'CSE24002',
      cgpa: 7.2,
      backlogs: 1,
      eligible: true,
    },
    {
      id: 'STU003',
      name: 'Michael Brown',
      rollNo: 'CSE24003',
      cgpa: 5.4,
      backlogs: 4,
      eligible: false,
    },
    {
      id: 'STU004',
      name: 'Emily Davis',
      rollNo: 'CSE24004',
      cgpa: 9.1,
      backlogs: 0,
      eligible: true,
    },
    {
      id: 'STU005',
      name: 'William Wilson',
      rollNo: 'CSE24005',
      cgpa: 6.8,
      backlogs: 2,
      eligible: false,
    },
  ];

  const eligibleTemplate = (rowData: any) => {
    return (
      <StatusBadge
        label={rowData.eligible ? 'Eligible' : 'Not Eligible'}
        variant={rowData.eligible ? 'approved' : 'rejected'}
      />
    );
  };

  const handlePromote = () => {
    if (!selectedStudents || selectedStudents.length === 0) {
      ToastService.error('Please select at least one student to promote.');
      return;
    }

    const ineligible = selectedStudents.filter((s: any) => !s.eligible);
    if (ineligible.length > 0) {
      ToastService.error(
        'You cannot promote ineligible students with too many backlogs.'
      );
      return;
    }

    ToastService.success(
      `Successfully promoted ${selectedStudents.length} students to the next semester.`
    );
    setSelectedStudents(null);
  };

  const loadStudents = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 600);
  };

  return (
    <FormPage
      title="Semester Promotion"
      description="Evaluate and promote students to the next academic semester based on eligibility rules."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Department Portal',
          to: studentManagementUrls.department.root,
        },
        { label: 'Semester Promotion' },
      ]}
    >
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        <FormCard>
          <div className="flex flex-col md:flex-row gap-4 mb-2 items-end bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex-1 w-full">
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Select Batch & Current Semester{' '}
                <span className="text-red-500">*</span>
              </label>
              <DropDownList
                label=""
                value={selectedBatch || ''}
                data={batches}
                textField="label"
                valueField="value"
                onChange={v => {
                  setSelectedBatch(v as string);
                  setSelectedStudents(null);
                }}
                defaultOptionText="Select a Batch"
              />
            </div>
            <div className="w-full md:w-auto mt-2 md:mt-0">
              <Button
                label="Load Students"
                icon={`pi ${isLoading ? 'pi-spin pi-spinner' : 'pi-search'}`}
                onClick={loadStudents}
                disabled={!selectedBatch || isLoading}
                className="w-full"
              />
            </div>
          </div>
        </FormCard>

        {selectedBatch && !isLoading && (
          <FormCard className="animate-fade-in border-t-4 border-green-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <i className="pi pi-list text-green-600"></i>
                  Promotion Eligibility List
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Select eligible students to promote to the next semester.
                </p>
              </div>
              <Button
                label={`Promote Selected (${selectedStudents?.length || 0})`}
                icon="pi pi-angle-double-up"
                severity="success"
                onClick={handlePromote}
                disabled={!selectedStudents || selectedStudents.length === 0}
                className="shadow-md font-bold px-6"
                size="large"
              />
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <DataTable
                value={studentsData}
                selection={selectedStudents!}
                onSelectionChange={e => setSelectedStudents(e.value as any[])}
                dataKey="id"
                stripedRows
                rowHover
                paginator
                rows={10}
                className="p-datatable-sm"
                emptyMessage="No students found in this batch."
                isDataSelectable={e => e.data.eligible}
              >
                <Column
                  selectionMode="multiple"
                  headerStyle={{ width: '3rem' }}
                ></Column>
                <Column
                  field="rollNo"
                  header="Roll No."
                  sortable
                  className="font-mono text-gray-700"
                ></Column>
                <Column
                  field="name"
                  header="Student Name"
                  sortable
                  className="font-bold text-gray-900"
                ></Column>
                <Column
                  field="cgpa"
                  header="Current CGPA"
                  sortable
                  className="font-medium text-blue-700"
                ></Column>
                <Column
                  field="backlogs"
                  header="Active Backlogs"
                  sortable
                  body={rowData => (
                    <span
                      className={`font-bold ${rowData.backlogs > 2 ? 'text-red-600' : rowData.backlogs > 0 ? 'text-yellow-600' : 'text-green-600'}`}
                    >
                      {rowData.backlogs}
                    </span>
                  )}
                ></Column>
                <Column
                  field="eligible"
                  header="Status"
                  body={eligibleTemplate}
                  sortable
                ></Column>
              </DataTable>
            </div>

            <div className="mt-4 bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-start gap-3">
              <i className="pi pi-info-circle text-blue-600 mt-0.5"></i>
              <div className="text-sm text-blue-800">
                <p className="font-bold mb-1">Promotion Criteria</p>
                <p>
                  Students must have a CGPA above 5.0 and no more than 3 active
                  backlogs to be automatically marked as eligible for promotion.
                  Selecting an ineligible student will prevent the promotion
                  action.
                </p>
              </div>
            </div>
          </FormCard>
        )}
      </div>
    </FormPage>
  );
}
