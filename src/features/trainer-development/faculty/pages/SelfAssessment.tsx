import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { tdmUrls } from '../../urls';

export default function SelfAssessmentPage() {
  return (
    <FormPage
      title="Self Assessment"
      description="Evaluate your own skills, teaching methodologies and research activities."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'Faculty Portal', to: tdmUrls.faculty.portal },
        { label: 'Self Assessment' },
      ]}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <FormCard title="Teaching & Pedagogy">
          <FormGrid columns={2}>
            <DropDownList
              label="Usage of ICT tools in teaching"
              data={[
                { name: 'Advanced', value: 'Advanced' },
                { name: 'Intermediate', value: 'Intermediate' },
              ]}
              textField="name"
              optionValue="value"
              value="Intermediate"
            />
            <DropDownList
              label="Innovative Teaching Methods"
              data={[
                { name: 'Frequently', value: 'Frequently' },
                { name: 'Sometimes', value: 'Sometimes' },
              ]}
              textField="name"
              optionValue="value"
              value="Sometimes"
            />
            <DropDownList
              label="Curriculum Development Contribution"
              data={[
                { name: 'High', value: 'High' },
                { name: 'Medium', value: 'Medium' },
              ]}
              textField="name"
              optionValue="value"
              value="Medium"
            />
            <DropDownList
              label="Student Mentorship Effectiveness"
              data={[
                { name: 'Excellent', value: 'Excellent' },
                { name: 'Good', value: 'Good' },
              ]}
              textField="name"
              optionValue="value"
              value="Good"
            />
          </FormGrid>
        </FormCard>

        <FormCard title="Research & Publications">
          <FormGrid columns={2}>
            <DropDownList
              label="Research Publications (This Year)"
              data={[
                { name: '0', value: '0' },
                { name: '1-2', value: '1-2' },
                { name: '3+', value: '3+' },
              ]}
              textField="name"
              optionValue="value"
              value="1-2"
            />
            <DropDownList
              label="Conferences Attended"
              data={[
                { name: 'National', value: 'National' },
                { name: 'International', value: 'International' },
              ]}
              textField="name"
              optionValue="value"
              value="National"
            />
          </FormGrid>
          <TextArea
            label="Briefly describe your key research achievements"
            rows={3}
            placeholder="Enter description here..."
          />
        </FormCard>

        <FormCard title="Training Requirements">
          <TextArea
            label="Identify areas where you need training or upskilling"
            rows={3}
            placeholder="E.g., Advanced Machine Learning, Leadership Skills..."
          />
        </FormCard>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '1.5rem',
        }}
      >
        <Button label="Submit Assessment" icon="check" variant="primary" />
      </div>
    </FormPage>
  );
}
