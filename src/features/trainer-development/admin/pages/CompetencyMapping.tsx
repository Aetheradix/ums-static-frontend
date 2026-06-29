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
import { competencyMappings, departments } from '../../mocks';
import { tdmUrls } from '../../urls';

const STATUS_VARIANTS: Record<string, 'approved' | 'pending' | 'rejected' | 'neutral'> = {
  'Gap Identified': 'rejected',
  'In Progress': 'pending',
  'Achieved': 'approved',
  'Not Started': 'neutral',
};

type PopupState = { mode: 'closed' } | { mode: 'map' } | { mode: 'assign'; item: any };

export default function CompetencyMappingPage() {
  const [data] = useState(competencyMappings);
  const [deptFilter, setDeptFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const close = () => setPopup({ mode: 'closed' });

  const filteredData = data.filter(d => {
    if (deptFilter !== 'All' && d.department !== deptFilter) return false;
    if (statusFilter !== 'All' && d.status !== statusFilter) return false;
    return true;
  });

  return (
    <FormPage
      title="Competency Mapping & Gap Analysis"
      description="Map required competencies to faculty members and identify skill gaps."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'Admin Portal', to: tdmUrls.admin.portal },
        { label: 'Competency Mapping' },
      ]}
    >
      <FormCard>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ width: 250 }}>
            <DropDownList
              label="Filter by Department"
              data={[{ name: 'All Departments', value: 'All' }, ...departments.map(d => ({ name: d, value: d }))]}
              textField="name" optionValue="value"
              value={deptFilter} onChange={v => setDeptFilter(v as string)}
            />
          </div>
          <div style={{ width: 250 }}>
            <DropDownList
              label="Filter by Status"
              data={[
                { name: 'All Statuses', value: 'All' },
                { name: 'Gap Identified', value: 'Gap Identified' },
                { name: 'In Progress', value: 'In Progress' },
                { name: 'Achieved', value: 'Achieved' },
                { name: 'Not Started', value: 'Not Started' },
              ]}
              textField="name" optionValue="value"
              value={statusFilter} onChange={v => setStatusFilter(v as string)}
            />
          </div>
        </div>

        <GridPanel
          data={filteredData as any[]}
          columns={[
            {
              field: 'employeeName', header: 'Employee',
              cell: (item) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600 }}>{item.employeeName}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{item.employeeId} • {item.designation}</span>
                </div>
              ),
            },
            { field: 'department', header: 'Department' },
            { field: 'competency', header: 'Competency' },
            {
              field: 'levels', header: 'Level (Current / Required)',
              cell: (item) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ background: '#f3f4f6', borderRadius: 9999, padding: '2px 8px', fontSize: '0.75rem', fontWeight: 600, color: '#374151' }}>L{item.currentLevel}</div>
                  <i className="pi pi-arrow-right" style={{ fontSize: '0.625rem', color: '#9ca3af' }} />
                  <div style={{ background: '#dbeafe', borderRadius: 9999, padding: '2px 8px', fontSize: '0.75rem', fontWeight: 600, color: '#1d4ed8' }}>L{item.requiredLevel}</div>
                </div>
              ),
            },
            {
              field: 'gap', header: 'Skill Gap',
              cell: (item) => (
                <span style={{ fontWeight: 700, color: item.gap > 0 ? '#ef4444' : '#10b981' }}>
                  {item.gap > 0 ? `-${item.gap} Levels` : 'No Gap'}
                </span>
              ),
            },
            { field: 'targetDate', header: 'Target Date' },
            {
              field: 'status', header: 'Status',
              cell: (item) => (
                <StatusBadge label={item.status} variant={STATUS_VARIANTS[item.status]} />
              ),
            },
            {
              field: 'actions', header: 'Actions', sortable: false, width: '100px',
              cell: (item) => (
                <Button size="small" variant="outlined" label="Assign Training" onClick={() => setPopup({ mode: 'assign', item })} />
              ),
            },
          ]}
          toolbar={
            <Button label="Map New Competency" icon="plus" variant="primary" onClick={() => setPopup({ mode: 'map' })} />
          }
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={popup.mode === 'map' ? 'Map New Competency' : popup.mode === 'assign' ? 'Assign Training Programme' : ''}
        size="default"
      >
        {popup.mode === 'map' && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: '#9ca3af' }}>post_add</span>
            <p>Competency mapping form will be displayed here.</p>
          </div>
        )}
        {popup.mode === 'assign' && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: '#9ca3af' }}>model_training</span>
            <p>Assign training to {popup.item?.employeeName} for {popup.item?.competency} gap.</p>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
