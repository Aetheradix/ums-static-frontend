import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { grievanceCategories } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

interface MatrixRow {
  level: string;
  authority: string;
  triggerHrs: number;
  mode: string;
}

const INITIAL_MATRIX: MatrixRow[] = [
  {
    level: 'Level 1 (Nodal)',
    authority: 'Department Nodal Officer',
    triggerHrs: 0,
    mode: 'Auto Assignment',
  },
  {
    level: 'Level 2 (HoD)',
    authority: 'Head of Department',
    triggerHrs: 48,
    mode: 'Auto Escalation (Breach)',
  },
  {
    level: 'Level 3 (Dean)',
    authority: 'Dean Welfare / Warden Office',
    triggerHrs: 72,
    mode: 'Auto Escalation (Breach)',
  },
  {
    level: 'Level 4 (Registrar)',
    authority: 'Registrar Board / COE Office',
    triggerHrs: 96,
    mode: 'Manual Appellate Hearing',
  },
  {
    level: 'Level 5 (VC)',
    authority: 'Vice Chancellor Committee',
    triggerHrs: 120,
    mode: 'Appellate Board Review',
  },
];

export default function AdminWorkflowEscalation() {
  const [category, setCategory] = useState(grievanceCategories[0].name);
  const [matrix, setMatrix] = useState<MatrixRow[]>(INITIAL_MATRIX);

  const handleUpdate = () => {
    ToastService.success(
      `Escalation matrix rules successfully updated for category: ${category}`
    );
  };

  return (
    <FormPage
      title="Workflow & Escalation Matrix Config"
      description="Design multi-level escalation matrices and configure triggers for automatic referral overrides."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Admin Portal', to: grvUrls.admin.portal },
        { label: 'Workflow & Escalation' },
      ]}
    >
      <div className="grv-alert info">
        <i className="pi pi-schema"></i>
        <div>
          <strong>Statutory Compliance Note:</strong> Level 4 (Registrar) and
          Level 5 (VC) acts as statutory Appellate Authorities. Student appeals
          bypass Level 2/3 and route directly to appellate review.
        </div>
      </div>

      <div
        className="grv-bottom-row"
        style={{ gridTemplateColumns: '1.2fr 2fr' }}
      >
        {/* Selection side */}
        <FormCard title="Select Escalation Category" icon="settings">
          <FormGrid columns={1}>
            <DropDownList
              label="Select Grievance Category"
              data={grievanceCategories.map(c => ({
                name: c.name,
                value: c.name,
              }))}
              textField="name"
              optionValue="value"
              value={category}
              onChange={val => setCategory(String(val ?? ''))}
              required
            />
            <div className="p-3 bg-slate-50 border rounded-lg text-xs mt-3 text-slate-500">
              Editing this configuration will update live active ticket SLA
              tracking loops immediately.
            </div>
            <div className="mt-4">
              <Button
                label="Save Matrix Rules"
                icon="save"
                variant="primary"
                onClick={handleUpdate}
                className="w-full"
              />
            </div>
          </FormGrid>
        </FormCard>

        {/* Level matrix table */}
        <FormCard title={`Escalation Matrix Rules — ${category}`} icon="list">
          <table className="grv-matrix-table">
            <thead>
              <tr>
                <th>Workflow Stage</th>
                <th>Redressal Authority Node</th>
                <th>Trigger Window (SLA Hours)</th>
                <th>Routing Logic</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map((m, idx) => (
                <tr key={m.level}>
                  <td className="font-bold text-slate-800">{m.level}</td>
                  <td>
                    <TextBox
                      value={m.authority}
                      onChange={val => {
                        const copy = [...matrix];
                        copy[idx].authority = val;
                        setMatrix(copy);
                      }}
                    />
                  </td>
                  <td>
                    <TextBox
                      value={String(m.triggerHrs)}
                      onChange={val => {
                        const copy = [...matrix];
                        copy[idx].triggerHrs = Number(val) || 0;
                        setMatrix(copy);
                      }}
                    />
                  </td>
                  <td>
                    <span className="text-xs font-semibold text-slate-500">
                      {m.mode}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </FormCard>
      </div>
    </FormPage>
  );
}
