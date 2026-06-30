import { useMemo, useState } from 'react';
import { FormPage, FormCard } from 'shared/new-components';
import { DropDownList } from 'shared/components/forms';
import { TicketTable } from '../../components';
import { initialTickets } from '../../data';
import { itsmUrls } from '../../urls';

export default function AdminTicketQueue() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterModule, setFilterModule] = useState('all');

  const modules = useMemo(
    () => ['all', ...new Set(initialTickets.map(t => t.module))],
    []
  );
  const statuses = useMemo(
    () => ['all', ...new Set(initialTickets.map(t => t.status))],
    []
  );
  const priorities = useMemo(
    () => ['all', 'Critical', 'High', 'Medium', 'Low'],
    []
  );

  const filtered = useMemo(() => {
    return initialTickets.filter(t => {
      if (filterStatus !== 'all' && t.status !== filterStatus) return false;
      if (filterPriority !== 'all' && t.priority !== filterPriority)
        return false;
      if (filterModule !== 'all' && t.module !== filterModule) return false;
      return true;
    });
  }, [filterStatus, filterPriority, filterModule]);

  return (
    <FormPage
      title="Ticket Queue"
      description="Full ticket queue with advanced filters."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'IT Service Desk', to: itsmUrls.portal },
        { label: 'Ticket Queue' },
      ]}
    >
      <FormCard>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 items-center">
          <DropDownList
            value={filterStatus}
            onChange={(v: any) => setFilterStatus(v)}
            data={statuses.map(s => ({
              label: s === 'all' ? 'All Statuses' : s,
              value: s,
            }))}
            textField="label"
            optionValue="value"
            defaultOptionText="All Statuses"
          />
          <DropDownList
            value={filterPriority}
            onChange={(v: any) => setFilterPriority(v)}
            data={priorities.map(p => ({
              label: p === 'all' ? 'All Priorities' : p,
              value: p,
            }))}
            textField="label"
            optionValue="value"
            defaultOptionText="All Priorities"
          />
          <DropDownList
            value={filterModule}
            onChange={(v: any) => setFilterModule(v)}
            data={modules.map(m => ({
              label: m === 'all' ? 'All Modules' : m,
              value: m,
            }))}
            textField="label"
            optionValue="value"
            defaultOptionText="All Modules"
          />
        </div>
        <TicketTable data={filtered} title="All Tickets" />
      </FormCard>
    </FormPage>
  );
}
