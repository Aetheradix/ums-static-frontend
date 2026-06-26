import { useCallback, useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList, DatePicker } from 'shared/components/forms';
import { Loader } from 'shared/components/progress';
import {
  FormActions,
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { DEPRECIATION_SCHEDULE } from '../../../mock-data';
import { useQuery } from '@tanstack/react-query';

type DepItem = (typeof DEPRECIATION_SCHEDULE)[0];
const QK = ['@fsc/depreciation'];
function useDepreciationQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: async () => [...DEPRECIATION_SCHEDULE],
  });
  return { data, isLoading };
}

type PopupState = { mode: 'closed' } | { mode: 'create' };

export default function List() {
  const { data, isLoading } = useDepreciationQuery();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Depreciation Runs"
      description="Execute and manage asset depreciation calculations."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search assets..."
          columns={[
            { field: 'assetCode', header: 'Asset Code' },
            { field: 'assetName', header: 'Asset Name' },
            { field: 'financialYear', header: 'Financial Year' },
            { field: 'method', header: 'Method' },
            { field: 'rate', header: 'Rate (%)' },
            {
              field: 'openingValue',
              header: 'Opening Val (₹)',
              cell: (i: DepItem) => (
                <span>₹{i.openingValue.toLocaleString('en-IN')}</span>
              ),
            },
            {
              field: 'depreciationAmount',
              header: 'Dep. Amount (₹)',
              cell: (i: DepItem) => (
                <span className="font-semibold text-orange-700">
                  ₹{i.depreciationAmount.toLocaleString('en-IN')}
                </span>
              ),
            },
            {
              field: 'closingValue',
              header: 'Closing Val (₹)',
              cell: (i: DepItem) => (
                <span>₹{i.closingValue.toLocaleString('en-IN')}</span>
              ),
            },
          ]}
          toolbar={
            <Button
              label="New Run"
              icon="play"
              variant="primary"
              onClick={() => setPopup({ mode: 'create' })}
            />
          }
        />
      </FormCard>
      <FormPopup
        visible={popup.mode === 'create'}
        onHide={closePopup}
        title="Execute Depreciation Run"
        subtitle="Calculate and post depreciation."
        size="lg"
      >
        <DepRunForm onClose={closePopup} />
      </FormPopup>
    </FormPage>
  );
}

function DepRunForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    runDate: '',
    period: 'FY 2024-25 Q1',
    assetCategory: 'All Categories',
  });
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onClose();
      }}
    >
      <FormGrid columns={2}>
        <DatePicker
          label="Run Date"
          value={form.runDate ? new Date(form.runDate) : undefined}
          onChange={v =>
            setForm(p => ({
              ...p,
              runDate: v ? v.toISOString().split('T')[0] : '',
            }))
          }
          required
        />
        <DropDownList
          textField="label"
          valueField="value"
          label="Period"
          data={[
            { label: 'FY 2024-25 Q1', value: 'FY 2024-25 Q1' },
            { label: 'FY 2024-25 Q2', value: 'FY 2024-25 Q2' },
            { label: 'FY 2024-25 Q3', value: 'FY 2024-25 Q3' },
            { label: 'FY 2024-25 Q4', value: 'FY 2024-25 Q4' },
            { label: 'Annual 2024-25', value: 'Annual 2024-25' },
          ]}
          value={form.period}
          onChange={v => setForm(p => ({ ...p, period: v as string }))}
        />
        <DropDownList
          textField="label"
          valueField="value"
          label="Asset Category"
          data={[
            { label: 'All Categories', value: 'All Categories' },
            { label: 'IT Equipment', value: 'IT Equipment' },
            { label: 'Lab Equipment', value: 'Lab Equipment' },
            { label: 'Buildings', value: 'Buildings' },
            { label: 'Vehicles', value: 'Vehicles' },
          ]}
          value={form.assetCategory}
          onChange={v => setForm(p => ({ ...p, assetCategory: v as string }))}
        />
      </FormGrid>
      <FormActions
        isEditMode={false}
        isLoading={false}
        onSave={() => {}}
        onReset={() => {}}
      />
    </form>
  );
}
