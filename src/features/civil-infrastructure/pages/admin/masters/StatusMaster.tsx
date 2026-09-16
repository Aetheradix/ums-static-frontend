import { useEffect, useMemo, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { initialStatusMasters } from '../../../mocks';
import { civilUrls } from '../../../urls';
import '../../civil.css';

const STORAGE_KEY = 'civil_status_masters';

const MODULE_OPTIONS = [
  { label: 'All Modules', value: 'ALL' },
  { label: 'Civil Work Lifecycle', value: 'work' },
  { label: 'Tendering & Bidding', value: 'tender' },
  { label: 'Measurement Book (MB)', value: 'mb' },
  { label: 'RA Bill & Finance', value: 'ra-bill' },
];

export default function StatusMaster() {
  const [data, setData] = useState<CivilManagement.StatusMaster[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialStatusMasters;
  });

  const [filterModule, setFilterModule] = useState<string>('ALL');

  const [popup, setPopup] = useState<{
    mode: 'closed' | 'add' | 'edit';
    item?: CivilManagement.StatusMaster;
  }>({ mode: 'closed' });

  const [formModule, setFormModule] = useState('work');
  const [formCode, setFormCode] = useState('');
  const [formLabel, setFormLabel] = useState('');
  const [formColor, setFormColor] = useState('#3b82f6');
  const [formSeq, setFormSeq] = useState('1');
  const [formActive, setFormActive] = useState(true);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const filteredData = useMemo(() => {
    if (filterModule === 'ALL') return data;
    return data.filter(d => d.module === filterModule);
  }, [data, filterModule]);

  const openAdd = () => {
    setFormModule(filterModule !== 'ALL' ? filterModule : 'work');
    setFormCode('');
    setFormLabel('');
    setFormColor('#3b82f6');
    setFormSeq((data.length + 1).toString());
    setFormActive(true);
    setPopup({ mode: 'add' });
  };

  const openEdit = (item: CivilManagement.StatusMaster) => {
    setFormModule(item.module);
    setFormCode(item.code);
    setFormLabel(item.label);
    setFormColor(item.colorHex || '#3b82f6');
    setFormSeq(item.sequence.toString());
    setFormActive(item.isActive);
    setPopup({ mode: 'edit', item });
  };

  const handleSave = () => {
    if (!formCode.trim() || !formLabel.trim()) {
      ToastService.error('Status Code and Label are required.');
      return;
    }

    const seqNumber = parseInt(formSeq, 10) || 1;

    if (popup.mode === 'add') {
      const newItem: CivilManagement.StatusMaster = {
        id: `SM-${Date.now().toString().slice(-4)}`,
        module: formModule,
        code: formCode.trim().toUpperCase(),
        label: formLabel.trim(),
        colorHex: formColor,
        sequence: seqNumber,
        isActive: formActive,
      };
      setData(prev =>
        [...prev, newItem].sort((a, b) => a.sequence - b.sequence)
      );
      ToastService.success(`Status "${newItem.label}" added.`);
    } else if (popup.mode === 'edit' && popup.item) {
      setData(prev =>
        prev
          .map(d =>
            d.id === popup.item!.id
              ? {
                  ...d,
                  module: formModule,
                  code: formCode.trim().toUpperCase(),
                  label: formLabel.trim(),
                  colorHex: formColor,
                  sequence: seqNumber,
                  isActive: formActive,
                }
              : d
          )
          .sort((a, b) => a.sequence - b.sequence)
      );
      ToastService.success(`Status updated.`);
    }
    setPopup({ mode: 'closed' });
  };

  const toggleStatus = (id: string) => {
    setData(prev =>
      prev.map(d => {
        if (d.id === id) {
          const next = !d.isActive;
          ToastService.info(`Status ${next ? 'Activated' : 'Deactivated'}.`);
          return { ...d, isActive: next };
        }
        return d;
      })
    );
  };

  return (
    <FormPage
      title="Workflow Status Master"
      description="Registry of lifecycle statuses and transition states across Civil Engineering workflows."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.adminPortal },
        { label: 'Masters' },
        { label: 'Status Master' },
      ]}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          gap: '1rem',
        }}
      >
        <div style={{ width: '280px' }}>
          <DropDownList
            label="Filter by Sub-Module"
            data={MODULE_OPTIONS}
            textField="label"
            optionValue="value"
            value={filterModule}
            onChange={val => setFilterModule(val as string)}
          />
        </div>
        <Button
          label="Add Status"
          icon="plus"
          variant="primary"
          onClick={openAdd}
        />
      </div>

      <FormCard>
        <GridPanel
          data={filteredData}
          columns={[
            {
              field: 'sequence',
              header: 'Seq #',
              cell: (item: CivilManagement.StatusMaster) => (
                <span
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: '#f3f4f6',
                    color: '#374151',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                  }}
                >
                  {item.sequence}
                </span>
              ),
              width: '70px',
            },
            {
              field: 'module',
              header: 'Sub-Module',
              cell: (item: CivilManagement.StatusMaster) => (
                <span
                  className="civil-pill blue"
                  style={{ fontSize: '0.72rem', textTransform: 'uppercase' }}
                >
                  {item.module}
                </span>
              ),
            },
            {
              field: 'code',
              header: 'Status Code',
              cell: (item: CivilManagement.StatusMaster) => (
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: '#1d4ed8',
                  }}
                >
                  {item.code}
                </span>
              ),
            },
            {
              field: 'label',
              header: 'Status Label & Preview',
              cell: (item: CivilManagement.StatusMaster) => (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: item.colorHex || '#3b82f6',
                      display: 'inline-block',
                    }}
                  />
                  <span style={{ fontWeight: 600 }}>{item.label}</span>
                </div>
              ),
            },
            {
              field: 'isActive',
              header: 'Status',
              cell: (item: CivilManagement.StatusMaster) => (
                <button
                  type="button"
                  onClick={() => toggleStatus(item.id)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                  title="Click to toggle status"
                >
                  <StatusBadge
                    label={item.isActive ? 'Active' : 'Inactive'}
                    variant={item.isActive ? 'success' : 'neutral'}
                  />
                </button>
              ),
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: CivilManagement.StatusMaster) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button
                    size="small"
                    label=""
                    icon="pencil"
                    variant="outlined"
                    onClick={() => openEdit(item)}
                  />
                  <Button
                    size="small"
                    label=""
                    icon={item.isActive ? 'lock' : 'unlock'}
                    variant="outlined"
                    onClick={() => toggleStatus(item.id)}
                  />
                </div>
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Search workflow statuses..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'add' ? 'Add Workflow Status' : 'Edit Workflow Status'
        }
        subtitle="Civil infrastructure process status registry."
        size="md"
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginTop: '0.5rem',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
            }}
          >
            <DropDownList
              label="Module"
              data={MODULE_OPTIONS.filter(o => o.value !== 'ALL')}
              textField="label"
              optionValue="value"
              value={formModule}
              onChange={val => setFormModule(val as string)}
              required
            />
            <TextBox
              label="Workflow Sequence (1..N)"
              placeholder="1"
              value={formSeq}
              onChange={setFormSeq}
              required
            />
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
            }}
          >
            <TextBox
              label="Status Code"
              placeholder="e.g. REQ, REG, AA, TS"
              value={formCode}
              onChange={setFormCode}
              required
            />
            <TextBox
              label="Status Badge Color (Hex)"
              placeholder="#3b82f6"
              value={formColor}
              onChange={setFormColor}
            />
          </div>
          <TextBox
            label="Display Label"
            placeholder="e.g. Administrative Sanction Granted"
            value={formLabel}
            onChange={setFormLabel}
            required
          />
          <DropDownList
            label="Status"
            data={[
              { label: 'Active', value: 'true' },
              { label: 'Inactive', value: 'false' },
            ]}
            textField="label"
            optionValue="value"
            value={formActive ? 'true' : 'false'}
            onChange={val => setFormActive(val === 'true')}
          />
          <div className="flex justify-end gap-3 mt-4">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setPopup({ mode: 'closed' })}
            />
            <Button
              label={popup.mode === 'add' ? 'Create Status' : 'Save Changes'}
              variant="primary"
              icon="check"
              onClick={handleSave}
            />
          </div>
        </div>
      </FormPopup>
    </FormPage>
  );
}
