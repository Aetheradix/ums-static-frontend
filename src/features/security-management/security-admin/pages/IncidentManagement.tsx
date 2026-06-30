// Security Admin Incident Management — re-exports the same full page with Security Admin breadcrumbs
import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage, FormPopup, GridPanel, StatusBadge, Tabs } from 'shared/new-components';
import IncidentTimeline from '../../shared/IncidentTimeline';
import { type Incident, incidents as initialData } from '../../mocks';
import { smsUrls } from '../../urls';
import '../../super-admin/pages/Dashboard.css';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'view'; item: Incident }
  | { mode: 'assign'; item: Incident }
  | { mode: 'investigate'; item: Incident }
  | { mode: 'resolve'; item: Incident }
  | { mode: 'close'; item: Incident };

const STATUS_VARIANT: Record<string, 'pending' | 'approved' | 'rejected' | 'neutral'> = {
  Open: 'rejected', Assigned: 'pending', 'Under Investigation': 'pending',
  'Action Taken': 'pending', Resolved: 'approved', Closed: 'neutral',
};

const OFFICER_OPTIONS = ['Officer Rajesh Kumar', 'Officer Priya Sharma', 'Officer Amit Singh', 'Officer Sunita Devi', 'Officer Ravi Verma'].map(o => ({ name: o, value: o }));
const TABS = [
  { label: 'All', key: 'all' },
  { label: 'Open', key: 'Open' },
  { label: 'Assigned', key: 'Assigned' },
  { label: 'Investigating', key: 'Under Investigation' },
  { label: 'Resolved', key: 'Resolved' },
  { label: 'Closed', key: 'Closed' },
];

export default function SecurityAdminIncidentManagement() {
  const [data, setData] = useState<Incident[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [activeTab, setActiveTab] = useState('all');
  const [remarks, setRemarks] = useState('');
  const [assignTo, setAssignTo] = useState('');

  const close = () => { setPopup({ mode: 'closed' }); setRemarks(''); setAssignTo(''); };

  const filteredData = data.filter(inc => activeTab === 'all' || inc.status === activeTab);

  const handleAssign = () => {
    if (popup.mode !== 'assign') return;
    if (!assignTo) { ToastService.error('Please select an officer.'); return; }
    setData(prev => prev.map(d => d.id === popup.item.id ? {
      ...d, status: 'Assigned' as const, assignedTo: assignTo,
      timeline: [...d.timeline, { action: 'assigned' as const, actor: 'Security Admin', date: new Date().toLocaleString(), remarks: `Assigned to ${assignTo}` }],
    } : d));
    ToastService.success(`Assigned to ${assignTo}`);
    close();
  };

  const updateStatus = (newStatus: Incident['status'], action: 'investigating' | 'action_taken' | 'resolved' | 'closed') => {
    if (popup.mode === 'closed') return;
    const item = (popup as any).item as Incident;
    setData(prev => prev.map(d => d.id === item.id ? {
      ...d, status: newStatus,
      timeline: [...d.timeline, { action, actor: 'Security Admin', date: new Date().toLocaleString(), remarks }],
    } : d));
    ToastService.success(`Status updated to ${newStatus}`);
    close();
  };

  const viewItem = popup.mode === 'view' ? popup.item : null;

  return (
    <FormPage
      title="Incident Management"
      description="Assign incidents, track investigations and manage resolutions."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Security Management', to: smsUrls.portal },
        { label: 'Security Admin', to: smsUrls.securityAdmin.portal },
        { label: 'Incident Management' },
      ]}
    >
      <FormCard>
        <Tabs
          tabs={TABS.map(t => ({ title: t.label, content: <></> }))}
          activeIndex={TABS.findIndex(t => t.key === activeTab)}
          onTabChange={e => setActiveTab(TABS[e.index].key)}
        />
        <div style={{ marginTop: '1rem' }}>
          <GridPanel
            data={filteredData}
            columns={[
              { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
              { field: 'incidentId', header: 'Incident ID' },
              { field: 'reportedBy', header: 'Reported By' },
              { field: 'category', header: 'Category' },
              { field: 'location', header: 'Location' },
              {
                field: 'priority', header: 'Priority',
                cell: (item: Incident) => <span className={`sms-priority-chip priority-${item.priority.toLowerCase()}`}>{item.priority}</span>,
              },
              { field: 'assignedTo', header: 'Assigned To' },
              { field: 'reportedDate', header: 'Date' },
              {
                field: 'status', header: 'Status',
                cell: (item: Incident) => <StatusBadge label={item.status} variant={STATUS_VARIANT[item.status] ?? 'neutral'} />,
              },
              {
                field: 'id', header: 'Actions', sortable: false,
                cell: (item: Incident) => (
                  <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                    <Button size="small" label="" icon="eye" variant="outlined" onClick={() => setPopup({ mode: 'view', item })} />
                    {item.status === 'Open' && <Button size="small" label="Assign" icon="user" variant="primary" onClick={() => { setAssignTo(''); setRemarks(''); setPopup({ mode: 'assign', item }); }} />}
                    {item.status === 'Assigned' && <Button size="small" label="Investigate" icon="search" variant="outlined" onClick={() => { setRemarks(''); setPopup({ mode: 'investigate', item }); }} />}
                    {item.status === 'Under Investigation' && <Button size="small" label="Resolve" icon="check" variant="primary" onClick={() => { setRemarks(''); setPopup({ mode: 'resolve', item }); }} />}
                    {item.status === 'Resolved' && <Button size="small" label="Close" icon="lock" variant="outlined" onClick={() => { setRemarks(''); setPopup({ mode: 'close', item }); }} />}
                  </div>
                ),
              },
            ]}
            searchBox searchPlaceholder="Search incidents..."
          />
        </div>
      </FormCard>

      {viewItem && (
        <FormPopup visible={popup.mode === 'view'} onHide={close}
          title={`Incident — ${viewItem.incidentId}`}
          subtitle={`${viewItem.reportedBy} · ${viewItem.category} · ${viewItem.location}`}
          size="xl"
        >
          <FormGrid columns={3}>
            {[
              { label: 'Category', value: viewItem.category },
              { label: 'Type', value: viewItem.incidentType },
              { label: 'Location', value: viewItem.location },
              { label: 'Reported By', value: viewItem.reportedBy },
              { label: 'Date', value: viewItem.incidentDate },
              { label: 'Assigned To', value: viewItem.assignedTo || 'Not Assigned' },
            ].map(f => (
              <div key={f.label}>
                <p style={{ fontSize: '0.688rem', color: '#9ca3af', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</p>
                <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{f.value}</p>
              </div>
            ))}
          </FormGrid>
          <div style={{ background: '#f9fafb', borderRadius: 8, padding: '0.75rem', margin: '0.75rem 0', border: '1px solid #f3f4f6' }}>
            <p style={{ fontSize: '0.688rem', color: '#9ca3af', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</p>
            <p style={{ fontSize: '0.813rem', color: '#374151' }}>{viewItem.description}</p>
          </div>
          <p style={{ fontSize: '0.813rem', fontWeight: 600, marginBottom: '0.75rem', color: '#374151' }}>Timeline</p>
          <IncidentTimeline steps={viewItem.timeline} />
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Close" variant="outlined" onClick={close} />
          </div>
        </FormPopup>
      )}

      {popup.mode === 'assign' && (
        <FormPopup visible onHide={close} title="Assign Incident" subtitle={`${popup.item.incidentId} — ${popup.item.category}`}>
          <DropDownList label="Security Officer" data={OFFICER_OPTIONS} textField="name" optionValue="value" value={assignTo} onChange={v => setAssignTo(v as string)} />
          <TextArea label="Assignment Remarks" placeholder="Instructions for the officer..." value={remarks} onChange={setRemarks} rows={3} />
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button label="Assign" variant="primary" icon="user" onClick={handleAssign} />
          </div>
        </FormPopup>
      )}

      {popup.mode === 'investigate' && (
        <FormPopup visible onHide={close} title="Update Investigation" subtitle={`${popup.item.incidentId}`}>
          <TextArea label="Investigation Notes" placeholder="Investigation findings..." value={remarks} onChange={setRemarks} rows={4} />
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button label="Update Status" variant="primary" icon="search" onClick={() => updateStatus('Under Investigation', 'investigating')} />
          </div>
        </FormPopup>
      )}

      {popup.mode === 'resolve' && (
        <FormPopup visible onHide={close} title="Resolve Incident" subtitle={`${popup.item.incidentId}`}>
          <TextArea label="Resolution Notes" placeholder="How was this resolved?" value={remarks} onChange={setRemarks} rows={4} />
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button label="Mark Resolved" variant="primary" icon="check" onClick={() => updateStatus('Resolved', 'resolved')} />
          </div>
        </FormPopup>
      )}

      {popup.mode === 'close' && (
        <FormPopup visible onHide={close} title="Close Incident" subtitle={`${popup.item.incidentId}`}>
          <TextArea label="Closure Summary" placeholder="Final notes..." value={remarks} onChange={setRemarks} rows={4} />
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button label="Close Incident" variant="outlined" icon="lock" onClick={() => updateStatus('Closed', 'closed')} />
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
