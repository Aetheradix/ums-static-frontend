import { useMemo, useState } from 'react';
import { FormCard, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';
import { Button } from 'shared/components/buttons';

export default function IncidentAnalysisReport() {
  const { hostels, incidentReports } = useHostel();

  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const reportData = useMemo(() => {
    // Filter by date if specified
    let filteredIncidents = incidentReports;
    if (dateRange.start) {
      filteredIncidents = filteredIncidents.filter(
        i => i.date >= dateRange.start
      );
    }
    if (dateRange.end) {
      filteredIncidents = filteredIncidents.filter(
        i => i.date <= dateRange.end
      );
    }

    // Aggregate globally for severity breakdown
    const severityCounts = {
      LOW: filteredIncidents.filter(i => i.severity === 'LOW').length,
      MEDIUM: filteredIncidents.filter(i => i.severity === 'MEDIUM').length,
      HIGH: filteredIncidents.filter(i => i.severity === 'HIGH').length,
    };

    // Aggregate by Hostel
    const hostelData = hostels
      .map(hostel => {
        const incidents = filteredIncidents.filter(
          i => i.hostelId === hostel.id
        );

        const statusCounts = {
          total: incidents.length,
          open: incidents.filter(i => i.status === 'OPEN').length,
          investigating: incidents.filter(i => i.status === 'INVESTIGATING')
            .length,
          resolved: incidents.filter(i => i.status === 'RESOLVED').length,
        };

        const hSeverity = {
          LOW: incidents.filter(i => i.severity === 'LOW').length,
          MEDIUM: incidents.filter(i => i.severity === 'MEDIUM').length,
          HIGH: incidents.filter(i => i.severity === 'HIGH').length,
        };

        return {
          ...hostel,
          statusCounts,
          hSeverity,
          recentIncidents: incidents
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .slice(0, 3),
        };
      })
      .filter(h => h.statusCounts.total > 0);

    return { hostelData, severityCounts, total: filteredIncidents.length };
  }, [hostels, incidentReports, dateRange]);

  const exportToCSV = () => {
    alert('Exporting Incident Analysis Report to CSV...');
  };

  return (
    <FormPage
      title="Incident Analysis Report"
      description="Track, categorize, and analyze incidents reported across the campus."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        { label: 'Reports', to: '/hostel-management/reports/admin-dashboard' },
        { label: 'Incident Analysis' },
      ]}
    >
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={e =>
                setDateRange(prev => ({ ...prev, start: e.target.value }))
              }
              className="border p-2 rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={e =>
                setDateRange(prev => ({ ...prev, end: e.target.value }))
              }
              className="border p-2 rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
          </div>
          <Button
            label="Clear"
            variant="outlined"
            onClick={() => setDateRange({ start: '', end: '' })}
          />
        </div>
        <Button label="Export CSV" variant="outlined" onClick={exportToCSV} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <div className="lg:col-span-2 bg-slate-900 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <span className="material-symbols-outlined text-[150px]">
              report
            </span>
          </div>
          <div className="relative z-10">
            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">
              Total Incidents Recorded
            </h3>
            <p className="text-6xl font-black mb-6">{reportData.total}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-xs">High</p>
                <p className="text-xl font-bold text-red-400">
                  {reportData.severityCounts.HIGH}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Low / Medium</p>
                <p className="text-xl font-bold text-yellow-400">
                  {reportData.severityCounts.LOW +
                    reportData.severityCounts.MEDIUM}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center">
          <h3 className="text-slate-700 dark:text-slate-300 font-bold mb-4">
            Severity Breakdown
          </h3>
          <div className="flex flex-col gap-4">
            {/* High */}
            <div className="flex items-center gap-3">
              <span className="w-16 text-xs font-bold text-red-600 dark:text-red-400">
                HIGH
              </span>
              <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-3">
                <div
                  className="bg-red-500 h-3 rounded-full"
                  style={{
                    width: `${reportData.total ? (reportData.severityCounts.HIGH / reportData.total) * 100 : 0}%`,
                  }}
                ></div>
              </div>
              <span className="w-8 text-right font-medium">
                {reportData.severityCounts.HIGH}
              </span>
            </div>
            {/* Medium */}
            <div className="flex items-center gap-3">
              <span className="w-16 text-xs font-bold text-yellow-600 dark:text-yellow-400">
                MEDIUM
              </span>
              <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-3">
                <div
                  className="bg-yellow-400 h-3 rounded-full"
                  style={{
                    width: `${reportData.total ? (reportData.severityCounts.MEDIUM / reportData.total) * 100 : 0}%`,
                  }}
                ></div>
              </div>
              <span className="w-8 text-right font-medium">
                {reportData.severityCounts.MEDIUM}
              </span>
            </div>
            {/* Low */}
            <div className="flex items-center gap-3">
              <span className="w-16 text-xs font-bold text-blue-600 dark:text-blue-400">
                LOW
              </span>
              <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-3">
                <div
                  className="bg-blue-400 h-3 rounded-full"
                  style={{
                    width: `${reportData.total ? (reportData.severityCounts.LOW / reportData.total) * 100 : 0}%`,
                  }}
                ></div>
              </div>
              <span className="w-8 text-right font-medium">
                {reportData.severityCounts.LOW}
              </span>
            </div>
          </div>
        </div>
      </div>

      <FormCard title="Hostel Wise Incident Details" icon="analytics">
        {reportData.hostelData.length === 0 ? (
          <div className="text-center p-8 text-slate-500">
            No incidents reported in the selected period.
          </div>
        ) : (
          <div className="space-y-6">
            {reportData.hostelData.map(hostel => (
              <div
                key={hostel.id}
                className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-800/50"
              >
                <div className="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
                  <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                    {hostel.hostelName}
                  </h4>
                  <div className="flex gap-3">
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-bold">
                      High: {hostel.hSeverity.HIGH}
                    </span>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-bold">
                      Investigating: {hostel.statusCounts.investigating}
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">
                      Resolved: {hostel.statusCounts.resolved}
                    </span>
                  </div>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-slate-500 uppercase mb-2">
                    Recent Incidents
                  </h5>
                  <div className="grid gap-3">
                    {hostel.recentIncidents.map(inc => (
                      <div
                        key={inc.id}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded flex flex-col md:flex-row justify-between md:items-center gap-2"
                      >
                        <div>
                          <div className="font-semibold text-sm">
                            {inc.description}
                          </div>
                          <div className="text-xs text-slate-500">
                            {inc.date} • Rep: {inc.reportedBy}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 text-[10px] font-bold rounded ${
                              inc.severity === 'HIGH'
                                ? 'bg-red-600 text-white'
                                : inc.severity === 'MEDIUM'
                                  ? 'bg-yellow-400 text-slate-900'
                                  : 'bg-blue-400 text-white'
                            }`}
                          >
                            {inc.severity}
                          </span>
                          <span
                            className={`px-2 py-1 text-[10px] font-bold rounded border ${
                              inc.status === 'OPEN'
                                ? 'border-red-300 text-red-600'
                                : inc.status === 'INVESTIGATING'
                                  ? 'border-yellow-300 text-yellow-600'
                                  : 'border-green-300 text-green-600'
                            }`}
                          >
                            {inc.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </FormCard>
    </FormPage>
  );
}
