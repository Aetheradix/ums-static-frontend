import { useState } from 'react';
import {
  useHostelContext,
  useHostelRole,
  MOCK_STUDENT_ID,
  MOCK_STUDENT_NAME,
} from '../../context/HostelContext';
import { FormPage, FormCard, FormGrid, GridPanel } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import Modal from 'shared/components/popups/Modal';

export default function MaintenanceTicketing() {
  const { data, addRecord, updateRecord } = useHostelContext();
  const { isStudent, isWarden, isAdmin, activePortal } = useHostelRole();

  // New Ticket Form State (Student, Warden, & Admin)
  const initialTicketForm = {
    studentId: isStudent ? MOCK_STUDENT_ID : 'S101',
    studentName: isStudent ? MOCK_STUDENT_NAME : '',
    roomNumber: isStudent ? 'A-101' : '',
    assetId: '',
    category: 'Electrical' as
      | 'Plumbing'
      | 'Electrical'
      | 'Structural'
      | 'Furniture'
      | 'General',
    urgency: 'Medium' as 'Low' | 'Medium' | 'High' | 'Emergency',
    description: '',
  };
  const [form, setForm] = useState(initialTicketForm);

  // Caretaker Assign Modal State
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [technicianName, setTechnicianName] = useState('');

  // Sign-Off Modal State (Student & Warden)
  const [signOffModalOpen, setSignOffModalOpen] = useState(false);
  const [signOffTicket, setSignOffTicket] = useState<any>(null);
  const [digitalSignatureText, setDigitalSignatureText] = useState(
    isStudent
      ? MOCK_STUDENT_NAME
      : isWarden
        ? 'Warden Rajesh Kumar'
        : 'Admin User'
  );

  // Filter data based on role
  const filteredTickets = isStudent
    ? (data.maintenanceTickets || []).filter(
        t =>
          t.studentId === MOCK_STUDENT_ID || t.studentName === MOCK_STUDENT_NAME
      )
    : data.maintenanceTickets || [];

  const handleLogTicket = () => {
    const sId = isStudent ? MOCK_STUDENT_ID : form.studentId || 'STAFF';
    const sName = isStudent
      ? MOCK_STUDENT_NAME
      : form.studentName || (isWarden ? 'Warden Logged' : 'Admin Logged');

    if (!form.roomNumber || !form.description) {
      alert('Please fill in Room/Location Number and Issue Description.');
      return;
    }

    addRecord('maintenanceTickets', {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: sId,
      studentName: sName,
      roomNumber: form.roomNumber,
      assetId: form.assetId,
      category: form.category,
      urgency: form.urgency,
      description: form.description,
      assignedTechnician: 'Unassigned',
      status: 'Logged',
      loggedDate: new Date().toISOString().split('T')[0],
      assignedDate: '',
      resolvedDate: '',
      studentSignature: '',
    });

    setForm({
      ...initialTicketForm,
      studentId: isStudent ? MOCK_STUDENT_ID : 'S101',
      studentName: isStudent ? MOCK_STUDENT_NAME : '',
    });
  };

  const handleAssignTechnician = () => {
    if (!technicianName.trim()) {
      alert('Please enter or select a technician name.');
      return;
    }
    if (selectedTicket) {
      updateRecord('maintenanceTickets', selectedTicket.id, {
        ...selectedTicket,
        assignedTechnician: technicianName,
        status: 'Assigned',
        assignedDate: new Date().toISOString().split('T')[0],
      });
      setAssignModalOpen(false);
      setSelectedTicket(null);
      setTechnicianName('');
    }
  };

  const handleSignOff = () => {
    if (!digitalSignatureText.trim()) {
      alert('Please type full name for verification signature.');
      return;
    }
    if (signOffTicket) {
      const signerRole = isStudent ? 'Student' : isWarden ? 'Warden' : 'Admin';
      updateRecord('maintenanceTickets', signOffTicket.id, {
        ...signOffTicket,
        status: 'Resolved',
        resolvedDate: new Date().toISOString().split('T')[0],
        studentSignature: `${digitalSignatureText.trim()} (${signerRole} Verified on ${new Date().toLocaleDateString()})`,
      });
      setSignOffModalOpen(false);
      setSignOffTicket(null);
    }
  };

  const portalLabel =
    activePortal === 'student'
      ? 'Student Portal'
      : activePortal === 'warden'
        ? 'Warden Portal'
        : 'Admin Portal';
  const portalPath = `/hostel-services/${activePortal}`;

  return (
    <FormPage
      title="Maintenance Ticketing & Repair Workflow"
      description="Raise maintenance tickets (by Student or Warden), assign technicians, track repair statuses, and verify completion with digital sign-offs."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Services', to: '/home/sub-menu/hostel-services' },
        { label: portalLabel, to: portalPath },
        { label: 'Maintenance Ticketing' },
      ]}
    >
      {/* ── WORKFLOW BANNER ── */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
            <span className="material-symbols-outlined">build</span>
          </div>
          <div>
            <h4 className="font-bold text-blue-950 text-sm m-0">
              3-Step Maintenance Ticket Workflow
            </h4>
            <p className="text-xs text-blue-700 m-0 mt-0.5">
              1. <strong>Student / Warden raises ticket</strong> (Logged) → 2.{' '}
              <strong>Caretaker assigns technician</strong> (Assigned) → 3.{' '}
              <strong>Student / Warden signs off</strong> (Resolved).
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <span className="px-2.5 py-1 rounded bg-orange-100 text-orange-800 text-xs font-bold">
            1. Logged
          </span>
          <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-800 text-xs font-bold">
            2. Assigned
          </span>
          <span className="px-2.5 py-1 rounded bg-green-100 text-green-800 text-xs font-bold">
            3. Resolved
          </span>
        </div>
      </div>

      {/* ── LOG TICKET FORM (Students, Wardens, & Admin) ── */}
      <FormCard
        title={
          isStudent
            ? 'Raise Maintenance Ticket (Student)'
            : isWarden
              ? 'Raise Maintenance Ticket (Warden / Staff)'
              : 'Raise Maintenance Ticket (Admin)'
        }
        icon="add_task"
      >
        <FormGrid columns={3}>
          {!isStudent && (
            <TextBox
              label="Student Name / Location *"
              value={form.studentName}
              onChange={v => setForm({ ...form, studentName: v })}
              placeholder="e.g. Rahul Verma or Hostel Common Area"
            />
          )}
          <TextBox
            label="Room / Location No. *"
            value={form.roomNumber}
            onChange={v => setForm({ ...form, roomNumber: v })}
            placeholder="e.g. A-101, Mess Hall, Corridor"
          />
          <DropDownList
            label="Category *"
            data={[
              { id: 'Plumbing', text: 'Plumbing (taps, pipes, leakage)' },
              { id: 'Electrical', text: 'Electrical (fan, bulb, switch)' },
              { id: 'Furniture', text: 'Furniture (desk, bed, chair)' },
              { id: 'Structural', text: 'Structural (door, window, wall)' },
              { id: 'General', text: 'General Maintenance' },
            ]}
            textField="text"
            valueField="id"
            value={form.category}
            onChange={v => setForm({ ...form, category: v as any })}
          />
          <DropDownList
            label="Urgency Level *"
            data={[
              { id: 'Low', text: 'Low' },
              { id: 'Medium', text: 'Medium' },
              { id: 'High', text: 'High' },
              { id: 'Emergency', text: 'Emergency' },
            ]}
            textField="text"
            valueField="id"
            value={form.urgency}
            onChange={v => setForm({ ...form, urgency: v as any })}
          />

          <DropDownList
            label="Asset ID (Optional)"
            data={[
              { id: '', text: '-- Select Asset --' },
              ...(data.hostelUtilities || []).map(u => ({
                id: u.id,
                text: `${u.assetName} (${u.category})`,
              })),
            ]}
            textField="text"
            valueField="id"
            value={form.assetId}
            onChange={v => setForm({ ...form, assetId: v as string })}
          />

          <div className="col-span-2">
            <TextBox
              label="Issue Description *"
              value={form.description}
              onChange={v => setForm({ ...form, description: v })}
              placeholder="Describe the maintenance issue in detail..."
            />
          </div>
        </FormGrid>
        <div className="mt-4 flex gap-3">
          <Button
            label="Submit Ticket"
            variant="primary"
            onClick={handleLogTicket}
          />
          <Button
            label="Clear"
            variant="outlined"
            onClick={() => setForm(initialTicketForm)}
          />
        </div>
      </FormCard>

      {/* ── TICKETS TABLE ── */}
      <FormCard
        title={isStudent ? 'My Maintenance Tickets' : 'All Maintenance Tickets'}
        icon="list_alt"
      >
        <GridPanel
          data={filteredTickets}
          columns={[
            { field: 'id', header: 'Ticket ID' },
            ...(!isStudent
              ? [{ field: 'studentName', header: 'Logged For / By' }]
              : []),
            { field: 'roomNumber', header: 'Room / Location' },
            { field: 'category', header: 'Category' },
            {
              field: 'urgency',
              header: 'Urgency',
              cell: (item: any) => (
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold ${
                    item.urgency === 'Emergency' || item.urgency === 'High'
                      ? 'bg-red-100 text-red-800'
                      : item.urgency === 'Medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {item.urgency}
                </span>
              ),
            },
            { field: 'description', header: 'Description' },
            {
              field: 'assignedTechnician',
              header: 'Assigned Technician',
              cell: (item: any) => (
                <span className="font-semibold text-gray-700">
                  {item.assignedTechnician || 'Unassigned'}
                </span>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              cell: (item: any) => (
                <span
                  className={`px-2 py-1 rounded text-xs font-extrabold ${
                    item.status === 'Resolved'
                      ? 'bg-green-100 text-green-800'
                      : item.status === 'Assigned'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-orange-100 text-orange-800'
                  }`}
                >
                  {item.status === 'Logged'
                    ? '1. Logged'
                    : item.status === 'Assigned'
                      ? '2. Assigned'
                      : '3. Resolved'}
                </span>
              ),
            },
            { field: 'loggedDate', header: 'Logged Date' },
            {
              field: 'studentSignature',
              header: 'Digital Sign-Off',
              cell: (item: any) =>
                item.studentSignature ? (
                  <span className="text-xs text-green-700 font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      verified
                    </span>
                    {item.studentSignature}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">
                    Pending Sign-Off
                  </span>
                ),
            },

            // ── ACTION BUTTONS FOR WORKFLOW ──
            {
              header: 'Workflow Action',
              sortable: false,
              cell: (item: any) => (
                <div className="flex gap-2">
                  {/* Step 2: Caretaker / Warden / Admin Assigns Technician */}
                  {(isWarden || isAdmin) && item.status === 'Logged' && (
                    <Button
                      label="Assign Technician"
                      variant="primary"
                      size="small"
                      icon="engineering"
                      onClick={() => {
                        setSelectedTicket(item);
                        setTechnicianName('');
                        setAssignModalOpen(true);
                      }}
                    />
                  )}

                  {/* Step 3: Student / Warden Sign-Off */}
                  {item.status === 'Assigned' && (
                    <Button
                      label={
                        isStudent ? 'Sign-Off & Resolve' : 'Verify & Resolve'
                      }
                      variant="primary"
                      size="small"
                      icon="draw"
                      onClick={() => {
                        setSignOffTicket(item);
                        setDigitalSignatureText(
                          isStudent
                            ? MOCK_STUDENT_NAME
                            : isWarden
                              ? 'Warden Rajesh Kumar'
                              : 'Admin User'
                        );
                        setSignOffModalOpen(true);
                      }}
                    />
                  )}
                </div>
              ),
            },
          ]}
        />
      </FormCard>

      {/* ── MODAL 1: CARETAKER / WARDEN ASSIGNS TECHNICIAN ── */}
      <Modal
        header="Assign Technician / Worker (Caretaker / Warden)"
        visible={assignModalOpen}
        onHide={() => {
          setAssignModalOpen(false);
          setSelectedTicket(null);
        }}
        size="medium"
      >
        {selectedTicket && (
          <div className="p-4 flex flex-col gap-4">
            <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-900 border border-blue-200 flex flex-col gap-1">
              <div>
                <strong>Ticket ID:</strong> {selectedTicket.id} |{' '}
                <strong>Location:</strong> {selectedTicket.roomNumber}
              </div>
              <div>
                <strong>Category:</strong> {selectedTicket.category} |{' '}
                <strong>Urgency:</strong> {selectedTicket.urgency}
              </div>
              <div>
                <strong>Issue:</strong> {selectedTicket.description}
              </div>
            </div>

            <DropDownList
              label="Select Technician *"
              data={[
                {
                  id: 'Ramesh Electrician',
                  text: 'Ramesh Electrician (Electrical Dept)',
                },
                {
                  id: 'Suresh Plumber',
                  text: 'Suresh Plumber (Plumbing Dept)',
                },
                {
                  id: 'Karan Carpenter',
                  text: 'Karan Carpenter (Furniture Dept)',
                },
                { id: 'Vinod Mason', text: 'Vinod Mason (Civil/Structural)' },
                {
                  id: 'General Maintenance Crew',
                  text: 'General Maintenance Crew',
                },
              ]}
              textField="text"
              valueField="id"
              value={technicianName}
              onChange={v => setTechnicianName(v as string)}
            />

            <TextBox
              label="Or Type Technician Name & Phone"
              value={technicianName}
              onChange={v => setTechnicianName(v)}
              placeholder="e.g. Mukesh Plumber (Ph: 9876511111)"
            />

            <div className="mt-4 flex justify-end gap-2 border-t pt-3">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setAssignModalOpen(false)}
              />
              <Button
                label="Confirm & Change Status to 'Assigned'"
                variant="primary"
                onClick={handleAssignTechnician}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* ── MODAL 2: DIGITAL SIGN-OFF & RESOLUTION VERIFICATION ── */}
      <Modal
        header="Digital Sign-Off & Verification (Resolution Confirmation)"
        visible={signOffModalOpen}
        onHide={() => {
          setSignOffModalOpen(false);
          setSignOffTicket(null);
        }}
        size="medium"
      >
        {signOffTicket && (
          <div className="p-4 flex flex-col gap-4">
            <div className="p-3 bg-green-50 rounded-lg text-xs text-green-900 border border-green-200 flex flex-col gap-1">
              <div>
                <strong>Ticket ID:</strong> {signOffTicket.id} |{' '}
                <strong>Technician:</strong> {signOffTicket.assignedTechnician}
              </div>
              <div>
                <strong>Issue:</strong> {signOffTicket.description}
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded border text-xs text-gray-700">
              <p className="m-0 font-bold text-gray-800">
                Verification Confirmation Statement:
              </p>
              <p className="m-0 mt-1 italic">
                "I hereby confirm that the assigned technician has inspected and
                satisfactorily repaired the reported issue. By providing my
                signature below, I authorize closing this ticket as Resolved."
              </p>
            </div>

            <TextBox
              label="Full Name (Digital Verification Signature) *"
              value={digitalSignatureText}
              onChange={v => setDigitalSignatureText(v)}
              placeholder="e.g. Rahul Verma or Warden Rajesh Kumar"
            />

            <div className="mt-4 flex justify-end gap-2 border-t pt-3">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setSignOffModalOpen(false)}
              />
              <Button
                label="Digitally Sign-Off & Close Ticket as 'Resolved'"
                variant="primary"
                onClick={handleSignOff}
              />
            </div>
          </div>
        )}
      </Modal>
    </FormPage>
  );
}
