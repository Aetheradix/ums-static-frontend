import { useState } from 'react';
import { useGrievance } from '../context';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  FormPopup,
} from 'shared/new-components';
import { TextBox, DropDownList, DatePicker } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import type {
  GrievanceCommittee as CommType,
  CommitteeMemberDetail,
} from '../data';

const MEMBER_DROPDOWN_OPTIONS = [
  { id: 'Dr. Rajeshwari Sen', text: 'Dr. Rajeshwari Sen (HOD Chemistry)' },
  { id: 'Prof. Vinay Kumar', text: 'Prof. Vinay Kumar (Dean Academics)' },
  { id: 'Prof. Alok Mehta', text: 'Prof. Alok Mehta (CS Department)' },
  { id: 'Dr. Sumita Rao', text: 'Dr. Sumita Rao (Warden)' },
  { id: 'Dr. Preeti Gupta', text: 'Dr. Preeti Gupta (Biotech)' },
  { id: 'Shri Suresh Nair (Registrar)', text: 'Shri Suresh Nair (Registrar)' },
  { id: 'Dr. M. K. Rawat', text: 'Dr. M. K. Rawat (Finance Officer)' },
  { id: 'Prof. K. Chandran', text: 'Prof. K. Chandran (Mech Dept)' },
  { id: 'Shri Lalit Kumar', text: 'Shri Lalit Kumar (Admin Assistant)' },
  { id: 'Shri R. K. Saxena', text: 'Shri R. K. Saxena (Asst Registrar)' },
  { id: 'Smt. Rashmi Sinha', text: 'Smt. Rashmi Sinha (HR Manager)' },
];

const BLANK_COMMITTEE_FORM = {
  name: '',
  shortName: '',
};

export default function GrievanceCommittee() {
  const {
    committees,
    addCommittee,
    updateCommittee,
    dissolveCommittee,
    addCommitteeMembers,
    dissolveMember,
    activeRole,
    triggerNotification,
  } = useGrievance();

  const [commForm, setCommForm] = useState({ ...BLANK_COMMITTEE_FORM });
  const [editingCommId, setEditingCommId] = useState<string | null>(null);

  // Modals / Popups States
  const [activeCommittee, setActiveCommittee] = useState<CommType | null>(null);
  const [isViewPopupOpen, setIsViewPopupOpen] = useState(false);
  const [isManageMembersOpen, setIsManageMembersOpen] = useState(false);

  // Manage Members Modal Form State
  const [membersForm, setMembersForm] = useState({
    chairman: [] as string[],
    instituteMembers: [] as string[],
    exOfficio: [] as string[],
    scStRep: [] as string[],
    memberSecretary: [] as string[],
    nonInstitute: [] as CommitteeMemberDetail[],
    effectiveDate: '',
    approvedOn: '',
    approvedTill: '',
    document: '',
  });

  // Temp individual input for adding to arrays in Manage Members form
  const [tempChair, setTempChair] = useState('');
  const [tempInst, setTempInst] = useState('');
  const [tempExOf, setTempExOf] = useState('');
  const [tempScSt, setTempScSt] = useState('');
  const [tempMembSec, setTempMembSec] = useState('');

  // Non-institute members temp details
  const [nonInstName, setNonInstName] = useState('');
  const [nonInstDept, setNonInstDept] = useState('');
  const [nonInstDesig, setNonInstDesig] = useState('');
  const [nonInstEmail, setNonInstEmail] = useState('');
  const [nonInstMobile, setNonInstMobile] = useState('');

  const isAdmin =
    activeRole === 'grievance_admin_staff' ||
    activeRole === 'grievance_admin_student';

  const handleCommSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commForm.name.trim() || !commForm.shortName.trim()) return;

    if (editingCommId) {
      updateCommittee(editingCommId, commForm);
      setEditingCommId(null);
    } else {
      addCommittee(commForm);
    }
    setCommForm({ ...BLANK_COMMITTEE_FORM });
  };

  const handleCommEdit = (comm: CommType) => {
    setCommForm({
      name: comm.name,
      shortName: comm.shortName,
    });
    setEditingCommId(comm.id);
  };

  const handleDissolveComm = (comm: CommType) => {
    if (
      confirm(
        `Are you sure you want to dissolve the grievance committee "${comm.name}"? After dissolution, you cannot work with it again.`
      )
    ) {
      dissolveCommittee(comm.id);
    }
  };

  const handleDissolveMemberAction = (
    committeeId: string,
    memberName: string,
    roleField: keyof CommType
  ) => {
    if (
      confirm(
        `Are you sure you want to Inactivate the member "${memberName}"? After inactivation, you cannot activate them again.`
      )
    ) {
      dissolveMember(committeeId, memberName, roleField);
      // Update local state if activeCommittee is open
      if (activeCommittee && activeCommittee.id === committeeId) {
        const updated = committees.find(c => c.id === committeeId);
        if (updated) {
          setActiveCommittee(updated);
        }
      }
    }
  };

  const openManageMembers = (comm: CommType) => {
    setActiveCommittee(comm);
    setMembersForm({
      chairman: comm.chairman || [],
      instituteMembers: comm.instituteMembers || [],
      exOfficio: comm.exOfficio || [],
      scStRep: comm.scStRep || [],
      memberSecretary: comm.memberSecretary || [],
      nonInstitute: comm.nonInstitute || [],
      effectiveDate: comm.effectiveDate || '',
      approvedOn: comm.approvedOn || '',
      approvedTill: comm.approvedTill || '',
      document: comm.document || '',
    });
    setIsManageMembersOpen(true);
  };

  const saveMembers = () => {
    if (!activeCommittee) return;
    addCommitteeMembers(activeCommittee.id, membersForm);
    setIsManageMembersOpen(false);
    setActiveCommittee(null);
  };

  if (!isAdmin) {
    return (
      <FormPage
        title="Grievance Committee Settings"
        breadcrumbs={[
          {
            label: 'Grievance Management',
            to: '/grievance-management/dashboard',
          },
          { label: 'Committee Settings' },
        ]}
      >
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded shadow-sm text-center">
          <i className="pi pi-exclamation-triangle text-2xl mb-2" />
          <h2 className="font-bold text-lg">Permission Denied</h2>
          <p className="text-sm mt-1">
            Only users with role <b>grievance_admin_staff</b> or{' '}
            <b>grievance_admin_student</b> can access committee configuration.
          </p>
        </div>
      </FormPage>
    );
  }

  return (
    <FormPage
      title="Grievance Committee Settings"
      description="Define, manage, assign members to, and dissolve grievance redressal committees"
      breadcrumbs={[
        {
          label: 'Grievance Management',
          to: '/grievance-management/dashboard',
        },
        { label: 'Settings', to: '/home/sub-menu/grievance-settings' },
        { label: 'Grievance Committee' },
      ]}
    >
      {/* ── Add / Edit Committee Form ── */}
      <FormGrid columns={1}>
        <FormCard
          title={
            editingCommId
              ? 'Update Grievance Committee'
              : 'Add Grievance Committee'
          }
          icon="group_add"
        >
          <form onSubmit={handleCommSubmit}>
            <FormGrid columns={3}>
              <TextBox
                label="Committee Name *"
                placeholder="e.g. Employee Welfare Committee"
                value={commForm.name}
                onChange={v => setCommForm(p => ({ ...p, name: v }))}
                required
              />
              <TextBox
                label="Short Name / Abbreviation *"
                placeholder="e.g. EWC"
                value={commForm.shortName}
                onChange={v => setCommForm(p => ({ ...p, shortName: v }))}
                required
              />
            </FormGrid>
            <div className="form-actions-row mt-4">
              <Button
                label={editingCommId ? 'Update Committee' : 'Add Committee'}
                icon="save"
                variant="primary"
                type="submit"
              />
              {editingCommId && (
                <Button
                  label="Cancel"
                  variant="outlined"
                  onClick={() => {
                    setEditingCommId(null);
                    setCommForm({ ...BLANK_COMMITTEE_FORM });
                  }}
                />
              )}
              <Button
                label="Reset"
                variant="outlined"
                onClick={() => setCommForm({ ...BLANK_COMMITTEE_FORM })}
              />
            </div>
          </form>
        </FormCard>
      </FormGrid>

      {/* ── Committee Grid List ── */}
      <div className="mt-6">
        <FormCard title="Redressal Committees" icon="list">
          <GridPanel
            data={committees}
            columns={[
              { field: 'id', header: 'ID', width: '90px' },
              { field: 'name', header: 'Committee Name' },
              { field: 'shortName', header: 'Abbr.', width: '100px' },
              {
                field: 'status',
                header: 'Status',
                cell: (item: CommType) => (
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                      item.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-700'
                        : item.status === 'Inactive'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {item.status}
                  </span>
                ),
              },
              {
                header: 'Actions',
                sortable: false,
                cell: (item: CommType) => {
                  const isDissolved = item.status === 'Dissolved';
                  return (
                    <div className="flex gap-2">
                      <Button
                        label="View"
                        icon="eye"
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setActiveCommittee(item);
                          setIsViewPopupOpen(true);
                        }}
                      />
                      <Button
                        label="Edit"
                        icon="pencil"
                        variant="outlined"
                        size="small"
                        disabled={isDissolved}
                        onClick={() => handleCommEdit(item)}
                      />
                      <Button
                        label="Add/Manage Members"
                        icon="user-edit"
                        variant="outlined"
                        size="small"
                        disabled={isDissolved}
                        onClick={() => openManageMembers(item)}
                      />
                      <Button
                        label="Dissolve"
                        icon="ban"
                        variant="danger"
                        size="small"
                        disabled={isDissolved}
                        onClick={() => handleDissolveComm(item)}
                      />
                    </div>
                  );
                },
              },
            ]}
            searchBox
          />
        </FormCard>
      </div>

      {/* ── View details Modal ── */}
      <FormPopup
        visible={isViewPopupOpen}
        onHide={() => setIsViewPopupOpen(false)}
        title="Grievance Committee Overview"
        subtitle={activeCommittee?.name}
        size="lg"
        footer={
          <Button
            label="Close"
            variant="primary"
            onClick={() => setIsViewPopupOpen(false)}
          />
        }
      >
        {activeCommittee && (
          <div className="space-y-6 text-sm">
            {/* Validity details */}
            <div className="grid grid-cols-3 gap-4 border-b border-gray-100 pb-3">
              <div>
                <span className="font-semibold text-gray-500 block">
                  Effective Date
                </span>
                <span className="text-gray-900 font-medium">
                  {activeCommittee.effectiveDate || 'Not configured'}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-500 block">
                  Approved On
                </span>
                <span className="text-gray-900 font-medium">
                  {activeCommittee.approvedOn || 'Not configured'}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-500 block">
                  Approved Till
                </span>
                <span className="text-gray-900 font-medium">
                  {activeCommittee.approvedTill || 'Not configured'}
                </span>
              </div>
            </div>

            {/* Members listings */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 text-base">
                Assigned Redressal Members
              </h3>

              {/* Chairman */}
              <div>
                <span className="font-bold text-indigo-700 block mb-1">
                  Chairman
                </span>
                {activeCommittee.chairman?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {activeCommittee.chairman.map(c => (
                      <span
                        key={c}
                        className="bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full flex items-center gap-2"
                      >
                        {c}
                        <button
                          type="button"
                          className="pi pi-times-circle text-red-500 hover:text-red-700"
                          onClick={() =>
                            handleDissolveMemberAction(
                              activeCommittee.id,
                              c,
                              'chairman'
                            )
                          }
                        />
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400 italic">
                    No chairman assigned.
                  </span>
                )}
              </div>

              {/* Institute Members */}
              <div>
                <span className="font-bold text-slate-700 block mb-1">
                  Institute Members
                </span>
                {activeCommittee.instituteMembers?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {activeCommittee.instituteMembers.map(m => (
                      <span
                        key={m}
                        className="bg-slate-100 border border-slate-200 px-3 py-1 rounded-full flex items-center gap-2"
                      >
                        {m}
                        <button
                          type="button"
                          className="pi pi-times-circle text-red-500 hover:text-red-700"
                          onClick={() =>
                            handleDissolveMemberAction(
                              activeCommittee.id,
                              m,
                              'instituteMembers'
                            )
                          }
                        />
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400 italic">
                    No institute members assigned.
                  </span>
                )}
              </div>

              {/* Member Secretary */}
              <div>
                <span className="font-bold text-teal-700 block mb-1">
                  Member Secretary
                </span>
                {activeCommittee.memberSecretary?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {activeCommittee.memberSecretary.map(m => (
                      <span
                        key={m}
                        className="bg-teal-50 border border-teal-200 px-3 py-1 rounded-full flex items-center gap-2"
                      >
                        {m}
                        <button
                          type="button"
                          className="pi pi-times-circle text-red-500 hover:text-red-700"
                          onClick={() =>
                            handleDissolveMemberAction(
                              activeCommittee.id,
                              m,
                              'memberSecretary'
                            )
                          }
                        />
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400 italic">
                    No member secretary assigned.
                  </span>
                )}
              </div>

              {/* Non-Institute Members */}
              <div>
                <span className="font-bold text-amber-700 block mb-1">
                  Non-Institute Members (External Experts)
                </span>
                {activeCommittee.nonInstitute?.length > 0 ? (
                  <div className="space-y-2 border border-amber-200 rounded p-3 bg-amber-50/30">
                    {activeCommittee.nonInstitute.map(m => (
                      <div
                        key={m.email}
                        className="flex justify-between items-center bg-white p-2 rounded shadow-sm border border-amber-100"
                      >
                        <div>
                          <p className="font-semibold text-gray-800">
                            {m.name} ({m.designation})
                          </p>
                          <p className="text-xs text-gray-500">
                            {m.department} | Email: {m.email} | Mob: {m.mobile}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="pi pi-trash text-red-500 hover:text-red-700 p-1"
                          onClick={() =>
                            handleDissolveMemberAction(
                              activeCommittee.id,
                              m.name,
                              'nonInstitute'
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400 italic">
                    No external experts mapped.
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </FormPopup>

      {/* ── Manage Members Modal ── */}
      <FormPopup
        visible={isManageMembersOpen}
        onHide={() => setIsManageMembersOpen(false)}
        title="Add Grievance Committee Members"
        subtitle={activeCommittee?.name}
        size="xl"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setIsManageMembersOpen(false)}
            />
            <Button
              label="Save Changes"
              variant="primary"
              onClick={saveMembers}
            />
          </div>
        }
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {/* Validity dates */}
          <div className="border border-slate-200 rounded p-4 bg-slate-50">
            <h4 className="font-semibold text-gray-700 mb-3">
              Committee Validity & Approval
            </h4>
            <FormGrid columns={3}>
              <DatePicker
                label="Effective Date"
                value={
                  membersForm.effectiveDate
                    ? new Date(membersForm.effectiveDate)
                    : undefined
                }
                onChange={v =>
                  setMembersForm(p => ({
                    ...p,
                    effectiveDate: v ? v.toISOString().split('T')[0] : '',
                  }))
                }
              />
              <DatePicker
                label="Approved On"
                value={
                  membersForm.approvedOn
                    ? new Date(membersForm.approvedOn)
                    : undefined
                }
                onChange={v =>
                  setMembersForm(p => ({
                    ...p,
                    approvedOn: v ? v.toISOString().split('T')[0] : '',
                  }))
                }
              />
              <DatePicker
                label="Approved Till"
                value={
                  membersForm.approvedTill
                    ? new Date(membersForm.approvedTill)
                    : undefined
                }
                onChange={v =>
                  setMembersForm(p => ({
                    ...p,
                    approvedTill: v ? v.toISOString().split('T')[0] : '',
                  }))
                }
              />
            </FormGrid>
            <div className="mt-3">
              <TextBox
                label="Supporting Document Name / Reference"
                placeholder="e.g. comm_order_123.pdf"
                value={membersForm.document}
                onChange={v => setMembersForm(p => ({ ...p, document: v }))}
              />
            </div>
          </div>

          {/* Add Chairman */}
          <div className="border border-indigo-200 rounded p-4 bg-indigo-50/20">
            <h4 className="font-semibold text-indigo-800 mb-2">Chairman</h4>
            <div className="flex gap-3 items-end mb-3">
              <div className="flex-1">
                <DropDownList
                  label="Select Chairman"
                  data={MEMBER_DROPDOWN_OPTIONS}
                  textField="text"
                  valueField="id"
                  value={tempChair}
                  onChange={v => setTempChair(v as string)}
                />
              </div>
              <Button
                label="Add"
                icon="plus"
                variant="outlined"
                onClick={() => {
                  if (tempChair && !membersForm.chairman.includes(tempChair)) {
                    setMembersForm(p => ({
                      ...p,
                      chairman: [...p.chairman, tempChair],
                    }));
                    setTempChair('');
                  }
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {membersForm.chairman.map(c => (
                <span
                  key={c}
                  className="bg-indigo-100 px-3 py-1 rounded-full text-xs font-semibold text-indigo-700 flex items-center gap-1"
                >
                  {c}
                  <button
                    type="button"
                    className="pi pi-times text-rose-500 font-bold"
                    onClick={() =>
                      setMembersForm(p => ({
                        ...p,
                        chairman: p.chairman.filter(x => x !== c),
                      }))
                    }
                  />
                </span>
              ))}
            </div>
          </div>

          {/* Add Institute Members */}
          <div className="border border-slate-200 rounded p-4 bg-slate-50/20">
            <h4 className="font-semibold text-slate-800 mb-2">
              Institute Members
            </h4>
            <div className="flex gap-3 items-end mb-3">
              <div className="flex-1">
                <DropDownList
                  label="Select Member"
                  data={MEMBER_DROPDOWN_OPTIONS}
                  textField="text"
                  valueField="id"
                  value={tempInst}
                  onChange={v => setTempInst(v as string)}
                />
              </div>
              <Button
                label="Add"
                icon="plus"
                variant="outlined"
                onClick={() => {
                  if (
                    tempInst &&
                    !membersForm.instituteMembers.includes(tempInst)
                  ) {
                    setMembersForm(p => ({
                      ...p,
                      instituteMembers: [...p.instituteMembers, tempInst],
                    }));
                    setTempInst('');
                  }
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {membersForm.instituteMembers.map(m => (
                <span
                  key={m}
                  className="bg-slate-100 px-3 py-1 rounded-full text-xs font-semibold text-slate-700 flex items-center gap-1"
                >
                  {m}
                  <button
                    type="button"
                    className="pi pi-times text-rose-500 font-bold"
                    onClick={() =>
                      setMembersForm(p => ({
                        ...p,
                        instituteMembers: p.instituteMembers.filter(
                          x => x !== m
                        ),
                      }))
                    }
                  />
                </span>
              ))}
            </div>
          </div>

          {/* Add Member Secretary */}
          <div className="border border-teal-200 rounded p-4 bg-teal-50/20">
            <h4 className="font-semibold text-teal-800 mb-2">
              Member Secretary
            </h4>
            <div className="flex gap-3 items-end mb-3">
              <div className="flex-1">
                <DropDownList
                  label="Select Secretary"
                  data={MEMBER_DROPDOWN_OPTIONS}
                  textField="text"
                  valueField="id"
                  value={tempMembSec}
                  onChange={v => setTempMembSec(v as string)}
                />
              </div>
              <Button
                label="Add"
                icon="plus"
                variant="outlined"
                onClick={() => {
                  if (
                    tempMembSec &&
                    !membersForm.memberSecretary.includes(tempMembSec)
                  ) {
                    setMembersForm(p => ({
                      ...p,
                      memberSecretary: [...p.memberSecretary, tempMembSec],
                    }));
                    setTempMembSec('');
                  }
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {membersForm.memberSecretary.map(m => (
                <span
                  key={m}
                  className="bg-teal-100 px-3 py-1 rounded-full text-xs font-semibold text-teal-700 flex items-center gap-1"
                >
                  {m}
                  <button
                    type="button"
                    className="pi pi-times text-rose-500 font-bold"
                    onClick={() =>
                      setMembersForm(p => ({
                        ...p,
                        memberSecretary: p.memberSecretary.filter(x => x !== m),
                      }))
                    }
                  />
                </span>
              ))}
            </div>
          </div>

          {/* Add Ex-Officio Members */}
          <div className="border border-sky-200 rounded p-4 bg-sky-50/20">
            <h4 className="font-semibold text-sky-850 mb-2">
              Ex-Officio Members
            </h4>
            <div className="flex gap-3 items-end mb-3">
              <div className="flex-1">
                <DropDownList
                  label="Select Ex-Officio Member"
                  data={MEMBER_DROPDOWN_OPTIONS}
                  textField="text"
                  valueField="id"
                  value={tempExOf}
                  onChange={v => setTempExOf(v as string)}
                />
              </div>
              <Button
                label="Add"
                icon="plus"
                variant="outlined"
                onClick={() => {
                  if (tempExOf && !membersForm.exOfficio.includes(tempExOf)) {
                    setMembersForm(p => ({
                      ...p,
                      exOfficio: [...p.exOfficio, tempExOf],
                    }));
                    setTempExOf('');
                  }
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {membersForm.exOfficio.map(m => (
                <span
                  key={m}
                  className="bg-sky-100 px-3 py-1 rounded-full text-xs font-semibold text-sky-700 flex items-center gap-1"
                >
                  {m}
                  <button
                    type="button"
                    className="pi pi-times text-rose-500 font-bold"
                    onClick={() =>
                      setMembersForm(p => ({
                        ...p,
                        exOfficio: p.exOfficio.filter(x => x !== m),
                      }))
                    }
                  />
                </span>
              ))}
            </div>
          </div>

          {/* Add SC/ST Representative */}
          <div className="border border-purple-200 rounded p-4 bg-purple-50/20">
            <h4 className="font-semibold text-purple-800 mb-2">
              SC/ST Representative
            </h4>
            <div className="flex gap-3 items-end mb-3">
              <div className="flex-1">
                <DropDownList
                  label="Select Representative"
                  data={MEMBER_DROPDOWN_OPTIONS}
                  textField="text"
                  valueField="id"
                  value={tempScSt}
                  onChange={v => setTempScSt(v as string)}
                />
              </div>
              <Button
                label="Add"
                icon="plus"
                variant="outlined"
                onClick={() => {
                  if (tempScSt && !membersForm.scStRep.includes(tempScSt)) {
                    setMembersForm(p => ({
                      ...p,
                      scStRep: [...p.scStRep, tempScSt],
                    }));
                    setTempScSt('');
                  }
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {membersForm.scStRep.map(m => (
                <span
                  key={m}
                  className="bg-purple-100 px-3 py-1 rounded-full text-xs font-semibold text-purple-700 flex items-center gap-1"
                >
                  {m}
                  <button
                    type="button"
                    className="pi pi-times text-rose-500 font-bold"
                    onClick={() =>
                      setMembersForm(p => ({
                        ...p,
                        scStRep: p.scStRep.filter(x => x !== m),
                      }))
                    }
                  />
                </span>
              ))}
            </div>
          </div>

          {/* Add Non-Institute / External Members */}
          <div className="border border-amber-200 rounded p-4 bg-amber-50/10">
            <h4 className="font-semibold text-amber-800 mb-3">
              Non-Institute / External Member Details
            </h4>
            <FormGrid columns={3}>
              <TextBox
                label="Name"
                placeholder="e.g. Smt. Anjali Bose"
                value={nonInstName}
                onChange={setNonInstName}
              />
              <TextBox
                label="Department"
                placeholder="e.g. Legal Studies"
                value={nonInstDept}
                onChange={setNonInstDept}
              />
              <TextBox
                label="Designation"
                placeholder="e.g. NGO Director / External Member"
                value={nonInstDesig}
                onChange={setNonInstDesig}
              />
              <TextBox
                label="Email"
                placeholder="email@ngo.org"
                value={nonInstEmail}
                onChange={setNonInstEmail}
              />
              <TextBox
                label="Mobile Number"
                placeholder="10-digit mobile"
                value={nonInstMobile}
                onChange={setNonInstMobile}
              />
            </FormGrid>
            <div className="mt-3 flex justify-end">
              <Button
                label="Add External Member"
                icon="plus"
                variant="outlined"
                onClick={() => {
                  if (!nonInstName || !nonInstEmail) {
                    triggerNotification(
                      'Name and Email are mandatory for external members.',
                      'error'
                    );
                    return;
                  }
                  const newExt = {
                    name: nonInstName,
                    department: nonInstDept,
                    designation: nonInstDesig,
                    email: nonInstEmail,
                    mobile: nonInstMobile,
                  };
                  setMembersForm(p => ({
                    ...p,
                    nonInstitute: [...p.nonInstitute, newExt],
                  }));
                  setNonInstName('');
                  setNonInstDept('');
                  setNonInstDesig('');
                  setNonInstEmail('');
                  setNonInstMobile('');
                }}
              />
            </div>
            <div className="mt-3 space-y-2">
              {membersForm.nonInstitute.map(ext => (
                <div
                  key={ext.email}
                  className="flex justify-between items-center bg-white p-2 rounded shadow-sm border border-slate-200 text-xs"
                >
                  <div>
                    <span className="font-bold text-gray-800">{ext.name}</span>{' '}
                    ({ext.designation} - {ext.department}) | Email: {ext.email}
                  </div>
                  <button
                    type="button"
                    className="pi pi-trash text-red-500 hover:text-red-700"
                    onClick={() =>
                      setMembersForm(p => ({
                        ...p,
                        nonInstitute: p.nonInstitute.filter(
                          x => x.email !== ext.email
                        ),
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </FormPopup>
    </FormPage>
  );
}
