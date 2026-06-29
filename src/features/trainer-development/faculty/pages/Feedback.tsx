import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
} from 'shared/new-components';
import { trainingPrograms } from '../../mocks';
import { tdmUrls } from '../../urls';

export default function SubmitFeedbackPage() {
  const completedTrainings = trainingPrograms.filter(t => t.status === 'Completed').slice(0, 3);

  return (
    <FormPage
      title="Submit Feedback"
      description="Provide constructive feedback for recently completed training programmes."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'Faculty Portal', to: tdmUrls.faculty.portal },
        { label: 'Feedback' },
      ]}
    >
      <div className="w-full">
        <FormCard title="Feedback Form">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <DropDownList
            label="Select Training Programme"
            data={completedTrainings}
            textField="title" optionValue="trainingId"
            required
          />

          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', margin: '0 0 1rem 0' }}>Rate the following (1-Poor, 5-Excellent)</h4>
            <FormGrid columns={2}>
              <DropDownList label="Trainer Knowledge" data={[{name:'5',value:5},{name:'4',value:4},{name:'3',value:3},{name:'2',value:2},{name:'1',value:1}]} textField="name" optionValue="value" value={5} />
              <DropDownList label="Communication Skills" data={[{name:'5',value:5},{name:'4',value:4},{name:'3',value:3},{name:'2',value:2},{name:'1',value:1}]} textField="name" optionValue="value" value={4} />
              <DropDownList label="Content Quality" data={[{name:'5',value:5},{name:'4',value:4},{name:'3',value:3},{name:'2',value:2},{name:'1',value:1}]} textField="name" optionValue="value" value={5} />
              <DropDownList label="Practical Application" data={[{name:'5',value:5},{name:'4',value:4},{name:'3',value:3},{name:'2',value:2},{name:'1',value:1}]} textField="name" optionValue="value" value={4} />
            </FormGrid>
          </div>

          <TextArea label="Additional Comments / Suggestions" rows={4} placeholder="Your feedback helps us improve future training programmes..." />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button label="Clear Form" variant="outlined" />
            <Button label="Submit Feedback" icon="send" variant="primary" />
          </div>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
