import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  DropDownList,
  NumberBox,
  Switch,
  TextBox,
} from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatCard,
  StatusBadge,
} from 'shared/new-components';

interface SanctionedPosition {
  id: string;
  positionCode: string;
  department: string;
  designation: string;
  employmentType: string;
  sanctionedCount: number;
  recruitedCount: number;
  vacantCount: number;
  financialYear: string;
  govtOrderRef?: string;
  status: string; // 'Active' | 'Frozen' | 'Abolished'
}

const initialPositions: SanctionedPosition[] = [
  {
    id: '1',
    positionCode: 'POS-CS-PROF',
    department: 'Computer Science',
    designation: 'Professor',
    employmentType: 'Permanent',
    sanctionedCount: 3,
    recruitedCount: 2,
    vacantCount: 1,
    financialYear: '2025-2026',
    govtOrderRef: 'GO/EST/2024/782',
    status: 'Active',
  },
  {
    id: '2',
    positionCode: 'POS-PH-AP',
    department: 'Physics',
    designation: 'Assistant Professor',
    employmentType: 'Permanent',
    sanctionedCount: 5,
    recruitedCount: 5,
    vacantCount: 0,
    financialYear: '2025-2026',
    govtOrderRef: 'GO/EST/2024/783',
    status: 'Active',
  },
  {
    id: '3',
    positionCode: 'POS-MA-LECT',
    department: 'Mathematics',
    designation: 'Lecturer',
    employmentType: 'Contractual',
    sanctionedCount: 2,
    recruitedCount: 3,
    vacantCount: -1,
    financialYear: '2025-2026',
    govtOrderRef: 'GO/EST/2024/801',
    status: 'Frozen',
  },
];

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: SanctionedPosition };

const EMPTY_FORM = {
  positionCode: '',
  department: '',
  designation: '',
  employmentType: 'Permanent',
  sanctionedCount: 1,
  financialYear: '2025-2026',
  govtOrderRef: '',
  status: 'Active',
};

export default function HeadcountControl() {
  const [data, setData] = useState<SanctionedPosition[]>(initialPositions);
  const [checkEnabled, setCheckEnabled] = useState(true);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState(EMPTY_FORM);

  const totalSanctioned = data.reduce(
    (acc, curr) => acc + curr.sanctionedCount,
    0
  );
  const totalRecruited = data.reduce(
    (acc, curr) => acc + curr.recruitedCount,
    0
  );
  const totalVacant = data.reduce((acc, curr) => acc + curr.vacantCount, 0);

  const showExceededAlert = checkEnabled && data.some(p => p.vacantCount < 0);

  const DEPARTMENT_OPTIONS = [
    { name: 'Computer Science', value: 'Computer Science' },
    { name: 'Physics', value: 'Physics' },
    { name: 'Chemistry', value: 'Chemistry' },
    { name: 'Mathematics', value: 'Mathematics' },
    { name: 'Administration', value: 'Administration' },
  ];

  const DESIGNATION_OPTIONS = [
    { name: 'Professor', value: 'Professor' },
    { name: 'Associate Professor', value: 'Associate Professor' },
    { name: 'Assistant Professor', value: 'Assistant Professor' },
    { name: 'Lecturer', value: 'Lecturer' },
  ];

  const EMPLOYMENT_TYPE_OPTIONS = [
    { name: 'Permanent', value: 'Permanent' },
    { name: 'Contractual', value: 'Contractual' },
    { name: 'Guest', value: 'Guest' },
  ];

  const STATUS_OPTIONS = [
    { name: 'Active', value: 'Active' },
    { name: 'Frozen', value: 'Frozen' },
    { name: 'Abolished', value: 'Abolished' },
  ];

  const FY_OPTIONS = [
    { name: '2025-2026', value: '2025-2026' },
    { name: '2026-2027', value: '2026-2027' },
  ];

  const closePopup = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY_FORM);
  }, []);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setPopup({ mode: 'create' });
  };

  const openEdit = (item: SanctionedPosition) => {
    setForm({
      positionCode: item.positionCode,
      department: item.department,
      designation: item.designation,
      employmentType: item.employmentType,
      sanctionedCount: item.sanctionedCount,
      financialYear: item.financialYear,
      govtOrderRef: item.govtOrderRef || '',
      status: item.status,
    });
    setPopup({ mode: 'edit', item });
  };

  const handleSave = () => {
    if (!form.positionCode) {
      ToastService.error('Position Code is required.');
      return;
    }
    if (!form.department) {
      ToastService.error('Department is required.');
      return;
    }
    if (!form.designation) {
      ToastService.error('Designation is required.');
      return;
    }

    const recruited = popup.mode === 'edit' ? popup.item.recruitedCount : 0;
    const vacant = form.sanctionedCount - recruited;

    // HRMIS Headcount Check control block
    if (checkEnabled && vacant < 0) {
      ToastService.error(
        `Cannot save position: Sanctioned count (${form.sanctionedCount}) is less than current recruited headcount (${recruited}) under active HRMIS control.`
      );
      return;
    }

    if (popup.mode === 'create') {
      // Check duplicate position code
      if (data.some(p => p.positionCode === form.positionCode)) {
        ToastService.error('Position Code already exists.');
        return;
      }

      const newPosition: SanctionedPosition = {
        id: String(Date.now()),
        positionCode: form.positionCode,
        department: form.department,
        designation: form.designation,
        employmentType: form.employmentType,
        sanctionedCount: form.sanctionedCount,
        recruitedCount: 0,
        vacantCount: form.sanctionedCount,
        financialYear: form.financialYear,
        govtOrderRef: form.govtOrderRef,
        status: form.status,
      };

      setData(prev => [...prev, newPosition]);
      ToastService.success('Sanctioned position created successfully.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(p =>
          p.id === popup.item.id
            ? {
                ...p,
                ...form,
                recruitedCount: recruited,
                vacantCount: vacant,
              }
            : p
        )
      );
      ToastService.success('Sanctioned position updated successfully.');
    }

    closePopup();
  };

  const columns: Controls.ColumnProps<SanctionedPosition>[] = [
    { field: 'positionCode', header: 'Position Code' },
    { field: 'department', header: 'Department/Unit' },
    { field: 'designation', header: 'Designation' },
    { field: 'employmentType', header: 'Type' },
    { field: 'sanctionedCount', header: 'Sanctioned' },
    { field: 'recruitedCount', header: 'Recruited' },
    {
      field: 'vacantCount',
      header: 'Vacant',
      cell: item => {
        const isNegative = item.vacantCount < 0;
        return (
          <span
            className={
              isNegative
                ? 'text-red-600 font-semibold'
                : item.vacantCount === 0
                  ? 'text-slate-500'
                  : 'text-green-600 font-semibold'
            }
          >
            {item.vacantCount}
          </span>
        );
      },
    },
    { field: 'financialYear', header: 'FY' },
    {
      field: 'status',
      header: 'Status',
      cell: item => {
        let variant: 'approved' | 'pending' | 'rejected' | 'neutral' =
          'neutral';
        if (item.status === 'Active') variant = 'approved';
        if (item.status === 'Frozen') variant = 'pending';
        if (item.status === 'Abolished') variant = 'rejected';

        return <StatusBadge label={item.status} variant={variant} />;
      },
    },
  ];

  return (
    <FormPage
      title="Headcount Control"
      breadcrumbs={[
        { label: 'Employee Management', to: '/employee-management' },
        { label: 'Headcount Control' },
      ]}
    >
      <div className="flex flex-col gap-6">
        <FormCard title="HRMIS Global Settings">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="form-card-title text-base m-0">
                HRMIS Headcount Limit Validation
              </p>
              <p className="form-card-subtitle mt-1">
                When enabled, the system strictly blocks any quick onboarding or
                profile allocation that exceeds sanctioned counts for any post.
              </p>
            </div>
            <Switch
              checked={checkEnabled}
              onChange={v => {
                setCheckEnabled(v);
                if (v) {
                  ToastService.success(
                    'Active headcount checks have been enabled.'
                  );
                } else {
                  ToastService.success('Headcount check bypassed.');
                }
              }}
            />
          </div>
        </FormCard>

        {showExceededAlert && (
          <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 p-4 text-red-700 dark:text-red-300 rounded shadow-sm flex items-start gap-3">
            <span className="material-symbols-outlined text-red-500">
              warning
            </span>
            <div>
              <h4 className="font-bold">HRMIS Compliance Alert</h4>
              <p className="text-sm">
                Headcount check is enabled, but some posts have active employees
                exceeding approved sanctioned counts (e.g. Mathematics -
                Lecturer). Please adjust the sanctioned counts or reallocate
                personnel.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          <StatCard
            title="Total Approved Sanctions"
            value={totalSanctioned}
            icon="assignment"
            colorScheme="blue"
            subtitle="Positions across all units"
          />
          <StatCard
            title="Total Recruited Headcount"
            value={totalRecruited}
            icon="groups"
            colorScheme="green"
            subtitle="Currently active staff"
          />
          <StatCard
            title="Total Vacancies"
            value={totalVacant}
            icon="error"
            colorScheme={totalVacant < 0 ? 'red' : 'orange'}
            subtitle={
              totalVacant < 0
                ? 'Over-allocated positions'
                : 'Available positions'
            }
          />
        </div>

        <FormCard title="Sanctioned Positions Log" icon="list">
          <GridPanel
            data={data}
            columns={columns}
            onEdit={openEdit}
            toolbar={
              <Button
                label="Add Position"
                icon="plus"
                variant="primary"
                onClick={openCreate}
              />
            }
            searchBox
          />
        </FormCard>
      </div>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={closePopup}
        title={
          popup.mode === 'create'
            ? 'Add Sanctioned Position'
            : 'Edit Sanctioned Position'
        }
        subtitle="Specify approved headcount boundaries for structural posts."
        size="lg"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Position Code"
            placeholder="e.g. POS-CS-LECT"
            value={form.positionCode}
            onChange={v => setForm(f => ({ ...f, positionCode: v }))}
            required
            disabled={popup.mode === 'edit'}
          />
          <DropDownList
            label="Department / Unit"
            data={DEPARTMENT_OPTIONS}
            textField="name"
            optionValue="value"
            placeholder="Select Department"
            value={form.department}
            onChange={v =>
              setForm(f => ({ ...f, department: String(v ?? '') }))
            }
            required
          />
          <DropDownList
            label="Designation"
            data={DESIGNATION_OPTIONS}
            textField="name"
            optionValue="value"
            placeholder="Select Designation"
            value={form.designation}
            onChange={v =>
              setForm(f => ({ ...f, designation: String(v ?? '') }))
            }
            required
          />
          <DropDownList
            label="Employment Type"
            data={EMPLOYMENT_TYPE_OPTIONS}
            textField="name"
            optionValue="value"
            placeholder="Select Type"
            value={form.employmentType}
            onChange={v =>
              setForm(f => ({ ...f, employmentType: String(v ?? '') }))
            }
            required
          />
          <NumberBox
            label="Sanctioned Count"
            value={form.sanctionedCount}
            onChange={v =>
              setForm(f => ({ ...f, sanctionedCount: Number(v ?? 0) }))
            }
            required
            min={1}
          />
          <DropDownList
            label="Financial Year"
            data={FY_OPTIONS}
            textField="name"
            optionValue="value"
            placeholder="Select FY"
            value={form.financialYear}
            onChange={v =>
              setForm(f => ({ ...f, financialYear: String(v ?? '') }))
            }
            required
          />
          <TextBox
            label="Govt Order Reference"
            placeholder="e.g. GO-EST-2026"
            value={form.govtOrderRef}
            onChange={v => setForm(f => ({ ...f, govtOrderRef: v }))}
          />
          <DropDownList
            label="Status"
            data={STATUS_OPTIONS}
            textField="name"
            optionValue="value"
            placeholder="Select Status"
            value={form.status}
            onChange={v => setForm(f => ({ ...f, status: String(v ?? '') }))}
            required
          />
        </FormGrid>
        <div className="flex justify-end gap-3 mt-6">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button label="Save" variant="primary" onClick={handleSave} />
        </div>
      </FormPopup>
    </FormPage>
  );
}
