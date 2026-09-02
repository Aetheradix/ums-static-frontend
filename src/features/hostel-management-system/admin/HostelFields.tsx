import { useMemo } from 'react';
import {
  DatePicker,
  DropDownList,
  NumberBox,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import { FormCard, FormGrid } from 'shared/new-components';
import { SectionNote } from '../components/ui';
import { useHms } from '../context/HmsContext';
import type { Hostel } from '../context/HmsContext';

export interface FormState {
  nameEn: string;
  nameHi: string;
  type: 'Boys' | 'Girls';
  districtId: string;
  blockId: string;
  address: string;
  capacity: number;
  occupancy: number;
  code: string;
  wardenName: string;
  wardenMobile: string;
  wardenEmail: string;
  wardenDesignationId: string;
  wardenJoiningDate: string;
}

export const blank = (): FormState => ({
  nameEn: '',
  nameHi: '',
  type: 'Boys',
  districtId: '',
  blockId: '',
  address: '',
  capacity: 0,
  occupancy: 0,
  code: '',
  wardenName: '',
  wardenMobile: '',
  wardenEmail: '',
  wardenDesignationId: '',
  wardenJoiningDate: '',
});

export const toForm = (h: Hostel): FormState => ({
  nameEn: h.nameEn,
  nameHi: h.nameHi,
  type: h.type,
  districtId: h.districtId,
  blockId: h.blockId,
  address: h.address,
  capacity: h.capacity,
  occupancy: h.occupancy,
  code: h.code,
  wardenName: h.wardenName,
  wardenMobile: h.wardenMobile,
  wardenEmail: h.wardenEmail,
  wardenDesignationId: h.wardenDesignationId,
  wardenJoiningDate: h.wardenJoiningDate,
});

/** Derive a hostel code from the name when the admin leaves it blank. */
export const deriveCode = (name: string) =>
  (name || 'HOSTEL')
    .split(/\s+/)
    .map(w => w.replace(/[^A-Za-z]/g, '').charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 4) || 'HST';

export default function HostelFields({
  values,
  onChange,
}: {
  values: FormState;
  onChange: (v: FormState) => void;
}) {
  const { data } = useHms();
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    onChange({ ...values, [key]: value });

  const blockOptions = useMemo(
    () =>
      data.blocks
        .filter(b => !values.districtId || b.districtId === values.districtId)
        .map(b => ({ id: b.id, text: b.name })),
    [data.blocks, values.districtId]
  );

  return (
    <>
      <FormCard
        title="Hostel Details"
        subtitle="Identity, type and where the hostel is located."
        icon="building"
      >
        <FormGrid columns={3}>
          <TextBox
            label="Hostel Name (English)"
            placeholder="e.g. Boys Hostel - Block A"
            value={values.nameEn}
            onChange={v => set('nameEn', v)}
          />
          <TextBox
            label="Hostel Name (Hindi)"
            placeholder="जैसे बालक छात्रावास - ब्लॉक ए"
            value={values.nameHi}
            onChange={v => set('nameHi', v)}
          />
          <DropDownList
            label="Hostel Type"
            data={[
              { id: 'Boys', text: 'Boys' },
              { id: 'Girls', text: 'Girls' },
            ]}
            textField="text"
            valueField="id"
            value={values.type}
            onChange={v => set('type', (v as 'Boys' | 'Girls') ?? 'Boys')}
          />

          <DropDownList
            label="District"
            data={data.districts.map(d => ({ id: d.id, text: d.name }))}
            textField="text"
            valueField="id"
            value={values.districtId}
            onChange={v =>
              onChange({
                ...values,
                districtId: (v as string) ?? '',
                blockId: '',
              })
            }
          />
          <DropDownList
            label="Block"
            data={blockOptions}
            textField="text"
            valueField="id"
            value={values.blockId}
            onChange={v => set('blockId', (v as string) ?? '')}
          />
          <TextBox
            label="Hostel Code"
            placeholder="Auto-generated if left blank"
            value={values.code}
            onChange={v => set('code', v.toUpperCase())}
          />

          <div className="md:col-span-3">
            <TextArea
              label="Address"
              rows={2}
              placeholder="e.g. Takshashila Campus, Khandwa Road, Indore - 452001"
              value={values.address}
              onChange={v => set('address', v)}
            />
          </div>
        </FormGrid>
      </FormCard>

      <FormCard
        title="Capacity"
        subtitle="Sanctioned seats and the occupancy already recorded for this hostel."
        icon="th-large"
      >
        <FormGrid columns={3}>
          <NumberBox
            label="Hostel Capacity (seats)"
            min={0}
            value={values.capacity}
            onChange={v => set('capacity', v ?? 0)}
          />
          <NumberBox
            label="Current Occupancy"
            min={0}
            value={values.occupancy}
            onChange={v => set('occupancy', v ?? 0)}
          />
          <div className="flex items-end pb-4">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              {Math.max(values.capacity - values.occupancy, 0)} seats free at
              registration
            </p>
          </div>
        </FormGrid>
        <SectionNote tone="neutral">
          The warden configures the actual rooms after signing in — bed counts
          on the monitoring screens come from those rooms, not from this figure.
        </SectionNote>
      </FormCard>

      <FormCard
        title="Warden Details"
        subtitle="The warden who will sign in to this hostel's portal."
        icon="user"
      >
        <FormGrid columns={3}>
          <TextBox
            label="Warden Name"
            placeholder="e.g. Rajesh Kumar"
            value={values.wardenName}
            onChange={v => set('wardenName', v)}
          />
          <TextBox
            label="Warden Mobile Number"
            maxLength={10}
            placeholder="10-digit mobile number"
            value={values.wardenMobile}
            onChange={v => set('wardenMobile', v.replace(/\D/g, ''))}
          />
          <TextBox
            label="Warden Email ID"
            placeholder="warden@davv.ac.in"
            value={values.wardenEmail}
            onChange={v => set('wardenEmail', v)}
          />

          <DropDownList
            label="Warden Designation"
            data={data.designations.map(d => ({ id: d.id, text: d.name }))}
            textField="text"
            valueField="id"
            value={values.wardenDesignationId}
            onChange={v => set('wardenDesignationId', (v as string) ?? '')}
          />
          <DatePicker
            label="Joining Date"
            value={
              values.wardenJoiningDate
                ? new Date(values.wardenJoiningDate)
                : undefined
            }
            onChange={v =>
              set('wardenJoiningDate', v ? v.toISOString().split('T')[0] : '')
            }
          />
        </FormGrid>
      </FormCard>
    </>
  );
}
