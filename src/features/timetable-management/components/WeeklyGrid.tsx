import { timeSlots, WEEK_DAYS, type TimetableEntry } from '../mocks';
import '../Timetable.css';

interface WeeklyGridProps {
  entries: TimetableEntry[];
}

export default function WeeklyGrid({ entries }: WeeklyGridProps) {
  const cellFor = (day: string, period: number) =>
    entries.find(e => e.day === day && e.period === period);

  return (
    <div className="ttm-week-scroll">
      <table className="ttm-week-table">
        <thead>
          <tr className="ttm-week-head">
            <th>Day / Period</th>
            {timeSlots.map(slot => (
              <th key={slot.id}>
                {slot.label}
                <div className="ttm-week-meta">
                  {slot.startTime}-{slot.endTime}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {WEEK_DAYS.map(day => (
            <tr key={day}>
              <td className="ttm-week-daycol">{day}</td>
              {timeSlots.map(slot => {
                const entry = cellFor(day, slot.period);
                return (
                  <td key={slot.id}>
                    {entry ? (
                      <div className="ttm-week-cell">
                        <div className="ttm-week-course">
                          {entry.courseName}
                        </div>
                        <div className="ttm-week-meta">{entry.roomName}</div>
                        <div className="ttm-week-meta">{entry.facultyName}</div>
                      </div>
                    ) : (
                      <span className="ttm-week-empty">—</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
