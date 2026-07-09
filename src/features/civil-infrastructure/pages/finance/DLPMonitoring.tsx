import { useState } from 'react';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import {
  dlpRecords as initialDlp,
  civilWorks as initialWorks,
} from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

export default function DLPMonitoring() {
  const [works] = useState(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : initialWorks;
  });

  const [dlp] = useState(() => {
    const saved = localStorage.getItem('civil_dlp_records');
    return saved ? JSON.parse(saved) : initialDlp;
  });

  const active = dlp.filter((d: any) => d.status !== 'Closed');

  const workName = (wid: string) =>
    works.find((w: any) => w.id === wid)?.name ?? '—';

  const daysLeft = (endDate: string) => {
    const diff = new Date(endDate).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <FormPage
      title="DLP Monitoring"
      description="Defect Liability Period tracker. Retention money held until 12-month DLP expires with zero defects or defects fully rectified."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.financePortal },
        { label: 'DLP Monitoring' },
      ]}
    >
      <div
        style={{
          background: '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: '0.875rem',
          padding: '1rem 1.25rem',
          fontSize: '0.8125rem',
          color: '#15803d',
          marginBottom: '1.25rem',
        }}
      >
        <strong>DLP Policy:</strong> Retention money (typically 5% of contract
        value) is held for 12 months post-completion. Release is only authorized
        after: (a) DLP period expires, (b) all defects are rectified, and (c)
        finance verifies no outstanding claims.
      </div>

      {/* Summary */}
      <div className="civil-stats-grid" style={{ marginBottom: '1.5rem' }}>
        {[
          {
            label: 'DLP Active',
            value: String(active.length),
            color: '#d97706',
          },
          {
            label: 'Total Retention Held',
            value: `₹${(dlp.reduce((s: number, d: any) => s + d.retentionAmount, 0) / 100000).toFixed(2)}L`,
            color: '#7c3aed',
          },
          {
            label: 'Defects Reported',
            value: String(
              dlp.reduce((s: number, d: any) => s + d.defectsReported, 0)
            ),
            color: '#dc2626',
          },
          {
            label: 'Defects Rectified',
            value: String(
              dlp.reduce((s: number, d: any) => s + d.defectsRectified, 0)
            ),
            color: '#16a34a',
          },
        ].map(s => (
          <FormCard key={s.label}>
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: '#9ca3af',
                textTransform: 'uppercase',
                marginBottom: '0.25rem',
              }}
            >
              {s.label}
            </div>
            <div
              style={{ fontSize: '1.375rem', fontWeight: 800, color: s.color }}
            >
              {s.value}
            </div>
          </FormCard>
        ))}
      </div>

      <FormCard title="Active DLP Works">
        <GridPanel
          data={active}
          columns={[
            {
              field: 'workId',
              header: 'Work ID',
              cell: (d: any) => (
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: '#1d4ed8',
                    fontSize: '0.75rem',
                  }}
                >
                  {works.find((w: any) => w.id === d.workId)?.workId}
                </span>
              ),
            },
            {
              field: 'workName' as any,
              header: 'Work Name',
              cell: (d: any) => (
                <span style={{ fontWeight: 600 }}>{workName(d.workId)}</span>
              ),
            },
            {
              field: 'workType' as any,
              header: 'Work Type',
              cell: (d: any) => {
                const wk = works.find((w: any) => w.id === d.workId);
                return (
                  <span style={{ fontSize: '0.75rem' }}>
                    {wk?.category ?? '—'}
                  </span>
                );
              },
            },
            {
              field: 'category' as any,
              header: 'Category',
              cell: (d: any) => {
                const wk = works.find((w: any) => w.id === d.workId);
                return (
                  <span style={{ fontSize: '0.75rem' }}>
                    {wk?.department ?? '—'}
                  </span>
                );
              },
            },
            {
              field: 'workBasis' as any,
              header: 'Work Basis',
              cell: (d: any) => {
                const wk = works.find((w: any) => w.id === d.workId);
                return (
                  <span
                    className={`civil-pill ${wk?.workBasis === 'BOQ Based' ? 'purple' : 'blue'}`}
                    style={{ fontSize: '0.65rem' }}
                  >
                    {wk?.workBasis ?? 'SOR Based'}
                  </span>
                );
              },
            },
            { field: 'completionDate', header: 'Completion Date' },
            { field: 'dlpStartDate', header: 'DLP Start' },
            { field: 'dlpEndDate', header: 'DLP End' },
            {
              field: 'dlpEndDate',
              header: 'Days Remaining',
              cell: (d: any) => {
                const days = daysLeft(d.dlpEndDate);
                return (
                  <span
                    style={{
                      fontWeight: 700,
                      color: days < 60 ? '#dc2626' : '#16a34a',
                    }}
                  >
                    {days > 0 ? `${days} days` : 'Expired'}
                  </span>
                );
              },
            },
            {
              field: 'retentionAmount',
              header: 'Retention Held',
              cell: (d: any) => (
                <span style={{ fontWeight: 700, color: '#7c3aed' }}>
                  ₹{(d.retentionAmount / 100000).toFixed(2)}L
                </span>
              ),
            },
            {
              field: 'defectsReported',
              header: 'Defects',
              cell: (d: any) => (
                <span
                  style={{
                    color: d.defectsReported > 0 ? '#dc2626' : '#16a34a',
                    fontWeight: 700,
                  }}
                >
                  {d.defectsReported} reported / {d.defectsRectified} fixed
                </span>
              ),
            },
            {
              field: 'retentionReleased',
              header: 'Retention Released',
              cell: (d: any) =>
                d.retentionReleased ? (
                  <span className="civil-pill green">✓ Released</span>
                ) : (
                  <span className="civil-pill amber">Held</span>
                ),
            },
            {
              field: 'status',
              header: 'DLP Status',
              cell: (d: any) => (
                <span
                  className={`civil-pill ${d.status === 'Active' ? 'teal' : d.status === 'Defects Reported' ? 'red' : 'amber'}`}
                >
                  {d.status}
                </span>
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Search DLP records..."
        />
      </FormCard>

      <div style={{ marginTop: '1.5rem' }}>
        <FormCard title="DLP Rules & Release Conditions">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
            }}
          >
            {[
              {
                title: '12-Month Timer',
                desc: 'DLP timer starts on the date the Completion Certificate is issued. Retention is not releasable before this period ends.',
                icon: 'clock',
                color: '#dbeafe',
              },
              {
                title: 'Zero Outstanding Defects',
                desc: 'All defects reported during DLP must be rectified and certified by site engineer before retention release.',
                icon: 'check-circle',
                color: '#dcfce7',
              },
              {
                title: 'Finance Verification',
                desc: 'Finance department verifies no outstanding claims, deductions, or disputes before authorizing retention release.',
                icon: 'shield',
                color: '#f3e8ff',
              },
              {
                title: 'Final Liability Closure',
                desc: 'After retention release, the work is formally closed in ERP. The contractor is fully discharged from project liability.',
                icon: 'star',
                color: '#fef3c7',
              },
            ].map(r => (
              <div
                key={r.title}
                style={{
                  background: r.color,
                  borderRadius: '0.875rem',
                  padding: '1rem',
                  display: 'flex',
                  gap: '0.75rem',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <i
                    className={`pi pi-${r.icon}`}
                    style={{ color: '#374151' }}
                  />
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      marginBottom: '0.25rem',
                      fontSize: '0.875rem',
                    }}
                  >
                    {r.title}
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      lineHeight: 1.5,
                    }}
                  >
                    {r.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
