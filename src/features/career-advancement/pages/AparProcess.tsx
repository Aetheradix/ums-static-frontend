import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCareerAdvancement } from '../context';
import '../career.css';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';

import {
  CATEGORY_OPTIONS,
  GROUP_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
} from '../data';

export default function AparProcess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appId = searchParams.get('id');

  const { aparApplications, setAPARApplications, triggerNotification } =
    useCareerAdvancement();

  // Find the selected APAR application
  const app = useMemo(() => {
    return (
      aparApplications.find(
        (a: CareerAdvancement.CASAPARApplication) => a.id === appId
      ) || aparApplications[0]
    );
  }, [aparApplications, appId]);

  // Form states
  const [dob, setDob] = useState(app?.dateOfBirth || '1985-05-15');
  const [category, setCategory] = useState(app?.category || 'General');
  const [group, setGroup] = useState(app?.group || 'Group A');
  const [scst, setScst] = useState<any>(app?.belongsToSCST || 'No');
  const [empType, setEmpType] = useState<any>(
    app?.employmentType || 'Permanent'
  );
  const [sections, setSections] = useState(
    app?.sectionsServed || 'Department of Computer Science'
  );
  const [lengthService, setLengthService] = useState(
    app?.serviceLengthUnderReviewer || '9 months'
  );
  const [continuousAppt, setContinuousAppt] = useState(
    app?.dateOfContinuousAppointment || '2018-08-20'
  );
  const [validityEmployee, setValidityEmployee] = useState(
    app?.employeeValidityDate || '2025-07-31'
  );
  const [validityReporting, setValidityReporting] = useState(
    app?.reportingOfficerValidityDate || '2025-08-31'
  );
  const [validityReviewing, setValidityReviewing] = useState(
    app?.reviewingOfficerValidityDate || '2025-09-30'
  );

  const handleInitiate = (e: React.FormEvent) => {
    e.preventDefault();

    // Update the APAR application in context
    setAPARApplications((prev: CareerAdvancement.CASAPARApplication[]) =>
      prev.map((a: CareerAdvancement.CASAPARApplication) => {
        if (a.id === app.id) {
          return {
            ...a,
            status: 'Pending',
            currentHandler: 'Employee Self Assessment',
            dateOfBirth: dob,
            category,
            group,
            belongsToSCST: scst,
            employmentType: empType,
            sectionsServed: sections,
            serviceLengthUnderReviewer: lengthService,
            dateOfContinuousAppointment: continuousAppt,
            employeeValidityDate: validityEmployee,
            reportingOfficerValidityDate: validityReporting,
            reviewingOfficerValidityDate: validityReviewing,
          };
        }
        return a;
      })
    );

    triggerNotification(
      `APAR process initiated successfully for ${app.employeeName}. Form sent to employee self-assessment.`,
      'success'
    );
    navigate('/career-advancement/apar-application/all');
  };

  const categoryData = CATEGORY_OPTIONS.map(c => ({ id: c, text: c }));
  const groupData = GROUP_OPTIONS.map(g => ({ id: g, text: g }));
  const empTypeData = EMPLOYMENT_TYPE_OPTIONS.map(e => ({ id: e, text: e }));

  return (
    <FormPage
      title="APAR â€” Initiate Process Application"
      description="Initialize the appraisal report configuration, timelines and dates for the employee"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Career Advancement', to: '/career-advancement/dashboard' },
        {
          label: 'APAR Applications',
          to: '/career-advancement/apar-application/all',
        },
        { label: 'Initiate APAR' },
      ]}
    >
      <FormCard
        title={`Configure APAR - ${app?.employeeName}`}
        subtitle={`Appraisal configuration for ${app?.designation} (${app?.department})`}
        icon="cog"
      >
        <form onSubmit={handleInitiate}>
          <FormGrid columns={2}>
            <TextBox
              label="Date of Birth *"
              value={dob}
              onChange={v => setDob(v)}
            />
            <DropDownList
              label="Category *"
              data={categoryData}
              textField="text"
              valueField="id"
              value={category}
              onChange={v => setCategory(v as string)}
            />
            <DropDownList
              label="Group *"
              data={groupData}
              textField="text"
              valueField="id"
              value={group}
              onChange={v => setGroup(v as string)}
            />
            <DropDownList
              label="Belongs to SC/ST *"
              data={[
                { id: 'Yes', text: 'Yes' },
                { id: 'No', text: 'No' },
              ]}
              textField="text"
              valueField="id"
              value={scst}
              onChange={v => setScst(v as any)}
            />
            <DropDownList
              label="Employment Type *"
              data={empTypeData}
              textField="text"
              valueField="id"
              value={empType}
              onChange={v => setEmpType(v as any)}
            />
            <TextBox
              label="Section(s) in which served *"
              placeholder="e.g. CS Dept, Admin block"
              value={sections}
              onChange={v => setSections(v)}
            />
            <TextBox
              label="Length of service under Reporting Officer *"
              placeholder="e.g. 1 year, 6 months"
              value={lengthService}
              onChange={v => setLengthService(v)}
            />
            <TextBox
              label="Date of Continuous Appointment *"
              value={continuousAppt}
              onChange={v => setContinuousAppt(v)}
            />
            <TextBox
              label="Validity Date: Employee Self-Assessment *"
              value={validityEmployee}
              onChange={v => setValidityEmployee(v)}
            />
            <TextBox
              label="Validity Date: Reporting Officer Appraisal *"
              value={validityReporting}
              onChange={v => setValidityReporting(v)}
            />
            <TextBox
              label="Validity Date: Reviewing Officer Appraisal *"
              value={validityReviewing}
              onChange={v => setValidityReviewing(v)}
            />
          </FormGrid>

          <div className="form-actions-row mt-6">
            <Button
              label="Initiate & Send to Employee"
              icon="check"
              variant="success"
              type="submit"
            />
            <Button
              label="Back to List"
              variant="outlined"
              onClick={() =>
                navigate('/career-advancement/apar-application/all')
              }
            />
          </div>
        </form>
      </FormCard>
    </FormPage>
  );
}


