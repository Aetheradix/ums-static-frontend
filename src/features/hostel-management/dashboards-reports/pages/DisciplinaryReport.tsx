import { useMemo, useState } from 'react';
import { FormCard, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';
import { Button } from 'shared/components/buttons';

export default function DisciplinaryReport() {
  const { hostels, disciplinaryActions } = useHostel();

  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const reportData = useMemo(() => {
    // Filter by date if specified
    let filteredActions = disciplinaryActions;
    if (dateRange.start) {
      filteredActions = filteredActions.filter(
        a => a.incidentDate >= dateRange.start
      );
    }
    if (dateRange.end) {
      filteredActions = filteredActions.filter(
        a => a.incidentDate <= dateRange.end
      );
    }

    // Aggregate by Hostel
    const hostelData = hostels.map(hostel => {
      const actions = filteredActions.filter(a => a.hostelId === hostel.id);

      const counts = {
        total: actions.length,
        open: actions.filter(a => a.status === 'OPEN').length,
        closed: actions.filter(a => a.status === 'CLOSED').length,
      };

      // Aggregate by infraction type (simplified categorization based on description for demo)
      let minor = 0,
        major = 0;
      actions.forEach(a => {
        if (
          a.description.toLowerCase().includes('late') ||
          a.description.toLowerCase().includes('noise')
        )
          minor++;
        else major++;
      });

      return {
        ...hostel,
        counts,
        minor,
        major,
      };
    });

    const totalActions = filteredActions.length;
    const totalOpen = filteredActions.filter(a => a.status === 'OPEN').length;

    return { hostelData, totalActions, totalOpen };
  }, [hostels, disciplinaryActions, dateRange]);

  const exportToCSV = () => {
    alert('Exporting Disciplinary Report to CSV...');
  };

  return (
    <FormPage
      title="Disciplinary Actions Report"
      description="Overview of student infractions and disciplinary actions across hostels."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        { label: 'Reports', to: '/hostel-management/reports/admin-dashboard' },
        { label: 'Disciplinary Report' },
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 flex justify-between items-center shadow-sm">
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
              Total Incidents
            </p>
            <p className="text-4xl font-bold text-slate-800 dark:text-slate-100">
              {reportData.totalActions}
            </p>
          </div>
          <span className="material-symbols-outlined text-5xl text-slate-200 dark:text-slate-700">
            gavel
          </span>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-5 border border-red-200 dark:border-red-800/50 flex justify-between items-center shadow-sm">
          <div>
            <p className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">
              Active / Pending Cases
            </p>
            <p className="text-4xl font-bold text-red-700 dark:text-red-300">
              {reportData.totalOpen}
            </p>
          </div>
          <span className="material-symbols-outlined text-5xl text-red-200 dark:text-red-900/50">
            warning
          </span>
        </div>
      </div>

      <FormCard title="Hostel-wise Breakdown" icon="summarize">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                <th className="p-3 font-medium border-b border-slate-200 dark:border-slate-700">
                  Hostel Name
                </th>
                <th className="p-3 font-medium border-b border-slate-200 dark:border-slate-700 text-center">
                  Total Cases
                </th>
                <th className="p-3 font-medium border-b border-slate-200 dark:border-slate-700 text-center text-red-600">
                  Open
                </th>
                <th className="p-3 font-medium border-b border-slate-200 dark:border-slate-700 text-center text-green-600">
                  Closed
                </th>
                <th className="p-3 font-medium border-b border-slate-200 dark:border-slate-700 text-center border-l border-slate-200 dark:border-slate-700">
                  Minor / Major Split
                </th>
              </tr>
            </thead>
            <tbody>
              {reportData.hostelData.map(hostel => (
                <tr
                  key={hostel.id}
                  className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="p-3 font-bold text-slate-800 dark:text-slate-200">
                    {hostel.hostelName}
                  </td>
                  <td className="p-3 text-center font-bold text-slate-600 dark:text-slate-400">
                    {hostel.counts.total}
                  </td>
                  <td className="p-3 text-center font-semibold text-red-600">
                    {hostel.counts.open}
                  </td>
                  <td className="p-3 text-center font-semibold text-green-600">
                    {hostel.counts.closed}
                  </td>
                  <td className="p-3 text-center border-l border-slate-200 dark:border-slate-700">
                    {hostel.counts.total > 0 ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xs text-slate-500">
                          {hostel.minor} Minor
                        </span>
                        <div className="flex-1 max-w-[100px] h-2 bg-red-100 rounded-full flex overflow-hidden">
                          <div
                            className="bg-yellow-400 h-full"
                            style={{
                              width: `${(hostel.minor / hostel.counts.total) * 100}%`,
                            }}
                          ></div>
                          <div
                            className="bg-red-500 h-full"
                            style={{
                              width: `${(hostel.major / hostel.counts.total) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-red-600">
                          {hostel.major} Major
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">No Data</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormCard>
    </FormPage>
  );
}
