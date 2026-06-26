import { useState } from 'react';
import {
  FormPage,
  FormCard,
  GridPanel,
  FormPopup,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { useModerationRulesQuery } from '../../../queries';
import ModerationRuleForm from '../../../components/ModerationRuleForm';

export default function ModerationManagement() {
  const { data, isLoading } = useModerationRulesQuery();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | undefined>(undefined);

  const handleEdit = (id: number) => {
    setEditId(id);
    setShowForm(true);
  };

  const handleClose = () => {
    setEditId(undefined);
    setShowForm(false);
  };

  return (
    <FormPage
      title="Moderation Management"
      description="Configure and apply moderation rules such as grace marks and scaling."
    >
      <FormCard>
        <GridPanel
          data={data ?? []}
          loading={isLoading}
          toolbar={
            <Button
              label="New Moderation Rule"
              icon="plus"
              variant="primary"
              onClick={() => setShowForm(true)}
            />
          }
          columns={[
            { field: 'rule', header: 'Moderation Rule' },
            { field: 'type', header: 'Formula Type' },
            { field: 'target', header: 'Target Group' },
            {
              header: 'Status',
              cell: (item: Examination.ModerationRuleItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Actions',
              cell: (item: Examination.ModerationRuleItem) => (
                <Button
                  icon="pencil"
                  variant="text"
                  tooltip="Configure"
                  onClick={() => handleEdit(item.id)}
                />
              ),
            },
          ]}
        />
      </FormCard>
      <FormPopup
        visible={showForm}
        onHide={handleClose}
        title={editId ? 'Edit Moderation Rule' : 'New Moderation Rule'}
        subtitle={
          editId
            ? 'Modify configuration'
            : 'Create a moderation rule for grace marks or scaling'
        }
      >
        <ModerationRuleForm id={editId} onClose={handleClose} />
      </FormPopup>
    </FormPage>
  );
}
