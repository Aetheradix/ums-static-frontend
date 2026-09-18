import { useEffect, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { CIVIL_STORAGE_KEYS, civilStorage } from '../../../civilStorage';
import { initialMBStatuses } from '../../../mocks';
import { civilUrls } from '../../../urls';
import '../../civil.css';

const STORAGE_KEY = CIVIL_STORAGE_KEYS.MB_STATUSES;

export default function MBStatusMaster() {
  const [data, setData] = useState<CivilManagement.MBStatusMaster[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialMBStatuses;
  });

  const [popup, setPopup] = useState<{
    mode: 'closed' | 'add' | 'edit';
    item?: CivilManagement.MBStatusMaster;
  }>({ mode: 'closed' });

  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formSeq, setFormSeq] = useState('1');
  const [formActive, setFormActive] = useState(true);

  useEffect(() => {
    civilStorage.set(STORAGE_KEY, data);
  }, [data]);

  const openAdd = () => {
    setFormCode('');
    setFormName('');
    setFormDesc('');
    setFormSeq((data.length + 1).toString());
    setFormActive(true);
    setPopup({ mode: 'add' });
  };

  const openEdit = (item: CivilManagement.MBStatusMaster) => {
    setFormCode(item.code);
    setFormName(item.name);
    setFormDesc(item.description || '');
    setFormSeq(item.sequence.toString());
    setFormActive(item.isActive);
    setPopup({ mode: 'edit', item });
  };

  const handleSave = () => {
    if (!formCode.trim() || !formName.trim()) {
      ToastService.error('Code and Name are required.');
      return;
    }

    const seqNumber = parseInt(formSeq, 10) || 1;

    if (popup.mode === 'add') {
      const newItem: CivilManagement.MBStatusMaster = {
        id: `MBS-${Date.now().toString().slice(-4)}`,
        code: formCode.trim().toUpperCase(),
        name: formName.trim(),
        description: formDesc.trim(),
        sequence: seqNumber,
        isActive: formActive,
      };
      setData(prev =>
        [...prev, newItem].sort((a, b) => a.sequence - b.sequence)
      );
      ToastService.success(`MB Status "${newItem.name}" added.`);
    } else if (popup.mode === 'edit' && popup.item) {
      setData(prev =>
        prev
          .map(d =>
            d.id === popup.item!.id
              ? {
                  ...d,
                  code: formCode.trim().toUpperCase(),
                  name: formName.trim(),
                  description: formDesc.trim(),
                  sequence: seqNumber,
                  isActive: formActive,
                }
              : d
          )
          .sort((a, b) => a.sequence - b.sequence)
      );
      ToastService.success(`MB Status updated.`);
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
      title="Measurement Book (MB) Status Master"
      description="Define the statutory verification workflow stages for e-Measurement Book entries (JE entry, AE 50% test check, EE 10% scrutiny, Bill linkage)."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
        { label: 'Admin Login', to: civilUrls.adminMenu },
        { label: 'External Masters', to: civilUrls.externalMastersMenu },
        { label: 'MB Status' },
      ]}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '1rem',
        }}
      >
        <Button
          label="Add MB Status Stage"
          icon="plus"
          variant="primary"
          onClick={openAdd}
        />
      </div>

      <FormCard>
        <GridPanel
          data={data}
          columns={[
            {
              field: 'sequence',
              header: 'Seq #',
              cell: (item: CivilManagement.MBStatusMaster) => (
                <span
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: '#eff6ff',
                    color: '#1d4ed8',
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
              field: 'code',
              header: 'Status Code',
              cell: (item: CivilManagement.MBStatusMaster) => (
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
              field: 'name',
              header: 'Stage Name & Mandate',
              cell: (item: CivilManagement.MBStatusMaster) => (
                <div>
                  <div style={{ fontWeight: 600, color: '#111827' }}>
                    {item.name}
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginTop: '2px',
                    }}
                  >
                    {item.description}
                  </div>
                </div>
              ),
            },
            {
              field: 'isActive',
              header: 'Status',
              cell: (item: CivilManagement.MBStatusMaster) => (
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
              cell: (item: CivilManagement.MBStatusMaster) => (
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
          searchPlaceholder="Search MB status stages..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'add' ? 'Add MB Status Stage' : 'Edit MB Status Stage'
        }
        subtitle="Measurement book lifecycle workflow state."
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
            <TextBox
              label="Status Code"
              placeholder="e.g. REC, CHK, SCR, BIL"
              value={formCode}
              onChange={setFormCode}
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
          <TextBox
            label="Stage Name / Title"
            placeholder="e.g. Test Checked by AE"
            value={formName}
            onChange={setFormName}
            required
          />
          <TextArea
            label="Statutory Mandate Description"
            placeholder="e.g. Minimum 50% test check carried out by Assistant Engineer..."
            value={formDesc}
            onChange={setFormDesc}
            rows={2}
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
              label={popup.mode === 'add' ? 'Create Stage' : 'Save Changes'}
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
