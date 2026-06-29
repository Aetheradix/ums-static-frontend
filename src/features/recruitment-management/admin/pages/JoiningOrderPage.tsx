import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';

// ─── Types ────────────────────────────────────────────────────────────────────
interface JoiningCandidate {
  id: string;
  name: string;
  fatherName: string;
  address: string;
  rollNumber: string;
  rank: number;
  category: string;
  selectedCategory: string;
  postingPlace: string;
  district: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_CANDIDATES: JoiningCandidate[] = [
  {
    id: 'C1',
    name: 'PURUSHOTTAM DAS',
    fatherName: 'JAGDISH DAS',
    address: 'RURAL',
    rollNumber: '6007250655448',
    rank: 3,
    category: 'OBC',
    selectedCategory: 'OBC',
    postingPlace: 'GHSS BOYS TYONDA(9 to 12) (23310124311)',
    district: 'Vidisha',
  },
  {
    id: 'C2',
    name: 'SUNITA PATEL',
    fatherName: 'RAMESH PATEL',
    address: 'URBAN',
    rollNumber: '6007250655449',
    rank: 5,
    category: 'General',
    selectedCategory: 'General',
    postingPlace: 'GOVT HSS SEHORE (23330213804)',
    district: 'Sehore',
  },
];

export default function JoiningOrderPage() {
  const [candidates] = useState<JoiningCandidate[]>(MOCK_CANDIDATES);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [orderNumber, setOrderNumber] = useState('');
  const [copyTo, setCopyTo] = useState('');
  const [orderDate, setOrderDate] = useState('');

  // ── Selection ──
  const allSelected =
    candidates.length > 0 && candidates.every(c => selectedIds.has(c.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(candidates.map(c => c.id)));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ── Actions ──
  const handleReset = () => {
    setSelectedIds(new Set());
    setOrderNumber('');
    setCopyTo('');
    setOrderDate('');
  };

  const handleCreateOrder = () => {
    if (selectedIds.size === 0) {
      ToastService.error('Please select at least one candidate.');
      return;
    }
    if (!orderNumber || !copyTo || !orderDate) {
      ToastService.error(
        'Please fill in all order details (Number, Copy To, Date).'
      );
      return;
    }
    ToastService.success(
      `Joining order ${orderNumber} created for ${selectedIds.size} candidate(s).`
    );
    handleReset();
  };

  return (
    <FormPage
      title="Create Joining Order"
      description="DO/JD/DPI interface to generate joining orders for allocated candidates."
      breadcrumbs={[
        { label: 'Recruitment Management', to: '/recruitment-management' },
        { label: 'HR Admin', to: '/recruitment-management/admin' },
        { label: 'Joining Order' },
      ]}
    >
      <FormCard title="Candidate Details" icon="group_add">
        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-400/10 mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-violet-600/20">
                <th className="p-3 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="w-4 h-4 accent-violet-500 cursor-pointer"
                    title="Select All"
                  />
                </th>
                {[
                  'Candidate Name',
                  'Father or Husband Name',
                  'Address',
                  'Roll Number',
                  'Consolidated Rank',
                  'Category',
                  'Selected Category',
                  'Posting Place',
                  'District',
                ].map(h => (
                  <th
                    key={h}
                    className="p-3 text-left text-[11px] text-violet-300 font-semibold uppercase tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {candidates.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="p-8 text-center text-slate-500 text-[13px]"
                  >
                    No candidates pending for joining order.
                  </td>
                </tr>
              ) : (
                candidates.map(c => (
                  <tr
                    key={c.id}
                    onClick={() => toggleOne(c.id)}
                    className={`border-b border-slate-400/5 cursor-pointer transition-colors ${
                      selectedIds.has(c.id)
                        ? 'bg-violet-500/8 hover:bg-violet-500/12'
                        : 'hover:bg-slate-400/5'
                    }`}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(c.id)}
                        onChange={() => toggleOne(c.id)}
                        onClick={e => e.stopPropagation()}
                        className="w-4 h-4 accent-violet-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-3 text-[13px] text-slate-200 font-semibold">
                      {c.name}
                    </td>
                    <td className="p-3 text-[12px] text-slate-400">
                      {c.fatherName}
                    </td>
                    <td className="p-3 text-[12px] text-slate-400">
                      {c.address}
                    </td>
                    <td className="p-3 text-[12px] text-slate-400 font-mono">
                      {c.rollNumber}
                    </td>
                    <td className="p-3 text-[12px] text-slate-400">{c.rank}</td>
                    <td className="p-3 text-[12px] text-slate-400">
                      {c.category}
                    </td>
                    <td className="p-3 text-[12px] text-slate-400">
                      {c.selectedCategory}
                    </td>
                    <td
                      className="p-3 text-[12px] text-slate-400 max-w-[200px] truncate"
                      title={c.postingPlace}
                    >
                      {c.postingPlace}
                    </td>
                    <td className="p-3 text-[12px] text-slate-400">
                      {c.district}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Order Details Form */}
        <div className="bg-slate-400/5 border border-slate-400/10 rounded-xl p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-[12px] font-semibold text-slate-400 mb-1.5">
                Order Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={e => setOrderNumber(e.target.value)}
                placeholder="e.g. ORDER/2026/001"
                className="w-full bg-slate-400/10 border border-slate-400/20 rounded-lg px-3 py-2 text-[13px] text-slate-200 focus:border-violet-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-400 mb-1.5">
                Copy To <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={copyTo}
                onChange={e => setCopyTo(e.target.value)}
                placeholder="e.g. DPI Office, Bhopal"
                className="w-full bg-slate-400/10 border border-slate-400/20 rounded-lg px-3 py-2 text-[13px] text-slate-200 focus:border-violet-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-400 mb-1.5">
                Order Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={orderDate}
                onChange={e => setOrderDate(e.target.value)}
                className="w-full bg-slate-400/10 border border-slate-400/20 rounded-lg px-3 py-2 text-[13px] text-slate-200 focus:border-violet-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button
              label="Reset"
              type="button"
              variant="outlined"
              onClick={handleReset}
            />
            <Button
              label="Create Order"
              icon="post_add"
              type="button"
              variant="primary"
              onClick={handleCreateOrder}
            />
          </div>
        </div>
      </FormCard>
    </FormPage>
  );
}
