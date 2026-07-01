import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox, TextArea } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { scholars } from '../../mocks';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

const ME = scholars[0];

interface TopicRecord {
  id: string;
  title: string;
  domain: string;
  keywords: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Returned';
  submittedOn: string;
}

const initialTopics: TopicRecord[] = [
  {
    id: 'tp-1',
    title:
      'Optimizing Low-Resource Translation for Central Indian Dialects using Hybrid Transformer Ensembles',
    domain: 'Natural Language Processing',
    keywords: 'NLP, Transformer, Low-Resource, IndicBART, Machine Translation',
    status: 'Approved',
    submittedOn: '15 Jan 2025',
  },
];

export default function TopicRegistration() {
  const [list, setList] = useState<TopicRecord[]>(initialTopics);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('');
  const [keywords, setKeywords] = useState('');
  const [abstract, setAbstract] = useState('');
  const [problem, setProblem] = useState('');
  const [methodology, setMethodology] = useState('');

  const resetForm = () => {
    setTitle('');
    setDomain('');
    setKeywords('');
    setAbstract('');
    setProblem('');
    setMethodology('');
    setEditId(null);
  };

  const handleEdit = (rec: TopicRecord) => {
    setEditId(rec.id);
    setTitle(rec.title);
    setDomain(rec.domain);
    setKeywords(rec.keywords);
  };

  const handleDelete = (id: string) => {
    setList(prev => prev.filter(r => r.id !== id));
    ToastService.success('Topic record deleted.');
  };

  const handleToggleStatus = (id: string) => {
    setList(prev =>
      prev.map(r =>
        r.id === id
          ? {
              ...r,
              status: r.status === 'Submitted' ? 'Draft' : ('Submitted' as any),
            }
          : r
      )
    );
    ToastService.success('Status updated.');
  };

  const handleSave = () => {
    if (!title || !domain) {
      ToastService.error('Title and Domain are required.');
      return;
    }
    if (editId) {
      setList(prev =>
        prev.map(r => (r.id === editId ? { ...r, title, domain, keywords } : r))
      );
      ToastService.success('Topic record updated successfully.');
    } else {
      const newRec: TopicRecord = {
        id: `tp-${Date.now()}`,
        title,
        domain,
        keywords,
        status: 'Draft',
        submittedOn: '30 Jun 2026',
      };
      setList(prev => [...prev, newRec]);
      ToastService.success('New topic registration saved.');
    }
    resetForm();
  };

  const statusColor: Record<string, string> = {
    Approved: 'approved',
    Submitted: 'submitted',
    Draft: 'draft',
    Returned: 'rejected',
  };

  return (
    <FormPage
      title="Topic Registration"
      description={`${ME.name} — Register your research topic with domain, problem statement and methodology.`}
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Student Portal', to: thesisUrls.student.portal },
        { label: 'Topic Registration' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.4fr 1fr' }}
      >
        <FormCard title="Registered Topics">
          <div style={{ overflowX: 'auto' }}>
            <table className="dbt-table">
              <thead>
                <tr>
                  <th>Research Title</th>
                  <th>Domain</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map(rec => (
                  <tr key={rec.id}>
                    <td style={{ fontWeight: 600, maxWidth: 280 }}>
                      {rec.title}
                    </td>
                    <td>{rec.domain}</td>
                    <td>
                      <span
                        className={`dbt-status-pill ${statusColor[rec.status]}`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td>{rec.submittedOn}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          type="button"
                          onClick={() => handleEdit(rec)}
                          style={{
                            padding: '0.2rem 0.5rem',
                            border: '1px solid #3b82f6',
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: '0.688rem',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(rec.id)}
                          style={{
                            padding: '0.2rem 0.5rem',
                            border: '1px solid #f59e0b',
                            background: '#fffbeb',
                            color: '#d97706',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: '0.688rem',
                          }}
                        >
                          {rec.status === 'Draft' ? 'Submit' : 'Draft'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(rec.id)}
                          style={{
                            padding: '0.2rem 0.5rem',
                            border: '1px solid #ef4444',
                            background: '#fff',
                            color: '#b91c1c',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: '0.688rem',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormCard>

        <FormCard
          title={editId ? 'Edit Topic Details' : 'Register New Research Topic'}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <TextBox
              label="Research Title"
              value={title}
              onChange={setTitle}
              required
            />
            <TextBox
              label="Research Domain"
              value={domain}
              onChange={setDomain}
              required
            />
            <TextBox
              label="Keywords (comma separated)"
              value={keywords}
              onChange={setKeywords}
            />
            <TextArea
              label="Abstract (Max 500 words)"
              value={abstract}
              onChange={setAbstract}
            />
            <TextArea
              label="Problem Statement"
              value={problem}
              onChange={setProblem}
            />
            <TextArea
              label="Proposed Methodology"
              value={methodology}
              onChange={setMethodology}
            />
            <div
              style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}
            >
              <Button
                label={editId ? 'Update Topic' : 'Save Topic'}
                variant="primary"
                onClick={handleSave}
              />
              {editId && (
                <Button label="Cancel" variant="outlined" onClick={resetForm} />
              )}
            </div>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
