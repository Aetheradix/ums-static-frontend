import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareerAdvancement } from '../context';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { TextBox, DropDownList, Checkbox } from 'shared/components/forms';
import FormWizard, {
  type WizardStep,
} from 'shared/components/forms/FormWizard';

import { STAGE_OPTIONS, QUALIFICATION_OPTIONS } from '../data';

export default function PbasCreate() {
  const navigate = useNavigate();
  const { pbasApplications, setPBASApplications, triggerNotification } =
    useCareerAdvancement();

  // Initial Form state
  const [form, setForm] = useState({
    employeeId: 'EMP001',
    employeeName: 'Dr. Ramesh Kumar',
    designation: 'Assistant Professor',
    department: 'Computer Science',
    dob: '1985-05-15',
    category: 'General',
    dateOfJoining: '2018-08-20',
    stageApplyingFor: 'Stage 1 → Stage 2',

    highestQualification: 'Ph.D.',
    university: 'State Technological University',
    yearOfPassing: '2015',
    netSetQualified: 'Yes',
    netSetYear: '2012',

    lecturesDelivered: '82',
    tutorialPracticalHours: '36',
    newCoursesIntroduced: '2',
    courseMaterialPrepared: 'Prepared study notes for CS-101 and CS-202.',
    eContentDeveloped: 'Yes',
    eLearningContributions: 'Uploaded 10 lecture modules on Swayam portal.',
    teachingAPIScore: '85',

    intJournalPapers: '4',
    natJournalPapers: '2',
    booksChaptersPublished: '1',
    foreignTranslations: '0',
    projectsUndertaken: '1',
    seedMoneyReceived: '250000',
    phdStudentsGuided: '1',
    collaborations: 'Joint research with STU Chemistry department.',
    researchAPIScore: '60',

    mentorshipActivities: 'Mentor to 25 undergraduate students.',
    professionalDevelopmentPrograms: '2',
    professionalBodyAssociations: 'CSI Senior Member, IEEE Member.',
    mousUndertaken: '1',
    consultancyDetails: 'Consultant for local software firm.',
    additionalELearning: 'Completed 1 Coursera certification in AI.',
    othersAPIScore: '45',

    declaration: false,
    signature: '',
  });

  const set = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleComplete = () => {
    if (!form.declaration || !form.signature) {
      triggerNotification(
        'Please accept the declaration and sign the application.',
        'error'
      );
      return;
    }

    const totalScore =
      Number(form.teachingAPIScore || 0) +
      Number(form.researchAPIScore || 0) +
      Number(form.othersAPIScore || 0);

    const newApp: CareerAdvancement.CASPBASApplication = {
      id: `PBAS-${new Date().getFullYear()}-${String(pbasApplications.length + 1).padStart(4, '0')}`,
      employeeId: form.employeeId,
      employeeName: form.employeeName,
      designation: form.designation,
      department: form.department,
      session: `PBAS ${new Date().getFullYear() - 1}-${String(new Date().getFullYear()).slice(2)}`,
      type: 'PBAS',
      stage: form.stageApplyingFor,
      status: 'Pending',
      currentHandler: 'HOD',
      submittedOn: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      lastUpdated: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),

      dateOfBirth: form.dob,
      category: form.category,
      dateOfJoining: form.dateOfJoining,
      stageApplyingFor: form.stageApplyingFor,

      highestQualification: form.highestQualification,
      university: form.university,
      yearOfPassing: Number(form.yearOfPassing),
      netSetQualified: form.netSetQualified as any,
      netSetYear: Number(form.netSetYear),

      lecturesDelivered: Number(form.lecturesDelivered),
      tutorialPracticalHours: Number(form.tutorialPracticalHours),
      newCoursesIntroduced: Number(form.newCoursesIntroduced),
      courseMaterialPrepared: form.courseMaterialPrepared,
      eContentDeveloped: form.eContentDeveloped as any,
      eLearningContributions: form.eLearningContributions,
      teachingAPIScore: Number(form.teachingAPIScore),

      intJournalPapers: Number(form.intJournalPapers),
      natJournalPapers: Number(form.natJournalPapers),
      booksChaptersPublished: Number(form.booksChaptersPublished),
      foreignTranslations: Number(form.foreignTranslations),
      projectsUndertaken: Number(form.projectsUndertaken),
      seedMoneyReceived: Number(form.seedMoneyReceived),
      phdStudentsGuided: Number(form.phdStudentsGuided),
      collaborations: form.collaborations,
      researchAPIScore: Number(form.researchAPIScore),

      mentorshipActivities: form.mentorshipActivities,
      professionalDevelopmentPrograms: Number(
        form.professionalDevelopmentPrograms
      ),
      professionalBodyAssociations: form.professionalBodyAssociations,
      mousUndertaken: Number(form.mousUndertaken),
      consultancyDetails: form.consultancyDetails,
      additionalELearning: form.additionalELearning,
      othersAPIScore: Number(form.othersAPIScore),

      totalAPIScore: totalScore,
    };

    setPBASApplications((prev: CareerAdvancement.CASPBASApplication[]) => [
      ...prev,
      newApp,
    ]);
    triggerNotification(
      'PBAS Application submitted. Forwarded to Head of Department (HOD).',
      'success'
    );
    navigate('/career-advancement/dashboard');
  };

  const handleReset = () => {
    // Reset to defaults
    setForm(prev => ({
      ...prev,
      declaration: false,
      signature: '',
    }));
  };

  const stageOptions = STAGE_OPTIONS.map(s => ({ id: s, text: s }));
  const qualOptions = QUALIFICATION_OPTIONS.map(q => ({ id: q, text: q }));

  const steps: WizardStep[] = [
    {
      label: 'Basic Details',
      content: (
        <FormGrid columns={2}>
          <TextBox label="Employee ID" value={form.employeeId} readOnly />
          <TextBox label="Employee Name" value={form.employeeName} readOnly />
          <TextBox
            label="Date of Birth"
            value={form.dob}
            onChange={v => set('dob', v)}
          />
          <TextBox label="Department" value={form.department} readOnly />
          <TextBox
            label="Date of Joining"
            value={form.dateOfJoining}
            onChange={v => set('dateOfJoining', v)}
          />
          <TextBox label="Category" value={form.category} readOnly />
          <DropDownList
            label="Stage Applying For *"
            data={stageOptions}
            textField="text"
            valueField="id"
            value={form.stageApplyingFor}
            onChange={v => set('stageApplyingFor', v as string)}
          />
        </FormGrid>
      ),
    },
    {
      label: 'Academic Details',
      content: (
        <FormGrid columns={2}>
          <DropDownList
            label="Highest Qualification *"
            data={qualOptions}
            textField="text"
            valueField="id"
            value={form.highestQualification}
            onChange={v => set('highestQualification', v as string)}
          />
          <TextBox
            label="University / Awarding Body *"
            value={form.university}
            onChange={v => set('university', v)}
          />
          <TextBox
            label="Year of Passing *"
            value={form.yearOfPassing}
            onChange={v => set('yearOfPassing', v)}
          />
          <DropDownList
            label="NET / SLET Qualified *"
            data={[
              { id: 'Yes', text: 'Yes' },
              { id: 'No', text: 'No' },
            ]}
            textField="text"
            valueField="id"
            value={form.netSetQualified}
            onChange={v => set('netSetQualified', v as any)}
          />
          {form.netSetQualified === 'Yes' && (
            <TextBox
              label="NET / SLET Year *"
              value={form.netSetYear}
              onChange={v => set('netSetYear', v)}
            />
          )}
        </FormGrid>
      ),
    },
    {
      label: 'Teaching API',
      content: (
        <FormGrid columns={2}>
          <TextBox
            label="Lectures, Seminars, Tutorials Delivered *"
            value={form.lecturesDelivered}
            onChange={v => set('lecturesDelivered', v)}
          />
          <TextBox
            label="Tutorial / Practical / Field Hours *"
            value={form.tutorialPracticalHours}
            onChange={v => set('tutorialPracticalHours', v)}
          />
          <TextBox
            label="New Courses / Syllabus Introduced *"
            value={form.newCoursesIntroduced}
            onChange={v => set('newCoursesIntroduced', v)}
          />
          <TextBox
            label="Course Study Material Prepared *"
            value={form.courseMaterialPrepared}
            onChange={v => set('courseMaterialPrepared', v)}
          />
          <DropDownList
            label="e-Content Developed *"
            data={[
              { id: 'Yes', text: 'Yes' },
              { id: 'No', text: 'No' },
            ]}
            textField="text"
            valueField="id"
            value={form.eContentDeveloped}
            onChange={v => set('eContentDeveloped', v as any)}
          />
          <TextBox
            label="eLearning Contributions *"
            value={form.eLearningContributions}
            onChange={v => set('eLearningContributions', v)}
          />
          <TextBox
            label="Self Claimed Teaching API Score *"
            value={form.teachingAPIScore}
            onChange={v => set('teachingAPIScore', v)}
          />
        </FormGrid>
      ),
    },
    {
      label: 'Research API',
      content: (
        <FormGrid columns={2}>
          <TextBox
            label="Research Papers (Int'l journals) *"
            value={form.intJournalPapers}
            onChange={v => set('intJournalPapers', v)}
          />
          <TextBox
            label="Research Papers (Nat'l journals) *"
            value={form.natJournalPapers}
            onChange={v => set('natJournalPapers', v)}
          />
          <TextBox
            label="Books / Chapters Published *"
            value={form.booksChaptersPublished}
            onChange={v => set('booksChaptersPublished', v)}
          />
          <TextBox
            label="Translation Works *"
            value={form.foreignTranslations}
            onChange={v => set('foreignTranslations', v)}
          />
          <TextBox
            label="Sponsored Projects Undertaken *"
            value={form.projectsUndertaken}
            onChange={v => set('projectsUndertaken', v)}
          />
          <TextBox
            label="Seed Money Received (in Rs.) *"
            value={form.seedMoneyReceived}
            onChange={v => set('seedMoneyReceived', v)}
          />
          <TextBox
            label="Ph.D. Students Guided *"
            value={form.phdStudentsGuided}
            onChange={v => set('phdStudentsGuided', v)}
          />
          <TextBox
            label="Joint Collaboration Projects *"
            value={form.collaborations}
            onChange={v => set('collaborations', v)}
          />
          <TextBox
            label="Self Claimed Research API Score *"
            value={form.researchAPIScore}
            onChange={v => set('researchAPIScore', v)}
          />
        </FormGrid>
      ),
    },
    {
      label: 'Extension API',
      content: (
        <FormGrid columns={2}>
          <TextBox
            label="Mentorship Activities Details *"
            value={form.mentorshipActivities}
            onChange={v => set('mentorshipActivities', v)}
          />
          <TextBox
            label="Professional Development Programs (No.) *"
            value={form.professionalDevelopmentPrograms}
            onChange={v => set('professionalDevelopmentPrograms', v)}
          />
          <TextBox
            label="Professional Body Memberships *"
            value={form.professionalBodyAssociations}
            onChange={v => set('professionalBodyAssociations', v)}
          />
          <TextBox
            label="MoUs Undertaken *"
            value={form.mousUndertaken}
            onChange={v => set('mousUndertaken', v)}
          />
          <TextBox
            label="Consultancy Details *"
            value={form.consultancyDetails}
            onChange={v => set('consultancyDetails', v)}
          />
          <TextBox
            label="Additional eLearning Complete *"
            value={form.additionalELearning}
            onChange={v => set('additionalELearning', v)}
          />
          <TextBox
            label="Self Claimed Extension API Score *"
            value={form.othersAPIScore}
            onChange={v => set('othersAPIScore', v)}
          />
        </FormGrid>
      ),
    },
    {
      label: 'Declaration & Submit',
      content: (
        <div className="space-y-6">
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-indigo-800 text-xs leading-relaxed">
            I hereby declare that the details provided above are true to the
            best of my knowledge and correspond to performance appraisal systems
            guidelines. I understand that the verified API scores are subject to
            administrative scrutiny and screening committee audits.
          </div>
          <FormCard
            title="API Score Summary"
            icon="chart-bar"
            className="bg-slate-50 border border-slate-200"
          >
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white p-3 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Teaching Score
                </span>
                <p className="text-lg font-black text-indigo-600 mt-1">
                  {form.teachingAPIScore}
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Research Score
                </span>
                <p className="text-lg font-black text-indigo-600 mt-1">
                  {form.researchAPIScore}
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Extension Score
                </span>
                <p className="text-lg font-black text-indigo-600 mt-1">
                  {form.othersAPIScore}
                </p>
              </div>
              <div className="col-span-3 bg-indigo-50 p-3 rounded-lg border border-indigo-100 flex justify-between items-center px-6">
                <span className="text-xs font-bold text-indigo-700 uppercase">
                  Total Claimed API Score:
                </span>
                <span className="text-xl font-extrabold text-indigo-700">
                  {Number(form.teachingAPIScore || 0) +
                    Number(form.researchAPIScore || 0) +
                    Number(form.othersAPIScore || 0)}
                </span>
              </div>
            </div>
          </FormCard>
          <FormGrid columns={1}>
            <Checkbox
              label="I accept the declaration and verified API calculations."
              checked={form.declaration}
              onChange={v => set('declaration', v)}
            />
            <TextBox
              label="Full Name Signature *"
              placeholder="Enter your name"
              value={form.signature}
              onChange={v => set('signature', v)}
            />
          </FormGrid>
        </div>
      ),
    },
  ];

  return (
    <FormPage
      title="PBAS / CAS Application Form"
      description="Fill in the multi-step appraisal details to claim API scores for CAS promotion"
      breadcrumbs={[
        { label: 'Career Advancement', to: '/career-advancement/dashboard' },
        { label: 'PBAS Wizard' },
      ]}
    >
      <FormCard title="New Promotion Application Form" icon="file">
        <FormWizard
          steps={steps}
          onComplete={handleComplete}
          onReset={handleReset}
        />
      </FormCard>
    </FormPage>
  );
}
