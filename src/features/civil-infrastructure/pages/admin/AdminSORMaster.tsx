import { useState, useEffect } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import {
  type SORItem,
  sorItems as initialData,
  type TPIAgency,
  initialTPIAgencies,
  type LabAgency,
  initialLabAgencies,
} from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

const CATEGORIES = [
  'Concrete Works',
  'Steel Works',
  'Earthwork',
  'Masonry',
  'Plastering',
  'Flooring',
  'Painting',
  'MEP Works',
  'Miscellaneous',
].map(v => ({ name: v, value: v }));

const EMPTY_SOR: Partial<SORItem> = {
  code: '',
  description: '',
  unit: '',
  govtRate: 0,
  category: 'Concrete Works',
  year: '2025-26',
};

const EMPTY_TPI: Partial<TPIAgency> = {
  id: '',
  name: '',
  contactPerson: '',
  email: '',
  mobile: '',
  licenseNo: '',
  address: '',
  status: 'Active',
};

const EMPTY_LAB: Partial<LabAgency> = {
  id: '',
  name: '',
  contactPerson: '',
  email: '',
  mobile: '',
  nablAccreditation: '',
  scopeOfTesting: '',
  address: '',
  status: 'Active',
};

export default function AdminSORMaster() {
  const [activeTab, setActiveTab] = useState<'SOR' | 'TPI' | 'LAB'>('SOR');

  // SOR State
  const [sorData, setSorData] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_sor_items');
    return saved ? JSON.parse(saved) : initialData;
  });
  const [sorPopup, setSorPopup] = useState<{
    mode: 'closed' | 'create' | 'edit';
    item?: any;
  }>({ mode: 'closed' });
  const [sorForm, setSorForm] = useState<Partial<SORItem>>(EMPTY_SOR);

  // TPI State
  const [tpiData, setTpiData] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_tpi_agencies');
    return saved ? JSON.parse(saved) : initialTPIAgencies;
  });
  const [tpiPopup, setTpiPopup] = useState<{
    mode: 'closed' | 'create' | 'edit';
    item?: any;
  }>({ mode: 'closed' });
  const [tpiForm, setTpiForm] = useState<Partial<TPIAgency>>(EMPTY_TPI);

  // LAB State
  const [labData, setLabData] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_lab_agencies');
    return saved ? JSON.parse(saved) : initialLabAgencies;
  });
  const [labPopup, setLabPopup] = useState<{
    mode: 'closed' | 'create' | 'edit';
    item?: any;
  }>({ mode: 'closed' });
  const [labForm, setLabForm] = useState<Partial<LabAgency>>(EMPTY_LAB);

  // Persists
  useEffect(() => {
    localStorage.setItem('civil_sor_items', JSON.stringify(sorData));
  }, [sorData]);

  useEffect(() => {
    localStorage.setItem('civil_tpi_agencies', JSON.stringify(tpiData));
  }, [tpiData]);

  useEffect(() => {
    localStorage.setItem('civil_lab_agencies', JSON.stringify(labData));
  }, [labData]);

  // SOR Actions
  const handleSaveSor = () => {
    if (!sorForm.code) {
      ToastService.error('SOR Code is required.');
      return;
    }
    if (!sorForm.description) {
      ToastService.error('Description is required.');
      return;
    }
    if (!sorForm.unit) {
      ToastService.error('Unit is required.');
      return;
    }
    if (!sorForm.govtRate || sorForm.govtRate <= 0) {
      ToastService.error('Govt Rate must be greater than 0.');
      return;
    }

    if (sorPopup.mode === 'create') {
      if (
        sorData.some(d => d.code.toLowerCase() === sorForm.code?.toLowerCase())
      ) {
        ToastService.error(
          `SOR Item with code ${sorForm.code} already exists.`
        );
        return;
      }
      const newItem = { ...sorForm, id: String(Date.now()) };
      setSorData(prev => [newItem, ...prev]);
      ToastService.success('New SOR Item added to government master registry.');
    } else {
      setSorData(prev =>
        prev.map(d => (d.id === sorPopup.item!.id ? { ...d, ...sorForm } : d))
      );
      ToastService.success('SOR Item updated successfully.');
    }
    setSorPopup({ mode: 'closed' });
    setSorForm(EMPTY_SOR);
  };

  // TPI Actions
  const handleSaveTpi = () => {
    if (!tpiForm.name) {
      ToastService.error('Agency Name is required.');
      return;
    }
    if (!tpiForm.licenseNo) {
      ToastService.error('License / Registration No is required.');
      return;
    }
    if (!tpiForm.contactPerson) {
      ToastService.error('Contact Person is required.');
      return;
    }

    if (tpiPopup.mode === 'create') {
      const newId = `TPI-${String(tpiData.length + 1).padStart(2, '0')}`;
      const newItem = { ...tpiForm, id: newId };
      setTpiData(prev => [...prev, newItem]);
      ToastService.success('New Third-Party Inspection Agency added.');
    } else {
      setTpiData(prev =>
        prev.map(d => (d.id === tpiPopup.item!.id ? { ...d, ...tpiForm } : d))
      );
      ToastService.success('TPI Agency updated successfully.');
    }
    setTpiPopup({ mode: 'closed' });
    setTpiForm(EMPTY_TPI);
  };

  // LAB Actions
  const handleSaveLab = () => {
    if (!labForm.name) {
      ToastService.error('Lab Name is required.');
      return;
    }
    if (!labForm.nablAccreditation) {
      ToastService.error('NABL Accreditation No is required.');
      return;
    }
    if (!labForm.contactPerson) {
      ToastService.error('Contact Person is required.');
      return;
    }

    if (labPopup.mode === 'create') {
      const newId = `LAB-${String(labData.length + 1).padStart(2, '0')}`;
      const newItem = { ...labForm, id: newId };
      setLabData(prev => [...prev, newItem]);
      ToastService.success('New Quality Lab Testing Agency added.');
    } else {
      setLabData(prev =>
        prev.map(d => (d.id === labPopup.item!.id ? { ...d, ...labForm } : d))
      );
      ToastService.success('Quality Lab Testing Agency updated.');
    }
    setLabPopup({ mode: 'closed' });
    setLabForm(EMPTY_LAB);
  };

  return (
    <FormPage
      title="Admin Master Registries"
      description="Manage Schedule of Rates (SOR), Third-Party Inspection (TPI) agencies, and accredited Quality Testing Labs."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.adminPortal },
        { label: 'Master Registries' },
      ]}
    >
      {/* Premium Master Tiles Selection */}
      <div
        className="civil-stats-grid"
        style={{ marginBottom: '1.5rem', cursor: 'pointer' }}
      >
        {[
          {
            key: 'SOR',
            label: 'SOR Master Registry',
            count: sorData.length,
            icon: 'list',
            desc: 'Government Schedule of Rates',
            color: '#0f766e',
            bg: activeTab === 'SOR' ? '#ccfbf1' : '#ffffff',
            border:
              activeTab === 'SOR' ? '2px solid #0f766e' : '1px solid #e5e7eb',
          },
          {
            key: 'TPI',
            label: 'TPI Quality Agencies',
            count: tpiData.length,
            icon: 'verified-user',
            desc: 'Third Party Inspection',
            color: '#1d4ed8',
            bg: activeTab === 'TPI' ? '#dbeafe' : '#ffffff',
            border:
              activeTab === 'TPI' ? '2px solid #1d4ed8' : '1px solid #e5e7eb',
          },
          {
            key: 'LAB',
            label: 'Quality Testing Labs',
            count: labData.length,
            icon: 'map',
            desc: 'Accredited testing facilities',
            color: '#7c3aed',
            bg: activeTab === 'LAB' ? '#ede9fe' : '#ffffff',
            border:
              activeTab === 'LAB' ? '2px solid #7c3aed' : '1px solid #e5e7eb',
          },
        ].map(t => (
          <div
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            style={{
              background: t.bg,
              border: t.border,
              borderRadius: '0.875rem',
              padding: '1.25rem',
              transition: 'all 0.2s',
              boxShadow:
                activeTab === t.key
                  ? '0 10px 15px -3px rgba(0, 0, 0, 0.05)'
                  : 'none',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem',
              }}
            >
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                }}
              >
                {t.desc}
              </div>
              <i
                className={`pi pi-${t.icon}`}
                style={{ color: t.color, fontSize: '1.25rem' }}
              />
            </div>
            <div
              style={{ fontSize: '1.5rem', fontWeight: 800, color: t.color }}
            >
              {t.label}
            </div>
            <div
              style={{
                fontSize: '0.8125rem',
                color: '#4b5563',
                marginTop: '0.25rem',
                fontWeight: 600,
              }}
            >
              Total Registered: {t.count}
            </div>
          </div>
        ))}
      </div>

      {/* SOR Registry View */}
      {activeTab === 'SOR' && (
        <FormCard
          title="Schedule of Rates (SOR) Registry"
          subtitle="Rates acting as the legal price baseline for engineering designs."
        >
          <GridPanel
            data={sorData}
            columns={[
              { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
              {
                field: 'code',
                header: 'SOR Code',
                cell: (s: any) => (
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: '#1d4ed8',
                      fontSize: '0.75rem',
                    }}
                  >
                    {s.code}
                  </span>
                ),
              },
              {
                field: 'description',
                header: 'Item Description',
                cell: (s: any) => (
                  <span style={{ fontWeight: 500 }}>{s.description}</span>
                ),
              },
              {
                field: 'category',
                header: 'Category',
                cell: (s: any) => (
                  <span
                    className="civil-pill blue"
                    style={{ fontSize: '0.65rem' }}
                  >
                    {s.category}
                  </span>
                ),
              },
              {
                field: 'unit',
                header: 'Unit',
                cell: (s: any) => (
                  <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                    {s.unit}
                  </span>
                ),
              },
              {
                field: 'govtRate',
                header: 'Govt Rate (₹)',
                cell: (s: any) => (
                  <span style={{ fontWeight: 700, color: '#16a34a' }}>
                    ₹{s.govtRate.toLocaleString('en-IN')}
                  </span>
                ),
              },
              {
                field: 'year',
                header: 'SOR Year',
                cell: (s: any) => (
                  <span className="civil-pill teal">{s.year}</span>
                ),
              },
              {
                field: 'id',
                header: 'Action',
                sortable: false,
                cell: (item: any) => (
                  <Button
                    size="small"
                    label=""
                    icon="pencil"
                    variant="outlined"
                    onClick={() => {
                      setSorForm(item);
                      setSorPopup({ mode: 'edit', item });
                    }}
                  />
                ),
              },
            ]}
            toolbar={
              <Button
                label="Add SOR Item"
                icon="plus"
                variant="primary"
                onClick={() => {
                  setSorForm(EMPTY_SOR);
                  setSorPopup({ mode: 'create' });
                }}
              />
            }
            searchBox
            searchPlaceholder="Search SOR items..."
          />
        </FormCard>
      )}

      {/* TPI Agencies View */}
      {activeTab === 'TPI' && (
        <FormCard
          title="Third-Party Inspection (TPI) Agencies"
          subtitle="Independent QA/QC engineering consultants authorized to stamp lab quality checks."
        >
          <GridPanel
            data={tpiData}
            columns={[
              { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
              {
                field: 'id',
                header: 'Agency ID',
                cell: (s: any) => (
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: '#2563eb',
                    }}
                  >
                    {s.id}
                  </span>
                ),
              },
              {
                field: 'name',
                header: 'Agency Name',
                cell: (s: any) => (
                  <span style={{ fontWeight: 600 }}>{s.name}</span>
                ),
              },
              {
                field: 'licenseNo',
                header: 'License No',
                cell: (s: any) => (
                  <span
                    style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}
                  >
                    {s.licenseNo}
                  </span>
                ),
              },
              { field: 'contactPerson', header: 'Contact Person' },
              { field: 'email', header: 'Email ID' },
              { field: 'mobile', header: 'Mobile Number' },
              {
                field: 'status',
                header: 'Status',
                cell: (s: any) => (
                  <span
                    className={`civil-pill ${s.status === 'Active' ? 'green' : 'gray'}`}
                  >
                    {s.status}
                  </span>
                ),
              },
              {
                field: 'id',
                header: 'Action',
                sortable: false,
                cell: (item: any) => (
                  <Button
                    size="small"
                    label=""
                    icon="pencil"
                    variant="outlined"
                    onClick={() => {
                      setTpiForm(item);
                      setTpiPopup({ mode: 'edit', item });
                    }}
                  />
                ),
              },
            ]}
            toolbar={
              <Button
                label="Add TPI Agency"
                icon="plus"
                variant="primary"
                onClick={() => {
                  setTpiForm(EMPTY_TPI);
                  setTpiPopup({ mode: 'create' });
                }}
              />
            }
            searchBox
            searchPlaceholder="Search TPI agencies..."
          />
        </FormCard>
      )}

      {/* Quality Lab View */}
      {activeTab === 'LAB' && (
        <FormCard
          title="Quality Lab Testing Agencies"
          subtitle="Accredited testing facilities responsible for conducting material checks and issuing certificates."
        >
          <GridPanel
            data={labData}
            columns={[
              { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
              {
                field: 'id',
                header: 'Lab ID',
                cell: (s: any) => (
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: '#7c3aed',
                    }}
                  >
                    {s.id}
                  </span>
                ),
              },
              {
                field: 'name',
                header: 'Lab Facility',
                cell: (s: any) => (
                  <span style={{ fontWeight: 600 }}>{s.name}</span>
                ),
              },
              {
                field: 'nablAccreditation',
                header: 'NABL Accreditation No',
                cell: (s: any) => (
                  <span
                    style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}
                  >
                    {s.nablAccreditation}
                  </span>
                ),
              },
              {
                field: 'scopeOfTesting',
                header: 'Scope of Testing',
                cell: (s: any) => (
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {s.scopeOfTesting}
                  </span>
                ),
              },
              { field: 'contactPerson', header: 'Director / In-Charge' },
              { field: 'email', header: 'Email ID' },
              {
                field: 'status',
                header: 'Status',
                cell: (s: any) => (
                  <span
                    className={`civil-pill ${s.status === 'Active' ? 'green' : 'gray'}`}
                  >
                    {s.status}
                  </span>
                ),
              },
              {
                field: 'id',
                header: 'Action',
                sortable: false,
                cell: (item: any) => (
                  <Button
                    size="small"
                    label=""
                    icon="pencil"
                    variant="outlined"
                    onClick={() => {
                      setLabForm(item);
                      setLabPopup({ mode: 'edit', item });
                    }}
                  />
                ),
              },
            ]}
            toolbar={
              <Button
                label="Add Quality Lab"
                icon="plus"
                variant="primary"
                onClick={() => {
                  setLabForm(EMPTY_LAB);
                  setLabPopup({ mode: 'create' });
                }}
              />
            }
            searchBox
            searchPlaceholder="Search quality labs..."
          />
        </FormCard>
      )}

      {/* SOR Popup */}
      <FormPopup
        visible={sorPopup.mode !== 'closed'}
        onHide={() => setSorPopup({ mode: 'closed' })}
        title={
          sorPopup.mode === 'create' ? 'Add New SOR Item' : 'Edit SOR Item'
        }
        subtitle="Manage government-notified rates in accounting sub-module."
        size="lg"
      >
        <FormGrid columns={2}>
          <TextBox
            label="SOR Code *"
            placeholder="e.g. SOR-CC-004"
            value={sorForm.code ?? ''}
            onChange={v => setSorForm(f => ({ ...f, code: v }))}
            required
            disabled={sorPopup.mode === 'edit'}
          />
          <DropDownList
            label="Category *"
            data={CATEGORIES}
            textField={'name' as any}
            optionValue="value"
            value={sorForm.category}
            onChange={v => setSorForm(f => ({ ...f, category: v as string }))}
          />
        </FormGrid>

        <FormGrid columns={3}>
          <TextBox
            label="Unit of Measurement *"
            placeholder="e.g. Cum, Sqm, Kg, Tonne"
            value={sorForm.unit ?? ''}
            onChange={v => setSorForm(f => ({ ...f, unit: v }))}
            required
          />
          <TextBox
            label="Govt Standard Rate (₹) *"
            placeholder="e.g. 7600"
            value={String(sorForm.govtRate ?? '')}
            onChange={v => setSorForm(f => ({ ...f, govtRate: Number(v) }))}
            required
          />
          <TextBox
            label="Financial Year *"
            placeholder="2025-26"
            value={sorForm.year ?? ''}
            onChange={v => setSorForm(f => ({ ...f, year: v }))}
            required
          />
        </FormGrid>

        <TextArea
          label="Item Specification / Description *"
          placeholder="Enter complete technical description of work item..."
          value={sorForm.description ?? ''}
          onChange={v => setSorForm(f => ({ ...f, description: v }))}
          rows={3}
          required
        />

        <div className="flex justify-end gap-3 mt-4">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => setSorPopup({ mode: 'closed' })}
          />
          <Button
            label="Save SOR Item"
            variant="primary"
            icon="save"
            onClick={handleSaveSor}
          />
        </div>
      </FormPopup>

      {/* TPI Popup */}
      <FormPopup
        visible={tpiPopup.mode !== 'closed'}
        onHide={() => setTpiPopup({ mode: 'closed' })}
        title={
          tpiPopup.mode === 'create'
            ? 'Add TPI Quality Agency'
            : 'Edit TPI Quality Agency'
        }
        subtitle="Independent Quality Check Agency registry details."
        size="lg"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Agency Name *"
            placeholder="e.g. RITES Limited"
            value={tpiForm.name ?? ''}
            onChange={v => setTpiForm(f => ({ ...f, name: v }))}
            required
          />
          <TextBox
            label="License / Registration No *"
            placeholder="e.g. TPI-REG-2025-001"
            value={tpiForm.licenseNo ?? ''}
            onChange={v => setTpiForm(f => ({ ...f, licenseNo: v }))}
            required
          />
        </FormGrid>

        <FormGrid columns={3}>
          <TextBox
            label="Contact Person Name *"
            placeholder="e.g. Shri R.K. Varma"
            value={tpiForm.contactPerson ?? ''}
            onChange={v => setTpiForm(f => ({ ...f, contactPerson: v }))}
            required
          />
          <TextBox
            label="Contact Email ID"
            placeholder="e.g. info@rites.com"
            value={tpiForm.email ?? ''}
            onChange={v => setTpiForm(f => ({ ...f, email: v }))}
          />
          <TextBox
            label="Mobile Number"
            placeholder="e.g. 9876543210"
            value={tpiForm.mobile ?? ''}
            onChange={v => setTpiForm(f => ({ ...f, mobile: v }))}
          />
        </FormGrid>

        <TextArea
          label="Office Address"
          placeholder="Enter complete administrative address..."
          value={tpiForm.address ?? ''}
          onChange={v => setTpiForm(f => ({ ...f, address: v }))}
          rows={2}
        />

        <div style={{ marginTop: '1rem' }}>
          <DropDownList
            label="Agency Lifecycle Status"
            data={['Active', 'Inactive'].map(v => ({ name: v, value: v }))}
            textField={'name' as any}
            optionValue="value"
            value={tpiForm.status}
            onChange={v => setTpiForm(f => ({ ...f, status: v as any }))}
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => setTpiPopup({ mode: 'closed' })}
          />
          <Button
            label="Save Agency"
            variant="primary"
            icon="save"
            onClick={handleSaveTpi}
          />
        </div>
      </FormPopup>

      {/* LAB Popup */}
      <FormPopup
        visible={labPopup.mode !== 'closed'}
        onHide={() => setLabPopup({ mode: 'closed' })}
        title={
          labPopup.mode === 'create'
            ? 'Add Accredited Quality Lab'
            : 'Edit Accredited Quality Lab'
        }
        subtitle="Independent laboratory facility registry details."
        size="lg"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Laboratory / Facility Name *"
            placeholder="e.g. MANIT Material Testing Lab"
            value={labForm.name ?? ''}
            onChange={v => setLabForm(f => ({ ...f, name: v }))}
            required
          />
          <TextBox
            label="NABL Accreditation No *"
            placeholder="e.g. NABL-TC-8891"
            value={labForm.nablAccreditation ?? ''}
            onChange={v => setLabForm(f => ({ ...f, nablAccreditation: v }))}
            required
          />
        </FormGrid>

        <FormGrid columns={3}>
          <TextBox
            label="Lab Director / In-Charge *"
            placeholder="e.g. Dr. S. K. Gupta"
            value={labForm.contactPerson ?? ''}
            onChange={v => setLabForm(f => ({ ...f, contactPerson: v }))}
            required
          />
          <TextBox
            label="Contact Email ID"
            placeholder="e.g. testlab@manit.ac.in"
            value={labForm.email ?? ''}
            onChange={v => setLabForm(f => ({ ...f, email: v }))}
          />
          <TextBox
            label="Contact Mobile"
            placeholder="e.g. 7552901234"
            value={labForm.mobile ?? ''}
            onChange={v => setLabForm(f => ({ ...f, mobile: v }))}
          />
        </FormGrid>

        <TextBox
          label="Scope of Testing / Materials Allowed (comma separated) *"
          placeholder="e.g. Concrete, Steel, Soils, Aggregates, Bitumen"
          value={labForm.scopeOfTesting ?? ''}
          onChange={v => setLabForm(f => ({ ...f, scopeOfTesting: v }))}
          required
        />

        <TextArea
          label="Lab Address"
          placeholder="Enter complete facility address..."
          value={labForm.address ?? ''}
          onChange={v => setLabForm(f => ({ ...f, address: v }))}
          rows={2}
        />

        <div style={{ marginTop: '1rem' }}>
          <DropDownList
            label="Lab Operational Status"
            data={['Active', 'Inactive'].map(v => ({ name: v, value: v }))}
            textField={'name' as any}
            optionValue="value"
            value={labForm.status}
            onChange={v => setLabForm(f => ({ ...f, status: v as any }))}
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => setLabPopup({ mode: 'closed' })}
          />
          <Button
            label="Save Lab"
            variant="primary"
            icon="save"
            onClick={handleSaveLab}
          />
        </div>
      </FormPopup>
    </FormPage>
  );
}
