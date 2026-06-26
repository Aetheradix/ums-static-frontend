import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { Checkbox, DropDownList, TextBox } from 'shared/components/forms';
import MultiSelectList from 'shared/components/forms/MultiSelectList';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import {
  type FeedbackSession,
  feedbackSessions as initialData,
  feedbackTemplates,
  academicYearOptions,
  semesterOptions,
  departmentOptions,
  programmeOptions,
} from '../../data';
import { feedbackUrls } from '../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: FeedbackSession }
  | { mode: 'view'; item: FeedbackSession };

const EMPTY_FORM = {
  sessionName: '',
  academicYear: '',
  semesters: [] as string[],
  departments: [] as string[],
  programmes: [] as string[],
  startDate: '',
  endDate: '',
  isAnonymous: false,
  templateId: '',
  targetCount: 0,
};

const statusStyles: Record<string, string> = {
  Draft: 'bg-gray-100 text-gray-700',
  Scheduled: 'bg-blue-100 text-blue-700',
  Published: 'bg-green-100 text-green-700',
  Open: 'bg-purple-100 text-purple-700',
  Closed: 'bg-orange-100 text-orange-700',
  Archived: 'bg-red-100 text-red-700',
};

const templateOptions = feedbackTemplates
  .filter(t => t.status !== 'Archived')
  .map(t => ({ name: t.name, value: t.id }));
const yearOpts = academicYearOptions.map(y => ({ name: y, value: y }));
const semOpts = semesterOptions.map(s => ({ name: `Sem ${s}`, value: s }));
const deptOpts = departmentOptions.map(d => ({ name: d, value: d }));
const progOpts = programmeOptions.map(p => ({ name: p, value: p }));

export default function FeedbackSessions() {
  const [data, setData] = useState<FeedbackSession[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState(EMPTY_FORM);

  const closePopup = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY_FORM);
  }, []);

  const openCreate = () => {
    setForm({ ...EMPTY_FORM, templateId: templateOptions[0]?.value ?? '' });
    setPopup({ mode: 'create' });
  };
  const openEdit = (item: FeedbackSession) => {
    setForm({
      sessionName: item.sessionName,
      academicYear: item.academicYear,
      semesters: [...item.semesters],
      departments: [...item.departments],
      programmes: [...item.programmes],
      startDate: item.startDate,
      endDate: item.endDate,
      isAnonymous: item.isAnonymous,
      templateId: item.templateId,
      targetCount: item.targetCount,
    });
    setPopup({ mode: 'edit', item });
  };
  const openView = (item: FeedbackSession) => setPopup({ mode: 'view', item });

  const handleSave = () => {
    if (popup.mode === 'create') {
      const newItem: FeedbackSession = {
        id: String(Date.now()),
        ...form,
        status: 'Draft',
        responseCount: 0,
      };
      setData(prev => [...prev, newItem]);
      ToastService.success('Session created successfully.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(s => (s.id === popup.item.id ? { ...s, ...form } : s))
      );
      ToastService.success('Session updated successfully.');
    }
    closePopup();
  };

  const updateStatus = (
    item: FeedbackSession,
    status: FeedbackSession['status'],
    msg: string
  ) => {
    setData(prev => prev.map(s => (s.id === item.id ? { ...s, status } : s)));
    ToastService.success(msg);
  };

  return (
    <FormPage
      title="Feedback Sessions"
      description="Manage feedback collection sessions."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Student Feedback Management', to: feedbackUrls.portal },
        { label: 'Admin Portal', to: feedbackUrls.admin.portal },
        { label: 'Sessions' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search sessions..."
          toolbar={
            <Button
              label="Create Session"
              icon="plus"
              variant="primary"
              onClick={openCreate}
            />
          }
          columns={[
            { field: 'sessionName', header: 'Session Name' },
            { field: 'academicYear', header: 'Academic Year' },
            {
              header: 'Semesters',
              cell: (item: FeedbackSession) => (
                <span className="flex flex-wrap gap-1">
                  {item.semesters.map(s => (
                    <span
                      key={s}
                      className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded"
                    >
                      {s}
                    </span>
                  ))}
                </span>
              ),
            },
            {
              header: 'Departments',
              cell: (item: FeedbackSession) => (
                <span className="text-sm">{item.departments.join(', ')}</span>
              ),
            },
            {
              header: 'Programmes',
              cell: (item: FeedbackSession) => (
                <span className="text-sm">{item.programmes.join(', ')}</span>
              ),
            },
            { field: 'startDate', header: 'Start Date' },
            { field: 'endDate', header: 'End Date' },
            {
              header: 'Status',
              cell: (item: FeedbackSession) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[item.status]}`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Anonymous',
              cell: (item: FeedbackSession) => (
                <span
                  className={`text-xs font-medium ${item.isAnonymous ? 'text-green-600' : 'text-gray-400'}`}
                >
                  {item.isAnonymous ? 'Yes' : 'No'}
                </span>
              ),
            },
            { field: 'responseCount', header: 'Responses' },
            {
              header: 'Actions',
              width: '280px',
              cell: (item: FeedbackSession) => (
                <div className="flex gap-1">
                  <Button
                    icon="eye"
                    label="View"
                    variant="outlined"
                    size="small"
                    onClick={() => openView(item)}
                  />
                  {(item.status === 'Draft' ||
                    item.status === 'Scheduled' ||
                    item.status === 'Published') && (
                    <Button
                      icon="pencil"
                      label="Edit"
                      variant="outlined"
                      size="small"
                      onClick={() => openEdit(item)}
                    />
                  )}
                  {item.status === 'Draft' && (
                    <Button
                      icon="send"
                      label="Schedule"
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        updateStatus(item, 'Scheduled', 'Session scheduled.')
                      }
                    />
                  )}
                  {(item.status === 'Scheduled' || item.status === 'Draft') && (
                    <Button
                      icon="check-circle"
                      label="Publish"
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        updateStatus(
                          item,
                          'Published',
                          'Session published successfully.'
                        )
                      }
                    />
                  )}
                  {item.status !== 'Closed' && item.status !== 'Archived' && (
                    <Button
                      icon="lock"
                      label="Close"
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        updateStatus(item, 'Closed', 'Session closed.')
                      }
                    />
                  )}
                  {item.status !== 'Archived' && (
                    <Button
                      icon="archive"
                      label="Archive"
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        updateStatus(item, 'Archived', 'Session archived.')
                      }
                    />
                  )}
                </div>
              ),
            },
          ]}
        />
      </FormCard>

      {(popup.mode === 'create' || popup.mode === 'edit') && (
        <FormPopup
          visible
          onHide={closePopup}
          title={popup.mode === 'create' ? 'Create Session' : 'Edit Session'}
          subtitle="Fill in the session details."
          size="lg"
        >
          <FormGrid columns={2}>
            <TextBox
              label="Session Name"
              placeholder="e.g. Faculty Feedback 2024-25"
              value={form.sessionName}
              onChange={v => setForm(f => ({ ...f, sessionName: v }))}
              required
            />
            <DropDownList
              label="Academic Year"
              data={yearOpts}
              textField="name"
              optionValue="value"
              value={form.academicYear}
              onChange={v =>
                setForm(f => ({ ...f, academicYear: String(v ?? '') }))
              }
              required
            />
            <MultiSelectList
              label="Semesters"
              data={semOpts}
              textField="name"
              value={semOpts.filter(o => form.semesters.includes(o.value))}
              onChange={v =>
                setForm(f => ({ ...f, semesters: v.map(x => x.value) }))
              }
              placeholder="Select semesters..."
            />
            <MultiSelectList
              label="Departments"
              data={deptOpts}
              textField="name"
              value={deptOpts.filter(o => form.departments.includes(o.value))}
              onChange={v =>
                setForm(f => ({ ...f, departments: v.map(x => x.value) }))
              }
              placeholder="Select departments..."
            />
            <MultiSelectList
              label="Programmes"
              data={progOpts}
              textField="name"
              value={progOpts.filter(o => form.programmes.includes(o.value))}
              onChange={v =>
                setForm(f => ({ ...f, programmes: v.map(x => x.value) }))
              }
              placeholder="Select programmes..."
            />
            <DropDownList
              label="Template"
              data={templateOptions}
              textField="name"
              optionValue="value"
              value={form.templateId}
              onChange={v =>
                setForm(f => ({ ...f, templateId: String(v ?? '') }))
              }
              required
            />
            <TextBox
              label="Start Date"
              type="date"
              value={form.startDate}
              onChange={v => setForm(f => ({ ...f, startDate: v }))}
              required
            />
            <TextBox
              label="End Date"
              type="date"
              value={form.endDate}
              onChange={v => setForm(f => ({ ...f, endDate: v }))}
              required
            />
            <TextBox
              label="Target Participants"
              type="number"
              value={String(form.targetCount)}
              onChange={v =>
                setForm(f => ({ ...f, targetCount: Number(v) || 0 }))
              }
            />
            <div className="flex items-center gap-3">
              <Checkbox
                label="Anonymous Feedback"
                checked={form.isAnonymous}
                onChange={v => setForm(f => ({ ...f, isAnonymous: v }))}
              />
            </div>
          </FormGrid>
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={closePopup} />
            <Button label="Save" variant="primary" onClick={handleSave} />
          </div>
        </FormPopup>
      )}

      {popup.mode === 'view' && (
        <FormPopup
          visible
          onHide={closePopup}
          title={popup.item.sessionName}
          subtitle="Session details."
          size="lg"
        >
          <FormGrid columns={2}>
            <div>
              <label className="form-field-label">Academic Year</label>
              <p className="text-sm font-medium mt-1">
                {popup.item.academicYear}
              </p>
            </div>
            <div>
              <label className="form-field-label">Semesters</label>
              <p className="text-sm font-medium mt-1">
                {popup.item.semesters.join(', ')}
              </p>
            </div>
            <div>
              <label className="form-field-label">Departments</label>
              <p className="text-sm font-medium mt-1">
                {popup.item.departments.join(', ')}
              </p>
            </div>
            <div>
              <label className="form-field-label">Programmes</label>
              <p className="text-sm font-medium mt-1">
                {popup.item.programmes.join(', ')}
              </p>
            </div>
            <div>
              <label className="form-field-label">Start Date</label>
              <p className="text-sm font-medium mt-1">{popup.item.startDate}</p>
            </div>
            <div>
              <label className="form-field-label">End Date</label>
              <p className="text-sm font-medium mt-1">{popup.item.endDate}</p>
            </div>
            <div>
              <label className="form-field-label">Status</label>
              <p className="text-sm font-medium mt-1">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[popup.item.status]}`}
                >
                  {popup.item.status}
                </span>
              </p>
            </div>
            <div>
              <label className="form-field-label">Anonymous</label>
              <p className="text-sm font-medium mt-1">
                {popup.item.isAnonymous ? 'Yes' : 'No'}
              </p>
            </div>
            <div>
              <label className="form-field-label">Responses</label>
              <p className="text-sm font-medium mt-1">
                {popup.item.responseCount} / {popup.item.targetCount}
              </p>
            </div>
            <div>
              <label className="form-field-label">Template</label>
              <p className="text-sm font-medium mt-1">
                {feedbackTemplates.find(t => t.id === popup.item.templateId)
                  ?.name ?? '—'}
              </p>
            </div>
          </FormGrid>
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Close" variant="outlined" onClick={closePopup} />
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
