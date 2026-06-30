import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
  Tabs,
} from 'shared/new-components';
import {
  initialBuildings,
  initialMaintenanceRequests,
  type Building,
  type MaintenanceRequest,
} from '../../data';
import { estateUrls } from '../../urls';

export default function Reports() {
  const [buildings] = useState<Building[]>(initialBuildings);
  const [requests] = useState<MaintenanceRequest[]>(initialMaintenanceRequests);

  const exportToCSV = (title: string, data: any[]) => {
    if (!data.length) {
      ToastService.error('No data available to export.');
      return;
    }
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row =>
      Object.values(row)
        .map(val => {
          const str = String(val ?? '');
          return str.includes(',') ? `"${str.replace(/"/g, '""')}"` : str;
        })
        .join(',')
    );
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `${title.toLowerCase().replace(/\s+/g, '_')}_report_${Date.now()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    ToastService.success(`${title} exported to CSV successfully.`);
  };

  const copyToClipboard = (title: string, data: any[]) => {
    if (!data.length) {
      ToastService.error('No data available to copy.');
      return;
    }
    const headers = Object.keys(data[0]).join('\t');
    const rows = data.map(row => Object.values(row).join('\t'));
    const text = [headers, ...rows].join('\n');
    navigator.clipboard.writeText(text);
    ToastService.success(`${title} copied to clipboard.`);
  };

  return (
    <FormPage
      title="Estate Reports & Analytics"
      description="Export master building specifications and maintenance track records."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Estate Management', to: estateUrls.portal },
        { label: 'Admin Portal', to: estateUrls.admin.portal },
        { label: 'Reports' },
      ]}
    >
      <Tabs
        tabs={[
          {
            title: 'Buildings Report',
            content: (
              <FormCard>
                <GridPanel
                  data={buildings}
                  columns={[
                    {
                      cell: (_: unknown, option: { rowIndex: number }) => (
                        <span className="font-semibold text-gray-700">
                          {option.rowIndex + 1}
                        </span>
                      ),
                      width: '50px',
                    },
                    { field: 'id', header: 'Building ID', width: '110px' },
                    { field: 'name', header: 'Building Name' },
                    { field: 'campus', header: 'Campus', width: '130px' },
                    {
                      field: 'numberOfFloors',
                      header: 'Floors',
                      width: '90px',
                    },
                    {
                      field: 'structureType',
                      header: 'Structure Type',
                      width: '160px',
                    },
                    {
                      field: 'totalConstructionCost',
                      header: 'Cost (₹)',
                      width: '130px',
                      cell: (item: Building) => (
                        <span>
                          ₹{item.totalConstructionCost.toLocaleString()}
                        </span>
                      ),
                    },
                    {
                      field: 'status',
                      header: 'Status',
                      width: '100px',
                      cell: (item: Building) => (
                        <StatusBadge
                          label={item.status}
                          variant={
                            item.status === 'Active' ? 'approved' : 'rejected'
                          }
                        />
                      ),
                    },
                  ]}
                  toolbar={
                    <div className="flex gap-2">
                      <Button
                        label="Export CSV"
                        icon="download"
                        variant="primary"
                        className="p-button-sm"
                        onClick={() => exportToCSV('Buildings', buildings)}
                      />
                      <Button
                        label="Copy Data"
                        icon="copy"
                        variant="outlined"
                        className="p-button-sm"
                        onClick={() => copyToClipboard('Buildings', buildings)}
                      />
                    </div>
                  }
                  searchBox
                />
              </FormCard>
            ),
          },
          {
            title: 'Maintenance Report',
            content: (
              <FormCard>
                <GridPanel
                  data={requests}
                  columns={[
                    {
                      cell: (_: unknown, option: { rowIndex: number }) => (
                        <span className="font-semibold text-gray-700">
                          {option.rowIndex + 1}
                        </span>
                      ),
                      width: '50px',
                    },
                    { field: 'id', header: 'Request ID', width: '110px' },
                    {
                      field: 'requestType',
                      header: 'Request Type',
                      width: '180px',
                    },
                    {
                      field: 'priority',
                      header: 'Priority',
                      width: '100px',
                      cell: (item: MaintenanceRequest) => (
                        <StatusBadge
                          label={item.priority}
                          variant={
                            item.priority === 'Critical' ||
                            item.priority === 'High'
                              ? 'rejected'
                              : 'neutral'
                          }
                        />
                      ),
                    },
                    {
                      field: 'problemCategory',
                      header: 'Category',
                      width: '130px',
                    },
                    { field: 'entityId', header: 'Target Location' },
                    {
                      field: 'status',
                      header: 'Status',
                      width: '140px',
                      cell: (item: MaintenanceRequest) => (
                        <StatusBadge
                          label={item.status}
                          variant={
                            item.status === 'Completed' ? 'approved' : 'pending'
                          }
                        />
                      ),
                    },
                  ]}
                  toolbar={
                    <div className="flex gap-2">
                      <Button
                        label="Export CSV"
                        icon="download"
                        variant="primary"
                        className="p-button-sm"
                        onClick={() => exportToCSV('Maintenance', requests)}
                      />
                      <Button
                        label="Copy Data"
                        icon="copy"
                        variant="outlined"
                        className="p-button-sm"
                        onClick={() => copyToClipboard('Maintenance', requests)}
                      />
                    </div>
                  }
                  searchBox
                />
              </FormCard>
            ),
          },
        ]}
      />
    </FormPage>
  );
}
