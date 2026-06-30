import { useState, useEffect } from 'react';
import {
  FormPage,
  FormCard,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { TextBox, TextArea } from 'shared/components/forms';
import { Modal } from 'shared/components/popups';
import { ToastService } from 'services';
import { NotificationSeedService, type SeedNotification } from '../../seed';
import { admissionsUrls } from '../../urls';

const emptyNotif = (): Omit<SeedNotification, 'id'> => ({
  title: '',
  description: '',
  fileUrl: '',
  status: 'Draft',
  featured: false,
  publishedAt: new Date().toISOString().slice(0, 10),
});

export default function NotificationList() {
  const [notifications, setNotifications] = useState<SeedNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Omit<SeedNotification, 'id'>>(emptyNotif());

  const load = async () => {
    setLoading(true);
    const data = await NotificationSeedService.getAll();
    setNotifications(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async () => {
    await NotificationSeedService.add(form);
    ToastService.success('Notification added');
    setShowModal(false);
    setForm(emptyNotif());
    load();
  };

  const handleToggleStatus = async (n: SeedNotification) => {
    await NotificationSeedService.update(n.id, {
      status: n.status === 'Published' ? 'Draft' : 'Published',
    });
    ToastService.success('Status updated');
    load();
  };

  const handleToggleFeatured = async (n: SeedNotification) => {
    await NotificationSeedService.update(n.id, { featured: !n.featured });
    ToastService.success('Featured status updated');
    load();
  };

  const handleDelete = async (id: string) => {
    await NotificationSeedService.delete(id);
    ToastService.success('Notification deleted');
    load();
  };

  return (
    <FormPage
      title="Notifications & Public Notices"
      description="Manage public notices and announcements shown on the admission portal."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Admissions Management', to: admissionsUrls.root },
        { label: 'Admin Portal', to: admissionsUrls.admin.root },
        { label: 'Notifications' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={notifications}
          loading={loading}
          searchBox
          toolbar={
            <Button
              label="Add Notice"
              icon="pi pi-plus"
              variant="primary"
              className="ml-auto"
              onClick={() => {
                setForm(emptyNotif());
                setShowModal(true);
              }}
            />
          }
          columns={[
            {
              cell: (_, opt) => <span>{opt.rowIndex + 1}</span>,
              width: '50px',
              header: 'S.No',
            },
            { header: 'Title', field: 'title', sortable: true },
            { header: 'Published', field: 'publishedAt', sortable: true },
            {
              header: 'Featured',
              cell: (item: SeedNotification) => (
                <Button
                  label={item.featured ? '★ Featured' : 'Mark Featured'}
                  variant={item.featured ? 'success' : 'outlined'}
                  onClick={() => handleToggleFeatured(item)}
                />
              ),
            },
            {
              header: 'Status',
              cell: (item: SeedNotification) => (
                <StatusBadge
                  label={item.status}
                  variant={item.status === 'Published' ? 'approved' : 'neutral'}
                />
              ),
            },
            {
              header: 'Actions',
              cell: (item: SeedNotification) => (
                <div className="flex gap-2">
                  <Button
                    label={
                      item.status === 'Published' ? 'Unpublish' : 'Publish'
                    }
                    variant={
                      item.status === 'Published' ? 'outlined' : 'primary'
                    }
                    onClick={() => handleToggleStatus(item)}
                  />
                  <Button
                    icon="pi pi-trash"
                    variant="text"
                    className="text-red-600"
                    onClick={() => handleDelete(item.id)}
                  />
                </div>
              ),
            },
          ]}
        />
      </FormCard>

      {showModal && (
        <Modal
          header="Add New Notice"
          visible={showModal}
          onHide={() => setShowModal(false)}
        >
          <div className="p-4 flex flex-col gap-4">
            <TextBox
              label="Title"
              value={form.title}
              onChange={v => setForm(f => ({ ...f, title: v as string }))}
            />
            <TextArea
              label="Description"
              value={form.description}
              onChange={v => setForm(f => ({ ...f, description: v as string }))}
              rows={3}
            />
            <TextBox
              label="File URL (optional)"
              value={form.fileUrl ?? ''}
              onChange={v => setForm(f => ({ ...f, fileUrl: v as string }))}
            />
            <div className="flex justify-end gap-2">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setShowModal(false)}
              />
              <Button
                label="Add Notice"
                variant="primary"
                onClick={handleAdd}
              />
            </div>
          </div>
        </Modal>
      )}
    </FormPage>
  );
}
