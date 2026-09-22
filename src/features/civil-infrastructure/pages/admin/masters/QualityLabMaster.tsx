import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button, StatusButton } from 'shared/components/buttons';
import { TextArea, TextBox } from 'shared/components/forms';
import GridActionButtons from 'shared/components/grid/GridActionButtons';
import {
  FormActions,
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  PreviewGrid,
  StatusBadge,
} from 'shared/new-components';
import { CIVIL_STORAGE_KEYS, useCivilStorage } from '../../../civilStorage';
import { initialLabAgencies } from '../../../mocks';
import { civilUrls } from '../../../urls';
import '../../civil.css';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: CivilManagement.QualityLabItem }
  | { mode: 'view'; item: CivilManagement.QualityLabItem };

export default function QualityLabMaster() {
  const [data, setData] = useCivilStorage<CivilManagement.QualityLabItem[]>(
    CIVIL_STORAGE_KEYS.LAB_AGENCIES,
    initialLabAgencies
  );

  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  // Form states
  const [name, setName] = useState('');
  const [nablAccreditationNumber, setNablAccreditationNumber] = useState('');
  const [labDirector, setLabDirector] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [labAddress, setLabAddress] = useState('');
  const [testingScope, setTestingScope] = useState('');

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  const openCreate = () => {
    setName('');
    setNablAccreditationNumber('');
    setLabDirector('');
    setMobileNumber('');
    setEmail('');
    setLabAddress('');
    setTestingScope('');
    setPopup({ mode: 'create' });
  };

  const openEdit = (item: CivilManagement.QualityLabItem) => {
    setName(item.name || '');
    setNablAccreditationNumber(
      item.nablAccreditationNumber || (item as any).nablAccreditation || ''
    );
    setLabDirector(item.labDirector || (item as any).contactPerson || '');
    setMobileNumber(item.mobileNumber || (item as any).mobile || '');
    setEmail(item.email || '');
    setLabAddress(item.labAddress || (item as any).address || '');
    setTestingScope(item.testingScope || (item as any).scopeOfTesting || '');
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
    if (!name.trim()) {
      ToastService.error('Lab Name is required.');
      return;
    }
    if (!nablAccreditationNumber.trim()) {
      ToastService.error('NABL Accreditation Number is required.');
      return;
    }
    if (!labDirector.trim()) {
      ToastService.error('Lab Director is required.');
      return;
    }
    if (!testingScope.trim()) {
      ToastService.error('Testing Scope is required.');
      return;
    }

    if (popup.mode === 'create') {
      const nextId = data.length + 1;
      const newItem: CivilManagement.QualityLabItem = {
        qualityLabId: nextId,
        id: `LAB-${String(nextId).padStart(2, '0')}`,
        labCode: `LAB-${String(nextId).padStart(3, '0')}`,
        name: name.trim(),
        nablAccreditationNumber: nablAccreditationNumber.trim(),
        labDirector: labDirector.trim(),
        mobileNumber: mobileNumber.trim() || undefined,
        email: email.trim() || undefined,
        labAddress: labAddress.trim() || undefined,
        testingScope: testingScope.trim(),
        isActive: true,
      };
      setData(prev => [newItem, ...prev]);
      ToastService.success(`Quality Lab "${newItem.name}" added successfully.`);
    } else if (popup.mode === 'edit' && popup.item) {
      setData(prev =>
        prev.map(d =>
          d.qualityLabId === popup.item!.qualityLabId || d.id === popup.item!.id
            ? {
                ...d,
                name: name.trim(),
                nablAccreditationNumber: nablAccreditationNumber.trim(),
                labDirector: labDirector.trim(),
                mobileNumber: mobileNumber.trim() || undefined,
                email: email.trim() || undefined,
                labAddress: labAddress.trim() || undefined,
                testingScope: testingScope.trim(),
              }
            : d
        )
      );
      ToastService.success('Quality Lab updated successfully.');
    }
    setPopup({ mode: 'closed' });
  };

  const handleToggleStatus = (item: CivilManagement.QualityLabItem) => {
    setData(prev =>
      prev.map(d => {
        if (d.qualityLabId === item.qualityLabId || d.id === item.id) {
          const next = !d.isActive;
          ToastService.info(
            `Quality Lab ${next ? 'Activated' : 'Deactivated'}.`
          );
          return { ...d, isActive: next };
        }
        return d;
      })
    );
  };

  return (
    <FormPage
      title="Quality Lab Master"
      description="Manage civil testing and material quality control laboratories."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
        { label: 'Admin Login', to: civilUrls.adminMenu },
        { label: 'Masters', to: civilUrls.qualityLabMaster },
        { label: 'Quality Lab' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            {
              field: 'labCode',
              header: 'Lab Code',
              cell: (item: CivilManagement.QualityLabItem) => (
                <span>
                  {item.labCode || item.id || `LAB-${item.qualityLabId}`}
                </span>
              ),
            },
            { field: 'name', header: 'Lab Name' },
            {
              field: 'nablAccreditationNumber',
              header: 'NABL Accreditation No.',
              cell: (item: CivilManagement.QualityLabItem) => (
                <span>
                  {item.nablAccreditationNumber ||
                    (item as any).nablAccreditation ||
                    '-'}
                </span>
              ),
            },
            {
              field: 'labDirector',
              header: 'Lab Director',
              cell: (item: CivilManagement.QualityLabItem) => (
                <span>
                  {item.labDirector || (item as any).contactPerson || '-'}
                </span>
              ),
            },
            {
              field: 'mobileNumber',
              header: 'Mobile',
              cell: (item: CivilManagement.QualityLabItem) => (
                <span>{item.mobileNumber || (item as any).mobile || '-'}</span>
              ),
            },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: CivilManagement.QualityLabItem) => (
                <StatusButton
                  value={item.isActive !== false}
                  onClick={() => handleToggleStatus(item)}
                />
              ),
            },
            {
              header: 'Action',
              sortable: false,
              cell: (item: CivilManagement.QualityLabItem) => (
                <GridActionButtons
                  onView={() => setPopup({ mode: 'view', item })}
                  onEdit={() => openEdit(item)}
                />
              ),
            },
          ]}
          toolbar={
            <Button
              label="Add Quality Lab"
              icon="plus"
              variant="primary"
              onClick={openCreate}
            />
          }
          searchBox
        />
      </FormCard>

      <FormPopup
        size="lg"
        visible={popup.mode !== 'closed'}
        onHide={closePopup}
        title={
          popup.mode === 'create'
            ? 'Add New Quality Lab'
            : popup.mode === 'edit'
              ? 'Edit Quality Lab'
              : 'Quality Lab Details'
        }
        subtitle={
          popup.mode === 'view'
            ? 'View quality lab details and testing scope.'
            : 'Manage civil testing and quality control laboratories.'
        }
      >
        {(popup.mode === 'create' || popup.mode === 'edit') && (
          <form onSubmit={handleSave}>
            <FormGrid columns={2}>
              <TextBox
                label="Lab Name"
                placeholder="Enter lab name..."
                value={name}
                onChange={setName}
                maxLength={200}
                required
              />
              <TextBox
                label="NABL Accreditation Number"
                placeholder="e.g. NABL-12345"
                value={nablAccreditationNumber}
                onChange={setNablAccreditationNumber}
                maxLength={50}
                required
              />
            </FormGrid>

            <FormGrid columns={2} className="mt-3">
              <TextBox
                label="Lab Director"
                placeholder="Enter director name..."
                value={labDirector}
                onChange={setLabDirector}
                maxLength={150}
                required
              />
              <TextBox
                label="Mobile Number"
                placeholder="e.g. 9876543210"
                value={mobileNumber}
                onChange={setMobileNumber}
                maxLength={15}
              />
            </FormGrid>

            <FormGrid columns={2} className="mt-3">
              <TextBox
                label="Email"
                placeholder="e.g. director@qualitylab.com"
                value={email}
                onChange={setEmail}
                maxLength={150}
              />
              <TextBox
                label="Lab Address"
                placeholder="Enter lab location address..."
                value={labAddress}
                onChange={setLabAddress}
                maxLength={500}
              />
            </FormGrid>

            <FormGrid columns={1} className="mt-3">
              <TextArea
                label="Testing Scope"
                placeholder="Enter testing capabilities and scope details..."
                value={testingScope}
                onChange={setTestingScope}
                rows={3}
                required
              />
            </FormGrid>

            <FormActions
              isEditMode={popup.mode === 'edit'}
              onSave={handleSave}
              onReset={handleReset}
            />
          </form>
        )}

        {popup.mode === 'view' && popup.item && (
          <PreviewGrid
            columns={3}
            fields={[
              { label: 'Lab Name', value: popup.item.name },
              {
                label: 'NABL Accreditation Number',
                value:
                  popup.item.nablAccreditationNumber ||
                  (popup.item as any).nablAccreditation ||
                  '-',
              },
              {
                label: 'Lab Director',
                value:
                  popup.item.labDirector ||
                  (popup.item as any).contactPerson ||
                  '-',
              },
              {
                label: 'Mobile Number',
                value:
                  popup.item.mobileNumber || (popup.item as any).mobile || '-',
              },
              { label: 'Email', value: popup.item.email || '-' },
              {
                label: 'Lab Address',
                value:
                  popup.item.labAddress || (popup.item as any).address || '-',
                fullWidth: true,
              },
              {
                label: 'Testing Scope',
                value:
                  popup.item.testingScope ||
                  (popup.item as any).scopeOfTesting ||
                  '-',
                fullWidth: true,
              },
              {
                label: 'Status',
                value: (
                  <StatusBadge
                    label={popup.item.isActive ? 'Active' : 'Inactive'}
                    variant={popup.item.isActive ? 'approved' : 'rejected'}
                  />
                ),
              },
            ]}
          />
        )}
      </FormPopup>
    </FormPage>
  );
}
