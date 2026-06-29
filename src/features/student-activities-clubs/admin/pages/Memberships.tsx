import { useState, useCallback } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox, DropDownList } from 'shared/components/forms';
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
      !form.joinDate
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
      title="Memberships Management"
      description="Track student memberships and roles across all clubs."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Student Activities & Clubs', to: activitiesUrls.portal },
        { label: 'Admin Portal', to: activitiesUrls.admin.portal },
        { label: 'Memberships' },
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
              header: 'Actions',
              width: '120px',
              cell: (item: MembershipData) => (
                <div className="flex gap-1">
                  <Button
                    icon="pencil"
                    variant="text"
                    size="small"
                    onClick={() => openEdit(item)}
                  />
                  <Button
                    icon="trash"
                    variant="text"
                    className="text-red-500"
                    size="small"
                    onClick={() => openDelete(item)}
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
          title={popup.mode === 'create' ? 'Add Membership' : 'Edit Membership'}
          subtitle="Fill in the membership details."
          size="lg"
        >
          <FormGrid columns={2}>
            <TextBox
              label="Enrollment No"
              placeholder="e.g. EN2024001"
              value={form.enrollmentNo}
              onChange={v => setForm(f => ({ ...f, enrollmentNo: v }))}
              required
            />
            <TextBox
              label="Student Name"
              placeholder="e.g. Amit Kumar"
              value={form.studentName}
              onChange={v => setForm(f => ({ ...f, studentName: v }))}
              required
            />
            <DropDownList
              label="Club"
              data={clubOptions}
              textField="name"
              optionValue="value"
              value={form.club}
              onChange={v => setForm(f => ({ ...f, club: String(v ?? '') }))}
              required
            />
            <DropDownList
              label="Role"
              data={roleOptions}
              textField="name"
              optionValue="value"
              value={form.role}
              onChange={v => setForm(f => ({ ...f, role: String(v ?? '') }))}
              required
            />
            <TextBox
              label="Join Date"
              type="date"
              value={form.joinDate}
              onChange={v => setForm(f => ({ ...f, joinDate: v }))}
              required
            />
          </FormGrid>
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={closePopup} />
            <Button label="Save" variant="primary" onClick={handleSave} />
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
