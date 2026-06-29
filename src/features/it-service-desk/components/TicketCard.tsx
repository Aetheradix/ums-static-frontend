import { useNavigate } from 'react-router-dom';
import { TicketStatusBadge, PriorityBadge } from '.';
import type { Ticket } from '../data';

interface Props {
  ticket: Ticket;
  onSelect?: (ticket: Ticket) => void;
}

export default function TicketCard({ ticket, onSelect }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition cursor-pointer bg-white"
      onClick={() => {
        if (onSelect) onSelect(ticket);
        else navigate(`/it-service-desk/ticket/${ticket.code}`);
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-mono text-gray-500">{ticket.code}</span>
        <PriorityBadge priority={ticket.priority} />
      </div>
      <h4 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">
        {ticket.title}
      </h4>
      <p className="text-xs text-gray-500 mb-3 line-clamp-2">
        {ticket.description}
      </p>
      <div className="flex justify-between items-center">
        <TicketStatusBadge status={ticket.status} />
        <span className="text-xs text-gray-400">{ticket.requesterName}</span>
      </div>
      {ticket.slaViolated && (
        <div className="mt-2 flex items-center gap-1 text-xs text-red-600 font-bold">
          <span className="material-symbols-outlined text-sm">warning</span>
          SLA Breached
        </div>
      )}
    </div>
  );
}
