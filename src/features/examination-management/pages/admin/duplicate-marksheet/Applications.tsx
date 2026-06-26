import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { useDuplicateApplicationsQuery } from '../../../queries';

export default function Applications() {
  const { data, isLoading } = useDuplicateApplicationsQuery();
  const [list, setList] = useState(data ?? []);

  const handleApprove = (id: number) => {
    setList(prev =>
      prev.map(item =>
        item.id === id
          ? ({
              ...item,
              status: 'Approved',
            } as Examination.DuplicateApplicationItem)
          : item
      )
    );
    ToastService.success('Application approved.');
  };

  const handleGenerate = (id: number) => {
    setList(prev =>
      prev.map(item =>
        item.id === id
          ? ({
              ...item,
              status: 'Generated',
            } as Examination.DuplicateApplicationItem)
          : item
      )
    );
    ToastService.success('Duplicate marksheet generated.');
  };

  return (
    <FormPage
      title="Duplicate Marksheet Applications"
      description="View and manage duplicate marksheet requests"
    >
      <FormCard>
        <GridPanel
          data={list}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search..."
          columns={[
            { field: 'studentName', header: 'Student Name' },
            { field: 'rollNo', header: 'Roll Number' },
            { field: 'program', header: 'Program' },
            { field: 'reason', header: 'Reason' },
            { field: 'appliedDate', header: 'Applied Date' },
            {
              header: 'Status',
              cell: (item: Examination.DuplicateApplicationItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Generated' ? 'bg-green-100 text-green-800' : item.status === 'Approved' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Actions',
              cell: (item: Examination.DuplicateApplicationItem) => (
                <div className="flex gap-1">
                  {item.status === 'Pending' && (
                    <Button
                      label="Approve"
                      icon="check"
                      variant="success"
                      tooltip="Approve"
                      onClick={() => handleApprove(item.id)}
                    />
                  )}
                  {item.status === 'Approved' && (
                    <Button
                      label="Generate"
                      icon="cog"
                      className="p-button-sm"
                      onClick={() => handleGenerate(item.id)}
                    />
                  )}
                  <Button
                    icon="eye"
                    variant="text"
                    tooltip="View Details"
                    onClick={() => ToastService.success('Opening details...')}
                  />
                </div>
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
