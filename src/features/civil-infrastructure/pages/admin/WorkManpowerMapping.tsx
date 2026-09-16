import { useState, useEffect } from 'react';
import { ToastService } from 'services';
import { Button, StatusButton } from 'shared/components/buttons';
import {
  DatePicker,
  DropDownList,
  FileUpload,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import GridActionButtons from 'shared/components/grid/GridActionButtons';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  PreviewGrid,
  StatusBadge,
} from 'shared/new-components';
import {
  civilWorks,
  initialWorkManpowerMappings,
  type MockWorkManpowerMapping,
  type CivilWork,
} from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: MockWorkManpowerMapping }
  | { mode: 'view'; item: MockWorkManpowerMapping }
  | { mode: 'relieve'; item: MockWorkManpowerMapping };

const INTERNAL_EMPLOYEES = [
  { value: 101, text: 'Er. Rajesh Sharma (EMP-101) — Executive Engineer' },
  { value: 102, text: 'Er. Suresh Kumar (EMP-102) — Assistant Engineer' },
  { value: 103, text: 'Er. Priya Joshi (EMP-103) — Junior Engineer' },
  { value: 104, text: 'Er. Anita Rao (EMP-104) — Assistant Engineer' },
  { value: 105, text: 'Er. Deepak Mishra (EMP-105) — Executive Engineer' },
  { value: 106, text: 'Er. Vikram Malhotra (EMP-106) — Junior Engineer' },
];

const EXTERNAL_DESIGNATION_OPTIONS = [
  {
    value: 'Principal Structural Consultant',
    text: 'Principal Structural Consultant',
  },
  {
    value: 'Chartered Structural Engineer',
    text: 'Chartered Structural Engineer',
  },
  {
    value: 'Third-Party Quality Auditor (TPI)',
    text: 'Third-Party Quality Auditor (TPI)',
  },
  {
    value: 'Geotechnical & Soil Investigation Expert',
    text: 'Geotechnical & Soil Investigation Expert',
  },
  {
    value: 'Senior MEP / Electrical Consultant',
    text: 'Senior MEP / Electrical Consultant',
  },
  {
    value: 'Architectural & Landscape Consultant',
    text: 'Architectural & Landscape Consultant',
  },
  {
    value: 'Project Management Consultant (PMC)',
    text: 'Project Management Consultant (PMC)',
  },
  {
    value: 'Quantity Surveyor & Cost Auditor',
    text: 'Quantity Surveyor & Cost Auditor',
  },
  {
    value: 'Safety & Environmental Compliance Officer',
    text: 'Safety & Environmental Compliance Officer',
  },
  {
    value: 'Senior Resident Engineer (External)',
    text: 'Senior Resident Engineer (External)',
  },
  {
    value: 'Site QC / Material Testing Inspector',
    text: 'Site QC / Material Testing Inspector',
  },
];

export default function WorkManpowerMapping() {
  const [works, setWorks] = useState<CivilWork[]>(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : civilWorks;
  });

  const [mappings, setMappings] = useState<MockWorkManpowerMapping[]>(() => {
    const saved = localStorage.getItem('civil_work_manpower_mappings');
    return saved ? JSON.parse(saved) : initialWorkManpowerMappings;
  });

  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  // Form State
  const [formWorkId, setFormWorkId] = useState<number>(1);
  const [formIsInternal, setFormIsInternal] = useState<boolean>(true);
  const [formEmployeeId, setFormEmployeeId] = useState<number>(101);
  const [formExternalName, setFormExternalName] = useState<string>('');
  const [formExternalDesignation, setFormExternalDesignation] =
    useState<string>('');
  const [formExternalPhone, setFormExternalPhone] = useState<string>('');
  const [formResponsibility, setFormResponsibility] = useState<string>('');
  const [formFromDate, setFormFromDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [formRemarks, setFormRemarks] = useState<string>('');

  // Relieve (Out) State
  const [relieveDate, setRelieveDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [relieveDocName, setRelieveDocName] = useState<string>('');
  const [relieveRemarks, setRelieveRemarks] = useState<string>('');

  const saveMappings = (newMappings: MockWorkManpowerMapping[]) => {
    setMappings(newMappings);
    localStorage.setItem(
      'civil_work_manpower_mappings',
      JSON.stringify(newMappings)
    );
  };

  useEffect(() => {
    const handleStorage = () => {
      const savedWorks = localStorage.getItem('civil_works');
      if (savedWorks) setWorks(JSON.parse(savedWorks));
      const savedMappings = localStorage.getItem(
        'civil_work_manpower_mappings'
      );
      if (savedMappings) setMappings(JSON.parse(savedMappings));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const openCreateModal = () => {
    setFormWorkId(works[0]?.workRegistrationId || 1);
    setFormIsInternal(true);
    setFormEmployeeId(101);
    setFormExternalName('');
    setFormExternalDesignation('Principal Structural Consultant');
    setFormExternalPhone('');
    setFormResponsibility('');
    setFormFromDate(new Date().toISOString().split('T')[0]);
    setFormRemarks('');
    setPopup({ mode: 'create' });
  };

  const openEditModal = (item: MockWorkManpowerMapping) => {
    setFormWorkId(item.workRegistrationId);
    setFormIsInternal(item.isInternal);
    setFormEmployeeId(item.employeeId || 101);
    setFormExternalName(item.externalEngineerName || '');
    setFormExternalDesignation(
      item.designation || 'Principal Structural Consultant'
    );
    setFormExternalPhone(item.externalEngineerContactNumber || '');
    setFormResponsibility(item.responsibility || '');
    setFormFromDate(item.fromDate || '');
    setFormRemarks(item.remarks || '');
    setPopup({ mode: 'edit', item });
  };

  const openRelieveModal = (item: MockWorkManpowerMapping) => {
    setRelieveDate(new Date().toISOString().split('T')[0]);
    setRelieveDocName('');
    setRelieveRemarks('');
    setPopup({ mode: 'relieve', item });
  };

  const handleRelieve = () => {
    if (popup.mode !== 'relieve' || !popup.item) return;
    if (!relieveDate) {
      ToastService.error('Relieving Date is required.');
      return;
    }

    const updated = mappings.map(m =>
      m.workManpowerMappingId === popup.item.workManpowerMappingId
        ? {
            ...m,
            toDate: relieveDate,
            isActive: false,
            relievingDocument: relieveDocName || undefined,
            relievingRemarks: relieveRemarks || 'Marked as Out / Relieved',
          }
        : m
    );

    saveMappings(updated);
    const personName = popup.item.isInternal
      ? popup.item.employeeName
      : popup.item.externalEngineerName;
    ToastService.success(
      `${personName || 'Personnel'} marked as Out / Relieved successfully.`
    );
    setPopup({ mode: 'closed' });
  };

  const handleSave = () => {
    if (!formWorkId) {
      ToastService.error('Work selection is required.');
      return;
    }
    if (!formIsInternal && !formExternalName.trim()) {
      ToastService.error('External Personnel Name is required.');
      return;
    }
    if (!formFromDate) {
      ToastService.error('From Date is required.');
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

    const empObj = formIsInternal
      ? INTERNAL_EMPLOYEES.find(e => e.value === formEmployeeId)
      : null;
    const empName = empObj ? empObj.text.split(' (')[0] : '';
    const empDesig = empObj ? empObj.text.split(' — ')[1] : '';

    if (popup.mode === 'create') {
      const newMapping: MockWorkManpowerMapping = {
        workManpowerMappingId: Date.now(),
        workRegistrationId: formWorkId,
        workRegistrationCode: workCode,
        workRegistrationName: workName,
        isInternal: formIsInternal,
        employeeId: formIsInternal ? formEmployeeId : undefined,
        employeeName: formIsInternal ? empName : undefined,
        designation: formIsInternal
          ? empDesig
          : formExternalDesignation || undefined,
        externalEngineerName: !formIsInternal ? formExternalName : undefined,
        externalEngineerContactNumber: !formIsInternal
          ? formExternalPhone
          : undefined,
        responsibility: formResponsibility,
        fromDate: formFromDate,
        remarks: formRemarks,
        isActive: true,
      };
      saveMappings([newMapping, ...mappings]);
      ToastService.success('Manpower successfully assigned to work.');
    } else if (popup.mode === 'edit' && popup.item) {
      const updated = mappings.map(m =>
        m.workManpowerMappingId === popup.item.workManpowerMappingId
          ? {
              ...m,
              workRegistrationId: formWorkId,
              workRegistrationCode: workCode,
              workRegistrationName: workName,
              isInternal: formIsInternal,
              employeeId: formIsInternal ? formEmployeeId : undefined,
              employeeName: formIsInternal ? empName : undefined,
              designation: formIsInternal
                ? empDesig
                : formExternalDesignation || undefined,
              externalEngineerName: !formIsInternal
                ? formExternalName
                : undefined,
              externalEngineerContactNumber: !formIsInternal
                ? formExternalPhone
                : undefined,
              responsibility: formResponsibility,
              fromDate: formFromDate,
              remarks: formRemarks,
            }
          : m
      );
      saveMappings(updated);
      ToastService.success('Manpower mapping updated successfully.');
    }
    setPopup({ mode: 'closed' });
  };

  const handleToggleStatus = (item: MockWorkManpowerMapping) => {
    const updated = mappings.map(m =>
      m.workManpowerMappingId === item.workManpowerMappingId
        ? { ...m, isActive: !m.isActive }
        : m
    );
    saveMappings(updated);
    ToastService.success(
      `Manpower mapping marked ${!item.isActive ? 'Active' : 'Inactive'}.`
    );
  };

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
      title="Work to Manpower Mapping"
      description="Map and manage engineering personnel, site supervisors, project managers, and responsibilities for registered civil works."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.adminPortal },
        { label: 'Work-Manpower Mapping' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={mappings}
          columns={[
            {
              field: 'workManpowerMappingId',
              header: '#',
              cell: (_, o) => <span>{o.rowIndex + 1}</span>,
              width: '50px',
            },
            {
              field: 'workRegistrationId',
              header: 'Work Registration',
              cell: (c: MockWorkManpowerMapping) => (
                <span>
                  {c.workRegistrationCode
                    ? `${c.workRegistrationCode} — ${c.workRegistrationName ?? ''}`
                    : `Reg #${c.workRegistrationId}`}
                </span>
              ),
              width: '270px',
            },
            {
              field: 'employeeId',
              header: 'Assigned Personnel / Staff',
              cell: (c: MockWorkManpowerMapping) => {
                if (!c.isInternal || c.externalEngineerName) {
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600, color: '#b45309' }}>
                        {c.externalEngineerName}{' '}
                        <span
                          style={{
                            fontSize: '0.72rem',
                            background: '#fef3c7',
                            color: '#92400e',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '0.25rem',
                          }}
                        >
                          External
                        </span>
                      </span>
                      {c.designation && (
                        <span style={{ fontSize: '0.75rem', color: '#4b5563' }}>
                          {c.designation}
                        </span>
                      )}
                      {c.externalEngineerContactNumber && (
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          📞 {c.externalEngineerContactNumber}
                        </span>
                      )}
                    </div>
                  );
                }
                return (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600, color: '#1e40af' }}>
                      {c.employeeName || `Employee #${c.employeeId}`}{' '}
                      <span
                        style={{
                          fontSize: '0.72rem',
                          background: '#eff6ff',
                          color: '#1e40af',
                          padding: '0.1rem 0.4rem',
                          borderRadius: '0.25rem',
                        }}
                      >
                        Internal
                      </span>
                    </span>
                    {c.designation && (
                      <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {c.designation}
                      </span>
                    )}
                  </div>
                );
              },
              width: '270px',
            },
            {
              field: 'responsibility',
              header: 'Responsibility / Role',
              cell: (c: MockWorkManpowerMapping) => (
                <span style={{ fontSize: '0.8125rem' }}>
                  {c.responsibility || '—'}
                </span>
              ),
              width: '240px',
            },
            {
              field: 'fromDate',
              header: 'From Date',
              width: '120px',
            },
            {
              field: 'toDate',
              header: 'To Date',
              cell: (c: MockWorkManpowerMapping) => (
                <span>{c.toDate || 'Present'}</span>
              ),
              width: '120px',
            },
            {
              field: 'isActive',
              header: 'Active',
              sortable: false,
              cell: (c: MockWorkManpowerMapping) => (
                <StatusButton
                  value={c.isActive}
                  onClick={() => handleToggleStatus(c)}
                />
              ),
              width: '80px',
            },
            {
              field: 'workManpowerMappingId',
              header: 'Actions',
              sortable: false,
              cell: (c: MockWorkManpowerMapping) => (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <GridActionButtons
                    onView={() => setPopup({ mode: 'view', item: c })}
                    onEdit={c.isActive ? () => openEditModal(c) : undefined}
                    viewTooltip="View Mapping Details"
                    editTooltip={c.isActive ? 'Edit Mapping' : undefined}
                  />
                  {c.isActive && (
                    <button
                      type="button"
                      title="Relieve / Mark Out Personnel"
                      onClick={() => openRelieveModal(c)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        backgroundColor: '#fff1f2',
                        color: '#e11d48',
                        border: '1px solid #fecdd3',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = '#ffe4e6';
                        e.currentTarget.style.borderColor = '#fda4af';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = '#fff1f2';
                        e.currentTarget.style.borderColor = '#fecdd3';
                      }}
                    >
                      <i
                        className="pi pi-sign-out"
                        style={{ fontSize: '0.8rem' }}
                      />
                    </button>
                  )}
                </div>
              ),
              width: '120px',
            },
          ]}
          toolbar={
            <Button
              label="Map Manpower"
              icon="plus"
              variant="primary"
              onClick={openCreateModal}
            />
          }
          searchBox
          searchPlaceholder="Search mappings by work, personnel, or responsibility..."
        />
      </FormCard>

      {/* Popup Modals */}
      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'create'
            ? 'Map Manpower to Civil Work'
            : popup.mode === 'edit'
              ? 'Edit Manpower Mapping'
              : popup.mode === 'relieve'
                ? 'Relieve / Mark Out Personnel'
                : popup.mode === 'view'
                  ? `Manpower Mapping — ${popup.item.workRegistrationCode ?? `Work Reg #${popup.item.workRegistrationId}`}`
                  : ''
        }
        subtitle={
          popup.mode === 'relieve'
            ? 'Record relieving / de-allocation details, order document, and reason.'
            : 'Detailed work to engineering personnel allocation record.'
        }
        size={popup.mode === 'relieve' ? 'md' : 'lg'}
      >
        {(popup.mode === 'create' || popup.mode === 'edit') && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <FormGrid columns={2}>
              <DropDownList
                label="Work Registration"
                data={workOptions}
                textField="text"
                optionValue="value"
                value={formWorkId}
                onChange={v => setFormWorkId(Number(v))}
                required
              />
              <DropDownList
                label="Personnel Source"
                data={[
                  {
                    label: 'Internal University Staff / Engineer',
                    value: 'INTERNAL',
                  },
                  {
                    label: 'External Consultant / Third-Party Inspector',
                    value: 'EXTERNAL',
                  },
                ]}
                textField="label"
                optionValue="value"
                value={formIsInternal ? 'INTERNAL' : 'EXTERNAL'}
                onChange={v => setFormIsInternal(v === 'INTERNAL')}
                required
              />
            </FormGrid>

            {formIsInternal ? (
              <FormGrid columns={2}>
                <DropDownList
                  label="Assigned University Employee"
                  data={INTERNAL_EMPLOYEES}
                  textField="text"
                  optionValue="value"
                  value={formEmployeeId}
                  onChange={v => setFormEmployeeId(Number(v))}
                  required
                />
                <DatePicker
                  label="Assignment Start Date (From Date)"
                  value={formFromDate ? new Date(formFromDate) : undefined}
                  onChange={d =>
                    setFormFromDate(d ? d.toISOString().split('T')[0] : '')
                  }
                  required
                />
              </FormGrid>
            ) : (
              <>
                <FormGrid columns={2}>
                  <TextBox
                    label="External Personnel / Expert Name"
                    placeholder="e.g. Er. Vikramaditya Rathore"
                    value={formExternalName}
                    onChange={setFormExternalName}
                    required
                  />
                  <DropDownList
                    label="Designation / Professional Title"
                    data={EXTERNAL_DESIGNATION_OPTIONS}
                    textField="text"
                    optionValue="value"
                    value={formExternalDesignation}
                    onChange={v => setFormExternalDesignation(String(v || ''))}
                    required
                  />
                </FormGrid>

                <FormGrid columns={2}>
                  <TextBox
                    label="Contact / Mobile Number"
                    placeholder="e.g. +91 98260 11223"
                    value={formExternalPhone}
                    onChange={setFormExternalPhone}
                  />
                  <DatePicker
                    label="Assignment Start Date (From Date)"
                    value={formFromDate ? new Date(formFromDate) : undefined}
                    onChange={d =>
                      setFormFromDate(d ? d.toISOString().split('T')[0] : '')
                    }
                    required
                  />
                </FormGrid>
              </>
            )}

            <div>
              <TextBox
                label="Responsibility / Scope of Role"
                placeholder="e.g. Lead Site Engineer, Structural QC Supervisor, Material Testing & Quality Signoff"
                value={formResponsibility}
                onChange={setFormResponsibility}
                maxLength={255}
              />
            </div>

            <div>
              <TextArea
                label="Remarks / Assignment Notes"
                placeholder="Additional details regarding manpower deployment, work scope, or handover notes..."
                value={formRemarks}
                onChange={setFormRemarks}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setPopup({ mode: 'closed' })}
              />
              <Button
                label={
                  popup.mode === 'create' ? 'Assign Manpower' : 'Update Mapping'
                }
                variant="primary"
                icon="save"
                onClick={handleSave}
              />
            </div>
          </div>
        )}

        {popup.mode === 'relieve' && popup.item && (
          <div>
            <div
              style={{
                marginBottom: '1rem',
                padding: '0.75rem',
                backgroundColor: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: '8px',
                fontSize: '0.8125rem',
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  color: '#92400e',
                  marginBottom: '0.25rem',
                }}
              >
                De-allocation / Relieving Confirmation
              </div>
              <div style={{ color: '#b45309' }}>
                You are marking{' '}
                <strong>
                  {popup.item.isInternal
                    ? popup.item.employeeName
                    : popup.item.externalEngineerName}
                </strong>{' '}
                as <strong>Out / Relieved</strong> from work{' '}
                <strong>
                  {popup.item.workRegistrationCode ??
                    `Work #${popup.item.workRegistrationId}`}
                </strong>
                .
              </div>
            </div>

            <DatePicker
              label="Relieving / Out Date"
              value={relieveDate ? new Date(relieveDate) : undefined}
              onChange={d =>
                setRelieveDate(d ? d.toISOString().split('T')[0] : '')
              }
              required
            />

            <div style={{ marginTop: '0.75rem' }}>
              <FileUpload
                label="Relieving Order / Handover Document (Optional)"
                accept=".pdf,.png,.jpg,.jpeg"
                mode="file"
                uploadNote="Max size 10MB (.pdf, .jpg, .png)"
                onChange={(file: File | null) =>
                  setRelieveDocName(file?.name || '')
                }
              />
            </div>

            <div style={{ marginTop: '0.75rem' }}>
              <TextArea
                label="Relieving Remarks / Reason for Out"
                placeholder="e.g. Work phase completed, transferred to another project, handover completed..."
                value={relieveRemarks}
                onChange={setRelieveRemarks}
                rows={3}
                required
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setPopup({ mode: 'closed' })}
              />
              <Button
                label="Relieve / Mark Out"
                variant="danger"
                icon="sign-out"
                onClick={handleRelieve}
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
                  label: 'Assigned Personnel',
                  value: !popup.item.isInternal ? (
                    <div>
                      <span style={{ fontWeight: 600, color: '#b45309' }}>
                        {popup.item.externalEngineerName} (External Personnel)
                      </span>
                      {popup.item.designation && (
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: '#4b5563',
                            fontWeight: 500,
                          }}
                        >
                          Designation: {popup.item.designation}
                        </div>
                      )}
                      {popup.item.externalEngineerContactNumber && (
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          Contact: {popup.item.externalEngineerContactNumber}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <span style={{ fontWeight: 600, color: '#1e40af' }}>
                        {popup.item.employeeName ||
                          `Employee #${popup.item.employeeId}`}{' '}
                        (Internal)
                      </span>
                      {popup.item.designation && (
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {popup.item.designation}
                        </div>
                      )}
                    </div>
                  ),
                },
                {
                  label: 'Responsibility / Role',
                  value: popup.item.responsibility || '—',
                },
                {
                  label: 'From Date',
                  value: popup.item.fromDate || '—',
                },
                {
                  label: 'To Date',
                  value: popup.item.toDate || 'Present / Ongoing',
                },
                {
                  label: 'Record Status',
                  value: (
                    <StatusBadge
                      label={popup.item.isActive ? 'Active' : 'Out / Relieved'}
                      variant={popup.item.isActive ? 'approved' : 'rejected'}
                    />
                  ),
                },
                {
                  label: 'Relieving Document',
                  value: popup.item.relievingDocument || '—',
                  hidden: !popup.item.relievingDocument,
                },
                {
                  label: 'Relieving Remarks',
                  value: popup.item.relievingRemarks || '—',
                  hidden: !popup.item.relievingRemarks,
                },
                {
                  label: 'Assignment Notes',
                  value: popup.item.remarks || '—',
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
