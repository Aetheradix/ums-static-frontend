import { useMemo, useState } from 'react';
import { FormCard, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';
import { Button } from 'shared/components/buttons';

export default function OccupancyReport() {
  const { hostels, buildings, roomAllotments } = useHostel();

  const [selectedHostel, setSelectedHostel] = useState<string>('');

  const reportData = useMemo(() => {
    let targetHostels = hostels;
    if (selectedHostel) {
      targetHostels = hostels.filter(h => h.id === selectedHostel);
    }

    return targetHostels.map(hostel => {
      // Get all allotments for this hostel that are currently occupied
      const hAllotments = roomAllotments.filter(a => a.hostelId === hostel.id);
      const activeAllotments = hAllotments.filter(
        a => a.status === 'PENDING_CHECKIN' || a.status === 'CHECKED_IN'
      );

      const hostelBuildings = buildings.filter(b => b.hostelId === hostel.id);
      const totalCapacity = hostelBuildings.reduce(
        (sum, b) =>
          sum +
          b.floors.reduce(
            (fSum, f) =>
              fSum + f.rooms.reduce((rSum, r) => rSum + r.capacity, 0),
            0
          ),
        0
      );

      const buildingData = hostelBuildings.map(b => {
        const buildingAllotments = activeAllotments.filter(a =>
          a.roomId.includes(b.id)
        );

        const buildingCapacity = b.floors.reduce(
          (fSum, f) => fSum + f.rooms.reduce((rSum, r) => rSum + r.capacity, 0),
          0
        );
        const occupied = buildingAllotments.length;
        const vacant = buildingCapacity - occupied;

        return {
          id: b.id,
          name: b.name,
          capacity: totalCapacity,
          occupied,
          vacant,
          occupancyRate: buildingCapacity
            ? Math.round((occupied / buildingCapacity) * 100)
            : 0,
        };
      });

      const totalOccupied = activeAllotments.length;
      const totalVacant = totalCapacity - totalOccupied;
      const occupancyRate = Math.round(
        (totalOccupied / (totalCapacity || 1)) * 100
      );

      return {
        id: hostel.id,
        name: hostel.hostelName,
        totalCapacity,
        totalOccupied,
        totalVacant,
        occupancyRate,
        buildingData,
      };
    });
  }, [hostels, buildings, roomAllotments, selectedHostel]);

  const exportToCSV = () => {
    // Mock export functionality
    alert('Exporting Occupancy Report to CSV...');
  };

  return (
    <FormPage
      title="Occupancy Report"
      description="Detailed view of hostel capacity, occupied beds, and vacant rooms."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        { label: 'Reports', to: '/hostel-management/reports/admin-dashboard' },
        { label: 'Occupancy Report' },
      ]}
    >
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Filter by Hostel
          </label>
          <select
            value={selectedHostel}
            onChange={e => setSelectedHostel(e.target.value)}
            className="w-full sm:w-64 border p-2 rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
          >
            <option value="">All Hostels</option>
            {hostels.map(h => (
              <option key={h.id} value={h.id}>
                {h.hostelName}
              </option>
            ))}
          </select>
        </div>
        <Button label="Export CSV" variant="outlined" onClick={exportToCSV} />
      </div>

      <div className="space-y-6">
        {reportData.map(hostel => (
          <FormCard
            key={hostel.id}
            title={`${hostel.name} - Overall Occupancy: ${hostel.occupancyRate}%`}
            icon="apartment"
          >
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700 text-center">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">
                  Total Capacity
                </p>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {hostel.totalCapacity}
                </p>
              </div>
              <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg border border-primary-100 dark:border-primary-900/50 text-center">
                <p className="text-xs text-primary-600 dark:text-primary-400 uppercase font-bold tracking-wider mb-1">
                  Occupied
                </p>
                <p className="text-2xl font-bold text-primary-700 dark:text-primary-300">
                  {hostel.totalOccupied}
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-900/50 text-center">
                <p className="text-xs text-green-600 dark:text-green-400 uppercase font-bold tracking-wider mb-1">
                  Vacant
                </p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {hostel.totalVacant}
                </p>
              </div>
            </div>

            <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-3 border-b border-slate-200 dark:border-slate-700 pb-2">
              Building-wise Breakdown
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                    <th className="p-2 font-medium">Building Name</th>
                    <th className="p-2 font-medium text-right">Capacity</th>
                    <th className="p-2 font-medium text-right">Occupied</th>
                    <th className="p-2 font-medium text-right">Vacant</th>
                    <th className="p-2 font-medium w-1/3">Fill Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {hostel.buildingData.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-4 text-center text-slate-500"
                      >
                        No buildings defined for this hostel.
                      </td>
                    </tr>
                  )}
                  {hostel.buildingData.map(b => (
                    <tr
                      key={b.id}
                      className="border-b border-slate-200 dark:border-slate-700"
                    >
                      <td className="p-2 font-medium">{b.name}</td>
                      <td className="p-2">{b.capacity}</td>
                      <td className="p-2 text-right font-semibold text-primary-600">
                        {b.occupied}
                      </td>
                      <td className="p-2 text-right font-semibold text-green-600">
                        {b.vacant}
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                b.occupancyRate > 90
                                  ? 'bg-red-500'
                                  : b.occupancyRate > 75
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                              }`}
                              style={{ width: `${b.occupancyRate}%` }}
                            ></div>
                          </div>
                          <span className="text-xs w-8 text-right">
                            {b.occupancyRate}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FormCard>
        ))}
      </div>
    </FormPage>
  );
}
