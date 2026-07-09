import { useState, useMemo } from 'react';
import { ToastService } from 'services';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { TextBox, Switch } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import {
  membershipTypes,
  doctors,
  doctorSpecialities,
  hospitals,
  unitTypes,
  facilities,
  referralTemplates,
  medicineBrands,
  medicineCompanies,
  medicineSalts,
  medicineStockTypes,
  prescriptionCodes,
  prescriptionControl,
  settingsGeneral,
} from '../../data';
import { hmsUrls } from '../../urls';
import { getHmsBreadcrumbs } from '../../utils';

const tabs = [
  { id: 'membership', label: 'Membership', icon: 'card_membership' },
  { id: 'health-center', label: 'Health Center', icon: 'local_hospital' },
  { id: 'doctor', label: 'Doctor', icon: 'stethoscope' },
  { id: 'referral', label: 'Referral', icon: 'transfer_within_a_station' },
  { id: 'medicine', label: 'Medicine', icon: 'medication' },
  { id: 'prescription', label: 'Prescription', icon: 'prescriptions' },
];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('membership');

  const [form, setForm] = useState({
    subscribedMembershipOnly: settingsGeneral.subscribedMembershipOnly,
    autoExpiryDays: '365',
    membershipTypeFilter: '',
    healthCenterName: '',
    facilityFilter: '',
    doctorFilter: '',
    referralFilter: '',
    medicineFilter: '',
  });

  const update = (field: string) => (value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value?.value ?? value?.target?.value ?? value ?? '',
    }));
  };

  const filteredMembershipTypes = useMemo(
    () =>
      form.membershipTypeFilter
        ? membershipTypes.filter(mt =>
            mt.name
              .toLowerCase()
              .includes(form.membershipTypeFilter.toLowerCase())
          )
        : membershipTypes,
    [form.membershipTypeFilter]
  );

  const filteredDoctors = useMemo(
    () =>
      form.doctorFilter
        ? doctors.filter(d =>
            (d.universityDoctorName || d.name)
              .toLowerCase()
              .includes(form.doctorFilter.toLowerCase())
          )
        : doctors,
    [form.doctorFilter]
  );

  const filteredFacilities = useMemo(
    () =>
      form.facilityFilter
        ? facilities.filter(f =>
            f.facilityName
              .toLowerCase()
              .includes(form.facilityFilter.toLowerCase())
          )
        : facilities,
    [form.facilityFilter]
  );

  const filteredReferrals = useMemo(
    () =>
      form.referralFilter
        ? referralTemplates.filter(rt =>
            rt.name.toLowerCase().includes(form.referralFilter.toLowerCase())
          )
        : referralTemplates,
    [form.referralFilter]
  );

  const filteredMedicines = useMemo(
    () =>
      form.medicineFilter
        ? medicineSalts.filter(ms =>
            ms.saltName
              .toLowerCase()
              .includes(form.medicineFilter.toLowerCase())
          )
        : medicineSalts,
    [form.medicineFilter]
  );

  const handleSave = () => {
    ToastService.success('Settings saved successfully.');
  };

  return (
    <FormPage
      title="Health Management Settings"
      description="Configure membership types, health centers, doctors, referrals, medicines, and prescriptions."
      breadcrumbs={getHmsBreadcrumbs(
        'Settings',
        undefined,
        'Health Admin Portal',
        hmsUrls.admin.portal
      )}
      headerAction={
        <Button
          label="Save All"
          icon="save"
          variant="primary"
          onClick={handleSave}
        />
      }
    >
      <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-green-600 text-green-700'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'membership' && (
        <div className="space-y-4">
          <FormCard title="General Settings">
            <FormGrid columns={2}>
              <Switch
                label="Subscribed Members Only"
                subLabel="Restrict health services to subscribed members only"
                checked={form.subscribedMembershipOnly}
                onChange={update('subscribedMembershipOnly')}
              />
              <TextBox
                label="Auto-Expiry Days"
                placeholder="e.g. 365"
                value={form.autoExpiryDays}
                onChange={update('autoExpiryDays')}
              />
            </FormGrid>
          </FormCard>
          <FormCard title="Membership Types">
            <TextBox
              label="Search"
              placeholder="Filter by name..."
              value={form.membershipTypeFilter}
              onChange={update('membershipTypeFilter')}
            />
            <div className="mt-3 space-y-2">
              {filteredMembershipTypes.map(mt => (
                <div
                  key={mt.id}
                  className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {mt.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {mt.memberType} — ₹{mt.feeAmount} —{' '}
                      {mt.validityType === 'Lifetime'
                        ? 'Lifetime'
                        : `${mt.validityYears} year(s)`}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${mt.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
                  >
                    {mt.status}
                  </span>
                </div>
              ))}
              {filteredMembershipTypes.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">
                  No membership types found.
                </p>
              )}
            </div>
          </FormCard>
          <div className="flex justify-end gap-3">
            <Button
              label="Save Changes"
              icon="save"
              variant="primary"
              onClick={handleSave}
            />
          </div>
        </div>
      )}

      {activeTab === 'health-center' && (
        <div className="space-y-4">
          <FormCard title="Unit Types">
            <div className="space-y-2">
              {unitTypes.map(ut => (
                <div
                  key={ut.id}
                  className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {ut.type}
                    </p>
                    <p className="text-xs text-gray-500">{ut.description}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${ut.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
                  >
                    {ut.status}
                  </span>
                </div>
              ))}
            </div>
          </FormCard>
          <FormCard title="Facilities">
            <TextBox
              label="Search"
              placeholder="Filter by facility name..."
              value={form.facilityFilter}
              onChange={update('facilityFilter')}
            />
            <div className="mt-3 space-y-2">
              {filteredFacilities.map(f => (
                <div
                  key={f.id}
                  className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {f.facilityName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {f.healthCenter} — {f.details}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${f.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
                  >
                    {f.status}
                  </span>
                </div>
              ))}
              {filteredFacilities.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">
                  No facilities found.
                </p>
              )}
            </div>
          </FormCard>
          <FormCard title="Affiliated Hospitals">
            <div className="space-y-2">
              {hospitals.map(h => (
                <div
                  key={h.id}
                  className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {h.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {h.address} — {h.contactNo}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${h.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
                  >
                    {h.status}
                  </span>
                </div>
              ))}
            </div>
          </FormCard>
          <div className="flex justify-end gap-3">
            <Button
              label="Save Changes"
              icon="save"
              variant="primary"
              onClick={handleSave}
            />
          </div>
        </div>
      )}

      {activeTab === 'doctor' && (
        <div className="space-y-4">
          <FormCard title="Doctor Specialities">
            <div className="space-y-2">
              {doctorSpecialities.map(ds => (
                <div
                  key={ds.id}
                  className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {ds.speciality}
                    </p>
                    <p className="text-xs text-gray-500">{ds.description}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${ds.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
                  >
                    {ds.status}
                  </span>
                </div>
              ))}
            </div>
          </FormCard>
          <FormCard title="Doctors">
            <TextBox
              label="Search"
              placeholder="Filter by doctor name..."
              value={form.doctorFilter}
              onChange={update('doctorFilter')}
            />
            <div className="mt-3 space-y-2">
              {filteredDoctors.map(d => (
                <div
                  key={d.id}
                  className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {d.universityDoctorName || d.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {d.speciality} — {d.hospital} — {d.visitingHoursStart}-
                      {d.visitingHoursEnd}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${d.visitingStatus === 'Available' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
                  >
                    {d.visitingStatus}
                  </span>
                </div>
              ))}
              {filteredDoctors.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">
                  No doctors found.
                </p>
              )}
            </div>
          </FormCard>
          <div className="flex justify-end gap-3">
            <Button
              label="Save Changes"
              icon="save"
              variant="primary"
              onClick={handleSave}
            />
          </div>
        </div>
      )}

      {activeTab === 'referral' && (
        <div className="space-y-4">
          <FormCard title="Referral Templates">
            <TextBox
              label="Search"
              placeholder="Filter by template name..."
              value={form.referralFilter}
              onChange={update('referralFilter')}
            />
            <div className="mt-3 space-y-2">
              {filteredReferrals.map(rt => (
                <div
                  key={rt.id}
                  className="p-3 border border-gray-100 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">
                      {rt.name}
                    </p>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${rt.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
                    >
                      {rt.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {rt.templateBody}
                  </p>
                </div>
              ))}
              {filteredReferrals.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">
                  No referral templates found.
                </p>
              )}
            </div>
          </FormCard>
          <div className="flex justify-end gap-3">
            <Button
              label="Save Changes"
              icon="save"
              variant="primary"
              onClick={handleSave}
            />
          </div>
        </div>
      )}

      {activeTab === 'medicine' && (
        <div className="space-y-4">
          <FormCard title="Medicine Salts">
            <TextBox
              label="Search"
              placeholder="Filter by salt name..."
              value={form.medicineFilter}
              onChange={update('medicineFilter')}
            />
            <div className="mt-3 space-y-2">
              {filteredMedicines.map(ms => (
                <div
                  key={ms.id}
                  className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {ms.saltName}
                    </p>
                    <p className="text-xs text-gray-500">{ms.remarks}</p>
                  </div>
                </div>
              ))}
              {filteredMedicines.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">
                  No medicines found.
                </p>
              )}
            </div>
          </FormCard>
          <FormCard title="Brands & Companies">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Brands</p>
                <div className="space-y-1">
                  {medicineBrands.map(b => (
                    <div
                      key={b.id}
                      className="p-2 border border-gray-100 rounded text-sm"
                    >
                      {b.brandName}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">
                  Companies
                </p>
                <div className="space-y-1">
                  {medicineCompanies.map(c => (
                    <div
                      key={c.id}
                      className="p-2 border border-gray-100 rounded text-sm"
                    >
                      {c.companyName}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FormCard>
          <FormCard title="Stock Types">
            <div className="space-y-2">
              {medicineStockTypes.map(st => (
                <div
                  key={st.id}
                  className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {st.name}
                    </p>
                    <p className="text-xs text-gray-500">{st.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </FormCard>
          <div className="flex justify-end gap-3">
            <Button
              label="Save Changes"
              icon="save"
              variant="primary"
              onClick={handleSave}
            />
          </div>
        </div>
      )}

      {activeTab === 'prescription' && (
        <div className="space-y-4">
          <FormCard title="Prescription Codes">
            <div className="space-y-2">
              {prescriptionCodes.map(pc => (
                <div
                  key={pc.id}
                  className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {pc.code} — {pc.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      Dose: {pc.doseQuantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </FormCard>
          <FormCard title="Prescription Control">
            <FormGrid columns={2}>
              {prescriptionControl.map(pc => (
                <Switch
                  key={pc.id}
                  label="Show Signature on Prescription"
                  subLabel="Display doctor signature on printed prescriptions"
                  checked={pc.showSignature}
                  onChange={() => {}}
                />
              ))}
            </FormGrid>
          </FormCard>
          <div className="flex justify-end gap-3">
            <Button
              label="Save Changes"
              icon="save"
              variant="primary"
              onClick={handleSave}
            />
          </div>
        </div>
      )}
    </FormPage>
  );
}
