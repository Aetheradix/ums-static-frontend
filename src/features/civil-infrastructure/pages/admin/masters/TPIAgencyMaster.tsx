import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button, StatusButton } from 'shared/components/buttons';
import { TextArea, TextBox } from 'shared/components/forms';
import {
  FormActions,
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { CIVIL_STORAGE_KEYS, useCivilStorage } from '../../../civilStorage';
import { initialTPIAgencies } from '../../../mocks';
import { civilUrls } from '../../../urls';
import '../../civil.css';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: CivilManagement.TPIAgencyItem };

export default function TPIAgencyMaster() {
  const [data, setData] = useCivilStorage<CivilManagement.TPIAgencyItem[]>(
    CIVIL_STORAGE_KEYS.TPI_AGENCIES,
    initialTPIAgencies
  );

  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  // Form state
  const [agencyName, setAgencyName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [contactPersonName, setContactPersonName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  const openCreate = () => {
    setAgencyName('');
    setLicenseNumber('');
    setContactPersonName('');
    setContactEmail('');
    setMobileNumber('');
    setOfficeAddress('');
    setPopup({ mode: 'create' });
  };

  const openEdit = (item: CivilManagement.TPIAgencyItem) => {
    setAgencyName(item.agencyName || item.name || '');
    setLicenseNumber(item.licenseNumber || (item as any).licenseNo || '');
    setContactPersonName(
      item.contactPersonName || (item as any).contactPerson || ''
    );
    setContactEmail(item.contactEmail || (item as any).email || '');
    setMobileNumber(item.mobileNumber || (item as any).mobile || '');
    setOfficeAddress(item.officeAddress || (item as any).address || '');
    setPopup({ mode: 'edit', item });
  };

  const handleReset = () => {
    if (popup.mode === 'edit' && popup.item) {
      openEdit(popup.item);
    } else {
      openCreate();
    }
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!agencyName.trim()) {
      ToastService.error('Agency Name is required.');
      return;
    }
    if (!licenseNumber.trim()) {
      ToastService.error('License / Registration No is required.');
      return;
    }
    if (!contactPersonName.trim()) {
      ToastService.error('Contact Person Name is required.');
      return;
    }

    if (popup.mode === 'create') {
      const nextId = data.length + 1;
      const newItem: CivilManagement.TPIAgencyItem = {
        qualityInspectionAgencyId: nextId,
        id: `TPI-${String(nextId).padStart(2, '0')}`,
        agencyCode: `TPI-AG-${String(nextId).padStart(2, '0')}`,
        agencyName: agencyName.trim(),
        name: agencyName.trim(),
        licenseNumber: licenseNumber.trim(),
        licenseNo: licenseNumber.trim(),
        contactPersonName: contactPersonName.trim(),
        contactPerson: contactPersonName.trim(),
        contactEmail: contactEmail.trim() || undefined,
        email: contactEmail.trim() || undefined,
        mobileNumber: mobileNumber.trim() || undefined,
        mobile: mobileNumber.trim() || undefined,
        officeAddress: officeAddress.trim() || undefined,
        address: officeAddress.trim() || undefined,
        isActive: true,
      };
      setData(prev => [newItem, ...prev]);
      ToastService.success(
        `TPI Agency "${newItem.agencyName}" added successfully.`
      );
    } else if (popup.mode === 'edit' && popup.item) {
      setData(prev =>
        prev.map(d =>
          d.qualityInspectionAgencyId ===
            popup.item!.qualityInspectionAgencyId || d.id === popup.item!.id
            ? {
                ...d,
                agencyName: agencyName.trim(),
                name: agencyName.trim(),
                licenseNumber: licenseNumber.trim(),
                licenseNo: licenseNumber.trim(),
                contactPersonName: contactPersonName.trim(),
                contactPerson: contactPersonName.trim(),
                contactEmail: contactEmail.trim() || undefined,
                email: contactEmail.trim() || undefined,
                mobileNumber: mobileNumber.trim() || undefined,
                mobile: mobileNumber.trim() || undefined,
                officeAddress: officeAddress.trim() || undefined,
                address: officeAddress.trim() || undefined,
              }
            : d
        )
      );
      ToastService.success('TPI Agency updated successfully.');
    }
    setPopup({ mode: 'closed' });
  };

  const handleToggleStatus = (item: CivilManagement.TPIAgencyItem) => {
    setData(prev =>
      prev.map(d => {
        if (
          d.qualityInspectionAgencyId === item.qualityInspectionAgencyId ||
          d.id === item.id
        ) {
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
      title="Quality Inspection Agency (TPI)"
      description="Manage Third-Party Inspection (TPI) agencies and independent QA/QC engineering consultants."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
        { label: 'Admin Login', to: civilUrls.adminMenu },
        { label: 'Masters', to: civilUrls.tpiAgencyMaster },
        { label: 'Quality Inspection Agency (TPI)' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          onEdit={item => openEdit(item)}
          columns={[
            {
              field: 'agencyCode',
              header: 'Agency ID',
              cell: (item: CivilManagement.TPIAgencyItem) => (
                <span style={{ color: '#2563eb', fontWeight: 600 }}>
                  {item.agencyCode || item.id}
                </span>
              ),
            },
            {
              field: 'agencyName',
              header: 'Agency Name',
              cell: (item: CivilManagement.TPIAgencyItem) => (
                <span style={{ fontWeight: 600 }}>
                  {item.agencyName || item.name}
                </span>
              ),
            },
            {
              field: 'licenseNumber',
              header: 'License No',
              cell: (item: CivilManagement.TPIAgencyItem) => (
                <span>
                  {item.licenseNumber || (item as any).licenseNo || '-'}
                </span>
              ),
            },
            {
              field: 'contactPersonName',
              header: 'Contact Person',
              cell: (item: CivilManagement.TPIAgencyItem) => (
                <span>
                  {item.contactPersonName || (item as any).contactPerson || '-'}
                </span>
              ),
            },
            {
              field: 'contactEmail',
              header: 'Email ID',
              cell: (item: CivilManagement.TPIAgencyItem) => (
                <span>
                  {item.contactEmail || (item as any).email
                    ? item.contactEmail || (item as any).email
                    : 'N/A'}
                </span>
              ),
            },
            {
              field: 'mobileNumber',
              header: 'Mobile Number',
              cell: (item: CivilManagement.TPIAgencyItem) => (
                <span>
                  {item.mobileNumber || (item as any).mobile
                    ? item.mobileNumber || (item as any).mobile
                    : 'N/A'}
                </span>
              ),
            },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: CivilManagement.TPIAgencyItem) => (
                <StatusButton
                  value={item.isActive !== false}
                  onClick={() => handleToggleStatus(item)}
                />
              ),
            },
          ]}
          toolbar={
            <Button
              label="Add TPI Agency"
              icon="plus"
              variant="primary"
              onClick={openCreate}
            />
          }
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={closePopup}
        title={
          popup.mode === 'edit'
            ? 'Edit Quality Inspection Agency (TPI)'
            : 'Add Quality Inspection Agency (TPI)'
        }
        subtitle="Independent Third-Party Inspection (TPI) quality check agency registry details."
      >
        {(popup.mode === 'create' || popup.mode === 'edit') && (
          <form onSubmit={handleSave}>
            <FormGrid columns={2}>
              <TextBox
                label="Agency Name"
                placeholder="e.g. RITES Limited"
                value={agencyName}
                onChange={setAgencyName}
                maxLength={200}
                required
              />
              <TextBox
                label="License / Registration No"
                placeholder="e.g. TPI-REG-2025-001"
                value={licenseNumber}
                onChange={setLicenseNumber}
                maxLength={100}
                required
              />
            </FormGrid>
            <FormGrid columns={2}>
              <TextBox
                label="Contact Person Name"
                placeholder="e.g. Shri R.K. Varma"
                value={contactPersonName}
                onChange={setContactPersonName}
                maxLength={150}
                required
              />
              <TextBox
                label="Contact Email ID"
                placeholder="e.g. info@rites.com"
                value={contactEmail}
                onChange={setContactEmail}
                maxLength={150}
              />
              <TextBox
                label="Mobile Number"
                placeholder="e.g. 9876543210"
                value={mobileNumber}
                onChange={setMobileNumber}
                maxLength={10}
              />
            </FormGrid>
            <TextArea
              label="Office Address"
              placeholder="Enter complete administrative address..."
              value={officeAddress}
              onChange={setOfficeAddress}
              rows={3}
            />
            <FormActions
              isEditMode={popup.mode === 'edit'}
              saveLabel={
                popup.mode === 'edit' ? 'Update Agency' : 'Save Agency'
              }
              onSave={handleSave}
              onReset={handleReset}
            />
          </form>
        )}
      </FormPopup>
    </FormPage>
  );
}
