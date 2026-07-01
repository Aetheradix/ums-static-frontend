import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

interface ScoreEntry {
  parameter: string;
  maxScore: number;
  score: number;
}

const parameters: ScoreEntry[] = [
  { parameter: 'Research Quality & Depth', maxScore: 25, score: 0 },
  { parameter: 'Methodology & Rigor', maxScore: 25, score: 0 },
  { parameter: 'Presentation & Communication', maxScore: 25, score: 0 },
  { parameter: 'Q&A Response Quality', maxScore: 25, score: 0 },
];

export default function Evaluation() {
  const [scores, setScores] = useState<ScoreEntry[]>(parameters);
  const [verdict, setVerdict] = useState('Recommended for PhD Degree Award');
  const [remarks, setRemarks] = useState('');
  const [saved, setSaved] = useState(false);

  const updateScore = (index: number, value: string) => {
    const num = Math.min(Math.max(0, Number(value)), scores[index].maxScore);
    setScores(prev =>
      prev.map((s, i) => (i === index ? { ...s, score: num } : s))
    );
  };

  const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
  const maxScore = scores.reduce((sum, s) => sum + s.maxScore, 0);

  const handleSave = () => {
    if (!remarks) {
      ToastService.error('Remarks are required before saving.');
      return;
    }
    setSaved(true);
    ToastService.success(
      `Evaluation scorecard saved. Verdict: "${verdict}". Scholar notified.`
    );
  };

  return (
    <FormPage
      title="Viva Evaluation"
      description="Enter viva defense scorecard data and record jury verdict for each scholar."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Research Cell', to: thesisUrls.cell.portal },
        { label: 'Evaluation' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.2fr 1fr' }}
      >
        <FormCard title="Viva Scorecard Entry — Sunita Chouhan">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.875rem',
            }}
          >
            {scores.map((s, i) => (
              <div
                key={i}
                style={{
                  padding: '0.75rem',
                  background: '#f8fafc',
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                  }}
                >
                  <p
                    style={{
                      fontSize: '0.813rem',
                      fontWeight: 600,
                      color: '#374151',
                    }}
                  >
                    {s.parameter}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    Max: {s.maxScore}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center',
                  }}
                >
                  <input
                    type="number"
                    min={0}
                    max={s.maxScore}
                    value={s.score}
                    onChange={e => updateScore(i, e.target.value)}
                    style={{
                      width: 70,
                      padding: '0.25rem 0.5rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: 4,
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      textAlign: 'center',
                    }}
                  />
                  <div
                    style={{
                      flex: 1,
                      height: 8,
                      background: '#e5e7eb',
                      borderRadius: 4,
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${(s.score / s.maxScore) * 100}%`,
                        background: '#3b82f6',
                        borderRadius: 4,
                        transition: 'width 0.2s',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            <div
              style={{
                padding: '0.75rem',
                background: '#eff6ff',
                borderRadius: 8,
                border: '1px solid #bfdbfe',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span
                style={{ fontSize: '1rem', fontWeight: 800, color: '#1e40af' }}
              >
                Total Score
              </span>
              <span
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: '#1e40af',
                }}
              >
                {totalScore} / {maxScore}
              </span>
            </div>
          </div>
        </FormCard>

        <FormCard title="Verdict & Remarks">
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <div>
              <label
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                Jury Verdict
              </label>
              <select
                className="dbt-filter-select"
                style={{ width: '100%', marginTop: 4, height: 38 }}
                value={verdict}
                onChange={e => setVerdict(e.target.value)}
              >
                <option>Recommended for PhD Degree Award</option>
                <option>Recommended — Subject to Minor Corrections</option>
                <option>Recommended — Subject to Major Corrections</option>
                <option>Resubmission Required (within 1 year)</option>
                <option>Not Recommended</option>
              </select>
            </div>
            <div>
              <label
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                Consolidated Jury Remarks *
              </label>
              <textarea
                rows={5}
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                style={{
                  width: '100%',
                  marginTop: 4,
                  padding: '0.5rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: 6,
                  fontSize: '0.75rem',
                  resize: 'vertical',
                }}
                placeholder="Enter overall jury evaluation remarks..."
              />
            </div>
            {saved && (
              <div
                style={{
                  padding: '0.75rem',
                  background: '#f0fdf4',
                  borderRadius: 6,
                  border: '1px solid #bbf7d0',
                  fontSize: '0.75rem',
                  color: '#166534',
                  fontWeight: 600,
                }}
              >
                ✅ Scorecard saved. Score: {totalScore}/{maxScore}. Scholar
                notified.
              </div>
            )}
            <Button
              label="Save Evaluation & Notify Scholar"
              variant="primary"
              onClick={handleSave}
            />
            <Button
              label="Download Scorecard PDF"
              variant="outlined"
              onClick={() =>
                ToastService.success('Downloading scorecard PDF...')
              }
            />
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
