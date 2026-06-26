import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  DropDownList,
  DatePicker,
  TextBox,
  TextArea,
  FileUpload,
} from 'shared/components/forms';
import { FormCard, FormGrid, FormPage, GridPanel } from 'shared/new-components';
import { mockEmployees } from '../../mockData';

interface CareerEvent {
  id: string;
  employeeCode: string;
  eventType: string;
  eventDate: string;
  previousDesignation: string;
  newDesignation: string;
  newDepartment?: string;
  incrementDate?: string;
  separationReason?: string;
  orderRef?: string;
  remarks?: string;
}

const initialHistory: CareerEvent[] = [
  {
    id: '1',
    employeeCode: 'EMP-001',
    eventType: 'Promotion',
    eventDate: '2025-07-01',
    previousDesignation: 'Associate Professor',
    newDesignation: 'Professor',
    newDepartment: '',
    incrementDate: '2026-07-01',
    separationReason: '',
    orderRef: 'UNI/EST/2025/994',
    remarks: 'Promoted under Career Advancement Scheme (CAS).',
  },
  {
    id: '2',
    employeeCode: 'EMP-002',
    eventType: 'Transfer',
    eventDate: '2025-01-15',
    previousDesignation: 'Associate Professor',
    newDesignation: 'Associate Professor',
    newDepartment: 'Physics',
    incrementDate: '',
    separationReason: '',
    orderRef: 'UNI/EST/2025/112',
    remarks: 'Transferred due to departmental restructuring.',
  },
];

export default function CareerEventTracking() {
  const [selectedEmpCode, setSelectedEmpCode] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [reasonType, setReasonType] = useState('');
  const [cadre, setCadre] = useState('');
  const [newDesignation, setNewDesignation] = useState('');
  const [newDepartment, setNewDepartment] = useState('');
  const [incrementDate, setIncrementDate] = useState<Date | null>(null);
  const [separationReason, setSeparationReason] = useState('');
  const [orderRef, setOrderRef] = useState('');
  const [remarks, setRemarks] = useState('');
  const [history, setHistory] = useState<CareerEvent[]>(initialHistory);

  const selectedEmployee = mockEmployees.find(
    e => e.employeeCode === selectedEmpCode
  );
  const currentDesignation = selectedEmployee ? selectedEmployee.post : '';
  const currentDepartment = selectedEmployee
    ? selectedEmployee.organizationUnit
    : '';

  const employeeOptions = mockEmployees.map(e => ({
    name: `${e.fullName} (${e.employeeCode})`,
    value: e.employeeCode,
  }));

  const EVENT_TYPE_OPTIONS = [
    { name: 'Promotion', value: 'Promotion' },
    { name: 'Transfer', value: 'Transfer' },
    { name: 'Deputation', value: 'Deputation' },
    { name: 'Separation', value: 'Separation' },
    { name: 'Retirement', value: 'Retirement' },
    { name: 'Reinstatement', value: 'Reinstatement' },
  ];

  const REASON_OPTIONS = [
    { name: 'Career Advancement', value: 'Career Advancement' },
    { name: 'Administrative Transfer', value: 'Administrative Transfer' },
    { name: 'Personal Request', value: 'Personal Request' },
    { name: 'Superannuation', value: 'Superannuation' },
    { name: 'Resignation', value: 'Resignation' },
    { name: 'End of Contract', value: 'End of Contract' },
    { name: 'Other', value: 'Other' },
  ];

  const CADRE_OPTIONS = [
    { name: 'Permanent', value: 'Permanent' },
    { name: 'Contractual', value: 'Contractual' },
    { name: 'Guest', value: 'Guest' },
    { name: 'Ad-hoc', value: 'Ad-hoc' },
  ];

  const DESIGNATION_OPTIONS = [
    { name: 'Professor', value: 'Professor' },
    { name: 'Associate Professor', value: 'Associate Professor' },
    { name: 'Assistant Professor', value: 'Assistant Professor' },
    { name: 'Lecturer', value: 'Lecturer' },
    { name: 'Dean', value: 'Dean' },
    { name: 'Registrar', value: 'Registrar' },
  ];

  const DEPARTMENT_OPTIONS = [
    { name: 'Computer Science', value: 'Computer Science' },
    { name: 'Physics', value: 'Physics' },
    { name: 'Chemistry', value: 'Chemistry' },
    { name: 'Mathematics', value: 'Mathematics' },
    { name: 'Administration', value: 'Administration' },
  ];

  const SEPARATION_REASON_OPTIONS = [
    { name: 'Deceased', value: 'Deceased' },
    { name: 'Relieving', value: 'Relieving' },
    { name: 'Transfer', value: 'Transfer' },
    { name: 'Deputation', value: 'Deputation' },
  ];

  const handleSave = () => {
    if (!selectedEmpCode) {
      ToastService.error('Please select an employee.');
      return;
    }
    if (!eventType) {
      ToastService.error('Please select an Event Type.');
      return;
    }
    if (!eventDate) {
      ToastService.error('Please select an Event Date.');
      return;
    }
    // Warning trigger: "Cadre cannot be blank"
    if (!cadre) {
      ToastService.error('Cadre cannot be blank');
      return;
    }

    if (['Transfer', 'Deputation'].includes(eventType) && !newDepartment) {
      ToastService.error('New Department is required.');
      return;
    }
    if (eventType === 'Promotion' && !incrementDate) {
      ToastService.error('Increment Date is required.');
      return;
    }
    if (['Separation', 'Retirement'].includes(eventType) && !separationReason) {
      ToastService.error('Separation Reason is required.');
      return;
    }

    const eventDateStr = eventDate.toISOString().split('T')[0];
    const incrementDateStr = incrementDate
      ? incrementDate.toISOString().split('T')[0]
      : '';

    const newRecord: CareerEvent = {
      id: String(Date.now()),
      employeeCode: selectedEmpCode,
      eventType,
      eventDate: eventDateStr,
      previousDesignation: currentDesignation,
      newDesignation: newDesignation || currentDesignation,
      newDepartment: ['Transfer', 'Deputation'].includes(eventType)
        ? newDepartment
        : '',
      incrementDate: eventType === 'Promotion' ? incrementDateStr : '',
      separationReason: ['Separation', 'Retirement'].includes(eventType)
        ? separationReason
        : '',
      orderRef,
      remarks: remarks || `${eventType} event recorded.`,
    };

    setHistory(prev => [newRecord, ...prev]);
    ToastService.success('Career event recorded successfully.');

    // Clear form
    setEventType('');
    setEventDate(null);
    setReasonType('');
    setCadre('');
    setNewDesignation('');
    setNewDepartment('');
    setIncrementDate(null);
    setSeparationReason('');
    setOrderRef('');
    setRemarks('');
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      ToastService.success(`Document "${file.name}" uploaded successfully.`);
    }
  };

  const filteredHistory = history.filter(
    h => h.employeeCode === selectedEmpCode
  );

  const columns: Controls.ColumnProps<CareerEvent>[] = [
    { field: 'eventDate', header: 'Effective Date' },
    { field: 'eventType', header: 'Event Type' },
    {
      header: 'Details Change',
      cell: item => {
        if (item.eventType === 'Promotion') {
          return (
            <span>
              Designation: <strong>{item.previousDesignation}</strong> ➔{' '}
              <strong>{item.newDesignation}</strong>
            </span>
          );
        }
        if (['Transfer', 'Deputation'].includes(item.eventType)) {
          return (
            <span>
              Department ➔ <strong>{item.newDepartment}</strong>
            </span>
          );
        }
        if (['Separation', 'Retirement'].includes(item.eventType)) {
          return <span>Separated ({item.separationReason})</span>;
        }
        return <span>No structural changes</span>;
      },
    },
    { field: 'orderRef', header: 'Order Reference' },
    { field: 'remarks', header: 'Remarks' },
  ];

  return (
    <FormPage
      title="Career Event Tracking"
      breadcrumbs={[
        { label: 'Employee Management', to: '/employee-management' },
        { label: 'Career Event Tracking' },
      ]}
    >
      <div className="flex flex-col gap-6">
        <FormCard title="Log Career Lifecycle Event" icon="timeline">
          <FormGrid columns={3}>
            <DropDownList
              label="Select Employee"
              data={employeeOptions}
              textField="name"
              optionValue="value"
              placeholder="Search by name or code"
              value={selectedEmpCode}
              onChange={v => setSelectedEmpCode(String(v ?? ''))}
              required
            />
            <TextBox
              label="Current Designation"
              value={currentDesignation || '—'}
              disabled
            />
            <TextBox
              label="Current Department"
              value={currentDepartment || '—'}
              disabled
            />

            <DropDownList
              label="Event Type"
              data={EVENT_TYPE_OPTIONS}
              textField="name"
              optionValue="value"
              placeholder="Select Event Type"
              value={eventType}
              onChange={v => setEventType(String(v ?? ''))}
              required
            />
            <DatePicker
              label="Event Date"
              value={eventDate ?? undefined}
              onChange={v => setEventDate(v ?? null)}
              required
            />
            <DropDownList
              label="Type of Employment (Cadre)"
              data={CADRE_OPTIONS}
              textField="name"
              optionValue="value"
              placeholder="Select Cadre"
              value={cadre}
              onChange={v => setCadre(String(v ?? ''))}
              required
            />

            <DropDownList
              label="Reason for Action"
              data={REASON_OPTIONS}
              textField="name"
              optionValue="value"
              placeholder="Select Reason"
              value={reasonType}
              onChange={v => setReasonType(String(v ?? ''))}
              required
            />
            <DropDownList
              label="New Designation"
              data={DESIGNATION_OPTIONS}
              textField="name"
              optionValue="value"
              placeholder="Select New Designation"
              value={newDesignation}
              onChange={v => setNewDesignation(String(v ?? ''))}
              required
            />

            {['Transfer', 'Deputation'].includes(eventType) && (
              <DropDownList
                label="New Department"
                data={DEPARTMENT_OPTIONS}
                textField="name"
                optionValue="value"
                placeholder="Select New Department"
                value={newDepartment}
                onChange={v => setNewDepartment(String(v ?? ''))}
                required
              />
            )}

            {eventType === 'Promotion' && (
              <DatePicker
                label="Increment Date"
                value={incrementDate ?? undefined}
                onChange={v => setIncrementDate(v ?? null)}
                required
              />
            )}

            {['Separation', 'Retirement'].includes(eventType) && (
              <DropDownList
                label="Separation Reason"
                data={SEPARATION_REASON_OPTIONS}
                textField="name"
                optionValue="value"
                placeholder="Select Separation Reason"
                value={separationReason}
                onChange={v => setSeparationReason(String(v ?? ''))}
                required
              />
            )}

            <TextBox
              label="Order Reference Number"
              placeholder="e.g. UNI/EST/2026/102"
              value={orderRef}
              onChange={v => setOrderRef(v)}
            />
            <div className="col-span-1">
              <FileUpload
                id="orderDoc"
                label="Upload Order Document"
                mode="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
            </div>

            <div className="col-span-3">
              <TextArea
                label="Remarks"
                placeholder="Add career transition remarks or audit trail details..."
                value={remarks}
                onChange={v => setRemarks(v)}
              />
            </div>
          </FormGrid>

          <div className="form-actions-container form-actions-right mt-6">
            <Button
              label="Record Event"
              type="button"
              icon="save"
              variant="primary"
              onClick={handleSave}
            />
          </div>
        </FormCard>

        {selectedEmpCode && (
          <FormCard title="Chronological Career History" icon="list">
            <GridPanel
              data={filteredHistory}
              columns={columns}
              emptyMessage="No historical career events logged for this employee."
            />
          </FormCard>
        )}
      </div>
    </FormPage>
  );
}
