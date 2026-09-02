import { useMemo, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, FileUpload, TextArea } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatCard,
  StatusBadge,
} from 'shared/new-components';
import {
  MEALS,
  MOCK_STUDENT_ID,
  MOCK_STUDENT_NAME,
  MOCK_WARDEN_HOSTEL_ID,
  today,
  uid,
  useHms,
  useHmsRole,
} from '../context/HmsContext';
import type { MessFeedback as Feedback } from '../context/HmsContext';
import { hmsBreadcrumbs } from '../utils/breadcrumbs';

const QUALITY = ['Excellent', 'Good', 'Average', 'Poor'] as const;
const RATING: Record<string, number> = {
  Excellent: 5,
  Good: 4,
  Average: 3,
  Poor: 2,
};
const STATUS_VARIANT = {
  New: 'pending',
  Reviewed: 'info',
  Actioned: 'success',
} as const;

export default function MessFeedback() {
  const { data, add, update } = useHms();
  const { isStudent, activePortal } = useHmsRole();

  const [form, setForm] = useState({
    meal: MEALS[1] as string,
    quality: 'Good' as Feedback['quality'],
    comments: '',
    photo: '',
  });
  const [viewingPhoto, setViewingPhoto] = useState<Feedback | null>(null);
  const [responding, setResponding] = useState<Feedback | null>(null);
  const [response, setResponse] = useState('');

  const rows = useMemo(
    () =>
      isStudent
        ? data.messFeedback.filter(f => f.studentId === MOCK_STUDENT_ID)
        : data.messFeedback.filter(f => f.hostelId === MOCK_WARDEN_HOSTEL_ID),
    [data.messFeedback, isStudent]
  );

  const average = rows.length
    ? `${(rows.reduce((s, f) => s + f.rating, 0) / rows.length).toFixed(1)} / 5`
    : '—';

  const submit = () => {
    add('messFeedback', {
      id: uid('MF'),
      studentId: MOCK_STUDENT_ID,
      studentName: MOCK_STUDENT_NAME,
      hostelId: MOCK_WARDEN_HOSTEL_ID,
      feedbackDate: today(),
      meal: form.meal,
      rating: RATING[form.quality] ?? 3,
      quality: form.quality,
      comments: form.comments,
      photo: form.photo,
      wardenResponse: '',
      status: 'New',
    });
    setForm({ ...form, comments: '', photo: '' });
    ToastService.success('Thank you — your feedback has reached the warden.');
  };

  const saveResponse = () => {
    if (!responding) return;
    update('messFeedback', responding.id, {
      ...responding,
      wardenResponse: response,
      status: 'Actioned',
    });
    ToastService.success('Action recorded against this feedback.');
    setResponding(null);
    setResponse('');
  };

  return (
    <FormPage
      title={isStudent ? 'Mess Feedback' : 'Mess Feedback Review'}
      description={
        isStudent
          ? 'Rate the food served in the mess. The warden reads every entry and records the action taken.'
          : 'Food-quality feedback from your residents, with the action taken against each.'
      }
      breadcrumbs={hmsBreadcrumbs(activePortal, 'Mess Feedback')}
    >
      <FormGrid columns={3}>
        <StatCard
          title="Feedback Entries"
          value={rows.length}
          icon="forum"
          colorScheme="blue"
        />
        <StatCard
          title="Average Rating"
          value={average}
          icon="star"
          colorScheme="amber"
        />
        <StatCard
          title="Awaiting Review"
          value={rows.filter(f => f.status === 'New').length}
          icon="inbox"
          colorScheme="orange"
        />
      </FormGrid>

      {isStudent && (
        <FormCard title="Submit Food Feedback" icon="comment">
          <FormGrid columns={3}>
            <DropDownList
              label="Meal"
              data={MEALS.map(m => ({ id: m, text: m }))}
              textField="text"
              valueField="id"
              value={form.meal}
              onChange={v =>
                setForm({ ...form, meal: (v as string) ?? MEALS[1] })
              }
            />
            <DropDownList
              label="Food Quality"
              data={QUALITY.map(q => ({ id: q, text: q }))}
              textField="text"
              valueField="id"
              value={form.quality}
              onChange={v =>
                setForm({
                  ...form,
                  quality: (v as Feedback['quality']) ?? 'Good',
                })
              }
            />
            <div />
            <div className="md:col-span-2">
              <TextArea
                label="Your Comments"
                rows={3}
                placeholder="e.g. Dal was watery and the chapatis were cold"
                value={form.comments}
                onChange={v => setForm({ ...form, comments: v })}
              />
            </div>
            <FileUpload
              label="Photo of the Meal"
              mode="photo"
              accept="image/*"
              uploadNote="JPG or PNG, up to 2 MB — the warden sees this"
              maxSizeKB={2048}
              previewWidth={120}
              previewHeight={90}
              value={form.photo}
              onChange={f => setForm({ ...form, photo: f ? f.name : '' })}
            />
          </FormGrid>
          <div className="mt-4 flex gap-3">
            <Button
              label="Submit Feedback"
              variant="primary"
              icon="send"
              onClick={submit}
            />
            <Button
              label="Clear"
              variant="outlined"
              onClick={() => setForm({ ...form, comments: '', photo: '' })}
            />
          </div>
        </FormCard>
      )}

      <FormCard title={isStudent ? 'My Feedback' : 'All Feedback'} icon="list">
        <GridPanel<Feedback>
          data={rows}
          searchBox
          searchPlaceholder="Search by student or comment..."
          searchFields={['studentName', 'comments']}
          pagination
          emptyMessage="No mess feedback recorded yet."
          columns={[
            ...(isStudent
              ? []
              : [{ field: 'studentName' as const, header: 'Student' }]),
            { field: 'feedbackDate', header: 'Date', width: 120 },
            { field: 'meal', header: 'Meal', width: 110 },
            {
              field: 'quality',
              header: 'Quality',
              width: 120,
              cell: f => (
                <StatusBadge
                  label={f.quality}
                  variant={
                    f.quality === 'Poor'
                      ? 'danger'
                      : f.quality === 'Average'
                        ? 'warning'
                        : 'success'
                  }
                />
              ),
            },
            {
              field: 'rating',
              header: 'Rating',
              width: 90,
              cell: f => <>{f.rating} / 5</>,
            },
            { field: 'comments', header: 'Comments' },
            {
              field: 'photo',
              header: 'Photo',
              width: 110,
              sortable: false,
              cell: f =>
                f.photo ? (
                  <button
                    type="button"
                    onClick={() => setViewingPhoto(f)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50 dark:border-slate-700 dark:text-blue-300 dark:hover:bg-blue-950/40"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      image
                    </span>
                    View
                  </button>
                ) : (
                  <span className="text-xs text-slate-400">—</span>
                ),
            },
            {
              field: 'wardenResponse',
              header: 'Action Taken',
              cell: f => (
                <>
                  {f.wardenResponse || (
                    <span className="text-slate-400">—</span>
                  )}
                </>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              width: 120,
              cell: f => (
                <StatusBadge
                  label={f.status}
                  variant={STATUS_VARIANT[f.status]}
                />
              ),
            },
            ...(isStudent
              ? []
              : [
                  {
                    header: 'Action',
                    sortable: false,
                    cell: (f: Feedback) => (
                      <Button
                        label="Record Action"
                        icon="pencil"
                        variant="primary"
                        size="small"
                        onClick={() => {
                          setResponding(f);
                          setResponse(f.wardenResponse);
                        }}
                      />
                    ),
                  },
                ]),
          ]}
        />
      </FormCard>

      <FormPopup
        visible={Boolean(responding)}
        onHide={() => setResponding(null)}
        title="Record Action Taken"
        subtitle={
          responding
            ? `${responding.studentName} · ${responding.meal} on ${responding.feedbackDate}`
            : ''
        }
        footer={
          <div className="flex justify-end gap-3">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setResponding(null)}
            />
            <Button label="Save" variant="primary" onClick={saveResponse} />
          </div>
        }
      >
        {responding && (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
              {responding.comments}
            </div>
            <TextArea
              label="Action Taken"
              rows={4}
              placeholder="e.g. Raised with the mess contractor; supervisor briefed"
              value={response}
              onChange={setResponse}
            />
          </div>
        )}
      </FormPopup>
      <FormPopup
        visible={Boolean(viewingPhoto)}
        onHide={() => setViewingPhoto(null)}
        title="Meal Photo"
        subtitle={
          viewingPhoto
            ? `${viewingPhoto.studentName} · ${viewingPhoto.meal} on ${viewingPhoto.feedbackDate}`
            : ''
        }
        footer={
          <div className="flex justify-end">
            <Button
              label="Close"
              variant="primary"
              onClick={() => setViewingPhoto(null)}
            />
          </div>
        }
      >
        {viewingPhoto && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 dark:border-slate-600 dark:bg-slate-800/60">
              <span className="material-symbols-outlined text-[44px] text-slate-400 dark:text-slate-500">
                image
              </span>
              <p className="font-mono text-sm font-semibold text-slate-700 dark:text-slate-200">
                {viewingPhoto.photo}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Uploaded with the feedback — the file is held by the ERP.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200">
              {viewingPhoto.comments}
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
