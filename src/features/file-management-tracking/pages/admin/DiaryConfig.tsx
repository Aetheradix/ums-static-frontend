import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList, Switch, TextBox } from 'shared/components/forms';
import { Icon } from 'shared/components/Icon/Icon';
import { FormGrid, FormPage, FormPopup } from 'shared/new-components';
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
      breadcrumbs={[
        {
          label: 'File Management Tracking',
          to: '/home/sub-menu/file-management-tracking',
        },
        { label: 'Admin' },
        { label: 'Diary Number Configuration' },
      ]}
      title="Diary Number Configuration"
      description="Design and configure diary numbering rules for DAK receipts"
    >
      {/* Global Settings Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Icon name="settings" className="text-[18px]" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Global Settings</h3>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 opacity-80" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            <Switch
              label="Auto-generate Numbers"
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
          </div>

          <div className="bg-slate-50 rounded-xl p-4 md:p-5 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 group-hover:border-blue-200 transition-colors">
            <div className="flex items-center gap-2 text-slate-500">
              <Icon name="visibility" className="text-lg" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Live Preview
              </span>
            </div>
            <span className="font-mono text-lg font-bold text-slate-800 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
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
          </div>
        </div>
      </div>

      {/* OU-Wise Templates Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Icon name="account_tree" className="text-[18px]" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              OU-Wise Templates
            </h3>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 hover:shadow-md transition-all text-sm font-bold shadow-sm"
          >
            <Icon name="add" className="text-[18px]" />
            Add Template
          </button>
        </div>

        <div className="space-y-3">
          {templates.map(t => (
            <div
              key={t.id}
              className={`bg-white rounded-xl border p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
                t.isActive ? 'border-gray-200' : 'border-gray-200 opacity-75'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <h4 className="text-base font-bold text-gray-900">
                    {t.departmentName || 'Global'}
                  </h4>
                  {!t.isActive && (
                    <span className="text-[10px] uppercase tracking-wider bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold">
                      Inactive
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Icon name="tag" className="text-[14px] text-gray-400" />
                    <span className="font-medium text-gray-700">
                      Code:
                    </span>{' '}
                    {t.ouCode}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon
                      name="space_bar"
                      className="text-[14px] text-gray-400"
                    />
                    <span className="font-medium text-gray-700">
                      Separator:
                    </span>{' '}
                    "{t.separatorChar}"
                  </span>
                </div>
              </div>

              <div className="flex-1 md:text-center flex justify-start md:justify-center">
                <div className="inline-flex flex-col items-start md:items-center">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                    Generated Output
                  </span>
                  <span className="font-mono text-sm bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-bold shadow-sm">
                    {previewTemplate(t)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-start md:justify-end gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 mt-2 md:mt-0 border-gray-100">
                <button
                  onClick={() => toggleActive(t.id)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                    t.isActive
                      ? 'text-green-600 hover:bg-green-50'
                      : 'text-gray-400 hover:bg-gray-100'
                  }`}
                  title={t.isActive ? 'Deactivate' : 'Activate'}
                >
                  <Icon
                    name={t.isActive ? 'check_circle' : 'power_settings_new'}
                    className="text-[22px]"
                  />
                </button>
                <button
                  onClick={() => openEdit(t)}
                  className="flex items-center justify-center w-10 h-10 rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Edit Template"
                >
                  <Icon name="edit" className="text-[20px]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

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
