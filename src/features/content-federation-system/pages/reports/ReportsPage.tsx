import { useState } from 'react';
import { FormPage, FormCard } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { cfsUrls } from '../../urls';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('category');
  const [dateRange, setDateRange] = useState('last30');

  const handleGenerate = () => {
    alert(`Generating ${reportType} report for ${dateRange}...`);
  };

  return (
    <FormPage
      title="CFS Reports"
      description="Generate and download analytical reports for the Content Federation System."
      breadcrumbs={[{ label: 'CFS', to: cfsUrls.root }, { label: 'Reports' }]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormCard title="Report Configuration">
          <div className="p-6 flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={e => setReportType(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="category">Content by Category</option>
                <option value="status">Content by Status</option>
                <option value="ou">Content by Organizational Unit</option>
                <option value="aging">Pending Review Aging</option>
                <option value="activity">User Activity Log</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={e => setDateRange(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="last7">Last 7 Days</option>
                <option value="last30">Last 30 Days</option>
                <option value="thisMonth">This Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            <div className="mt-4 flex gap-3">
              <Button
                label="Generate Report"
                variant="primary"
                icon="pi pi-file-excel"
                onClick={handleGenerate}
              />
              <Button
                label="Export PDF"
                variant="outlined"
                icon="pi pi-file-pdf"
                onClick={handleGenerate}
              />
            </div>
          </div>
        </FormCard>

        <FormCard title="Saved & Recent Reports">
          <div className="p-0">
            <ul className="divide-y divide-gray-200">
              <li className="p-4 hover:bg-gray-50 flex items-center justify-between transition-colors">
                <div className="flex items-center gap-3">
                  <i className="pi pi-file-excel text-green-600 text-xl" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Monthly Status Report - May 2026
                    </p>
                    <p className="text-xs text-gray-500">
                      Generated on 2026-06-01 by Admin
                    </p>
                  </div>
                </div>
                <Button variant="text" icon="pi pi-download" />
              </li>
              <li className="p-4 hover:bg-gray-50 flex items-center justify-between transition-colors">
                <div className="flex items-center gap-3">
                  <i className="pi pi-file-pdf text-red-500 text-xl" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Pending Review Aging - Critical
                    </p>
                    <p className="text-xs text-gray-500">
                      Generated on 2026-06-15 by Admin
                    </p>
                  </div>
                </div>
                <Button variant="text" icon="pi pi-download" />
              </li>
              <li className="p-4 hover:bg-gray-50 flex items-center justify-between transition-colors">
                <div className="flex items-center gap-3">
                  <i className="pi pi-file-excel text-green-600 text-xl" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Content by Category - Q1 2026
                    </p>
                    <p className="text-xs text-gray-500">
                      Generated on 2026-04-05 by Admin
                    </p>
                  </div>
                </div>
                <Button variant="text" icon="pi pi-download" />
              </li>
            </ul>
            <div className="p-4 border-t border-gray-200 text-center">
              <Button variant="text" label="View All Reports" />
            </div>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
