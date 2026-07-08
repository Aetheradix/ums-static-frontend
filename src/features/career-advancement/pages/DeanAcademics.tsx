import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareerAdvancement } from '../context';
import '../career.css';
import { FormCard, FormGrid, FormPage, GridPanel } from 'shared/new-components';
import { TextBox, TextArea } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';

export default function DeanAcademics() {
  const navigate = useNavigate();
  const { pbasApplications, setPBASApplications, triggerNotification } =
    useCareerAdvancement();

  // Find Ramesh's PBAS application or fallback
  const app = useMemo(() => {
    return pbasApplications[0] || null;
  }, [pbasApplications]);

  // Screening state flags
  const [screened, setScreened] = useState(app?.screeningComplete ?? false);

  // Scores state
  const [finalT, setFinalT] = useState(String(app?.finalTeachingScore || '80'));
  const [finalR, setFinalR] = useState(String(app?.finalResearchScore || '55'));
  const [finalO, setFinalO] = useState(String(app?.finalOthersScore || '42'));

  // Remarks state
  const [remarks, setRemarks] = useState(
    app?.screeningCommitteeRemarks ||
      'Approved for advancement. The candidate satisfies all api criteria guidelines.'
  );
  const [vcNominee, setVcNominee] = useState(
    app?.vcNominee || 'Prof. Amitabh Bachan'
  );
  const [sme, setSme] = useState(
    app?.subjectMatterExpert || 'Dr. Satish Sharma, IIT Delhi'
  );

  const totalFinalScore = useMemo(() => {
    return Number(finalT || 0) + Number(finalR || 0) + Number(finalO || 0);
  }, [finalT, finalR, finalO]);

  const handleFinishScreening = () => {
    if (!remarks) {
      triggerNotification(
        'Committee remarks are required to submit screening.',
        'error'
      );
      return;
    }

    setScreened(true);

    // Save screening values in context
    setPBASApplications((prev: CareerAdvancement.CASPBASApplication[]) =>
      prev.map((p: CareerAdvancement.CASPBASApplication) => {
        if (app && p.id === app.id) {
          return {
            ...p,
            screeningComplete: true,
            finalTeachingScore: Number(finalT),
            finalResearchScore: Number(finalR),
            finalOthersScore: Number(finalO),
            finalTotalScore: totalFinalScore,
            screeningCommitteeRemarks: remarks,
            vcNominee: vcNominee,
            subjectMatterExpert: sme,
            totalAPIScore: totalFinalScore,
          };
        }
        return p;
      })
    );

    triggerNotification('Screening finalized and scores locked.', 'success');
  };

  const handleFinishReview = () => {
    setPBASApplications((prev: CareerAdvancement.CASPBASApplication[]) =>
      prev.map((p: CareerAdvancement.CASPBASApplication) => {
        if (app && p.id === app.id) {
          return {
            ...p,
            status: 'Approved',
            currentHandler: 'Dean Academics',
          };
        }
        return p;
      })
    );

    triggerNotification(
      'Review process finished. Application fully approved and finalized.',
      'success'
    );
    navigate('/career-advancement/dashboard');
  };

  return (
    <FormPage
      title="Dean Academics â€” Screening & Review"
      description="Final screening stage: assign scores, verify IQAC, finish review, and generate print layout"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Career Advancement', to: '/career-advancement/dashboard' },
        { label: 'Dean Academics Review' },
      ]}
    >
      <div className="space-y-6">
        <FormCard title="Applications Forwarded by IQAC" icon="list">
          <GridPanel
            data={app ? [app] : []}
            columns={[
              { field: 'employeeName', header: 'Employee Name' },
              { field: 'stage', header: 'Stage' },
              {
                field: 'totalAPIScore',
                header: 'Claimed API',
                cell: (item: any) => <span>{item.totalAPIScore || '190'}</span>,
              },
              {
                header: 'IQAC Verified API',
                cell: () => (
                  <span className="text-cyan-600 font-bold">177</span>
                ),
              },
              {
                header: 'Actions',
                sortable: false,
                cell: () => (
                  <div className="flex gap-2">
                    <Button
                      label="View"
                      icon="eye"
                      variant="outlined"
                      onClick={() =>
                        triggerNotification(
                          'Viewing application details.',
                          'info'
                        )
                      }
                    />
                    <Button
                      label="Print"
                      icon="print"
                      variant="outlined"
                      onClick={() =>
                        triggerNotification(
                          'Sending print layout to printer...',
                          'info'
                        )
                      }
                    />
                  </div>
                ),
              },
            ]}
          />
        </FormCard>

        {app && (
          <FormCard
            title={`Screening Committee Form â€” ${app.employeeName}`}
            icon="cog"
          >
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse text-sm text-slate-700">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-3 text-left font-bold text-slate-600">
                      Assessment Category
                    </th>
                    <th className="p-3 text-left font-bold text-slate-600">
                      Claimed Score
                    </th>
                    <th className="p-3 text-left font-bold text-slate-600">
                      IQAC Verified Score
                    </th>
                    <th className="p-3 text-left font-bold text-slate-600">
                      Final Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="p-3 font-semibold">
                      Teaching, Learning & Evaluation
                    </td>
                    <td className="p-3 text-slate-500">85</td>
                    <td className="p-3 text-cyan-600 font-semibold">80</td>
                    <td className="p-3">
                      <input
                        type="number"
                        disabled={screened}
                        value={finalT}
                        onChange={e => setFinalT(e.target.value)}
                        className="w-28 p-1.5 border border-slate-200 rounded text-slate-800 disabled:bg-slate-100 font-bold"
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3 font-semibold">
                      Research & Academic Contributions
                    </td>
                    <td className="p-3 text-slate-500">60</td>
                    <td className="p-3 text-cyan-600 font-semibold">55</td>
                    <td className="p-3">
                      <input
                        type="number"
                        disabled={screened}
                        value={finalR}
                        onChange={e => setFinalR(e.target.value)}
                        className="w-28 p-1.5 border border-slate-200 rounded text-slate-800 disabled:bg-slate-100 font-bold"
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3 font-semibold">
                      Other Extension Activities
                    </td>
                    <td className="p-3 text-slate-500">45</td>
                    <td className="p-3 text-cyan-600 font-semibold">42</td>
                    <td className="p-3">
                      <input
                        type="number"
                        disabled={screened}
                        value={finalO}
                        onChange={e => setFinalO(e.target.value)}
                        className="w-28 p-1.5 border border-slate-200 rounded text-slate-800 disabled:bg-slate-100 font-bold"
                      />
                    </td>
                  </tr>
                  <tr className="bg-slate-50 font-bold border-b border-slate-200">
                    <td className="p-3">Total API Score</td>
                    <td className="p-3 text-slate-500">190</td>
                    <td className="p-3 text-cyan-600">177</td>
                    <td className="p-3 text-indigo-600 text-base font-black">
                      {totalFinalScore || 'â€”'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <FormGrid columns={2} className="mb-6">
              <div className="col-span-2">
                <TextArea
                  label="Screening Committee Remarks *"
                  placeholder="Enter committee observations..."
                  value={remarks}
                  onChange={v => setRemarks(v)}
                  readOnly={screened}
                />
              </div>
              <TextBox
                label="VC Nominee Assigned"
                placeholder="Name of VC Nominee"
                value={vcNominee}
                onChange={v => setVcNominee(v)}
                readOnly={screened}
              />
              <TextBox
                label="Subject Matter Expert (SME)"
                placeholder="Name of SME"
                value={sme}
                onChange={v => setSme(v)}
                readOnly={screened}
              />
            </FormGrid>

            <div className="form-actions-row border-t border-slate-100 pt-4 flex gap-3">
              {!screened ? (
                <Button
                  label="Submit and Finish Screening"
                  icon="check"
                  variant="success"
                  onClick={handleFinishScreening}
                />
              ) : (
                <>
                  <Button
                    label="Finish Review"
                    icon="check-circle"
                    variant="primary"
                    onClick={handleFinishReview}
                  />
                  <Button
                    label="Update Screening Score"
                    icon="pencil"
                    variant="outlined"
                    onClick={() => setScreened(false)}
                  />
                  <Button
                    label="Print Application"
                    icon="print"
                    variant="outlined"
                    onClick={() =>
                      triggerNotification('Generating Print Layout...', 'info')
                    }
                  />
                </>
              )}
            </div>
          </FormCard>
        )}
      </div>
    </FormPage>
  );
}


