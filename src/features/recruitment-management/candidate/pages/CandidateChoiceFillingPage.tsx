import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { PickList } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { MY_CANDIDATE } from '../../mock/data';

// ─── Types ────────────────────────────────────────────────────────────────────
interface SchoolChoice {
  id: string;
  udise: string;
  division: string;
  district: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_SCHOOLS: SchoolChoice[] = [
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

export default function CandidateChoiceFillingPage() {
  const c = MY_CANDIDATE;
  const [source, setSource] = useState<SchoolChoice[]>(MOCK_SCHOOLS);
  const [target, setTarget] = useState<SchoolChoice[]>([]);
  const [isLocked, setIsLocked] = useState(false);

  // ─── PickList Template ───
  const itemTemplate = (item: SchoolChoice) => {
    return (
      <div className="flex flex-col gap-1 p-1">
        <div className="text-[13px] font-semibold text-slate-200 flex items-center justify-between">
          <span>{item.udise}</span>
          <span className="text-[11px] font-normal text-slate-400 bg-slate-400/10 px-2 py-0.5 rounded">
            {item.division}
          </span>
        </div>
        <div className="text-[11px] text-slate-400 flex items-center gap-1">
          <span className="material-symbols-rounded text-[14px]">
            location_on
          </span>
          {item.district}
        </div>
      </div>
    );
  };

  const handleSaveDraft = () => {
    ToastService.success('Choice filling draft saved successfully.');
  };

  const handleLock = () => {
    if (target.length === 0) {
      ToastService.error('Please select at least one school before locking.');
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
        description="Fill your school/college preferences by drag and drop."
        breadcrumbs={[
          { label: 'Recruitment Management', to: '/recruitment-management' },
          {
            label: 'Candidate Portal',
            to: '/recruitment-management/candidate',
          },
          { label: 'Choice Filling' },
        ]}
      >
        <div className="flex flex-col items-center justify-center py-12 text-center gap-4 bg-slate-400/5 border border-slate-400/15 rounded-2xl p-8">
          <span className="material-symbols-rounded text-emerald-500 text-[72px] drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]">
            lock
          </span>
          <h2 className="text-2xl font-bold text-emerald-500">
            Choices Locked Successfully
          </h2>
          <p className="text-slate-400 text-sm max-w-md">
            You have successfully locked {target.length} preferences. Your
            priority list has been submitted and no further changes can be made.
          </p>

          <div className="mt-6 w-full max-w-2xl text-left border border-slate-400/10 rounded-xl overflow-hidden">
            <div className="bg-slate-400/10 px-4 py-3 border-b border-slate-400/10">
              <h3 className="text-sm font-semibold text-slate-200">
                Your Final Priority List
              </h3>
            </div>
            <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-400/10">
              {target.map((item, index) => (
                <div
                  key={item.id}
                  className="p-3 flex items-center gap-4 bg-slate-400/5 hover:bg-slate-400/10 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-violet-500/20 text-violet-400 font-bold text-[13px] flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold text-slate-200">
                      UDISE: {item.udise}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-rounded text-[13px]">
                        location_on
                      </span>
                      {item.district} ({item.division} Division)
                    </div>
                  </div>
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
      description="Select and rank your preferred schools/colleges from the available list."
      breadcrumbs={[
        { label: 'Recruitment Management', to: '/recruitment-management' },
        { label: 'Candidate Portal', to: '/recruitment-management/candidate' },
        { label: 'Choice Filling' },
      ]}
    >
      <FormCard title="Applicant Details" icon="person">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-400/5 rounded-xl border border-slate-400/15 p-4">
          <div>
            <p className="text-[11px] text-slate-500 mb-0.5">
              Application Number
            </p>
            <p className="text-[13px] font-semibold text-slate-200">
              {c.applicationNo}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500 mb-0.5">Candidate Name</p>
            <p className="text-[13px] font-semibold text-slate-200">
              {c.name.toUpperCase()}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500 mb-0.5">Merit Rank</p>
            <p className="text-[13px] font-semibold text-violet-400">
              #{c.merit}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500 mb-0.5">Post</p>
            <p className="text-[13px] font-semibold text-slate-200">{c.post}</p>
          </div>
        </div>
      </FormCard>

      <FormCard
        title="Preference Selection"
        icon="checklist"
        headerAction={
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-semibold text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
              Selected: {target.length}
            </span>
          </div>
        }
      >
        <p className="text-[12px] text-slate-400 mb-4 leading-relaxed">
          Move your preferred schools from the{' '}
          <strong className="text-slate-300">Available Schools</strong> list to
          the <strong className="text-slate-300">Selected Preferences</strong>{' '}
          list. The order in the selected list determines your priority (top
          item is Priority #1). Use the arrows to reorder your selections.
        </p>

        <PickList
          source={source}
          target={target}
          itemTemplate={itemTemplate}
          sourceHeader="Available Schools"
          targetHeader="Selected Preferences (Priority Order)"
          dataKey="id"
          onChange={(e: any) => {
            setSource(e.source);
            setTarget(e.target);
          }}
        />

        <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-400/10">
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
