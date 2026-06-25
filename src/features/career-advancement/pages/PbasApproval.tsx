import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareerAdvancement } from '../context';
import { FormCard, FormGrid, FormPage, GridPanel } from 'shared/new-components';
import { TextBox, TextArea, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';

export default function PbasApproval() {
  const navigate = useNavigate();
  const {
    pbasApplications,
    setPBASApplications,
    triggerNotification,
  } = useCareerAdvancement();

  // Find targeted application
  const app = useMemo(() => {
    return pbasApplications[0] || null;
  }, [pbasApplications]);

  // Determine stage info based on active role
  const stageInfo = useMemo(() => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('pbas-hod')) {
      return { title: 'HOD Approval Page', nextLabel: 'Dean', fieldPrefix: 'hod' };
    } else if (path.includes('pbas-dean')) {
      return { title: 'Dean Approval Page', nextLabel: 'IQAC', fieldPrefix: 'dean' };
    } else if (path.includes('pbas-iqac')) {
      return { title: 'IQAC Verification', nextLabel: 'Dean Academics', fieldPrefix: 'iqac' };
    } else {
      return { title: 'PBAS Approval Desk', nextLabel: 'Admin', fieldPrefix: 'hod' };
    }
  }, []);

  // Form states
  const [remarks, setRemarks] = useState('');
  const [verifiedScore, setVerifiedScore] = useState(app?.totalAPIScore || 165);
  const [decision, setDecision] = useState(`Approve & Forward to ${stageInfo.nextLabel}`);
  const [resubmitReason, setResubmitReason] = useState('');

  const handleDecisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!remarks) {
      triggerNotification('Remarks are required to submit decision.', 'error');
      return;
    }

    const isApprove = decision.includes('Approve');
    const nextStatus = isApprove ? 'Forwarded' : 'Resubmission Required';
    const nextHandler = isApprove ? stageInfo.nextLabel : 'Employee';

    setPBASApplications((prev: CareerAdvancement.CASPBASApplication[]) =>
      prev.map((p: CareerAdvancement.CASPBASApplication) => {
        if (app && p.id === app.id) {
          const updated = {
            ...p,
            status: nextStatus as any,
            currentHandler: nextHandler,
            totalAPIScore: Number(verifiedScore),
          };

          if (stageInfo.fieldPrefix === 'hod') {
            updated.hodRemarks = remarks;
            updated.hodVerifiedScore = Number(verifiedScore);
            updated.hodDecision = decision;
          } else if (stageInfo.fieldPrefix === 'dean') {
            updated.deanRemarks = remarks;
            updated.deanVerifiedScore = Number(verifiedScore);
            updated.deanDecision = decision;
          } else if (stageInfo.fieldPrefix === 'iqac') {
            updated.iqacRemarks = remarks;
            updated.iqacVerifiedScore = Number(verifiedScore);
            updated.iqacDecision = decision;
          }

          return updated;
        }
        return p;
      })
    );

    triggerNotification(
      isApprove
        ? `Application approved and forwarded to ${stageInfo.nextLabel}.`
        : 'Resubmission request sent to the employee.',
      'success'
    );

    // Dynamic routing to simulate handoff flow
    if (isApprove) {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('pbas-hod')) {
        navigate('/career-advancement/dashboard');
      } else if (path.includes('pbas-dean')) {
        navigate('/career-advancement/dashboard');
      } else {
        navigate('/career-advancement/pbas-dean-academics');
      }
    } else {
      navigate('/career-advancement/dashboard');
    }
  };

  const decisionOptions = [
    { id: `Approve & Forward to ${stageInfo.nextLabel}`, text: `Approve & Forward to ${stageInfo.nextLabel}` },
    { id: 'Request Resubmission', text: 'Request Resubmission (Send back to Employee)' },
  ];

  return (
    <FormPage
      title={stageInfo.title}
      description="Review and process forwarded PBAS/CAS promotion applications"
      breadcrumbs={[
        { label: 'Career Advancement', to: '/career-advancement/dashboard' },
        { label: 'PBAS Approval Desk' },
      ]}
    >

      <div className="space-y-6">
        <FormCard title="Applications Pending Your Review" icon="list">
          <GridPanel
            data={app ? [app] : []}
            columns={[
              { field: 'employeeName', header: 'Employee Name' },
              { field: 'stage', header: 'Stage' },
              { field: 'submittedOn', header: 'Submitted Date' },
              {
                field: 'totalAPIScore',
                header: 'Claimed API Score',
                cell: (item: any) => (
                  <span className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 font-extrabold text-xs">
                    {item.totalAPIScore}
                  </span>
                ),
              },
              {
                header: 'Actions',
                sortable: false,
                cell: (item: any) => (
                  <div className="flex gap-2">
                    <Button
                      label="View App Detail"
                      icon="eye"
                      variant="outlined"
                      onClick={() => triggerNotification(`Opening details for ${item.employeeName}`, 'info')}
                    />
                    <Button
                      label="Track"
                      icon="map-marker"
                      variant="outlined"
                      onClick={() => triggerNotification('Application tracking opened.', 'info')}
                    />
                  </div>
                ),
              },
            ]}
          />
        </FormCard>

        {app && (
          <FormCard title={`Process Application: ${app.employeeName}`} icon="cog">
            <form onSubmit={handleDecisionSubmit}>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-6 text-sm text-slate-700">
                <div>
                  <span className="font-bold text-slate-400 block uppercase text-[10px]">Applied Promotion Stage:</span>
                  <span className="font-extrabold mt-0.5 block">{app.stage}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-400 block uppercase text-[10px]">Claimed API Score:</span>
                  <span className="font-extrabold mt-0.5 block text-indigo-600">{app.totalAPIScore}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-400 block uppercase text-[10px]">Department:</span>
                  <span className="font-extrabold mt-0.5 block">{app.department}</span>
                </div>
              </div>

              <FormGrid columns={2}>
                <div className="col-span-2">
                  <TextArea
                    label={`${stageInfo.title.split(' ')[0]} Level Remarks *`}
                    placeholder={`Enter ${stageInfo.title.split(' ')[0]} level remarks, appraisal observations and verification notes...`}
                    value={remarks}
                    onChange={v => setRemarks(v)}
                  />
                </div>
                <TextBox
                  label="Verified API Score (if adjusting)"
                  placeholder="Enter score value to override claimed score"
                  value={String(verifiedScore)}
                  onChange={v => setVerifiedScore(Number(v))}
                />
                <DropDownList
                  label="Decision *"
                  data={decisionOptions}
                  textField="text"
                  valueField="id"
                  value={decision}
                  onChange={v => setDecision(v as string)}
                />
                {decision === 'Request Resubmission' && (
                  <div className="col-span-2">
                    <TextArea
                      label="Reason for Resubmission *"
                      placeholder="Specify corrections needed from employee..."
                      value={resubmitReason}
                      onChange={v => setResubmitReason(v)}
                    />
                  </div>
                )}
              </FormGrid>

              <div className="form-actions-row mt-6">
                <Button
                  label="Submit Decision"
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
        )}
      </div>
    </FormPage>
  );
}
