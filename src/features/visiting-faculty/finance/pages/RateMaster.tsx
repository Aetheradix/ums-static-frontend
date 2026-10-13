import { useState } from 'react';
import { ToastService } from 'services';
import { NumberBox } from 'shared/components/forms';
import {
  FormActions,
  FormCard,
  FormGrid,
  FormPage,
} from 'shared/new-components';
import { crumbs } from '../../components/hooks';
import { StageNote } from '../../components/ui';
import { useVisitingFacultyStore } from '../../store';
import { inr } from '../../utils';

/** Rates live in a master — departments never type them on a bill. */
export default function RateMaster() {
  const rates = useVisitingFacultyStore(s => s.rates);
  const setRates = useVisitingFacultyStore(s => s.setRates);
  const [form, setForm] = useState(rates);

  const save = () => {
    if (!form.theoryRate || !form.practicalRate || !form.limit) {
      ToastService.error('All three values are required.');
      return;
    }
    setRates(form);
    ToastService.success(
      'Rate master updated — applies to bills prepared from now on.'
    );
  };

  return (
    <FormPage
      title="Rate & Limit Master"
      description="Remuneration rates and the payment limit used by every bill."
      breadcrumbs={crumbs('finance', 'Rate Master')}
    >
      <StageNote>
        Current: {inr(rates.theoryRate)} per theory lecture ·{' '}
        {inr(rates.practicalRate)} per practical · maximum {inr(rates.limit)}{' '}
        per faculty per month across all UTDs. Bills already prepared keep the
        rates they were made with.
      </StageNote>
      <FormCard title="Rates" icon="sliders-h">
        <FormGrid columns={3}>
          <NumberBox
            label="Rate per Theory Lecture (₹)"
            required
            min={0}
            value={form.theoryRate}
            onChange={v => setForm({ ...form, theoryRate: v ?? 0 })}
          />
          <NumberBox
            label="Rate per Practical (₹)"
            required
            min={0}
            value={form.practicalRate}
            onChange={v => setForm({ ...form, practicalRate: v ?? 0 })}
          />
          <NumberBox
            label="Payment Limit per Month (₹)"
            required
            min={0}
            value={form.limit}
            onChange={v => setForm({ ...form, limit: v ?? 0 })}
          />
        </FormGrid>
        <FormActions onSave={save} onReset={() => setForm(rates)} />
      </FormCard>
    </FormPage>
  );
}
