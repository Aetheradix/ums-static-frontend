import './BiometricWidget.css';

interface BiometricWidgetProps {
  punchIn?: string;
  punchOut?: string;
  workingHours?: string;
  presentDays?: number;
  absentDays?: number;
  lateEntries?: number;
  attendancePct?: number;
  biometricStatus?: 'OK' | 'Missing Punch' | 'Late Entry';
}

export default function BiometricWidget({
  punchIn = '09:02',
  punchOut = '--:--',
  workingHours = 'In Progress',
  presentDays = 18,
  absentDays = 2,
  lateEntries = 1,
  attendancePct = 87,
  biometricStatus = 'OK',
}: BiometricWidgetProps) {
  const statusDot =
    biometricStatus === 'OK' ? 'ok'
      : biometricStatus === 'Missing Punch' ? 'missing'
        : 'late';

  const attColor =
    attendancePct >= 85 ? '#16a34a'
      : attendancePct >= 75 ? '#f59e0b'
        : '#ef4444';

  return (
    <div className="biometric-widget">
      {/* Punch cards */}
      <div className="biometric-punch-row">
        <div className="biometric-punch-card punch-in">
          <span className="biometric-punch-label">Punch In</span>
          <span className="biometric-punch-time">{punchIn}</span>
          <span className="biometric-punch-status">Today</span>
        </div>
        <div className="biometric-punch-card punch-out">
          <span className="biometric-punch-label">Punch Out</span>
          <span className="biometric-punch-time">{punchOut}</span>
          <span className="biometric-punch-status">{workingHours}</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="biometric-stats-row">
        <div className="biometric-stat-item">
          <span className="biometric-stat-value" style={{ color: '#16a34a' }}>{presentDays}</span>
          <span className="biometric-stat-label">Present</span>
        </div>
        <div className="biometric-stat-item">
          <span className="biometric-stat-value" style={{ color: '#ef4444' }}>{absentDays}</span>
          <span className="biometric-stat-label">Absent</span>
        </div>
        <div className="biometric-stat-item">
          <span className="biometric-stat-value" style={{ color: '#f59e0b' }}>{lateEntries}</span>
          <span className="biometric-stat-label">Late</span>
        </div>
      </div>

      {/* Status */}
      <div className="biometric-status-bar">
        <span className={`biometric-status-dot ${statusDot}`} />
        <span className="biometric-status-text">
          {biometricStatus}
        </span>
        <span className="biometric-status-sub">Biometric Status</span>
      </div>

      {/* Attendance % bar */}
      <div className="biometric-attendance-bar">
        <div className="biometric-att-label-row">
          <span className="biometric-att-label">Attendance Percentage</span>
          <span className="biometric-att-pct" style={{ color: attColor }}>{attendancePct}%</span>
        </div>
        <div className="biometric-att-track">
          <div
            className="biometric-att-fill"
            style={{ width: `${attendancePct}%`, background: attColor }}
          />
        </div>
      </div>
    </div>
  );
}
