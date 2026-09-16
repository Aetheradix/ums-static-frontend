import { useState, useEffect } from 'react';
import { ToastService } from 'services';
import { Button, StatusButton } from 'shared/components/buttons';
import {
  DropDownList,
  NumberBox,
  TextBox,
  FormSubSection,
} from 'shared/components/forms';
import GridActionButtons from 'shared/components/grid/GridActionButtons';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  PreviewGrid,
  StatusBadge,
} from 'shared/new-components';
import {
  civilWorks,
  initialTechnicalPlans,
  type MockTechnicalPlan,
  type CivilWork,
} from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: MockTechnicalPlan }
  | { mode: 'view'; item: MockTechnicalPlan };

const CONCRETE_GRADES = [
  { label: 'M10 (PCC / Sub-base)', value: 'M10' },
  { label: 'M15 (PCC / Kerbs & Drains)', value: 'M15' },
  { label: 'M20 (RCC General Construction)', value: 'M20' },
  { label: 'M25 (RCC Structural Columns / Beams)', value: 'M25' },
  { label: 'M30 (Heavy RCC / Heavy Slabs)', value: 'M30' },
  { label: 'M35 (High-Strength Structural RCC)', value: 'M35' },
  { label: 'M40 (Prestressed / Bridge Decks)', value: 'M40' },
];

const STATUS_OPTIONS = [
  { label: 'Submitted', value: 'Submitted' },
  { label: 'Under Review', value: 'Under Review' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Rejected', value: 'Rejected' },
];

const statusVariantMap: Record<
  string,
  'approved' | 'rejected' | 'pending' | 'neutral'
> = {
  approved: 'approved',
  rejected: 'rejected',
  submitted: 'pending',
  'under review': 'pending',
};

export default function TechnicalPlanning() {
  const [works, setWorks] = useState<CivilWork[]>(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : civilWorks;
  });

  const [plans, setPlans] = useState<MockTechnicalPlan[]>(() => {
    const saved = localStorage.getItem('civil_technical_plans');
    return saved ? JSON.parse(saved) : initialTechnicalPlans;
  });

  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  // Form State
  const [formWorkId, setFormWorkId] = useState<number>(1);
  const [formPlotArea, setFormPlotArea] = useState<number>(0);
  const [formBuiltUpArea, setFormBuiltUpArea] = useState<number | undefined>(
    undefined
  );
  const [formNumberOfFloors, setFormNumberOfFloors] = useState<string>('');
  const [formSoilType, setFormSoilType] = useState<string>('');
  const [formBearingCapacity, setFormBearingCapacity] = useState<number>(0);
  const [formConcreteGrade, setFormConcreteGrade] = useState<string>('M25');
  const [formSteelQuantity, setFormSteelQuantity] = useState<
    number | undefined
  >(undefined);
  const [formBrickworkQuantity, setFormBrickworkQuantity] = useState<
    number | undefined
  >(undefined);
  const [formStatus, setFormStatus] = useState<string>('Submitted');

  // Sync to localStorage
  const savePlans = (newPlans: MockTechnicalPlan[]) => {
    setPlans(newPlans);
    localStorage.setItem('civil_technical_plans', JSON.stringify(newPlans));
  };

  useEffect(() => {
    const handleStorage = () => {
      const savedWorks = localStorage.getItem('civil_works');
      if (savedWorks) setWorks(JSON.parse(savedWorks));
      const savedPlans = localStorage.getItem('civil_technical_plans');
      if (savedPlans) setPlans(JSON.parse(savedPlans));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const openCreateModal = () => {
    setFormWorkId(works[0]?.workRegistrationId || 1);
    setFormPlotArea(0);
    setFormBuiltUpArea(undefined);
    setFormNumberOfFloors('');
    setFormSoilType('');
    setFormBearingCapacity(0);
    setFormConcreteGrade('M25');
    setFormSteelQuantity(undefined);
    setFormBrickworkQuantity(undefined);
    setFormStatus('Submitted');
    setPopup({ mode: 'create' });
  };

  const openEditModal = (item: MockTechnicalPlan) => {
    setFormWorkId(item.workRegistrationId);
    setFormPlotArea(item.plotArea);
    setFormBuiltUpArea(item.builtUpArea);
    setFormNumberOfFloors(item.numberOfFloors || '');
    setFormSoilType(item.soilType);
    setFormBearingCapacity(item.bearingCapacity);
    setFormConcreteGrade(item.concreteGrade);
    setFormSteelQuantity(item.steelQuantity);
    setFormBrickworkQuantity(item.brickworkQuantity);
    setFormStatus(item.status);
    setPopup({ mode: 'edit', item });
  };

  const handleSave = () => {
    if (!formWorkId) {
      ToastService.error('Work selection is required.');
      return;
    }
    if (!formPlotArea || formPlotArea <= 0) {
      ToastService.error('Plot Area must be greater than 0.');
      return;
    }
    if (!formSoilType.trim()) {
      ToastService.error('Soil type is required.');
      return;
    }
    if (!formBearingCapacity || formBearingCapacity <= 0) {
      ToastService.error('Bearing Capacity must be greater than 0.');
      return;
    }

    const selectedWork = works.find(
      w => (w.workRegistrationId || Number(w.id)) === formWorkId
    );
    const workCode =
      selectedWork?.code ||
      selectedWork?.workId ||
      `CW-${String(formWorkId).padStart(3, '0')}`;
    const workName = selectedWork?.name || '';

    if (popup.mode === 'create') {
      const newPlan: MockTechnicalPlan = {
        technicalPlanId: Date.now(),
        workRegistrationId: formWorkId,
        workRegistrationCode: workCode,
        workRegistrationName: workName,
        plotArea: Number(formPlotArea),
        builtUpArea: formBuiltUpArea ? Number(formBuiltUpArea) : undefined,
        numberOfFloors: formNumberOfFloors,
        soilType: formSoilType,
        bearingCapacity: Number(formBearingCapacity),
        concreteGrade: formConcreteGrade,
        steelQuantity: formSteelQuantity
          ? Number(formSteelQuantity)
          : undefined,
        brickworkQuantity: formBrickworkQuantity
          ? Number(formBrickworkQuantity)
          : undefined,
        status: formStatus,
        isActive: true,
      };
      savePlans([newPlan, ...plans]);
      ToastService.success('Technical Plan created successfully.');
    } else if (popup.mode === 'edit' && popup.item) {
      const updated = plans.map(p =>
        p.technicalPlanId === popup.item.technicalPlanId
          ? {
              ...p,
              workRegistrationId: formWorkId,
              workRegistrationCode: workCode,
              workRegistrationName: workName,
              plotArea: Number(formPlotArea),
              builtUpArea: formBuiltUpArea
                ? Number(formBuiltUpArea)
                : undefined,
              numberOfFloors: formNumberOfFloors,
              soilType: formSoilType,
              bearingCapacity: Number(formBearingCapacity),
              concreteGrade: formConcreteGrade,
              steelQuantity: formSteelQuantity
                ? Number(formSteelQuantity)
                : undefined,
              brickworkQuantity: formBrickworkQuantity
                ? Number(formBrickworkQuantity)
                : undefined,
              status: formStatus,
            }
          : p
      );
      savePlans(updated);
      ToastService.success('Technical Plan updated successfully.');
    }
    setPopup({ mode: 'closed' });
  };

  const handleToggleStatus = (item: MockTechnicalPlan) => {
    const updated = plans.map(p =>
      p.technicalPlanId === item.technicalPlanId
        ? { ...p, isActive: !p.isActive }
        : p
    );
    savePlans(updated);
    ToastService.success(
      `Technical plan marked ${!item.isActive ? 'Active' : 'Inactive'}.`
    );
  };

  const getStatusVariant = (status: string) =>
    statusVariantMap[status.toLowerCase()] ?? 'neutral';

  const workOptions = works.map(w => {
    const id = w.workRegistrationId || Number(w.id);
    const code = w.code || w.workId || `CW-${String(id).padStart(3, '0')}`;
    return {
      value: id,
      text: `${code} — ${w.name}`,
    };
  });

  return (
    <FormPage
      title="Technical Plan Management"
      description="Manage civil engineering technical plans, plot areas, concrete grades, geotechnical properties, and material estimations."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.engineerPortal },
        { label: 'Technical Planning' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={plans}
          columns={[
            {
              field: 'technicalPlanId',
              header: '#',
              cell: (_, o) => <span>{o.rowIndex + 1}</span>,
              width: '50px',
            },
            {
              field: 'workRegistrationId',
              header: 'Work Registration',
              cell: (c: MockTechnicalPlan) => (
                <span>
                  {c.workRegistrationCode
                    ? `${c.workRegistrationCode} — ${c.workRegistrationName ?? ''}`
                    : `Reg #${c.workRegistrationId}`}
                </span>
              ),
            },
            {
              field: 'plotArea',
              header: 'Plot Area (Sq. Ft.)',
              cell: (c: MockTechnicalPlan) => (
                <span>{c.plotArea.toLocaleString('en-IN')}</span>
              ),
              width: '140px',
            },
            {
              field: 'concreteGrade',
              header: 'Concrete Grade',
              width: '130px',
            },
            {
              field: 'status',
              header: 'Status',
              cell: (c: MockTechnicalPlan) => (
                <StatusBadge
                  label={c.status}
                  variant={getStatusVariant(c.status)}
                />
              ),
              width: '130px',
            },
            {
              field: 'isActive',
              header: 'Active',
              sortable: false,
              cell: (c: MockTechnicalPlan) => (
                <StatusButton
                  value={c.isActive}
                  onClick={() => handleToggleStatus(c)}
                />
              ),
              width: '90px',
            },
            {
              field: 'technicalPlanId',
              header: 'Actions',
              sortable: false,
              cell: (c: MockTechnicalPlan) => (
                <GridActionButtons
                  onView={() => setPopup({ mode: 'view', item: c })}
                  onEdit={() => openEditModal(c)}
                  viewTooltip="View Technical Plan Details"
                  editTooltip="Edit Technical Plan"
                />
              ),
              width: '110px',
            },
          ]}
          toolbar={
            <Button
              label="Create Technical Plan"
              icon="plus"
              variant="primary"
              onClick={openCreateModal}
            />
          }
          searchBox
          searchPlaceholder="Search technical plans by status or work..."
        />
      </FormCard>

      {/* Popups */}
      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'create'
            ? 'Create Technical Plan'
            : popup.mode === 'edit'
              ? 'Edit Technical Plan'
              : popup.mode === 'view'
                ? `Technical Plan — ${popup.item.workRegistrationCode ?? `Work Reg #${popup.item.workRegistrationId}`}`
                : ''
        }
        subtitle={
          popup.mode === 'create'
            ? 'Record a new civil engineering technical plan.'
            : popup.mode === 'view'
              ? 'Detailed civil engineering technical plan record.'
              : 'Modify technical plan parameters and material estimations.'
        }
        size="xl"
      >
        {(popup.mode === 'create' || popup.mode === 'edit') && (
          <div>
            {/* 1. Work & Registration Details */}
            <FormSubSection
              title="1. Work & Registration Details"
              icon="assignment"
            >
              <DropDownList
                label="Work Registration *"
                data={workOptions}
                textField="text"
                optionValue="value"
                value={formWorkId}
                onChange={v => setFormWorkId(Number(v))}
                required
              />
              <DropDownList
                label="Technical Plan Status *"
                data={STATUS_OPTIONS}
                textField="label"
                optionValue="value"
                value={formStatus}
                onChange={v => setFormStatus(String(v))}
                required
              />
            </FormSubSection>

            {/* 2. Plot & Area Specifications */}
            <FormSubSection
              title="2. Plot & Area Specifications"
              icon="square_foot"
            >
              <NumberBox
                label="Plot Area (Sq. Ft.) *"
                placeholder="e.g. 5000.00"
                value={formPlotArea}
                onChange={v => setFormPlotArea(Number(v) || 0)}
                mode="decimal"
                required
              />
              <NumberBox
                label="Built-up Area (Sq. Ft.)"
                placeholder="e.g. 3500.00 (Optional)"
                value={formBuiltUpArea}
                onChange={v =>
                  setFormBuiltUpArea(
                    v !== null && v !== undefined ? Number(v) : undefined
                  )
                }
                mode="decimal"
              />
              <TextBox
                label="Number of Floors"
                placeholder="e.g. G+2 Floors"
                value={formNumberOfFloors}
                onChange={setFormNumberOfFloors}
                maxLength={50}
              />
            </FormSubSection>

            {/* 3. Soil & Geotechnical Parameters */}
            <FormSubSection
              title="3. Soil & Geotechnical Parameters"
              icon="landscape"
            >
              <TextBox
                label="Soil Type *"
                placeholder="e.g. Medium Sandy Clay / Black Cotton"
                value={formSoilType}
                onChange={setFormSoilType}
                maxLength={150}
                required
              />
              <NumberBox
                label="Bearing Capacity (KN/m²) *"
                placeholder="e.g. 150.00"
                value={formBearingCapacity}
                onChange={v => setFormBearingCapacity(Number(v) || 0)}
                mode="decimal"
                required
              />
            </FormSubSection>

            {/* 4. Structural & Material Estimates */}
            <FormSubSection
              title="4. Structural & Material Estimates"
              icon="engineering"
            >
              <DropDownList
                label="Concrete Grade *"
                data={CONCRETE_GRADES}
                textField="label"
                optionValue="value"
                value={formConcreteGrade}
                onChange={v => setFormConcreteGrade(String(v))}
                required
              />
              <NumberBox
                label="Steel Quantity (MT)"
                placeholder="e.g. 25.500 (Optional)"
                value={formSteelQuantity}
                onChange={v =>
                  setFormSteelQuantity(
                    v !== null && v !== undefined ? Number(v) : undefined
                  )
                }
                mode="decimal"
              />
              <NumberBox
                label="Brickwork Quantity (Cum)"
                placeholder="e.g. 120.000 (Optional)"
                value={formBrickworkQuantity}
                onChange={v =>
                  setFormBrickworkQuantity(
                    v !== null && v !== undefined ? Number(v) : undefined
                  )
                }
                mode="decimal"
              />
            </FormSubSection>

            <div className="flex justify-end gap-3 mt-4">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setPopup({ mode: 'closed' })}
              />
              <Button
                label={
                  popup.mode === 'create'
                    ? 'Save Technical Plan'
                    : 'Update Technical Plan'
                }
                variant="primary"
                icon="save"
                onClick={handleSave}
              />
            </div>
          </div>
        )}

        {popup.mode === 'view' && popup.item && (
          <div>
            <PreviewGrid
              columns={3}
              fields={[
                {
                  label: 'Work Registration',
                  value: popup.item.workRegistrationCode
                    ? `${popup.item.workRegistrationCode} — ${popup.item.workRegistrationName ?? ''}`
                    : `#${popup.item.workRegistrationId}`,
                },
                {
                  label: 'Plan Status',
                  value: (
                    <StatusBadge
                      label={popup.item.status}
                      variant={getStatusVariant(popup.item.status)}
                    />
                  ),
                },
                {
                  label: 'Plot Area (Sq. Ft.)',
                  value: popup.item.plotArea.toLocaleString('en-IN'),
                },
                {
                  label: 'Built-up Area (Sq. Ft.)',
                  value: popup.item.builtUpArea
                    ? popup.item.builtUpArea.toLocaleString('en-IN')
                    : '—',
                },
                {
                  label: 'Number of Floors',
                  value: popup.item.numberOfFloors || '—',
                },
                {
                  label: 'Soil Type',
                  value: popup.item.soilType,
                },
                {
                  label: 'Bearing Capacity (KN/m²)',
                  value: `${popup.item.bearingCapacity} KN/m²`,
                },
                {
                  label: 'Concrete Grade',
                  value: popup.item.concreteGrade,
                },
                {
                  label: 'Steel Quantity (MT)',
                  value:
                    popup.item.steelQuantity !== null &&
                    popup.item.steelQuantity !== undefined
                      ? `${popup.item.steelQuantity} MT`
                      : '—',
                },
                {
                  label: 'Brickwork Quantity (Cum)',
                  value:
                    popup.item.brickworkQuantity !== null &&
                    popup.item.brickworkQuantity !== undefined
                      ? `${popup.item.brickworkQuantity} Cum`
                      : '—',
                },
                {
                  label: 'Record Active Status',
                  value: (
                    <StatusBadge
                      label={popup.item.isActive ? 'Active' : 'Inactive'}
                      variant={popup.item.isActive ? 'approved' : 'rejected'}
                    />
                  ),
                },
              ]}
            />
            <div className="flex justify-end mt-4">
              <Button
                label="Close"
                variant="outlined"
                onClick={() => setPopup({ mode: 'closed' })}
              />
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
