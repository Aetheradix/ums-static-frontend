import React, { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage, GridPanel } from 'shared/new-components';
import '../residential.css';
import { useResidentialAllocation } from '../context';
import { RESIDENTIAL_ALLOCATION_URLS } from '../urls';

const ACCOMMODATION_TYPE_OPTIONS: Data.DataItem<string>[] = [
  { id: 'Type-V', text: 'Type-V Bungalow' },
  { id: 'Type-IV', text: 'Type-IV Flat' },
  { id: 'Type-III', text: 'Type-III Flat' },
  { id: 'Type-II', text: 'Type-II Unit' },
];

export default function EstateRegistry() {
  const { estates, setEstates, triggerNotification } =
    useResidentialAllocation();

  const [estateSearch, setEstateSearch] = useState('');
  const [estateFilterType, setEstateFilterType] = useState('All');

  const [estForm, setEstForm] = useState({
    name: '',
    type: 'Type-IV',
    targetStaff: 'Associate Professors / Deputy Registrars',
    payLevelEligible: 'Level-12 to Level-13A',
    district: 'Bhopal',
    city: 'Bhopal',
    address: '',
    pincode: '',
    floors: 3,
    flatsCount: 12,
    wardenName: '',
    wardenMobile: '',
    wardenEmail: '',
    securityDeposit: 15000,
    hraDeduction: 12000,
    maintenanceFee: 2500,
    waterCharges: 400,
    status: 'Active',
    synopsis: '',
  });

  const handleEstateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!estForm.name || !estForm.address || !estForm.pincode) {
      triggerNotification('Please fill in all mandatory fields.', 'error');
      return;
    }
    const generatedCode = `EST-${String(estates.length + 1).padStart(3, '0')}`;
    const newEstate: ResidentialAllocationManagement.Estate = {
      ...estForm,
      code: generatedCode,
      floors: Number(estForm.floors) || 0,
      flatsCount: Number(estForm.flatsCount) || 0,
      occupancy: 0,
      available: Number(estForm.flatsCount) || 0,
      securityDeposit: Number(estForm.securityDeposit) || 0,
      hraDeduction: Number(estForm.hraDeduction) || 0,
      maintenanceFee: Number(estForm.maintenanceFee) || 0,
      waterCharges: Number(estForm.waterCharges) || 0,
    };
    setEstates([...estates, newEstate]);
    triggerNotification(
      `Estate Block Successfully Registered! Assigned Code: ${generatedCode}`
    );
    setEstForm({
      name: '',
      type: 'Type-IV',
      targetStaff: '',
      payLevelEligible: '',
      district: 'Bhopal',
      city: 'Bhopal',
      address: '',
      pincode: '',
      floors: 3,
      flatsCount: 12,
      wardenName: '',
      wardenMobile: '',
      wardenEmail: '',
      securityDeposit: 15000,
      hraDeduction: 12000,
      maintenanceFee: 2500,
      waterCharges: 400,
      status: 'Active',
      synopsis: '',
    });
  };

  const filteredEstates = estates
    .filter(h => h.name.toLowerCase().includes(estateSearch.toLowerCase()))
    .filter(h => estateFilterType === 'All' || h.type === estateFilterType);

  return (
    <FormPage
      title="Campus Housing & Block Registry"
      description="Configure new enclaves, pay level metrics, HRA deduction tiers, and warden supervision details"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Residential Allocation',
          to: RESIDENTIAL_ALLOCATION_URLS.dashboard,
        },
        { label: 'Estate Registry' },
      ]}
    >
      <div className="space-y-8">
        {/* Registry Form */}
        <FormCard title="New Estate Block Form" icon="building">
          <form onSubmit={handleEstateSubmit} className="space-y-6">
            <div>
              <p className="ram-section-heading">A. Block Specifications</p>
              <FormGrid columns={3}>
                <TextBox
                  label="Estate Quarter Name *"
                  placeholder="e.g. Aryabhata Block (Type-V)"
                  value={estForm.name}
                  onChange={v => setEstForm({ ...estForm, name: v })}
                />
                <DropDownList
                  label="Accommodation Type *"
                  data={ACCOMMODATION_TYPE_OPTIONS}
                  textField="text"
                  valueField="id"
                  value={estForm.type}
                  onChange={v => setEstForm({ ...estForm, type: v as string })}
                />
                <TextBox
                  label="Eligible Pay Matrix Scale *"
                  placeholder="e.g. Level-14 to Level-15"
                  value={estForm.payLevelEligible}
                  onChange={v =>
                    setEstForm({ ...estForm, payLevelEligible: v })
                  }
                />
                <TextBox
                  label="Total Units (Capacity) *"
                  placeholder="e.g. 20"
                  value={String(estForm.flatsCount)}
                  onChange={v =>
                    setEstForm({ ...estForm, flatsCount: Number(v) })
                  }
                />
                <TextBox
                  label="Physical Address *"
                  placeholder="e.g. STU Campus, North Wing"
                  value={estForm.address}
                  onChange={v => setEstForm({ ...estForm, address: v })}
                />
                <TextBox
                  label="Pincode *"
                  placeholder="462033"
                  value={estForm.pincode}
                  onChange={v => setEstForm({ ...estForm, pincode: v })}
                />
              </FormGrid>
            </div>

            <div>
              <p className="ram-section-heading">
                B. Financial Ledger & HRA Configuration (INR)
              </p>
              <FormGrid columns={4}>
                <TextBox
                  label="Refundable Security Deposit"
                  placeholder="15000"
                  value={String(estForm.securityDeposit)}
                  onChange={v =>
                    setEstForm({ ...estForm, securityDeposit: Number(v) })
                  }
                />
                <TextBox
                  label="Monthly HRA Deduction"
                  placeholder="12000"
                  value={String(estForm.hraDeduction)}
                  onChange={v =>
                    setEstForm({ ...estForm, hraDeduction: Number(v) })
                  }
                />
                <TextBox
                  label="Maintenance Charges"
                  placeholder="2500"
                  value={String(estForm.maintenanceFee)}
                  onChange={v =>
                    setEstForm({ ...estForm, maintenanceFee: Number(v) })
                  }
                />
                <TextBox
                  label="Fixed Water Charges"
                  placeholder="400"
                  value={String(estForm.waterCharges)}
                  onChange={v =>
                    setEstForm({ ...estForm, waterCharges: Number(v) })
                  }
                />
              </FormGrid>
            </div>

            <div>
              <p className="ram-section-heading">
                C. Estate Administration Contact Details
              </p>
              <FormGrid columns={3}>
                <TextBox
                  label="Estate Warden Name"
                  placeholder="Dr. Suresh Gupta"
                  value={estForm.wardenName}
                  onChange={v => setEstForm({ ...estForm, wardenName: v })}
                />
                <TextBox
                  label="Warden Contact Number"
                  placeholder="10-digit number"
                  value={estForm.wardenMobile}
                  onChange={v => setEstForm({ ...estForm, wardenMobile: v })}
                />
                <TextBox
                  label="Warden Email Address"
                  placeholder="warden.estate@stu.ac.in"
                  value={estForm.wardenEmail}
                  onChange={v => setEstForm({ ...estForm, wardenEmail: v })}
                />
              </FormGrid>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button
                label="Establish Estate Block Registry ✓"
                variant="primary"
                type="submit"
              />
            </div>
          </form>
        </FormCard>

        {/* Database List */}
        <FormCard title="Active Campus Estates Database" icon="table">
          <div className="ram-toolbar">
            <div className="ram-search-wrapper">
              <i className="pi pi-search" />
              <input
                type="text"
                placeholder="Search Estate Name..."
                value={estateSearch}
                onChange={e => setEstateSearch(e.target.value)}
                className="ram-search-input"
              />
            </div>
            <select
              value={estateFilterType}
              onChange={e => setEstateFilterType(e.target.value)}
              className="ram-select-filter"
            >
              <option value="All">All Tiers</option>
              <option value="Type-V">Type-V Bungalow</option>
              <option value="Type-IV">Type-IV Flat</option>
              <option value="Type-III">Type-III Flat</option>
            </select>
          </div>

          <GridPanel
            data={filteredEstates}
            columns={[
              { field: 'code', header: 'Block Code' },
              { field: 'name', header: 'Estate Details' },
              { field: 'payLevelEligible', header: 'Eligible Pay Band' },
              {
                field: 'occupancy',
                header: 'Flat Occupancy',
                cell: (item: ResidentialAllocationManagement.Estate) => (
                  <span className="text-xs">
                    <strong className="text-indigo-700">
                      {item.occupancy}
                    </strong>{' '}
                    / {item.flatsCount} (Avail: {item.available})
                  </span>
                ),
              },
              {
                field: 'hraDeduction',
                header: 'HRA Deduction',
                cell: (item: ResidentialAllocationManagement.Estate) => (
                  <span className="ram-flat-badge">
                    Rs.{item.hraDeduction.toLocaleString()} / mo
                  </span>
                ),
              },
              { field: 'wardenName', header: 'Warden Contact' },
            ]}
          />
        </FormCard>
      </div>
    </FormPage>
  );
}


