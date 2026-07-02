import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { scholars } from '../../mocks';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

type Scholar = (typeof scholars)[0];

export default function ScholarRegistration() {
  const [list, setList] = useState<Scholar[]>(scholars);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [dept, setDept] = useState('');
  const [area, setArea] = useState('');
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');

  const reset = () => {
    setEditId(null);
    setName('');
    setDept('');
    setArea('');
    setCode('');
    setEmail('');
  };

  const handleEdit = (s: Scholar) => {
    setEditId(s.id);
    setName(s.name);
    setDept(s.department);
    setArea(s.researchArea);
    setCode(s.researchCode);
    setEmail(s.email);
  };

  const handleDelete = (id: string) => {
    setList(prev => prev.filter(s => s.id !== id));
    ToastService.success('Scholar registration removed.');
  };

  const handleToggle = (id: string) => {
    setList(prev =>
      prev.map(s =>
        s.id === id
          ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' }
          : s
      )
    );
    ToastService.success('Scholar status updated.');
  };

  const handleSave = () => {
    if (!name || !dept || !email) {
      ToastService.error('Name, Department and Email are required.');
      return;
    }
    if (editId) {
      setList(prev =>
        prev.map(s =>
          s.id === editId
            ? {
                ...s,
                name,
                department: dept,
                researchArea: area,
                researchCode: code,
                email,
              }
            : s
        )
      );
      ToastService.success('Scholar record updated.');
    } else {
      const newCode = `DAVV-SCS-PHD-${new Date().getFullYear()}-${String(list.length + 1).padStart(4, '0')}`;
      const newScholar: Scholar = {
        ...scholars[0],
        id: `sch-${Date.now()}`,
        name,
        scholarId: `DAVV-PHD-${new Date().getFullYear().toString().slice(-2)}-${String(list.length + 1).padStart(3, '0')}`,
        department: dept,
        researchArea: area,
        researchCode: code || newCode,
        email,
        status: 'Active',
        phase: 'Topic Registration',
        registrationDate: '30 Jun 2026',
        enrollmentNo: '',
        program: '',
        specialization: '',
        supervisor: '',
        coSupervisor: '',
        mobile: '',
        orcidId: '',
        googleScholarUrl: '',
        researchGateUrl: '',
        domain: area,
        expectedCompletion: '',
        similarity: 0,
      };
      setList(prev => [...prev, newScholar]);
      ToastService.success(
        `Scholar registered! Code: ${newScholar.researchCode}`
      );
    }
    reset();
  };

  const statusColor: Record<string, string> = {
    Active: 'approved',
    Inactive: 'draft',
    Completed: 'submitted',
    Withdrawn: 'rejected',
  };

  return (
    <FormPage
      title="Scholar Registration"
      description="Allocate unique URC research codes and maintain official scholar registration records."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Research Cell', to: thesisUrls.cell.portal },
        { label: 'Scholar Registration' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.5fr 1fr' }}
      >
        <FormCard title="Registered Scholars">
          <div style={{ overflowX: 'auto' }}>
            <table className="dbt-table">
              <thead>
                <tr>
                  <th>Scholar</th>
                  <th>Research Code</th>
                  <th>Department</th>
                  <th>Phase</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 700 }}>{s.name}</td>
                    <td
                      style={{
                        fontSize: '0.688rem',
                        fontWeight: 600,
                        color: '#1e40af',
                      }}
                    >
                      {s.researchCode}
                    </td>
                    <td style={{ fontSize: '0.75rem' }}>
                      {s.department.replace('School of ', '')}
                    </td>
                    <td style={{ fontSize: '0.75rem' }}>{s.phase}</td>
                    <td>
                      <span
                        className={`dbt-status-pill ${statusColor[s.status]}`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          type="button"
                          onClick={() => handleEdit(s)}
                          style={{
                            padding: '0.2rem 0.5rem',
                            border: '1px solid #3b82f6',
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: '0.625rem',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggle(s.id)}
                          style={{
                            padding: '0.2rem 0.5rem',
                            border: '1px solid #f59e0b',
                            background: '#fffbeb',
                            color: '#d97706',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: '0.625rem',
                          }}
                        >
                          {s.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(s.id)}
                          style={{
                            padding: '0.2rem 0.5rem',
                            border: '1px solid #ef4444',
                            background: '#fff',
                            color: '#b91c1c',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: '0.625rem',
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
          title={editId ? 'Edit Scholar Record' : 'Register New Scholar'}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <TextBox
              label="Full Name"
              value={name}
              onChange={setName}
              required
            />
            <TextBox
              label="Department"
              value={dept}
              onChange={setDept}
              required
            />
            <TextBox label="Research Area" value={area} onChange={setArea} />
            <TextBox label="Email" value={email} onChange={setEmail} required />
            <TextBox
              label="Research Code (auto-generated if blank)"
              value={code}
              onChange={setCode}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                label={editId ? 'Update Record' : 'Register Scholar'}
                variant="primary"
                onClick={handleSave}
              />
              {editId && (
                <Button label="Cancel" variant="outlined" onClick={reset} />
              )}
            </div>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
