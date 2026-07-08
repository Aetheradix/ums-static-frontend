import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

interface MessageLog {
  id: string;
  type: 'SMS' | 'Email' | 'WhatsApp' | 'In-App';
  sender: string;
  recipient: string;
  subject?: string;
  body: string;
  timestamp: string;
  status: 'Sent' | 'Read' | 'Failed';
}

const INITIAL_LOGS: MessageLog[] = [
  {
    id: 'MSG001',
    type: 'WhatsApp',
    sender: 'DAVV Grievance Desk',
    recipient: '9876543210',
    body: '✅ Grievance GRV/DAVV/2025/00312 under review. The exam committee will reassess Data Structures answer sheets. Expected resolution: 18 Dec 2025.',
    timestamp: '16 Dec 2025 14:05',
    status: 'Sent',
  },
  {
    id: 'MSG002',
    type: 'SMS',
    sender: 'DAVV_ERP',
    recipient: '9876543210',
    body: 'Dear Arjun, Your academic grievance GRV/DAVV/2025/00312 has been successfully registered. Track status at: davv.erp/track. Team DAVV.',
    timestamp: '15 Dec 2025 09:15',
    status: 'Sent',
  },
  {
    id: 'MSG003',
    type: 'Email',
    sender: 'grievance.cell@davv.ac.in',
    recipient: 'arjun.sharma@davv.ac.in',
    subject: 'Grievance Petition Filed: GRV/DAVV/2025/00312',
    body: 'Dear Arjun Sharma,\n\nWe acknowledge the receipt of your grievance petition regarding re-evaluation of CS302 exam paper. The petition has been assigned to the Examination Nodal Officer Dr. Rakesh Verma under UGC SGRC guidelines.\n\nBest Regards,\nDAVV Grievance Redressal Cell.',
    timestamp: '15 Dec 2025 09:20',
    status: 'Read',
  },
];

export default function StudentCommunicationCenter() {
  const [logs, setLogs] = useState<MessageLog[]>(INITIAL_LOGS);

  const handleClearAll = () => {
    setLogs([]);
    ToastService.success('Notification center logs cleared.');
  };

  return (
    <FormPage
      title="Communication Hub"
      description="View full SMS, Email, and WhatsApp log records dispatched regarding your grievances."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Student Portal', to: grvUrls.student.portal },
        { label: 'Communication Center' },
      ]}
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs text-slate-500 font-bold">
          Total Dispatches: {logs.length}
        </span>
        {logs.length > 0 && (
          <Button
            label="Clear Logs"
            icon="trash"
            variant="danger"
            size="small"
            onClick={handleClearAll}
          />
        )}
      </div>

      <div className="space-y-4">
        {logs.length === 0 ? (
          <div className="grv-empty">
            <i className="pi pi-bell-slash text-gray-300"></i>
            <p>Your notification history is empty.</p>
          </div>
        ) : (
          logs.map(log => {
            const isEmail = log.type === 'Email';
            const isSms = log.type === 'SMS';
            const isWa = log.type === 'WhatsApp';

            return (
              <FormCard key={log.id}>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 flex items-center justify-center self-start">
                      <i
                        className={`pi ${isEmail ? 'pi-envelope text-blue-600' : isSms ? 'pi-phone text-purple-600' : isWa ? 'pi-whatsapp text-emerald-600' : 'pi-bell text-yellow-600'} text-lg`}
                      ></i>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-extrabold text-xs text-slate-800">
                          {log.type} Delivery
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                          {log.id}
                        </span>
                      </div>
                      {log.subject && (
                        <h4 className="font-bold text-slate-800 text-xs mb-1">
                          Sub: {log.subject}
                        </h4>
                      )}
                      <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                        {log.body}
                      </p>

                      <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-2">
                        <span>
                          Recipient: <strong>{log.recipient}</strong>
                        </span>
                        <span>
                          Sender Node: <strong>{log.sender}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-mono mb-1">
                      {log.timestamp}
                    </span>
                    <span
                      className={`text-[10px] font-bold ${log.status === 'Read' ? 'text-blue-600' : 'text-emerald-600'}`}
                    >
                      {log.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </FormCard>
            );
          })
        )}
      </div>
    </FormPage>
  );
}
