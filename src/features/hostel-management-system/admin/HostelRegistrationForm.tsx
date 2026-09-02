import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  FormActions,
  FormCard,
  FormPage,
  FormPopup,
} from 'shared/new-components';
import HostelFields, { blank, deriveCode, toForm } from './HostelFields';
import type { FormState } from './HostelFields';
import { KeyValueTile, SectionNote } from '../components/ui';
import {
  buildHostelCredentials,
  today,
  useHms,
  useHmsRole,
} from '../context/HmsContext';
import type { Hostel } from '../context/HmsContext';
import { hmsBreadcrumbs } from '../utils/breadcrumbs';
import { hmsUrls } from '../urls';

/**
 * Register a new hostel, or edit one already on the register. Saving a new
 * hostel issues the warden's credentials, shown before returning to the list.
 */
export default function HostelRegistrationForm() {
  const { data, add, update } = useHms();
  const { activePortal } = useHmsRole();
  const navigate = useNavigate();
  const { hostelId } = useParams<{ hostelId: string }>();

  const existing = hostelId
    ? data.hostels.find(h => h.id === hostelId)
    : undefined;
  const isEdit = Boolean(existing);

  const [form, setForm] = useState<FormState>(blank);
  const [credentialsFor, setCredentialsFor] = useState<Hostel | null>(null);

  // Load the hostel being edited once it is available from the store.
  useEffect(() => {
    if (existing) setForm(toForm(existing));
  }, [existing]);

  const backToList = () => navigate(hmsUrls.admin.hostelRegistration);

  const handleRegister = () => {
    const code = form.code || deriveCode(form.nameEn);
    const credentials = buildHostelCredentials(code, data.hostels.length + 1);
    const hostel: Hostel = {
      ...form,
      code,
      nameEn: form.nameEn || 'Untitled Hostel',
      id: `H${Date.now()}`,
      facilityIds: [],
      registeredOn: today(),
      status: 'Active',
      ...credentials,
    };
    add('hostels', hostel);
    setCredentialsFor(hostel);
    ToastService.success(`${hostel.nameEn} registered successfully.`);
  };

  const handleUpdate = () => {
    if (!existing) return;
    update('hostels', existing.id, {
      ...existing,
      ...form,
      code: form.code || existing.code,
    });
    ToastService.success('Hostel details updated.');
    backToList();
  };

  return (
    <FormPage
      title={isEdit ? 'Edit Hostel' : 'Register Hostel'}
      description={
        isEdit
          ? 'Update this hostel’s details. Its warden credentials stay unchanged.'
          : 'Register a hostel with its name, type, location, capacity and warden. Login credentials for the Warden Portal are issued the moment it is saved.'
      }
      breadcrumbs={[
        ...hmsBreadcrumbs(activePortal, 'Hostel Registration').slice(0, -1),
        { label: 'Hostel Registration', to: hmsUrls.admin.hostelRegistration },
        { label: isEdit ? 'Edit' : 'Register' },
      ]}
      headerAction={
        <Button
          label="Back to Hostels"
          icon="arrow-left"
          variant="outlined"
          onClick={backToList}
        />
      }
    >
      {isEdit && !existing && (
        <SectionNote tone="warning" title="Hostel not found">
          That hostel is no longer on the register.
        </SectionNote>
      )}

      <HostelFields values={form} onChange={setForm} />

      <FormCard>
        <FormActions
          isEditMode={isEdit}
          saveLabel={isEdit ? 'Update Hostel' : 'Register Hostel'}
          onSave={isEdit ? handleUpdate : handleRegister}
          onReset={() => setForm(existing ? toForm(existing) : blank())}
        />
      </FormCard>

      <FormPopup
        visible={Boolean(credentialsFor)}
        onHide={() => {
          setCredentialsFor(null);
          backToList();
        }}
        title="Warden Login Credentials"
        subtitle="Hand these to the hostel office — the warden signs in to the Hostel Warden portal with them."
        footer={
          <div className="flex justify-end">
            <Button
              label="Done"
              variant="primary"
              onClick={() => {
                setCredentialsFor(null);
                backToList();
              }}
            />
          </div>
        }
      >
        {credentialsFor && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 rounded-xl border border-slate-200 px-5 py-4 dark:border-slate-700">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30">
                <span className="material-symbols-outlined text-[22px] text-blue-600 dark:text-blue-300">
                  apartment
                </span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                  {credentialsFor.nameEn}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {credentialsFor.wardenName || 'Warden not named'} ·{' '}
                  {credentialsFor.address || 'Address not set'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <KeyValueTile
                label="Login ID"
                value={credentialsFor.loginId}
                mono
              />
              <KeyValueTile
                label="Password"
                value={credentialsFor.password}
                mono
              />
            </div>
            <SectionNote tone="warning">
              The warden must change this password on first sign-in.
            </SectionNote>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
