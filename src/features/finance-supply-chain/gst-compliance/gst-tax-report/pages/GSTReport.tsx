import { useMemo, useState } from 'react';
import { Button } from 'shared/components/buttons';
import { TDS_GST_REPORT_DATA } from '../../../mock-data';

export default function GSTReport() {
  const [fromDate, setFromDate] = useState('01/05/2026');
  const [toDate, setToDate] = useState('05/06/2026');
  const [officeType, setOfficeType] = useState('All');
  const [officeName, setOfficeName] = useState('');
  const [partyName, setPartyName] = useState('All Parties');
  const [billNo, setBillNo] = useState('');

  // active filters for summary bar
  const [activeFilters] = useState({
    dateRange: '1/5/2026 - 5/6/2026',
    office: 'All Offices',
    reportType: 'Location Wise Detail',
  });

  const [activeTab, setActiveTab] = useState('Location Wise Detail');

  // Compute totals
  const totals = useMemo(() => {
    let totalBillAmount = 0;
    let paymentAmount = 0;
    let basicAmount = 0;
    let gstTdsAmount = 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    for (const row of TDS_GST_REPORT_DATA) {
      totalBillAmount += row.totalBillAmount;
      paymentAmount += row.paymentAmount;
      basicAmount += row.basicAmount;
      gstTdsAmount += row.gstTdsAmount;
      cgst += row.cgst;
      sgst += row.sgst;
      igst += row.igst;
    }

    return {
      totalBillAmount,
      paymentAmount,
      basicAmount,
      gstTdsAmount,
      cgst,
      sgst,
      igst,
    };
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-4 md:p-6 lg:p-8 font-sans">
      {/* 1. Custom Page Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex justify-between items-center relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold">
            %
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-800">
              TDS-GST Report
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Verify national and state tax compliance offset brackets.
            </p>
          </div>
        </div>

        {/* Decorative Graphic */}
        <div className="hidden md:flex relative w-32 h-16 z-0 opacity-80 pointer-events-none">
          <div className="absolute right-12 top-0 w-10 h-12 bg-emerald-50 border-2 border-emerald-100 rounded-md shadow-sm">
            <div className="w-4 h-1 bg-emerald-200 mx-auto mt-1 rounded-full"></div>
            <div className="w-6 h-1 bg-emerald-100 ml-1.5 mt-2 rounded-full"></div>
            <div className="w-6 h-1 bg-emerald-100 ml-1.5 mt-1 rounded-full"></div>
            <div className="w-4 h-1 bg-emerald-100 ml-1.5 mt-1 rounded-full"></div>
          </div>
          <div className="absolute right-2 top-4 w-12 h-14 bg-white border-2 border-indigo-100 rounded-md shadow-md z-10 flex flex-col items-center">
            <div className="w-8 h-2 bg-slate-100 mt-2 rounded-sm"></div>
            <div className="grid grid-cols-3 gap-0.5 mt-2">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-indigo-100 rounded-sm"
                ></div>
              ))}
            </div>
          </div>
          <div className="absolute right-14 bottom-2 w-3 h-3 bg-teal-400 rounded-full"></div>
          <div className="absolute right-4 top-2 w-2 h-2 bg-emerald-400 rounded-sm rotate-12"></div>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <h2 className="text-sm font-bold text-indigo-700 uppercase tracking-wider mb-3 px-1">
        TDS-GST Report
      </h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4 flex flex-wrap gap-4 items-end">
        <div className="w-40">
          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">
            From Date *
          </label>
          <input
            type="text"
            className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
          />
        </div>
        <div className="w-40">
          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">
            To Date *
          </label>
          <input
            type="text"
            className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
          />
        </div>
        <div className="w-48">
          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">
            Office Type *
          </label>
          <select
            className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
            value={officeType}
            onChange={e => setOfficeType(e.target.value)}
          >
            <option>All</option>
          </select>
        </div>
        <div className="w-48">
          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">
            Office Name *
          </label>
          <select
            className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none text-slate-500"
            value={officeName}
            onChange={e => setOfficeName(e.target.value)}
          >
            <option value="">Select Office</option>
          </select>
        </div>
        <div className="w-48">
          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">
            Party Name
          </label>
          <select
            className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
            value={partyName}
            onChange={e => setPartyName(e.target.value)}
          >
            <option>All Parties</option>
          </select>
        </div>
        <div className="w-48">
          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">
            Bill No.
          </label>
          <input
            type="text"
            className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
            placeholder="Search Bill No"
            value={billNo}
            onChange={e => setBillNo(e.target.value)}
          />
        </div>
        <div className="ml-auto flex items-end">
          <Button
            label="Search"
            icon="search"
            variant="primary"
            className="h-10 w-full"
          />
        </div>
      </div>

      {/* 3. Active Filters Row */}
      <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-6 px-1">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <i className="pi pi-calendar text-indigo-400"></i> Date Range:{' '}
            <span className="font-bold text-slate-800">
              {activeFilters.dateRange}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <i className="pi pi-building text-indigo-400"></i> Office:{' '}
            <span className="font-bold text-slate-800">
              {activeFilters.office}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <i className="pi pi-chart-bar text-indigo-400"></i> Report Type:{' '}
            <span className="font-bold text-slate-800">
              {activeFilters.reportType}
            </span>
          </span>
        </div>
        <button className="text-slate-500 hover:text-slate-800 border border-slate-300 rounded-full px-4 py-1 text-xs font-semibold bg-white shadow-sm transition-colors">
          Clear Filters
        </button>
      </div>

      {/* 4. KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Total Bill Amount
          </h3>
          <p className="text-2xl font-bold text-slate-800 mb-1">
            {formatCurrency(totals.totalBillAmount)}
          </p>
          <p className="text-[10px] font-medium text-slate-400">
            Gross invoiced value
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Total Payment Amount
          </h3>
          <p className="text-2xl font-bold text-slate-800 mb-1">
            {formatCurrency(totals.paymentAmount)}
          </p>
          <p className="text-[10px] font-medium text-slate-400">
            Net paid to parties
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Total Taxable Value
          </h3>
          <p className="text-2xl font-bold text-slate-800 mb-1">
            {formatCurrency(totals.basicAmount)}
          </p>
          <p className="text-[10px] font-medium text-slate-400">
            Basic taxable amount
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Total GST TDS Deducted
          </h3>
          <p className="text-2xl font-bold text-slate-800 mb-1">
            {formatCurrency(totals.gstTdsAmount)}
          </p>
          <div className="flex gap-3 text-[10px] font-medium text-slate-400">
            <span>CGST: {formatCurrency(totals.cgst)}</span>
            <span>SGST: {formatCurrency(totals.sgst)}</span>
            <span>IGST: {formatCurrency(totals.igst)}</span>
          </div>
        </div>
      </div>

      {/* 5. Report Data Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="text-center py-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-slate-800">TDS-GST Report</h2>
          <p className="text-xs font-medium text-slate-400 mt-1">
            1/5/2026 to 5/6/2026
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 px-6 border-b border-gray-100">
          {['Location Wise Detail', 'Party Summary', 'Voucher details'].map(
            tab => (
              <button
                key={tab}
                className={`py-4 text-xs font-bold border-b-2 transition-colors ${activeTab === tab ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
          <div className="relative">
            <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input
              type="text"
              placeholder="Search in report..."
              className="h-9 pl-9 pr-4 w-64 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-2">
            <button className="h-9 px-4 border border-indigo-200 text-indigo-600 font-semibold text-xs rounded-lg hover:bg-indigo-50 flex items-center gap-2 transition-colors">
              <i className="pi pi-download text-[10px]"></i> Export PDF
            </button>
            <button className="h-9 px-4 border border-indigo-200 text-indigo-600 font-semibold text-xs rounded-lg hover:bg-indigo-50 flex items-center gap-2 transition-colors">
              <i className="pi pi-download text-[10px]"></i> Export Excel
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-max text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fc] border-b border-indigo-50 text-[10px] uppercase font-bold text-indigo-600 whitespace-nowrap">
                <th className="px-4 py-3 font-bold">SNO.</th>
                <th className="px-4 py-3 font-bold">OFFICE NAME</th>
                <th className="px-4 py-3 font-bold">PARTY NAME</th>
                <th className="px-4 py-3 font-bold">GST NO.</th>
                <th className="px-4 py-3 font-bold text-right">
                  TOTAL BILL AMOUNT
                </th>
                <th className="px-4 py-3 font-bold text-right">
                  PAYMENT AMOUNT
                </th>
                <th className="px-4 py-3 font-bold text-right">BASIC AMOUNT</th>
                <th className="px-4 py-3 font-bold text-right">
                  GST TDS AMOUNT
                </th>
                <th className="px-4 py-3 font-bold text-right">CGST</th>
                <th className="px-4 py-3 font-bold text-right">SGST</th>
                <th className="px-4 py-3 font-bold text-right">IGST</th>
              </tr>
            </thead>
            <tbody>
              {TDS_GST_REPORT_DATA.length > 0 ? (
                TDS_GST_REPORT_DATA.map((row, index) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-100 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors whitespace-nowrap"
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{row.officeName}</td>
                    <td className="px-4 py-3">{row.partyName}</td>
                    <td className="px-4 py-3">{row.gstNo}</td>
                    <td className="px-4 py-3 text-right">
                      {formatCurrency(row.totalBillAmount)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatCurrency(row.paymentAmount)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatCurrency(row.basicAmount)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatCurrency(row.gstTdsAmount)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatCurrency(row.cgst)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatCurrency(row.sgst)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatCurrency(row.igst)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={11}
                    className="px-4 py-8 text-center text-xs text-slate-400 font-medium"
                  >
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="bg-[#f8f9fc] border-t-2 border-b-2 border-gray-200 text-xs font-extrabold text-slate-800 whitespace-nowrap">
                <td colSpan={4} className="px-4 py-4 uppercase">
                  Total Summary
                </td>
                <td className="px-4 py-4 text-right">
                  {formatCurrency(totals.totalBillAmount)}
                </td>
                <td className="px-4 py-4 text-right">
                  {formatCurrency(totals.paymentAmount)}
                </td>
                <td className="px-4 py-4 text-right">
                  {formatCurrency(totals.basicAmount)}
                </td>
                <td className="px-4 py-4 text-right">
                  {formatCurrency(totals.gstTdsAmount)}
                </td>
                <td className="px-4 py-4 text-right">
                  {formatCurrency(totals.cgst)}
                </td>
                <td className="px-4 py-4 text-right">
                  {formatCurrency(totals.sgst)}
                </td>
                <td className="px-4 py-4 text-right">
                  {formatCurrency(totals.igst)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
