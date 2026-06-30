import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { assessments, trainingPrograms } from '../../mocks';
import { tdmUrls } from '../../urls';

const STATUS_VARIANTS: Record<
  string,
  'approved' | 'pending' | 'rejected' | 'neutral'
> = {
  Pass: 'approved',
  Fail: 'rejected',
  Pending: 'pending',
};

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: any };

export default function AssessmentPage() {
  const [data] = useState(assessments);
  const [trainingFilter, setTrainingFilter] = useState('All');
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const close = () => setPopup({ mode: 'closed' });

  return (
    <FormPage
      title="Training Assessment"
      description="Manage quizzes, assignments and practical evaluations for training participants."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'Admin Portal', to: tdmUrls.admin.portal },
        { label: 'Assessment' },
      ]}
    >
      <FormCard>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ width: 400 }}>
            <DropDownList
              label="Filter by Training Programme"
              data={[
                { name: 'All Programmes', value: 'All' },
                ...trainingPrograms.map(p => ({
                  name: p.title,
                  value: p.trainingId,
                })),
              ]}
              textField="name"
              optionValue="value"
              value={trainingFilter}
              onChange={v => setTrainingFilter(v as string)}
            />
          </div>
        </div>

        <GridPanel
          data={
            data.filter(
              d => trainingFilter === 'All' || d.trainingId === trainingFilter
            ) as any[]
          }
          columns={[
            {
              field: 'participant',
              header: 'Participant',
              cell: item => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600 }}>
                    {item.participantName}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {item.department}
                  </span>
                </div>
              ),
            },
            {
              field: 'assessment',
              header: 'Assessment Type',
              cell: item => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.813rem', color: '#111827' }}>
                    {item.type}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {item.trainingTitle}
                  </span>
                </div>
              ),
            },
            {
              field: 'marks',
              header: 'Marks (Obtained/Max)',
              cell: item => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div
                    style={{
                      flex: 1,
                      background: '#f3f4f6',
                      height: 6,
                      borderRadius: 3,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        background:
                          item.result === 'Pass'
                            ? '#10b981'
                            : item.result === 'Fail'
                              ? '#ef4444'
                              : '#f59e0b',
                        width: `${(item.obtainedMarks / item.maxMarks) * 100}%`,
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                    {item.obtainedMarks}/{item.maxMarks}
                  </span>
                </div>
              ),
            },
            {
              field: 'result',
              header: 'Result',
              cell: item => (
                <StatusBadge
                  label={item.result}
                  variant={STATUS_VARIANTS[item.result]}
                />
              ),
            },
            {
              field: 'evaluatedBy',
              header: 'Evaluated By',
              cell: item => (
                <span style={{ fontSize: '0.75rem', color: '#374151' }}>
                  {item.evaluatedBy} <br />
                  <span style={{ color: '#9ca3af' }}>{item.submittedOn}</span>
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
                  icon="pencil"
                  variant="outlined"
                  label=""
                  tooltip="Update Marks"
                  onClick={() => setPopup({ mode: 'edit', item })}
                />
              ),
            },
          ]}
          toolbar={
            <Button
              label="Create Assessment"
              icon="plus"
              variant="primary"
              onClick={() => setPopup({ mode: 'create' })}
            />
          }
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={
          popup.mode === 'create'
            ? 'Create Assessment'
            : popup.mode === 'edit'
              ? 'Update Marks'
              : ''
        }
        size="default"
      >
        {popup.mode === 'create' && (
          <div
            style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '3rem', color: '#9ca3af' }}
            >
              quiz
            </span>
            <p>Assessment creation form will be displayed here.</p>
          </div>
        )}
        {popup.mode === 'edit' && (
          <div
            style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '3rem', color: '#9ca3af' }}
            >
              edit
            </span>
            <p>
              Update marks for {popup.item?.participantName} will be displayed
              here.
            </p>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
