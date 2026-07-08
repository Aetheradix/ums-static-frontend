import { useEffect, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage, FormPopup, GridPanel, StatusBadge } from 'shared/new-components';
import { type Contractor, contractors as initialData } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

const GRADE_OPTIONS = [
  { name: 'Class A (Unlimited)', value: 'Class A' },
  { name: 'Class B (Up to ₹5 Cr)', value: 'Class B' },
  { name: 'Class C (Up to ₹1.5 Cr)', value: 'Class C' },
  { name: 'Class D (Up to ₹50L)', value: 'Class D' },
];

const EMPTY_CONTRACTOR: Partial<Contractor> = {
  companyName: '',
  proprietorName: '',
  grade: 'Class A',
  gstNo: '',
  panNo: '',
  bankName: '',
  bankAccount: '',
  ifscCode: '',
  contactPhone: '',
  email: '',
  address: '',
  securityDepositPaid: 100000,
  performanceBond: 200000,
  status: 'Active',
  completedWorks: 0,
  totalWorksDone: 0,
  registeredWithPWD: true,
};

export default function AgencyVerification() {
  const [data, setData] = useState<Contractor[]>(() => {
    const saved = localStorage.getItem('civil_contractors');
    return saved ? JSON.parse(saved) : initialData;
  });
  const [popup, setPopup] = useState<{ mode: 'closed' | 'view' | 'create'; item?: Contractor }>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<Contractor>>(EMPTY_CONTRACTOR);

  // Validation mock states
  const [gstPanValidated, setGstPanValidated] = useState(false);
  const [bankMandateTracked, setBankMandateTracked] = useState(false);
  const [validatingGst, setValidatingGst] = useState(false);
  const [validatingBank, setValidatingBank] = useState(false);

  useEffect(() => {
    localStorage.setItem('civil_contractors', JSON.stringify(data));
  }, [data]);

  const handleOpenCreate = () => {
    setForm(EMPTY_CONTRACTOR);
    setGstPanValidated(false);
    setBankMandateTracked(false);
    setPopup({ mode: 'create' });
  };

  const handleValidateGstPan = () => {
    if (!form.gstNo || !form.panNo) {
      ToastService.error('Please enter both GSTIN and PAN number.');
      return;
    }
    setValidatingGst(true);
    setTimeout(() => {
      setGstPanValidated(true);
      setValidatingGst(false);
      ToastService.success('GSTIN & PAN successfully validated against PWD Vendor database.');
    }, 800);
  };

  const handleValidateBank = () => {
    if (!form.bankName || !form.bankAccount || !form.ifscCode) {
      ToastService.error('Please enter Bank Name, Account Number, and IFSC Code.');
      return;
    }
    setValidatingBank(true);
    setTimeout(() => {
      setBankMandateTracked(true);
      setValidatingBank(false);
      ToastService.success('Bank Mandate tracked. Account ownership verified.');
    }, 800);
  };

  const handleSave = () => {
    if (!form.companyName) { ToastService.error('Company Name is required.'); return; }
    if (!form.gstNo) { ToastService.error('GST No is required.'); return; }
    if (!form.panNo) { ToastService.error('PAN No is required.'); return; }
    if (!form.bankAccount) { ToastService.error('Bank Account No is required.'); return; }
    if (!gstPanValidated) { ToastService.error('Please validate GSTIN & PAN before onboarding.'); return; }
    if (!bankMandateTracked) { ToastService.error('Please track/verify Bank Mandate before onboarding.'); return; }

    const newCon: Contractor = {
      ...form,
      id: `CON-${String(data.length + 1).padStart(3, '0')}`,
      regNo: `PWD/REG/${new Date().getFullYear()}/${String(data.length + 1).padStart(4, '0')}`,
    } as Contractor;

    setData(prev => [...prev, newCon]);
    ToastService.success('Agency successfully onboarded into Vendor Master.');
    setPopup({ mode: 'closed' });
  };

  const statusVariant = (s: string) =>
    s === 'Active' ? 'approved' : s === 'Blacklisted' || s === 'Suspended' ? 'rejected' : 'pending';

  const getLimitText = (grade?: string) => {
    if (grade === 'Class A') return 'Unlimited project valuation allowed.';
    if (grade === 'Class B') return 'Allowed project valuation limit: Up to ₹5.0 Crore.';
    if (grade === 'Class C') return 'Allowed project valuation limit: Up to ₹1.5 Crore.';
    if (grade === 'Class D') return 'Allowed project valuation limit: Up to ₹50 Lakh.';
    return '';
  };

  return (
    <FormPage
      title="Agency Profile Verification"
      description="Onboard contractors into Vendor Master with compliance tracking: GST, PAN, PWD registration, bank details, and security deposit."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.adminPortal },
        { label: 'Agency Verification' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'regNo', header: 'PWD Reg. No', cell: (c: Contractor) => <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.75rem' }}>{c.regNo}</span> },
            { field: 'companyName', header: 'Company Name', cell: (c: Contractor) => <span style={{ fontWeight: 600 }}>{c.companyName}</span> },
            { field: 'grade', header: 'Grade', cell: (c: Contractor) => <span className="civil-pill blue">{c.grade}</span> },
            { field: 'gstNo', header: 'GST No', cell: (c: Contractor) => <span style={{ fontFamily: 'monospace', fontSize: '0.72rem' }}>{c.gstNo}</span> },
            { field: 'panNo', header: 'PAN No', cell: (c: Contractor) => <span style={{ fontFamily: 'monospace', fontSize: '0.72rem' }}>{c.panNo}</span> },
            { field: 'registeredWithPWD', header: 'PWD Reg.', cell: (c: Contractor) => c.registeredWithPWD ? <span className="civil-pill green">✓ Verified</span> : <span className="civil-pill red">✗ Pending</span> },
            { field: 'securityDepositPaid', header: 'SD Paid', cell: (c: Contractor) => <span>₹{(c.securityDepositPaid / 100000).toFixed(2)}L</span> },
            { field: 'completedWorks', header: 'Works Done', cell: (c: Contractor) => <span style={{ fontWeight: 700 }}>{c.completedWorks}</span> },
            { field: 'status', header: 'Status', cell: (c: Contractor) => <StatusBadge label={c.status} variant={statusVariant(c.status)} /> },
            { field: 'id', header: 'Action', sortable: false,
              cell: (item: Contractor) => (
                <Button size="small" label="" icon="eye" variant="outlined" onClick={() => setPopup({ mode: 'view', item })} />
              ) },
          ]}
          toolbar={
            <Button label="Register New Agency" icon="plus" variant="primary" onClick={handleOpenCreate} />
          }
          searchBox searchPlaceholder="Search contractors..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={popup.mode === 'create' ? 'Register & Onboard New Agency' : `Contractor Profile — ${popup.item?.companyName}`}
        subtitle="Full compliance verification details for the Vendor Master."
        size="lg"
      >
        {popup.mode === 'create' ? (
          <>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem' }}>1. Basic & Address Details</h4>
            <FormGrid columns={2}>
              <TextBox label="Company Name *" placeholder="e.g. Acme Builders Ltd" value={form.companyName ?? ''} onChange={v => setForm(f => ({ ...f, companyName: v }))} />
              <TextBox label="Proprietor / Director Name *" placeholder="e.g. Mr. Anil Mehta" value={form.proprietorName ?? ''} onChange={v => setForm(f => ({ ...f, proprietorName: v }))} />
            </FormGrid>
            <FormGrid columns={2}>
              <TextBox label="Contact Phone *" placeholder="e.g. +91 9876543210" value={form.contactPhone ?? ''} onChange={v => setForm(f => ({ ...f, contactPhone: v }))} />
              <TextBox label="Contact Email *" placeholder="e.g. contact@acmebuilders.com" value={form.email ?? ''} onChange={v => setForm(f => ({ ...f, email: v }))} />
            </FormGrid>
            <div style={{ marginBottom: '1rem' }}>
              <TextArea label="Office Address *" placeholder="Enter full postal address..." value={form.address ?? ''} onChange={v => setForm(f => ({ ...f, address: v }))} rows={2} />
            </div>

            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem', borderTop: '1px solid #f3f4f6', paddingTop: '0.75rem' }}>2. GSTIN & PAN Validation</h4>
            <FormGrid columns={3}>
              <TextBox label="GSTIN Number *" placeholder="e.g. 23AABCS4832Q1ZX" value={form.gstNo ?? ''} onChange={v => setForm(f => ({ ...f, gstNo: v.toUpperCase() }))} />
              <TextBox label="PAN Number *" placeholder="e.g. AABCS4832Q" value={form.panNo ?? ''} onChange={v => setForm(f => ({ ...f, panNo: v.toUpperCase() }))} />
              <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.25rem', width: '100%' }}>
                {gstPanValidated ? (
                  <span className="civil-pill green" style={{ width: '100%', textAlign: 'center', padding: '0.5rem' }}>✓ GSTIN & PAN Validated</span>
                ) : (
                  <div style={{ width: '100%' }}>
                    <Button
                      label={validatingGst ? 'Validating...' : 'Verify GSTIN & PAN'}
                      icon={validatingGst ? 'spin pi-spinner' : 'verified'}
                      variant="outlined"
                      onClick={handleValidateGstPan}
                      disabled={validatingGst}
                    />
                  </div>
                )}
              </div>
            </FormGrid>

            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem', borderTop: '1px solid #f3f4f6', paddingTop: '0.75rem' }}>3. Bank Mandate Tracking</h4>
            <FormGrid columns={4}>
              <TextBox label="Bank Name *" placeholder="e.g. State Bank of India" value={form.bankName ?? ''} onChange={v => setForm(f => ({ ...f, bankName: v }))} />
              <TextBox label="Account Number *" placeholder="e.g. 30894726581" value={form.bankAccount ?? ''} onChange={v => setForm(f => ({ ...f, bankAccount: v }))} />
              <TextBox label="IFSC Code *" placeholder="e.g. SBIN0001248" value={form.ifscCode ?? ''} onChange={v => setForm(f => ({ ...f, ifscCode: v.toUpperCase() }))} />
              <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.25rem', width: '100%' }}>
                {bankMandateTracked ? (
                  <span className="civil-pill green" style={{ width: '100%', textAlign: 'center', padding: '0.5rem' }}>✓ Mandate Active</span>
                ) : (
                  <div style={{ width: '100%' }}>
                    <Button
                      label={validatingBank ? 'Verifying...' : 'Verify Mandate'}
                      icon={validatingBank ? 'spin pi-spinner' : 'link'}
                      variant="outlined"
                      onClick={handleValidateBank}
                      disabled={validatingBank}
                    />
                  </div>
                )}
              </div>
            </FormGrid>

            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem', borderTop: '1px solid #f3f4f6', paddingTop: '0.75rem' }}>4. License Class limits</h4>
            <FormGrid columns={2}>
              <DropDownList
                label="License Grade / Class *"
                data={GRADE_OPTIONS} textField="name" optionValue="value"
                value={form.grade}
                onChange={v => setForm(f => ({ ...f, grade: v as string }))}
              />
              <div style={{ display: 'flex', alignItems: 'center', padding: '0.75rem 1rem', background: '#f9fafb', borderRadius: '0.5rem', fontSize: '0.8125rem', color: '#4b5563', borderLeft: '3px solid #2563eb', height: '100%' }}>
                <span><strong>Limit Policy:</strong> {getLimitText(form.grade)}</span>
              </div>
            </FormGrid>

            <FormGrid columns={2}>
              <TextBox label="Security Deposit Paid (₹)" value={String(form.securityDepositPaid ?? '')} onChange={v => setForm(f => ({ ...f, securityDepositPaid: Number(v) }))} />
              <TextBox label="Performance Bond Value (₹)" value={String(form.performanceBond ?? '')} onChange={v => setForm(f => ({ ...f, performanceBond: Number(v) }))} />
            </FormGrid>

            <div className="flex justify-end gap-3 mt-6 border-top pt-4">
              <Button label="Cancel" variant="outlined" onClick={() => setPopup({ mode: 'closed' })} />
              <Button label="Onboard Agency & Save" variant="primary" icon="save" onClick={handleSave} />
            </div>
          </>
        ) : (
          popup.item && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem 1.5rem', fontSize: '0.8125rem', padding: '1rem', background: '#f9fafb', borderRadius: '0.75rem', marginBottom: '1rem' }}>
                {[
                  ['Company Name', popup.item.companyName],
                  ['Proprietor', popup.item.proprietorName],
                  ['Grade / Class', popup.item.grade],
                  ['PWD Reg. No', popup.item.regNo],
                  ['GST Number', popup.item.gstNo],
                  ['PAN Number', popup.item.panNo],
                  ['Bank Name', popup.item.bankName],
                  ['Account No', popup.item.bankAccount],
                  ['IFSC Code', popup.item.ifscCode],
                  ['Phone', popup.item.contactPhone],
                  ['Email', popup.item.email],
                  ['Address', popup.item.address],
                  ['Security Deposit Paid', `₹${(popup.item.securityDepositPaid / 100000).toFixed(2)}L`],
                  ['Performance Bond', `₹${(popup.item.performanceBond / 100000).toFixed(2)}L`],
                  ['Total Completed Works', String(popup.item.completedWorks)],
                  ['Total Works Done (₹)', `₹${(popup.item.totalWorksDone / 10000000).toFixed(2)} Cr`],
                  ['PWD Registered', popup.item.registeredWithPWD ? '✓ Yes' : '✗ No'],
                  ['Status', popup.item.status],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ color: '#9ca3af', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>{k}</div>
                    <div style={{ fontWeight: 600 }}>{v}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                {[
                  { label: 'GST Verified', ok: true },
                  { label: 'PAN Verified', ok: true },
                  { label: 'PWD Registered', ok: popup.item.registeredWithPWD },
                  { label: 'SD Received', ok: popup.item.securityDepositPaid > 0 },
                  { label: 'Bank Verified', ok: true },
                ].map(item => (
                  <div key={item.label} style={{ flex: 1, textAlign: 'center', padding: '0.5rem', borderRadius: '0.625rem', background: '#f0fdf4', border: '1px solid #86efac' }}>
                    <div style={{ fontSize: '1.25rem' }}>✓</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#15803d' }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </>
          )
        )}
      </FormPopup>
    </FormPage>
  );
}
