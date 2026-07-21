import { useState, useMemo } from 'react';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

const MEALS = ['BREAKFAST', 'LUNCH', 'SNACKS', 'DINNER'] as const;

export default function MealAttendance() {
  const {
    hostels,
    studentApplications,
    mealAttendance,
    setMealAttendance,
    triggerNotification,
  } = useHostel();

  const [selectedHostel, setSelectedHostel] = useState(hostels[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [selectedMeal, setSelectedMeal] =
    useState<(typeof MEALS)[number]>('BREAKFAST');
  const [scannedStudentId, setScannedStudentId] = useState('');

  const activeStudents = useMemo(
    () => studentApplications.filter(s => s.status === 'APPROVED'),
    [studentApplications]
  );

  // Get attendance records for the selected filters
  const currentAttendance = useMemo(
    () =>
      mealAttendance.filter(
        (m: HostelManagement.MealAttendance) =>
          m.hostelId === selectedHostel &&
          m.date === selectedDate &&
          m.mealType === selectedMeal
      ),
    [mealAttendance, selectedHostel, selectedDate, selectedMeal]
  );

  const handleScan = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!scannedStudentId.trim()) return;

    // Validate student
    const student = activeStudents.find(
      s =>
        s.id === scannedStudentId ||
        s.id.toLowerCase() === scannedStudentId.toLowerCase()
    );

    if (!student) {
      triggerNotification(`Invalid Student ID: ${scannedStudentId}`, 'error');
      setScannedStudentId('');
      return;
    }

    // Check if already scanned
    if (
      currentAttendance.some(
        (a: HostelManagement.MealAttendance) => a.studentId === student.id
      )
    ) {
      triggerNotification(
        `${student.studentName} has already claimed this meal.`,
        'error'
      );
      setScannedStudentId('');
      return;
    }

    // Record attendance
    const newRecord: HostelManagement.MealAttendance = {
      id: `MA-${Date.now()}`,
      hostelId: selectedHostel,
      date: selectedDate,
      mealType: selectedMeal,
      studentId: student.id,
      scannedAt: new Date().toTimeString().split(' ')[0],
    };

    setMealAttendance([newRecord, ...mealAttendance]);
    triggerNotification(`Meal recorded for ${student.studentName}`, 'success');
    setScannedStudentId('');
  };

  return (
    <FormPage
      title="Meal Attendance Tracking"
      description="Record student meal consumption via ID scan."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Health & Mess',
          to: '/hostel-management/health/emergency-log',
        },
        { label: 'Meal Attendance' },
      ]}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <FormCard title="Scan Interface" icon="qr_code_scanner">
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Hostel
                </label>
                <select
                  value={selectedHostel}
                  onChange={e => setSelectedHostel(e.target.value)}
                  className="w-full border p-2 rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                >
                  {hostels.map(h => (
                    <option key={h.id} value={h.id}>
                      {h.hostelName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="w-full border p-2 rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Meal Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {MEALS.map(meal => (
                    <button
                      key={meal}
                      onClick={() => setSelectedMeal(meal)}
                      className={`px-2 py-2 rounded text-xs font-bold transition-colors ${
                        selectedMeal === meal
                          ? 'bg-primary-600 text-white'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {meal}
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-slate-200 dark:border-slate-700 my-2" />

              <form onSubmit={handleScan} className="flex flex-col gap-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                  Scan Student ID
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={scannedStudentId}
                    onChange={e => setScannedStudentId(e.target.value)}
                    placeholder="Enter or scan ID..."
                    autoFocus
                    className="flex-1 border-2 border-primary-300 p-2 rounded bg-white dark:bg-slate-900 focus:outline-none focus:border-primary-500 text-lg"
                  />
                  <Button
                    label="Submit"
                    variant="primary"
                    onClick={() => handleScan()}
                  />
                </div>
                <span className="text-xs text-slate-500">
                  Wait for barcode scanner input or type manually.
                </span>
              </form>
            </div>
          </FormCard>
        </div>

        <div className="w-full lg:w-2/3">
          <FormCard title="Scan Log" icon="format_list_numbered">
            <div className="flex justify-end mb-2">
              <span className="text-sm font-bold bg-primary-100 text-primary-800 px-3 py-1 rounded-full">
                Total Scans: {currentAttendance.length}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                    <th className="p-2 w-16">#</th>
                    <th className="p-2">Time</th>
                    <th className="p-2">Student ID</th>
                    <th className="p-2">Name</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAttendance.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-4 text-center text-slate-500"
                      >
                        No students scanned yet for this meal.
                      </td>
                    </tr>
                  )}
                  {currentAttendance.map(
                    (
                      record: HostelManagement.MealAttendance,
                      index: number
                    ) => {
                      const student = activeStudents.find(
                        s => s.id === record.studentId
                      );
                      return (
                        <tr
                          key={record.id}
                          className="border-b border-slate-200 dark:border-slate-700"
                        >
                          <td className="p-2 font-medium text-slate-400">
                            {currentAttendance.length - index}
                          </td>
                          <td className="p-2 font-semibold text-primary-600">
                            {record.scannedAt}
                          </td>
                          <td className="p-2">{record.studentId}</td>
                          <td className="p-2">
                            {student?.studentName || 'Unknown'}
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
