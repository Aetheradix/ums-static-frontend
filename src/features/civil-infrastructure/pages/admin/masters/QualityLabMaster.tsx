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
import { initialLabAgencies } from '../../../mocks';
import { civilUrls } from '../../../urls';
import '../../civil.css';

const STORAGE_KEY = CIVIL_STORAGE_KEYS.LAB_AGENCIES;

export default function QualityLabMaster() {
  const [data, setData] = useState<CivilManagement.QualityLabItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((l: any) => ({
          id: l.id || `LAB-${Math.random().toString(36).substring(2, 6)}`,
          name: l.name || '',
          contactPerson: l.contactPerson || '',
          email: l.email || '',
          mobile: l.mobile || '',
          nablAccreditation: l.nablAccreditation || '',
          nablValidity: l.nablValidity || '2027-12-31',
          scopeOfTesting: l.scopeOfTesting || '',
          address: l.address || '',
          isActive: l.status === 'Active' || l.isActive !== false,
        }));
      } catch (e) {
        console.error(e);
      }
    }
    return initialLabAgencies.map(l => ({
      id: l.id,
      name: l.name,
      contactPerson: l.contactPerson,
      email: l.email,
      mobile: l.mobile,
      nablAccreditation: l.nablAccreditation,
      nablValidity: '2027-12-31',
      scopeOfTesting: l.scopeOfTesting,
      address: l.address,
      isActive: l.status === 'Active',
    }));
  });

  const [popup, setPopup] = useState<{
    mode: 'closed' | 'add' | 'edit';
    item?: CivilManagement.QualityLabItem;
  }>({ mode: 'closed' });

  const [formName, setFormName] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMobile, setFormMobile] = useState('');
  const [formNabl, setFormNabl] = useState('');
  const [formValidity, setFormValidity] = useState('2027-12-31');
  const [formScope, setFormScope] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formActive, setFormActive] = useState(true);

  useEffect(() => {
    civilStorage.set(STORAGE_KEY, data);
  }, [data]);

  const openAdd = () => {
    setFormName('');
    setFormContact('');
    setFormEmail('');
    setFormMobile('');
    setFormNabl('');
    setFormValidity('2027-12-31');
    setFormScope('');
    setFormAddress('');
    setFormActive(true);
    setPopup({ mode: 'add' });
  };

  const openEdit = (item: CivilManagement.QualityLabItem) => {
    setFormName(item.name);
    setFormContact(item.contactPerson);
    setFormEmail(item.email);
    setFormMobile(item.mobile);
    setFormNabl(item.nablAccreditation);
    setFormValidity(item.nablValidity || '2027-12-31');
    setFormScope(item.scopeOfTesting);
    setFormAddress(item.address);
    setFormActive(item.isActive);
    setPopup({ mode: 'edit', item });
  };

  const handleSave = () => {
    if (!formName.trim() || !formNabl.trim()) {
      ToastService.error('Lab Name and NABL Accreditation are required.');
      return;
    }

    if (popup.mode === 'add') {
      const newItem: CivilManagement.QualityLabItem = {
        id: `LAB-${Date.now().toString().slice(-4)}`,
        name: formName.trim(),
        contactPerson: formContact.trim(),
        email: formEmail.trim(),
        mobile: formMobile.trim(),
        nablAccreditation: formNabl.trim(),
        nablValidity: formValidity,
        scopeOfTesting: formScope.trim(),
        address: formAddress.trim(),
        isActive: formActive,
      };
      setData(prev => [newItem, ...prev]);
      ToastService.success(`Quality Lab "${newItem.name}" added successfully.`);
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
                nablAccreditation: formNabl.trim(),
                nablValidity: formValidity,
                scopeOfTesting: formScope.trim(),
                address: formAddress.trim(),
                isActive: formActive,
              }
            : d
        )
      );
      ToastService.success(`Quality Lab updated successfully.`);
    }
    setPopup({ mode: 'closed' });
  };

  const toggleStatus = (id: string) => {
    setData(prev =>
      prev.map(d => {
        if (d.id === id) {
          const next = !d.isActive;
          ToastService.info(
            `Testing Lab ${next ? 'Activated' : 'Deactivated'}.`
          );
          return { ...d, isActive: next };
        }
        return d;
      })
    );
  };

  return (
    <FormPage
      title="Quality Testing Laboratory Master"
      description="Register NABL accredited civil testing laboratories authorized for material compressive strength, bitumen, and soil investigations."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
        { label: 'Admin Login', to: civilUrls.adminMenu },
        { label: 'External Masters', to: civilUrls.externalMastersMenu },
        { label: 'Quality Lab' },
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
          label="Register Quality Lab"
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
              header: 'Lab ID',
              cell: (item: CivilManagement.QualityLabItem) => (
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
              header: 'Laboratory & Institute',
              cell: (item: CivilManagement.QualityLabItem) => (
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
              field: 'nablAccreditation',
              header: 'NABL Accreditation',
              cell: (item: CivilManagement.QualityLabItem) => (
                <div>
                  <span
                    className="civil-pill green"
                    style={{ fontSize: '0.72rem' }}
                  >
                    {item.nablAccreditation}
                  </span>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginTop: '2px',
                    }}
                  >
                    Valid thru: {item.nablValidity || '—'}
                  </div>
                </div>
              ),
            },
            {
              field: 'scopeOfTesting',
              header: 'Authorized Scope',
              cell: (item: CivilManagement.QualityLabItem) => (
                <span style={{ fontSize: '0.8125rem', color: '#374151' }}>
                  {item.scopeOfTesting}
                </span>
              ),
            },
            {
              field: 'contactPerson',
              header: 'Contact Person',
              cell: (item: CivilManagement.QualityLabItem) => (
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
              cell: (item: CivilManagement.QualityLabItem) => (
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
              cell: (item: CivilManagement.QualityLabItem) => (
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
          searchPlaceholder="Search laboratories..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'add'
            ? 'Register Quality Testing Lab'
            : 'Edit Quality Lab'
        }
        subtitle="Empanel an accredited laboratory for mandatory quality audits."
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
            label="Laboratory Name / Institution"
            placeholder="e.g. IIT Bhopal Central Civil Testing Lab"
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
              label="NABL Certificate No."
              placeholder="e.g. NABL-TC-8891"
              value={formNabl}
              onChange={setFormNabl}
              required
            />
            <TextBox
              label="Accreditation Validity Date"
              placeholder="YYYY-MM-DD"
              value={formValidity}
              onChange={setFormValidity}
            />
          </div>
          <TextBox
            label="Authorized Testing Scope"
            placeholder="e.g. Concrete, Steel, Bitumen, Soils, Aggregates"
            value={formScope}
            onChange={setFormScope}
          />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '1rem',
            }}
          >
            <TextBox
              label="Authorized Contact Person"
              placeholder="Dr. R.C. Mishra"
              value={formContact}
              onChange={setFormContact}
            />
            <TextBox
              label="Mobile Number"
              placeholder="9425012345"
              value={formMobile}
              onChange={setFormMobile}
            />
            <TextBox
              label="Official Email"
              placeholder="civil.testing@institute.ac.in"
              value={formEmail}
              onChange={setFormEmail}
            />
          </div>
          <TextArea
            label="Laboratory Campus Address"
            placeholder="Physical address, building, and location..."
            value={formAddress}
            onChange={setFormAddress}
            rows={2}
          />
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
              label={popup.mode === 'add' ? 'Register Lab' : 'Save Changes'}
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
