import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import {
  DropDownList,
  NumberBox,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { ToastService } from 'services';
import type { AudienceType, Group } from '../../mocks';
import { useCreateGroupMutation, useGroupsQuery } from '../../queries';
import { commUrls } from '../../urls';

const TYPE_OPTIONS = [
  { name: 'Employee', value: 'Employee' },
  { name: 'Student', value: 'Student' },
];

export default function Groups() {
  const { data: groups, isLoading } = useGroupsQuery();
  const createMutation = useCreateGroupMutation();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<AudienceType>('Employee');
  const [description, setDescription] = useState('');
  const [memberCount, setMemberCount] = useState<number>(0);

  const resetForm = () => {
    setName('');
    setType('Employee');
    setDescription('');
    setMemberCount(0);
  };

  const handleOpen = () => {
    resetForm();
    setOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      ToastService.error('Please enter a group name.');
      return;
    }
    try {
      await createMutation.mutateAsync({
        name,
        type,
        description,
        memberCount,
      });
      ToastService.success('Group created successfully.');
      setOpen(false);
    } catch {
      ToastService.error('Failed to save the group.');
    }
  };

  return (
    <FormPage
      title="Groups"
      description="Create and manage employee and student recipient groups."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Communication Management', to: commUrls.portal },
        { label: 'Communication Admin', to: commUrls.admin.portal },
        { label: 'Groups' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={groups}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search by group name..."
          toolbar={
            <Button
              label="New Group"
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
            { field: 'name', header: 'Group Name', sortable: true },
            {
              header: 'Type',
              cell: (g: Group) => (
                <StatusBadge
                  label={g.type}
                  variant={g.type === 'Employee' ? 'info' : 'success'}
                />
              ),
            },
            { field: 'description', header: 'Description' },
            {
              header: 'Members',
              cell: (g: Group) => (
                <span>{g.memberCount.toLocaleString('en-IN')}</span>
              ),
            },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={open}
        onHide={() => setOpen(false)}
        title="New Group"
        subtitle="Define a reusable recipient group."
        size="lg"
      >
        <div className="flex flex-col gap-4 py-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextBox
              label="Group Name"
              placeholder="e.g. Final Year Students"
              value={name}
              onChange={setName}
              required
            />
            <DropDownList
              label="Type"
              data={TYPE_OPTIONS}
              textField="name"
              valueField="value"
              value={type}
              onChange={val => setType(val as AudienceType)}
            />
            <NumberBox
              label="Member Count"
              value={memberCount}
              onChange={val => setMemberCount(Number(val) || 0)}
              min={0}
            />
          </div>
          <TextArea
            label="Description"
            placeholder="What this group is used for"
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
