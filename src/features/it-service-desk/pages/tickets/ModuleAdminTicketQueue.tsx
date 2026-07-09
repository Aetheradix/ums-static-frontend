import { useMemo, useState } from 'react';
import { FormPage, FormCard } from 'shared/new-components';
import { DropDownList } from 'shared/components/forms';
import { TicketTable } from '../../components';
import { initialTickets } from '../../data';
import { itsmUrls } from '../../urls';

export default function ModuleAdminTicketQueue() {
  const moduleTickets = useMemo(
    () =>
      initialTickets.filter(
        t =>
          t.module === 'Software & Licenses' ||
          t.module === 'Workstation Hardware'
      ),
    []
  );
  const [filterStatus, setFilterStatus] = useState('all');
  const statuses = useMemo(
    () => ['all', ...new Set(moduleTickets.map(t => t.status))],
    [moduleTickets]
  );

  const filtered = useMemo(() => {
    if (filterStatus === 'all') return moduleTickets;
    return moduleTickets.filter(t => t.status === filterStatus);
  }, [moduleTickets, filterStatus]);

  return (
    <FormPage
      title="Module Ticket Queue"
      description="Tickets from your assigned modules."
      breadcrumbs={[
        { label: 'IT Service Desk', to: itsmUrls.portal },
        { label: 'Module Ticket Queue' },
      ]}
    >
      <FormCard>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4 items-center">
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
        </div>
        <TicketTable data={filtered} />
      </FormCard>
    </FormPage>
  );
}
