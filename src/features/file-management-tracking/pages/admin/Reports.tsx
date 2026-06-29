import { Chart } from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { mockDepartments, mockFileMovements, mockFiles } from '../../data';

export default function AdminReports() {
  const navigate = useNavigate();
  const pieRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLCanvasElement>(null);
  const pieChartRef = useRef<Chart | null>(null);
  const barChartRef = useRef<Chart | null>(null);

  const totalFiles = mockFiles.length;
  const totalMovements = mockFileMovements.length;
  const pendingFiles = mockFiles.filter(
    f => f.currentStatus === 'Under Review' || f.currentStatus === 'Forwarded'
  ).length;
  const approvedFiles = mockFiles.filter(
    f => f.currentStatus === 'Approved' || f.currentStatus === 'Closed'
  ).length;
  const rejectedFiles = mockFiles.filter(
    f => f.currentStatus === 'Rejected'
  ).length;
  const draftFiles = mockFiles.filter(f => f.currentStatus === 'Draft').length;

  useEffect(() => {
    requestAnimationFrame(() => {
      if (pieRef.current) {
        const ctx = pieRef.current.getContext('2d');
        if (ctx) {
          pieChartRef.current = new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: [
                'Draft',
                'Pending Review',
                'Approved/Closed',
                'Rejected',
              ],
              datasets: [
                {
                  data: [
                    draftFiles,
                    pendingFiles,
                    approvedFiles,
                    rejectedFiles,
                  ],
                  backgroundColor: ['#94a3b8', '#f59e0b', '#10b981', '#ef4444'],
                  borderWidth: 0,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: { font: { size: 11 }, color: '#64748b' },
                },
              },
            },
          });
        }
      }
      if (barRef.current) {
        const ctx = barRef.current.getContext('2d');
        if (ctx) {
          const depts = mockDepartments
            .filter(d => d.isActive)
            .map(d => d.name);
          const counts = depts.map(
            d => mockFiles.filter(f => f.departmentName === d).length
          );
          barChartRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: depts,
              datasets: [
                {
                  label: 'Files',
                  data: counts,
                  backgroundColor: '#3b82f6',
                  borderRadius: 4,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { stepSize: 1, color: '#94a3b8' },
                  grid: { color: 'rgba(148,163,184,0.1)' },
                },
                x: {
                  ticks: { color: '#94a3b8', font: { size: 10 } },
                  grid: { display: false },
                },
              },
            },
          });
        }
      }
    });
    return () => {
      pieChartRef.current?.destroy();
      barChartRef.current?.destroy();
    };
  }, []);

  return (
    <FormPage
      title="Reports & Analytics"
      description="Central access to all FMTS reports"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <FormCard title="File Status Overview" icon="pie_chart">
          <div className="relative h-[260px]">
            <canvas ref={pieRef} className="w-full h-[260px]" />
          </div>
        </FormCard>
        <FormCard title="Files by Department" icon="business">
          <div className="relative h-[260px]">
            <canvas ref={barRef} className="w-full h-[260px]" />
          </div>
        </FormCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FormCard title="Quick Stats" icon="analytics">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span>Total Files</span>
              <span className="font-bold text-lg">{totalFiles}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
              <span>Total Movements</span>
              <span className="font-bold text-lg text-blue-600">
                {totalMovements}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
              <span>Pending Review</span>
              <span className="font-bold text-lg text-orange-600">
                {pendingFiles}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-green-50 rounded">
              <span>Approved / Closed</span>
              <span className="font-bold text-lg text-green-600">
                {approvedFiles}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-red-50 rounded">
              <span>Rejected</span>
              <span className="font-bold text-lg text-red-600">
                {rejectedFiles}
              </span>
            </div>
          </div>
        </FormCard>

        <FormCard title="Report Categories" icon="bar_chart">
          <div className="grid grid-cols-2 gap-3">
            <Button
              label="File Movement"
              icon="swap_horiz"
              onClick={() =>
                navigate('/file-management-tracking/reports/file-movement')
              }
            />
            <Button
              label="Avg Approval Time"
              icon="timer"
              onClick={() =>
                navigate('/file-management-tracking/reports/avg-approval-time')
              }
            />
            <Button
              label="Pending Files"
              icon="hourglass_empty"
              onClick={() =>
                navigate('/file-management-tracking/reports/pending-files')
              }
            />
            <Button
              label="Employee Productivity"
              icon="person"
              onClick={() =>
                navigate(
                  '/file-management-tracking/reports/employee-productivity'
                )
              }
            />
            <Button
              label="SLA Violations"
              icon="warning"
              onClick={() =>
                navigate('/file-management-tracking/reports/sla-violations')
              }
            />
            <Button
              label="Rejection Rate"
              icon="cancel"
              onClick={() =>
                navigate('/file-management-tracking/reports/rejection-rate')
              }
            />
            <Button
              label="Audit Log Export"
              icon="history"
              onClick={() =>
                navigate('/file-management-tracking/reports/audit-log-export')
              }
            />
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
