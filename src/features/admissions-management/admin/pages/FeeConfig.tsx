import { useState, useEffect } from 'react';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { TextBox } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { ToastService } from 'services';
import { FeeConfigSeedService, type SeedFeeConfig } from '../../seed';
import { admissionsUrls } from '../../urls';

export default function FeeConfig() {
  const [fees, setFees] = useState<SeedFeeConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editRegistration, setEditRegistration] = useState<number>(0);
  const [editRecurring, setEditRecurring] = useState<number>(0);

  const load = async () => {
    setLoading(true);
    const data = await FeeConfigSeedService.getAll();
    setFees(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (f: SeedFeeConfig) => {
    setEditId(f.id);
    setEditRegistration(f.registrationFee);
    setEditRecurring(f.recurringFee);
  };

  const handleSave = async (id: string) => {
    await FeeConfigSeedService.update(id, {
      registrationFee: editRegistration,
      recurringFee: editRecurring,
    });
    ToastService.success('Fee configuration saved');
    setEditId(null);
    load();
  };

  return (
    <FormPage
      title="Fee Configuration"
      description="Set registration fee and recurring fee per programme and applicant category."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Admissions Management', to: admissionsUrls.root },
        { label: 'Admin Portal', to: admissionsUrls.admin.root },
        { label: 'Fee Config' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={fees}
          loading={loading}
          columns={[
            {
              cell: (_, opt) => <span>{opt.rowIndex + 1}</span>,
              width: '50px',
              header: 'S.No',
            },
            { header: 'Programme', field: 'programmeName', sortable: true },
            { header: 'Category', field: 'category', sortable: true },
            {
              header: 'Registration Fee (₹)',
              cell: (item: SeedFeeConfig) =>
                editId === item.id ? (
                  <TextBox
                    value={String(editRegistration)}
                    onChange={v => setEditRegistration(Number(v))}
                    type="number"
                  />
                ) : (
                  <span>₹{item.registrationFee.toLocaleString()}</span>
                ),
            },
            {
              header: 'Recurring Fee (₹)',
              cell: (item: SeedFeeConfig) =>
                editId === item.id ? (
                  <TextBox
                    value={String(editRecurring)}
                    onChange={v => setEditRecurring(Number(v))}
                    type="number"
                  />
                ) : (
                  <span>₹{item.recurringFee.toLocaleString()}</span>
                ),
            },
            {
              header: 'Actions',
              cell: (item: SeedFeeConfig) =>
                editId === item.id ? (
                  <div className="flex gap-2">
                    <Button
                      label="Save"
                      variant="primary"
                      onClick={() => handleSave(item.id)}
                    />
                    <Button
                      label="Cancel"
                      variant="outlined"
                      onClick={() => setEditId(null)}
                    />
                  </div>
                ) : (
                  <Button
                    icon="pi pi-pencil"
                    variant="text"
                    onClick={() => startEdit(item)}
                  />
                ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
