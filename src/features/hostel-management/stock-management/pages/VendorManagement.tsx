import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function VendorManagement() {
  const { vendors, setVendors, triggerNotification } = useHostel();

  const [vendorName, setVendorName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [categories, setCategories] = useState('');

  const [isEditing, setIsEditing] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!vendorName || !contactPerson || !contactNumber) {
      triggerNotification('Please fill all mandatory fields', 'error');
      return;
    }

    const catsArray = categories
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);

    if (isEditing) {
      setVendors(prev =>
        prev.map(v =>
          v.id === isEditing
            ? {
                ...v,
                vendorName,
                contactPerson,
                contactNumber,
                email,
                address,
                categoriesSupplied: catsArray,
              }
            : v
        )
      );
      triggerNotification('Vendor updated successfully.', 'success');
      setIsEditing(null);
    } else {
      const newVendor: HostelManagement.Vendor = {
        id: `V-${Date.now()}`,
        vendorName,
        contactPerson,
        contactNumber,
        email,
        address,
        categoriesSupplied: catsArray,
        status: 'ACTIVE',
      };
      setVendors([...vendors, newVendor]);
      triggerNotification('Vendor registered successfully.', 'success');
    }

    setVendorName('');
    setContactPerson('');
    setContactNumber('');
    setEmail('');
    setAddress('');
    setCategories('');
  };

  const handleEdit = (vendor: HostelManagement.Vendor) => {
    setIsEditing(vendor.id);
    setVendorName(vendor.vendorName);
    setContactPerson(vendor.contactPerson);
    setContactNumber(vendor.contactNumber);
    setEmail(vendor.email);
    setAddress(vendor.address);
    setCategories(vendor.categoriesSupplied.join(', '));
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    setVendors(prev =>
      prev.map(v =>
        v.id === id
          ? {
              ...v,
              status: currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
            }
          : v
      )
    );
    triggerNotification('Vendor status updated.', 'success');
  };

  return (
    <FormPage
      title="Vendor Management"
      description="Register and manage vendors who supply goods and services to the hostel."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Stock & Inventory',
          to: '/hostel-management/stock/procurement',
        },
        { label: 'Vendors' },
      ]}
    >
      <FormCard
        title={isEditing ? 'Edit Vendor' : 'Register New Vendor'}
        icon="storefront"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Vendor/Company Name *"
            value={vendorName}
            onChange={setVendorName}
          />
          <TextBox
            label="Contact Person *"
            value={contactPerson}
            onChange={setContactPerson}
          />

          <TextBox
            label="Contact Number *"
            value={contactNumber}
            onChange={setContactNumber}
          />
          <TextBox
            label="Email Address"
            type="email"
            value={email}
            onChange={setEmail}
          />

          <div className="col-span-2">
            <TextBox label="Address" value={address} onChange={setAddress} />
          </div>

          <div className="col-span-2">
            <TextBox
              label="Categories Supplied"
              value={categories}
              onChange={setCategories}
              placeholder="e.g. Electrical, Plumbing, Furniture (Comma separated)"
            />
          </div>
        </FormGrid>

        <div className="flex gap-3 mt-4">
          <Button
            label={isEditing ? 'Update Vendor' : 'Register Vendor'}
            variant="primary"
            onClick={handleSubmit}
          />
          {isEditing && (
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => {
                setIsEditing(null);
                setVendorName('');
                setContactPerson('');
                setContactNumber('');
                setEmail('');
                setAddress('');
                setCategories('');
              }}
            />
          )}
        </div>
      </FormCard>

      <div className="mt-8">
        <FormCard title="Registered Vendors" icon="view_list">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                  <th className="p-2">Vendor Name</th>
                  <th className="p-2">Contact Person</th>
                  <th className="p-2">Contact</th>
                  <th className="p-2">Categories</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-slate-500">
                      No vendors registered yet.
                    </td>
                  </tr>
                )}
                {vendors.map(vendor => (
                  <tr
                    key={vendor.id}
                    className="border-b border-slate-200 dark:border-slate-700"
                  >
                    <td className="p-2 font-medium">{vendor.vendorName}</td>
                    <td className="p-2">{vendor.contactPerson}</td>
                    <td className="p-2">
                      <div>{vendor.contactNumber}</div>
                      <div className="text-xs text-slate-500">
                        {vendor.email}
                      </div>
                    </td>
                    <td className="p-2 text-xs">
                      {vendor.categoriesSupplied.map(c => (
                        <span
                          key={c}
                          className="inline-block bg-slate-100 dark:bg-slate-700 rounded px-1 py-0.5 mr-1 mb-1"
                        >
                          {c}
                        </span>
                      ))}
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          vendor.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {vendor.status}
                      </span>
                    </td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Button
                          label="Edit"
                          variant="outlined"
                          onClick={() => handleEdit(vendor)}
                        />
                        <Button
                          label={
                            vendor.status === 'ACTIVE'
                              ? 'Deactivate'
                              : 'Activate'
                          }
                          variant="outlined"
                          onClick={() =>
                            handleToggleStatus(vendor.id, vendor.status)
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
