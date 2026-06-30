import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
  Tabs,
} from 'shared/new-components';
import IncidentTimeline from '../../../shared/IncidentTimeline';
import { type Incident, incidents as initialData } from '../../../mocks';
import { smsUrls } from '../../../urls';
import '../../pages/Dashboard.css';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'view'; item: Incident }
  | { mode: 'assign'; item: Incident }
  | { mode: 'investigate'; item: Incident }
  | { mode: 'resolve'; item: Incident }
  | { mode: 'close'; item: Incident };

const STATUS_VARIANT: Record<
  string,
  'pending' | 'approved' | 'rejected' | 'neutral'
> = {
  Open: 'rejected',
  Assigned: 'pending',
  'Under Investigation': 'pending',
  'Action Taken': 'pending',
  Resolved: 'approved',
  Closed: 'neutral',
};

const OFFICER_OPTIONS = [
  'Officer Rajesh Kumar',
  'Officer Priya Sharma',
  'Officer Amit Singh',
  'Officer Sunita Devi',
  'Officer Ravi Verma',
].map(o => ({ name: o, value: o }));

const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'].map(p => ({
  name: p,
  value: p,
}));
const CATEGORY_OPTIONS = [
  'Physical Security',
  'Cyber Security',
  'Fire & Safety',
  'Medical Emergency',
  'Theft & Robbery',
  'Harassment',
  'Vandalism',
].map(c => ({ name: c, value: c }));
const STATUS_OPTIONS = [
  'Open',
  'Assigned',
  'Under Investigation',
  'Action Taken',
  'Resolved',
  'Closed',
].map(s => ({ name: s, value: s }));

const TABS = [
  { label: 'All Incidents', key: 'all' },
  { label: 'Open', key: 'Open' },
  { label: 'Assigned', key: 'Assigned' },
  { label: 'Under Investigation', key: 'Under Investigation' },
  { label: 'Resolved', key: 'Resolved' },
  { label: 'Closed', key: 'Closed' },
];

export default function SuperAdminIncidentManagement() {
  const [data, setData] = useState<Incident[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [activeTab, setActiveTab] = useState('all');
  const [remarks, setRemarks] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const close = () => {
    setPopup({ mode: 'closed' });
    setRemarks('');
    setAssignTo('');
  };

  const filteredData = data.filter(inc => {
    const tabMatch = activeTab === 'all' || inc.status === activeTab;
    const priorityMatch = !filterPriority || inc.priority === filterPriority;
    const categoryMatch = !filterCategory || inc.category === filterCategory;
    const statusMatch = !filterStatus || inc.status === filterStatus;
    return tabMatch && priorityMatch && categoryMatch && statusMatch;
  });

  const handleAssign = () => {
    if (popup.mode !== 'assign') return;
    if (!assignTo) {
      ToastService.error('Please select a security officer.');
      return;
    }
    setData(prev =>
      prev.map(d =>
        d.id === popup.item.id
          ? {
              ...d,
              status: 'Assigned' as const,
              assignedTo: assignTo,
              timeline: [
                ...d.timeline,
                {
                  action: 'assigned' as const,
                  actor: 'Security Admin',
                  date: new Date().toLocaleString(),
                  remarks: `Assigned to ${assignTo}. ${remarks}`.trim(),
                },
              ],
            }
          : d
      )
    );
    ToastService.success(`Incident assigned to ${assignTo}`);
    close();
  };

  const handleUpdateStatus = (
    newStatus: Incident['status'],
    action: 'investigating' | 'action_taken' | 'resolved' | 'closed'
  ) => {
    if (popup.mode === 'closed') return;
    const item = (popup as any).item as Incident;
    setData(prev =>
      prev.map(d =>
        d.id === item.id
          ? {
              ...d,
              status: newStatus,
              timeline: [
                ...d.timeline,
                {
                  action,
                  actor: 'Security Admin',
                  date: new Date().toLocaleString(),
                  remarks,
                },
              ],
            }
          : d
      )
    );
    ToastService.success(`Incident status updated to ${newStatus}`);
    close();
  };

  const viewItem = popup.mode === 'view' ? popup.item : null;

  return (
    <FormPage
      title="Incident Management"
      description="View, assign and manage all security incidents across the university."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Security Management', to: smsUrls.portal },
        { label: 'Super Admin', to: smsUrls.superAdmin.portal },
        { label: 'Incidents' },
      ]}
    >
      {/* Filters */}
      <FormCard>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
          }}
        >
          <div style={{ flex: 1, minWidth: 150 }}>
            <DropDownList
              label="Filter by Category"
              data={[
                { name: 'All Categories', value: '' },
                ...CATEGORY_OPTIONS,
              ]}
              textField="name"
              optionValue="value"
              value={filterCategory}
              onChange={v => setFilterCategory(v as string)}
            />
          </div>
          <div style={{ flex: 1, minWidth: 130 }}>
            <DropDownList
              label="Filter by Priority"
              data={[
                { name: 'All Priorities', value: '' },
                ...PRIORITY_OPTIONS,
              ]}
              textField="name"
              optionValue="value"
              value={filterPriority}
              onChange={v => setFilterPriority(v as string)}
            />
          </div>
          <div style={{ flex: 1, minWidth: 150 }}>
            <DropDownList
              label="Filter by Status"
              data={[{ name: 'All Statuses', value: '' }, ...STATUS_OPTIONS]}
              textField="name"
              optionValue="value"
              value={filterStatus}
              onChange={v => setFilterStatus(v as string)}
            />
          </div>
          <Button
            label="Clear Filters"
            variant="outlined"
            icon="filter-slash"
            onClick={() => {
              setFilterPriority('');
              setFilterCategory('');
              setFilterStatus('');
            }}
          />
        </div>
      </FormCard>

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
                field: 'priority',
                header: 'Priority',
                cell: (item: Incident) => (
                  <span
                    className={`sms-priority-chip priority-${item.priority.toLowerCase()}`}
                  >
                    {item.priority}
                  </span>
                ),
              },
              { field: 'assignedTo', header: 'Assigned To' },
              { field: 'reportedDate', header: 'Date' },
              {
                field: 'status',
                header: 'Status',
                cell: (item: Incident) => (
                  <StatusBadge
                    label={item.status}
                    variant={STATUS_VARIANT[item.status] ?? 'neutral'}
                  />
                ),
              },
              {
                field: 'id',
                header: 'Actions',
                sortable: false,
                cell: (item: Incident) => (
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.375rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <Button
                      size="small"
                      label=""
                      icon="eye"
                      variant="outlined"
                      onClick={() => setPopup({ mode: 'view', item })}
                    />
                    {item.status === 'Open' && (
                      <Button
                        size="small"
                        label="Assign"
                        icon="user"
                        variant="primary"
                        onClick={() => {
                          setAssignTo('');
                          setRemarks('');
                          setPopup({ mode: 'assign', item });
                        }}
                      />
                    )}
                    {item.status === 'Assigned' && (
                      <Button
                        size="small"
                        label="Investigate"
                        icon="search"
                        variant="outlined"
                        onClick={() => {
                          setRemarks('');
                          setPopup({ mode: 'investigate', item });
                        }}
                      />
                    )}
                    {item.status === 'Under Investigation' && (
                      <Button
                        size="small"
                        label="Resolve"
                        icon="check"
                        variant="primary"
                        onClick={() => {
                          setRemarks('');
                          setPopup({ mode: 'resolve', item });
                        }}
                      />
                    )}
                    {item.status === 'Resolved' && (
                      <Button
                        size="small"
                        label="Close"
                        icon="lock"
                        variant="outlined"
                        onClick={() => {
                          setRemarks('');
                          setPopup({ mode: 'close', item });
                        }}
                      />
                    )}
                  </div>
                ),
              },
            ]}
            searchBox
            searchPlaceholder="Search incidents..."
          />
        </div>
      </FormCard>

      {/* View Details Popup */}
      {viewItem && (
        <FormPopup
          visible={popup.mode === 'view'}
          onHide={close}
          title={`Incident — ${viewItem.incidentId}`}
          subtitle={`${viewItem.reportedBy} · ${viewItem.category} · ${viewItem.location}`}
          size="xl"
        >
          <FormGrid columns={3}>
            {[
              { label: 'Reported By', value: viewItem.reportedBy },
              { label: 'Reporter Role', value: viewItem.reporterRole },
              { label: 'Department', value: viewItem.reporterDept },
              { label: 'Category', value: viewItem.category },
              { label: 'Incident Type', value: viewItem.incidentType },
              { label: 'Location', value: viewItem.location },
              { label: 'Building', value: viewItem.building },
              {
                label: 'Incident Date',
                value: `${viewItem.incidentDate} ${viewItem.incidentTime}`,
              },
              {
                label: 'Assigned To',
                value: viewItem.assignedTo || 'Not Assigned',
              },
            ].map(f => (
              <div key={f.label}>
                <p
                  style={{
                    fontSize: '0.688rem',
                    color: '#9ca3af',
                    marginBottom: 4,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {f.label}
                </p>
                <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                  {f.value}
                </p>
              </div>
            ))}
          </FormGrid>
          <div style={{ display: 'flex', gap: '0.75rem', margin: '0.75rem 0' }}>
            <span
              className={`sms-priority-chip priority-${viewItem.priority.toLowerCase()}`}
            >
              Priority: {viewItem.priority}
            </span>
            <span
              className={`sms-priority-chip priority-${viewItem.severity.toLowerCase()}`}
            >
              Severity: {viewItem.severity}
            </span>
            <StatusBadge
              label={viewItem.status}
              variant={STATUS_VARIANT[viewItem.status] ?? 'neutral'}
            />
          </div>
          <div
            style={{
              background: '#f9fafb',
              borderRadius: 8,
              padding: '0.75rem',
              marginBottom: '0.75rem',
              border: '1px solid #f3f4f6',
            }}
          >
            <p
              style={{
                fontSize: '0.688rem',
                color: '#9ca3af',
                marginBottom: 4,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Description
            </p>
            <p style={{ fontSize: '0.813rem', color: '#374151' }}>
              {viewItem.description}
            </p>
          </div>
          {viewItem.investigationNotes && (
            <div
              style={{
                background: '#fefce8',
                borderRadius: 8,
                padding: '0.75rem',
                marginBottom: '0.75rem',
                border: '1px solid #fef08a',
              }}
            >
              <p
                style={{
                  fontSize: '0.688rem',
                  color: '#9ca3af',
                  marginBottom: 4,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Investigation Notes
              </p>
              <p style={{ fontSize: '0.813rem', color: '#374151' }}>
                {viewItem.investigationNotes}
              </p>
            </div>
          )}
          {viewItem.resolutionNotes && (
            <div
              style={{
                background: '#f0fdf4',
                borderRadius: 8,
                padding: '0.75rem',
                marginBottom: '0.75rem',
                border: '1px solid #bbf7d0',
              }}
            >
              <p
                style={{
                  fontSize: '0.688rem',
                  color: '#9ca3af',
                  marginBottom: 4,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Resolution Notes
              </p>
              <p style={{ fontSize: '0.813rem', color: '#374151' }}>
                {viewItem.resolutionNotes}
              </p>
            </div>
          )}
          {viewItem.closureNotes && (
            <div
              style={{
                background: '#f3f4f6',
                borderRadius: 8,
                padding: '0.75rem',
                marginBottom: '0.75rem',
                border: '1px solid #e5e7eb',
              }}
            >
              <p
                style={{
                  fontSize: '0.688rem',
                  color: '#9ca3af',
                  marginBottom: 4,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Closure Summary
              </p>
              <p style={{ fontSize: '0.813rem', color: '#374151' }}>
                {viewItem.closureNotes}
              </p>
            </div>
          )}
          <p
            style={{
              fontSize: '0.813rem',
              fontWeight: 600,
              marginBottom: '0.75rem',
              color: '#374151',
            }}
          >
            Incident Timeline
          </p>
          <IncidentTimeline steps={viewItem.timeline} />
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Close" variant="outlined" onClick={close} />
          </div>
        </FormPopup>
      )}

      {/* Assign Popup */}
      {popup.mode === 'assign' && (
        <FormPopup
          visible
          onHide={close}
          title="Assign Incident"
          subtitle={`${popup.item.incidentId} — ${popup.item.category}`}
        >
          <DropDownList
            label="Assign to Security Officer"
            data={OFFICER_OPTIONS}
            textField="name"
            optionValue="value"
            value={assignTo}
            onChange={v => setAssignTo(v as string)}
          />
          <TextArea
            label="Assignment Remarks"
            placeholder="Instructions or notes for the officer..."
            value={remarks}
            onChange={setRemarks}
            rows={3}
          />
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button
              label="Assign Incident"
              variant="primary"
              icon="user"
              onClick={handleAssign}
            />
          </div>
        </FormPopup>
      )}

      {/* Investigate Popup */}
      {popup.mode === 'investigate' && (
        <FormPopup
          visible
          onHide={close}
          title="Start Investigation"
          subtitle={`${popup.item.incidentId} — ${popup.item.category}`}
        >
          <TextArea
            label="Investigation Notes"
            placeholder="Initial investigation findings..."
            value={remarks}
            onChange={setRemarks}
            rows={4}
          />
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button
              label="Start Investigation"
              variant="primary"
              icon="search"
              onClick={() =>
                handleUpdateStatus('Under Investigation', 'investigating')
              }
            />
          </div>
        </FormPopup>
      )}

      {/* Resolve Popup */}
      {popup.mode === 'resolve' && (
        <FormPopup
          visible
          onHide={close}
          title="Resolve Incident"
          subtitle={`${popup.item.incidentId} — ${popup.item.category}`}
        >
          <TextArea
            label="Resolution Notes"
            placeholder="How was this incident resolved? What actions were taken?"
            value={remarks}
            onChange={setRemarks}
            rows={4}
          />
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button
              label="Mark as Resolved"
              variant="primary"
              icon="check"
              onClick={() => handleUpdateStatus('Resolved', 'resolved')}
            />
          </div>
        </FormPopup>
      )}

      {/* Close Popup */}
      {popup.mode === 'close' && (
        <FormPopup
          visible
          onHide={close}
          title="Close Incident"
          subtitle={`${popup.item.incidentId} — ${popup.item.category}`}
        >
          <TextArea
            label="Closure Summary"
            placeholder="Final closure notes and corrective actions taken..."
            value={remarks}
            onChange={setRemarks}
            rows={4}
          />
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button
              label="Close Incident"
              variant="outlined"
              icon="lock"
              onClick={() => handleUpdateStatus('Closed', 'closed')}
            />
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
