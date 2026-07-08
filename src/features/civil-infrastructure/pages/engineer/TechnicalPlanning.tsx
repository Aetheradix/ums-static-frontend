import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage, FormPopup, GridPanel } from 'shared/new-components';
import { civilWorks } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

const WORK_OPTIONS = civilWorks.map(w => ({ name: `${w.workId} — ${w.name}`, value: w.id }));

const technicalPlans = [
  { id: '1', workId: '1', plotArea: '2400 Sqm', builtUpArea: '8500 Sqm', floors: 'G+3', soilType: 'Black Cotton Soil', bearingCapacity: '12 T/Sqm', steelQty: '95 MT', concreteGrade: 'M20/M25', brickwork: '480 Cum', plasterArea: '8500 Sqm', totalMaterials: 6, status: 'Approved' },
  { id: '2', workId: '3', plotArea: '32000 Sqm (3.2 km road)', builtUpArea: '—', floors: 'Single Level Road', soilType: 'Alluvial (Medium)', bearingCapacity: 'CBR 4%', steelQty: '0 MT', concreteGrade: 'PCC M10', brickwork: '0 Cum', plasterArea: '0 Sqm', totalMaterials: 3, status: 'Approved' },
];

export default function TechnicalPlanning() {
  const [data, setData] = useState(technicalPlans);
  const [popup, setPopup] = useState<{ mode: 'closed' | 'create' | 'view'; item?: any }>({ mode: 'closed' });
  const [form, setForm] = useState<any>({});

  const handleSave = () => {
    if (!form.workId) { ToastService.error('Work is required.'); return; }
    setData(prev => [...prev, { ...form, id: String(Date.now()), status: 'Draft' }]);
    ToastService.success('Technical planning workbench submitted.');
    setPopup({ mode: 'closed' }); setForm({});
  };

  return (
    <FormPage
      title="Technical Planning Workbench"
      description="Site engineers input primary site dimensions, resource projections, soil data, and structural requirements into the planning workbench."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.engineerPortal },
        { label: 'Technical Planning' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { field: 'workId', header: 'Work', cell: (t: any) => <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1d4ed8', fontSize: '0.75rem' }}>{civilWorks.find(w => w.id === t.workId)?.workId}</span> },
            { field: 'plotArea', header: 'Plot Area' },
            { field: 'builtUpArea', header: 'Built-up Area' },
            { field: 'floors', header: 'Floors' },
            { field: 'soilType', header: 'Soil Type' },
            { field: 'concreteGrade', header: 'Concrete Grade' },
            { field: 'steelQty', header: 'Steel (MT)' },
            { field: 'status', header: 'Status', cell: (t: any) => <span className={`civil-pill ${t.status === 'Approved' ? 'green' : 'amber'}`}>{t.status}</span> },
            { field: 'id', header: 'Action', sortable: false, cell: (item: any) => <Button size="small" label="" icon="eye" variant="outlined" onClick={() => setPopup({ mode: 'view', item })} /> },
          ]}
          toolbar={<Button label="New Technical Plan" icon="plus" variant="primary" onClick={() => { setForm({}); setPopup({ mode: 'create' }); }} />}
          searchBox searchPlaceholder="Search plans..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => { setPopup({ mode: 'closed' }); setForm({}); }}
        title={popup.mode === 'create' ? 'New Technical Plan' : 'Technical Plan Details'}
        subtitle="Site dimensions and structural resource projections."
        size="lg"
      >
        {popup.mode === 'create' ? (
          <>
            <DropDownList label="Work *" data={WORK_OPTIONS} textField="name" optionValue="value" value={form.workId} onChange={v => setForm((f: any) => ({ ...f, workId: v }))} />
            <FormGrid columns={3}>
              <TextBox label="Plot Area (Sqm)" value={form.plotArea ?? ''} onChange={v => setForm((f: any) => ({ ...f, plotArea: v }))} />
              <TextBox label="Built-up Area (Sqm)" value={form.builtUpArea ?? ''} onChange={v => setForm((f: any) => ({ ...f, builtUpArea: v }))} />
              <TextBox label="No. of Floors" placeholder="e.g. G+3" value={form.floors ?? ''} onChange={v => setForm((f: any) => ({ ...f, floors: v }))} />
            </FormGrid>
            <FormGrid columns={3}>
              <TextBox label="Soil Type" placeholder="e.g. Black Cotton" value={form.soilType ?? ''} onChange={v => setForm((f: any) => ({ ...f, soilType: v }))} />
              <TextBox label="Bearing Capacity (T/Sqm)" value={form.bearingCapacity ?? ''} onChange={v => setForm((f: any) => ({ ...f, bearingCapacity: v }))} />
              <TextBox label="Concrete Grade" placeholder="e.g. M20/M25" value={form.concreteGrade ?? ''} onChange={v => setForm((f: any) => ({ ...f, concreteGrade: v }))} />
            </FormGrid>
            <FormGrid columns={2}>
              <TextBox label="Steel Qty (MT)" value={form.steelQty ?? ''} onChange={v => setForm((f: any) => ({ ...f, steelQty: v }))} />
              <TextBox label="Brickwork (Cum)" value={form.brickwork ?? ''} onChange={v => setForm((f: any) => ({ ...f, brickwork: v }))} />
            </FormGrid>
            <div className="flex justify-end gap-3 mt-4">
              <Button label="Cancel" variant="outlined" onClick={() => { setPopup({ mode: 'closed' }); setForm({}); }} />
              <Button label="Save Technical Plan" variant="primary" icon="save" onClick={handleSave} />
            </div>
          </>
        ) : popup.item && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem 1.5rem', fontSize: '0.8125rem', padding: '1rem', background: '#f9fafb', borderRadius: '0.75rem' }}>
            {Object.entries(popup.item).filter(([k]) => k !== 'id').map(([k, v]) => (
              <div key={k}>
                <div style={{ color: '#9ca3af', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>{k.replace(/([A-Z])/g, ' $1')}</div>
                <div style={{ fontWeight: 600 }}>{String(v)}</div>
              </div>
            ))}
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
