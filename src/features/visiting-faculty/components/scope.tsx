import { createContext, useContext, useMemo } from 'react';
import { DropDownList } from 'shared/components/forms';
import { HOD_OPTIONS, hodBranchOf } from '../data';
import { useVisitingFacultyStore } from '../store';
import type { Application, Bill, DailyLog, Faculty } from '../types';
import { makeUniqueId } from '../utils';
import { DeptSwitcher } from './ui';

/**
 * Which login a department page is serving.
 * - `hod`: one branch of one UTD — processes applications, verifies
 *   attendance and prepares bills, then forwards to the UTD Department.
 * - `utd`: the whole UTD — reviews what its HODs forwarded and sends it on
 *   to the Registrar & VC (merit lists) or Finance (bills).
 */
export type Role = 'hod' | 'utd';

const ScopeContext = createContext<Role>('utd');

export function ScopeProvider({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  return <ScopeContext.Provider value={role}>{children}</ScopeContext.Provider>;
}

/** Auth is mocked — lets the reviewer pick which branch HOD they act as. */
export function HodSwitcher() {
  const hod = useVisitingFacultyStore(s => s.currentHod);
  const setCurrentHod = useVisitingFacultyStore(s => s.setCurrentHod);
  return (
    <div className="w-80 max-w-full">
      <DropDownList
        label="Signed in as HOD"
        data={HOD_OPTIONS}
        textField="text"
        valueField="id"
        filter
        value={`${hod.department}|${hod.branch}`}
        onChange={v => {
          if (!v) return;
          const [d, b] = (v as string).split('|');
          setCurrentHod(d, b);
        }}
      />
    </div>
  );
}

export function useScope() {
  const role = useContext(ScopeContext);
  const currentDept = useVisitingFacultyStore(s => s.currentDept);
  const hod = useVisitingFacultyStore(s => s.currentHod);
  const applications = useVisitingFacultyStore(s => s.applications);

  const isHod = role === 'hod';
  const dept = isHod ? hod.department : currentDept;
  const branch = isHod ? hod.branch : undefined;

  /** Branch of a faculty's appointment in a UTD — routes logs and bills. */
  const branchByFaculty = useMemo(() => {
    const m = new Map<string, string>();
    for (const a of applications) {
      if (a.status !== 'Joined') continue;
      const key = `${makeUniqueId(a.fullName, a.pan)}|${a.department}`;
      if (!m.has(key)) m.set(key, hodBranchOf(a));
    }
    return m;
  }, [applications]);

  const branchOfFaculty = (uniqueId: string, department: string) =>
    branchByFaculty.get(`${uniqueId}|${department}`);

  return {
    role,
    isHod,
    dept,
    branch,
    /** Breadcrumb login key. */
    login: (isHod ? 'hod' : 'department') as 'hod' | 'department',
    title: isHod ? `${dept} — ${branch} HOD` : `UTD Department — ${dept}`,
    Switcher: isHod ? HodSwitcher : DeptSwitcher,
    branchOfFaculty,
    appInScope: (a: Application) =>
      a.department === dept && (!isHod || hodBranchOf(a) === branch),
    logInScope: (l: DailyLog) =>
      l.department === dept &&
      (!isHod || branchOfFaculty(l.uniqueId, l.department) === branch),
    billInScope: (b: Bill) =>
      b.department === dept &&
      (!isHod ||
        (b.branch ?? branchOfFaculty(b.uniqueId, b.department)) === branch),
    facultyInScope: (f: Faculty) =>
      f.appointments.some(
        a => a.department === dept && (!isHod || a.branch === branch)
      ),
  };
}
