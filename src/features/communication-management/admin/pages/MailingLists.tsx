import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { NumberBox, TextArea, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { ToastService } from 'services';
import type { MailingList } from '../../mocks';
import {
  useCreateMailingListMutation,
  useMailingListsQuery,
} from '../../queries';
import { commUrls } from '../../urls';

export default function MailingLists() {
  const { data: lists, isLoading } = useMailingListsQuery();
  const createMutation = useCreateMailingListMutation();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [memberCount, setMemberCount] = useState<number>(0);

  const resetForm = () => {
    setName('');
    setDescription('');
    setMemberCount(0);
  };

  const handleOpen = () => {
    resetForm();
    setOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      ToastService.error('Please enter a mailing list name.');
      return;
    }
    try {
      await createMutation.mutateAsync({ name, description, memberCount });
      ToastService.success('Mailing list created successfully.');
      setOpen(false);
    } catch {
      ToastService.error('Failed to save the mailing list.');
    }
  };

  return (
    <FormPage
      title="Mailing Lists"
      description="Maintain named email distribution lists."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Communication Management', to: commUrls.portal },
        { label: 'Communication Admin', to: commUrls.admin.portal },
        { label: 'Mailing Lists' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={lists}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search by list name..."
          toolbar={
            <Button
              label="New Mailing List"
              icon="plus"
              variant="outlined"
              onClick={handleOpen}
            />
          }
          columns={[
            {
              header: 'S.No',
              width: '60px',
              cell: (_, o) => <span>{o.rowIndex + 1}</span>,
            },
            { field: 'name', header: 'List Address', sortable: true },
            { field: 'description', header: 'Description' },
            {
              header: 'Subscribers',
              cell: (l: MailingList) => (
                <span>{l.memberCount.toLocaleString('en-IN')}</span>
              ),
            },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={open}
        onHide={() => setOpen(false)}
        title="New Mailing List"
        subtitle="Create a named email distribution list."
        size="lg"
      >
        <div className="flex flex-col gap-4 py-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextBox
              label="List Address"
              placeholder="e.g. events@univ.edu"
              value={name}
              onChange={setName}
              required
            />
            <NumberBox
              label="Subscriber Count"
              value={memberCount}
              onChange={val => setMemberCount(Number(val) || 0)}
              min={0}
            />
          </div>
          <TextArea
            label="Description"
            placeholder="Purpose of this mailing list"
            value={description}
            onChange={setDescription}
            rows={3}
          />

          <div className="mt-2 flex justify-end gap-2">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setOpen(false)}
            />
            <Button
              label="Save"
              variant="primary"
              isLoading={createMutation.isPending}
              onClick={handleSave}
            />
          </div>
        </div>
      </FormPopup>
    </FormPage>
  );
}
