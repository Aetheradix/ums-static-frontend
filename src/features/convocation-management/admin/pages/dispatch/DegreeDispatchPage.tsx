import { Button } from 'primereact/button';
import { useState } from 'react';
import { ToastService } from 'services';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { CONVOCATION_URLS } from '../../../urls';

export default function DegreeDispatchPage() {
  // Mock data for dispatch
  const [dispatches, setDispatches] = useState([
    {
      id: 'DSP001',
      name: 'Diya Patel',
      enrollmentNo: 'EN2024002',
      address: '123 Tech Park, Bangalore',
      courier: '',
      trackingNo: '',
      status: 'Pending Dispatch',
    },
    {
      id: 'DSP002',
      name: 'Vikram Singh',
      enrollmentNo: 'EN2024008',
      address: '45 Lake View, Mumbai',
      courier: 'India Post',
      trackingNo: 'INP123456',
      status: 'Dispatched',
    },
  ]);

  const handleUpdateTracking = (id: string) => {
    setDispatches(prev =>
      prev.map(d =>
        d.id === id
          ? {
              ...d,
              status: 'Dispatched',
              courier: 'DTDC',
              trackingNo: 'DTDC' + Math.floor(Math.random() * 1000000),
            }
          : d
      )
    );
    ToastService.success('Tracking details updated successfully!');
  };

  const statusBodyTemplate = (rowData: any) => {
    return (
      <StatusBadge
        variant={rowData.status === 'Dispatched' ? 'success' : 'warning'}
        label={rowData.status}
      />
    );
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2">
        {rowData.status === 'Pending Dispatch' ? (
          <Button
            label="Update Tracking"
            size="small"
            severity="info"
            onClick={() => handleUpdateTracking(rowData.id)}
          />
        ) : (
          <Button label="View Details" size="small" outlined />
        )}
      </div>
    );
  };

  return (
    <FormPage
      title="Degree Dispatch (In-Absentia)"
      breadcrumbs={[
        { label: 'Convocation Management', to: CONVOCATION_URLS.PORTAL },
        { label: 'Admin Portal', to: CONVOCATION_URLS.ADMIN.ROOT },
        { label: 'Degree Dispatch' },
      ]}
    >
      <div className="space-y-6">
        <FormCard
          title="Dispatch Tracking"
          subtitle="Manage postal dispatch of degrees for students opting for In-Absentia."
        >
          <GridPanel
            data={dispatches}
            searchFields={['name', 'enrollmentNo', 'trackingNo']}
            searchBox
            searchPlaceholder="Search dispatches..."
            actionButtons={
              <Button
                label="Export to Courier"
                icon="pi pi-truck"
                severity="info"
                onClick={() => ToastService.success('Dispatch list exported.')}
              />
            }
            columns={[
              {
                field: 'enrollmentNo',
                header: 'Enrollment No.',
                sortable: true,
              },
              {
                field: 'name',
                header: 'Student Name',
                sortable: true,
                width: '20%',
              },
              { field: 'address', header: 'Address', width: '25%' },
              {
                field: 'trackingNo',
                header: 'Tracking No.',
                sortable: true,
                width: '15%',
              },
              { header: 'Status', cell: statusBodyTemplate, width: '10%' },
              { header: 'Actions', cell: actionBodyTemplate, width: '15%' },
            ]}
          />
        </FormCard>
      </div>
    </FormPage>
  );
}
