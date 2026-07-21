import { useMemo, useState } from 'react';
import { FormCard, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';
import { Button } from 'shared/components/buttons';

export default function RevenueReport() {
  const { hostels, roomTypes, roomAllotments } = useHostel();

  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [selectedSemester, setSelectedSemester] = useState<string>('FALL');

  const reportData = useMemo(() => {
    // Generate mock revenue based on allotments
    // In a real system, this would query the fee management / finance module.

    // We'll calculate potential vs collected based on active/past allotments
    const hostelRevenues = hostels.map(hostel => {
      // Find active allotments for this hostel
      const activeAllotments = roomAllotments.filter(
        a => a.hostelId === hostel.id
      );

      let expectedRevenue = 0;
      let collectedRevenue = 0;

      activeAllotments.forEach(allotment => {
        // Find room type to get fee
        const rType = roomTypes.find(
          r => r.id === allotment.roomId.split('-')[0]
        ); // Mock mapping
        const fee = rType ? rType.monthlyFee : 50000; // fallback fee

        expectedRevenue += fee;

        // Mock collection: 80% paid, 20% pending
        if (Math.random() > 0.2) {
          collectedRevenue += fee;
        } else {
          collectedRevenue += fee * 0.5; // Partial payment
        }
      });

      const pendingRevenue = expectedRevenue - collectedRevenue;
      const collectionRate = expectedRevenue
        ? Math.round((collectedRevenue / expectedRevenue) * 100)
        : 0;

      return {
        ...hostel,
        expectedRevenue,
        collectedRevenue,
        pendingRevenue,
        collectionRate,
      };
    });

    const totalExpected = hostelRevenues.reduce(
      (sum, h) => sum + h.expectedRevenue,
      0
    );
    const totalCollected = hostelRevenues.reduce(
      (sum, h) => sum + h.collectedRevenue,
      0
    );
    const totalPending = totalExpected - totalCollected;
    const overallCollectionRate = totalExpected
      ? Math.round((totalCollected / totalExpected) * 100)
      : 0;

    return {
      hostelRevenues,
      totalExpected,
      totalCollected,
      totalPending,
      overallCollectionRate,
    };
  }, [hostels, roomTypes, roomAllotments, selectedYear, selectedSemester]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const exportToCSV = () => {
    alert('Exporting Revenue Report to CSV...');
  };

  return (
    <FormPage
      title="Hostel Revenue Report"
      description="Analyze fee collection, pending dues, and overall revenue generation."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        { label: 'Reports', to: '/hostel-management/reports/admin-dashboard' },
        { label: 'Revenue Report' },
      ]}
    >
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Academic Year
            </label>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="w-full border p-2 rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            >
              <option value="2024">2024-2025</option>
              <option value="2023">2023-2024</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Semester
            </label>
            <select
              value={selectedSemester}
              onChange={e => setSelectedSemester(e.target.value)}
              className="w-full border p-2 rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            >
              <option value="FALL">Fall / Odd</option>
              <option value="SPRING">Spring / Even</option>
            </select>
          </div>
        </div>
        <Button label="Export CSV" variant="outlined" onClick={exportToCSV} />
      </div>

      {/* Top Level Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
            Total Expected
          </p>
          <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            {formatCurrency(reportData.totalExpected)}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 border border-green-200 dark:border-green-800/50">
          <p className="text-sm font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2">
            Collected
          </p>
          <p className="text-3xl font-bold text-green-700 dark:text-green-300">
            {formatCurrency(reportData.totalCollected)}
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-5 border border-red-200 dark:border-red-800/50">
          <p className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-2">
            Pending Dues
          </p>
          <p className="text-3xl font-bold text-red-700 dark:text-red-300">
            {formatCurrency(reportData.totalPending)}
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800/50 flex flex-col justify-center items-center">
          <p className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
            Collection Rate
          </p>
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 36 36"
            >
              <path
                className="text-blue-200 dark:text-blue-900"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-blue-600 dark:text-blue-500"
                strokeDasharray={`${reportData.overallCollectionRate}, 100`}
                strokeWidth="3"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex items-center justify-center">
              <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
                {reportData.overallCollectionRate}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <FormCard title="Hostel-wise Revenue Breakdown" icon="bar_chart">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                <th className="p-3 font-medium">Hostel Name</th>
                <th className="p-3 font-medium text-right">Expected Revenue</th>
                <th className="p-3 font-medium text-right">Collected</th>
                <th className="p-3 font-medium text-right">Pending</th>
                <th className="p-3 font-medium text-center">Collection %</th>
              </tr>
            </thead>
            <tbody>
              {reportData.hostelRevenues.map(hostel => (
                <tr
                  key={hostel.id}
                  className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="p-3 font-bold text-slate-800 dark:text-slate-200">
                    {hostel.hostelName}
                  </td>
                  <td className="p-3 text-right font-medium">
                    {formatCurrency(hostel.expectedRevenue)}
                  </td>
                  <td className="p-3 text-right font-bold text-green-600">
                    {formatCurrency(hostel.collectedRevenue)}
                  </td>
                  <td className="p-3 text-right font-bold text-red-600">
                    {formatCurrency(hostel.pendingRevenue)}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                        hostel.collectionRate > 90
                          ? 'bg-green-100 text-green-700'
                          : hostel.collectionRate > 75
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {hostel.collectionRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 dark:bg-slate-800 font-bold border-t-2 border-slate-300 dark:border-slate-600">
                <td className="p-3">Total</td>
                <td className="p-3 text-right">
                  {formatCurrency(reportData.totalExpected)}
                </td>
                <td className="p-3 text-right text-green-600">
                  {formatCurrency(reportData.totalCollected)}
                </td>
                <td className="p-3 text-right text-red-600">
                  {formatCurrency(reportData.totalPending)}
                </td>
                <td className="p-3 text-center">
                  {reportData.overallCollectionRate}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </FormCard>
    </FormPage>
  );
}
