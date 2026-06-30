import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { type Trainer, trainers } from '../../mocks';
import { tdmUrls } from '../../urls';

const renderStars = (rating: number) => {
  return (
    <div
      style={{ display: 'flex', gap: 2, color: '#f59e0b', fontSize: '0.75rem' }}
    >
      {[1, 2, 3, 4, 5].map(i => (
        <i
          key={i}
          className={
            i <= rating
              ? 'pi pi-star-fill'
              : i - 0.5 <= rating
                ? 'pi pi-star-half-fill'
                : 'pi pi-star'
          }
        />
      ))}
    </div>
  );
};

type PopupState =
  | { mode: 'closed' }
  | { mode: 'generate' }
  | { mode: 'view'; item: Trainer };

export default function PerformanceEvaluationPage() {
  const [data] = useState(trainers);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<any>({});

  const close = () => setPopup({ mode: 'closed' });

  return (
    <FormPage
      title="Performance Evaluation"
      description="Evaluate trainer performance, session feedback, and competency progression."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'Admin Portal', to: tdmUrls.admin.portal },
        { label: 'Performance' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data as any[]}
          columns={[
            {
              field: 'name',
              header: 'Trainer Profile',
              cell: item => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600 }}>{item.name}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {item.trainerId} • {item.department}
                  </span>
                </div>
              ),
            },
            {
              field: 'type',
              header: 'Role',
              cell: item => (
                <StatusBadge
                  label={item.trainerType}
                  variant={
                    item.trainerType === 'Internal' ? 'approved' : 'pending'
                  }
                />
              ),
            },
            {
              field: 'totalSessions',
              header: 'Sessions Delivered',
              cell: item => (
                <span style={{ fontWeight: 600 }}>
                  {item.totalSessions} Sessions
                </span>
              ),
            },
            {
              field: 'rating',
              header: 'Average Rating',
              cell: item => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      fontWeight: 700,
                      color:
                        item.rating >= 4.5
                          ? '#10b981'
                          : item.rating >= 4.0
                            ? '#3b82f6'
                            : '#f59e0b',
                    }}
                  >
                    {item.rating.toFixed(1)}
                  </span>
                  {renderStars(item.rating)}
                </div>
              ),
            },
            {
              field: 'certifications',
              header: 'Certifications',
              cell: item => (
                <span style={{ fontSize: '0.75rem' }}>
                  {item.certifications.length} Certifications
                </span>
              ),
            },
            {
              field: 'actions',
              header: 'Actions',
              sortable: false,
              cell: item => (
                <Button
                  size="small"
                  icon="chart-bar"
                  variant="outlined"
                  label="View Scorecard"
                  onClick={() => setPopup({ mode: 'view', item })}
                />
              ),
            },
          ]}
          toolbar={
            <Button
              label="Generate Scorecards"
              icon="file-pdf"
              variant="primary"
              onClick={() => {
                setForm({});
                setPopup({ mode: 'generate' });
              }}
            />
          }
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={
          popup.mode === 'generate'
            ? 'Generate Performance Scorecards'
            : 'Trainer Scorecard'
        }
        size="default"
      >
        {popup.mode === 'generate' && (
          <>
            <FormGrid columns={1}>
              <DropDownList
                label="Trainer Department"
                data={[
                  { name: 'All Departments', value: 'All' },
                  { name: 'Computer Science', value: 'CSE' },
                ]}
                textField="name"
                optionValue="value"
                value={form.department ?? 'All'}
                onChange={v =>
                  setForm((f: any) => ({ ...f, department: v as string }))
                }
              />
              <DropDownList
                label="Period"
                data={[
                  { name: 'Current Year', value: 'Current Year' },
                  { name: 'Last 6 Months', value: '6 Months' },
                ]}
                textField="name"
                optionValue="value"
                value={form.period ?? 'Current Year'}
                onChange={v =>
                  setForm((f: any) => ({ ...f, period: v as string }))
                }
              />
              <DropDownList
                label="Format"
                data={[
                  { name: 'PDF', value: 'PDF' },
                  { name: 'Excel', value: 'Excel' },
                ]}
                textField="name"
                optionValue="value"
                value={form.format ?? 'PDF'}
                onChange={v =>
                  setForm((f: any) => ({ ...f, format: v as string }))
                }
              />
            </FormGrid>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1rem',
                marginTop: '2rem',
              }}
            >
              <Button label="Cancel" variant="outlined" onClick={close} />
              <Button
                label="Generate"
                variant="primary"
                icon="check"
                onClick={close}
              />
            </div>
          </>
        )}
        {popup.mode === 'view' && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                background: '#f9fafb',
                padding: '1.5rem',
                borderRadius: 8,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                  {popup.item.name}
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  {popup.item.trainerId} • {popup.item.department}
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  <StatusBadge
                    label={popup.item.trainerType}
                    variant={
                      popup.item.trainerType === 'Internal'
                        ? 'approved'
                        : 'pending'
                    }
                  />
                </div>
              </div>
              <div
                style={{
                  textAlign: 'center',
                  background: 'white',
                  padding: '1rem',
                  borderRadius: 8,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                }}
              >
                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: popup.item.rating >= 4.5 ? '#10b981' : '#3b82f6',
                  }}
                >
                  {popup.item.rating.toFixed(1)}
                </div>
                <div>{renderStars(popup.item.rating)}</div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    marginTop: 4,
                  }}
                >
                  Avg. Rating
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  border: '1px solid #e5e7eb',
                  padding: '1rem',
                  borderRadius: 8,
                }}
              >
                <h4
                  style={{
                    margin: '0 0 1rem 0',
                    fontSize: '0.875rem',
                    color: '#4b5563',
                  }}
                >
                  Training Activity
                </h4>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                  }}
                >
                  <span>Total Sessions</span>
                  <span style={{ fontWeight: 600 }}>
                    {popup.item.totalSessions}
                  </span>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>Total Participants</span>
                  <span style={{ fontWeight: 600 }}>
                    {popup.item.totalSessions * 25}+
                  </span>
                </div>
              </div>
              <div
                style={{
                  border: '1px solid #e5e7eb',
                  padding: '1rem',
                  borderRadius: 8,
                }}
              >
                <h4
                  style={{
                    margin: '0 0 1rem 0',
                    fontSize: '0.875rem',
                    color: '#4b5563',
                  }}
                >
                  Skills & Expertise
                </h4>
                <div
                  style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
                >
                  {popup.item.skills.map((comp: string, i: number) => (
                    <span
                      key={i}
                      style={{
                        background: '#eef2ff',
                        color: '#4f46e5',
                        padding: '2px 8px',
                        borderRadius: 12,
                        fontSize: '0.75rem',
                      }}
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
