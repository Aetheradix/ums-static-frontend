import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox, TextArea } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import {
  approvalRequests,
  venueMasters,
  type ApprovalRequest,
} from '../../mocks';
import { tdmUrls } from '../../urls';

export default function RequestBudget() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    venue: venueMasters[0]?.name || '',
    startDate: '',
    startTime: '',
    endTime: '',
    amount: '',
    description: '',
  });

  const handleSubmit = () => {
    if (!form.title || !form.amount || !form.startDate) {
      ToastService.error('Please fill in all required fields.');
      return;
    }

    const newRequest: ApprovalRequest = {
      id: `APR${Date.now()}`,
      requestNo: `APR-2025-${Math.floor(100 + Math.random() * 900)}`,
      type: 'Budget Approval',
      title: `${form.title} (Venue: ${form.venue})`,
      requestedBy: 'Mr. Vikram Anand Mehta (External Trainer)',
      requestedDate: new Date().toISOString().split('T')[0],
      department: 'External Trainer',
      currentApprover: 'Finance Committee',
      level: 1,
      totalLevels: 3,
      status: 'Pending',
      amount: Number(form.amount || 0),
    };

    approvalRequests.push(newRequest);
    ToastService.success('Training budget request submitted for approval!');
    navigate(tdmUrls.external.portal);
  };

  return (
    <FormPage
      title="Request Training Budget"
      description="Submit a new training budget request based on the selected venue, schedule timings, and material costs."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'External Trainer', to: tdmUrls.external.portal },
        { label: 'Request Budget' },
      ]}
    >
      <FormCard title="Budget & Venue Details">
        <FormGrid columns={2}>
          <TextBox
            label="Training Title / Programme"
            value={form.title}
            onChange={v => setForm(f => ({ ...f, title: v }))}
            required
          />
          <DropDownList
            label="Training Venue"
            data={venueMasters.map(v => ({
              name: `${v.name} (${v.building} - Rm ${v.room})`,
              value: v.name,
            }))}
            textField="name"
            optionValue="value"
            value={form.venue}
            onChange={v => setForm(f => ({ ...f, venue: v as string }))}
            required
          />
          <TextBox
            label="Date"
            type="date"
            value={form.startDate}
            onChange={v => setForm(f => ({ ...f, startDate: v }))}
            required
          />
          <FormGrid columns={2}>
            <TextBox
              label="Start Time"
              type="time"
              value={form.startTime}
              onChange={v => setForm(f => ({ ...f, startTime: v }))}
              required
            />
            <TextBox
              label="End Time"
              type="time"
              value={form.endTime}
              onChange={v => setForm(f => ({ ...f, endTime: v }))}
              required
            />
          </FormGrid>
          <TextBox
            label="Requested Amount (₹)"
            type="number"
            value={form.amount}
            onChange={v => setForm(f => ({ ...f, amount: v }))}
            required
          />
          <TextArea
            label="Budget Details & Requirements"
            value={form.description}
            onChange={v => setForm(f => ({ ...f, description: v }))}
            placeholder="Describe honorarium, material costs, software licenses, refreshment details, etc."
          />
        </FormGrid>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
            marginTop: '2rem',
          }}
        >
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => navigate(tdmUrls.external.portal)}
          />
          <Button
            label="Submit Request"
            variant="primary"
            icon="check"
            onClick={handleSubmit}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
