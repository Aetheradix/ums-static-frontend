import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { juryMembers } from '../../mocks';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

type Jury = (typeof juryMembers)[0];

export default function VivaRecommendation() {
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [email, setEmail] = useState('');

  const toggleSelect = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSubmitRecommendation = () => {
    if (selected.length < 1) {
      ToastService.error('Select at least one examiner for recommendation.');
      return;
    }
    ToastService.success(
      `Jury recommendation submitted to URC Cell (${selected.length} members).`
    );
    setSelected([]);
  };

  const handleAddCustom = () => {
    if (!name || !institution || !email) {
      ToastService.error('Name, institution and email are required.');
      return;
    }
    ToastService.success(
      `Custom examiner ${name} from ${institution} added to recommendation list.`
    );
    setName('');
    setInstitution('');
    setSpecialization('');
    setEmail('');
  };

  return (
    <FormPage
      title="Jury Recommendation"
      description="Recommend internal and external jury members for scholar viva defense panel."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Supervisor Portal', to: thesisUrls.supervisor.portal },
        { label: 'Jury Recommendation' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.4fr 1fr' }}
      >
        <FormCard title="Available Jury Members">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.625rem',
              marginBottom: '1rem',
            }}
          >
            {juryMembers.map((j: Jury) => (
              <div
                key={j.id}
                onClick={() => toggleSelect(j.id)}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  background: selected.includes(j.id) ? '#eff6ff' : '#f8fafc',
                  borderRadius: 8,
                  border: `2px solid ${selected.includes(j.id) ? '#3b82f6' : '#e5e7eb'}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: j.type === 'External' ? '#7c3aed' : '#1e40af',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    flexShrink: 0,
                  }}
                >
                  {j.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '0.813rem',
                        fontWeight: 700,
                        color: '#1f2937',
                      }}
                    >
                      {j.name}
                    </p>
                    <span
                      className={`dbt-status-pill ${j.type === 'External' ? 'rejected' : 'submitted'}`}
                      style={{ fontSize: '0.563rem' }}
                    >
                      {j.type}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.688rem', color: '#6b7280' }}>
                    {j.institution}
                  </p>
                  <p style={{ fontSize: '0.625rem', color: '#9ca3af' }}>
                    {j.specialization}
                  </p>
                </div>
                {selected.includes(j.id) && (
                  <span
                    style={{
                      color: '#1e40af',
                      fontWeight: 800,
                      fontSize: '1rem',
                    }}
                  >
                    ✓
                  </span>
                )}
              </div>
            ))}
          </div>
          <Button
            label={`Submit Recommendation (${selected.length} selected)`}
            variant="primary"
            onClick={handleSubmitRecommendation}
          />
        </FormCard>

        <FormCard title="Add Custom Examiner">
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <TextBox
              label="Examiner Full Name"
              value={name}
              onChange={setName}
              required
            />
            <TextBox
              label="Institution / University"
              value={institution}
              onChange={setInstitution}
              required
            />
            <TextBox
              label="Specialization"
              value={specialization}
              onChange={setSpecialization}
            />
            <TextBox
              label="Email Address"
              value={email}
              onChange={setEmail}
              required
            />
            <div>
              <label
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                Examiner Type
              </label>
              <select
                className="dbt-filter-select"
                style={{ width: '100%', marginTop: 4, height: 38 }}
              >
                <option value="External">External Examiner</option>
                <option value="Internal">Internal Examiner</option>
              </select>
            </div>
            <Button
              label="Add to Recommendation List"
              variant="outlined"
              onClick={handleAddCustom}
            />
            <div
              style={{
                padding: '0.75rem',
                background: '#fffbeb',
                borderRadius: 6,
                border: '1px solid #fde68a',
                fontSize: '0.688rem',
                color: '#92400e',
              }}
            >
              ⚠️ Panel must have minimum 1 External + 1 Internal examiner for
              valid viva composition.
            </div>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
