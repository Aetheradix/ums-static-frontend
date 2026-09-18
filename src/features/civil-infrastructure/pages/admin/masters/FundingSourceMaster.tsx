import { useState } from 'react';
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
import { CIVIL_STORAGE_KEYS, useCivilStorage } from '../../../civilStorage';
import { initialFundingSources } from '../../../mocks';
import { civilUrls } from '../../../urls';
import '../../civil.css';

const SOURCE_TYPE_OPTIONS = [
  { label: 'UGC Grant', value: 'UGC' },
  { label: 'State Govt Grant', value: 'State Govt' },
  { label: 'Central Govt Grant', value: 'Central Govt' },
  { label: 'University Internal Fund', value: 'University' },
  { label: 'External / CSR / Donor', value: 'External' },
  { label: 'Other Sponsoring Agency', value: 'Other' },
];

export default function FundingSourceMaster() {
  const [data, setData] = useCivilStorage<
    CivilManagement.FundingSourceMaster[]
  >(CIVIL_STORAGE_KEYS.FUNDING_SOURCES, initialFundingSources);

  const [popup, setPopup] = useState<{
    mode: 'closed' | 'add' | 'edit';
    item?: CivilManagement.FundingSourceMaster;
  }>({ mode: 'closed' });

  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formSourceType, setFormSourceType] =
    useState<CivilManagement.FundingSourceMaster['sourceType']>('UGC');
  const [formActive, setFormActive] = useState(true);

  const openAdd = () => {
    setFormCode('');
    setFormName('');
    setFormSourceType('UGC');
    setFormActive(true);
    setPopup({ mode: 'add' });
  };

  const openEdit = (item: CivilManagement.FundingSourceMaster) => {
    setFormCode(item.code);
    setFormName(item.name);
    setFormSourceType(item.sourceType);
    setFormActive(item.isActive);
    setPopup({ mode: 'edit', item });
  };

  const handleSave = () => {
    if (!formCode.trim() || !formName.trim()) {
      ToastService.error('Funding Code and Source Name are required.');
      return;
    }

    if (popup.mode === 'add') {
      const newItem: CivilManagement.FundingSourceMaster = {
        id: `FS-${Date.now().toString().slice(-4)}`,
        code: formCode.trim().toUpperCase(),
        name: formName.trim(),
        sourceType: formSourceType,
        isActive: formActive,
      };
      setData(prev => [newItem, ...prev]);
      ToastService.success(`Funding Source "${newItem.name}" added.`);
    } else if (popup.mode === 'edit' && popup.item) {
      setData(prev =>
        prev.map(d =>
          d.id === popup.item!.id
            ? {
                ...d,
                code: formCode.trim().toUpperCase(),
                name: formName.trim(),
                sourceType: formSourceType,
                isActive: formActive,
              }
            : d
        )
      );
      ToastService.success(`Funding Source updated.`);
    }
    setPopup({ mode: 'closed' });
  };

  const toggleStatus = (id: string) => {
    setData(prev =>
      prev.map(d => {
        if (d.id === id) {
          const next = !d.isActive;
          ToastService.info(
            `Funding Source ${next ? 'Activated' : 'Deactivated'}.`
          );
          return { ...d, isActive: next };
        }
        return d;
      })
    );
  };

  return (
    <FormPage
      title="Funding Source Master"
      description="Manage civil project funding bodies, capital grants, UGC allocations, and institutional development endowments."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
        { label: 'Admin Login', to: civilUrls.adminMenu },
        { label: 'External Masters', to: civilUrls.externalMastersMenu },
        { label: 'Funding Source' },
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
          label="Add Funding Source"
          icon="plus"
          variant="primary"
          onClick={openAdd}
        />
      </div>

      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            {
              field: 'code',
              header: 'Code',
              cell: (item: CivilManagement.FundingSourceMaster) => (
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
              header: 'Funding Source Title',
              cell: (item: CivilManagement.FundingSourceMaster) => (
                <span style={{ fontWeight: 600 }}>{item.name}</span>
              ),
            },
            {
              field: 'sourceType',
              header: 'Governance Category',
              cell: (item: CivilManagement.FundingSourceMaster) => (
                <span
                  className="civil-pill purple"
                  style={{ fontSize: '0.75rem' }}
                >
                  {item.sourceType}
                </span>
              ),
            },
            {
              field: 'isActive',
              header: 'Status',
              cell: (item: CivilManagement.FundingSourceMaster) => (
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
              cell: (item: CivilManagement.FundingSourceMaster) => (
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
          searchPlaceholder="Search funding sources..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'add' ? 'Add Funding Source' : 'Edit Funding Source'
        }
        subtitle="Grant allocation agency or capital budget head."
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
          <TextBox
            label="Funding Code"
            placeholder="e.g. UGC, SGC, RUSA, IDF"
            value={formCode}
            onChange={setFormCode}
            required
          />
          <TextBox
            label="Funding Source Name"
            placeholder="e.g. UGC Infrastructure & Equipment Grant"
            value={formName}
            onChange={setFormName}
            required
          />
          <DropDownList
            label="Source Category"
            data={SOURCE_TYPE_OPTIONS}
            textField="label"
            optionValue="value"
            value={formSourceType}
            onChange={val => setFormSourceType(val as any)}
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
              label={popup.mode === 'add' ? 'Create Source' : 'Save Changes'}
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
