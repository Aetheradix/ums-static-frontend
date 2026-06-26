import { useState } from 'react';
import './AttendanceCalendar.css';

type DayStatus = 'present' | 'absent' | 'leave' | 'holiday' | 'exam' | 'future' | 'empty';

interface DayData {
  date: number;
  status: DayStatus;
  label?: string;
}

interface AttendanceCalendarProps {
  /** Month (0-indexed) and Year to display */
  month?: number;
  year?: number;
  /** Map of day → status for the given month */
  dayMap?: Record<number, DayStatus>;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Default mock attendance map for current month
const buildDefaultMap = (year: number, month: number): Record<number, DayStatus> => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const map: Record<number, DayStatus> = {};
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
    if (date > today && !isToday) { map[d] = 'future'; continue; }
    const dow = date.getDay();
    if (dow === 0 || dow === 6) { map[d] = 'holiday'; continue; }
    // Simulate some random pattern
    const r = (d * 7 + month * 31) % 10;
    if (r < 7) map[d] = 'present';
    else if (r === 7) map[d] = 'absent';
    else if (r === 8) map[d] = 'leave';
    else map[d] = 'present';
  }
  return map;
};

export default function AttendanceCalendar({
  month: initMonth,
  year: initYear,
  dayMap: externalMap,
}: AttendanceCalendarProps) {
  const today = new Date();
  const [month, setMonth] = useState(initMonth ?? today.getMonth());
  const [year, setYear] = useState(initYear ?? today.getFullYear());

  const dayMap = externalMap ?? buildDefaultMap(year, month);

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: DayData[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push({ date: 0, status: 'empty' });
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: d, status: dayMap[d] ?? 'future' });
  }

  const isToday = (d: number) =>
    today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;

  const goBack = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const goForward = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const present = Object.values(dayMap).filter(v => v === 'present').length;
  const absent = Object.values(dayMap).filter(v => v === 'absent').length;
  const leave = Object.values(dayMap).filter(v => v === 'leave').length;
  const holiday = Object.values(dayMap).filter(v => v === 'holiday').length;

  return (
    <div className="att-calendar-wrapper">
      <div className="att-calendar-month-header">
        <button type="button" className="att-calendar-nav-btn" onClick={goBack}>
          <i className="pi pi-chevron-left" style={{ fontSize: '0.75rem' }} />
        </button>
        <span className="att-calendar-month-title">{MONTH_NAMES[month]} {year}</span>
        <button type="button" className="att-calendar-nav-btn" onClick={goForward}>
          <i className="pi pi-chevron-right" style={{ fontSize: '0.75rem' }} />
        </button>
      </div>

      <div className="att-calendar-grid">
        {DAYS_OF_WEEK.map(d => (
          <div key={d} className="att-calendar-day-header">{d}</div>
        ))}
        {cells.map((cell, idx) => (
          <div
            key={idx}
            className={`att-calendar-cell ${cell.status}${isToday(cell.date) ? ' today' : ''}`}
            title={cell.status !== 'empty' ? `Day ${cell.date}: ${cell.status}` : undefined}
          >
            {cell.date > 0 ? cell.date : ''}
          </div>
        ))}
      </div>

      <div className="att-calendar-legend">
        <span className="att-calendar-legend-item">
          <span className="att-calendar-legend-dot present" />Present ({present})
        </span>
        <span className="att-calendar-legend-item">
          <span className="att-calendar-legend-dot absent" />Absent ({absent})
        </span>
        <span className="att-calendar-legend-item">
          <span className="att-calendar-legend-dot leave" />Leave ({leave})
        </span>
        <span className="att-calendar-legend-item">
          <span className="att-calendar-legend-dot holiday" />Holiday ({holiday})
        </span>
      </div>
    </div>
  );
}
