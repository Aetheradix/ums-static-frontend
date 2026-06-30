import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { PickList } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { MY_CANDIDATE } from '../../../mock/data';

interface CollegeChoice {
  id: string;
  udise: string;
  division: string;
  district: string;
}

const MOCK_COLLEGES: CollegeChoice[] = [
  { id: 'S1', udise: '23310510911', division: 'Bhopal', district: 'Vidisha' },
  { id: 'S2', udise: '23310124311', division: 'Bhopal', district: 'Vidisha' },
  { id: 'S3', udise: '23330213804', division: 'Bhopal', district: 'Sehore' },
  { id: 'S4', udise: '23340111304', division: 'Bhopal', district: 'Raisen' },
  { id: 'S5', udise: '23340103049', division: 'Bhopal', district: 'Raisen' },
  { id: 'S6', udise: '23330100119', division: 'Bhopal', district: 'Sehore' },
  { id: 'S7', udise: '23300331901', division: 'Bhopal', district: 'Rajgarh' },
  { id: 'S8', udise: '23340222856', division: 'Bhopal', district: 'Raisen' },
  { id: 'S9', udise: '23310625063', division: 'Bhopal', district: 'Vidisha' },
  { id: 'S10', udise: '23330100120', division: 'Bhopal', district: 'Sehore' },
  { id: 'S11', udise: '23300331902', division: 'Bhopal', district: 'Rajgarh' },
  { id: 'S12', udise: '23340222857', division: 'Bhopal', district: 'Raisen' },
];

const toPickItem = (s: CollegeChoice) => ({
  id: s.id,
  label: `${s.udise} — ${s.district} (${s.division})`,
});

export default function CandidateChoiceFillingPage() {
  const c = MY_CANDIDATE;
  const [source, setSource] = useState(MOCK_COLLEGES.map(toPickItem));
  const [target, setTarget] = useState<ReturnType<typeof toPickItem>[]>([]);
  const [isLocked, setIsLocked] = useState(false);

  const handleSaveDraft = () => {
    ToastService.success('Choice filling draft saved successfully.');
  };

  const handleLock = () => {
    if (target.length === 0) {
      ToastService.error('Please select at least one college before locking.');
      return;
    }
    setIsLocked(true);
    ToastService.success(
      'Choices locked successfully. No further changes can be made.'
    );
  };

  if (isLocked) {
    return (
      <FormPage
        title="Candidate Choice Filling"
        breadcrumbs={[
          { label: 'Recruitment Management', to: '/recruitment-management' },
          {
            label: 'Candidate Portal',
            to: '/recruitment-management/candidate',
          },
          { label: 'Choice Filling' },
        ]}
      >
        <div className="flex flex-col items-center justify-center py-12 text-center gap-4 rounded-xl border p-8">
          <span className="material-symbols-rounded text-emerald-500 text-[72px]">
            lock
          </span>
          <h2 className="text-2xl font-bold text-emerald-500">
            Choices Locked Successfully
          </h2>
          <p className="text-sm max-w-md">
            You have successfully locked {target.length} preferences. Your
            priority list has been submitted and no further changes can be made.
          </p>

          <div className="mt-6 w-full max-w-2xl text-left border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b font-semibold text-sm">
              Your Final Priority List
            </div>
            <div className="max-h-[300px] overflow-y-auto divide-y">
              {target.map((item, index) => (
                <div key={item.id} className="p-3 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-violet-500/20 font-bold text-[13px] flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="text-sm">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FormPage>
    );
  }

  return (
    <FormPage
      title="Candidate Choice Filling"
      description="Select and rank your preferred colleges from the available list."
      breadcrumbs={[
        { label: 'Recruitment Management', to: '/recruitment-management' },
        { label: 'Candidate Portal', to: '/recruitment-management/candidate' },
        { label: 'Choice Filling' },
      ]}
    >
      <FormCard title="Applicant Details" icon="person">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-xl border p-4">
          <div>
            <p className="text-xs mb-0.5">Application Number</p>
            <p className="text-sm font-semibold">{c.applicationNo}</p>
          </div>
          <div>
            <p className="text-xs mb-0.5">Candidate Name</p>
            <p className="text-sm font-semibold">{c.name.toUpperCase()}</p>
          </div>
          <div>
            <p className="text-xs mb-0.5">Merit Rank</p>
            <p className="text-sm font-semibold">#{c.merit}</p>
          </div>
          <div>
            <p className="text-xs mb-0.5">Post</p>
            <p className="text-sm font-semibold">{c.post}</p>
          </div>
        </div>
      </FormCard>

      <FormCard
        title="Preference Selection"
        icon="checklist"
        headerAction={
          <span className="text-xs font-semibold px-3 py-1 rounded-full border">
            Selected: {target.length}
          </span>
        }
      >
        <p className="text-sm mb-4 leading-relaxed">
          Move your preferred colleges from the{' '}
          <strong>Available Colleges</strong> list to the{' '}
          <strong>Selected Preferences</strong> list. The order in the selected
          list determines your priority.
        </p>

        <PickList
          source={source}
          target={target}
          sourceHeader="Available Colleges"
          targetHeader="Selected Preferences (Priority Order)"
          dataKey="id"
          onChange={e => {
            setSource(e.source);
            setTarget(e.target);
          }}
        />

        <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t">
          <Button
            label="Save as Draft"
            icon="save"
            type="button"
            variant="outlined"
            onClick={handleSaveDraft}
          />
          <Button
            label="Lock Choices"
            icon="lock"
            type="button"
            variant="primary"
            onClick={handleLock}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
