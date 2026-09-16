import { useEffect, useState } from 'react';
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
import { initialTPIAgencies } from '../../../mocks';
import { civilUrls } from '../../../urls';
import '../../civil.css';

const STORAGE_KEY = 'civil_tpi_agencies';

export default function TPIAgencyMaster() {
  const [data, setData] = useState<CivilManagement.TPIAgencyItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((t: any) => ({
          id: t.id || `TPI-${Math.random().toString(36).substring(2, 6)}`,
          name: t.name || '',
          contactPerson: t.contactPerson || '',
          email: t.email || '',
          mobile: t.mobile || '',
          licenseNo: t.licenseNo || '',
          licenseValidity: t.licenseValidity || '2028-03-31',
          address: t.address || '',
          contractorClass: t.contractorClass || 'Class A (Central PSU/Agency)',
          isActive: t.status === 'Active' || t.isActive !== false,
        }));
      } catch (e) {
        console.error(e);
      }
    }
    return initialTPIAgencies.map(t => ({
      id: t.id,
      name: t.name,
      contactPerson: t.contactPerson,
      email: t.email,
      mobile: t.mobile,
      licenseNo: t.licenseNo,
      licenseValidity: '2028-03-31',
      address: t.address,
      contractorClass: 'Class A (Central PSU/Agency)',
      isActive: t.status === 'Active',
    }));
  });

  const [popup, setPopup] = useState<{
    mode: 'closed' | 'add' | 'edit';
    item?: CivilManagement.TPIAgencyItem;
  }>({ mode: 'closed' });

  const [formName, setFormName] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMobile, setFormMobile] = useState('');
  const [formLicense, setFormLicense] = useState('');
  const [formValidity, setFormValidity] = useState('2028-03-31');
  const [formAddress, setFormAddress] = useState('');
  const [formClass, setFormClass] = useState('Class A (Central PSU/Agency)');
  const [formActive, setFormActive] = useState(true);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const openAdd = () => {
    setFormName('');
    setFormContact('');
    setFormEmail('');
    setFormMobile('');
    setFormLicense('');
    setFormValidity('2028-03-31');
    setFormAddress('');
    setFormClass('Class A (Central PSU/Agency)');
    setFormActive(true);
    setPopup({ mode: 'add' });
  };

  const openEdit = (item: CivilManagement.TPIAgencyItem) => {
    setFormName(item.name);
    setFormContact(item.contactPerson);
    setFormEmail(item.email);
    setFormMobile(item.mobile);
    setFormLicense(item.licenseNo);
    setFormValidity(item.licenseValidity || '2028-03-31');
    setFormAddress(item.address);
    setFormClass(item.contractorClass || 'Class A (Central PSU/Agency)');
    setFormActive(item.isActive);
    setPopup({ mode: 'edit', item });
  };

  const handleSave = () => {
    if (!formName.trim() || !formLicense.trim()) {
      ToastService.error('Agency Name and License No are required.');
      return;
    }

    if (popup.mode === 'add') {
      const newItem: CivilManagement.TPIAgencyItem = {
        id: `TPI-${Date.now().toString().slice(-4)}`,
        name: formName.trim(),
        contactPerson: formContact.trim(),
        email: formEmail.trim(),
        mobile: formMobile.trim(),
        licenseNo: formLicense.trim(),
        licenseValidity: formValidity,
        address: formAddress.trim(),
        contractorClass: formClass,
        isActive: formActive,
      };
      setData(prev => [newItem, ...prev]);
      ToastService.success(`TPI Agency "${newItem.name}" registered.`);
    } else if (popup.mode === 'edit' && popup.item) {
      setData(prev =>
        prev.map(d =>
          d.id === popup.item!.id
            ? {
                ...d,
                name: formName.trim(),
                contactPerson: formContact.trim(),
                email: formEmail.trim(),
                mobile: formMobile.trim(),
                licenseNo: formLicense.trim(),
                licenseValidity: formValidity,
                address: formAddress.trim(),
                contractorClass: formClass,
                isActive: formActive,
              }
            : d
        )
      );
      ToastService.success(`TPI Agency updated.`);
    }
    setPopup({ mode: 'closed' });
  };

  const toggleStatus = (id: string) => {
    setData(prev =>
      prev.map(d => {
        if (d.id === id) {
          const next = !d.isActive;
          ToastService.info(
            `TPI Agency ${next ? 'Activated' : 'Deactivated'}.`
          );
          return { ...d, isActive: next };
        }
        return d;
      })
    );
  };

  return (
    <FormPage
      title="Third Party Inspection (TPI) Agency Master"
      description="Manage empaneled Third Party Quality Assurance & Inspection (TPI/TPQA) agencies (e.g. RITES, SGS, WAPCOS)."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.adminPortal },
        { label: 'Masters' },
        { label: 'TPI Agency' },
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
          label="Empanel TPI Agency"
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
              field: 'id',
              header: 'Agency ID',
              cell: (item: CivilManagement.TPIAgencyItem) => (
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: '#1d4ed8',
                  }}
                >
                  {item.id}
                </span>
              ),
            },
            {
              field: 'name',
              header: 'Agency Title & Address',
              cell: (item: CivilManagement.TPIAgencyItem) => (
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
                    {item.address}
                  </div>
                </div>
              ),
            },
            {
              field: 'licenseNo',
              header: 'License & Registration',
              cell: (item: CivilManagement.TPIAgencyItem) => (
                <div>
                  <span
                    className="civil-pill blue"
                    style={{ fontSize: '0.72rem' }}
                  >
                    {item.licenseNo}
                  </span>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginTop: '2px',
                    }}
                  >
                    Valid thru: {item.licenseValidity || '—'}
                  </div>
                </div>
              ),
            },
            {
              field: 'contractorClass',
              header: 'Empanelment Tier',
              cell: (item: CivilManagement.TPIAgencyItem) => (
                <span
                  className="civil-pill purple"
                  style={{ fontSize: '0.72rem' }}
                >
                  {item.contractorClass || 'Class A'}
                </span>
              ),
            },
            {
              field: 'contactPerson',
              header: 'Key Representative',
              cell: (item: CivilManagement.TPIAgencyItem) => (
                <div style={{ fontSize: '0.8125rem' }}>
                  <div>{item.contactPerson}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {item.mobile}
                  </div>
                </div>
              ),
            },
            {
              field: 'isActive',
              header: 'Status',
              cell: (item: CivilManagement.TPIAgencyItem) => (
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
              cell: (item: CivilManagement.TPIAgencyItem) => (
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
          searchPlaceholder="Search TPI agencies..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={popup.mode === 'add' ? 'Empanel TPI Agency' : 'Edit TPI Agency'}
        subtitle="Third Party Inspection & Quality Assurance consultant."
        size="lg"
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
            label="Agency Name"
            placeholder="e.g. RITES Limited / SGS India"
            value={formName}
            onChange={setFormName}
            required
          />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
            }}
          >
            <TextBox
              label="Registration / License No."
              placeholder="e.g. TPI-REG-2024-098"
              value={formLicense}
              onChange={setFormLicense}
              required
            />
            <TextBox
              label="Validity Expiry Date"
              placeholder="YYYY-MM-DD"
              value={formValidity}
              onChange={setFormValidity}
            />
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
            }}
          >
            <DropDownList
              label="Empanelment Tier"
              data={[
                {
                  label: 'Class A (Central PSU / Govt Accredited)',
                  value: 'Class A (Central PSU/Agency)',
                },
                {
                  label: 'Class B (State Level Empaneled)',
                  value: 'Class B (State Level)',
                },
                {
                  label: 'Class C (Independent Engineering Consultant)',
                  value: 'Class C (Consultant)',
                },
              ]}
              textField="label"
              optionValue="value"
              value={formClass}
              onChange={val => setFormClass(val as string)}
            />
            <TextBox
              label="Regional Branch Address"
              placeholder="Office address in state capital..."
              value={formAddress}
              onChange={setFormAddress}
            />
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '1rem',
            }}
          >
            <TextBox
              label="Principal Engineer / Rep"
              placeholder="Shri A.K. Sharma"
              value={formContact}
              onChange={setFormContact}
            />
            <TextBox
              label="Contact Phone / Mobile"
              placeholder="9425012345"
              value={formMobile}
              onChange={setFormMobile}
            />
            <TextBox
              label="Official Email"
              placeholder="tpi.nodal@agency.com"
              value={formEmail}
              onChange={setFormEmail}
            />
          </div>
          <DropDownList
            label="Status"
            data={[
              { label: 'Active (Empaneled)', value: 'true' },
              { label: 'Inactive (Suspended)', value: 'false' },
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
              label={popup.mode === 'add' ? 'Register Agency' : 'Save Changes'}
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
