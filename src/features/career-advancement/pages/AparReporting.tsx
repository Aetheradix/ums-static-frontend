import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareerAdvancement } from '../context';
import '../career.css';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { TextBox, TextArea, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';

import { RATING_OPTIONS } from '../data';

export default function AparReporting() {
  const navigate = useNavigate();
  const { aparApplications, setAPARApplications, triggerNotification } =
    useCareerAdvancement();

  // Find Ramesh's APAR application (EMP001)
  const app =
    aparApplications.find(
      (a: CareerAdvancement.CASAPARApplication) => a.employeeId === 'EMP001'
    ) || aparApplications[0];

  // Reporting Officer states
  const [workScore, setWorkScore] = useState(
    app?.reportingOfficerWorkScore || 8
  );
  const [personalScore, setPersonalScore] = useState(
    app?.reportingOfficerPersonalScore || 9
  );
  const [functionalScore, setFunctionalScore] = useState(
    app?.reportingOfficerFunctionalScore || 8
  );
  const [grade, setGrade] = useState(app?.reportingOfficerGrade || 'Very Good');
  const [penPicture, setPenPicture] = useState(
    app?.reportingOfficerPenPicture ||
      'Dr. Ramesh Kumar is a dedicated faculty member. He demonstrates exceptional commitment to learning and research.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setAPARApplications((prev: CareerAdvancement.CASAPARApplication[]) =>
      prev.map((a: CareerAdvancement.CASAPARApplication) => {
        if (a.id === app.id) {
          return {
            ...a,
            status: 'Under Review',
            currentHandler: 'Reviewing Officer',
            reportingOfficerWorkScore: Number(workScore),
            reportingOfficerPersonalScore: Number(personalScore),
            reportingOfficerFunctionalScore: Number(functionalScore),
            reportingOfficerGrade: grade,
            reportingOfficerPenPicture: penPicture,
          };
        }
        return a;
      })
    );

    triggerNotification(
      'Reporting Officer assessment submitted. Forwarded to Reviewing Officer.',
      'success'
    );
    navigate('/career-advancement/dashboard');
  };

  const ratingData = RATING_OPTIONS.map(r => ({ id: r, text: r }));

  return (
    <FormPage
      title="APAR â€” Reporting Officer Appraisal"
      description="Review employee self-assessment and register your reporting appraisal scores"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Career Advancement', to: '/career-advancement/dashboard' },
        { label: 'Reporting Appraisal' },
      ]}
    >
      <div className="space-y-6">
        <FormCard
          title={`Employee Self-Assessment Summary - ${app?.employeeName}`}
          icon="eye"
          className="bg-slate-50 border border-slate-200"
        >
          <div className="text-sm space-y-4">
            <div>
              <span className="font-bold text-slate-500 uppercase tracking-wider text-xs block mb-1">
                Duties Description
              </span>
              <p className="bg-white p-3 rounded-lg border border-slate-100 italic text-slate-700 font-medium">
                "{app?.workOutputDescription || 'â€”'}"
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded-lg border border-slate-100 text-center">
                <span className="text-xs font-bold text-slate-400 uppercase">
                  Work Output Score
                </span>
                <p className="text-xl font-extrabold text-indigo-600 mt-1">
                  {app?.workOutputScore || 'â€”'} / 10
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-100 text-center">
                <span className="text-xs font-bold text-slate-400 uppercase">
                  Personal Attributes Avg
                </span>
                <p className="text-xl font-extrabold text-indigo-600 mt-1">
                  8.6 / 10
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-100 text-center">
                <span className="text-xs font-bold text-slate-400 uppercase">
                  Functional Competency Avg
                </span>
                <p className="text-xl font-extrabold text-indigo-600 mt-1">
                  8.5 / 10
                </p>
              </div>
            </div>
          </div>
        </FormCard>

        <FormCard title="Reporting Officer Evaluation Form" icon="pencil">
          <form onSubmit={handleSubmit}>
            <FormGrid columns={2}>
              <TextBox
                label="Verified Work Output Score (out of 10) *"
                value={String(workScore)}
                onChange={v => setWorkScore(Number(v))}
              />
              <TextBox
                label="Verified Personal Attributes Score (out of 10) *"
                value={String(personalScore)}
                onChange={v => setPersonalScore(Number(v))}
              />
              <TextBox
                label="Verified Functional Competency Score (out of 10) *"
                value={String(functionalScore)}
                onChange={v => setFunctionalScore(Number(v))}
              />
              <DropDownList
                label="Overall Grade Assigned *"
                data={ratingData}
                textField="text"
                valueField="id"
                value={grade}
                onChange={v => setGrade(v as string)}
              />
              <div className="col-span-2">
                <TextArea
                  label="Pen Picture (Brief narrative assessment of the employee's work and traits) *"
                  placeholder="Detail strengths, achievements, areas of improvement..."
                  value={penPicture}
                  onChange={v => setPenPicture(v)}
                />
              </div>
            </FormGrid>

            <div className="form-actions-row mt-6">
              <Button
                label="Submit Appraisal"
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
