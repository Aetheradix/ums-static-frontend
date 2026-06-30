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
import {
  type Inspection,
  inspections as initialData,
  projects,
} from '../mocks';
import { infraUrls } from '../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: Inspection }
  | { mode: 'view'; item: Inspection };

const PROJECT_OPTIONS = projects.map(p => ({
  name: `${p.code} — ${p.name}`,
  value: p.id,
}));
const COMPLIANCE_OPTIONS = ['Compliant', 'Non-Compliant', 'Partial'].map(v => ({
  name: v,
  value: v,
}));
const RESULT_OPTIONS = ['Passed', 'Failed', 'Conditional'].map(v => ({
  name: v,
  value: v,
}));

const EMPTY: Partial<Inspection> = {
  inspectionNo: '',
  projectId: '',
  projectName: '',
  inspectionDate: '',
  inspector: '',
  findings: '',
  compliance: 'Compliant',
  remarks: '',
  result: 'Passed',
};

const resultVariant = (r: string) => {
  if (r === 'Passed') return 'approved';
  if (r === 'Failed') return 'rejected';
  return 'pending';
};

export default function Inspections() {
  const [data, setData] = useState<Inspection[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<Inspection>>(EMPTY);

  const close = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY);
  }, []);

  const handleSave = () => {
    if (!form.inspectionNo) {
      ToastService.error('Inspection Number is required.');
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
        } as Inspection,
      ]);
      ToastService.success('Inspection recorded.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(d =>
          d.id === (popup as any).item.id
            ? ({ ...d, ...form } as Inspection)
            : d
        )
      );
      ToastService.success('Inspection updated.');
    }
    close();
  };

  const handleDelete = (item: Inspection) => {
    setData(prev => prev.filter(d => d.id !== item.id));
    ToastService.success('Inspection deleted.');
  };

  const isReadOnly = popup.mode === 'view';

  return (
    <FormPage
      title="Inspections"
      description="Record and manage site inspections and compliance findings."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Infrastructure Projects', to: infraUrls.portal },
        { label: 'Inspections' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'inspectionNo', header: 'Inspection No' },
            { field: 'projectName', header: 'Project' },
            { field: 'inspector', header: 'Inspector' },
            { field: 'inspectionDate', header: 'Date' },
            {
              field: 'result',
              header: 'Result',
              cell: (item: Inspection) => (
                <StatusBadge
                  label={item.result}
                  variant={resultVariant(item.result)}
                />
              ),
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: Inspection) => (
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
              label="Add Inspection"
              icon="plus"
              variant="primary"
              onClick={() => {
                setForm(EMPTY);
                setPopup({ mode: 'create' });
              }}
            />
          }
          searchBox
          searchPlaceholder="Search inspections..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={
          popup.mode === 'create'
            ? 'Record Inspection'
            : popup.mode === 'edit'
              ? 'Edit Inspection'
              : 'View Inspection'
        }
        subtitle="Inspection details, findings and compliance."
        size="lg"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Inspection Number"
            placeholder="e.g. INSP-2025-005"
            value={form.inspectionNo ?? ''}
            onChange={v => setForm(f => ({ ...f, inspectionNo: v }))}
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
        <FormGrid columns={2}>
          <DatePicker
            label="Inspection Date"
            value={
              form.inspectionDate ? new Date(form.inspectionDate) : undefined
            }
            onChange={v =>
              setForm(f => ({
                ...f,
                inspectionDate: v ? v.toISOString().split('T')[0] : '',
              }))
            }
            disabled={isReadOnly}
          />
          <TextBox
            label="Inspector"
            placeholder="Inspector name and designation"
            value={form.inspector ?? ''}
            onChange={v => setForm(f => ({ ...f, inspector: v }))}
            disabled={isReadOnly}
          />
        </FormGrid>
        <TextArea
          label="Findings"
          placeholder="Detailed inspection findings"
          value={form.findings ?? ''}
          onChange={v => setForm(f => ({ ...f, findings: v }))}
          disabled={isReadOnly}
          rows={3}
        />
        <FormGrid columns={2}>
          <DropDownList
            label="Compliance"
            data={COMPLIANCE_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.compliance}
            onChange={v => setForm(f => ({ ...f, compliance: v as any }))}
            disabled={isReadOnly}
          />
          <DropDownList
            label="Result"
            data={RESULT_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.result}
            onChange={v => setForm(f => ({ ...f, result: v as any }))}
            disabled={isReadOnly}
          />
        </FormGrid>
        <TextArea
          label="Remarks"
          placeholder="Action items and follow-up notes"
          value={form.remarks ?? ''}
          onChange={v => setForm(f => ({ ...f, remarks: v }))}
          disabled={isReadOnly}
          rows={2}
        />
        {!isReadOnly && (
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button
              label={popup.mode === 'create' ? 'Record' : 'Update'}
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
