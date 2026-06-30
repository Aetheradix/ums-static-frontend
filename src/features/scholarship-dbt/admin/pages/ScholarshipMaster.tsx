import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { scholarshipSchemes } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

export default function AdminScholarshipMaster() {
  const [list, setList] = useState(scholarshipSchemes);
  const [name, setName] = useState('');
  const [type, setType] = useState('University');
  const [amount, setAmount] = useState('');

  const handleAdd = () => {
    if (!name || !amount) {
      ToastService.error('Please fill name and amount.');
      return;
    }
    const newSch = {
      id: `sch-${list.length + 1}`,
      name,
      type: type as any,
      category: ['General', 'OBC', 'SC', 'ST'],
      lastDate: '31 Dec 2025',
      amount: Number(amount),
      eligibility: 'Configured by rules engine',
      portal: 'University Portal',
      status: 'Open' as const,
      color: '#4f46e5',
    };
    setList([...list, newSch]);
    setName('');
    setAmount('');
    ToastService.success('New scholarship master entry created.');
  };

  const handleDelete = (id: string) => {
    setList(prev => prev.filter(s => s.id !== id));
    ToastService.success('Scholarship deleted.');
  };

  return (
    <FormPage
      title="Scholarship Master"
      description="Manage University and private scholarship programmes."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Admin Portal', to: dbtUrls.admin.portal },
        { label: 'Scholarship Master' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.2fr 1fr' }}
      >
        <FormCard title="Scholarships List">
          <div style={{ overflowX: 'auto' }}>
            <table className="dbt-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {list.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 700 }}>{s.name}</td>
                    <td>{s.type}</td>
                    <td>₹{s.amount.toLocaleString()}</td>
                    <td>
                      <span
                        className={`dbt-status-pill ${s.status.toLowerCase()}`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleDelete(s.id)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          border: '1px solid #ef4444',
                          background: '#fff',
                          color: '#b91c1c',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormCard>

        <FormCard title="Add New Scholarship Program">
          <TextBox
            label="Scholarship Program Name"
            value={name}
            onChange={setName}
            required
          />
          <div style={{ marginTop: '0.75rem' }}>
            <label
              style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151' }}
            >
              Program Type
            </label>
            <select
              className="dbt-filter-select"
              style={{ width: '100%', marginTop: 4, height: 38 }}
              value={type}
              onChange={e => setType(e.target.value)}
            >
              <option value="University">University</option>
              <option value="Private">Private</option>
              <option value="Central">Central Govt Sponsored</option>
              <option value="State">State Govt Sponsored</option>
            </select>
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            <TextBox
              label="Intake/Disbursement Amount (₹)"
              type="number"
              value={amount}
              onChange={setAmount}
              required
            />
          </div>
          <div style={{ marginTop: '1rem' }}>
            <Button
              label="Add Scholarship"
              variant="primary"
              onClick={handleAdd}
            />
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
