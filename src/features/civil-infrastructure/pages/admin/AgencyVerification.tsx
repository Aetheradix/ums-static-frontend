import { useCallback, useEffect, useState } from 'react';
import { ToastService } from 'services';
import { Button, ButtonPanel, StatusButton } from 'shared/components/buttons';
import { DropDownList, NumberBox, TextBox } from 'shared/components/forms';
import GridActionButtons from 'shared/components/grid/GridActionButtons';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  PreviewGrid,
  StatusBadge,
} from 'shared/new-components';
import {
  initialVendorAgencies,
  initialLabAgencies,
  initialTPIAgencies,
  type MockVendorAgencyRegistration,
} from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

type ActiveTab = 'VENDOR' | 'LAB' | 'TPI';
type PageMode = 'list' | 'create' | 'edit' | 'view';

const GRADE_OPTIONS = [
  { label: 'Class A (Unlimited / Central PWD)', value: 'Class A (Unlimited)' },
  { label: 'Class B (Up to 10 Cr)', value: 'Class B (Up to 10 Cr)' },
  { label: 'Class C (Up to 2 Cr)', value: 'Class C (Up to 2 Cr)' },
  { label: 'Class D (Up to 50 Lakh)', value: 'Class D (Up to 50 Lakh)' },
];

export default function AgencyRegistration() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('VENDOR');
  const [mode, setMode] = useState<PageMode>('list');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Vendor / Contractor state
  const [vendors, setVendors] = useState<MockVendorAgencyRegistration[]>(() => {
    const saved = localStorage.getItem('civil_vendor_agencies');
    return saved ? JSON.parse(saved) : initialVendorAgencies;
  });

  // Quality Lab state
  const [labs, setLabs] = useState<CivilManagement.QualityLabItem[]>(() => {
    const saved = localStorage.getItem('civil_lab_agencies');
    if (saved) {
      try {
        return JSON.parse(saved);
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

  // TPI Agency state
  const [tpiAgencies, setTpiAgencies] = useState<
    CivilManagement.TPIAgencyItem[]
  >(() => {
    const saved = localStorage.getItem('civil_tpi_agencies');
    if (saved) {
      try {
        return JSON.parse(saved);
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

  // Vendor form state
  const [vForm, setVForm] = useState<Partial<MockVendorAgencyRegistration>>({
    companyName: '',
    registrationNumber: '',
    proprietorName: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    officeAddress: '',
    gstNumber: '',
    panNumber: '',
    isGstPanValidated: true,
    gstPanValidatedOn: new Date().toISOString().split('T')[0],
    bankName: '',
    bankAccountNumber: '',
    ifscCode: '',
    isBankMandateVerified: true,
    bankMandateVerifiedOn: new Date().toISOString().split('T')[0],
    licenseGrade: 'Class A (Unlimited)',
    securityDepositPaid: 1000000,
    performanceBondValue: 2000000,
    isRegisteredWithPwd: true,
    pwdRegistrationNumber: '',
    pwdRegistrationDate: '',
    completedWorks: 0,
    totalWorksDone: 0,
    isActive: true,
  });

  // Lab form
  const [lForm, setLForm] = useState<any>({
    name: '',
    contactPerson: '',
    email: '',
    mobile: '',
    nablAccreditation: '',
    nablValidity: '2027-12-31',
    scopeOfTesting: '',
    address: '',
    isActive: true,
  });

  // TPI form
  const [tForm, setTForm] = useState<any>({
    name: '',
    contactPerson: '',
    email: '',
    mobile: '',
    licenseNo: '',
    licenseValidity: '2028-03-31',
    address: '',
    contractorClass: 'Class A (Central PSU/Agency)',
    isActive: true,
  });

  useEffect(() => {
    localStorage.setItem('civil_vendor_agencies', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('civil_lab_agencies', JSON.stringify(labs));
  }, [labs]);

  useEffect(() => {
    localStorage.setItem('civil_tpi_agencies', JSON.stringify(tpiAgencies));
  }, [tpiAgencies]);

  const handleBackToList = useCallback(() => {
    setMode('list');
    setSelectedItem(null);
  }, []);

  const openCreate = () => {
    if (activeTab === 'VENDOR') {
      setVForm({
        companyName: '',
        registrationNumber: `VND-${Date.now().toString().slice(-4)}`,
        proprietorName: '',
        contactPerson: '',
        contactPhone: '',
        contactEmail: '',
        officeAddress: '',
        gstNumber: '',
        panNumber: '',
        isGstPanValidated: true,
        gstPanValidatedOn: new Date().toISOString().split('T')[0],
        bankName: '',
        bankAccountNumber: '',
        ifscCode: '',
        isBankMandateVerified: true,
        bankMandateVerifiedOn: new Date().toISOString().split('T')[0],
        licenseGrade: 'Class A (Unlimited)',
        securityDepositPaid: 1000000,
        performanceBondValue: 2000000,
        isRegisteredWithPwd: true,
        pwdRegistrationNumber: '',
        pwdRegistrationDate: '',
        completedWorks: 0,
        totalWorksDone: 0,
        isActive: true,
      });
    } else if (activeTab === 'LAB') {
      setLForm({
        name: '',
        contactPerson: '',
        email: '',
        mobile: '',
        nablAccreditation: '',
        nablValidity: '2027-12-31',
        scopeOfTesting: '',
        address: '',
        isActive: true,
      });
    } else {
      setTForm({
        name: '',
        contactPerson: '',
        email: '',
        mobile: '',
        licenseNo: '',
        licenseValidity: '2028-03-31',
        address: '',
        contractorClass: 'Class A (Central PSU/Agency)',
        isActive: true,
      });
    }
    setSelectedItem(null);
    setMode('create');
  };

  const openEdit = (item: any) => {
    setSelectedItem(item);
    if (activeTab === 'VENDOR') {
      setVForm({ ...item });
    } else if (activeTab === 'LAB') {
      setLForm({ ...item, isActive: item.isActive !== false });
    } else {
      setTForm({ ...item, isActive: item.isActive !== false });
    }
    setMode('edit');
  };

  const openView = (item: any) => {
    setSelectedItem(item);
    setMode('view');
  };

  const handleSaveVendor = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!vForm.companyName?.trim() || !vForm.gstNumber?.trim()) {
      ToastService.error('Company Name and GSTIN are required.');
      return;
    }
    if (mode === 'create') {
      const newItem: MockVendorAgencyRegistration = {
        ...(vForm as MockVendorAgencyRegistration),
        vendorAgencyRegistrationId: Date.now(),
        registrationNumber:
          vForm.registrationNumber || `VND-${Date.now().toString().slice(-4)}`,
        isActive: vForm.isActive !== false,
      };
      setVendors(prev => [newItem, ...prev]);
      ToastService.success(
        `Vendor Agency "${newItem.companyName}" registered successfully.`
      );
    } else if (mode === 'edit' && selectedItem) {
      setVendors(prev =>
        prev.map(v =>
          v.vendorAgencyRegistrationId ===
          selectedItem.vendorAgencyRegistrationId
            ? ({ ...v, ...vForm } as MockVendorAgencyRegistration)
            : v
        )
      );
      ToastService.success('Vendor Agency details updated.');
    }
    handleBackToList();
  };

  const handleSaveLab = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!lForm.name.trim() || !lForm.nablAccreditation.trim()) {
      ToastService.error('Lab Name and NABL Certificate are required.');
      return;
    }
    if (mode === 'create') {
      const newItem: any = {
        ...lForm,
        id: `LAB-${Date.now().toString().slice(-4)}`,
      };
      setLabs(prev => [newItem, ...prev]);
      ToastService.success(`Quality Lab "${newItem.name}" empaneled.`);
    } else if (mode === 'edit' && selectedItem) {
      setLabs(prev =>
        prev.map(l => (l.id === selectedItem.id ? { ...l, ...lForm } : l))
      );
      ToastService.success('Quality Lab details updated.');
    }
    handleBackToList();
  };

  const handleSaveTpi = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tForm.name.trim() || !tForm.licenseNo.trim()) {
      ToastService.error('Agency Name and License No are required.');
      return;
    }
    if (mode === 'create') {
      const newItem: any = {
        ...tForm,
        id: `TPI-${Date.now().toString().slice(-4)}`,
      };
      setTpiAgencies(prev => [newItem, ...prev]);
      ToastService.success(`TPI Agency "${newItem.name}" registered.`);
    } else if (mode === 'edit' && selectedItem) {
      setTpiAgencies(prev =>
        prev.map(t => (t.id === selectedItem.id ? { ...t, ...tForm } : t))
      );
      ToastService.success('TPI Agency updated.');
    }
    handleBackToList();
  };

  const toggleVendorStatus = (item: MockVendorAgencyRegistration) => {
    setVendors(prev =>
      prev.map(v => {
        if (v.vendorAgencyRegistrationId === item.vendorAgencyRegistrationId) {
          const next = !v.isActive;
          ToastService.info(
            `Vendor Agency ${next ? 'Activated' : 'Suspended'}.`
          );
          return { ...v, isActive: next };
        }
        return v;
      })
    );
  };

  const toggleLabStatus = (id: string) => {
    setLabs(prev =>
      prev.map(l => {
        if (l.id === id) {
          const next = !l.isActive;
          ToastService.info(
            `Quality Lab ${next ? 'Activated' : 'Deactivated'}.`
          );
          return { ...l, isActive: next };
        }
        return l;
      })
    );
  };

  const toggleTpiStatus = (id: string) => {
    setTpiAgencies(prev =>
      prev.map(t => {
        if (t.id === id) {
          const next = !t.isActive;
          ToastService.info(
            `TPI Agency ${next ? 'Activated' : 'Deactivated'}.`
          );
          return { ...t, isActive: next };
        }
        return t;
      })
    );
  };

  if (mode === 'create' || mode === 'edit') {
    const pageTitle =
      activeTab === 'VENDOR'
        ? mode === 'create'
          ? 'Register Vendor Agency / Contractor'
          : `Edit Vendor Agency — ${vForm.companyName || 'Contractor'}`
        : activeTab === 'LAB'
          ? mode === 'create'
            ? 'Empanel Quality Testing Lab'
            : `Edit Quality Lab — ${lForm.name || 'Lab'}`
          : mode === 'create'
            ? 'Empanel TPI Agency'
            : `Edit TPI Agency — ${tForm.name || 'Agency'}`;

    return (
      <FormPage
        title={pageTitle}
        description="Verification and accreditation credentials."
        breadcrumbs={[
          { label: 'Home', to: '/home/menu' },
          { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
          { label: 'Admin Login', to: civilUrls.adminMenu },
          { label: 'Agency Registration', to: civilUrls.agencyVerification },
          { label: mode === 'create' ? 'Register' : 'Edit' },
        ]}
        headerAction={
          <Button
            label="Back to Agencies List"
            icon="arrow-left"
            variant="outlined"
            onClick={handleBackToList}
          />
        }
      >
        {activeTab === 'VENDOR' && (
          <form onSubmit={handleSaveVendor} className="flex flex-col gap-5">
            <FormCard title="1. Agency Profile & Contact">
              <FormGrid columns={2}>
                <TextBox
                  label="Company / Firm Name"
                  placeholder="e.g. Apex Buildcon Engineers Pvt Ltd"
                  value={vForm.companyName ?? ''}
                  onChange={v => setVForm(f => ({ ...f, companyName: v }))}
                  required
                />
                <TextBox
                  label="Proprietor / Managing Director Name"
                  placeholder="e.g. Shri Rajesh Singhania"
                  value={vForm.proprietorName ?? ''}
                  onChange={v => setVForm(f => ({ ...f, proprietorName: v }))}
                  required
                />
                <TextBox
                  label="Contact Person"
                  placeholder="e.g. Er. Rohit Verma"
                  value={vForm.contactPerson ?? ''}
                  onChange={v => setVForm(f => ({ ...f, contactPerson: v }))}
                />
                <TextBox
                  label="Contact Phone"
                  placeholder="e.g. +91 98260 12345"
                  value={vForm.contactPhone ?? ''}
                  onChange={v => setVForm(f => ({ ...f, contactPhone: v }))}
                  required
                />
                <TextBox
                  label="Contact Email"
                  placeholder="e.g. contact@apexbuildcon.in"
                  value={vForm.contactEmail ?? ''}
                  onChange={v => setVForm(f => ({ ...f, contactEmail: v }))}
                />
                <TextBox
                  label="Registered Office Address"
                  placeholder="e.g. 14, Industrial Area, Sector 3, Bhopal"
                  value={vForm.officeAddress ?? ''}
                  onChange={v => setVForm(f => ({ ...f, officeAddress: v }))}
                  required
                />
              </FormGrid>
            </FormCard>

            <FormCard title="2. Statutory Tax & Compliance">
              <FormGrid columns={2}>
                <TextBox
                  label="GSTIN Number"
                  placeholder="e.g. 23AAACA1234F1Z5"
                  value={vForm.gstNumber ?? ''}
                  onChange={v => setVForm(f => ({ ...f, gstNumber: v }))}
                  required
                />
                <TextBox
                  label="PAN Number"
                  placeholder="e.g. AAACA1234F"
                  value={vForm.panNumber ?? ''}
                  onChange={v => setVForm(f => ({ ...f, panNumber: v }))}
                  required
                />
                <DropDownList
                  label="Contractor License Grade"
                  data={GRADE_OPTIONS}
                  textField="label"
                  optionValue="value"
                  value={vForm.licenseGrade ?? 'Class A (Unlimited)'}
                  onChange={v =>
                    setVForm(f => ({ ...f, licenseGrade: String(v) }))
                  }
                  required
                />
                <TextBox
                  label="PWD Registration Number"
                  placeholder="e.g. MP-PWD-CLASS-A-2021-89"
                  value={vForm.pwdRegistrationNumber ?? ''}
                  onChange={v =>
                    setVForm(f => ({ ...f, pwdRegistrationNumber: v }))
                  }
                />
              </FormGrid>
            </FormCard>

            <FormCard title="3. Bank Mandate & Financials">
              <FormGrid columns={3}>
                <TextBox
                  label="Bank Name"
                  placeholder="e.g. State Bank of India"
                  value={vForm.bankName ?? ''}
                  onChange={v => setVForm(f => ({ ...f, bankName: v }))}
                  required
                />
                <TextBox
                  label="Account Number"
                  placeholder="e.g. 38291048201"
                  value={vForm.bankAccountNumber ?? ''}
                  onChange={v =>
                    setVForm(f => ({ ...f, bankAccountNumber: v }))
                  }
                  required
                />
                <TextBox
                  label="IFSC Code"
                  placeholder="e.g. SBIN0001234"
                  value={vForm.ifscCode ?? ''}
                  onChange={v => setVForm(f => ({ ...f, ifscCode: v }))}
                  required
                />
                <NumberBox
                  label="Security Deposit Paid (₹)"
                  placeholder="e.g. 2500000"
                  value={vForm.securityDepositPaid}
                  onChange={v =>
                    setVForm(f => ({
                      ...f,
                      securityDepositPaid: Number(v) || 0,
                    }))
                  }
                  mode="decimal"
                />
                <NumberBox
                  label="Performance Bond Value (₹)"
                  placeholder="e.g. 5000000"
                  value={vForm.performanceBondValue}
                  onChange={v =>
                    setVForm(f => ({
                      ...f,
                      performanceBondValue: Number(v) || 0,
                    }))
                  }
                  mode="decimal"
                />
                <NumberBox
                  label="Total Completed Works"
                  placeholder="e.g. 18"
                  value={vForm.completedWorks}
                  onChange={v =>
                    setVForm(f => ({
                      ...f,
                      completedWorks: Number(v) || 0,
                    }))
                  }
                />
              </FormGrid>
            </FormCard>

            <ButtonPanel>
              <Button
                label="Cancel"
                variant="outlined"
                onClick={handleBackToList}
                type="button"
              />
              <Button
                label={mode === 'create' ? 'Register Vendor' : 'Update Vendor'}
                variant="primary"
                icon="check"
                type="submit"
              />
            </ButtonPanel>
          </form>
        )}

        {activeTab === 'LAB' && (
          <FormCard title={pageTitle}>
            <form onSubmit={handleSaveLab} className="flex flex-col gap-4">
              <FormGrid columns={2}>
                <TextBox
                  label="Laboratory Name"
                  placeholder="e.g. Central Building Materials Testing Lab"
                  value={lForm.name}
                  onChange={v => setLForm((f: any) => ({ ...f, name: v }))}
                  required
                />
                <TextBox
                  label="NABL Certificate No."
                  placeholder="e.g. NABL-TC-8821"
                  value={lForm.nablAccreditation}
                  onChange={v =>
                    setLForm((f: any) => ({ ...f, nablAccreditation: v }))
                  }
                  required
                />
                <TextBox
                  label="Contact Person"
                  placeholder="e.g. Dr. A.K. Sharma"
                  value={lForm.contactPerson}
                  onChange={v =>
                    setLForm((f: any) => ({ ...f, contactPerson: v }))
                  }
                  required
                />
                <TextBox
                  label="Mobile Number"
                  placeholder="e.g. +91 98270 54321"
                  value={lForm.mobile}
                  onChange={v => setLForm((f: any) => ({ ...f, mobile: v }))}
                  required
                />
                <TextBox
                  label="Email ID"
                  placeholder="e.g. info@centralmaterials.org"
                  value={lForm.email}
                  onChange={v => setLForm((f: any) => ({ ...f, email: v }))}
                />
                <TextBox
                  label="Testing Scope"
                  placeholder="e.g. Concrete Cube, Rebar Tensile, Soil Bearing"
                  value={lForm.scopeOfTesting}
                  onChange={v =>
                    setLForm((f: any) => ({ ...f, scopeOfTesting: v }))
                  }
                />
              </FormGrid>
              <TextBox
                label="Laboratory Address"
                placeholder="e.g. Plot 12, Industrial Area, Sector 1, Bhopal"
                value={lForm.address}
                onChange={v => setLForm((f: any) => ({ ...f, address: v }))}
              />
              <ButtonPanel>
                <Button
                  label="Cancel"
                  variant="outlined"
                  onClick={handleBackToList}
                  type="button"
                />
                <Button
                  label={mode === 'create' ? 'Empanel Lab' : 'Update Lab'}
                  variant="primary"
                  icon="check"
                  type="submit"
                />
              </ButtonPanel>
            </form>
          </FormCard>
        )}

        {activeTab === 'TPI' && (
          <FormCard title={pageTitle}>
            <form onSubmit={handleSaveTpi} className="flex flex-col gap-4">
              <FormGrid columns={2}>
                <TextBox
                  label="Inspection Agency Name"
                  placeholder="e.g. RITES Ltd — Third Party Quality Assurance"
                  value={tForm.name}
                  onChange={v => setTForm((f: any) => ({ ...f, name: v }))}
                  required
                />
                <TextBox
                  label="License / Accreditation No."
                  placeholder="e.g. TPI-QCI-2024-098"
                  value={tForm.licenseNo}
                  onChange={v => setTForm((f: any) => ({ ...f, licenseNo: v }))}
                  required
                />
                <TextBox
                  label="Contact Representative"
                  placeholder="e.g. Er. V.K. Nair"
                  value={tForm.contactPerson}
                  onChange={v =>
                    setTForm((f: any) => ({ ...f, contactPerson: v }))
                  }
                  required
                />
                <TextBox
                  label="Mobile Number"
                  placeholder="e.g. +91 94250 87654"
                  value={tForm.mobile}
                  onChange={v => setTForm((f: any) => ({ ...f, mobile: v }))}
                  required
                />
                <TextBox
                  label="Email ID"
                  placeholder="e.g. civil.qa@rites.co.in"
                  value={tForm.email}
                  onChange={v => setTForm((f: any) => ({ ...f, email: v }))}
                />
                <DropDownList
                  label="Agency Tier / Class"
                  data={[
                    {
                      label: 'Class A (Central PSU / RITES / EIL)',
                      value: 'Class A (Central PSU/Agency)',
                    },
                    {
                      label: 'Class B (State PSU / WAPCOS)',
                      value: 'Class B (State PSU/Agency)',
                    },
                    {
                      label: 'Class C (Chartered Engineering Firm)',
                      value: 'Class C (Chartered Firm)',
                    },
                  ]}
                  textField="label"
                  optionValue="value"
                  value={tForm.contractorClass}
                  onChange={v =>
                    setTForm((f: any) => ({
                      ...f,
                      contractorClass: String(v),
                    }))
                  }
                />
              </FormGrid>
              <TextBox
                label="Office Address"
                placeholder="e.g. Regional QA Office, Bhopal"
                value={tForm.address}
                onChange={v => setTForm((f: any) => ({ ...f, address: v }))}
              />
              <ButtonPanel>
                <Button
                  label="Cancel"
                  variant="outlined"
                  onClick={handleBackToList}
                  type="button"
                />
                <Button
                  label={
                    mode === 'create'
                      ? 'Empanel TPI Agency'
                      : 'Update TPI Agency'
                  }
                  variant="primary"
                  icon="check"
                  type="submit"
                />
              </ButtonPanel>
            </form>
          </FormCard>
        )}
      </FormPage>
    );
  }

  if (mode === 'view' && selectedItem) {
    const pageTitle = `Agency Dossier — ${selectedItem.companyName || selectedItem.name}`;

    return (
      <FormPage
        title={pageTitle}
        description="Complete accreditation profile, credentials, and performance history."
        breadcrumbs={[
          { label: 'Home', to: '/home/menu' },
          { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
          { label: 'Admin Login', to: civilUrls.adminMenu },
          { label: 'Agency Registration', to: civilUrls.agencyVerification },
          { label: selectedItem.companyName || selectedItem.name },
        ]}
        headerAction={
          <Button
            label="Back to Agencies List"
            icon="arrow-left"
            variant="outlined"
            onClick={handleBackToList}
          />
        }
      >
        <div className="flex flex-col gap-4">
          <FormCard title="Accreditation & Details">
            {activeTab === 'VENDOR' && (
              <PreviewGrid
                columns={3}
                fields={[
                  {
                    label: 'Company / Firm Name',
                    value: selectedItem.companyName,
                  },
                  {
                    label: 'Registration Number',
                    value: selectedItem.registrationNumber,
                  },
                  {
                    label: 'Proprietor Name',
                    value: selectedItem.proprietorName,
                  },
                  {
                    label: 'Contact Person',
                    value: selectedItem.contactPerson || '—',
                  },
                  { label: 'Contact Phone', value: selectedItem.contactPhone },
                  {
                    label: 'Contact Email',
                    value: selectedItem.contactEmail || '—',
                  },
                  {
                    label: 'Office Address',
                    value: selectedItem.officeAddress,
                  },
                  {
                    label: 'GSTIN',
                    value: `${selectedItem.gstNumber} ${selectedItem.isGstPanValidated ? '(✓ Validated)' : ''}`,
                  },
                  { label: 'PAN Number', value: selectedItem.panNumber },
                  {
                    label: 'Contractor Grade',
                    value: selectedItem.licenseGrade,
                  },
                  {
                    label: 'Bank Details',
                    value: `${selectedItem.bankName} (A/c: ${selectedItem.bankAccountNumber}, IFSC: ${selectedItem.ifscCode})`,
                  },
                  {
                    label: 'Bank Mandate Status',
                    value: (
                      <StatusBadge
                        label={
                          selectedItem.isBankMandateVerified
                            ? 'Verified'
                            : 'Pending'
                        }
                        variant={
                          selectedItem.isBankMandateVerified
                            ? 'approved'
                            : 'pending'
                        }
                      />
                    ),
                  },
                  {
                    label: 'PWD Registration',
                    value: selectedItem.isRegisteredWithPwd
                      ? `Yes (${selectedItem.pwdRegistrationNumber || 'PWD-REG-2022'})`
                      : 'No',
                  },
                  {
                    label: 'Security Deposit Paid',
                    value: `₹${(selectedItem.securityDepositPaid || 0).toLocaleString('en-IN')}`,
                  },
                  {
                    label: 'Performance Bond Value',
                    value: `₹${(selectedItem.performanceBondValue || 0).toLocaleString('en-IN')}`,
                  },
                  {
                    label: 'Completed Works',
                    value: selectedItem.completedWorks || 0,
                  },
                  {
                    label: 'Total Works Done',
                    value: selectedItem.totalWorksDone || 0,
                  },
                  {
                    label: 'Active Status',
                    value: (
                      <StatusBadge
                        label={selectedItem.isActive ? 'Active' : 'Suspended'}
                        variant={
                          selectedItem.isActive ? 'approved' : 'rejected'
                        }
                      />
                    ),
                  },
                ]}
              />
            )}

            {activeTab === 'LAB' && (
              <PreviewGrid
                columns={2}
                fields={[
                  { label: 'Lab Name', value: selectedItem.name },
                  { label: 'Address', value: selectedItem.address },
                  {
                    label: 'NABL Certificate',
                    value: selectedItem.nablAccreditation,
                  },
                  {
                    label: 'NABL Validity',
                    value: selectedItem.nablValidity || '2027-12-31',
                  },
                  {
                    label: 'Contact Person',
                    value: selectedItem.contactPerson,
                  },
                  { label: 'Mobile', value: selectedItem.mobile },
                  { label: 'Email', value: selectedItem.email },
                  {
                    label: 'Scope of Testing',
                    value: selectedItem.scopeOfTesting,
                  },
                ]}
              />
            )}

            {activeTab === 'TPI' && (
              <PreviewGrid
                columns={2}
                fields={[
                  { label: 'Agency Name', value: selectedItem.name },
                  { label: 'Address', value: selectedItem.address },
                  { label: 'License No', value: selectedItem.licenseNo },
                  {
                    label: 'License Validity',
                    value: selectedItem.licenseValidity || '2028-03-31',
                  },
                  {
                    label: 'Tier / Class',
                    value: selectedItem.contractorClass,
                  },
                  {
                    label: 'Contact Person',
                    value: selectedItem.contactPerson,
                  },
                  { label: 'Mobile', value: selectedItem.mobile },
                  { label: 'Email', value: selectedItem.email },
                ]}
              />
            )}
          </FormCard>

          <ButtonPanel>
            <Button
              label="Back to Agencies List"
              variant="outlined"
              icon="arrow-left"
              onClick={handleBackToList}
            />
            <Button
              label="Edit Agency Details"
              variant="primary"
              icon="pencil"
              onClick={() => openEdit(selectedItem)}
            />
          </ButtonPanel>
        </div>
      </FormPage>
    );
  }

  return (
    <FormPage
      title="Agency Registration & Empanelment"
      description="Unified registry for Civil Contractors (Vendors), NABL Accredited Testing Laboratories, and Third Party Inspection (TPI) Agencies."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
        { label: 'Admin Login', to: civilUrls.adminMenu },
        { label: 'Agency Registration' },
      ]}
    >
      {/* 3-Tab Header Switcher */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
          borderBottom: '2px solid #e5e7eb',
          paddingBottom: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => {
              setActiveTab('VENDOR');
              setMode('list');
            }}
            style={{
              padding: '0.625rem 1.25rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 700,
              border:
                activeTab === 'VENDOR'
                  ? '2px solid #1d4ed8'
                  : '1px solid #d1d5db',
              background: activeTab === 'VENDOR' ? '#eff6ff' : '#ffffff',
              color: activeTab === 'VENDOR' ? '#1d4ed8' : '#4b5563',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            🏗️ Civil Contractors & Vendors ({vendors.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('LAB');
              setMode('list');
            }}
            style={{
              padding: '0.625rem 1.25rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 700,
              border:
                activeTab === 'LAB' ? '2px solid #1d4ed8' : '1px solid #d1d5db',
              background: activeTab === 'LAB' ? '#eff6ff' : '#ffffff',
              color: activeTab === 'LAB' ? '#1d4ed8' : '#4b5563',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            🧪 Quality Testing Labs ({labs.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('TPI');
              setMode('list');
            }}
            style={{
              padding: '0.625rem 1.25rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 700,
              border:
                activeTab === 'TPI' ? '2px solid #1d4ed8' : '1px solid #d1d5db',
              background: activeTab === 'TPI' ? '#eff6ff' : '#ffffff',
              color: activeTab === 'TPI' ? '#1d4ed8' : '#4b5563',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            🛡️ TPI Inspection Agencies ({tpiAgencies.length})
          </button>
        </div>

        <Button
          label={
            activeTab === 'VENDOR'
              ? 'Register Vendor Agency'
              : activeTab === 'LAB'
                ? 'Empanel Quality Lab'
                : 'Empanel TPI Agency'
          }
          icon="plus"
          variant="primary"
          onClick={openCreate}
        />
      </div>

      {/* TAB 1: CONTRACTORS (VENDOR AGENCY) */}
      {activeTab === 'VENDOR' && (
        <FormCard>
          <GridPanel
            data={vendors}
            columns={[
              { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '45px' },
              {
                field: 'registrationNumber',
                header: 'Reg No.',
                cell: (c: MockVendorAgencyRegistration) => (
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: '#1d4ed8',
                    }}
                  >
                    {c.registrationNumber}
                  </span>
                ),
                width: '130px',
              },
              {
                field: 'companyName',
                header: 'Agency / Contractor Firm',
                cell: (c: MockVendorAgencyRegistration) => (
                  <div>
                    <div style={{ fontWeight: 600, color: '#111827' }}>
                      {c.companyName}
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginTop: '2px',
                      }}
                    >
                      Prop: {c.proprietorName} • Phone: {c.contactPhone}
                    </div>
                  </div>
                ),
              },
              {
                field: 'licenseGrade',
                header: 'Contractor Class',
                cell: (c: MockVendorAgencyRegistration) => (
                  <span
                    className="civil-pill purple"
                    style={{ fontSize: '0.72rem' }}
                  >
                    {c.licenseGrade || 'Class A'}
                  </span>
                ),
                width: '140px',
              },
              {
                field: 'gstNumber',
                header: 'Tax Identifiers',
                cell: (c: MockVendorAgencyRegistration) => (
                  <div style={{ fontSize: '0.75rem', lineHeight: 1.4 }}>
                    <div>
                      <strong>GST:</strong> {c.gstNumber}{' '}
                      {c.isGstPanValidated && (
                        <span style={{ color: '#16a34a' }}>✓</span>
                      )}
                    </div>
                    <div style={{ color: '#6b7280' }}>
                      <strong>PAN:</strong> {c.panNumber}
                    </div>
                  </div>
                ),
                width: '160px',
              },
              {
                field: 'bankAccountNumber',
                header: 'Bank Mandate',
                cell: (c: MockVendorAgencyRegistration) => (
                  <div style={{ fontSize: '0.75rem', color: '#4b5563' }}>
                    <div>
                      {c.bankName}{' '}
                      {c.isBankMandateVerified && (
                        <span style={{ color: '#16a34a' }}>✓</span>
                      )}
                    </div>
                    <div style={{ fontFamily: 'monospace' }}>
                      A/c: {c.bankAccountNumber}
                    </div>
                  </div>
                ),
                width: '150px',
              },
              {
                field: 'isActive',
                header: 'Active',
                sortable: false,
                cell: (c: MockVendorAgencyRegistration) => (
                  <StatusButton
                    value={c.isActive}
                    onClick={() => toggleVendorStatus(c)}
                  />
                ),
                width: '80px',
              },
              {
                field: 'vendorAgencyRegistrationId',
                header: 'Actions',
                sortable: false,
                cell: (item: MockVendorAgencyRegistration) => (
                  <GridActionButtons
                    onView={() => openView(item)}
                    onEdit={() => openEdit(item)}
                    viewTooltip="View Vendor Dossier"
                    editTooltip="Edit Vendor Details"
                  />
                ),
                width: '100px',
              },
            ]}
            searchBox
            searchPlaceholder="Search contractors by firm name, GSTIN, or proprietor..."
          />
        </FormCard>
      )}

      {/* TAB 2: QUALITY TESTING LABS */}
      {activeTab === 'LAB' && (
        <FormCard>
          <GridPanel
            data={labs}
            columns={[
              { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '45px' },
              {
                field: 'id',
                header: 'Lab ID',
                cell: (l: any) => (
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: '#1d4ed8',
                    }}
                  >
                    {l.id}
                  </span>
                ),
                width: '110px',
              },
              {
                field: 'name',
                header: 'Laboratory Name',
                cell: (l: any) => (
                  <div>
                    <div style={{ fontWeight: 600, color: '#111827' }}>
                      {l.name}
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginTop: '2px',
                      }}
                    >
                      {l.address}
                    </div>
                  </div>
                ),
              },
              {
                field: 'nablAccreditation',
                header: 'NABL Certificate',
                cell: (l: any) => (
                  <div>
                    <span
                      className="civil-pill green"
                      style={{ fontSize: '0.72rem' }}
                    >
                      {l.nablAccreditation}
                    </span>
                    <div
                      style={{
                        fontSize: '0.72rem',
                        color: '#6b7280',
                        marginTop: '2px',
                      }}
                    >
                      Valid thru: {l.nablValidity || '2027-12-31'}
                    </div>
                  </div>
                ),
              },
              {
                field: 'scopeOfTesting',
                header: 'Testing Scope',
                cell: (l: any) => (
                  <span style={{ fontSize: '0.75rem', color: '#4b5563' }}>
                    {l.scopeOfTesting}
                  </span>
                ),
              },
              {
                field: 'contactPerson',
                header: 'Lab Contact',
                cell: (l: any) => (
                  <div style={{ fontSize: '0.75rem' }}>
                    <div>{l.contactPerson}</div>
                    <div style={{ color: '#6b7280' }}>{l.mobile}</div>
                  </div>
                ),
              },
              {
                field: 'isActive',
                header: 'Active',
                sortable: false,
                cell: (l: any) => (
                  <StatusButton
                    value={l.isActive}
                    onClick={() => toggleLabStatus(l.id)}
                  />
                ),
                width: '80px',
              },
              {
                field: 'actions',
                header: 'Actions',
                sortable: false,
                cell: (item: any) => (
                  <GridActionButtons
                    onView={() => openView(item)}
                    onEdit={() => openEdit(item)}
                    viewTooltip="View Lab Details"
                    editTooltip="Edit Lab"
                  />
                ),
                width: '100px',
              },
            ]}
            searchBox
            searchPlaceholder="Search testing labs..."
          />
        </FormCard>
      )}

      {/* TAB 3: TPI AGENCIES */}
      {activeTab === 'TPI' && (
        <FormCard>
          <GridPanel
            data={tpiAgencies}
            columns={[
              { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '45px' },
              {
                field: 'id',
                header: 'Agency ID',
                cell: (t: any) => (
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: '#1d4ed8',
                    }}
                  >
                    {t.id}
                  </span>
                ),
                width: '110px',
              },
              {
                field: 'name',
                header: 'Inspection Agency',
                cell: (t: any) => (
                  <div>
                    <div style={{ fontWeight: 600, color: '#111827' }}>
                      {t.name}
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginTop: '2px',
                      }}
                    >
                      {t.address}
                    </div>
                  </div>
                ),
              },
              {
                field: 'licenseNo',
                header: 'License & Reg',
                cell: (t: any) => (
                  <div>
                    <span
                      className="civil-pill blue"
                      style={{ fontSize: '0.72rem' }}
                    >
                      {t.licenseNo}
                    </span>
                    <div
                      style={{
                        fontSize: '0.72rem',
                        color: '#6b7280',
                        marginTop: '2px',
                      }}
                    >
                      Valid thru: {t.licenseValidity || '2028-03-31'}
                    </div>
                  </div>
                ),
              },
              {
                field: 'contractorClass',
                header: 'Tier / Class',
                cell: (t: any) => (
                  <span style={{ fontSize: '0.75rem', color: '#4b5563' }}>
                    {t.contractorClass}
                  </span>
                ),
              },
              {
                field: 'contactPerson',
                header: 'Agency Contact',
                cell: (t: any) => (
                  <div style={{ fontSize: '0.75rem' }}>
                    <div>{t.contactPerson}</div>
                    <div style={{ color: '#6b7280' }}>{t.mobile}</div>
                  </div>
                ),
              },
              {
                field: 'isActive',
                header: 'Active',
                sortable: false,
                cell: (t: any) => (
                  <StatusButton
                    value={t.isActive}
                    onClick={() => toggleTpiStatus(t.id)}
                  />
                ),
                width: '80px',
              },
              {
                field: 'actions',
                header: 'Actions',
                sortable: false,
                cell: (item: any) => (
                  <GridActionButtons
                    onView={() => openView(item)}
                    onEdit={() => openEdit(item)}
                    viewTooltip="View Agency Details"
                    editTooltip="Edit Agency"
                  />
                ),
                width: '100px',
              },
            ]}
            searchBox
            searchPlaceholder="Search TPI agencies..."
          />
        </FormCard>
      )}
    </FormPage>
  );
}
