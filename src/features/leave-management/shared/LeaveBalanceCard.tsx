import './LeaveBalanceCard.css';

export interface LeaveBalanceEntry {
  type: string;
  allocated: number;
  used: number;
  remaining: number;
  carryForward?: number;
}

interface LeaveBalanceCardProps {
  entries: LeaveBalanceEntry[];
  showCarryForward?: boolean;
}

export default function LeaveBalanceCard({
  entries,
  showCarryForward = false,
}: LeaveBalanceCardProps) {
  return (
    <div className="leave-balance-card">
      {/* Header */}
      <div className="leave-balance-header-row">
        <span className="leave-balance-col-label">Leave Type</span>
        <span className="leave-balance-col-label">Alloc.</span>
        <span className="leave-balance-col-label">Used</span>
        <span className="leave-balance-col-label">Rem.</span>
        {showCarryForward && (
          <span className="leave-balance-col-label">C/F</span>
        )}
      </div>

      {entries.map(entry => (
        <div key={entry.type} className="leave-balance-row">
          <span className="leave-balance-type">{entry.type}</span>
          <div className="leave-balance-values">
            <span className="leave-balance-chip allocated">{entry.allocated}</span>
            <span className="leave-balance-chip used">{entry.used}</span>
            <span className="leave-balance-chip remaining">{entry.remaining}</span>
            {showCarryForward && (
              <span className="leave-balance-chip carry">{entry.carryForward ?? 0}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
