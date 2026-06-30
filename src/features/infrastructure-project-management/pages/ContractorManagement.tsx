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
import { type Contractor, contractors as initialData } from '../mocks';
import { infraUrls } from '../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: Contractor }
  | { mode: 'view'; item: Contractor };

const STATUSES = ['Active', 'Inactive', 'Blacklisted'].map(v => ({
  name: v,
  value: v,
}));

const EMPTY: Partial<Contractor> = {
  companyName: '',
  contractorName: '',
  address: '',
  mobile: '',
  email: '',
  gstNo: '',
  pan: '',
  registrationNo: '',
  bank: '',
  rating: 0,
  status: 'Active',
};

export default function ContractorManagement() {
  const [data, setData] = useState<Contractor[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<Contractor>>(EMPTY);

  const close = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY);
  }, []);

  const handleSave = () => {
    if (!form.companyName || !form.contractorName) {
      ToastService.error('Company Name and Contractor Name are required.');
      return;
    }
    if (popup.mode === 'create') {
      setData(prev => [
        ...prev,
        { ...form, id: String(Date.now()) } as Contractor,
      ]);
      ToastService.success('Contractor added.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(d =>
          d.id === (popup as any).item.id
            ? ({ ...d, ...form } as Contractor)
            : d
        )
      );
      ToastService.success('Contractor updated.');
    }
    close();
  };

  const handleDelete = (item: Contractor) => {
    setData(prev => prev.filter(d => d.id !== item.id));
    ToastService.success('Contractor removed.');
  };

  const isReadOnly = popup.mode === 'view';

  const StarRating = ({ value }: { value: number }) => (
    <span style={{ color: '#f59e0b', fontWeight: 600, fontSize: '0.875rem' }}>
      {'★'.repeat(Math.floor(value))}
      {'☆'.repeat(5 - Math.floor(value))} {value.toFixed(1)}
    </span>
  );

  return (
    <FormPage
      title="Contractor Management"
      description="Maintain contractor details, ratings and registration records."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Infrastructure Projects', to: infraUrls.portal },
        { label: 'Contractor Management' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'contractorName', header: 'Contractor' },
            { field: 'companyName', header: 'Company' },
            { field: 'gstNo', header: 'GST No' },
            { field: 'mobile', header: 'Contact' },
            {
              field: 'rating',
              header: 'Rating',
              cell: (item: Contractor) => <StarRating value={item.rating} />,
            },
            {
              field: 'status',
              header: 'Status',
              cell: (item: Contractor) => (
                <StatusBadge
                  label={item.status}
                  variant={
                    item.status === 'Active'
                      ? 'approved'
                      : item.status === 'Blacklisted'
                        ? 'rejected'
                        : 'neutral'
                  }
                />
              ),
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: Contractor) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button
                    size="small"
                    label=""
                    icon="eye"
                    variant="outlined"
                    onClick={() => {
                      setForm(item);
                      setPopup({ mode: 'view', item });
                    }}
                  />
                  <Button
                    size="small"
                    label=""
                    icon="pencil"
                    variant="outlined"
                    onClick={() => {
                      setForm(item);
                      setPopup({ mode: 'edit', item });
                    }}
                  />
                  <Button
                    size="small"
                    label=""
                    icon="trash"
                    variant="danger"
                    onClick={() => handleDelete(item)}
                  />
                </div>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Add Contractor"
              icon="plus"
              variant="primary"
              onClick={() => {
                setForm(EMPTY);
                setPopup({ mode: 'create' });
              }}
            />
          }
          searchBox
          searchPlaceholder="Search contractors..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={
          popup.mode === 'create'
            ? 'Add Contractor'
            : popup.mode === 'edit'
              ? 'Edit Contractor'
              : 'View Contractor'
        }
        subtitle="Contractor registration and contact details."
        size="lg"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Company Name"
            placeholder="Registered company name"
            value={form.companyName ?? ''}
            onChange={v => setForm(f => ({ ...f, companyName: v }))}
            required
            disabled={isReadOnly}
          />
          <TextBox
            label="Contractor Name"
            placeholder="Contact person name"
            value={form.contractorName ?? ''}
            onChange={v => setForm(f => ({ ...f, contractorName: v }))}
            required
            disabled={isReadOnly}
          />
        </FormGrid>
        <TextBox
          label="Address"
          placeholder="Full address"
          value={form.address ?? ''}
          onChange={v => setForm(f => ({ ...f, address: v }))}
          disabled={isReadOnly}
        />
        <FormGrid columns={2}>
          <TextBox
            label="Mobile"
            placeholder="10-digit mobile"
            value={form.mobile ?? ''}
            onChange={v => setForm(f => ({ ...f, mobile: v }))}
            disabled={isReadOnly}
          />
          <TextBox
            label="Email"
            placeholder="email@company.com"
            value={form.email ?? ''}
            onChange={v => setForm(f => ({ ...f, email: v }))}
            disabled={isReadOnly}
          />
        </FormGrid>
        <FormGrid columns={2}>
          <TextBox
            label="GST Number"
            placeholder="27XXXXX1234A1Z5"
            value={form.gstNo ?? ''}
            onChange={v => setForm(f => ({ ...f, gstNo: v }))}
            disabled={isReadOnly}
          />
          <TextBox
            label="PAN"
            placeholder="ABCDE1234F"
            value={form.pan ?? ''}
            onChange={v => setForm(f => ({ ...f, pan: v }))}
            disabled={isReadOnly}
          />
        </FormGrid>
        <FormGrid columns={2}>
          <TextBox
            label="Registration Number"
            placeholder="PWD registration number"
            value={form.registrationNo ?? ''}
            onChange={v => setForm(f => ({ ...f, registrationNo: v }))}
            disabled={isReadOnly}
          />
          <TextBox
            label="Bank Details"
            placeholder="Bank name - Account number"
            value={form.bank ?? ''}
            onChange={v => setForm(f => ({ ...f, bank: v }))}
            disabled={isReadOnly}
          />
        </FormGrid>
        <FormGrid columns={2}>
          <TextBox
            label="Rating (0–5)"
            placeholder="e.g. 4.5"
            value={String(form.rating ?? '')}
            onChange={v => setForm(f => ({ ...f, rating: parseFloat(v) || 0 }))}
            disabled={isReadOnly}
          />
          <DropDownList
            label="Status"
            data={STATUSES}
            textField="name"
            optionValue="value"
            value={form.status}
            onChange={v => setForm(f => ({ ...f, status: v as any }))}
            disabled={isReadOnly}
          />
        </FormGrid>
        {!isReadOnly && (
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button
              label={popup.mode === 'create' ? 'Add' : 'Update'}
              variant="primary"
              icon="save"
              onClick={handleSave}
            />
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
