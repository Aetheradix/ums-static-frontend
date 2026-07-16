import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { Checkbox, DropDownList } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import {
  type FeedbackSettings,
  feedbackSettings as initialSettings,
} from '../../data';
import { feedbackUrls } from '../../urls';

export default function Settings() {
  const [form, setForm] = useState<FeedbackSettings>(initialSettings);

  const handleSave = () => {
    ToastService.success('Feedback settings saved successfully.');
  };

  const handleReset = () => {
    setForm(initialSettings);
    ToastService.success('Settings reset to defaults.');
  };

  return (
    <FormPage
      title="Feedback Settings"
      description="Configure system-wide feedback parameters."
      breadcrumbs={[
        { label: 'Student Feedback Management', to: feedbackUrls.portal },
        { label: 'Admin Portal', to: feedbackUrls.admin.portal },
        { label: 'Settings' },
      ]}
    >
      <FormCard title="General">
        <FormGrid columns={2}>
          <DropDownList
            label="Rating Scale"
            data={[
              { name: '1 – 5', value: 5 },
              { name: '1 – 10', value: 10 },
            ]}
            textField="name"
            optionValue="value"
            value={form.ratingScale}
            onChange={v =>
              setForm(f => ({ ...f, ratingScale: (Number(v) || 5) as 5 | 10 }))
            }
          />
          <div />
          <div className="flex items-center gap-3">
            <Checkbox
              label="Enable Anonymous Feedback by Default"
              checked={form.anonymousEnabled}
              onChange={v => setForm(f => ({ ...f, anonymousEnabled: v }))}
            />
          </div>
          <div className="flex items-center gap-3">
            <Checkbox
              label="Allow Students to Save Draft"
              checked={form.draftSave}
              onChange={v => setForm(f => ({ ...f, draftSave: v }))}
            />
          </div>
          <div className="flex items-center gap-3">
            <Checkbox
              label="Auto-Submit on End Date"
              checked={form.autoSubmitOnEndDate}
              onChange={v => setForm(f => ({ ...f, autoSubmitOnEndDate: v }))}
            />
          </div>
          <div className="flex items-center gap-3">
            <Checkbox
              label="Students Can Edit Before Deadline"
              checked={form.studentCanEditBeforeDeadline}
              onChange={v =>
                setForm(f => ({ ...f, studentCanEditBeforeDeadline: v }))
              }
            />
          </div>
          <div className="flex items-center gap-3">
            <Checkbox
              label="Show Progress Bar to Students"
              checked={form.showProgressBar}
              onChange={v => setForm(f => ({ ...f, showProgressBar: v }))}
            />
          </div>
        </FormGrid>
      </FormCard>

      <FormCard title="Submission" className="mt-6">
        <FormGrid columns={2}>
          <div className="flex items-center gap-3">
            <Checkbox
              label="One Submission Only"
              checked={form.oneSubmissionOnly}
              onChange={v => setForm(f => ({ ...f, oneSubmissionOnly: v }))}
            />
          </div>
          <div className="flex items-center gap-3">
            <Checkbox
              label="Allow Resume (if draft exists)"
              checked={form.allowResume}
              onChange={v => setForm(f => ({ ...f, allowResume: v }))}
            />
          </div>
          <div className="flex items-center gap-3">
            <Checkbox
              label="Auto-Save Progress"
              checked={form.autoSave}
              onChange={v => setForm(f => ({ ...f, autoSave: v }))}
            />
          </div>
        </FormGrid>
      </FormCard>

      <div className="flex justify-end gap-3 mt-6">
        <Button
          label="Reset Defaults"
          variant="outlined"
          onClick={handleReset}
        />
        <Button label="Save Changes" variant="primary" onClick={handleSave} />
      </div>
    </FormPage>
  );
}
