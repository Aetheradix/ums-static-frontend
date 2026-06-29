import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  Checkbox,
  DropDownList,
  MultiSelectList,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import {
  type RTI,
  type RTIAssignment,
  categoryOptions,
  departmentOptions,
  rtiActivities as initialActivities,
  rtiAssignments as initialAssignments,
  rtiDocuments as initialDocuments,
  rtis as initialRtis,
  officerOptions,
  priorityOptions,
} from '../../data';
import { rtiUrls } from '../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'edit'; item: RTI }
  | { mode: 'view'; item: RTI }
  | { mode: 'forward'; item: RTI };

const EMPTY_FORM = {
  applicantName: '',
  applicantAddress: '',
  applicantMobile: '',
  applicantEmail: '',
  subject: '',
  informationRequested: '',
  category: '',
};

const EMPTY_FORWARD = {
  departments: [] as string[],
  officer: '',
  priority: 'Normal' as RTIAssignment['priority'],
  instructions: '',
  requiredBy: '',
  ccDepartments: [] as string[],
  notifyEmail: false,
  notifySms: false,
};

export default function RTIInbox() {
  const [rtis, setRtis] = useState<RTI[]>(initialRtis);
  const [assignments, setAssignments] =
    useState<RTIAssignment[]>(initialAssignments);
  const [activities, setActivities] = useState(initialActivities);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState(EMPTY_FORM);
  const [forwardForm, setForwardForm] = useState(EMPTY_FORWARD);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterDept, setFilterDept] = useState<string>('');

  const closePopup = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY_FORM);
    setForwardForm(EMPTY_FORWARD);
  }, []);

  const openView = (item: RTI) => setPopup({ mode: 'view', item });
  const openEdit = (item: RTI) => {
    setForm({
      applicantName: item.applicantName,
      applicantAddress: item.applicantAddress,
      applicantMobile: item.applicantMobile,
      applicantEmail: item.applicantEmail,
      subject: item.subject,
      informationRequested: item.informationRequested,
      category: item.category,
    });
    setPopup({ mode: 'edit', item });
  };
  const openForward = (item: RTI) => {
    setForwardForm({ ...EMPTY_FORWARD, officer: officerOptions[0] || '' });
    setPopup({ mode: 'forward', item });
  };

  const handleEditSave = () => {
    if (popup.mode !== 'edit') return;
    setRtis(prev =>
      prev.map(r => (r.id === popup.item.id ? { ...r, ...form } : r))
    );
    ToastService.success('RTI updated successfully.');
    closePopup();
  };

  const handleForward = () => {
    if (popup.mode !== 'forward') return;
    if (forwardForm.departments.length === 0) {
      ToastService.error('Select at least one department.');
      return;
    }
    const newAssignments: RTIAssignment[] = forwardForm.departments.map(
      (dept, i) => ({
        id: `A${Date.now()}_${i}`,
        rtiId: popup.item.id,
        department: dept,
        officer: forwardForm.officer,
        assignedOn: new Date().toISOString().split('T')[0],
        priority: forwardForm.priority,
        instructions: forwardForm.instructions,
        requiredBy:
          forwardForm.requiredBy ||
          new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        status: 'Pending',
        reply: '',
        replyAttachments: [],
        repliedOn: '',
      })
    );
    setAssignments(prev => [...prev, ...newAssignments]);

    const deptStr = forwardForm.departments.join(', ');
    const newActivity = {
      id: `L${Date.now()}`,
      rtiId: popup.item.id,
      action: 'Forwarded to Department',
      performedBy: 'CPIO Office',
      role: 'CPIO',
      timestamp: new Date().toISOString().split('T')[0],
      details: `Forwarded to ${deptStr}`,
    };
    setActivities(prev => [newActivity, ...prev]);

    setRtis(prev =>
      prev.map(r =>
        r.id === popup.item.id
          ? {
              ...r,
              status: 'Forwarded' as const,
              assignedDepartments: [
                ...new Set([
                  ...r.assignedDepartments,
                  ...forwardForm.departments,
                ]),
              ],
            }
          : r
      )
    );
    ToastService.success(`RTI forwarded to ${deptStr} successfully.`);
    closePopup();
  };

  const handleClose = (item: RTI) => {
    setRtis(prev =>
      prev.map(r =>
        r.id === item.id
          ? {
              ...r,
              status: 'Closed' as const,
              closedOn: new Date().toISOString().split('T')[0],
            }
          : r
      )
    );
    setActivities(prev => [
      {
        id: `L${Date.now()}`,
        rtiId: item.id,
        action: 'RTI Closed',
        performedBy: 'CPIO Office',
        role: 'CPIO',
        timestamp: new Date().toISOString().split('T')[0],
        details: 'RTI closed by CPIO',
      },
      ...prev,
    ]);
    ToastService.success('RTI closed successfully.');
  };

  const handleReminder = (item: RTI) => {
    ToastService.success(`Reminder sent for ${item.rtiNumber}.`);
  };

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      New: 'bg-blue-100 text-blue-700',
      Forwarded: 'bg-yellow-100 text-yellow-700',
      'In Progress': 'bg-orange-100 text-orange-700',
      Responded: 'bg-teal-100 text-teal-700',
      Closed: 'bg-green-100 text-green-700',
      Appealed: 'bg-purple-100 text-purple-700',
      Overdue: 'bg-red-100 text-red-700',
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  };

  const filteredRtis = rtis.filter(r => {
    if (filterStatus && r.status !== filterStatus) return false;
    if (filterCategory && r.category !== filterCategory) return false;
    if (
      filterDept &&
      !r.assignedDepartments.includes(filterDept) &&
      filterDept !== 'Unassigned'
    )
      return false;
    if (filterDept === 'Unassigned' && r.assignedDepartments.length > 0)
      return false;
    return true;
  });

  const getTimeline = (rtiId: string) =>
    activities
      .filter(a => a.rtiId === rtiId)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

  const getDocuments = (rtiId: string) =>
    initialDocuments.filter(d => d.rtiId === rtiId);

  const getAssignments = (rtiId: string) =>
    assignments.filter(a => a.rtiId === rtiId);

  return (
    <FormPage
      title="RTI Inbox"
      description="View and manage all RTI applications with search, filters, and actions."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'RTI Management', to: rtiUrls.portal },
        { label: 'Admin Portal', to: rtiUrls.admin.portal },
        { label: 'RTI Inbox' },
      ]}
    >
      <FormCard>
        <div className="flex gap-3 mb-4">
          <DropDownList
            label="Status"
            data={[
              { name: 'All', value: '' },
              { name: 'New', value: 'New' },
              { name: 'Forwarded', value: 'Forwarded' },
              { name: 'In Progress', value: 'In Progress' },
              { name: 'Responded', value: 'Responded' },
              { name: 'Closed', value: 'Closed' },
              { name: 'Appealed', value: 'Appealed' },
              { name: 'Overdue', value: 'Overdue' },
            ]}
            textField="name"
            optionValue="value"
            value={filterStatus}
            onChange={v => setFilterStatus(String(v ?? ''))}
          />
          <DropDownList
            label="Category"
            data={[
              { name: 'All', value: '' },
              ...categoryOptions.map(d => ({ name: d, value: d })),
            ]}
            textField="name"
            optionValue="value"
            value={filterCategory}
            onChange={v => setFilterCategory(String(v ?? ''))}
          />
          <DropDownList
            label="Assigned Department"
            data={[
              { name: 'All', value: '' },
              { name: 'Unassigned', value: 'Unassigned' },
              ...departmentOptions.map(d => ({ name: d, value: d })),
            ]}
            textField="name"
            optionValue="value"
            value={filterDept}
            onChange={v => setFilterDept(String(v ?? ''))}
          />
        </div>
        <GridPanel
          data={filteredRtis}
          searchBox
          searchPlaceholder="Search by RTI number, applicant, subject..."
          columns={[
            { field: 'rtiNumber', header: 'RTI #' },
            { field: 'applicantName', header: 'Applicant' },
            {
              field: 'subject',
              header: 'Subject',
              cell: (item: RTI) => (
                <span className="text-sm">
                  {item.subject.length > 40
                    ? `${item.subject.slice(0, 40)}...`
                    : item.subject}
                </span>
              ),
            },
            { field: 'category', header: 'Category' },
            {
              header: 'Status',
              cell: (item: RTI) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Priority',
              cell: (item: RTI) => (
                <span
                  className={`text-xs font-medium ${item.priority === 'Urgent' ? 'text-red-600' : item.priority === 'High' ? 'text-orange-600' : 'text-gray-600'}`}
                >
                  {item.priority}
                </span>
              ),
            },
            {
              header: 'Due',
              cell: (item: RTI) => (
                <span
                  className={`text-xs font-medium ${item.remainingDays < 0 ? 'text-red-600' : item.remainingDays <= 3 ? 'text-orange-600' : 'text-gray-600'}`}
                >
                  {item.dueDate} (
                  {item.remainingDays < 0
                    ? `${Math.abs(item.remainingDays)}d overdue`
                    : `${item.remainingDays}d left`}
                  )
                </span>
              ),
            },
            {
              header: 'Actions',
              width: '280px',
              cell: (item: RTI) => (
                <div className="flex gap-1">
                  <Button
                    icon="eye"
                    label="View"
                    variant="outlined"
                    size="small"
                    onClick={() => openView(item)}
                  />
                  {(item.status === 'New' ||
                    item.status === 'Forwarded' ||
                    item.status === 'In Progress') && (
                    <>
                      <Button
                        icon="pencil"
                        label="Edit"
                        variant="outlined"
                        size="small"
                        onClick={() => openEdit(item)}
                      />
                      <Button
                        icon="forward"
                        label="Forward"
                        variant="outlined"
                        size="small"
                        onClick={() => openForward(item)}
                      />
                    </>
                  )}
                  {item.status !== 'Closed' && item.status !== 'Overdue' && (
                    <Button
                      icon="check_circle"
                      label="Close"
                      variant="outlined"
                      size="small"
                      onClick={() => handleClose(item)}
                    />
                  )}
                  {(item.status === 'Forwarded' ||
                    item.status === 'In Progress') && (
                    <Button
                      icon="notifications"
                      label="Remind"
                      variant="outlined"
                      size="small"
                      onClick={() => handleReminder(item)}
                    />
                  )}
                </div>
              ),
            },
          ]}
        />
      </FormCard>

      {popup.mode === 'view' && (
        <FormPopup
          visible
          onHide={closePopup}
          title={`RTI: ${popup.item.rtiNumber}`}
          subtitle={popup.item.subject}
          size="xl"
        >
          <div className="flex flex-col gap-4 max-h-96 overflow-y-auto">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Applicant Details
              </h4>
              <FormGrid columns={2}>
                <div>
                  <label className="form-field-label">Name</label>
                  <p className="text-sm font-medium mt-1">
                    {popup.item.applicantName}
                  </p>
                </div>
                <div>
                  <label className="form-field-label">Mobile</label>
                  <p className="text-sm font-medium mt-1">
                    {popup.item.applicantMobile}
                  </p>
                </div>
                <div>
                  <label className="form-field-label">Email</label>
                  <p className="text-sm font-medium mt-1">
                    {popup.item.applicantEmail}
                  </p>
                </div>
                <div>
                  <label className="form-field-label">Citizen Type</label>
                  <p className="text-sm font-medium mt-1">
                    {popup.item.citizenType}
                  </p>
                </div>
              </FormGrid>
            </div>
            <div className="border-t border-gray-100 pt-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                RTI Details
              </h4>
              <FormGrid columns={2}>
                <div>
                  <label className="form-field-label">Category</label>
                  <p className="text-sm font-medium mt-1">
                    {popup.item.category}
                  </p>
                </div>
                <div>
                  <label className="form-field-label">Mode</label>
                  <p className="text-sm font-medium mt-1">{popup.item.mode}</p>
                </div>
                <div>
                  <label className="form-field-label">Date Received</label>
                  <p className="text-sm font-medium mt-1">
                    {popup.item.dateReceived}
                  </p>
                </div>
                <div>
                  <label className="form-field-label">Due Date</label>
                  <p className="text-sm font-medium mt-1">
                    {popup.item.dueDate} ({popup.item.remainingDays}d left)
                  </p>
                </div>
                <div>
                  <label className="form-field-label">Deadline Type</label>
                  <p className="text-sm font-medium mt-1">
                    {popup.item.deadlineType}
                  </p>
                </div>
                <div>
                  <label className="form-field-label">Status</label>
                  <p className="mt-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(popup.item.status)}`}
                    >
                      {popup.item.status}
                    </span>
                  </p>
                </div>
              </FormGrid>
            </div>
            <div className="border-t border-gray-100 pt-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Information Requested
              </h4>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                {popup.item.informationRequested}
              </p>
            </div>
            {popup.item.finalReply && (
              <div className="border-t border-gray-100 pt-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Final Reply
                </h4>
                <p className="text-sm text-gray-700 bg-green-50 p-3 rounded-lg">
                  {popup.item.finalReply}
                </p>
              </div>
            )}
            <div className="border-t border-gray-100 pt-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Assigned Departments
              </h4>
              {getAssignments(popup.item.id).length > 0 ? (
                <div className="space-y-2">
                  {getAssignments(popup.item.id).map(a => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <span className="text-sm font-medium">
                          {a.department}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({a.officer})
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          a.status === 'Replied'
                            ? 'bg-green-50 text-green-700'
                            : a.status === 'Overdue'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-yellow-50 text-yellow-700'
                        }`}
                      >
                        {a.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  Not yet assigned to any department.
                </p>
              )}
            </div>
            <div className="border-t border-gray-100 pt-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Documents
              </h4>
              {getDocuments(popup.item.id).length > 0 ? (
                <div className="space-y-1">
                  {getDocuments(popup.item.id).map(d => (
                    <div key={d.id} className="flex items-center gap-2 text-sm">
                      <span className="material-symbols-outlined text-base text-gray-400">
                        description
                      </span>
                      <span className="font-medium">{d.fileName}</span>
                      <span className="text-xs text-gray-400">({d.type})</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  No documents uploaded.
                </p>
              )}
            </div>
            <div className="border-t border-gray-100 pt-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Timeline
              </h4>
              <div className="relative">
                {getTimeline(popup.item.id).length > 0 ? (
                  <div className="space-y-3">
                    {getTimeline(popup.item.id).map((act, idx) => (
                      <div key={act.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-2.5 h-2.5 rounded-full mt-1.5 ${
                              act.action.includes('Closed') ||
                              act.action.includes('Reply')
                                ? 'bg-green-500'
                                : act.action.includes('Forwarded')
                                  ? 'bg-blue-500'
                                  : act.action.includes('Appeal')
                                    ? 'bg-purple-500'
                                    : 'bg-gray-400'
                            }`}
                          />
                          {idx < getTimeline(popup.item.id).length - 1 && (
                            <div className="w-0.5 flex-1 bg-gray-200 mt-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-800">
                              {act.action}
                            </span>
                            <span className="text-xs text-gray-400">
                              {act.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {act.details}
                          </p>
                          <p className="text-xs text-gray-400">
                            {act.performedBy} ({act.role})
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    No activity recorded.
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Close" variant="outlined" onClick={closePopup} />
          </div>
        </FormPopup>
      )}

      {popup.mode === 'edit' && (
        <FormPopup
          visible
          onHide={closePopup}
          title={`Edit RTI: ${popup.item.rtiNumber}`}
          subtitle="Update applicant and RTI details."
          size="lg"
        >
          <FormGrid columns={2}>
            <TextBox
              label="Applicant Name"
              value={form.applicantName}
              onChange={v => setForm(f => ({ ...f, applicantName: v }))}
              required
            />
            <TextBox
              label="Mobile"
              value={form.applicantMobile}
              onChange={v => setForm(f => ({ ...f, applicantMobile: v }))}
            />
            <TextBox
              label="Address"
              value={form.applicantAddress}
              onChange={v => setForm(f => ({ ...f, applicantAddress: v }))}
            />
            <TextBox
              label="Email"
              value={form.applicantEmail}
              onChange={v => setForm(f => ({ ...f, applicantEmail: v }))}
            />
            <TextBox
              label="Subject"
              value={form.subject}
              onChange={v => setForm(f => ({ ...f, subject: v }))}
              required
            />
            <DropDownList
              label="Category"
              data={[
                'Admission',
                'Examination',
                'Finance',
                'Hostel',
                'Library',
                'Academic',
                'HR',
                'General Administration',
              ].map(c => ({ name: c, value: c }))}
              textField="name"
              optionValue="value"
              value={form.category}
              onChange={v =>
                setForm(f => ({ ...f, category: String(v ?? '') }))
              }
            />
            <div className="col-span-2">
              <TextArea
                label="Information Requested"
                value={form.informationRequested}
                onChange={v =>
                  setForm(f => ({ ...f, informationRequested: v }))
                }
                rows={4}
                required
              />
            </div>
          </FormGrid>
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={closePopup} />
            <Button
              label="Save Changes"
              variant="primary"
              onClick={handleEditSave}
            />
          </div>
        </FormPopup>
      )}

      {popup.mode === 'forward' && (
        <FormPopup
          visible
          onHide={closePopup}
          title={`Forward RTI: ${popup.item.rtiNumber}`}
          subtitle="Assign to departments and set instructions."
          size="lg"
        >
          <FormGrid columns={2}>
            <div className="col-span-2">
              <MultiSelectList
                label="Departments"
                data={departmentOptions.map(d => ({ name: d, value: d }))}
                textField="name"
                value={departmentOptions
                  .filter(d => forwardForm.departments.includes(d))
                  .map(d => ({ name: d, value: d }))}
                onChange={v =>
                  setForwardForm(f => ({
                    ...f,
                    departments: v.map(x => x.value),
                  }))
                }
                placeholder="Select departments..."
              />
            </div>
            <DropDownList
              label="Nodal Officer"
              data={officerOptions.map(o => ({ name: o, value: o }))}
              textField="name"
              optionValue="value"
              value={forwardForm.officer}
              onChange={v =>
                setForwardForm(f => ({ ...f, officer: String(v ?? '') }))
              }
            />
            <DropDownList
              label="Priority"
              data={priorityOptions.map(p => ({ name: p, value: p }))}
              textField="name"
              optionValue="value"
              value={forwardForm.priority}
              onChange={v =>
                setForwardForm(f => ({
                  ...f,
                  priority: (v as RTIAssignment['priority']) || 'Normal',
                }))
              }
            />
            <TextBox
              label="Required By"
              type="date"
              value={forwardForm.requiredBy}
              onChange={v => setForwardForm(f => ({ ...f, requiredBy: v }))}
            />
            <div className="col-span-2">
              <TextArea
                label="Instructions"
                placeholder="Provide specific instructions for the assigned departments..."
                value={forwardForm.instructions}
                onChange={v => setForwardForm(f => ({ ...f, instructions: v }))}
                rows={3}
              />
            </div>
            <div className="col-span-2">
              <MultiSelectList
                label="CC Departments"
                data={departmentOptions.map(d => ({ name: d, value: d }))}
                textField="name"
                value={departmentOptions
                  .filter(d => forwardForm.ccDepartments.includes(d))
                  .map(d => ({ name: d, value: d }))}
                onChange={v =>
                  setForwardForm(f => ({
                    ...f,
                    ccDepartments: v.map(x => x.value),
                  }))
                }
                placeholder="CC (optional)..."
              />
            </div>
            <div className="flex items-center gap-4">
              <Checkbox
                label="Notify by Email"
                checked={forwardForm.notifyEmail}
                onChange={v => setForwardForm(f => ({ ...f, notifyEmail: v }))}
              />
              <Checkbox
                label="Notify by SMS"
                checked={forwardForm.notifySms}
                onChange={v => setForwardForm(f => ({ ...f, notifySms: v }))}
              />
            </div>
          </FormGrid>
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={closePopup} />
            <Button label="Forward" variant="primary" onClick={handleForward} />
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
