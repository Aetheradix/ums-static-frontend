import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { TextArea, DropDownList } from 'shared/components/forms';
import { ToastService } from 'services';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

export default function StudentAppeal() {
  const navigate = useNavigate();
  const [ticketNo, setTicketNo] = useState('');
  const [appealReason, setAppealReason] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const reasonOptions = [
    {
      name: 'Resolution not satisfactory',
      value: 'Resolution not satisfactory',
    },
    {
      name: 'No action taken within timeline',
      value: 'No action taken within timeline',
    },
    {
      name: 'Grievance was wrongly closed',
      value: 'Grievance was wrongly closed',
    },
    {
      name: 'New evidence / documents available',
      value: 'New evidence / documents available',
    },
    { name: 'Procedural irregularity', value: 'Procedural irregularity' },
  ];

  const handleSubmit = () => {
    if (!ticketNo || !appealReason || !additionalInfo) {
      ToastService.error('Please fill all required fields.');
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    const appealNo = `APL/2026/${Math.floor(10000 + Math.random() * 90000)}`;
    return (
      <FormPage
        title="Appeal Submitted"
        description="Your appeal has been filed with the Registrar"
        breadcrumbs={[
          { label: 'Home', to: '/home' },
          { label: 'Grievance Management', to: grvUrls.portal },
          { label: 'Student Portal', to: grvUrls.student.portal },
          { label: 'Appeal' },
        ]}
      >
        <FormCard title="">
          <div className="flex flex-col items-center py-10 gap-4">
            <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-4xl">
              ⚖️
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              Appeal Registered Successfully!
            </h2>
            <p className="text-slate-500 text-sm text-center max-w-md">
              Your appeal has been forwarded to the Registrar's desk for final
              review. You will be notified of the decision.
            </p>
            <div className="bg-slate-50 border rounded-lg p-4 w-full max-w-sm text-center">
              <p className="text-xs text-slate-500 mb-1">Your Appeal Number</p>
              <p className="text-2xl font-mono font-bold text-orange-700">
                {appealNo}
              </p>
            </div>
            <div className="flex gap-3 mt-2">
              <Button
                label="Track Grievance"
                variant="primary"
                onClick={() => navigate(grvUrls.student.track)}
              />
              <Button
                label="Go to Dashboard"
                variant="outlined"
                onClick={() => navigate(grvUrls.student.dashboard)}
              />
            </div>
          </div>
        </FormCard>
      </FormPage>
    );
  }

  return (
    <FormPage
      title="File an Appeal"
      description="Appeal to the Registrar if you are not satisfied with the grievance resolution"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Student Portal', to: grvUrls.student.portal },
        { label: 'Appeal' },
      ]}
    >
      <div className="mb-4">
        <Button
          label="← Back to Portal"
          variant="outlined"
          onClick={() => navigate(grvUrls.student.portal)}
        />
      </div>

      <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg text-sm">
        <p className="font-semibold text-orange-800 mb-1">
          ⚠️ When to file an Appeal?
        </p>
        <ul className="text-orange-700 text-xs space-y-1 list-disc ml-4">
          <li>Your grievance was closed but the issue remains unresolved</li>
          <li>No action was taken within the expected timeframe</li>
          <li>You have new supporting evidence to submit</li>
          <li>A procedural irregularity occurred during review</li>
        </ul>
      </div>

      <FormCard title="Appeal Details">
        <FormGrid columns={2}>
          <div>
            <label className="grv-label">Grievance Ticket No *</label>
            <input
              className="grv-input w-full"
              placeholder="e.g. GRV/2026/00101"
              value={ticketNo}
              onChange={e => setTicketNo(e.target.value)}
            />
          </div>
          <DropDownList
            label="Reason for Appeal *"
            data={reasonOptions}
            textField="name"
            optionValue="value"
            value={appealReason}
            onChange={val => setAppealReason(val as string)}
          />
          <div className="md:col-span-2">
            <TextArea
              label="Additional Information & Supporting Statement *"
              placeholder="Provide a detailed statement of why you are appealing, what resolution you expect, and any new information..."
              value={additionalInfo}
              onChange={setAdditionalInfo}
              rows={5}
            />
          </div>
        </FormGrid>
        <div className="flex justify-end mt-4 gap-3">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => navigate(grvUrls.student.portal)}
          />
          <Button
            label="Submit Appeal ⚖️"
            variant="primary"
            onClick={handleSubmit}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
