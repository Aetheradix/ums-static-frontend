import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { departmentMappings, grievanceCategories } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

export default function AdminDepartmentMapping() {
  const [mappings, setMappings] = useState(departmentMappings);

  const [category, setCategory] = useState('');
  const [dept, setDept] = useState('');
  const [nodal, setNodal] = useState('');
  const [email, setEmail] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !dept || !nodal) {
      ToastService.error('All mandatory fields must be completed.');
      return;
    }

    const newMap = {
      id: `DM00${mappings.length + 1}`,
      category,
      department: dept,
      nodal,
      email,
    };

    setMappings(prev => [...prev, newMap]);
    ToastService.success(`Assigned category ${category} mapping successfully.`);
    setCategory('');
    setDept('');
    setNodal('');
    setEmail('');
  };

  const handleDelete = (id: string) => {
    setMappings(prev => prev.filter(m => m.id !== id));
    ToastService.error('Mapping deleted successfully.');
  };

  return (
    <FormPage
      title="Department & Nodal Mapping"
      description="Map petition categories to university departments and designate responsible nodal officers."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Admin Portal', to: grvUrls.admin.portal },
        { label: 'Department Mapping' },
      ]}
    >
      <div
        className="grv-bottom-row"
        style={{ gridTemplateColumns: '1.2fr 2fr' }}
      >
        {/* Form left */}
        <FormCard title="Map Category to Department" icon="map">
          <form onSubmit={handleAdd}>
            <FormGrid columns={1}>
              <DropDownList
                label="Complaint Category *"
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
              <TextBox
                label="Department Section *"
                placeholder="e.g. Examination Section"
                value={dept}
                onChange={setDept}
                required
              />
              <TextBox
                label="Designated Nodal Officer *"
                placeholder="e.g. Dr. Rakesh Verma"
                value={nodal}
                onChange={setNodal}
                required
              />
              <TextBox
                label="Officer Email *"
                placeholder="e.g. nodal.exam@davv.ac.in"
                value={email}
                onChange={setEmail}
                required
              />
              <div className="mt-4">
                <Button
                  label="Create Routing Rule"
                  icon="plus"
                  variant="primary"
                  type="submit"
                  className="w-full"
                />
              </div>
            </FormGrid>
          </form>
        </FormCard>

        {/* Right table */}
        <FormCard title="Active Routing Rules Master" icon="list">
          <table className="grv-table text-xs">
            <thead>
              <tr>
                <th>Rule ID</th>
                <th>Category</th>
                <th>Target Department</th>
                <th>Nodal Officer Name</th>
                <th>Officer Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {mappings.map(m => (
                <tr key={m.id}>
                  <td className="font-mono font-bold">{m.id}</td>
                  <td className="font-bold text-slate-800">{m.category}</td>
                  <td>{m.department}</td>
                  <td className="font-bold">{m.nodal}</td>
                  <td>{m.email}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleDelete(m.id)}
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
