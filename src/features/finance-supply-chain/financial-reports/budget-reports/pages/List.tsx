import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DatePicker, DropDownList } from 'shared/components/forms';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';

const ALLOCATION_DATA = [
  {
    id: 1,
    financialYear: '2026-2027',
    officeType: 'Branch Office',
    officeName: 'Delhi Branch',
    endDate: '2026-06-01',
    amount: 750000,
  },
];

const APPROVAL_DATA = [
  {
    id: 1,
    financialYear: '2026-2027',
    officer: 'Jonathan Vance',
    status: 'Approved',
  },
];

const OFFICE_TYPES = [
  { label: 'All Types', value: 'All Types' },
  { label: 'Branch Office', value: 'Branch Office' },
];
const OFFICE_NAMES = [
  { label: 'All Offices', value: 'All Offices' },
  { label: 'Delhi Branch', value: 'Delhi Branch' },
];
const APPROVAL_OFFICERS = [
  { label: 'All Officers', value: 'All Officers' },
  { label: 'Jonathan Vance', value: 'Jonathan Vance' },
];

export default function List() {
  const [activeTab, setActiveTab] = useState<'allocation' | 'approval'>(
    'allocation'
  );

  // Allocation Filters
  const [allocFromDate, setAllocFromDate] = useState<string>('2026-04-01');
  const [allocToDate, setAllocToDate] = useState<string>('2026-06-05');
  const [allocOfficeType, setAllocOfficeType] = useState('All Types');
  const [allocOfficeName, setAllocOfficeName] = useState('All Offices');

  // Approval Filters
  const [apprFromDate, setApprFromDate] = useState<string>('2026-04-01');
  const [apprToDate, setApprToDate] = useState<string>('2026-06-05');
  const [apprOfficer, setApprOfficer] = useState('All Officers');

  // Header Banner Component
  const HeaderBanner = ({ title }: { title: string }) => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6 flex items-center justify-between overflow-hidden relative">
      <div className="flex items-center gap-5 z-10">
        <div className="w-14 h-14 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
          <svg
            className="w-7 h-7 text-indigo-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            ></path>
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            View financial statements and audit registries
          </p>
        </div>
      </div>

      {/* Decorative Illustration Area */}
      <div className="absolute right-0 top-0 bottom-0 w-64 opacity-80 pointer-events-none flex items-center justify-end pr-8">
        <div className="relative w-32 h-24">
          <div className="absolute right-4 bottom-2 w-16 h-20 bg-white border-2 border-indigo-100 rounded shadow-sm flex flex-col items-center pt-2 gap-1 z-10">
            <div className="w-10 h-1 bg-indigo-100 rounded-full"></div>
            <div className="w-8 h-1 bg-indigo-100 rounded-full"></div>
            <div className="w-10 h-1 bg-indigo-100 rounded-full"></div>
          </div>
          <div className="absolute right-12 bottom-0 w-12 h-16 bg-white border-2 border-indigo-500 rounded-lg shadow-md z-20 flex flex-col">
            <div className="bg-indigo-50 h-5 border-b border-indigo-100 m-1 rounded-sm"></div>
            <div className="grid grid-cols-3 gap-0.5 px-1 py-0.5 flex-1 items-center justify-items-center">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-gray-200 rounded-full"
                ></div>
              ))}
            </div>
          </div>
          <div className="absolute right-0 top-2 w-5 h-5 text-emerald-500 rounded flex items-center justify-center transform rotate-12">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 8C8 10 5.9 16.19 5.82 16.59l-.62 3.12 2.58-1.92c.3-.23 3.52-2.58 7.22-3.79C18.66 12.8 19 8.2 19 8s-1.07.03-2 0z" />
            </svg>
          </div>
          <div className="absolute right-20 top-8 w-4 h-4 bg-indigo-100 rounded-full"></div>
        </div>
      </div>
    </div>
  );

  const toolbarButtons = (
    <div className="flex items-center gap-3">
      <Button label="Export PDF" icon="file-pdf-o" variant="outlined" />
      <Button label="Export Excel" icon="file-excel-o" variant="outlined" />
    </div>
  );

  return (
    <FormPage
      title="Budget Reports"
      description="Manage and view budget allocations and approvals."
    >
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-gray-200 mb-6 pb-0">
        <button
          onClick={() => setActiveTab('allocation')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-colors focus:outline-none ${activeTab === 'allocation' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Budget Allocation
        </button>
        <button
          onClick={() => setActiveTab('approval')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-colors focus:outline-none ${activeTab === 'approval' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Budget Allocation Approval
        </button>
      </div>

      {activeTab === 'allocation' && (
        <div className="animate-fade-in">
          <HeaderBanner title="Budget Allocation Report" />

          {/* Filter Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
            <h3 className="text-sm font-bold text-indigo-600 tracking-wide mb-4">
              Budget Allocation Report
            </h3>

            <div className="flex items-end gap-6 flex-wrap">
              <div className="w-48 -mb-4">
                <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  From Date *
                </p>
                <DatePicker
                  value={new Date(allocFromDate)}
                  onChange={v => {
                    if (v) setAllocFromDate(v.toISOString().split('T')[0]);
                  }}
                />
              </div>
              <div className="w-48 -mb-4">
                <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  To Date *
                </p>
                <DatePicker
                  value={new Date(allocToDate)}
                  onChange={v => {
                    if (v) setAllocToDate(v.toISOString().split('T')[0]);
                  }}
                />
              </div>
              <div className="flex-1 min-w-[200px] -mb-4">
                <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Office Type *
                </p>
                <DropDownList
                  data={OFFICE_TYPES}
                  textField="label"
                  valueField="value"
                  value={allocOfficeType}
                  onChange={(v: any) => setAllocOfficeType(v)}
                />
              </div>
              <div className="flex-1 min-w-[200px] -mb-4">
                <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Office Name *
                </p>
                <DropDownList
                  data={OFFICE_NAMES}
                  textField="label"
                  valueField="value"
                  value={allocOfficeName}
                  onChange={(v: any) => setAllocOfficeName(v)}
                />
              </div>
              <div className="shrink-0 ml-auto">
                <style>{`.search-btn .p-button { height: 38px !important; }`}</style>
                <div className="search-btn">
                  <Button label="Search" icon="search" variant="primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Data Grid */}
          <FormCard>
            <GridPanel
              data={ALLOCATION_DATA}
              searchBox
              searchPlaceholder="Search in report..."
              toolbar={toolbarButtons}
              columns={[
                {
                  cell: (_, o) => <span>{o.rowIndex + 1}</span>,
                  header: 'SNO.',
                  width: '60px',
                },
                {
                  field: 'financialYear',
                  header: 'FINANCIAL YEAR',
                  cell: (i: any) => (
                    <span className="text-gray-500 font-medium">
                      {i.financialYear}
                    </span>
                  ),
                },
                {
                  field: 'officeType',
                  header: 'OFFICE TYPE',
                  cell: (i: any) => (
                    <span className="text-gray-500 font-medium">
                      {i.officeType}
                    </span>
                  ),
                },
                {
                  field: 'officeName',
                  header: 'OFFICE NAME',
                  cell: (i: any) => (
                    <span className="font-bold text-gray-800">
                      {i.officeName}
                    </span>
                  ),
                },
                {
                  field: 'endDate',
                  header: 'ALLOCATION PERIOD END DATE',
                  cell: (i: any) => (
                    <span className="text-gray-500 font-medium">
                      {i.endDate}
                    </span>
                  ),
                },
                {
                  field: 'amount',
                  header: 'ALLOCATED AMOUNT',
                  cell: (i: any) => (
                    <span className="font-bold text-emerald-500">
                      ₹{' '}
                      {i.amount.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  ),
                },
              ]}
            />
          </FormCard>
        </div>
      )}

      {activeTab === 'approval' && (
        <div className="animate-fade-in">
          <HeaderBanner title="Budget Allocation Approval Report" />

          {/* Filter Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
            <h3 className="text-sm font-bold text-indigo-600 tracking-wide mb-4">
              Budget Allocation Approval Report
            </h3>

            <div className="flex items-end gap-6 flex-wrap">
              <div className="w-48 -mb-4">
                <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  From Date *
                </p>
                <DatePicker
                  value={new Date(apprFromDate)}
                  onChange={v => {
                    if (v) setApprFromDate(v.toISOString().split('T')[0]);
                  }}
                />
              </div>
              <div className="w-48 -mb-4">
                <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  To Date *
                </p>
                <DatePicker
                  value={new Date(apprToDate)}
                  onChange={v => {
                    if (v) setApprToDate(v.toISOString().split('T')[0]);
                  }}
                />
              </div>
              <div className="flex-1 min-w-[200px] -mb-4">
                <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Approval Officer *
                </p>
                <DropDownList
                  data={APPROVAL_OFFICERS}
                  textField="label"
                  valueField="value"
                  value={apprOfficer}
                  onChange={(v: any) => setApprOfficer(v)}
                />
              </div>
              <div className="shrink-0 ml-auto">
                <style>{`.search-btn .p-button { height: 38px !important; }`}</style>
                <div className="search-btn">
                  <Button label="Search" icon="search" variant="primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Data Grid */}
          <FormCard>
            <GridPanel
              data={APPROVAL_DATA}
              searchBox
              searchPlaceholder="Search in report..."
              toolbar={toolbarButtons}
              columns={[
                {
                  cell: (_, o) => <span>{o.rowIndex + 1}</span>,
                  header: 'SNO.',
                  width: '60px',
                },
                {
                  field: 'financialYear',
                  header: 'FINANCIAL YEAR',
                  cell: (i: any) => (
                    <span className="text-gray-500 font-medium">
                      {i.financialYear}
                    </span>
                  ),
                },
                {
                  field: 'officer',
                  header: 'APPROVAL OFFICER',
                  cell: (i: any) => (
                    <span className="font-bold text-gray-800">{i.officer}</span>
                  ),
                },
                {
                  field: 'status',
                  header: 'DECISION STATUS',
                  cell: (i: any) => (
                    <span className="text-emerald-500 font-medium text-xs">
                      {i.status}
                    </span>
                  ),
                },
                {
                  field: 'action',
                  header: 'ACTION',
                  cell: () => (
                    <div className="flex items-center gap-3 text-gray-400">
                      <button className="hover:text-indigo-600 transition-colors">
                        <svg
                          width="18"
                          height="18"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button className="hover:text-indigo-600 transition-colors">
                        <svg
                          width="18"
                          height="18"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                      </button>
                    </div>
                  ),
                },
              ]}
            />
          </FormCard>
        </div>
      )}
    </FormPage>
  );
}
