import { useState, useMemo } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox, DropDownList } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import {
  grievanceCategories,
  committees,
  departmentMappings,
  type GrievanceCategory,
  type Committee,
  type CommitteeMember,
  type CommitteeMemberRole,
} from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

const TABS = [
  { id: 'category', label: 'Grievance Categories', icon: 'category' },
  { id: 'subcategory', label: 'Sub-Categories', icon: 'list' },
  { id: 'department', label: 'Department Mappings', icon: 'business' },
  { id: 'committee', label: 'Committees', icon: 'groups' },
  { id: 'status', label: 'Status Master', icon: 'flag' },
];

const STATUS_MASTER = [
  {
    code: 'SUB',
    name: 'Submitted',
    desc: 'Lodged by complainant. Pending assignment.',
  },
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

const STATUS_BADGE: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Inactive: 'bg-red-100 text-red-700',
};

const MEMBER_ROLES: CommitteeMemberRole[] = [
  'Chairman',
  'Convener',
  'Member Secretary',
  'Academic Member',
  'Faculty Representative',
  'Administrative Officer',
  'Student Welfare Officer',
  'SC/ST Cell Representative',
  'OBC Cell Representative',
  'Women Cell Representative',
  'Anti-Ragging Cell Representative',
  'Hostel Representative',
  'Legal Officer',
  'External Expert',
];

interface SubCategoryRow {
  id: string;
  categoryName: string;
  categoryCode: string;
  subCategoryName: string;
}

export default function AdminMasters() {
  const [activeTab, setActiveTab] = useState('category');

  // ─── Masters states ──────────────────────────────────────────────
  const [categories, setCategories] =
    useState<GrievanceCategory[]>(grievanceCategories);
  const [depts, setDepts] = useState(departmentMappings);
  const [comms, setComms] = useState<Committee[]>(committees);

  // ─── Tab 1: Category Master State ──────────────────────────────
  const [catSearch, setCatSearch] = useState('');
  const [catSort, setCatSort] = useState<keyof GrievanceCategory>('name');
  const [catSortAsc, setCatSortAsc] = useState(true);
  const [catPage, setCatPage] = useState(1);
  const [showCatModal, setShowCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatCode, setNewCatCode] = useState('');
  const [newCommittee, setNewCommittee] = useState('');

  const filteredCats = useMemo(
    () =>
      categories
        .filter(
          c =>
            !catSearch ||
            c.name.toLowerCase().includes(catSearch.toLowerCase()) ||
            c.code.toLowerCase().includes(catSearch.toLowerCase())
        )
        .sort((a, b) => {
          const va = String(a[catSort] ?? '');
          const vb = String(b[catSort] ?? '');
          return catSortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
        }),
    [categories, catSearch, catSort, catSortAsc]
  );
  const catPages = Math.ceil(filteredCats.length / 5);
  const paginatedCats = filteredCats.slice((catPage - 1) * 5, catPage * 5);

  const toggleCatSort = (key: keyof GrievanceCategory) => {
    if (catSort === key) setCatSortAsc(!catSortAsc);
    else {
      setCatSort(key);
      setCatSortAsc(true);
    }
  };

  const addCategory = () => {
    if (!newCatName.trim() || !newCatCode.trim()) {
      ToastService.error('Name and Code are required.');
      return;
    }
    setCategories(prev => [
      ...prev,
      {
        id: `CAT${Date.now()}`,
        name: newCatName,
        code: newCatCode.toUpperCase(),
        committee: newCommittee,
        color: '#6b7280',
        subCategories: [],
      },
    ]);
    setNewCatName('');
    setNewCatCode('');
    setNewCommittee('');
    setShowCatModal(false);
    ToastService.success('Category added successfully.');
  };

  // ─── Tab 2: Sub-Category Grid & Modal State ─────────────────────
  const [subSearch, setSubSearch] = useState('');
  const [subPage, setSubPage] = useState(1);
  const [showSubModal, setShowSubModal] = useState(false);
  const [targetCatId, setTargetCatId] = useState('');
  const [newSubName, setNewSubName] = useState('');

  const subCategoryRows = useMemo(() => {
    const rows: SubCategoryRow[] = [];
    categories.forEach(c => {
      c.subCategories.forEach((sub, i) => {
        rows.push({
          id: `${c.id}-${i}`,
          categoryName: c.name,
          categoryCode: c.code,
          subCategoryName: sub,
        });
      });
    });
    return rows;
  }, [categories]);

  const filteredSubs = useMemo(() => {
    const q = subSearch.toLowerCase();
    return subCategoryRows.filter(
      r =>
        !q ||
        r.categoryName.toLowerCase().includes(q) ||
        r.subCategoryName.toLowerCase().includes(q) ||
        r.categoryCode.toLowerCase().includes(q)
    );
  }, [subCategoryRows, subSearch]);

  const subPages = Math.ceil(filteredSubs.length / 5);
  const paginatedSubs = filteredSubs.slice((subPage - 1) * 5, subPage * 5);

  const addSubCategory = () => {
    if (!targetCatId || !newSubName.trim()) {
      ToastService.error('Parent Category and Sub-category Name are required.');
      return;
    }
    setCategories(prev =>
      prev.map(c =>
        c.id === targetCatId
          ? { ...c, subCategories: [...c.subCategories, newSubName.trim()] }
          : c
      )
    );
    setNewSubName('');
    setShowSubModal(false);
    ToastService.success('Sub-Category added successfully.');
  };

  const deleteSubCategory = (catName: string, subName: string) => {
    setCategories(prev =>
      prev.map(c =>
        c.name === catName
          ? { ...c, subCategories: c.subCategories.filter(s => s !== subName) }
          : c
      )
    );
    ToastService.success('Sub-Category deleted.');
  };

  // ─── Tab 3: Department Mapping State ─────────────────────────────
  const [deptSearch, setDeptSearch] = useState('');
  const [deptStatusFilter, setDeptStatusFilter] = useState('');
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [newDeptCat, setNewDeptCat] = useState('');
  const [newDeptDept, setNewDeptDept] = useState('');
  const [newDeptOfficer, setNewDeptOfficer] = useState('');

  const filteredDepts = useMemo(
    () =>
      depts.filter(d => {
        const q = deptSearch.toLowerCase();
        return (
          (!q ||
            d.categoryName.toLowerCase().includes(q) ||
            d.primaryDepartment.toLowerCase().includes(q) ||
            d.contactOfficer.toLowerCase().includes(q)) &&
          (!deptStatusFilter || d.status === deptStatusFilter)
        );
      }),
    [depts, deptSearch, deptStatusFilter]
  );

  const toggleDeptStatus = (id: string) =>
    setDepts(prev =>
      prev.map(d =>
        d.id === id
          ? { ...d, status: d.status === 'Active' ? 'Inactive' : 'Active' }
          : d
      )
    );

  const addDeptMapping = () => {
    if (!newDeptCat || !newDeptDept || !newDeptOfficer) {
      ToastService.error('All fields are required.');
      return;
    }
    setDepts(prev => [
      ...prev,
      {
        id: `DM${Date.now()}`,
        categoryName: newDeptCat,
        primaryDepartment: newDeptDept,
        contactOfficer: newDeptOfficer,
        status: 'Active',
      },
    ]);
    setNewDeptCat('');
    setNewDeptDept('');
    setNewDeptOfficer('');
    setShowDeptModal(false);
    ToastService.success('Department mapping added.');
  };

  // ─── Tab 4: Committee Builder State ──────────────────────────────
  const [commSearch, setCommSearch] = useState('');
  const [showCommModal, setShowCommModal] = useState(false);
  const [newCommName, setNewCommName] = useState('');
  const [newCommAcronym, setNewCommAcronym] = useState('');
  const [newCommType, setNewCommType] = useState('');
  const [newCommMandate, setNewCommMandate] = useState('');
  const [newCommChair, setNewCommChair] = useState('');
  const [newCommStatus, setNewCommStatus] = useState<'Active' | 'Inactive'>(
    'Active'
  );

  // Committee builder member list state
  const [commMembers, setCommMembers] = useState<Omit<CommitteeMember, 'id'>[]>(
    []
  );

  // Individual member add form within modal
  const [mName, setMName] = useState('');
  const [mDesig, setMDesig] = useState('');
  const [mDept, setMDept] = useState('');
  const [mEmail, setMEmail] = useState('');
  const [mMobile, setMMobile] = useState('');
  const [mRole, setMRole] = useState<CommitteeMemberRole>('Academic Member');

  const addMemberToCommBuilder = () => {
    if (!mName.trim() || !mDesig.trim() || !mEmail.trim()) {
      ToastService.error('Member Name, Designation, and Email are required.');
      return;
    }
    setCommMembers(prev => [
      ...prev,
      {
        name: mName.trim(),
        designation: mDesig.trim(),
        department: mDept.trim(),
        email: mEmail.trim(),
        mobile: mMobile.trim(),
        role: mRole,
        status: 'Active',
        activeFrom: new Date().toISOString().split('T')[0],
        activeTill: '2027-12-31',
      },
    ]);
    setMName('');
    setMDesig('');
    setMDept('');
    setMEmail('');
    setMMobile('');
    setMRole('Academic Member');
    ToastService.success('Member assigned to draft committee.');
  };

  const removeMemberFromCommBuilder = (idx: number) => {
    setCommMembers(prev => prev.filter((_, i) => i !== idx));
  };

  const saveCommittee = () => {
    if (!newCommName.trim() || !newCommAcronym.trim() || !newCommChair.trim()) {
      ToastService.error(
        'Committee Name, Acronym, and Chairman Name are required.'
      );
      return;
    }
    const newComm: Committee = {
      id: `COM${Date.now()}`,
      name: newCommName.trim(),
      acronym: newCommAcronym.trim().toUpperCase(),
      type: newCommType.trim() || 'Statutory Body',
      chair: newCommChair.trim(),
      mandate: newCommMandate.trim() || 'No official mandate text provided.',
      totalCases: 0,
      status: newCommStatus,
      color: 'blue',
      members: commMembers.map((m, i) => ({ id: `CM-NEW-${i}`, ...m })),
    };

    setComms(prev => [...prev, newComm]);
    setNewCommName('');
    setNewCommAcronym('');
    setNewCommType('');
    setNewCommMandate('');
    setNewCommChair('');
    setNewCommStatus('Active');
    setCommMembers([]);
    setShowCommModal(false);
    ToastService.success('New Committee registered successfully!');
  };

  const filteredComms = useMemo(
    () =>
      comms.filter(
        c =>
          !commSearch ||
          c.name.toLowerCase().includes(commSearch.toLowerCase()) ||
          c.acronym.toLowerCase().includes(commSearch.toLowerCase())
      ),
    [comms, commSearch]
  );

  // ─── Export CSV ───────────────────────────────────────────────
  const exportCSV = (rows: string[][], filename: string) => {
    const blob = new Blob([rows.map(r => r.join(',')).join('\n')], {
      type: 'text/csv',
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  };

  return (
    <FormPage
      title="Masters Configuration"
      description="Manage grievance categories, sub-categories, department mappings, committees, and status masters."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Admin Login', to: grvUrls.admin.portal },
        { label: 'Masters Configuration' },
      ]}
    >
      {/* ── Tab Navigation ─────────────────────────────────────── */}
      <div className="flex flex-wrap gap-1 bg-slate-100 rounded-xl p-1 mb-5">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === t.id ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <span className="material-symbols-outlined text-sm">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* TAB 1: GRIEVANCE CATEGORIES DATA GRID                      */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {activeTab === 'category' && (
        <FormCard title="">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex-1 min-w-[180px]">
              <TextBox
                label=""
                placeholder="🔍  Search by name or code..."
                value={catSearch}
                onChange={v => {
                  setCatSearch(v);
                  setCatPage(1);
                }}
              />
            </div>
            <Button
              label="Export CSV"
              variant="outlined"
              onClick={() =>
                exportCSV(
                  [
                    ['ID', 'Name', 'Code', 'Committee', 'Sub-Categories'],
                    ...categories.map(c => [
                      c.id,
                      c.name,
                      c.code,
                      c.committee,
                      c.subCategories.length.toString(),
                    ]),
                  ],
                  'grievance_categories.csv'
                )
              }
            />
            <Button
              label="+ Add Category"
              variant="primary"
              onClick={() => setShowCatModal(true)}
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {[
                    { label: '#', key: null },
                    {
                      label: 'Category Name',
                      key: 'name' as keyof GrievanceCategory,
                    },
                    { label: 'Code', key: 'code' as keyof GrievanceCategory },
                    { label: 'Actions', key: null },
                  ].map((col, i) => (
                    <th
                      key={i}
                      className={`px-3 py-2.5 text-left font-semibold text-slate-600 ${col.key ? 'cursor-pointer hover:bg-slate-100 select-none' : ''} whitespace-nowrap`}
                      onClick={() => col.key && toggleCatSort(col.key)}
                    >
                      {col.key ? (
                        <div className="flex items-center gap-1">
                          {col.label}
                          <span className="material-symbols-outlined text-slate-400 text-[12px]">
                            {catSort === col.key
                              ? catSortAsc
                                ? 'arrow_upward'
                                : 'arrow_downward'
                              : 'unfold_more'}
                          </span>
                        </div>
                      ) : (
                        col.label
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedCats.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-8 text-center text-slate-400"
                    >
                      No categories found.
                    </td>
                  </tr>
                ) : (
                  paginatedCats.map((cat, idx) => (
                    <tr
                      key={cat.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-3 py-2.5 text-slate-400">
                        {(catPage - 1) * 5 + idx + 1}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span className="font-semibold text-slate-700">
                            {cat.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">
                          {cat.code}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1">
                          <button
                            className="p-1 rounded hover:bg-blue-50 text-blue-500"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-base">
                              edit
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              setCategories(prev =>
                                prev.filter(c => c.id !== cat.id)
                              );
                              ToastService.success('Category removed.');
                            }}
                            className="p-1 rounded hover:bg-red-50 text-red-400"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-base">
                              delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-3 flex-wrap gap-2 text-xs text-slate-500">
            <span>{filteredCats.length} categories total</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCatPage(p => Math.max(1, p - 1))}
                disabled={catPage === 1}
                className="px-2 py-1 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
              >
                ‹ Prev
              </button>
              {Array.from({ length: catPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setCatPage(p)}
                  className={`w-7 h-7 rounded border text-xs ${p === catPage ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 hover:bg-slate-50'}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setCatPage(p => Math.min(catPages, p + 1))}
                disabled={catPage === catPages || catPages === 0}
                className="px-2 py-1 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
              >
                Next ›
              </button>
            </div>
          </div>
        </FormCard>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* TAB 2: SUB-CATEGORIES PROFESSIONAL DATA GRID                */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {activeTab === 'subcategory' && (
        <FormCard title="">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex-1 min-w-[180px]">
              <TextBox
                label=""
                placeholder="🔍  Search by sub-category name or parent category..."
                value={subSearch}
                onChange={v => {
                  setSubSearch(v);
                  setSubPage(1);
                }}
              />
            </div>
            <Button
              label="Export CSV"
              variant="outlined"
              onClick={() =>
                exportCSV(
                  [
                    [
                      'ID',
                      'Parent Category',
                      'Category Code',
                      'Sub-Category Name',
                    ],
                    ...filteredSubs.map(r => [
                      r.id,
                      r.categoryName,
                      r.categoryCode,
                      r.subCategoryName,
                    ]),
                  ],
                  'sub_categories.csv'
                )
              }
            />
            <Button
              label="+ Add Sub-Category"
              variant="primary"
              onClick={() => setShowSubModal(true)}
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2.5 text-left font-semibold text-slate-600">
                    #
                  </th>
                  <th className="px-3 py-2.5 text-left font-semibold text-slate-600">
                    Parent Category
                  </th>
                  <th className="px-3 py-2.5 text-left font-semibold text-slate-600">
                    Category Code
                  </th>
                  <th className="px-3 py-2.5 text-left font-semibold text-slate-600">
                    Sub-Category Name
                  </th>
                  <th className="px-3 py-2.5 text-center font-semibold text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedSubs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-8 text-center text-slate-400"
                    >
                      No sub-categories found.
                    </td>
                  </tr>
                ) : (
                  paginatedSubs.map((row, idx) => (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-3 py-2.5 text-slate-400">
                        {(subPage - 1) * 5 + idx + 1}
                      </td>
                      <td className="px-3 py-2.5 font-semibold text-slate-700">
                        {row.categoryName}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="font-mono text-xs bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                          {row.categoryCode}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-600">
                        {row.subCategoryName}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <button
                          onClick={() =>
                            deleteSubCategory(
                              row.categoryName,
                              row.subCategoryName
                            )
                          }
                          className="p-1 rounded hover:bg-red-50 text-red-400"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-base">
                            delete
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-3 flex-wrap gap-2 text-xs text-slate-500">
            <span>{filteredSubs.length} sub-categories total</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSubPage(p => Math.max(1, p - 1))}
                disabled={subPage === 1}
                className="px-2 py-1 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
              >
                ‹ Prev
              </button>
              {Array.from({ length: subPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setSubPage(p)}
                  className={`w-7 h-7 rounded border text-xs ${p === subPage ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 hover:bg-slate-50'}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setSubPage(p => Math.min(subPages, p + 1))}
                disabled={subPage === subPages || subPages === 0}
                className="px-2 py-1 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
              >
                Next ›
              </button>
            </div>
          </div>
        </FormCard>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* TAB 3: DEPARTMENT MAPPINGS DATA GRID                       */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {activeTab === 'department' && (
        <FormCard title="">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex-1 min-w-[180px]">
              <TextBox
                label=""
                placeholder="🔍  Search by category, department, officer..."
                value={deptSearch}
                onChange={v => setDeptSearch(v)}
              />
            </div>
            <div className="w-36">
              <DropDownList
                label=""
                data={[
                  { name: 'All Status', value: '' },
                  { name: 'Active', value: 'Active' },
                  { name: 'Inactive', value: 'Inactive' },
                ]}
                textField="name"
                optionValue="value"
                value={deptStatusFilter}
                onChange={v => setDeptStatusFilter(v as string)}
              />
            </div>
            <Button
              label="Export CSV"
              variant="outlined"
              onClick={() =>
                exportCSV(
                  [
                    [
                      'ID',
                      'Category',
                      'Department',
                      'Contact Officer',
                      'Status',
                    ],
                    ...depts.map(d => [
                      d.id,
                      d.categoryName,
                      d.primaryDepartment,
                      d.contactOfficer,
                      d.status,
                    ]),
                  ],
                  'department_mappings.csv'
                )
              }
            />
            <Button
              label="+ Add Mapping"
              variant="primary"
              onClick={() => setShowDeptModal(true)}
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2.5 text-left font-semibold text-slate-600">
                    #
                  </th>
                  <th className="px-3 py-2.5 text-left font-semibold text-slate-600">
                    Grievance Category
                  </th>
                  <th className="px-3 py-2.5 text-left font-semibold text-slate-600">
                    Primary Department
                  </th>
                  <th className="px-3 py-2.5 text-left font-semibold text-slate-600">
                    Contact Officer
                  </th>
                  <th className="px-3 py-2.5 text-center font-semibold text-slate-600">
                    Status
                  </th>
                  <th className="px-3 py-2.5 text-center font-semibold text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDepts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-3 py-8 text-center text-slate-400"
                    >
                      No department mappings found.
                    </td>
                  </tr>
                ) : (
                  filteredDepts.map((d, idx) => (
                    <tr
                      key={d.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-3 py-2.5 text-slate-400">{idx + 1}</td>
                      <td className="px-3 py-2.5 font-semibold text-slate-700">
                        {d.categoryName}
                      </td>
                      <td className="px-3 py-2.5 text-slate-600">
                        {d.primaryDepartment}
                      </td>
                      <td className="px-3 py-2.5 text-slate-500">
                        {d.contactOfficer}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <button
                          onClick={() => toggleDeptStatus(d.id)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border cursor-pointer ${d.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}
                        >
                          {d.status}
                        </button>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            className="p-1 rounded hover:bg-blue-50 text-blue-500"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-base">
                              edit
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              setDepts(prev => prev.filter(x => x.id !== d.id));
                              ToastService.success('Mapping removed.');
                            }}
                            className="p-1 rounded hover:bg-red-50 text-red-400"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-base">
                              delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {filteredDepts.length} mappings
          </p>
        </FormCard>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* TAB 4: COMMITTEES DATA GRID & BUILDER                      */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {activeTab === 'committee' && (
        <FormCard title="">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex-1 min-w-[180px]">
              <TextBox
                label=""
                placeholder="🔍  Search committees..."
                value={commSearch}
                onChange={v => setCommSearch(v)}
              />
            </div>
            <Button
              label="Export CSV"
              variant="outlined"
              onClick={() =>
                exportCSV(
                  [
                    [
                      'ID',
                      'Name',
                      'Acronym',
                      'Type',
                      'Chairman',
                      'Total Cases',
                      'Members Count',
                      'Status',
                    ],
                    ...filteredComms.map(c => [
                      c.id,
                      c.name,
                      c.acronym,
                      c.type,
                      c.chair,
                      c.totalCases.toString(),
                      c.members.length.toString(),
                      c.status,
                    ]),
                  ],
                  'committees.csv'
                )
              }
            />
            <Button
              label="+ Add Committee"
              variant="primary"
              onClick={() => {
                setCommMembers([]);
                setShowCommModal(true);
              }}
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2.5 text-left font-semibold text-slate-600">
                    Committee Name
                  </th>
                  <th className="px-3 py-2.5 text-left font-semibold text-slate-600">
                    Acronym
                  </th>
                  <th className="px-3 py-2.5 text-left font-semibold text-slate-600">
                    Type
                  </th>
                  <th className="px-3 py-2.5 text-left font-semibold text-slate-600">
                    Chairman
                  </th>
                  <th className="px-3 py-2.5 text-center font-semibold text-slate-600">
                    Members
                  </th>
                  <th className="px-3 py-2.5 text-center font-semibold text-slate-600">
                    Cases
                  </th>
                  <th className="px-3 py-2.5 text-center font-semibold text-slate-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredComms.map(c => (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-3 py-2.5 font-semibold text-slate-700">
                      {c.name}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="font-mono text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-bold">
                        {c.acronym}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-500 max-w-[180px] truncate">
                      {c.type}
                    </td>
                    <td className="px-3 py-2.5 text-slate-600">{c.chair}</td>
                    <td className="px-3 py-2.5 text-center font-semibold text-blue-600">
                      {c.members.length}
                    </td>
                    <td className="px-3 py-2.5 text-center font-semibold text-orange-600">
                      {c.totalCases}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_BADGE[c.status] ?? 'bg-slate-100 text-slate-700'}`}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {filteredComms.length} committees configured
          </p>
        </FormCard>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* TAB 5: STATUS MASTER                                       */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {activeTab === 'status' && (
        <FormCard title="">
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2.5 text-left font-semibold text-slate-600">
                    #
                  </th>
                  <th className="px-3 py-2.5 text-left font-semibold text-slate-600">
                    Code
                  </th>
                  <th className="px-3 py-2.5 text-left font-semibold text-slate-600">
                    Status Name
                  </th>
                  <th className="px-3 py-2.5 text-left font-semibold text-slate-600">
                    Description
                  </th>
                  <th className="px-3 py-2.5 text-center font-semibold text-slate-600">
                    Stage
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {STATUS_MASTER.map((s, idx) => (
                  <tr key={s.code} className="hover:bg-slate-50">
                    <td className="px-3 py-2.5 text-slate-400">{idx + 1}</td>
                    <td className="px-3 py-2.5">
                      <span className="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">
                        {s.code}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-semibold text-slate-700">
                      {s.name}
                    </td>
                    <td className="px-3 py-2.5 text-slate-500">{s.desc}</td>
                    <td className="px-3 py-2.5 text-center">
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center mx-auto">
                        {idx + 1}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-2 italic">
            Status master is system-defined and cannot be modified.
          </p>
        </FormCard>
      )}

      {/* ── Modal: Add Category ─────────────────────────────────── */}
      {showCatModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setShowCatModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">
                Add New Grievance Category
              </h3>
              <button
                onClick={() => setShowCatModal(false)}
                className="text-slate-400"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-3">
              <TextBox
                label="Category Name *"
                value={newCatName}
                onChange={setNewCatName}
                placeholder="e.g. Research Grievance"
              />
              <TextBox
                label="Category Code *"
                value={newCatCode}
                onChange={setNewCatCode}
                placeholder="e.g. RSCH (max 5 chars)"
              />
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setShowCatModal(false)}
              />
              <Button
                label="Add Category"
                variant="primary"
                onClick={addCategory}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Add Sub-Category ────────────────────────────── */}
      {showSubModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setShowSubModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">
                Add New Sub-Category
              </h3>
              <button
                onClick={() => setShowSubModal(false)}
                className="text-slate-400"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-3">
              <DropDownList
                label="Parent Category *"
                data={categories.map(c => ({ name: c.name, value: c.id }))}
                textField="name"
                optionValue="value"
                value={targetCatId}
                onChange={v => setTargetCatId(v as string)}
              />
              <TextBox
                label="Sub-Category Name *"
                value={newSubName}
                onChange={setNewSubName}
                placeholder="e.g. Course Syllabus Issue"
              />
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setShowSubModal(false)}
              />
              <Button
                label="Add Sub-Category"
                variant="primary"
                onClick={addSubCategory}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Add Department Mapping ──────────────────────── */}
      {showDeptModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setShowDeptModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">
                Add Department Mapping
              </h3>
              <button
                onClick={() => setShowDeptModal(false)}
                className="text-slate-400"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-3">
              <DropDownList
                label="Grievance Category *"
                data={categories.map(c => ({ name: c.name, value: c.name }))}
                textField="name"
                optionValue="value"
                value={newDeptCat}
                onChange={v => setNewDeptCat(v as string)}
              />
              <TextBox
                label="Primary Department *"
                value={newDeptDept}
                onChange={setNewDeptDept}
                placeholder="e.g. School of Computer Science"
              />
              <TextBox
                label="Contact Officer *"
                value={newDeptOfficer}
                onChange={setNewDeptOfficer}
                placeholder="e.g. Dr. Ramesh Kumar (Assoc. Prof.)"
              />
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setShowDeptModal(false)}
              />
              <Button
                label="Add Mapping"
                variant="primary"
                onClick={addDeptMapping}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Create Committee with Members Builder ────────── */}
      {showCommModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setShowCommModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <h3 className="text-base font-bold text-slate-800">
                Create Advisory Committee
              </h3>
              <button
                onClick={() => setShowCommModal(false)}
                className="text-slate-400"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              {/* Part A: Committee General Details */}
              <div className="grid grid-cols-2 gap-3">
                <TextBox
                  label="Committee Name *"
                  value={newCommName}
                  onChange={setNewCommName}
                  placeholder="e.g. Hostels Redressal Committee"
                />
                <TextBox
                  label="Acronym *"
                  value={newCommAcronym}
                  onChange={setNewCommAcronym}
                  placeholder="e.g. HRC"
                />
                <TextBox
                  label="Type / Authority *"
                  value={newCommType}
                  onChange={setNewCommType}
                  placeholder="e.g. Statutory Body"
                />
                <TextBox
                  label="Chairman Name *"
                  value={newCommChair}
                  onChange={setNewCommChair}
                  placeholder="e.g. Prof. Maya Bose"
                />
              </div>
              <TextBox
                label="Committee Mandate"
                value={newCommMandate}
                onChange={setNewCommMandate}
                placeholder="Write brief description of powers and guidelines..."
              />
              <DropDownList
                label="Initial Status"
                data={[
                  { name: 'Active', value: 'Active' },
                  { name: 'Inactive', value: 'Inactive' },
                ]}
                textField="name"
                optionValue="value"
                value={newCommStatus}
                onChange={v => setNewCommStatus(v as 'Active' | 'Inactive')}
              />

              {/* Part B: Committee Members Builder */}
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                <p className="text-xs font-bold text-slate-700 mb-2">
                  Assign Persons / Members to this Committee
                </p>

                {/* Member Input Row */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                  <TextBox
                    label="Person Name"
                    value={mName}
                    onChange={setMName}
                    placeholder="Dr. S. K. Gupta"
                  />
                  <TextBox
                    label="Designation"
                    value={mDesig}
                    onChange={setMDesig}
                    placeholder="Professor"
                  />
                  <TextBox
                    label="Department"
                    value={mDept}
                    onChange={mDept => setMDept(mDept)}
                    placeholder="SCSIT"
                  />
                  <TextBox
                    label="Email Address"
                    value={mEmail}
                    onChange={setMEmail}
                    placeholder="gupta@davv.edu"
                  />
                  <TextBox
                    label="Mobile Number"
                    value={mMobile}
                    onChange={setMMobile}
                    placeholder="98260XXXXX"
                  />
                  <DropDownList
                    label="Assigned Role"
                    data={MEMBER_ROLES.map(r => ({ name: r, value: r }))}
                    textField="name"
                    optionValue="value"
                    value={mRole}
                    onChange={v => setMRole(v as CommitteeMemberRole)}
                  />
                </div>
                <div className="flex justify-end mb-4">
                  <Button
                    label="+ Add Person to Member List"
                    variant="outlined"
                    onClick={addMemberToCommBuilder}
                  />
                </div>

                {/* Added Members Table Preview */}
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Committee Members List ({commMembers.length})
                </p>
                <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                  <table className="w-full text-[11px]">
                    <thead className="bg-slate-50 border-b">
                      <tr>
                        <th className="px-2 py-1 text-left text-slate-500">
                          Name
                        </th>
                        <th className="px-2 py-1 text-left text-slate-500">
                          Designation
                        </th>
                        <th className="px-2 py-1 text-left text-slate-500">
                          Role
                        </th>
                        <th className="px-2 py-1 text-left text-slate-500">
                          Email
                        </th>
                        <th className="px-2 py-1 text-center text-slate-500">
                          Remove
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {commMembers.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-2 py-4 text-center text-slate-400"
                          >
                            No members assigned yet. Minimum 1 Chairman is
                            recommended.
                          </td>
                        </tr>
                      ) : (
                        commMembers.map((m, idx) => (
                          <tr key={idx}>
                            <td className="px-2 py-1 font-semibold text-slate-700">
                              {m.name}
                            </td>
                            <td className="px-2 py-1 text-slate-600">
                              {m.designation}
                            </td>
                            <td className="px-2 py-1 font-semibold text-purple-700">
                              {m.role}
                            </td>
                            <td className="px-2 py-1 text-slate-500">
                              {m.email}
                            </td>
                            <td className="px-2 py-1 text-center">
                              <button
                                onClick={() => removeMemberFromCommBuilder(idx)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <span className="material-symbols-outlined text-sm">
                                  delete
                                </span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-5 border-t pt-3">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setShowCommModal(false)}
              />
              <Button
                label="Create Committee"
                variant="primary"
                onClick={saveCommittee}
              />
            </div>
          </div>
        </div>
      )}
    </FormPage>
  );
}
