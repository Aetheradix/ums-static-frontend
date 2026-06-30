import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  DatePicker,
  DropDownList,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { type Proposal, proposals as initialData, projects } from '../mocks';
import { infraUrls } from '../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: Proposal }
  | { mode: 'view'; item: Proposal };

const PROJECT_OPTIONS = projects.map(p => ({
  name: `${p.code} — ${p.name}`,
  value: p.id,
}));
const STATUSES = ['Submitted', 'Under Review', 'Approved', 'Rejected'].map(
  v => ({ name: v, value: v })
);

const EMPTY: Partial<Proposal> = {
  proposalNo: '',
  projectId: '',
  projectName: '',
  submittedBy: '',
  proposalDate: '',
  estimatedCost: 0,
  objective: '',
  justification: '',
  scope: '',
  benefits: '',
  status: 'Submitted',
};

const statusVariant = (s: string) => {
  if (s === 'Approved') return 'approved';
  if (s === 'Rejected') return 'rejected';
  if (s === 'Under Review') return 'pending';
  return 'neutral';
};

export default function ProjectProposal() {
  const [data, setData] = useState<Proposal[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<Proposal>>(EMPTY);

  const close = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY);
  }, []);

  const handleSave = () => {
    if (!form.proposalNo) {
      ToastService.error('Proposal Number is required.');
      return;
    }
    if (popup.mode === 'create') {
      const proj = projects.find(p => p.id === form.projectId);
      setData(prev => [
        ...prev,
        {
          ...form,
          id: String(Date.now()),
          projectName: proj?.name ?? '',
        } as Proposal,
      ]);
      ToastService.success('Proposal submitted.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(d =>
          d.id === (popup as any).item.id ? ({ ...d, ...form } as Proposal) : d
        )
      );
      ToastService.success('Proposal updated.');
    }
    close();
  };

  const handleDelete = (item: Proposal) => {
    setData(prev => prev.filter(d => d.id !== item.id));
    ToastService.success('Proposal deleted.');
  };

  const isReadOnly = popup.mode === 'view';

  return (
    <FormPage
      title="Project Proposal"
      description="Submit and track project proposals before formal approval."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Infrastructure Projects', to: infraUrls.portal },
        { label: 'Project Proposal' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'proposalNo', header: 'Proposal No' },
            { field: 'projectName', header: 'Project' },
            { field: 'submittedBy', header: 'Submitted By' },
            { field: 'proposalDate', header: 'Proposal Date' },
            {
              field: 'estimatedCost',
              header: 'Estimated Cost',
              cell: (item: Proposal) => (
                <span>₹{item.estimatedCost.toLocaleString('en-IN')}</span>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              cell: (item: Proposal) => (
                <StatusBadge
                  label={item.status}
                  variant={statusVariant(item.status)}
                />
              ),
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: Proposal) => (
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
              label="Add Proposal"
              icon="plus"
              variant="primary"
              onClick={() => {
                setForm(EMPTY);
                setPopup({ mode: 'create' });
              }}
            />
          }
          searchBox
          searchPlaceholder="Search proposals..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={
          popup.mode === 'create'
            ? 'New Proposal'
            : popup.mode === 'edit'
              ? 'Edit Proposal'
              : 'View Proposal'
        }
        subtitle="Project proposal details and justification."
        size="lg"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Proposal Number"
            placeholder="e.g. PROP-2025-004"
            value={form.proposalNo ?? ''}
            onChange={v => setForm(f => ({ ...f, proposalNo: v }))}
            required
            disabled={isReadOnly}
          />
          <DropDownList
            label="Project"
            data={PROJECT_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.projectId}
            onChange={v => setForm(f => ({ ...f, projectId: v as string }))}
            disabled={isReadOnly}
          />
        </FormGrid>
        <FormGrid columns={3}>
          <TextBox
            label="Submitted By"
            placeholder="Name of submitter"
            value={form.submittedBy ?? ''}
            onChange={v => setForm(f => ({ ...f, submittedBy: v }))}
            disabled={isReadOnly}
          />
          <DatePicker
            label="Proposal Date"
            value={form.proposalDate ? new Date(form.proposalDate) : undefined}
            onChange={v =>
              setForm(f => ({
                ...f,
                proposalDate: v ? v.toISOString().split('T')[0] : '',
              }))
            }
            disabled={isReadOnly}
          />
          <TextBox
            label="Estimated Cost (₹)"
            placeholder="e.g. 5000000"
            value={String(form.estimatedCost ?? '')}
            onChange={v => setForm(f => ({ ...f, estimatedCost: Number(v) }))}
            disabled={isReadOnly}
          />
        </FormGrid>
        <TextArea
          label="Objective"
          placeholder="What this project aims to achieve"
          value={form.objective ?? ''}
          onChange={v => setForm(f => ({ ...f, objective: v }))}
          disabled={isReadOnly}
          rows={2}
        />
        <TextArea
          label="Justification"
          placeholder="Why this project is necessary"
          value={form.justification ?? ''}
          onChange={v => setForm(f => ({ ...f, justification: v }))}
          disabled={isReadOnly}
          rows={2}
        />
        <TextArea
          label="Scope"
          placeholder="Define the scope of work"
          value={form.scope ?? ''}
          onChange={v => setForm(f => ({ ...f, scope: v }))}
          disabled={isReadOnly}
          rows={2}
        />
        <FormGrid columns={2}>
          <TextArea
            label="Benefits"
            placeholder="Expected benefits and outcomes"
            value={form.benefits ?? ''}
            onChange={v => setForm(f => ({ ...f, benefits: v }))}
            disabled={isReadOnly}
            rows={2}
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
              label={popup.mode === 'create' ? 'Submit' : 'Update'}
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
