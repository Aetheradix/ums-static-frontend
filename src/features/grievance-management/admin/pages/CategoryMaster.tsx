import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { grievanceCategories } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

export default function AdminCategoryMaster() {
  const [categories, setCategories] = useState(grievanceCategories);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [committee, setCommittee] = useState('SGRC');
  const [slaHours, setSlaHours] = useState('72');
  const [subCat, setSubCat] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      ToastService.error('Name and Code are mandatory.');
      return;
    }

    const newCat = {
      id: `CAT00${categories.length + 1}`,
      name,
      code: code.toUpperCase(),
      committee,
      color: '#3b82f6',
      subCategories: subCat
        ? subCat.split(',').map(s => s.trim())
        : ['General'],
      defaultSLAHours: Number(slaHours) || 72,
    };

    setCategories(prev => [...prev, newCat]);
    ToastService.success(`Category ${name} successfully configured.`);
    setName('');
    setCode('');
    setSubCat('');
  };

  const handleDelete = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    ToastService.error('Category successfully retired.');
  };

  return (
    <FormPage
      title="Category Configuration Desk"
      description="Define statutory complaint categories, map them to UGC committees and configure default SLA timers."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Admin Portal', to: grvUrls.admin.portal },
        { label: 'Category Master' },
      ]}
    >
      <div
        className="grv-bottom-row"
        style={{ gridTemplateColumns: '1.2fr 2fr' }}
      >
        {/* Form left */}
        <FormCard title="Configure Category Form" icon="add">
          <form onSubmit={handleAdd}>
            <FormGrid columns={1}>
              <TextBox
                label="Category Name *"
                placeholder="e.g. Hostel & Infrastructure"
                value={name}
                onChange={setName}
                required
              />
              <TextBox
                label="Category Code *"
                placeholder="e.g. HOSTEL"
                value={code}
                onChange={setCode}
                required
              />
              <DropDownList
                label="Mapped Committee *"
                data={[
                  {
                    name: 'SGRC (Student Grievance Redressal Committee)',
                    value: 'SGRC',
                  },
                  {
                    name: 'ICC (Internal Complaints Committee)',
                    value: 'ICC / Women Cell',
                  },
                  { name: 'Anti-Ragging Cell', value: 'Anti-Ragging Cell' },
                  { name: 'SC/ST Cell', value: 'SC/ST Cell' },
                  {
                    name: 'Finance Grievance Committee',
                    value: 'Finance Committee',
                  },
                ]}
                textField="name"
                optionValue="value"
                value={committee}
                onChange={val => setCommittee(String(val ?? 'SGRC'))}
                required
              />
              <TextBox
                label="Default SLA Deadline Hours *"
                placeholder="e.g. 72"
                value={slaHours}
                onChange={setSlaHours}
                required
              />
              <TextBox
                label="Cascading Subcategories (Comma separated)"
                placeholder="e.g. Mess Quality, Maintenance, Security"
                value={subCat}
                onChange={setSubCat}
              />
              <div className="mt-4">
                <Button
                  label="Create Category"
                  icon="plus"
                  variant="primary"
                  type="submit"
                  className="w-full"
                />
              </div>
            </FormGrid>
          </form>
        </FormCard>

        {/* Right Side Table */}
        <FormCard title="Registered Grievance Categories Master" icon="list">
          <table className="grv-table text-xs">
            <thead>
              <tr>
                <th>ID / Code</th>
                <th>Category Title</th>
                <th>Mapped Committee</th>
                <th>SLA Hrs</th>
                <th>Sub-Categories</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id}>
                  <td>
                    <div className="font-bold text-slate-800">{c.code}</div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {c.id}
                    </span>
                  </td>
                  <td className="font-bold">{c.name}</td>
                  <td>{c.committee}</td>
                  <td className="font-mono font-bold">{c.defaultSLAHours}h</td>
                  <td>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {c.subCategories.slice(0, 3).map(sub => (
                        <span
                          key={sub}
                          className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-medium"
                        >
                          {sub}
                        </span>
                      ))}
                      {c.subCategories.length > 3 && (
                        <span className="text-[10px] text-slate-400 font-bold">
                          +{c.subCategories.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-bold"
                    >
                      Delete
                    </button>
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
