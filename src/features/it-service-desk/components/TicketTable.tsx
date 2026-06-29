import { GridPanel } from 'shared/new-components';
import { TicketStatusBadge, PriorityBadge } from '.';
import type { Ticket } from '../data';

interface ColumnDef {
  field?: keyof Ticket;
  header?: string;
  width?: string;
  cell?: (item: Ticket) => React.ReactNode;
  sortable?: boolean;
  filter?: boolean;
}

interface Props {
  data: Ticket[];
  title?: string;
  searchPlaceholder?: string;
  searchBox?: boolean;
  extraColumns?: ColumnDef[];
  onValueChange?: (items: Ticket[]) => void;
}

export default function TicketTable({
  data,
  title,
  searchPlaceholder = 'Search by code, title, requester...',
  searchBox = true,
  extraColumns = [],
  onValueChange,
}: Props) {
  const baseColumns: ColumnDef[] = [
    { field: 'code', header: 'Code', width: '160px' },
    {
      field: 'title',
      header: 'Title',
      cell: (t: Ticket) => (
        <span className="font-medium text-sm line-clamp-1">{t.title}</span>
      ),
    },
    {
      header: 'Status',
      width: '130px',
      cell: (t: Ticket) => <TicketStatusBadge status={t.status} />,
    },
    {
      header: 'Priority',
      width: '100px',
      cell: (t: Ticket) => <PriorityBadge priority={t.priority} />,
    },
    { field: 'module', header: 'Module', width: '140px' },
    { field: 'requesterName', header: 'Requester', width: '150px' },
    { field: 'assignedAgent', header: 'Agent', width: '140px' },
    { field: 'createdDate', header: 'Created', width: '150px' },
  ];

  return (
    <GridPanel
      data={data}
      title={title}
      searchBox={searchBox}
      searchPlaceholder={searchPlaceholder}
      columns={[...baseColumns, ...extraColumns] as any}
      onValueChange={onValueChange}
    />
  );
}
