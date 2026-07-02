import { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { FormPage, FormCard } from 'shared/new-components';

interface ClassSession {
  subject: string;
  code: string;
  faculty: string;
  room: string;
  type: 'Lecture' | 'Practical' | 'Tutorial';
}

type DaySchedule = {
  [timeSlot: string]: ClassSession | null;
};

type WeeklySchedule = {
  [day: string]: DaySchedule;
};

const timeSlots = [
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:15 - 12:15',
  '12:15 - 13:15',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const mockSchedule: WeeklySchedule = {
  Monday: {
    '09:00 - 10:00': {
      subject: 'Advanced Algorithms',
      code: 'CS-301',
      faculty: 'Dr. Smith',
      room: 'LT-1',
      type: 'Lecture',
    },
    '10:00 - 11:00': {
      subject: 'Database Systems',
      code: 'CS-302',
      faculty: 'Prof. Johnson',
      room: 'LT-2',
      type: 'Lecture',
    },
    '11:15 - 12:15': null,
    '12:15 - 13:15': {
      subject: 'Machine Learning',
      code: 'CS-303',
      faculty: 'Dr. AI',
      room: 'LT-3',
      type: 'Lecture',
    },
    '14:00 - 15:00': {
      subject: 'Algorithms Lab',
      code: 'CS-301P',
      faculty: 'Dr. Smith',
      room: 'Lab-A',
      type: 'Practical',
    },
    '15:00 - 16:00': {
      subject: 'Algorithms Lab',
      code: 'CS-301P',
      faculty: 'Dr. Smith',
      room: 'Lab-A',
      type: 'Practical',
    },
    '16:00 - 17:00': null,
  },
  Tuesday: {
    '09:00 - 10:00': {
      subject: 'Machine Learning',
      code: 'CS-303',
      faculty: 'Dr. AI',
      room: 'LT-3',
      type: 'Lecture',
    },
    '10:00 - 11:00': null,
    '11:15 - 12:15': {
      subject: 'Advanced Algorithms',
      code: 'CS-301',
      faculty: 'Dr. Smith',
      room: 'LT-1',
      type: 'Lecture',
    },
    '12:15 - 13:15': {
      subject: 'Database Systems',
      code: 'CS-302',
      faculty: 'Prof. Johnson',
      room: 'LT-2',
      type: 'Lecture',
    },
    '14:00 - 15:00': null,
    '15:00 - 16:00': null,
    '16:00 - 17:00': {
      subject: 'Project Seminar',
      code: 'CS-399',
      faculty: 'Dr. Brown',
      room: 'Conf-1',
      type: 'Tutorial',
    },
  },
  Wednesday: {
    '09:00 - 10:00': null,
    '10:00 - 11:00': null,
    '11:15 - 12:15': {
      subject: 'Machine Learning',
      code: 'CS-303',
      faculty: 'Dr. AI',
      room: 'LT-3',
      type: 'Lecture',
    },
    '12:15 - 13:15': {
      subject: 'Database Systems',
      code: 'CS-302',
      faculty: 'Prof. Johnson',
      room: 'LT-2',
      type: 'Lecture',
    },
    '14:00 - 15:00': {
      subject: 'DBMS Lab',
      code: 'CS-302P',
      faculty: 'Prof. Johnson',
      room: 'Lab-B',
      type: 'Practical',
    },
    '15:00 - 16:00': {
      subject: 'DBMS Lab',
      code: 'CS-302P',
      faculty: 'Prof. Johnson',
      room: 'Lab-B',
      type: 'Practical',
    },
    '16:00 - 17:00': null,
  },
  Thursday: {
    '09:00 - 10:00': {
      subject: 'Database Systems',
      code: 'CS-302',
      faculty: 'Prof. Johnson',
      room: 'LT-2',
      type: 'Lecture',
    },
    '10:00 - 11:00': {
      subject: 'Advanced Algorithms',
      code: 'CS-301',
      faculty: 'Dr. Smith',
      room: 'LT-1',
      type: 'Lecture',
    },
    '11:15 - 12:15': null,
    '12:15 - 13:15': null,
    '14:00 - 15:00': {
      subject: 'ML Lab',
      code: 'CS-303P',
      faculty: 'Dr. AI',
      room: 'Lab-C',
      type: 'Practical',
    },
    '15:00 - 16:00': {
      subject: 'ML Lab',
      code: 'CS-303P',
      faculty: 'Dr. AI',
      room: 'Lab-C',
      type: 'Practical',
    },
    '16:00 - 17:00': null,
  },
  Friday: {
    '09:00 - 10:00': null,
    '10:00 - 11:00': null,
    '11:15 - 12:15': {
      subject: 'Advanced Algorithms',
      code: 'CS-301',
      faculty: 'Dr. Smith',
      room: 'LT-1',
      type: 'Lecture',
    },
    '12:15 - 13:15': {
      subject: 'Machine Learning',
      code: 'CS-303',
      faculty: 'Dr. AI',
      room: 'LT-3',
      type: 'Lecture',
    },
    '14:00 - 15:00': null,
    '15:00 - 16:00': null,
    '16:00 - 17:00': null,
  },
};

export default function Timetable() {
  const [selectedSemester, setSelectedSemester] = useState(
    'Semester 3 (Current)'
  );

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'Lecture':
        return 'bg-blue-50 border-l-4 border-blue-500 hover:bg-blue-100';
      case 'Practical':
        return 'bg-purple-50 border-l-4 border-purple-500 hover:bg-purple-100';
      case 'Tutorial':
        return 'bg-orange-50 border-l-4 border-orange-500 hover:bg-orange-100';
      default:
        return 'bg-gray-50 border-l-4 border-gray-300';
    }
  };

  return (
    <FormPage
      title="My Timetable"
      description="View your weekly class schedule and venue details"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 items-center">
          <label className="font-semibold text-gray-700">
            Select Semester:
          </label>
          <Dropdown
            value={selectedSemester}
            options={['Semester 1', 'Semester 2', 'Semester 3 (Current)']}
            onChange={e => setSelectedSemester(e.value)}
            className="w-64"
          />
        </div>
        <div className="flex gap-4 text-sm font-medium text-gray-600">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span> Lecture
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-500"></span>{' '}
            Practical
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>{' '}
            Tutorial
          </div>
        </div>
      </div>

      <FormCard className="p-0 overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse min-w-[1000px]">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="p-4 font-bold text-gray-700 w-32 border-r border-gray-200">
                Time / Day
              </th>
              {days.map(day => (
                <th
                  key={day}
                  className="p-4 font-bold text-gray-700 text-center border-r border-gray-200 last:border-r-0"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(time => (
              <tr
                key={time}
                className="border-b border-gray-100 last:border-b-0"
              >
                <td className="p-4 font-semibold text-gray-600 border-r border-gray-200 bg-gray-50">
                  {time}
                </td>
                {days.map(day => {
                  const session = mockSchedule[day][time];
                  return (
                    <td
                      key={`${day}-${time}`}
                      className="p-2 border-r border-gray-100 last:border-r-0 text-center align-top h-24"
                    >
                      {session ? (
                        <div
                          className={`flex flex-col justify-center h-full p-2 rounded transition-colors ${getTypeStyles(session.type)}`}
                        >
                          <span className="font-bold text-gray-800 leading-tight">
                            {session.subject}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            {session.code} • {session.type}
                          </span>
                          <div className="flex justify-between items-center mt-2 text-xs font-semibold text-gray-600">
                            <span>
                              <i className="pi pi-user mr-1 text-[10px]"></i>
                              {session.faculty}
                            </span>
                            <span>
                              <i className="pi pi-map-marker mr-1 text-[10px]"></i>
                              {session.room}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-300 text-xs">
                          -
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </FormCard>
    </FormPage>
  );
}
