import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareerAdvancement } from '../context';
import '../career.css';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { TextBox, TextArea } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';

export default function AparEmployee() {
  const navigate = useNavigate();
  const { aparApplications, setAPARApplications, triggerNotification } =
    useCareerAdvancement();

  // Load Dr. Ramesh Kumar's APAR application (EMP001)
  const app =
    aparApplications.find(
      (a: CareerAdvancement.CASAPARApplication) => a.employeeId === 'EMP001'
    ) || aparApplications[0];

  // Employee self-assessment states
  const [description, setDescription] = useState(
    app?.workOutputDescription ||
      'Delivered lectures for Computer Science courses, conducted lab exams, and mentored Ph.D. students.'
  );
  const [workScore, setWorkScore] = useState(app?.workOutputScore || 8);
  const [workRemarks, setWorkRemarks] = useState(
    app?.workOutputRemarks ||
      'Completed all assigned teaching schedules and published 2 papers.'
  );

  // Personal Attributes
  const [leadership, setLeadership] = useState(
    app?.personalAttributes?.leadershipQuality || '8'
  );
  const [communication, setCommunication] = useState(
    app?.personalAttributes?.communicationSkills || '9'
  );
  const [integrity, setIntegrity] = useState(
    app?.personalAttributes?.integrity || '9'
  );
  const [adaptability, setAdaptability] = useState(
    app?.personalAttributes?.adaptability || '8'
  );
  const [teamWork, setTeamWork] = useState(
    app?.personalAttributes?.teamWork || '9'
  );

  // Functional Competency
  const [domain, setDomain] = useState(
    app?.functionalCompetency?.domainKnowledge || '9'
  );
  const [problemSolving, setProblemSolving] = useState(
    app?.functionalCompetency?.problemSolvingAbility || '8'
  );
  const [decision, setDecision] = useState(
    app?.functionalCompetency?.decisionMaking || '8'
  );
  const [analytical, setAnalytical] = useState(
    app?.functionalCompetency?.analyticalSkills || '9'
  );
  const [functionalRemarks, setFunctionalRemarks] = useState(
    app?.functionalCompetencyRemarks ||
      'Coordinated departmental examinations and updated curriculum syllabus.'
  );

  const [additionalRemarks, setAdditionalRemarks] = useState(
    app?.additionalRemarks || ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setAPARApplications((prev: CareerAdvancement.CASAPARApplication[]) =>
      prev.map((a: CareerAdvancement.CASAPARApplication) => {
        if (a.id === app.id) {
          return {
            ...a,
            status: 'Forwarded',
            currentHandler: 'Reporting Officer',
            workOutputDescription: description,
            workOutputScore: Number(workScore),
            workOutputRemarks: workRemarks,
            personalAttributes: {
              leadershipQuality: leadership,
              communicationSkills: communication,
              integrity: integrity,
              adaptability: adaptability,
              teamWork: teamWork,
            },
            functionalCompetency: {
              domainKnowledge: domain,
              problemSolvingAbility: problemSolving,
              decisionMaking: decision,
              analyticalSkills: analytical,
            },
            functionalCompetencyRemarks: functionalRemarks,
            additionalRemarks: additionalRemarks,
            submittedOn: new Date().toLocaleDateString('en-GB', {
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
      'Self Assessment submitted. Forwarded to Reporting Officer.',
      'success'
    );
    navigate('/career-advancement/dashboard');
  };

  return (
    <FormPage
      title="APAR Self-Assessment Form"
      description="Fill in your self-appraisal details for the current academic session"
      breadcrumbs={[
        { label: 'Career Advancement', to: '/career-advancement/dashboard' },
        { label: 'Self Assessment' },
      ]}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormCard title="1. Assessment of Work Output" icon="description">
          <FormGrid columns={1}>
            <TextArea
              label="Brief description of duties and academic tasks accomplished *"
              placeholder="Detail your course instruction, exam coordination, student guidance, etc."
              value={description}
              onChange={v => setDescription(v)}
            />
            <FormGrid columns={2}>
              <TextBox
                label="Self Evaluation Score (out of 10) *"
                value={String(workScore)}
                onChange={v => setWorkScore(Number(v))}
              />
              <TextBox
                label="Self Assessment Remarks"
                placeholder="Brief justification of self-evaluation"
                value={workRemarks}
                onChange={v => setWorkRemarks(v)}
              />
            </FormGrid>
          </FormGrid>
        </FormCard>

        <FormCard title="2. Personal Attributes (Out of 10)" icon="person">
          <FormGrid columns={2}>
            <TextBox
              label="Leadership Quality *"
              value={leadership}
              onChange={v => setLeadership(v)}
            />
            <TextBox
              label="Communication Skills *"
              value={communication}
              onChange={v => setCommunication(v)}
            />
            <TextBox
              label="Integrity *"
              value={integrity}
              onChange={v => setIntegrity(v)}
            />
            <TextBox
              label="Adaptability *"
              value={adaptability}
              onChange={v => setAdaptability(v)}
            />
            <TextBox
              label="Team Work *"
              value={teamWork}
              onChange={v => setTeamWork(v)}
            />
          </FormGrid>
        </FormCard>

        <FormCard title="3. Functional Competency (Out of 10)" icon="cog">
          <FormGrid columns={2}>
            <TextBox
              label="Domain Knowledge *"
              value={domain}
              onChange={v => setDomain(v)}
            />
            <TextBox
              label="Problem Solving Ability *"
              value={problemSolving}
              onChange={v => setProblemSolving(v)}
            />
            <TextBox
              label="Decision Making *"
              value={decision}
              onChange={v => setDecision(v)}
            />
            <TextBox
              label="Analytical Skills *"
              value={analytical}
              onChange={v => setAnalytical(v)}
            />
            <div className="col-span-2">
              <TextArea
                label="Functional Competency Remarks"
                placeholder="Additional notes about your functional competencies..."
                value={functionalRemarks}
                onChange={v => setFunctionalRemarks(v)}
              />
            </div>
          </FormGrid>
        </FormCard>

        <FormCard title="4. Final Remarks & Verification" icon="check-square">
          <FormGrid columns={1}>
            <TextArea
              label="Additional Remarks"
              placeholder="Any other achievements, concerns or notes..."
              value={additionalRemarks}
              onChange={v => setAdditionalRemarks(v)}
            />
          </FormGrid>
          <div className="form-actions-row mt-6">
            <Button
              label="Submit Assessment"
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
        </FormCard>
      </form>
    </FormPage>
  );
}
