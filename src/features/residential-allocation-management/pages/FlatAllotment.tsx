import React, { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage, GridPanel } from 'shared/new-components';
import '../residential.css';
import { useResidentialAllocation } from '../context';
import { RESIDENTIAL_ALLOCATION_URLS } from '../urls';

export default function FlatAllotment() {
  const {
    estates,
    setEstates,
    applications,
    setApplications,
    triggerNotification,
  } = useResidentialAllocation();

  const [allotmentSelectedAppId, setAllotmentSelectedAppId] = useState('');
  const [allotmentHostelCode, setAllotmentHostelCode] = useState('');
  const [allotmentRoomNo, setAllotmentRoomNo] = useState('');
  const [allotmentRemarks, setAllotmentRemarks] = useState('');

  const approvedApps = applications.filter(
    a => a.status === 'Approved' && !a.allottedFlat
  );

  const appOptions: Data.DataItem<string>[] = [
    { id: '', text: '-- Choose Approved Faculty Member --' },
    ...approvedApps.map(a => ({
      id: a.id,
      text: `${a.name} (${a.enrollmentNo}) — ${a.payLevel}`,
    })),
  ];

  const estateOptions: Data.DataItem<string>[] = [
    { id: '', text: '-- Choose Estate Block --' },
    ...estates.map(e => ({
      id: e.code,
      text: `${e.name} (${e.available} Avail / ${e.type})`,
    })),
  ];

  const handleAllotmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allotmentSelectedAppId || !allotmentHostelCode || !allotmentRoomNo) {
      triggerNotification(
        'Please fill in all allocation coordinates.',
        'error'
      );
      return;
    }

    const applicant = applications.find(a => a.id === allotmentSelectedAppId);
    const estate = estates.find(h => h.code === allotmentHostelCode);

    if (!applicant || !estate) {
      triggerNotification('Invalid applicant or estate data.', 'error');
      return;
    }

    // Grade Pay & Matrix Eligible Level Check
    const staffPayLevel = applicant.payLevel;
    if (
      estate.type === 'Type-V' &&
      staffPayLevel !== 'Level-14' &&
      staffPayLevel !== 'Level-15'
    ) {
      triggerNotification(
        `Grade eligibility mismatch! Level ${staffPayLevel} is ineligible for Type-V Bungalows (Requires Level-14 to Level-15).`,
        'error'
      );
      return;
    }

    // Capacity Caps check
    if (estate.available <= 0) {
      triggerNotification(
        'Operation aborted: Selected Estate Block is fully occupied.',
        'error'
      );
      return;
    }

    setApplications(prev =>
      prev.map(app =>
        app.id === allotmentSelectedAppId
          ? {
              ...app,
              allottedEstate: allotmentHostelCode,
              allottedFlat: allotmentRoomNo,
              adminRemarks:
                (app.adminRemarks ? app.adminRemarks + ' | ' : '') +
                `Allotted Flat: ${allotmentRoomNo}`,
            }
          : app
      )
    );

    setEstates(prev =>
      prev.map(h =>
        h.code === allotmentHostelCode
          ? {
              ...h,
              occupancy: Math.min(h.flatsCount, h.occupancy + 1),
              available: Math.max(0, h.available - 1),
            }
          : h
      )
    );

    triggerNotification(
      'Official Faculty Flat Allotment verified and established.'
    );
    setAllotmentSelectedAppId('');
    setAllotmentHostelCode('');
    setAllotmentRoomNo('');
    setAllotmentRemarks('');
  };

  const allottedApps = applications.filter(a => a.allottedFlat);

  return (
    <FormPage
      title="Flat Allotment Desk"
      description="Assign physical quarter units to approved faculty applicants while enforcing grade pay matrix constraints"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Residential Allocation',
          to: RESIDENTIAL_ALLOCATION_URLS.dashboard,
        },
        { label: 'Flat Allotment' },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Allocation Slip */}
        <FormCard title="Faculty Flat Allotment Slip" icon="user-check">
          <form onSubmit={handleAllotmentSubmit} className="space-y-5">
            <div className="ram-grade-alert">
              <i className="pi pi-shield" />
              <div>
                <p
                  style={{
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    fontSize: '0.7rem',
                    letterSpacing: '0.06em',
                    margin: '0 0 0.25rem',
                  }}
                >
                  Grade Eligibility Checkpoint:
                </p>
                <p style={{ margin: 0 }}>
                  Type-V Bungalows are strictly locked to Pay Band Level-14
                  &amp; Level-15 officers (Deans / Professors).
                </p>
              </div>
            </div>

            <DropDownList
              label="Select Approved Faculty Member *"
              data={appOptions}
              textField="text"
              valueField="id"
              value={allotmentSelectedAppId}
              onChange={v => setAllotmentSelectedAppId(v as string)}
            />

            <FormGrid columns={2}>
              <DropDownList
                label="Target Estate Block *"
                data={estateOptions}
                textField="text"
                valueField="id"
                value={allotmentHostelCode}
                onChange={v => setAllotmentHostelCode(v as string)}
              />
              <TextBox
                label="Assign Flat / Villa No. *"
                placeholder="e.g. Flat-V02"
                value={allotmentRoomNo}
                onChange={v => setAllotmentRoomNo(v)}
              />
            </FormGrid>

            <TextBox
              label="Allocation Notes / Special Orders"
              placeholder="e.g. Ground floor allotted per medical recommendation"
              value={allotmentRemarks}
              onChange={v => setAllotmentRemarks(v)}
            />

            <div className="flex justify-end">
              <Button
                label="Authorize Flat Allotment ✓"
                variant="primary"
                type="submit"
              />
            </div>
          </form>
        </FormCard>

        {/* Allotment Ledger */}
        <FormCard title="Allotted Faculty Registry" icon="table">
          <GridPanel
            data={allottedApps}
            columns={[
              { field: 'name', header: 'Faculty Member' },
              { field: 'allottedEstate', header: 'Estate Code' },
              {
                field: 'allottedFlat',
                header: 'Assigned Unit',
                cell: (
                  item: ResidentialAllocationManagement.StaffApplication
                ) => (
                  <span className="ram-flat-badge">{item.allottedFlat}</span>
                ),
              },
              {
                field: 'feeStatus',
                header: 'Ledger Status',
                cell: (
                  item: ResidentialAllocationManagement.StaffApplication
                ) => (
                  <span
                    className={`ram-badge ${item.feeStatus === 'Paid' ? 'ram-badge--paid' : 'ram-badge--unpaid'}`}
                  >
                    {item.feeStatus}
                  </span>
                ),
              },
            ]}
          />
        </FormCard>
      </div>
    </FormPage>
  );
}


