import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DatePicker, DropDownList, TextArea, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage, FormPopup, GridPanel, StatusBadge } from 'shared/new-components';
import { type EOTRequest, eotRequests as initialData, civilWorks } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

const WORK_OPTIONS = civilWorks.map(w => ({ name: `${w.workId} — ${w.name}`, value: w.id }));
const EOT_TYPES = [
  { name: 'Extension of Time (Delay → Timeline increase, No cost change)', value: 'Extension of Time' },
  { name: 'Revised Estimate (Additional Budget required)', value: 'Revised Estimate' },
];

const statusVariant = (s: string) =>
  s === 'Approved' ? 'approved' : s === 'Rejected' ? 'rejected' : s === 'Under Review' ? 'pending' : 'neutral';

export default function EOTRequest() {
  const [data, setData] = useState(initialData);
  const [popup, setPopup] = useState<{ mode: 'closed' | 'create' | 'view'; item?: EOTRequest }>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<EOTRequest>>({});

  const handleSave = () => {
    if (!form.workId || !form.type || !form.reason || !form.justification) {
      ToastService.error('All required fields must be filled.'); return;
    }
    const work = civilWorks.find(w => w.id === form.workId);
    const newEOT: EOTRequest = {
      id: String(Date.now()),
      eotNo: `EOT-${new Date().getFullYear()}-${String(data.length + 1).padStart(3, '0')}`,
      workId: form.workId!,
      workName: work?.name ?? '',
      type: form.type as any,
      requestedBy: 'Er. Rajesh Verma (Logged In)',
      applicationDate: new Date().toISOString().split('T')[0],
      originalEndDate: work?.expectedEndDate ?? '',
      proposedEndDate: form.proposedEndDate,
      daysRequested: form.daysRequested,
      additionalBudget: form.additionalBudget,
      reason: form.reason!,
      justification: form.justification!,
      status: 'Applied',
    };
    setData(prev => [newEOT, ...prev]);
    ToastService.success('EOT Request submitted for managerial evaluation.');
    setPopup({ mode: 'closed' }); setForm({});
  };

  return (
    <FormPage
      title="Extension of Time / Revised Estimate"
      description="Two independent workflows: EOT (delay → timeline extended, no cost change) or Revised Estimate (additional budget required)."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.engineerPortal },
        { label: 'EOT Request' },
      ]}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
        <FormCard>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="pi pi-calendar-plus" />
            </div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Extension of Time (EOT)</div>
              <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>Delay caused by force majeure (rains, litigation, site access). Timeline increases but NO additional cost sanctioned.</div>
            </div>
          </div>
        </FormCard>
        <FormCard>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="pi pi-money-bill" />
            </div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Revised Estimate</div>
              <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>Scope increase or SOR rate revision requiring additional budget sanction. Requires fresh AA/TS approval.</div>
            </div>
          </div>
        </FormCard>
      </div>

      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { field: 'eotNo', header: 'EOT No', cell: (e: EOTRequest) => <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1d4ed8', fontSize: '0.75rem' }}>{e.eotNo}</span> },
            { field: 'workName', header: 'Work' },
            { field: 'type', header: 'Type',
              cell: (e: EOTRequest) => <span className={`civil-pill ${e.type === 'Extension of Time' ? 'blue' : 'amber'}`}>{e.type}</span> },
            { field: 'applicationDate', header: 'Applied' },
            { field: 'daysRequested', header: 'Days / Budget', cell: (e: EOTRequest) => e.daysRequested
              ? <span>{e.daysRequested} days</span>
              : <span>₹{((e.additionalBudget ?? 0) / 100000).toFixed(1)}L</span> },
            { field: 'reason', header: 'Reason', cell: (e: EOTRequest) => <span style={{ fontSize: '0.75rem' }}>{e.reason}</span> },
            { field: 'status', header: 'Status', cell: (e: EOTRequest) => <StatusBadge label={e.status} variant={statusVariant(e.status)} /> },
            { field: 'approvedDays', header: 'Approved',
              cell: (e: EOTRequest) => e.approvedDays
                ? <span style={{ fontWeight: 700, color: '#16a34a' }}>{e.approvedDays} days</span>
                : <span style={{ color: '#9ca3af' }}>—</span> },
            { field: 'id', header: 'Action', sortable: false,
              cell: (item: EOTRequest) => <Button size="small" label="" icon="eye" variant="outlined" onClick={() => setPopup({ mode: 'view', item })} /> },
          ]}
          toolbar={
            <Button label="Apply EOT / Revised Estimate" icon="plus" variant="primary"
              onClick={() => { setForm({}); setPopup({ mode: 'create' }); }} />
          }
          searchBox searchPlaceholder="Search EOT requests..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => { setPopup({ mode: 'closed' }); setForm({}); }}
        title={popup.mode === 'create' ? 'Apply EOT / Revised Estimate' : `EOT — ${popup.item?.eotNo}`}
        subtitle="Submit extension or revised estimate for managerial evaluation."
        size="lg"
      >
        {popup.mode === 'create' ? (
          <>
            <FormGrid columns={2}>
              <DropDownList label="Work *" data={WORK_OPTIONS} textField="name" optionValue="value"
                value={form.workId} onChange={v => setForm(f => ({ ...f, workId: v as string }))} />
              <DropDownList label="Request Type *" data={EOT_TYPES} textField="name" optionValue="value"
                value={form.type} onChange={v => setForm(f => ({ ...f, type: v as any }))} />
            </FormGrid>
            {form.type === 'Extension of Time' && (
              <FormGrid columns={2}>
                <TextBox label="Days Extension Requested *" placeholder="e.g. 92"
                  value={String(form.daysRequested ?? '')} onChange={v => setForm(f => ({ ...f, daysRequested: Number(v) }))} />
                <DatePicker label="Proposed New End Date *"
                  value={form.proposedEndDate ? new Date(form.proposedEndDate) : undefined}
                  onChange={v => setForm(f => ({ ...f, proposedEndDate: v ? v.toISOString().split('T')[0] : '' }))} />
              </FormGrid>
            )}
            {form.type === 'Revised Estimate' && (
              <TextBox label="Additional Budget Required (₹) *" placeholder="e.g. 280000"
                value={String(form.additionalBudget ?? '')} onChange={v => setForm(f => ({ ...f, additionalBudget: Number(v) }))} />
            )}
            <TextBox label="Reason *" placeholder="e.g. Monsoon season delay + Supply chain disruption"
              value={form.reason ?? ''} onChange={v => setForm(f => ({ ...f, reason: v }))} />
            <TextArea label="Detailed Justification *" placeholder="Site records, rainfall data, delays by day..." rows={4}
              value={form.justification ?? ''} onChange={v => setForm(f => ({ ...f, justification: v }))} />
            <div className="flex justify-end gap-3 mt-4">
              <Button label="Cancel" variant="outlined" onClick={() => { setPopup({ mode: 'closed' }); setForm({}); }} />
              <Button label="Submit EOT Application" variant="primary" icon="send" onClick={handleSave} />
            </div>
          </>
        ) : popup.item && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem 2rem', fontSize: '0.8125rem', padding: '1rem', background: '#f9fafb', borderRadius: '0.75rem' }}>
            {[
              ['EOT No', popup.item.eotNo],
              ['Work', popup.item.workName],
              ['Type', popup.item.type],
              ['Applied By', popup.item.requestedBy],
              ['Application Date', popup.item.applicationDate],
              ['Original End Date', popup.item.originalEndDate],
              ['Proposed End Date', popup.item.proposedEndDate ?? '—'],
              ['Days Requested', popup.item.daysRequested ? String(popup.item.daysRequested) : '—'],
              ['Additional Budget', popup.item.additionalBudget ? `₹${(popup.item.additionalBudget / 100000).toFixed(1)}L` : '—'],
              ['Reason', popup.item.reason],
              ['Justification', popup.item.justification],
              ['Status', popup.item.status],
              ['Approved Days', popup.item.approvedDays ? String(popup.item.approvedDays) : '—'],
              ['Review Remarks', popup.item.reviewRemarks ?? '—'],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ color: '#9ca3af', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>{k}</div>
                <div style={{ fontWeight: 500 }}>{v}</div>
              </div>
            ))}
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
