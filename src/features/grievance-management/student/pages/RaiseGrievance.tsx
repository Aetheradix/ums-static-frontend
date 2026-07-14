import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { TextBox, TextArea, DropDownList } from 'shared/components/forms';
import { ToastService } from 'services';
import { grievanceCategories, departmentMappings } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

export default function StudentRaiseGrievance() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [location, setLocation] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [declared, setDeclared] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedCat = grievanceCategories.find(c => c.name === category);
  const subCats =
    selectedCat?.subCategories.map(s => ({ name: s, value: s })) || [];
  const catOptions = grievanceCategories.map(c => ({
    name: c.name,
    value: c.name,
  }));
  const deptOptions = departmentMappings.map(d => ({
    name: d.primaryDepartment,
    value: d.primaryDepartment,
  }));

  const handleSubmit = () => {
    if (!declared) {
      ToastService.error('Please accept the declaration.');
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    const ticketNo = `GRV/2026/${Math.floor(10000 + Math.random() * 90000)}`;
    return (
      <FormPage
        title="Grievance Submitted"
        description="Your grievance has been registered successfully"
        breadcrumbs={[
          { label: 'Home', to: '/home' },
          { label: 'Grievance Management', to: grvUrls.portal },
          { label: 'Student Portal', to: grvUrls.student.portal },
          { label: 'Submitted' },
        ]}
      >
        <FormCard title="">
          <div className="flex flex-col items-center py-10 gap-4">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-4xl">
              ✓
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              Grievance Registered!
            </h2>
            <p className="text-slate-500 text-sm text-center max-w-md">
              Your grievance has been successfully submitted. The Department
              Officer will review and initiate the notesheet drafting shortly.
            </p>
            <div className="bg-slate-50 border rounded-lg p-4 w-full max-w-sm text-center">
              <p className="text-xs text-slate-500 mb-1">Your Ticket Number</p>
              <p className="text-2xl font-mono font-bold text-blue-700">
                {ticketNo}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Save this number to track your grievance
              </p>
            </div>
            <div className="flex gap-3 mt-2">
              <Button
                label="Track This Grievance"
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
      title="Raise New Grievance"
      description="File your complaint — DAVV University Grievance Redressal System"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Student Portal', to: grvUrls.student.portal },
        { label: 'Raise Grievance' },
      ]}
    >
      <div className="mb-4">
        <Button
          label="← Back to Portal"
          variant="outlined"
          onClick={() => navigate(grvUrls.student.portal)}
        />
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${step >= s ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 text-slate-400'}`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`h-1 w-12 rounded ${step > s ? 'bg-blue-600' : 'bg-slate-200'}`}
              />
            )}
          </div>
        ))}
        <span className="text-xs text-slate-500 ml-2">
          {step === 1
            ? 'Category & Location'
            : step === 2
              ? 'Description'
              : 'Review & Submit'}
        </span>
      </div>

      {step === 1 && (
        <FormCard title="Step 1 — Grievance Category & Location">
          <FormGrid columns={2}>
            <DropDownList
              label="Grievance Category *"
              data={catOptions}
              textField="name"
              optionValue="value"
              value={category}
              onChange={val => {
                setCategory(val as string);
                setSubCategory('');
              }}
            />
            <DropDownList
              label="Sub-Category *"
              data={subCats}
              textField="name"
              optionValue="value"
              value={subCategory}
              onChange={val => setSubCategory(val as string)}
            />
            <DropDownList
              label="Department *"
              data={deptOptions}
              textField="name"
              optionValue="value"
              value={department}
              onChange={val => setDepartment(val as string)}
            />
            <TextBox
              label="Incident Date *"
              placeholder="DD/MM/YYYY"
              value={incidentDate}
              onChange={setIncidentDate}
            />
            <TextBox
              label="Location of Incident *"
              placeholder="e.g. SCSIT Block, Exam Hall 2"
              value={location}
              onChange={setLocation}
            />
            <div className="flex items-center gap-3 mt-6">
              <input
                type="checkbox"
                id="anon"
                checked={isAnonymous}
                onChange={e => setIsAnonymous(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="anon" className="text-sm text-slate-600">
                Submit Anonymously
              </label>
            </div>
          </FormGrid>
          <div className="flex justify-end mt-4">
            <Button
              label="Next →"
              variant="primary"
              onClick={() => {
                if (!category || !subCategory || !department) {
                  ToastService.error('Please fill all required fields.');
                  return;
                }
                setStep(2);
              }}
            />
          </div>
        </FormCard>
      )}

      {step === 2 && (
        <FormCard title="Step 2 — Grievance Description">
          <FormGrid columns={1}>
            <TextBox
              label="Subject of Grievance *"
              placeholder="Brief subject (max 100 chars)"
              value={subject}
              onChange={setSubject}
            />
            <TextArea
              label="Detailed Description *"
              placeholder="Describe your grievance in detail. Include dates, names, events, and expected resolution..."
              value={description}
              onChange={setDescription}
              rows={6}
            />
          </FormGrid>
          <div className="flex justify-between mt-4">
            <Button
              label="← Back"
              variant="outlined"
              onClick={() => setStep(1)}
            />
            <Button
              label="Next →"
              variant="primary"
              onClick={() => {
                if (!subject || !description) {
                  ToastService.error('Please fill subject and description.');
                  return;
                }
                setStep(3);
              }}
            />
          </div>
        </FormCard>
      )}

      {step === 3 && (
        <FormCard title="Step 3 — Review & Submit">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
            <div className="bg-slate-50 rounded p-3">
              <p className="text-xs text-slate-400 mb-1">Category</p>
              <p className="font-semibold">{category}</p>
            </div>
            <div className="bg-slate-50 rounded p-3">
              <p className="text-xs text-slate-400 mb-1">Sub-Category</p>
              <p className="font-semibold">{subCategory}</p>
            </div>
            <div className="bg-slate-50 rounded p-3">
              <p className="text-xs text-slate-400 mb-1">Department</p>
              <p className="font-semibold">{department}</p>
            </div>
            <div className="bg-slate-50 rounded p-3">
              <p className="text-xs text-slate-400 mb-1">Incident Date</p>
              <p className="font-semibold">{incidentDate}</p>
            </div>
            <div className="bg-slate-50 rounded p-3 md:col-span-2">
              <p className="text-xs text-slate-400 mb-1">Subject</p>
              <p className="font-semibold">{subject}</p>
            </div>
            <div className="bg-slate-50 rounded p-3 md:col-span-2">
              <p className="text-xs text-slate-400 mb-1">Description</p>
              <p className="text-slate-600">{description}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <input
              type="checkbox"
              id="declare"
              checked={declared}
              onChange={e => setDeclared(e.target.checked)}
              className="mt-1 w-4 h-4"
            />
            <label htmlFor="declare" className="text-xs text-slate-700">
              I hereby declare that the information provided above is true and
              correct to the best of my knowledge. I understand that providing
              false information may result in disciplinary action.
            </label>
          </div>
          <div className="flex justify-between">
            <Button
              label="← Back"
              variant="outlined"
              onClick={() => setStep(2)}
            />
            <Button
              label="Submit Grievance ✓"
              variant="primary"
              onClick={handleSubmit}
            />
          </div>
        </FormCard>
      )}
    </FormPage>
  );
}
