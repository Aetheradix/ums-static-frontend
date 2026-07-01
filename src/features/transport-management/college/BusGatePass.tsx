import { useState } from 'react';
import {
  FormActions,
  FormPage,
  FormCard,
  FormGrid,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { DatePicker, DropDownList } from 'shared/components/forms';

const entryTypes = [
  { name: 'Entry', value: 'entry' },
  { name: 'Exit', value: 'exit' },
];

const vehicles = [
  { name: 'MP08ST9898', value: 'v1' },
  { name: 'MP04AB1234', value: 'v2' },
];

const busDirections = [
  { name: 'Vehicle In', value: 'in' },
  { name: 'Vehicle Out', value: 'out' },
];

export default function BusGatePass() {
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({
    date: undefined,
    entryType: '',
    vehicleNumber: '',
    busDirection: '',
  });

  const [isSearched, setIsSearched] = useState(false);

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    if (isAdding) {
      if (form.vehicleNumber && form.busDirection) {
        setIsSearched(true);
      }
    } else {
      if (form.date && form.entryType) {
        setIsSearched(true);
      }
    }
  };

  const handleClear = () => {
    if (isAdding) {
      setForm(prev => ({ ...prev, vehicleNumber: '', busDirection: '' }));
    } else {
      setForm(prev => ({ ...prev, date: undefined, entryType: '' }));
    }
    setIsSearched(false);
  };

  if (isAdding) {
    return (
      <FormPage
        title="Bus Gate Pass Process Detail"
        description="Gate keeper will record the entry and exit of buses through this page."
        breadcrumbs={[
          { label: 'Home', to: '/home' },
          { label: 'Transport Management', to: '/transport-management' },
          {
            label: 'College Login',
            to: '/transport-management/college-login/dashboard',
          },
          { label: 'Add Bus Gate Pass' },
        ]}
      >
        <FormCard title="Bus Gate Pass">
          <FormGrid columns={2}>
            <DropDownList
              label="Vehicle Number"
              data={vehicles}
              textField="name"
              optionValue="value"
              value={form.vehicleNumber}
              onChange={v => handleChange('vehicleNumber', String(v))}
              placeholder="--Select--"
              required
            />
            <DropDownList
              label="Bus(In/Out)"
              data={busDirections}
              textField="name"
              optionValue="value"
              value={form.busDirection}
              onChange={v => handleChange('busDirection', String(v))}
              placeholder="--Select--"
              required
            />
          </FormGrid>

          <div className="mt-4 border-t border-gray-200 pt-4">
            <FormActions
              align="left"
              saveLabel="Search"
              onSave={handleSearch}
              onReset={handleClear}
            />
          </div>
        </FormCard>

        <FormCard title="Bus Gate Pass Details" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>Records per page:</span>
              <select className="border border-gray-300 rounded p-1 outline-none">
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <Button
                label="Export To Excel"
                variant="outlined"
                icon="file-excel"
                className="!py-1.5"
              />
              <div className="relative">
                <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-md outline-none focus:border-blue-500 text-sm w-64"
                />
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-md overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[1000px]">
              <thead className="bg-[#f48b50] text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold text-center whitespace-nowrap">
                    Sr.No.
                  </th>
                  <th className="px-4 py-3 font-semibold text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      Vehicle No.{' '}
                      <i className="pi pi-filter text-[10px] opacity-70"></i>
                    </div>
                  </th>
                  <th className="px-4 py-3 font-semibold text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      Challan No.{' '}
                      <i className="pi pi-filter text-[10px] opacity-70"></i>
                    </div>
                  </th>
                  <th className="px-4 py-3 font-semibold text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      Route No{' '}
                      <i className="pi pi-filter text-[10px] opacity-70"></i>
                    </div>
                  </th>
                  <th className="px-4 py-3 font-semibold text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      Driver Name{' '}
                      <i className="pi pi-filter text-[10px] opacity-70"></i>
                    </div>
                  </th>
                  <th className="px-4 py-3 font-semibold text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      Driver Mobile No.{' '}
                      <i className="pi pi-filter text-[10px] opacity-70"></i>
                    </div>
                  </th>
                  <th className="px-4 py-3 font-semibold text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      Driver Licence No.{' '}
                      <i className="pi pi-filter text-[10px] opacity-70"></i>
                    </div>
                  </th>
                  <th className="px-4 py-3 font-semibold text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      Date And Time{' '}
                      <i className="pi pi-filter text-[10px] opacity-70"></i>
                    </div>
                  </th>
                  <th className="px-4 py-3 font-semibold text-center whitespace-nowrap">
                    Save And Print
                  </th>
                </tr>
              </thead>
              <tbody>
                {!isSearched ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-8 text-center text-gray-400 bg-white border-b border-gray-100"
                    >
                      No data
                    </td>
                  </tr>
                ) : (
                  <tr className="border-b border-gray-100 hover:bg-gray-50 bg-white">
                    <td className="px-4 py-3 text-center">1</td>
                    <td className="px-4 py-3 text-center font-medium">
                      MP08ST9898
                    </td>
                    <td className="px-4 py-3 text-center">CH-10023</td>
                    <td className="px-4 py-3 text-center">Route-5</td>
                    <td className="px-4 py-3 text-center">Ramesh Kumar</td>
                    <td className="px-4 py-3 text-center">9876543210</td>
                    <td className="px-4 py-3 text-center">DL-MP04-2015</td>
                    <td className="px-4 py-3 text-center text-blue-600">
                      29/06/2026 08:30 AM
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        label="Save & Print"
                        variant="success"
                        size="small"
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </FormCard>
      </FormPage>
    );
  }

  return (
    <FormPage
      title="Bus Gate Pass Process Detail"
      description="Gate keeper will record the entry and exit of buses through this page."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        {
          label: 'College Login',
          to: '/transport-management/college-login/dashboard',
        },
        { label: 'Bus Gate Pass Process Detail' },
      ]}
      headerAction={
        <Button
          label="Add Gate Pass"
          variant="primary"
          icon="plus"
          onClick={() => setIsAdding(true)}
        />
      }
    >
      <FormCard title="Gate Pass Details">
        <FormGrid columns={2}>
          <DatePicker
            label="Date"
            placeholder="dd/mm/yyyy"
            value={form.date}
            onChange={v => handleChange('date', v)}
            required
          />
          <DropDownList
            label="Entry Type"
            data={entryTypes}
            textField="name"
            optionValue="value"
            value={form.entryType}
            onChange={v => handleChange('entryType', String(v))}
            placeholder="--Select--"
            required
          />
        </FormGrid>

        <div className="mt-4 border-t border-gray-200 pt-4">
          <FormActions align="left" saveLabel="Search" onReset={handleClear} />
        </div>
      </FormCard>

      {isSearched && (
        <FormCard title="Search Results" className="mt-6">
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
                <tr>
                  <th className="px-4 py-3 font-semibold text-center w-16">
                    S.No.
                  </th>
                  <th className="px-4 py-3 font-semibold text-center">
                    Bus Number
                  </th>
                  <th className="px-4 py-3 font-semibold text-center">
                    Route No.
                  </th>
                  <th className="px-4 py-3 font-semibold text-center">
                    Driver Name
                  </th>
                  <th className="px-4 py-3 font-semibold text-center">Time</th>
                  <th className="px-4 py-3 font-semibold text-center">
                    Remarks
                  </th>
                  <th className="px-4 py-3 font-semibold text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-center">1</td>
                  <td className="px-4 py-3 text-center font-medium">
                    MP-04-AB-1234
                  </td>
                  <td className="px-4 py-3 text-center">
                    Route 1 (City Center)
                  </td>
                  <td className="px-4 py-3 text-center">Ramesh Kumar</td>
                  <td className="px-4 py-3 text-center text-blue-600 font-medium">
                    08:15 AM
                  </td>
                  <td className="px-4 py-3 text-center text-gray-500">
                    On Time
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex gap-2 justify-center">
                      <Button
                        icon="pencil"
                        variant="outlined"
                        size="small"
                        ariaLabel="Edit"
                      />
                      <Button
                        icon="trash"
                        variant="danger"
                        size="small"
                        ariaLabel="Delete"
                      />
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-center">2</td>
                  <td className="px-4 py-3 text-center font-medium">
                    MP-04-XY-9876
                  </td>
                  <td className="px-4 py-3 text-center">
                    Route 2 (South Zone)
                  </td>
                  <td className="px-4 py-3 text-center">Suresh Singh</td>
                  <td className="px-4 py-3 text-center text-blue-600 font-medium">
                    08:25 AM
                  </td>
                  <td className="px-4 py-3 text-center text-gray-500 text-red-500">
                    Delayed 10 mins
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex gap-2 justify-center">
                      <Button
                        icon="pencil"
                        variant="outlined"
                        size="small"
                        ariaLabel="Edit"
                      />
                      <Button
                        icon="trash"
                        variant="danger"
                        size="small"
                        ariaLabel="Delete"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </FormCard>
      )}
    </FormPage>
  );
}
