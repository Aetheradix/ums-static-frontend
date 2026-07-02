import { useMemo } from 'react';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
  Tabs,
} from 'shared/new-components';
import { statusVariant, type Channel, type Communication } from '../../mocks';
import { useCommunicationsQuery } from '../../queries';
import { commUrls } from '../../urls';

function LogGrid({
  rows,
  loading,
  emptyMessage,
}: {
  rows: Communication[];
  loading: boolean;
  emptyMessage: string;
}) {
  return (
    <FormCard>
      <GridPanel
        data={rows}
        loading={loading}
        searchBox
        searchPlaceholder="Search by subject or sender..."
        emptyMessage={emptyMessage}
        columns={[
          {
            header: 'S.No',
            width: '60px',
            cell: (_, o) => <span>{o.rowIndex + 1}</span>,
          },
          { field: 'date', header: 'Date', sortable: true },
          { field: 'recipientType', header: 'Recipients' },
          {
            header: 'Count',
            cell: (c: Communication) => (
              <span>{c.recipientCount.toLocaleString('en-IN')}</span>
            ),
          },
          { field: 'subject', header: 'Subject / Message' },
          { field: 'from', header: 'From' },
          {
            header: 'Status',
            cell: (c: Communication) => (
              <StatusBadge label={c.status} variant={statusVariant(c.status)} />
            ),
          },
        ]}
      />
    </FormCard>
  );
}

export default function Logs({
  roleCrumb = { url: commUrls.admin.portal, label: 'Communication Admin' },
}: {
  roleCrumb?: { url: string; label: string };
}) {
  const { data, isLoading } = useCommunicationsQuery();

  const byChannel = useMemo(() => {
    const emails = data.filter(c => c.channel === 'Email');
    const sms = data.filter(c => c.channel === 'SMS');
    return { emails, sms };
  }, [data]);

  const tabFor = (channel: Channel) => {
    const rows = channel === 'Email' ? byChannel.emails : byChannel.sms;
    return (
      <LogGrid
        rows={rows}
        loading={isLoading}
        emptyMessage={`No ${channel.toLowerCase()} communications logged.`}
      />
    );
  };

  return (
    <FormPage
      title="Communication Logs"
      description="Full delivery history of bulk email and SMS communications."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Communication Management', to: commUrls.portal },
        { label: roleCrumb.label, to: roleCrumb.url },
        { label: 'Communication Logs' },
      ]}
    >
      <Tabs
        tabs={[
          {
            title: `Email (${byChannel.emails.length})`,
            content: tabFor('Email'),
          },
          { title: `SMS (${byChannel.sms.length})`, content: tabFor('SMS') },
        ]}
      />
    </FormPage>
  );
}
