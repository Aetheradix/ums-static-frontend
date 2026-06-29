import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { competencyMappings } from '../../mocks';
import { tdmUrls } from '../../urls';

type PopupState = { mode: 'closed' } | { mode: 'update' } | { mode: 'find'; item: any };

export default function CompetenciesPage() {
  const [data] = useState(competencyMappings.filter(c => c.employeeId === 'EMP-1042'));
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const close = () => setPopup({ mode: 'closed' });

  return (
    <FormPage
      title="My Competencies & Skills"
      description="Review your competency levels, skill gaps and development roadmap."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'Faculty Portal', to: tdmUrls.faculty.portal },
        { label: 'Competencies' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data as any[]}
          columns={[
            {
              field: 'competency', header: 'Competency Area',
              cell: (item) => <span style={{ fontWeight: 600 }}>{item.competency}</span>
            },
            {
              field: 'currentLevel', header: 'Current Level',
              cell: (item) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ background: '#f3f4f6', borderRadius: 9999, padding: '2px 8px', fontSize: '0.75rem', fontWeight: 600, color: '#374151' }}>Level {item.currentLevel}</div>
                </div>
              ),
            },
            {
              field: 'requiredLevel', header: 'Required Level',
              cell: (item) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ background: '#dbeafe', borderRadius: 9999, padding: '2px 8px', fontSize: '0.75rem', fontWeight: 600, color: '#1d4ed8' }}>Level {item.requiredLevel}</div>
                </div>
              ),
            },
            {
              field: 'gap', header: 'Status',
              cell: (item) => (
                <span style={{ fontWeight: 700, color: item.gap > 0 ? '#ef4444' : '#10b981' }}>
                  {item.gap > 0 ? `${item.gap} Level Gap` : 'Target Achieved'}
                </span>
              ),
            },
            {
              field: 'actions', header: 'Recommended Training', sortable: false,
              cell: (item) => (
                item.gap > 0 ? <Button size="small" variant="primary" label="Find Training" onClick={() => setPopup({ mode: 'find', item })} /> : <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Up to date</span>
              ),
            },
          ]}
          toolbar={
            <Button label="Update Skills" icon="pencil" variant="outlined" onClick={() => setPopup({ mode: 'update' })} />
          }
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={popup.mode === 'update' ? 'Update Skills' : popup.mode === 'find' ? 'Find Training' : ''}
        size="default"
      >
        {popup.mode === 'update' && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: '#9ca3af' }}>edit_document</span>
            <p>Self-assessment functionality will be available here.</p>
          </div>
        )}
        {popup.mode === 'find' && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: '#9ca3af' }}>model_training</span>
            <p>Training recommendations for {popup.mode === 'find' ? popup.item?.competency : ''} will be displayed here.</p>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
