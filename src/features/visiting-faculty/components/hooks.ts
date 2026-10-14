import { useMemo, useState } from 'react';
import { deriveFaculty, useVisitingFacultyStore } from '../store';
import { vfUrls } from '../urls';

/** Checkbox selection state for `BulkSelectTable`. */
export function useSelection(ids: string[]) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const live = new Set([...selected].filter(id => ids.includes(id)));
  return {
    selected: live,
    ids: [...live],
    toggleOne: (id: string) =>
      setSelected(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      }),
    toggleAll: () =>
      setSelected(live.size === ids.length ? new Set() : new Set(ids)),
    clear: () => setSelected(new Set()),
    set: (next: string[]) => setSelected(new Set(next)),
  };
}

export function useFaculty() {
  const applications = useVisitingFacultyStore(s => s.applications);
  return useMemo(() => deriveFaculty(applications), [applications]);
}

const LOGINS = {
  department: { label: 'UTD Department Login', to: vfUrls.department.portal },
  headOffice: {
    label: 'Registrar & VC Sir Login',
    to: vfUrls.headOffice.portal,
  },
  finance: { label: 'Finance Department Login', to: vfUrls.finance.portal },
  mobile: { label: 'Mobile App', to: vfUrls.mobile.portal },
};

export const crumbs = (login: keyof typeof LOGINS, page: string) => [
  { label: 'Home', to: '/home' },
  { label: 'Visiting Faculty', to: vfUrls.portal },
  LOGINS[login],
  { label: page },
];
