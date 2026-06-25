import { useCareerAdvancement } from '../context';
import { DropDownList } from 'shared/components/forms';

const ROLE_OPTIONS: Data.DataItem<string>[] = [
  { id: 'cas_admin', text: 'cas_admin (Admin)' },
  { id: 'cas_employee', text: 'cas_employee (Employee)' },
  { id: 'cas_reporting_officer', text: 'cas_reporting_officer (Reporting Officer)' },
  { id: 'cas_reviewing_officer', text: 'cas_reviewing_officer (Reviewing Officer)' },
  { id: 'cas_iqac', text: 'cas_iqac (IQAC)' },
  { id: 'HOD', text: 'HOD (Head of Department)' },
  { id: 'Dean', text: 'Dean (School Dean)' },
  { id: 'Dean Academics', text: 'Dean Academics (Final Reviewer)' },
];

export default function RoleSwitcher() {
  const { simulatedRole, setSimulatedRole, triggerNotification } =
    useCareerAdvancement();

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold text-base">
          🎭
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800">
            CAS Simulation Environment
          </h4>
          <p className="text-xs text-slate-500 font-semibold">
            Active Role: <span className="text-indigo-600 font-bold uppercase">{simulatedRole.replace('cas_', '').toUpperCase()}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 min-w-[280px]">
        <span className="text-xs font-bold text-slate-500 uppercase whitespace-nowrap">
          Switch Role:
        </span>
        <div className="flex-1">
          <DropDownList
            label=""
            data={ROLE_OPTIONS}
            textField="text"
            valueField="id"
            value={simulatedRole}
            onChange={v => {
              const nextRole = v as string;
              setSimulatedRole(nextRole);
              triggerNotification(`Switched simulated role to: ${nextRole.toUpperCase()}`);
            }}
          />
        </div>
      </div>
    </div>
  );
}
