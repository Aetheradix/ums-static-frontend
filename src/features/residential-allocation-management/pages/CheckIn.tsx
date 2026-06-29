import React, { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage, GridPanel } from 'shared/new-components';
import { useResidentialAllocation } from '../context';
import { RESIDENTIAL_ALLOCATION_URLS } from '../urls';

export default function CheckIn() {
  const { applications, checkedInList, setCheckedInList, triggerNotification } =
    useResidentialAllocation();

  const [checkInAppId, setCheckInAppId] = useState('');
  const [checkInDate, setCheckInDate] = useState('2026-06-20');
  const [luggageCount, setLuggageCount] = useState('3');
  const [checkInRemarks, setCheckInRemarks] = useState('');

  const allottedApps = applications.filter(a => a.allottedFlat);

  const appOptions: Data.DataItem<string>[] = [
    { id: '', text: '-- Select Staff for Physical Onboarding --' },
    ...allottedApps.map(a => ({
      id: a.id,
      text: `${a.name} — ${a.allottedFlat} (Fee: ${a.feeStatus})`,
    })),
  ];

  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInAppId) {
      triggerNotification(
        'Please select an applicant for physical onboarding.',
        'error'
      );
      return;
    }
    const app = applications.find(a => a.id === checkInAppId);
    if (!app) return;

    // Strict utility dues check prior to physical joining keys handoff
    if (app.feeStatus !== 'Paid') {
      triggerNotification(
        'Check-In Blocked: Security clearance deposit must be processed in the ledger tab.',
        'error'
      );
      return;
    }

    const checkInRecord: ResidentialAllocationManagement.CheckedInRecord = {
      appId: app.id,
      staffName: app.name,
      enrollmentNo: app.enrollmentNo,
      estateCode: app.allottedEstate,
      flatNo: app.allottedFlat,
      checkInDate: checkInDate,
      luggage: luggageCount,
      remarks: checkInRemarks,
    };

    setCheckedInList(prev => [...prev, checkInRecord]);
    triggerNotification(
      `Quarter Check-In finalized! Keys to ${app.allottedFlat} officially handed over.`
    );
    setCheckInAppId('');
    setCheckInRemarks('');
  };

  return (
    <FormPage
      title="Quarter Joining & Key Release"
      description="Register physical staff onboarding, luggage inspection, and quarter key handoffs"
      breadcrumbs={[
        {
          label: 'Residential Allocation',
          to: RESIDENTIAL_ALLOCATION_URLS.dashboard,
        },
        { label: 'Joining & Check-In' },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Check-in Slip */}
        <FormCard title="Quarter Key Handoff Slip" icon="key">
          <form onSubmit={handleCheckInSubmit} className="space-y-5">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-900 text-xs flex items-start gap-2 leading-relaxed">
              <i className="pi pi-key text-amber-600 text-base shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold uppercase">Key Handover Guard:</p>
                <p>
                  Physical keys are released only when the security clearance
                  deposit and HRA deduction ledger status is marked{' '}
                  <strong>'Paid'</strong>.
                </p>
              </div>
            </div>

            <DropDownList
              label="Select Faculty Member *"
              data={appOptions}
              textField="text"
              valueField="id"
              value={checkInAppId}
              onChange={v => setCheckInAppId(v as string)}
            />

            <FormGrid columns={2}>
              <TextBox
                label="Check-In Date *"
                placeholder="YYYY-MM-DD"
                value={checkInDate}
                onChange={v => setCheckInDate(v)}
              />
              <TextBox
                label="Luggage / Container Items"
                placeholder="e.g. 3"
                value={luggageCount}
                onChange={v => setLuggageCount(v)}
              />
            </FormGrid>

            <TextBox
              label="Key Handoff Remarks / Inspection Notes"
              placeholder="e.g. Keys to Villa G05 handed over. Checklist verified."
              value={checkInRemarks}
              onChange={v => setCheckInRemarks(v)}
            />

            <div className="flex justify-end">
              <Button
                label="Finalize Check-In & Release Keys ✓"
                variant="primary"
                type="submit"
              />
            </div>
          </form>
        </FormCard>

        {/* Checked In Registry */}
        <FormCard title="Onboarded Staff Registry" icon="table">
          <GridPanel
            data={checkedInList}
            columns={[
              { field: 'staffName', header: 'Staff Name' },
              { field: 'flatNo', header: 'Quarter Unit' },
              { field: 'checkInDate', header: 'Joining Date' },
              { field: 'remarks', header: 'Handover Notes' },
            ]}
          />
        </FormCard>
      </div>
    </FormPage>
  );
}
