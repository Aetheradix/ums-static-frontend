import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox, DropDownList } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import {
  grievanceCategories,
  committees,
  departmentMappings,
} from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

export default function AdminMasters() {
  const [activeTab, setActiveTab] = useState('category');

  // Input states
  const [newCatName, setNewCatName] = useState('');
  const [newCatCode, setNewCatCode] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [targetCategory, setTargetCategory] = useState(
    grievanceCategories[0]?.name || ''
  );
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptOfficer, setNewDeptOfficer] = useState('');
  const [newCommName, setNewCommName] = useState('');
  const [newCommChair, setNewCommChair] = useState('');

  // Masters lists in states for simulation
  const [categories, setCategories] = useState(grievanceCategories);
  const [depts, setDepts] = useState(departmentMappings);
  const [comms, setComms] = useState(committees);
  const statuses = [
    { code: 'SUB', name: 'Submitted', desc: 'Lodged by complainant.' },
    {
      code: 'DEPT',
      name: 'Department Review',
      desc: 'Under review by Nodal Officer, green notesheet drafted.',
    },
    {
      code: 'HOD',
      name: 'HoD Review',
      desc: 'Reviewed by department head, remarks appended.',
    },
    {
      code: 'COMM',
      name: 'Committee Review',
      desc: 'Hearing conducted by statutory committee.',
    },
    {
      code: 'REG',
      name: 'Registrar Decision',
      desc: 'Final dispute resolution letter sanctioned.',
    },
    {
      code: 'CLSD',
      name: 'Closed',
      desc: 'Resolution letter dispatched, file closed.',
    },
  ];

  const handleAddCategory = () => {
    if (!newCatName || !newCatCode) {
      ToastService.error('Please fill category name and code.');
      return;
    }
    const newCat = {
      id: `CAT00${categories.length + 1}`,
      name: newCatName,
      code: newCatCode.toUpperCase(),
      committee: 'Student Grievance Redressal Committee (SGRC)',
      color: '#3b82f6',
      subCategories: [],
    };
    setCategories([...categories, newCat]);
    setNewCatName('');
    setNewCatCode('');
    ToastService.success(
      'New Grievance Category added to Master successfully.'
    );
  };

  const handleAddSubCategory = () => {
    if (!newSubName) {
      ToastService.error('Please enter sub-category name.');
      return;
    }
    const updated = categories.map(c => {
      if (c.name === targetCategory) {
        return { ...c, subCategories: [...c.subCategories, newSubName] };
      }
      return c;
    });
    setCategories(updated);
    setNewSubName('');
    ToastService.success(
      `Sub-category added under ${targetCategory} master list.`
    );
  };

  const handleAddDept = () => {
    if (!newDeptName || !newDeptOfficer) {
      ToastService.error(
        'Please enter department name and Nodal Officer name.'
      );
      return;
    }
    const newD = {
      id: `DM00${depts.length + 1}`,
      categoryName: 'Unmapped',
      primaryDepartment: newDeptName,
      contactOfficer: newDeptOfficer,
      status: 'Active' as const,
    };
    setDepts([...depts, newD]);
    setNewDeptName('');
    setNewDeptOfficer('');
    ToastService.success('Department Master updated successfully.');
  };

  const handleAddCommittee = () => {
    if (!newCommName || !newCommChair) {
      ToastService.error('Committee Name and Chairperson are required.');
      return;
    }
    const newC = {
      id: `COM00${comms.length + 1}`,
      name: newCommName,
      acronym: newCommName
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase(),
      type: 'Statutory Body',
      chair: newCommChair,
      status: 'Active' as const,
      color: 'indigo',
      mandate:
        'Statutory advisory panel convened under university regulations.',
      totalCases: 0,
      members: [],
    };
    setComms([...comms, newC]);
    setNewCommName('');
    setNewCommChair('');
    ToastService.success('Committee Panel created in Committee Master.');
  };

  return (
    <FormPage
      title="ERP System Masters Console"
      description="DAVV Indore — Manage standard definitions for category mapping, department contacts, committees, and statuses."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Admin Portal', to: grvUrls.admin.portal },
        { label: 'Masters' },
      ]}
    >
      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 mb-4 bg-white p-2 rounded-t-lg">
        {[
          { label: 'Category Master', key: 'category', icon: 'pi-tag' },
          { label: 'Sub Category Master', key: 'subcategory', icon: 'pi-tags' },
          {
            label: 'Department Master',
            key: 'department',
            icon: 'pi-building',
          },
          { label: 'Committee Master', key: 'committee', icon: 'pi-users' },
          { label: 'Status Master', key: 'status', icon: 'pi-check' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === tab.key
                ? 'bg-green-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <i className={`pi ${tab.icon} text-[10px]`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'category' && (
        <div className="space-y-4">
          <FormCard title="Add New Grievance Category">
            <FormGrid columns={3}>
              <TextBox
                label="Category Name *"
                placeholder="e.g. Academic Grievance"
                value={newCatName}
                onChange={setNewCatName}
              />
              <TextBox
                label="Category Code *"
                placeholder="e.g. ACAD"
                value={newCatCode}
                onChange={setNewCatCode}
              />
              <div className="flex items-end">
                <Button
                  label="Add Category"
                  variant="primary"
                  onClick={handleAddCategory}
                />
              </div>
            </FormGrid>
          </FormCard>

          <FormCard title="Intake Categories List">
            <table className="grv-table w-full text-xs">
              <thead>
                <tr>
                  <th className="w-24">ID</th>
                  <th className="w-32">Code</th>
                  <th>Category Name</th>
                  <th>Default Committee Panel Assigned</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(c => (
                  <tr key={c.id}>
                    <td className="font-mono font-bold">{c.id}</td>
                    <td className="font-mono font-bold text-blue-600">
                      {c.code}
                    </td>
                    <td className="font-bold text-slate-700">{c.name}</td>
                    <td>{c.committee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </FormCard>
        </div>
      )}

      {activeTab === 'subcategory' && (
        <div className="space-y-4">
          <FormCard title="Map New Sub-Category">
            <FormGrid columns={3}>
              <DropDownList
                label="Parent Category *"
                data={categories.map(c => ({ name: c.name, value: c.name }))}
                textField="name"
                optionValue="value"
                value={targetCategory}
                onChange={val => setTargetCategory(val as string)}
              />
              <TextBox
                label="Sub-Category Name *"
                placeholder="e.g. Examination Form Issue"
                value={newSubName}
                onChange={setNewSubName}
              />
              <div className="flex items-end">
                <Button
                  label="Add Sub-Category"
                  variant="primary"
                  onClick={handleAddSubCategory}
                />
              </div>
            </FormGrid>
          </FormCard>

          <FormCard title="Category & Sub-Categories Hierarchy">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map(c => (
                <div
                  key={c.id}
                  className="p-3 border rounded-lg bg-slate-50 text-xs"
                >
                  <div className="font-bold text-indigo-900 border-b pb-1 mb-2 flex justify-between">
                    <span>
                      {c.name} ({c.code})
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Total: {c.subCategories.length}
                    </span>
                  </div>
                  <ul className="space-y-1.5 list-disc pl-4 text-slate-600 font-medium">
                    {c.subCategories.length === 0 ? (
                      <span className="italic text-slate-400 text-[10px]">
                        No sub-categories configured.
                      </span>
                    ) : (
                      c.subCategories.map((sc, idx) => <li key={idx}>{sc}</li>)
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </FormCard>
        </div>
      )}

      {activeTab === 'department' && (
        <div className="space-y-4">
          <FormCard title="Add University Department Master">
            <FormGrid columns={3}>
              <TextBox
                label="Department Name *"
                placeholder="e.g. School of Commerce"
                value={newDeptName}
                onChange={setNewDeptName}
              />
              <TextBox
                label="Nodal Officer Name *"
                placeholder="e.g. Dr. Ramesh Verma"
                value={newDeptOfficer}
                onChange={setNewDeptOfficer}
              />
              <div className="flex items-end">
                <Button
                  label="Add Department"
                  variant="primary"
                  onClick={handleAddDept}
                />
              </div>
            </FormGrid>
          </FormCard>

          <FormCard title="University Departments List">
            <table className="grv-table w-full text-xs">
              <thead>
                <tr>
                  <th className="w-24">ID</th>
                  <th>Department / Section Name</th>
                  <th>Nodal Officer Name</th>
                  <th className="w-24 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {depts.map(d => (
                  <tr key={d.id}>
                    <td className="font-mono font-bold">{d.id}</td>
                    <td className="font-bold text-slate-700">
                      {d.primaryDepartment}
                    </td>
                    <td>{d.contactOfficer}</td>
                    <td className="text-center">
                      <span className="grv-status-pill approved">
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </FormCard>
        </div>
      )}

      {activeTab === 'committee' && (
        <div className="space-y-4">
          <FormCard title="Define Statutory Committee">
            <FormGrid columns={3}>
              <TextBox
                label="Committee Name *"
                placeholder="e.g. Anti-Ragging Committee"
                value={newCommName}
                onChange={setNewCommName}
              />
              <TextBox
                label="Chairperson *"
                placeholder="e.g. Dean Student Welfare"
                value={newCommChair}
                onChange={setNewCommChair}
              />
              <div className="flex items-end">
                <Button
                  label="Create Committee"
                  variant="primary"
                  onClick={handleAddCommittee}
                />
              </div>
            </FormGrid>
          </FormCard>

          <FormCard title="Active Committees List">
            <table className="grv-table w-full text-xs">
              <thead>
                <tr>
                  <th className="w-24">ID</th>
                  <th className="w-28">Acronym</th>
                  <th>Committee Title</th>
                  <th>Panel Chairperson</th>
                  <th className="w-24 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {comms.map(c => (
                  <tr key={c.id}>
                    <td className="font-mono font-bold">{c.id}</td>
                    <td className="font-mono font-bold text-blue-600">
                      {c.acronym}
                    </td>
                    <td className="font-bold text-slate-700">{c.name}</td>
                    <td>{c.chair}</td>
                    <td className="text-center">
                      <span className="grv-status-pill approved">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </FormCard>
        </div>
      )}

      {activeTab === 'status' && (
        <FormCard title="eOffice File Status Master Configuration">
          <p className="text-xs text-slate-500 mb-4">
            System status definitions conform to Government Office file tracking
            stages. Modifying status keys will affect active workflow routing
            definitions.
          </p>
          <table className="grv-table w-full text-xs">
            <thead>
              <tr>
                <th className="w-32">Status Code</th>
                <th className="w-48">Status Label</th>
                <th>Workflow Stage description</th>
              </tr>
            </thead>
            <tbody>
              {statuses.map(s => (
                <tr key={s.code}>
                  <td className="font-mono font-bold text-blue-600">
                    {s.code}
                  </td>
                  <td className="font-bold text-slate-700">{s.name}</td>
                  <td className="text-slate-500 font-medium">{s.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </FormCard>
      )}
    </FormPage>
  );
}
