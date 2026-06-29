import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { type Certificate, certificates, trainingPrograms } from '../../mocks';
import { tdmUrls } from '../../urls';

const STATUS_VARIANTS: Record<string, 'approved' | 'pending' | 'rejected' | 'neutral'> = {
  'Issued': 'approved',
  'Renewed': 'approved',
  'Pending': 'pending',
  'Expired': 'rejected',
  'Revoked': 'neutral',
};

type PopupState = { mode: 'closed' } | { mode: 'template' } | { mode: 'bulk' } | { mode: 'view'; item: Certificate } | { mode: 'add' };

export default function CertificateManagementPage() {
  const [data] = useState(certificates);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<any>({});

  const close = () => setPopup({ mode: 'closed' });

  return (
    <FormPage
      title="Certificate Management"
      description="Generate, issue, and manage digital certificates for training programmes."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'Admin Portal', to: tdmUrls.admin.portal },
        { label: 'Certificates' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data as any[]}
          columns={[
            { field: 'certificateNo', header: 'Certificate No.', width: '180px' },
            {
              field: 'participant', header: 'Participant',
              cell: (item) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600 }}>{item.participantName}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{item.participantId} • {item.department}</span>
                </div>
              ),
            },
            {
              field: 'training', header: 'Training Programme',
              cell: (item) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.813rem', color: '#111827', maxWidth: 250, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.trainingTitle}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Issued: {item.issueDate}</span>
                </div>
              ),
            },
            {
              field: 'type', header: 'Type',
              cell: (item) => (
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', background: '#f3f4f6', padding: '2px 8px', borderRadius: 9999 }}>{item.type}</span>
              )
            },
            {
              field: 'status', header: 'Status',
              cell: (item) => (
                <StatusBadge label={item.status} variant={STATUS_VARIANTS[item.status]} />
              ),
            },
            {
              field: 'actions', header: 'Actions', sortable: false, width: '120px',
              cell: (item) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button size="small" icon="eye" variant="outlined" label="" tooltip="Preview" onClick={() => setPopup({ mode: 'view', item })} />
                  <Button size="small" icon="download" variant="primary" label="" tooltip="Download PDF" />
                </div>
              ),
            },
          ]}
          toolbar={
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button label="Add New Record" icon="plus" variant="primary" onClick={() => { setForm({}); setPopup({ mode: 'add' }); }} />
              <Button label="Template Designer" icon="palette" variant="outlined" onClick={() => { setForm({}); setPopup({ mode: 'template' }); }} />
              <Button label="Bulk Generate" icon="cog" variant="primary" onClick={() => { setForm({}); setPopup({ mode: 'bulk' }); }} />
            </div>
          }
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={popup.mode === 'template' ? 'Certificate Template Designer' : popup.mode === 'bulk' ? 'Bulk Generate Certificates' : popup.mode === 'add' ? 'Add New Certificate Record' : 'Certificate Details'}
        size={popup.mode === 'bulk' || popup.mode === 'add' ? 'default' : 'xl'}
      >
        {popup.mode === 'template' && (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex flex-col gap-4 w-full lg:w-1/3 border-r pr-4">
              <h3 className="font-semibold text-lg border-b pb-2">Edit Details</h3>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 font-medium">Title</label>
                <input className="border p-2 rounded text-sm w-full" value={form.title || 'Certificate of Completion'} onChange={e => setForm((f: any) => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 font-medium">Subheading</label>
                <input className="border p-2 rounded text-sm w-full" value={form.subheading || 'This is to certify that'} onChange={e => setForm((f: any) => ({ ...f, subheading: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 font-medium">Description</label>
                <input className="border p-2 rounded text-sm w-full" value={form.description || 'has successfully completed the training programme'} onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 font-medium">Signature Name</label>
                <input className="border p-2 rounded text-sm w-full" value={form.signature || 'Authorized Signatory'} onChange={e => setForm((f: any) => ({ ...f, signature: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <Button label="Cancel" variant="outlined" onClick={close} />
                <Button label="Save Template" variant="primary" icon="check" onClick={close} />
              </div>
            </div>
            <div className="w-full lg:w-2/3 flex justify-center items-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[400px]">
              <div style={{ width: 520, height: 358, position: 'relative' }}>
                <div style={{ transform: 'scale(0.65)', transformOrigin: 'top left', position: 'absolute', top: 0, left: 0 }} className="bg-white shadow-xl w-[800px] h-[550px] border-[10px] border-indigo-900 p-12 flex flex-col items-center justify-center text-center">
                  <h1 className="text-4xl font-serif font-bold text-indigo-900 mb-2">{form.title || 'Certificate of Completion'}</h1>
                <div className="w-24 h-1 bg-amber-500 mb-8"></div>
                <p className="text-xl italic text-gray-600 mb-6">{form.subheading || 'This is to certify that'}</p>
                <h2 className="text-5xl font-serif text-gray-800 mb-6 border-b-2 border-gray-200 px-12 pb-2">[Participant Name]</h2>
                <p className="text-lg text-gray-600 mb-4">{form.description || 'has successfully completed the training programme'}</p>
                <h3 className="text-3xl font-semibold text-indigo-800 mb-12">[Training Programme Title]</h3>
                <div className="flex justify-between w-full mt-auto px-12 border-t pt-8 text-sm font-semibold">
                  <div className="text-center">
                    <div>[Issue Date]</div>
                    <div className="border-t border-black mt-2 pt-1">Date</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-700 font-cursive italic text-xl -mt-4">{form.signature || 'Authorized Signatory'}</div>
                    <div className="border-t border-black mt-2 pt-1">Authorized Signature</div>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {popup.mode === 'bulk' && (
          <>
            <FormGrid columns={1}>
              <DropDownList label="Select Training Programme" data={trainingPrograms.map(p => ({ name: p.title, value: p.trainingId }))} textField="name" optionValue="value" value={form.program ?? ''} onChange={v => setForm((f: any) => ({ ...f, program: v as string }))} />
              <DropDownList label="Select Template" data={[{name: 'Standard Completion', value: 'standard'}, {name: 'Workshop Participation', value: 'workshop'}]} textField="name" optionValue="value" value={form.template ?? 'standard'} onChange={v => setForm((f: any) => ({ ...f, template: v as string }))} />
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#eef2ff', borderRadius: 8, border: '1px solid #c7d2fe' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#4338ca' }}>
                  <strong>Note:</strong> Certificates will only be generated for participants with 'Present' attendance and passing assessment scores (if applicable).
                </p>
              </div>
            </FormGrid>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <Button label="Cancel" variant="outlined" onClick={close} />
              <Button label="Generate Certificates" variant="primary" icon="check" onClick={close} />
            </div>
          </>
        )}
        {popup.mode === 'add' && (
          <>
            <FormGrid columns={1}>
              <TextBox label="Participant Name / ID" value={form.participant ?? ''} onChange={v => setForm((f: any) => ({ ...f, participant: v }))} required />
              <DropDownList label="Select Training Programme" data={trainingPrograms.map(p => ({ name: p.title, value: p.trainingId }))} textField="name" optionValue="value" value={form.program ?? ''} onChange={v => setForm((f: any) => ({ ...f, program: v as string }))} required />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <DropDownList label="Certificate Type" data={[{name: 'Participation', value: 'Participation'}, {name: 'Completion', value: 'Completion'}, {name: 'Excellence', value: 'Excellence'}]} textField="name" optionValue="value" value={form.type ?? ''} onChange={v => setForm((f: any) => ({ ...f, type: v as string }))} required />
                <TextBox label="Valid Until" type="date" value={form.expiry ?? ''} onChange={v => setForm((f: any) => ({ ...f, expiry: v }))} />
              </div>
              <div style={{ marginTop: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Upload Certificate File (PDF/Image)</label>
                <label style={{ display: 'block', border: '2px dashed #d1d5db', borderRadius: 8, padding: '2rem', textAlign: 'center', background: form.file ? '#eef2ff' : '#f9fafb', cursor: 'pointer', borderColor: form.file ? '#6366f1' : '#d1d5db' }}>
                  <input type="file" style={{ display: 'none' }} accept=".pdf,image/*" onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) setForm((f: any) => ({ ...f, file: file.name }));
                  }} />
                  {form.file ? (
                    <>
                      <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: '#4f46e5' }}>task</span>
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#4338ca', fontWeight: 600 }}>{form.file}</p>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>Click to change file</p>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: '#9ca3af' }}>upload_file</span>
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#4b5563' }}>Click to browse or drag and drop a file here</p>
                    </>
                  )}
                </label>
              </div>
            </FormGrid>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <Button label="Cancel" variant="outlined" onClick={close} />
              <Button label="Save Record" variant="primary" icon="check" onClick={close} />
            </div>
          </>
        )}
        {popup.mode === 'view' && (
          <div className="flex flex-col items-center">
            <div className="w-full flex justify-end gap-2 mb-4">
              <Button label="Download PDF" variant="primary" icon="download" />
              <Button label="Close" variant="outlined" onClick={close} />
            </div>
            <div className="w-full flex justify-center items-center bg-gray-50 border border-gray-200 rounded-lg p-8">
              <div style={{ width: 560, height: 385, position: 'relative' }}>
                <div style={{ transform: 'scale(0.7)', transformOrigin: 'top left', position: 'absolute', top: 0, left: 0 }} className="bg-white shadow-xl w-[800px] h-[550px] border-[10px] border-indigo-900 p-12 flex flex-col items-center justify-center text-center">
                  <h1 className="text-4xl font-serif font-bold text-indigo-900 mb-2">Certificate of {popup.item.type}</h1>
                <div className="w-24 h-1 bg-amber-500 mb-8"></div>
                <p className="text-xl italic text-gray-600 mb-6">This is to certify that</p>
                <h2 className="text-5xl font-serif text-gray-800 mb-6 border-b-2 border-gray-200 px-12 pb-2">{popup.item.participantName}</h2>
                <p className="text-lg text-gray-600 mb-4">has successfully completed the training programme</p>
                <h3 className="text-3xl font-semibold text-indigo-800 mb-12">{popup.item.trainingTitle}</h3>
                <div className="flex justify-between w-full mt-auto px-12 border-t pt-8 text-sm font-semibold">
                  <div className="text-center">
                    <div>{popup.item.issueDate}</div>
                    <div className="border-t border-black mt-2 pt-1">Date</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-700 font-cursive italic text-xl -mt-4">Authorized Signatory</div>
                    <div className="border-t border-black mt-2 pt-1">Authorized Signature</div>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
