import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FormPage, FormCard } from 'shared/new-components';
import { admissionsUrls } from '../../urls';

export default function MeritList() {
  const meritData = [
    {
      id: 1,
      program: 'B.Tech Computer Science and Engineering',
      score: 92.5,
      rank: 45,
      categoryRank: 12,
      status: 'Shortlisted',
    },
    {
      id: 2,
      program: 'B.Tech Electronics and Communication',
      score: 92.5,
      rank: 110,
      categoryRank: 34,
      status: 'Shortlisted',
    },
    {
      id: 3,
      program: 'B.Tech Information Technology',
      score: 92.5,
      rank: 85,
      categoryRank: 22,
      status: 'Waitlisted',
    },
  ];

  const statusTemplate = (rowData: any) => {
    let severity = 'info';
    if (rowData.status === 'Shortlisted') severity = 'success';
    if (rowData.status === 'Waitlisted') severity = 'warning';

    return (
      <Tag
        value={rowData.status}
        severity={severity as any}
        className="uppercase text-xs tracking-wider px-2 py-1 shadow-sm"
      />
    );
  };

  return (
    <FormPage
      title="Merit List Status"
      description="View your rank and selection status for the applied courses."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Admissions', to: admissionsUrls.root },
        { label: 'Merit List' },
      ]}
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">
                Application No.
              </span>
              <span className="text-3xl font-bold text-gray-800 tracking-tight">
                APP-2024-8921
              </span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">
                Overall Merit Score
              </span>
              <span className="text-3xl font-bold text-gray-800 tracking-tight">
                92.50%
              </span>
            </div>
          </div>
          <div className="bg-green-50 p-6 rounded-xl shadow-sm border border-green-200 border-l-4 border-l-green-500 hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <i className="pi pi-check-circle text-8xl text-green-900"></i>
            </div>
            <div className="flex flex-col relative z-10">
              <span className="text-xs text-green-700 font-bold uppercase tracking-wider mb-2">
                Current Status
              </span>
              <span className="text-2xl font-bold text-green-800 tracking-tight leading-tight">
                Shortlisted for Admission
              </span>
            </div>
          </div>
        </div>

        <FormCard>
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4 mb-4">
            <i className="pi pi-list text-xl text-gray-700"></i>
            <h2 className="text-xl font-bold text-gray-800 m-0">
              Program-wise Merit Details
            </h2>
          </div>

          <DataTable
            value={meritData}
            responsiveLayout="scroll"
            className="p-datatable-sm shadow-sm border border-gray-200 rounded-lg overflow-hidden"
            showGridlines={false}
            stripedRows
            rowHover
          >
            <Column
              field="program"
              header="Program Name"
              className="font-semibold text-gray-800"
            />
            <Column
              field="score"
              header="Merit Score"
              className="font-medium"
            />
            <Column field="rank" header="Overall Rank" />
            <Column field="categoryRank" header="Category Rank" />
            <Column header="Selection Status" body={statusTemplate} />
            <Column
              header="Action"
              body={rowData =>
                rowData.status === 'Shortlisted' ? (
                  <Button
                    label="View Offer"
                    size="small"
                    severity="success"
                    outlined
                    className="font-bold shadow-sm"
                  />
                ) : (
                  <span className="text-gray-400 text-sm italic">
                    Not Available
                  </span>
                )
              }
            />
          </DataTable>
        </FormCard>
      </div>
    </FormPage>
  );
}
