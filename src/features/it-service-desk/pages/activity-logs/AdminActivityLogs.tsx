import { useMemo } from 'react';
import { FormPage, FormCard } from 'shared/new-components';
import { initialTickets } from '../../data';
import { itsmUrls } from '../../urls';

export default function AdminActivityLogs() {
  const allEvents = useMemo(() => {
    const events = initialTickets.flatMap(t =>
      t.timeline.map(e => ({ ...e, ticketTitle: t.title }))
    );
    return events.sort((a, b) => {
      const dateA = a.timestamp.includes(', ')
        ? a.timestamp.split(', ')[0]
        : a.timestamp;
      const dateB = b.timestamp.includes(', ')
        ? b.timestamp.split(', ')[0]
        : b.timestamp;
      return dateB.localeCompare(dateA);
    });
  }, []);

  return (
    <FormPage
      title="Activity Logs"
      description="Complete audit trail of all ticket events across the service desk."
      breadcrumbs={[
        { label: 'IT Service Desk', to: itsmUrls.portal },
        { label: 'Activity Logs' },
      ]}
    >
      <FormCard title={`Activity Log (${allEvents.length} events)`}>
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="text-left text-gray-500 text-xs border-b border-gray-200">
                <th className="pb-2 pr-4">Timestamp</th>
                <th className="pb-2 pr-4">Type</th>
                <th className="pb-2 pr-4">Ticket</th>
                <th className="pb-2 pr-4">Actor</th>
                <th className="pb-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {allEvents.map(event => (
                <tr
                  key={event.id}
                  className="border-t border-gray-50 hover:bg-gray-50"
                >
                  <td className="py-2 pr-4 text-xs text-gray-500 whitespace-nowrap">
                    {event.timestamp}
                  </td>
                  <td className="py-2 pr-4">
                    <span className="text-xs font-medium uppercase text-gray-600">
                      {event.type}
                    </span>
                  </td>
                  <td className="py-2 pr-4">
                    <span className="text-xs font-mono font-medium">
                      {event.ticketCode}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      - {event.ticketTitle?.slice(0, 40)}...
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-xs text-gray-700">
                    {event.actor}
                  </td>
                  <td className="py-2 text-xs text-gray-600">
                    {event.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormCard>
    </FormPage>
  );
}
