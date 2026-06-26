import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import {
  type AcademicDistinction,
  academicDistinctions as initialData,
} from '../../../data';
import { programmeUrls } from '../../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: AcademicDistinction };

const EMPTY_FORM = {
  name: '',
  minPercentage: '',
  maxPercentage: '',
  description: '',
};

export default function AcademicDistinctionPage() {
  const [data, setData] = useState<AcademicDistinction[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState(EMPTY_FORM);

  const closePopup = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY_FORM);
  }, []);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setPopup({ mode: 'create' });
  };

  const openEdit = (item: AcademicDistinction) => {
    setForm({
      name: item.name,
      minPercentage: String(item.minPercentage),
      maxPercentage: String(item.maxPercentage),
      description: item.description,
    });
    setPopup({ mode: 'edit', item });
  };

  const handleSave = () => {
    if (popup.mode === 'create') {
      setData(prev => [
        ...prev,
        {
          id: String(Date.now()),
          ...form,
          minPercentage: Number(form.minPercentage),
          maxPercentage: Number(form.maxPercentage),
        },
      ]);
      ToastService.success('Academic distinction created successfully.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(d =>
          d.id === popup.item.id
            ? {
                ...d,
                ...form,
                minPercentage: Number(form.minPercentage),
                maxPercentage: Number(form.maxPercentage),
              }
            : d
        )
      );
      ToastService.success('Academic distinction updated successfully.');
    }
    closePopup();
  };

  return (
    <FormPage
      title="Academic Distinction"
      description="Define academic distinction criteria and percentage boundaries."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Programme Management', to: programmeUrls.portal },
        { label: 'Admin Portal', to: programmeUrls.admin.portal },
        { label: 'Settings', to: programmeUrls.admin.settings.portal },
        { label: 'Academic Distinction' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          onEdit={openEdit}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'name', header: 'Distinction Name' },
            { field: 'minPercentage', header: 'Min %' },
            { field: 'maxPercentage', header: 'Max %' },
            { field: 'description', header: 'Description' },
          ]}
          toolbar={
            <Button
              label="Create"
              icon="plus"
              variant="primary"
              onClick={openCreate}
            />
          }
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={closePopup}
        title={
          popup.mode === 'create'
            ? 'Create Academic Distinction'
            : 'Edit Academic Distinction'
        }
        subtitle="Fill in the distinction criteria."
        size="default"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Distinction Name"
            placeholder="e.g. Distinction"
            value={form.name}
            onChange={v => setForm(f => ({ ...f, name: v }))}
            required
          />
          <TextBox
            label="Description"
            placeholder="e.g. Outstanding academic performance"
            value={form.description}
            onChange={v => setForm(f => ({ ...f, description: v }))}
          />
          <TextBox
            label="Min Percentage (%)"
            placeholder="e.g. 75"
            value={form.minPercentage}
            onChange={v => setForm(f => ({ ...f, minPercentage: v }))}
            required
          />
          <TextBox
            label="Max Percentage (%)"
            placeholder="e.g. 100"
            value={form.maxPercentage}
            onChange={v => setForm(f => ({ ...f, maxPercentage: v }))}
            required
          />
        </FormGrid>
        <div className="flex justify-end gap-3 mt-4">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button label="Save" variant="primary" onClick={handleSave} />
        </div>
      </FormPopup>
    </FormPage>
  );
}
