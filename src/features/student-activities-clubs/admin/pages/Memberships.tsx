import { useState, useCallback } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox, DropDownList, DatePicker } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { activitiesUrls } from '../../urls';
import { clubMembers, clubsList } from '../../data';

type MembershipData = (typeof clubMembers)[0];

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: MembershipData }
  | { mode: 'delete'; item: MembershipData };

const EMPTY_FORM = {
  studentName: '',
  enrollmentNo: '',
  club: '',
  role: 'Member',
  joinDate: '',
  status: 'Pending',
  remarks: '',
};

const clubOptions = clubsList.map(c => ({ name: c.name, value: c.name }));

const roleOptions = [
  { name: 'Member', value: 'Member' },
  { name: 'Coordinator', value: 'Coordinator' },
  { name: 'President', value: 'President' },
  { name: 'Secretary', value: 'Secretary' },
];

export default function Memberships() {
  const [data, setData] = useState<MembershipData[]>(clubMembers);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState(EMPTY_FORM);

  const closePopup = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY_FORM);
  }, []);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setPopup({ mode: 'create' });
  };

  const openEdit = (item: MembershipData) => {
    setForm({
      studentName: item.studentName,
      enrollmentNo: item.enrollmentNo,
      club: item.club,
      role: item.role,
      joinDate: item.joinDate,
      status: item.status,
      remarks: item.remarks || '',
    });
    setPopup({ mode: 'edit', item });
  };

  const openDelete = (item: MembershipData) => {
    setPopup({ mode: 'delete', item });
  };

  const handleSave = () => {
    if (
      !form.studentName ||
      !form.enrollmentNo ||
      !form.club ||
      !form.role ||
      !form.joinDate ||
      !form.status
    ) {
      ToastService.error('Please fill in all required fields.');
      return;
    }

    if (popup.mode === 'create') {
      const newItem: MembershipData = {
        id: Date.now(),
        ...form,
      };
      setData(prev => [...prev, newItem]);
      ToastService.success('Membership added successfully.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(m => (m.id === popup.item.id ? { ...m, ...form } : m))
      );
      ToastService.success('Membership updated successfully.');
    }
    closePopup();
  };

  const handleDelete = () => {
    if (popup.mode === 'delete') {
      setData(prev => prev.filter(m => m.id !== popup.item.id));
      ToastService.success('Membership removed successfully.');
    }
    closePopup();
  };

  return (
    <FormPage
      title="Club Join Approvals"
      description="Track student memberships and roles across all clubs."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Student Activities & Clubs', to: activitiesUrls.portal },
        { label: 'Admin Portal', to: activitiesUrls.admin.portal },
        { label: 'Club Join Approvals' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search memberships..."
          toolbar={
            <Button
              label="Add Membership"
              icon="plus"
              variant="primary"
              onClick={openCreate}
            />
          }
          columns={[
            { field: 'enrollmentNo', header: 'Enrollment No' },
            { field: 'studentName', header: 'Student Name' },
            { field: 'club', header: 'Club' },
            { field: 'role', header: 'Role' },
            { field: 'joinDate', header: 'Join Date' },
            {
              header: 'Status',
              cell: (item: MembershipData) => {
                let colorClass = '';
                if (item.status === 'Approved')
                  colorClass = 'bg-green-100 text-green-700';
                else if (item.status === 'Rejected')
                  colorClass = 'bg-red-100 text-red-700';
                else if (item.status === 'Pending')
                  colorClass = 'bg-yellow-100 text-yellow-700';
                else colorClass = 'bg-gray-100 text-gray-700';
                return (
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}
                  >
                    {item.status}
                  </span>
                );
              },
            },
            {
              header: 'Actions',
              width: '120px',
              cell: (item: MembershipData) => (
                <div className="flex gap-1">
                  <Button
                    icon="pencil"
                    variant="text"
                    size="small"
                    onClick={() => openEdit(item)}
                    tooltip="Edit Details"
                  />
                  <Button
                    icon="trash"
                    variant="text"
                    className="text-red-500"
                    size="small"
                    onClick={() => openDelete(item)}
                    tooltip="Remove Member"
                  />
                </div>
              ),
            },
          ]}
        />
      </FormCard>

      {(popup.mode === 'create' || popup.mode === 'edit') && (
        <FormPopup
          visible
          onHide={closePopup}
          title={
            popup.mode === 'create'
              ? 'Add Membership'
              : 'Review Membership Request'
          }
          subtitle={
            popup.mode === 'create'
              ? 'Fill in the new membership details.'
              : "Update the status and remarks for this student's club membership."
          }
          size="lg"
        >
          <FormGrid columns={2}>
            <TextBox
              label="Student Name"
              placeholder="e.g. Amit Kumar"
              value={form.studentName}
              onChange={v => setForm(f => ({ ...f, studentName: v }))}
              required
              disabled={popup.mode === 'edit'}
            />
            <TextBox
              label="Enrollment No"
              placeholder="e.g. EN2024001"
              value={form.enrollmentNo}
              onChange={v => setForm(f => ({ ...f, enrollmentNo: v }))}
              required
              disabled={popup.mode === 'edit'}
            />
            <DropDownList
              label="Club"
              data={clubOptions}
              textField="name"
              optionValue="value"
              value={form.club}
              onChange={v => setForm(f => ({ ...f, club: String(v ?? '') }))}
              required
              disabled={popup.mode === 'edit'}
            />
            <DropDownList
              label="Role"
              data={roleOptions}
              textField="name"
              optionValue="value"
              value={form.role}
              onChange={v => setForm(f => ({ ...f, role: String(v ?? '') }))}
              required
              disabled={popup.mode === 'edit'}
            />
            <DatePicker
              label="Join Date"
              value={form.joinDate ? new Date(form.joinDate) : undefined}
              onChange={(v: Date | null | undefined) => {
                const str = v ? v.toLocaleDateString('en-CA') : '';
                setForm(f => ({ ...f, joinDate: str }));
              }}
              required
              disabled={popup.mode === 'edit'}
            />
            <DropDownList
              label="Status"
              value={form.status}
              onChange={val => setForm(f => ({ ...f, status: String(val) }))}
              data={[
                { label: 'Pending', value: 'Pending' },
                { label: 'Approved', value: 'Approved' },
                { label: 'Rejected', value: 'Rejected' },
              ]}
              textField="label"
              optionValue="value"
              required
            />
            {popup.mode === 'edit' && (
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks (Optional)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  rows={3}
                  value={form.remarks}
                  onChange={e =>
                    setForm(f => ({ ...f, remarks: e.target.value }))
                  }
                  placeholder="Enter any remarks..."
                />
              </div>
            )}
          </FormGrid>
          <div className="flex justify-end gap-3 mt-8 border-t border-gray-200 pt-5">
            <Button label="Cancel" variant="outlined" onClick={closePopup} />
            <Button
              label={popup.mode === 'create' ? 'Save' : 'Save Status'}
              variant="primary"
              onClick={handleSave}
            />
          </div>
        </FormPopup>
      )}

      {popup.mode === 'delete' && (
        <FormPopup
          visible
          onHide={closePopup}
          title="Remove Membership"
          subtitle="Are you sure you want to remove this member?"
        >
          <p className="text-gray-600 mb-6 text-sm">
            This action will remove <strong>{popup.item.studentName}</strong>{' '}
            from the <strong>{popup.item.club}</strong>.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={closePopup} />
            <Button label="Remove" variant="danger" onClick={handleDelete} />
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
