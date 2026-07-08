import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage, GridPanel } from 'shared/new-components';
import { useResearch } from '../context';
import '../research.css';
import { AGENCY_OPTIONS, BLANK_PROJECT_FORM, CATEGORY_OPTIONS } from '../data';

const CATEGORY_DROPDOWN: Data.DataItem<string>[] = CATEGORY_OPTIONS.map(c => ({
  id: c,
  text: c,
}));

const DURATION_OPTIONS: Data.DataItem<string>[] = [
  { id: '12', text: '12 Months (1 Year)' },
  { id: '18', text: '18 Months (1.5 Years)' },
  { id: '24', text: '24 Months (2 Years)' },
  { id: '36', text: '36 Months (3 Years)' },
];

const STATUS_FILTER_OPTIONS: Data.DataItem<string | null>[] = [
  { id: null, text: 'All Status' },
  { id: 'Active', text: 'Active' },
  { id: 'Pending Evaluation', text: 'Pending Evaluation' },
  { id: 'Under Revision', text: 'Under Revision' },
];

export default function ProjectRegistry() {
  const {
    projects,
    setProjects,
    projectForm,
    setProjectForm,
    triggerNotification,
  } = useResearch();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const set = <K extends keyof ResearchManagement.ProjectForm>(
    key: K,
    value: ResearchManagement.ProjectForm[K]
  ) => setProjectForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.totalBudget || !projectForm.piName) {
      triggerNotification('Please fill in all mandatory fields.', 'error');
      return;
    }

    const code = `STU-GR-2026-00${projects.length + 1}`;
    const newProject: ResearchManagement.Project = {
      code,
      title: projectForm.title,
      agency: projectForm.agency || 'Internal Funding Scheme',
      type: 'Sponsored Research',
      category: projectForm.category,
      approvedBudget: parseFloat(projectForm.totalBudget) || 0,
      disbursedFunds: 0,
      overheadPercentage: 10,
      piName: projectForm.piName,
      piMobile: projectForm.coPiMobile || '9876543210',
      piEmail: 'pi.project@stu.ac.in',
      durationMonths: parseInt(projectForm.duration) || 24,
      ethicsStatus: 'Approved',
      milestonesCount: 3,
      completedMilestones: 0,
      status: 'Active',
      synopsis: 'Manually registered university core baseline project.',
    };

    setProjects(prev => [...prev, newProject]);
    triggerNotification(`Project registered! Reference Code: ${code}`);
    setProjectForm({ ...BLANK_PROJECT_FORM });
  };

  const filtered = projects.filter(p => {
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.piName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || p.status === filterStatus;
    const matchCategory = !filterCategory || p.category === filterCategory;
    return matchSearch && matchStatus && matchCategory;
  });

  return (
    <FormPage
      title="Grants Ledger & Projects Registry"
      description="Register and manage sponsored research projects, institutional overhead settings, and PI profiles"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Research Management', to: '/research-management/dashboard' },
        { label: 'Project Registry' },
      ]}
    >
      {/* â”€â”€ Registration Form â”€â”€ */}
      <FormCard title="Register New Baseline Project" icon="book">
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <p className="form-sub-section-label">A. Core Information</p>
            <FormGrid columns={3}>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  STU Reference Code (Auto-Assigned)
                </label>
                <input
                  type="text"
                  disabled
                  placeholder={`STU-GR-2026-00${projects.length + 1}`}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-sm text-slate-500 cursor-not-allowed font-mono"
                />
              </div>
              <TextBox
                label="Project Research Title *"
                placeholder="e.g. Ultra-Low Thermal Resistance Solid State Batteries"
                value={projectForm.title}
                onChange={v => set('title', v)}
              />
              <TextBox
                label="Funding Sponsoring Agency"
                placeholder="e.g. Department of Biotechnology (DBT)"
                value={projectForm.agency}
                onChange={v => set('agency', v)}
              />
              <DropDownList
                label="Research Category"
                data={CATEGORY_DROPDOWN}
                textField="text"
                valueField="id"
                value={projectForm.category}
                onChange={v => set('category', v as string)}
              />
              <TextBox
                label="Total Baseline Budget (INR) *"
                placeholder="e.g. 2500000"
                value={projectForm.totalBudget}
                onChange={v => set('totalBudget', v)}
              />
              <DropDownList
                label="Project Duration"
                data={DURATION_OPTIONS}
                textField="text"
                valueField="id"
                value={projectForm.duration}
                onChange={v => set('duration', v as string)}
              />
            </FormGrid>
          </div>

          <div className="mt-4">
            <p className="form-sub-section-label">B. Investigator Profiles</p>
            <FormGrid columns={3}>
              <TextBox
                label="Principal Investigator (PI) *"
                placeholder="Dr. FirstName LastName"
                value={projectForm.piName}
                onChange={v => set('piName', v)}
              />
              <TextBox
                label="Co-Principal Investigator (Co-PI)"
                placeholder="Dr./Prof. Investigator Name"
                value={projectForm.coPiName}
                onChange={v => set('coPiName', v)}
              />
              <TextBox
                label="PI Contact Number"
                placeholder="10-digit number"
                value={projectForm.coPiMobile}
                onChange={v => set('coPiMobile', v)}
              />
            </FormGrid>
          </div>

          <div className="form-actions-row mt-4">
            <Button
              label="Establish Project"
              icon="plus"
              variant="primary"
              type="submit"
            />
            <Button
              label="Clear Fields"
              variant="outlined"
              onClick={() => setProjectForm({ ...BLANK_PROJECT_FORM })}
            />
          </div>
        </form>
      </FormCard>

      {/* â”€â”€ Projects Table â”€â”€ */}
      <FormCard title="Active Projects Database" icon="list">
        <div className="flex gap-3 mb-4 flex-wrap">
          <TextBox
            label=""
            placeholder="Search by title, code, or PI..."
            value={search}
            onChange={v => setSearch(v)}
          />
          <DropDownList
            label=""
            data={STATUS_FILTER_OPTIONS}
            textField="text"
            valueField="id"
            value={filterStatus}
            onChange={v => setFilterStatus(v as string | null)}
          />
          <DropDownList
            label=""
            data={
              [
                { id: null, text: 'All Categories' },
                ...CATEGORY_DROPDOWN,
              ] as Data.DataItem<string | null>[]
            }
            textField="text"
            valueField="id"
            value={filterCategory}
            onChange={v => setFilterCategory(v as string | null)}
          />
        </div>
        <GridPanel
          data={filtered}
          columns={[
            {
              cell: (_, o) => <span>{(o.rowIndex ?? 0) + 1}</span>,
              width: '40px',
            },
            { field: 'code', header: 'STU Code' },
            { field: 'title', header: 'Project Title' },
            { field: 'agency', header: 'Agency' },
            { field: 'category', header: 'Category' },
            {
              field: 'approvedBudget',
              header: 'Budget (INR)',
              cell: (item: ResearchManagement.Project) => (
                <span className="font-mono text-xs">
                  â‚¹{item.approvedBudget.toLocaleString()}
                </span>
              ),
            },
            {
              field: 'disbursedFunds',
              header: 'Disbursed (INR)',
              cell: (item: ResearchManagement.Project) => (
                <span className="font-mono text-xs text-indigo-700 font-bold">
                  â‚¹{item.disbursedFunds.toLocaleString()}
                </span>
              ),
            },
            {
              field: 'ethicsStatus',
              header: 'Ethics',
              cell: (item: ResearchManagement.Project) => (
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold ${
                    item.ethicsStatus === 'Approved'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {item.ethicsStatus}
                </span>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              cell: (item: ResearchManagement.Project) => (
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold ${
                    item.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-700'
                      : item.status === 'Pending Evaluation'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.status}
                </span>
              ),
            },
            { field: 'piName', header: 'Principal Investigator' },
          ]}
          searchBox
        />
      </FormCard>
    </FormPage>
  );
}

// Suppress unused import warning
void AGENCY_OPTIONS;
