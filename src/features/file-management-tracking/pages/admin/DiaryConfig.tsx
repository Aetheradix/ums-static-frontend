import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList, Switch, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import {
  mockDiaryTemplates,
  mockSystemConfig,
  type DiaryTemplate,
} from '../../data';

export default function DiaryConfig() {
  const [globalConfig, setGlobalConfig] = useState(mockSystemConfig);
  const [templates, setTemplates] = useState(mockDiaryTemplates);
  const [popup, setPopup] = useState<{ open: boolean; item?: DiaryTemplate }>({
    open: false,
  });
  const [form, setForm] = useState<Partial<DiaryTemplate>>({});

  const openCreate = () => {
    setForm({
      scope: 'OU-Wise',
      ouCode: '',
      separatorChar: '/',
      includeYear: true,
      includeMonth: false,
      isActive: true,
    });
    setPopup({ open: true });
  };
  const openEdit = (item: DiaryTemplate) => {
    setForm({ ...item });
    setPopup({ open: true, item });
  };
  const saveTemplate = () => {
    if (popup.item) {
      const idx = templates.findIndex(t => t.id === popup.item!.id);
      if (idx !== -1)
        templates[idx] = { ...templates[idx], ...form } as DiaryTemplate;
    } else {
      templates.push({
        ...form,
        id: Math.max(...templates.map(t => t.id)) + 1,
      } as DiaryTemplate);
    }
    setTemplates([...templates]);
    setPopup({ open: false });
  };
  const toggleActive = (id: number) => {
    const t = templates.find(x => x.id === id);
    if (t) {
      t.isActive = !t.isActive;
      setTemplates([...templates]);
    }
  };

  const previewTemplate = (t: DiaryTemplate) => {
    const year = t.includeYear ? '2026' : '';
    const month = t.includeMonth ? '06' : '';
    const parts = [t.ouCode, t.userDefinedVar1, year, month].filter(Boolean);
    return parts.join(t.separatorChar) + t.separatorChar + 'XXXXX';
  };

  return (
    <FormPage
      title="Diary Number Configuration"
      description="Configure diary number generation for DAK receipts"
    >
      <FormCard title="Global Settings" icon="settings" className="mb-6">
        <FormGrid>
          <Switch
            label="Auto-generate Diary Numbers"
            checked={globalConfig.autoDiaryNumber}
            onChange={v =>
              setGlobalConfig({ ...globalConfig, autoDiaryNumber: v })
            }
          />
          <TextBox
            label="Global OU Code"
            value={globalConfig.globalOuCode}
            onChange={v =>
              setGlobalConfig({ ...globalConfig, globalOuCode: v })
            }
          />
          <TextBox
            label="Global Separator"
            value={globalConfig.globalSeparatorChar}
            onChange={v =>
              setGlobalConfig({
                ...globalConfig,
                globalSeparatorChar: v as any,
              })
            }
          />
          <Switch
            label="Include Year"
            checked={globalConfig.globalIncludeYear}
            onChange={v =>
              setGlobalConfig({ ...globalConfig, globalIncludeYear: v })
            }
          />
          <Switch
            label="Include Month"
            checked={globalConfig.globalIncludeMonth}
            onChange={v =>
              setGlobalConfig({ ...globalConfig, globalIncludeMonth: v })
            }
          />
        </FormGrid>
        <FormCard title="Preview" className="mt-2">
          <span className="font-mono font-bold text-sm">
            {previewTemplate({
              id: 0,
              scope: 'Global',
              ouCode: globalConfig.globalOuCode,
              separatorChar: globalConfig.globalSeparatorChar,
              includeYear: globalConfig.globalIncludeYear,
              includeMonth: globalConfig.globalIncludeMonth,
              isActive: true,
            })}
          </span>
        </FormCard>
      </FormCard>

      <GridPanel
        title="OU-Wise Diary Templates"
        data={templates}
        columns={
          [
            {
              field: 'departmentName',
              header: 'Department',
              cell: (row: any) => <span>{row.departmentName || 'Global'}</span>,
            },
            { field: 'ouCode', header: 'OU Code' },
            { field: 'separatorChar', header: 'Separator' },
            {
              field: 'isActive',
              header: 'Active',
              cell: (row: any) => (
                <Button
                  label={row.isActive ? 'Active' : 'Inactive'}
                  variant="text"
                  size="small"
                  onClick={() => toggleActive(row.id)}
                />
              ),
            },
            {
              header: 'Preview',
              cell: (row: any) => (
                <span className="font-mono text-xs">
                  {previewTemplate(row)}
                </span>
              ),
            },
            {
              header: 'Actions',
              cell: (row: any) => (
                <Button
                  icon="pencil"
                  variant="text"
                  size="small"
                  onClick={() => openEdit(row)}
                />
              ),
            },
          ] as any
        }
        dataKey="id"
        toolbar={
          <Button label="Add OU Template" icon="add" onClick={openCreate} />
        }
      />

      {popup.open && (
        <FormPopup
          visible
          onHide={() => setPopup({ open: false })}
          title={popup.item ? 'Edit Template' : 'Add OU Template'}
          size="default"
        >
          <FormGrid>
            <TextBox
              label="OU Code"
              value={form.ouCode || ''}
              onChange={v => setForm({ ...form, ouCode: v })}
              required
            />
            <DropDownList
              label="Separator"
              value={form.separatorChar || '/'}
              onChange={v => setForm({ ...form, separatorChar: v as string })}
              data={[
                { value: '/', label: '/' },
                { value: '-', label: '-' },
                { value: '_', label: '_' },
              ]}
              textField="label"
              valueField="value"
            />
            <TextBox
              label="User Var 1"
              value={form.userDefinedVar1 || ''}
              onChange={v => setForm({ ...form, userDefinedVar1: v })}
            />
            <Switch
              label="Include Year"
              checked={form.includeYear ?? true}
              onChange={v => setForm({ ...form, includeYear: v })}
            />
            <Switch
              label="Include Month"
              checked={form.includeMonth ?? false}
              onChange={v => setForm({ ...form, includeMonth: v })}
            />
          </FormGrid>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setPopup({ open: false })}
            />
            <Button label="Save" onClick={saveTemplate} />
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
