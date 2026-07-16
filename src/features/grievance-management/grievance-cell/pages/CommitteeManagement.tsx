import { useState, useMemo } from 'react';
import { FormCard, FormPage } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { TextBox, DropDownList } from 'shared/components/forms';
import {
  committees,
  type Committee,
  type CommitteeMember,
  type CommitteeMemberRole,
} from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

const ROLE_COLORS: Record<CommitteeMemberRole, string> = {
  Chairman: 'bg-purple-100 text-purple-800',
  Convener: 'bg-indigo-100 text-indigo-800',
  'Member Secretary': 'bg-blue-100 text-blue-800',
  'Academic Member': 'bg-cyan-100 text-cyan-800',
  'Faculty Representative': 'bg-teal-100 text-teal-800',
  'Administrative Officer': 'bg-green-100 text-green-800',
  'Student Welfare Officer': 'bg-lime-100 text-lime-800',
  'SC/ST Cell Representative': 'bg-orange-100 text-orange-800',
  'OBC Cell Representative': 'bg-amber-100 text-amber-800',
  'Women Cell Representative': 'bg-pink-100 text-pink-800',
  'Anti-Ragging Cell Representative': 'bg-red-100 text-red-800',
  'Hostel Representative': 'bg-yellow-100 text-yellow-800',
  'Legal Officer': 'bg-slate-100 text-slate-800',
  'External Expert': 'bg-violet-100 text-violet-800',
};

const COMMITTEE_COLOR_MAP: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  pink: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
  },
  orange: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
  },
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

const PAGE_SIZES = [5, 10, 25];

export default function CommitteeManagement() {
  // ─── State ───────────────────────────────────────────────────────
  const [selectedCommitteeId, setSelectedCommitteeId] = useState<string>(
    committees[0]?.id ?? ''
  );
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editMember, setEditMember] = useState<CommitteeMember | null>(null);
  const [sortKey, setSortKey] = useState<keyof CommitteeMember>('name');
  const [sortAsc, setSortAsc] = useState(true);

  // Local committee data (mutable)
  const [committeeData, setCommitteeData] = useState<Committee[]>(committees);

  const selectedCommittee = committeeData.find(
    c => c.id === selectedCommitteeId
  );

  // ─── Filtering & Sorting ─────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!selectedCommittee) return [];
    return selectedCommittee.members
      .filter(m => {
        const q = search.toLowerCase();
        const matchSearch =
          !q ||
          m.name.toLowerCase().includes(q) ||
          m.designation.toLowerCase().includes(q) ||
          m.department.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q);
        const matchRole = !filterRole || m.role === filterRole;
        const matchStatus = !filterStatus || m.status === filterStatus;
        return matchSearch && matchRole && matchStatus;
      })
      .sort((a, b) => {
        const va = String(a[sortKey] ?? '');
        const vb = String(b[sortKey] ?? '');
        return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      });
  }, [selectedCommittee, search, filterRole, filterStatus, sortKey, sortAsc]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const toggleSort = (key: keyof CommitteeMember) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
    setCurrentPage(1);
  };

  // ─── Add / Edit ──────────────────────────────────────────────────
  const emptyForm: Omit<CommitteeMember, 'id'> = {
    name: '',
    designation: '',
    department: '',
    email: '',
    mobile: '',
    role: 'Academic Member',
    status: 'Active',
    activeFrom: '',
    activeTill: '',
  };
  const [form, setForm] = useState<Omit<CommitteeMember, 'id'>>(emptyForm);

  const openAdd = () => {
    setForm(emptyForm);
    setEditMember(null);
    setShowAddModal(true);
  };
  const openEdit = (m: CommitteeMember) => {
    setForm({
      name: m.name,
      designation: m.designation,
      department: m.department,
      email: m.email,
      mobile: m.mobile,
      role: m.role,
      status: m.status,
      activeFrom: m.activeFrom,
      activeTill: m.activeTill,
    });
    setEditMember(m);
    setShowAddModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.designation || !form.email) {
      alert('Name, Designation, and Email are required.');
      return;
    }
    setCommitteeData(prev =>
      prev.map(c => {
        if (c.id !== selectedCommitteeId) return c;
        if (editMember) {
          return {
            ...c,
            members: c.members.map(m =>
              m.id === editMember.id ? { ...editMember, ...form } : m
            ),
          };
        } else {
          const newMember: CommitteeMember = { id: `M${Date.now()}`, ...form };
          return { ...c, members: [...c.members, newMember] };
        }
      })
    );
    setShowAddModal(false);
  };

  const handleToggleStatus = (memberId: string) => {
    setCommitteeData(prev =>
      prev.map(c => {
        if (c.id !== selectedCommitteeId) return c;
        return {
          ...c,
          members: c.members.map(m =>
            m.id === memberId
              ? { ...m, status: m.status === 'Active' ? 'Inactive' : 'Active' }
              : m
          ),
        };
      })
    );
  };

  const colors = COMMITTEE_COLOR_MAP[selectedCommittee?.color ?? 'blue'];

  // ─── Export ──────────────────────────────────────────────────────
  const handleExport = () => {
    if (!selectedCommittee) return;
    const rows = [
      [
        'Name',
        'Designation',
        'Department',
        'Role',
        'Email',
        'Mobile',
        'Status',
        'Active From',
        'Active Till',
      ],
      ...selectedCommittee.members.map(m => [
        m.name,
        m.designation,
        m.department,
        m.role,
        m.email,
        m.mobile,
        m.status,
        m.activeFrom,
        m.activeTill,
      ]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedCommittee.acronym}_Members.csv`;
    a.click();
  };

  return (
    <FormPage
      title="Committee Management"
      description="Manage university grievance committees and their member compositions."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Grievance Cell', to: grvUrls.cell.portal },
        { label: 'Committee Management' },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* ── Left: Committee List ── */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 mb-3">
            Committees ({committeeData.length})
          </h3>
          {committeeData.map(c => {
            const col =
              COMMITTEE_COLOR_MAP[c.color] ?? COMMITTEE_COLOR_MAP.blue;
            const isActive = c.id === selectedCommitteeId;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCommitteeId(c.id);
                  setCurrentPage(1);
                  setSearch('');
                  setFilterRole('');
                  setFilterStatus('');
                }}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all ${isActive ? `${col.bg} ${col.border} shadow-sm` : 'bg-white border-slate-200 hover:border-slate-300'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p
                      className={`text-sm font-bold ${isActive ? col.text : 'text-slate-700'}`}
                    >
                      {c.acronym}
                    </p>
                    <p className="text-xs text-slate-500 leading-tight mt-0.5">
                      {c.name}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className={`text-xs font-semibold ${isActive ? col.text : 'text-slate-500'}`}
                    >
                      {c.members.length} members
                    </p>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${c.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                    >
                      {c.status}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Right: Members Grid ── */}
        <div className="lg:col-span-3 space-y-4">
          {/* Committee Header */}
          {selectedCommittee && (
            <div
              className={`${colors.bg} border ${colors.border} rounded-xl p-4`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className={`text-base font-bold ${colors.text}`}>
                    {selectedCommittee.name} ({selectedCommittee.acronym})
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedCommittee.type}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    <span className="font-semibold">Chairman:</span>{' '}
                    {selectedCommittee.chair}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 max-w-xl">
                    {selectedCommittee.mandate}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-2xl font-bold ${colors.text}`}>
                    {selectedCommittee.totalCases}
                  </div>
                  <div className="text-xs text-slate-500">Total Cases</div>
                </div>
              </div>
            </div>
          )}

          {/* Toolbar */}
          <FormCard title="">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex-1 min-w-[180px]">
                <TextBox
                  label=""
                  placeholder="🔍  Search by name, email, department..."
                  value={search}
                  onChange={v => {
                    setSearch(v);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="w-44">
                <DropDownList
                  label=""
                  data={[
                    { name: 'All Roles', value: '' },
                    ...MEMBER_ROLES.map(r => ({ name: r, value: r })),
                  ]}
                  textField="name"
                  optionValue="value"
                  value={filterRole}
                  onChange={v => {
                    setFilterRole(v as string);
                    setCurrentPage(1);
                  }}
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
                  value={filterStatus}
                  onChange={v => {
                    setFilterStatus(v as string);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <Button
                label="Export CSV"
                variant="outlined"
                onClick={handleExport}
              />
              <Button
                label="+ Add Member"
                variant="primary"
                onClick={openAdd}
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {[
                      { label: 'Name', key: 'name' as const },
                      { label: 'Role', key: 'role' as const },
                      { label: 'Designation', key: 'designation' as const },
                      { label: 'Department', key: 'department' as const },
                      { label: 'Contact', key: 'email' as const },
                      { label: 'Status', key: 'status' as const },
                      { label: 'Active Till', key: 'activeTill' as const },
                    ].map(col => (
                      <th
                        key={col.key}
                        className="px-3 py-2.5 text-left font-semibold text-slate-600 cursor-pointer hover:bg-slate-100 select-none whitespace-nowrap"
                        onClick={() => toggleSort(col.key)}
                      >
                        <div className="flex items-center gap-1">
                          {col.label}
                          <span className="material-symbols-outlined text-slate-400 text-[12px]">
                            {sortKey === col.key
                              ? sortAsc
                                ? 'arrow_upward'
                                : 'arrow_downward'
                              : 'unfold_more'}
                          </span>
                        </div>
                      </th>
                    ))}
                    <th className="px-3 py-2.5 text-center font-semibold text-slate-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginated.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-3 py-8 text-center text-slate-400"
                      >
                        <span className="material-symbols-outlined text-4xl block mb-2">
                          group_off
                        </span>
                        No members found matching your search criteria.
                      </td>
                    </tr>
                  ) : (
                    paginated.map(m => (
                      <tr
                        key={m.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-[10px] shrink-0">
                              {m.name.charAt(0)}
                            </div>
                            <span className="font-semibold text-slate-700">
                              {m.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${ROLE_COLORS[m.role] ?? 'bg-slate-100 text-slate-700'}`}
                          >
                            {m.role}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-slate-600">
                          {m.designation}
                        </td>
                        <td className="px-3 py-2.5 text-slate-500 max-w-[180px] truncate">
                          {m.department}
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="text-slate-600">{m.email}</div>
                          <div className="text-slate-400 text-[10px]">
                            {m.mobile}
                          </div>
                        </td>
                        <td className="px-3 py-2.5">
                          <button
                            onClick={() => handleToggleStatus(m.id)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer border ${m.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'}`}
                          >
                            {m.status}
                          </button>
                        </td>
                        <td className="px-3 py-2.5 text-slate-500">
                          {m.activeTill}
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => openEdit(m)}
                              className="p-1 rounded hover:bg-blue-50 text-blue-500 hover:text-blue-700 transition-colors"
                              title="Edit Member"
                            >
                              <span className="material-symbols-outlined text-base">
                                edit
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

            {/* Pagination */}
            <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Show</span>
                <select
                  className="border border-slate-200 rounded px-1.5 py-0.5 text-xs"
                  value={pageSize}
                  onChange={e => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  {PAGE_SIZES.map(s => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <span>per page — {filtered.length} total members</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2 py-1 rounded border border-slate-200 text-xs disabled:opacity-40 hover:bg-slate-50"
                >
                  ‹ Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-7 h-7 rounded border text-xs ${p === currentPage ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 hover:bg-slate-50'}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage(p => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-2 py-1 rounded border border-slate-200 text-xs disabled:opacity-40 hover:bg-slate-50"
                >
                  Next ›
                </button>
              </div>
            </div>
          </FormCard>
        </div>
      </div>

      {/* ── Add / Edit Member Modal ── */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-800">
                {editMember ? 'Edit Member' : 'Add New Member'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <TextBox
                  label="Full Name *"
                  value={form.name}
                  onChange={v => setForm(f => ({ ...f, name: v }))}
                />
                <TextBox
                  label="Designation *"
                  value={form.designation}
                  onChange={v => setForm(f => ({ ...f, designation: v }))}
                />
              </div>
              <TextBox
                label="Department / Institution *"
                value={form.department}
                onChange={v => setForm(f => ({ ...f, department: v }))}
              />
              <div className="grid grid-cols-2 gap-3">
                <TextBox
                  label="Email Address *"
                  value={form.email}
                  onChange={v => setForm(f => ({ ...f, email: v }))}
                />
                <TextBox
                  label="Mobile Number"
                  value={form.mobile}
                  onChange={v => setForm(f => ({ ...f, mobile: v }))}
                />
              </div>
              <DropDownList
                label="Role *"
                data={MEMBER_ROLES.map(r => ({ name: r, value: r }))}
                textField="name"
                optionValue="value"
                value={form.role}
                onChange={v =>
                  setForm(f => ({ ...f, role: v as CommitteeMemberRole }))
                }
              />
              <div className="grid grid-cols-2 gap-3">
                <TextBox
                  label="Active From"
                  value={form.activeFrom}
                  onChange={v => setForm(f => ({ ...f, activeFrom: v }))}
                  placeholder="YYYY-MM-DD"
                />
                <TextBox
                  label="Active Till"
                  value={form.activeTill}
                  onChange={v => setForm(f => ({ ...f, activeTill: v }))}
                  placeholder="YYYY-MM-DD"
                />
              </div>
              <DropDownList
                label="Status"
                data={[
                  { name: 'Active', value: 'Active' },
                  { name: 'Inactive', value: 'Inactive' },
                ]}
                textField="name"
                optionValue="value"
                value={form.status}
                onChange={v =>
                  setForm(f => ({ ...f, status: v as 'Active' | 'Inactive' }))
                }
              />
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setShowAddModal(false)}
              />
              <Button
                label={editMember ? 'Save Changes' : 'Add Member'}
                variant="primary"
                onClick={handleSave}
              />
            </div>
          </div>
        </div>
      )}
    </FormPage>
  );
}
