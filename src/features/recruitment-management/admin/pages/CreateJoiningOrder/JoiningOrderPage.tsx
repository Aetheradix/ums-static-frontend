import { useMemo, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DatePicker, TextBox } from 'shared/components/forms';
import {
  BulkSelectTable,
  FormCard,
  FormGrid,
  FormPage,
} from 'shared/new-components';
import type { BulkColumn } from 'shared/new-components/BulkSelectTable/BulkSelectTable';

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
  const [orderDate, setOrderDate] = useState<Date | null>(null);

  const [search, setSearch] = useState('');

  const displayed = useMemo(() => {
    if (!search.trim()) return candidates;
    const q = search.toLowerCase();
    return candidates.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.fatherName.toLowerCase().includes(q) ||
        c.rollNumber.includes(q) ||
        c.district.toLowerCase().includes(q) ||
        c.postingPlace.toLowerCase().includes(q)
    );
  }, [candidates, search]);

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
    setOrderDate(null);
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

  const columns: BulkColumn<JoiningCandidate>[] = [
    { header: 'Candidate Name', field: 'name' },
    { header: 'Father or Husband Name', field: 'fatherName' },
    { header: 'Address', field: 'address' },
    { header: 'Roll Number', field: 'rollNumber' },
    { header: 'Consolidated Rank', field: 'rank' },
    { header: 'Category', field: 'category' },
    { header: 'Selected Category', field: 'selectedCategory' },
    { header: 'Posting Place', field: 'postingPlace' },
    { header: 'District', field: 'district' },
  ];

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
        <div className="mb-6">
          <BulkSelectTable
            data={displayed}
            columns={columns}
            selected={selectedIds}
            onToggleOne={toggleOne}
            onToggleAll={toggleAll}
            onClearSelection={() => setSelectedIds(new Set())}
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search by name, father name, roll no, district, or posting place..."
            emptyMessage="No candidates pending for joining order."
          />
        </div>

        {/* Order Details Form */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10">
          <FormGrid>
            <TextBox
              id="orderNumber"
              label="Order Number"
              required
              value={orderNumber}
              onChange={setOrderNumber}
              placeholder="e.g. ORDER/2026/001"
            />
            <TextBox
              id="copyTo"
              label="Copy To"
              required
              value={copyTo}
              onChange={setCopyTo}
              placeholder="e.g. DPI Office, Bhopal"
            />
            <DatePicker
              id="orderDate"
              label="Order Date"
              required
              value={orderDate || undefined}
              onChange={val => setOrderDate(val || null)}
            />
          </FormGrid>

          <div className="flex items-center justify-end gap-3 mt-6">
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
