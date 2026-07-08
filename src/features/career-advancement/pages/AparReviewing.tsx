import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareerAdvancement } from '../context';
import '../career.css';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { TextBox, TextArea, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';

import { RATING_OPTIONS } from '../data';

export default function AparReviewing() {
  const navigate = useNavigate();
  const { aparApplications, setAPARApplications, triggerNotification } =
    useCareerAdvancement();

  // Find Ramesh's APAR application (EMP001)
  const app =
    aparApplications.find(
      (a: CareerAdvancement.CASAPARApplication) => a.employeeId === 'EMP001'
    ) || aparApplications[0];

  // Reviewing Officer states
  const [agree, setAgree] = useState<any>(app?.reviewingOfficerAgree || 'Yes');
  const [workScore, setWorkScore] = useState(
    app?.reviewingOfficerWorkScore || 8
  );
  const [personalScore, setPersonalScore] = useState(
    app?.reviewingOfficerPersonalScore || 9
  );
  const [functionalScore, setFunctionalScore] = useState(
    app?.reviewingOfficerFunctionalScore || 8
  );
  const [finalGrade, setFinalGrade] = useState(
    app?.reviewingOfficerFinalGrade || 'Very Good'
  );
  const [remarks, setRemarks] = useState(app?.reviewingOfficerRemarks || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setAPARApplications((prev: CareerAdvancement.CASAPARApplication[]) =>
      prev.map((a: CareerAdvancement.CASAPARApplication) => {
        if (a.id === app.id) {
          return {
            ...a,
            status: 'Completed',
            currentHandler: 'Completed',
            reviewingOfficerAgree: agree,
            reviewingOfficerWorkScore:
              agree === 'Yes' ? a.reportingOfficerWorkScore : Number(workScore),
            reviewingOfficerPersonalScore:
              agree === 'Yes'
                ? a.reportingOfficerPersonalScore
                : Number(personalScore),
            reviewingOfficerFunctionalScore:
              agree === 'Yes'
                ? a.reportingOfficerFunctionalScore
                : Number(functionalScore),
            reviewingOfficerFinalGrade: finalGrade,
            reviewingOfficerRemarks: remarks,
            lastUpdated: new Date().toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }),
          };
        }
        return a;
      })
    );

    triggerNotification(
      'Reviewing Officer assessment submitted. APAR application process completed successfully.',
      'success'
    );
    navigate('/career-advancement/dashboard');
  };

  const ratingData = RATING_OPTIONS.map(r => ({ id: r, text: r }));

  return (
    <FormPage
      title="APAR â€” Reviewing Officer Appraisal"
      description="Perform final review and registration of the employee's APAR application"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Career Advancement', to: '/career-advancement/dashboard' },
        { label: 'Reviewing Appraisal' },
      ]}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormCard
            title="Employee Self-Assessment Summary"
            icon="eye"
            className="bg-slate-50 border border-slate-200"
          >
            <div className="text-sm space-y-2">
              <p>
                <strong>Employee:</strong> {app?.employeeName}
              </p>
              <p>
                <strong>Designation:</strong> {app?.designation} (
                {app?.department})
              </p>
              <p>
                <strong>Work description:</strong> "
                {app?.workOutputDescription || 'â€”'}"
              </p>
              <p>
                <strong>Claimed score:</strong> {app?.workOutputScore || 'â€”'}
                /10
              </p>
            </div>
          </FormCard>

          <FormCard
            title="Reporting Officer Assessment Summary"
            icon="eye"
            className="bg-slate-50 border border-slate-200"
          >
            <div className="text-sm space-y-2">
              <p>
                <strong>Assigned Grade:</strong>{' '}
                <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  {app?.reportingOfficerGrade || 'Very Good'}
                </span>
              </p>
              <p>
                <strong>Work Score:</strong>{' '}
                {app?.reportingOfficerWorkScore || '8'} / 10
              </p>
              <p>
                <strong>Personal Attributes Score:</strong>{' '}
                {app?.reportingOfficerPersonalScore || '9'} / 10
              </p>
              <p>
                <strong>Functional Competency Score:</strong>{' '}
                {app?.reportingOfficerFunctionalScore || '8'} / 10
              </p>
              <p className="italic text-slate-600 mt-2">
                "
                {app?.reportingOfficerPenPicture || 'No pen picture submitted.'}
                "
              </p>
            </div>
          </FormCard>
        </div>

        <FormCard title="Reviewing Officer Appraisal Form" icon="pencil">
          <form onSubmit={handleSubmit}>
            <FormGrid columns={2}>
              <DropDownList
                label="Do you agree with the Reporting Officer appraisal? *"
                data={[
                  { id: 'Yes', text: 'Yes' },
                  { id: 'No', text: 'No' },
                ]}
                textField="text"
                valueField="id"
                value={agree}
                onChange={v => setAgree(v as any)}
              />

              <DropDownList
                label="Final Grade Assigned *"
                data={ratingData}
                textField="text"
                valueField="id"
                value={finalGrade}
                onChange={v => setFinalGrade(v as string)}
              />

              {agree === 'No' && (
                <>
                  <TextBox
                    label="Adjusted Work Output Score (out of 10) *"
                    value={String(workScore)}
                    onChange={v => setWorkScore(Number(v))}
                  />
                  <TextBox
                    label="Adjusted Personal Attributes Score (out of 10) *"
                    value={String(personalScore)}
                    onChange={v => setPersonalScore(Number(v))}
                  />
                  <TextBox
                    label="Adjusted Functional Competency Score (out of 10) *"
                    value={String(functionalScore)}
                    onChange={v => setFunctionalScore(Number(v))}
                  />
                  <div className="col-span-2">
                    <p className="text-xs font-semibold text-rose-500 mb-2">
                      * Specify below the reasons for disagreement with the
                      Reporting Officer.
                    </p>
                  </div>
                </>
              )}

              <div className="col-span-2">
                <TextArea
                  label="Reviewing Remarks / Reasons for Disagreement *"
                  placeholder="Enter your final review observations, remarks, or justification notes..."
                  value={remarks}
                  onChange={v => setRemarks(v)}
                />
              </div>
            </FormGrid>

            <div className="form-actions-row mt-6">
              <Button
                label="Finalize & Complete APAR"
                icon="check"
                variant="success"
                type="submit"
              />
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => navigate('/career-advancement/dashboard')}
              />
            </div>
          </form>
        </FormCard>
      </div>
    </FormPage>
  );
}
