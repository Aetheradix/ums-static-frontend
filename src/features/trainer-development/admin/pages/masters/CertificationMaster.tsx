import { useCallback, useState } from 'react';
import { ToastService } from 'services';
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
import { type CertificationMaster, certificationMasters as initialData } from '../../../mocks';
import { tdmUrls } from '../../../urls';

type PopupState = { mode: 'closed' } | { mode: 'create' } | { mode: 'edit'; item: CertificationMaster } | { mode: 'view'; item: CertificationMaster };

const EMPTY: Partial<CertificationMaster> = { code: '', name: '', validityMonths: 12, templateType: 'Standard', approvalRequired: false, status: 'Active' };
const STATUS_OPTIONS = [{ name: 'Active', value: 'Active' }, { name: 'Inactive', value: 'Inactive' }];
const TEMPLATE_OPTIONS = [
  { name: 'Standard', value: 'Standard' },
  { name: 'Custom', value: 'Custom' },
  { name: 'External', value: 'External' },
];

export default function CertificationMasterPage() {
  const [data, setData] = useState<CertificationMaster[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<CertificationMaster>>(EMPTY);

  const close = useCallback(() => { setPopup({ mode: 'closed' }); setForm(EMPTY); }, []);

  const handleSave = () => {
    if (!form.code || !form.name) { ToastService.error('Code and Name are required.'); return; }
    if (popup.mode === 'create') {
      setData(prev => [...prev, { ...form, id: String(Date.now()) } as CertificationMaster]);
      ToastService.success('Certification created.');
    } else if (popup.mode === 'edit') {
      setData(prev => prev.map(d => d.id === (popup as any).item.id ? { ...d, ...form } as CertificationMaster : d));
      ToastService.success('Certification updated.');
    }
    close();
  };

  const handleDelete = (item: CertificationMaster) => {
    setData(prev => prev.filter(d => d.id !== item.id));
    ToastService.success('Certification deleted.');
  };

  const isReadOnly = popup.mode === 'view';

  return (
    <FormPage
      title="Certification Master"
      description="Manage certification types, templates and renewal validity policies."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'Admin Portal', to: tdmUrls.admin.portal },
        { label: 'Certification Master' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'code', header: 'Code' },
            { field: 'name', header: 'Certification Name' },
            { field: 'validityMonths', header: 'Validity (Months)' },
            { field: 'templateType', header: 'Template Type' },
            {
              field: 'status', header: 'Status',
              cell: (item: CertificationMaster) => (
                <StatusBadge label={item.status} variant={item.status === 'Active' ? 'approved' : 'neutral'} />
              ),
            },
            {
              field: 'id', header: 'Actions', sortable: false,
              cell: (item: CertificationMaster) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button size="small" label="" icon="eye" variant="outlined" onClick={() => { setForm(item); setPopup({ mode: 'view', item }); }} />
                  <Button size="small" label="" icon="pencil" variant="primary" onClick={() => { setForm(item); setPopup({ mode: 'edit', item }); }} />
                  <Button size="small" label="" icon="trash" variant="danger" onClick={() => handleDelete(item)} />
                </div>
              ),
            },
          ]}
          toolbar={<Button label="Add Certification" icon="plus" variant="primary" onClick={() => { setForm(EMPTY); setPopup({ mode: 'create' }); }} />}
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={popup.mode === 'create' ? 'Add Certification' : popup.mode === 'edit' ? 'Edit Certification' : 'View Certification'}
      >
        <FormGrid columns={2}>
          <TextBox label="Code" value={form.code ?? ''} onChange={v => setForm(f => ({ ...f, code: v }))} required readOnly={isReadOnly} />
          <TextBox label="Name" value={form.name ?? ''} onChange={v => setForm(f => ({ ...f, name: v }))} required readOnly={isReadOnly} />
          <TextBox label="Validity (Months)" type="number" value={form.validityMonths?.toString() ?? ''} onChange={v => setForm(f => ({ ...f, validityMonths: Number(v) }))} readOnly={isReadOnly} />
          <DropDownList label="Template Type" data={TEMPLATE_OPTIONS} textField="name" optionValue="value" value={form.templateType} onChange={v => setForm(f => ({ ...f, templateType: v as any }))} />
          <DropDownList label="Status" data={STATUS_OPTIONS} textField="name" optionValue="value" value={form.status} onChange={v => setForm(f => ({ ...f, status: v as any }))} />
        </FormGrid>
        {!isReadOnly && (
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button label={popup.mode === 'create' ? 'Create' : 'Save Changes'} variant="primary" icon="check" onClick={handleSave} />
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
