import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextArea } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import IncidentTimeline from '../../shared/IncidentTimeline';
import { type Incident, incidents as allIncidents } from '../../mocks';
import { smsUrls } from '../../urls';
import '../../super-admin/pages/Dashboard.css';

const OFFICER_NAME = 'Officer Rajesh Kumar';
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

type PopupState =
  | { mode: 'closed' }
  | { mode: 'view'; item: Incident }
  | { mode: 'investigate'; item: Incident }
  | { mode: 'action'; item: Incident }
  | { mode: 'resolve'; item: Incident }
  | { mode: 'close'; item: Incident };

export default function AssignedIncidents() {
  const [data, setData] = useState<Incident[]>(
    allIncidents.filter(i => i.assignedTo === OFFICER_NAME)
  );
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [remarks, setRemarks] = useState('');

  const close = () => {
    setPopup({ mode: 'closed' });
    setRemarks('');
  };

  const updateStatus = (
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
                  actor: OFFICER_NAME,
                  date: new Date().toLocaleString(),
                  remarks,
                },
              ],
            }
          : d
      )
    );
    ToastService.success(`Incident updated: ${newStatus}`);
    close();
  };

  const viewItem = popup.mode === 'view' ? popup.item : null;

  return (
    <FormPage
      title="My Assigned Incidents"
      description={`Cases assigned to ${OFFICER_NAME}. Investigate, take action, and resolve.`}
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Security Management', to: smsUrls.portal },
        { label: 'Officer Portal', to: smsUrls.officer.portal },
        { label: 'Assigned Incidents' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'incidentId', header: 'Incident ID' },
            { field: 'reportedBy', header: 'Reported By' },
            { field: 'category', header: 'Category' },
            { field: 'incidentType', header: 'Type' },
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
            { field: 'incidentDate', header: 'Incident Date' },
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
                  style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}
                >
                  <Button
                    size="small"
                    label=""
                    icon="eye"
                    variant="outlined"
                    onClick={() => setPopup({ mode: 'view', item })}
                  />
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
                      label="Action"
                      icon="bolt"
                      variant="primary"
                      onClick={() => {
                        setRemarks('');
                        setPopup({ mode: 'action', item });
                      }}
                    />
                  )}
                  {item.status === 'Action Taken' && (
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
          searchPlaceholder="Search assigned incidents..."
        />
      </FormCard>

      {/* View Popup */}
      {viewItem && (
        <FormPopup
          visible={popup.mode === 'view'}
          onHide={close}
          title={`Incident — ${viewItem.incidentId}`}
          subtitle={`${viewItem.reportedBy} · ${viewItem.category}`}
          size="xl"
        >
          <FormGrid columns={3}>
            {[
              { label: 'Category', value: viewItem.category },
              { label: 'Type', value: viewItem.incidentType },
              { label: 'Location', value: viewItem.location },
              { label: 'Building', value: viewItem.building },
              { label: 'Reported By', value: viewItem.reportedBy },
              { label: 'Reporter Role', value: viewItem.reporterRole },
              { label: 'Incident Date', value: viewItem.incidentDate },
              { label: 'Incident Time', value: viewItem.incidentTime },
              { label: 'Department', value: viewItem.reporterDept },
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
              Incident Description
            </p>
            <p
              style={{
                fontSize: '0.813rem',
                color: '#374151',
                lineHeight: 1.6,
              }}
            >
              {viewItem.description}
            </p>
          </div>
          {viewItem.evidence && (
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
                Evidence / Attachments
              </p>
              <p style={{ fontSize: '0.813rem', color: '#374151' }}>
                {viewItem.evidence}
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
            placeholder="Document your initial findings, witness interviews, CCTV review, etc."
            value={remarks}
            onChange={setRemarks}
            rows={5}
          />
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button
              label="Start Investigation"
              variant="primary"
              icon="search"
              onClick={() =>
                updateStatus('Under Investigation', 'investigating')
              }
            />
          </div>
        </FormPopup>
      )}

      {/* Action Taken Popup */}
      {popup.mode === 'action' && (
        <FormPopup
          visible
          onHide={close}
          title="Update Action Taken"
          subtitle={`${popup.item.incidentId}`}
        >
          <TextArea
            label="Action Taken Notes"
            placeholder="What actions were taken? Who was notified? Steps implemented..."
            value={remarks}
            onChange={setRemarks}
            rows={5}
          />
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button
              label="Update Action"
              variant="primary"
              icon="bolt"
              onClick={() => updateStatus('Action Taken', 'action_taken')}
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
          subtitle={`${popup.item.incidentId}`}
        >
          <TextArea
            label="Resolution Notes"
            placeholder="How was this incident completely resolved? Describe the outcome..."
            value={remarks}
            onChange={setRemarks}
            rows={5}
          />
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button
              label="Mark Resolved"
              variant="primary"
              icon="check"
              onClick={() => updateStatus('Resolved', 'resolved')}
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
          subtitle={`${popup.item.incidentId}`}
        >
          <TextArea
            label="Closure Summary"
            placeholder="Final summary and any corrective measures implemented..."
            value={remarks}
            onChange={setRemarks}
            rows={5}
          />
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button
              label="Close Incident"
              variant="outlined"
              icon="lock"
              onClick={() => updateStatus('Closed', 'closed')}
            />
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
