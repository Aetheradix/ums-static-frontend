import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useResidentialAllocation } from '../context';
import { RESIDENTIAL_ALLOCATION_URLS } from '../urls';

const GENDER_OPTIONS: Data.DataItem<string>[] = [
  { id: 'Male', text: 'Male' },
  { id: 'Female', text: 'Female' },
];

const PAY_LEVEL_OPTIONS: Data.DataItem<string>[] = [
  { id: 'Level-10', text: 'Level-10 (Assistant Professor)' },
  { id: 'Level-12', text: 'Level-12 (Assistant Professor Sr.)' },
  { id: 'Level-13A', text: 'Level-13A (Associate Professor)' },
  { id: 'Level-14', text: 'Level-14 (Professor)' },
  { id: 'Level-15', text: 'Level-15 (Dean / Registrar)' },
];

const QUARTER_PREF_OPTIONS: Data.DataItem<string>[] = [
  { id: 'Type-III', text: 'Type-III (3 BHK Flat)' },
  { id: 'Type-IV', text: 'Type-IV (Premium Apartment)' },
  { id: 'Type-V', text: 'Type-V (VIP Bungalow Unit)' },
];

const BLOOD_GROUP_OPTIONS: Data.DataItem<string>[] = [
  { id: 'A+', text: 'A Positive (A+)' },
  { id: 'B+', text: 'B Positive (B+)' },
  { id: 'O+', text: 'O Positive (O+)' },
  { id: 'B-', text: 'B Negative (B-)' },
];

export default function StaffApply() {
  const navigate = useNavigate();
  const { estates, applications, setApplications, triggerNotification } =
    useResidentialAllocation();

  const [applyStep, setApplyStep] = useState(1);
  const [correctionLookupEnrollment, setCorrectionLookupEnrollment] =
    useState('');

  const [applyForm, setApplyForm] =
    useState<ResidentialAllocationManagement.StaffApplication>({
      id: '',
      enrollmentNo: '',
      name: '',
      fatherName: '',
      motherName: '',
      gender: 'Male',
      dob: '',
      mobile: '',
      email: '',
      department: 'Department of Civil Engineering',
      designation: 'Associate Professor',
      payLevel: 'Level-13A',
      basicPay: 142000,
      dateOfJoining: '',
      permanentAddress: '',
      district: 'Bhopal',
      city: 'Bhopal',
      pincode: '',
      blockPreference: '',
      quarterPreference: 'Type-IV',
      familyDependents: '3',
      specialRequirement: '',
      emergencyName: '',
      emergencyMobile: '',
      emergencyRelationship: '',
      bloodGroup: 'O+',
      medicalCondition: '',
      disabilityDetails: '',
      allergies: '',
      documents: {
        photo: 'photo_uploaded_default.png',
        salarySlip: 'pay_slip_may_2026.pdf',
        joiningLetter: 'stu_joining_letter.pdf',
        nocCertificate: 'noc_civil_dept.pdf',
      },
      declaration: false,
      signature: '',
      status: 'Pending',
      adminRemarks: '',
      allottedEstate: '',
      allottedFlat: '',
      feeStatus: 'Unpaid',
    });

  const handleRetrieveCorrectionProfile = () => {
    if (!correctionLookupEnrollment.trim()) {
      triggerNotification(
        'Please enter an Enrollment Number to retrieve your profile.',
        'error'
      );
      return;
    }
    const match = applications.find(
      app =>
        app.enrollmentNo.toLowerCase() ===
          correctionLookupEnrollment.toLowerCase() && app.status === 'Sent Back'
    );
    if (match) {
      setApplyForm({ ...match });
      triggerNotification(
        'Application retrieved successfully! Make your corrections in the form.'
      );
      setApplyStep(1);
    } else {
      triggerNotification(
        'No correction queue record found matching this Enrollment Number.',
        'error'
      );
    }
  };

  const handleApplyNext = () => {
    if (applyStep < 9) setApplyStep(applyStep + 1);
  };
  const handleApplyPrev = () => {
    if (applyStep > 1) setApplyStep(applyStep - 1);
  };

  const handleApplySubmit = () => {
    if (!applyForm.declaration) {
      triggerNotification(
        'You must accept the terms & declaration checkbox.',
        'error'
      );
      return;
    }
    if (!applyForm.enrollmentNo || !applyForm.name) {
      triggerNotification(
        'Please fill out Staff Information (ID & Name) in Step 1.',
        'error'
      );
      return;
    }

    if (applyForm.id) {
      setApplications(prev =>
        prev.map(app =>
          app.id === applyForm.id
            ? {
                ...applyForm,
                status: 'Pending',
                adminRemarks:
                  'Corrected profile resubmitted by staff applicant.',
              }
            : app
        )
      );
      triggerNotification(
        `Application ${applyForm.id} successfully updated and returned to Admin Review Queue.`
      );
    } else {
      const newAppId = `APP-STAFF-2026-${String(Math.floor(100 + Math.random() * 900))}`;
      const submission: ResidentialAllocationManagement.StaffApplication = {
        ...applyForm,
        id: newAppId,
        status: 'Pending',
        feeStatus: 'Unpaid',
      };
      setApplications(prev => [...prev, submission]);
      triggerNotification(
        `Application submitted successfully! Application ID: ${newAppId}`
      );
    }

    navigate(RESIDENTIAL_ALLOCATION_URLS.adminReview);
  };

  const blockOptions: Data.DataItem<string>[] = [
    { id: '', text: '-- Choose Block Preference --' },
    ...estates.map(h => ({ id: h.code, text: h.name })),
  ];

  return (
    <FormPage
      title="Faculty Quarter Allocation Portal"
      description="Apply for university residential quarters or retrieve profiles flagged back by the housing committee"
      breadcrumbs={[
        {
          label: 'Residential Allocation',
          to: RESIDENTIAL_ALLOCATION_URLS.dashboard,
        },
        { label: 'Staff Apply' },
      ]}
    >
      <div className="space-y-6">
        {/* Correction Lookup */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <i className="pi pi-refresh text-amber-500 text-xl" />
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Correction Profile Lookup
              </h4>
              <p className="text-xs text-slate-500">
                Retrieve applications sent back for document amendments
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. STU-FAC-102"
              value={correctionLookupEnrollment}
              onChange={e => setCorrectionLookupEnrollment(e.target.value)}
              className="text-xs border rounded-xl px-3 py-2 outline-none focus:border-amber-500 uppercase font-mono"
            />
            <Button
              label="Pull Profile"
              variant="secondary"
              onClick={handleRetrieveCorrectionProfile}
            />
          </div>
        </div>

        {/* Stepper Header */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex justify-between items-center overflow-x-auto gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(stepNum => (
            <div
              key={stepNum}
              className="flex flex-col items-center min-w-[80px]"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  applyStep === stepNum
                    ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100 font-extrabold'
                    : applyStep > stepNum
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-100 text-slate-400 border'
                }`}
              >
                {stepNum}
              </div>
              <span className="text-[10px] font-bold text-slate-500 mt-1.5 whitespace-nowrap">
                Step {stepNum}
              </span>
            </div>
          ))}
        </div>

        {/* Step Container FormCard */}
        <FormCard
          title={`Step ${applyStep} of 9: ${
            applyStep === 1
              ? 'Staff Personal Profile'
              : applyStep === 2
                ? 'STU Academic Seniority Details'
                : applyStep === 3
                  ? 'Permanent Residential Details'
                  : applyStep === 4
                    ? 'Quarter Configuration Preferences'
                    : applyStep === 5
                      ? 'Dependent Family Mapping'
                      : applyStep === 6
                        ? 'Emergency Alternate Contacts'
                        : applyStep === 7
                          ? 'Medical Background Record'
                          : applyStep === 8
                            ? 'Salary Slip Dossier Upload'
                            : 'Legal Declarations & Digital Execution'
          }`}
          icon="file"
        >
          <div className="space-y-6">
            {applyStep === 1 && (
              <FormGrid columns={2}>
                <TextBox
                  label="Faculty Registration ID *"
                  placeholder="e.g. STU-FAC-102"
                  value={applyForm.enrollmentNo}
                  onChange={v =>
                    setApplyForm({ ...applyForm, enrollmentNo: v })
                  }
                />
                <TextBox
                  label="Staff / Faculty Name *"
                  placeholder="Full Name"
                  value={applyForm.name}
                  onChange={v => setApplyForm({ ...applyForm, name: v })}
                />
                <TextBox
                  label="Father's Name *"
                  placeholder="Father's Name"
                  value={applyForm.fatherName}
                  onChange={v => setApplyForm({ ...applyForm, fatherName: v })}
                />
                <TextBox
                  label="Mother's Name *"
                  placeholder="Mother's Name"
                  value={applyForm.motherName}
                  onChange={v => setApplyForm({ ...applyForm, motherName: v })}
                />
                <DropDownList
                  label="Gender *"
                  data={GENDER_OPTIONS}
                  textField="text"
                  valueField="id"
                  value={applyForm.gender}
                  onChange={v =>
                    setApplyForm({ ...applyForm, gender: v as string })
                  }
                />
                <TextBox
                  label="Contact Mobile No. *"
                  placeholder="10-digit number"
                  value={applyForm.mobile}
                  onChange={v => setApplyForm({ ...applyForm, mobile: v })}
                />
              </FormGrid>
            )}

            {applyStep === 2 && (
              <FormGrid columns={2}>
                <TextBox
                  label="Associated Academic Department"
                  placeholder="e.g. Department of Civil Engineering"
                  value={applyForm.department}
                  onChange={v => setApplyForm({ ...applyForm, department: v })}
                />
                <TextBox
                  label="Designation Role"
                  placeholder="Associate Professor"
                  value={applyForm.designation}
                  onChange={v => setApplyForm({ ...applyForm, designation: v })}
                />
                <DropDownList
                  label="Eligible Pay Matrix Level *"
                  data={PAY_LEVEL_OPTIONS}
                  textField="text"
                  valueField="id"
                  value={applyForm.payLevel}
                  onChange={v =>
                    setApplyForm({ ...applyForm, payLevel: v as string })
                  }
                />
                <TextBox
                  label="Date of Joining STU (Seniority Key) *"
                  placeholder="YYYY-MM-DD"
                  value={applyForm.dateOfJoining}
                  onChange={v =>
                    setApplyForm({ ...applyForm, dateOfJoining: v })
                  }
                />
              </FormGrid>
            )}

            {applyStep === 3 && (
              <FormGrid columns={2}>
                <TextBox
                  label="Permanent Residential Address"
                  placeholder="House/Flat number, Landmark area"
                  value={applyForm.permanentAddress}
                  onChange={v =>
                    setApplyForm({ ...applyForm, permanentAddress: v })
                  }
                />
                <TextBox
                  label="District"
                  placeholder="District name"
                  value={applyForm.district}
                  onChange={v => setApplyForm({ ...applyForm, district: v })}
                />
                <TextBox
                  label="City"
                  placeholder="Town/City name"
                  value={applyForm.city}
                  onChange={v => setApplyForm({ ...applyForm, city: v })}
                />
                <TextBox
                  label="Pincode"
                  placeholder="6-digit Pincode"
                  value={applyForm.pincode}
                  onChange={v => setApplyForm({ ...applyForm, pincode: v })}
                />
              </FormGrid>
            )}

            {applyStep === 4 && (
              <FormGrid columns={2}>
                <DropDownList
                  label="Primary Block Preference"
                  data={blockOptions}
                  textField="text"
                  valueField="id"
                  value={applyForm.blockPreference}
                  onChange={v =>
                    setApplyForm({ ...applyForm, blockPreference: v as string })
                  }
                />
                <DropDownList
                  label="Accommodation Preference Tier"
                  data={QUARTER_PREF_OPTIONS}
                  textField="text"
                  valueField="id"
                  value={applyForm.quarterPreference}
                  onChange={v =>
                    setApplyForm({
                      ...applyForm,
                      quarterPreference: v as string,
                    })
                  }
                />
              </FormGrid>
            )}

            {applyStep === 5 && (
              <FormGrid columns={2}>
                <TextBox
                  label="Number of Dependents"
                  placeholder="e.g. 3"
                  value={applyForm.familyDependents}
                  onChange={v =>
                    setApplyForm({ ...applyForm, familyDependents: v })
                  }
                />
                <TextBox
                  label="Special Physical / Ground Floor Requirements"
                  placeholder="e.g. Senior parent with joint issues"
                  value={applyForm.specialRequirement}
                  onChange={v =>
                    setApplyForm({ ...applyForm, specialRequirement: v })
                  }
                />
              </FormGrid>
            )}

            {applyStep === 6 && (
              <FormGrid columns={3}>
                <TextBox
                  label="Emergency Contact Name"
                  placeholder="Full name of person"
                  value={applyForm.emergencyName}
                  onChange={v =>
                    setApplyForm({ ...applyForm, emergencyName: v })
                  }
                />
                <TextBox
                  label="Emergency Mobile"
                  placeholder="10-digit alternate phone"
                  value={applyForm.emergencyMobile}
                  onChange={v =>
                    setApplyForm({ ...applyForm, emergencyMobile: v })
                  }
                />
                <TextBox
                  label="Relationship"
                  placeholder="e.g. Spouse"
                  value={applyForm.emergencyRelationship}
                  onChange={v =>
                    setApplyForm({ ...applyForm, emergencyRelationship: v })
                  }
                />
              </FormGrid>
            )}

            {applyStep === 7 && (
              <FormGrid columns={2}>
                <DropDownList
                  label="Blood Group *"
                  data={BLOOD_GROUP_OPTIONS}
                  textField="text"
                  valueField="id"
                  value={applyForm.bloodGroup}
                  onChange={v =>
                    setApplyForm({ ...applyForm, bloodGroup: v as string })
                  }
                />
                <TextBox
                  label="Chronic Medical Condition"
                  placeholder="e.g. Asthma, Hypertension"
                  value={applyForm.medicalCondition}
                  onChange={v =>
                    setApplyForm({ ...applyForm, medicalCondition: v })
                  }
                />
              </FormGrid>
            )}

            {applyStep === 8 && (
              <div className="space-y-4">
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-amber-800 text-xs">
                  <strong>Secure Document Checkpoint:</strong> Salary pay slip
                  and appointment letter verify your seniority rank.
                </div>
                <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50">
                  <i className="pi pi-file-pdf text-3xl text-indigo-600 mb-2" />
                  <p className="text-xs text-slate-600 font-bold">
                    salary_pay_slip_dossier.pdf
                  </p>
                  <span className="inline-block mt-2 px-2.5 py-1 text-[10px] bg-emerald-100 text-emerald-800 rounded font-mono font-bold">
                    Verified Document ✓
                  </span>
                </div>
              </div>
            )}

            {applyStep === 9 && (
              <div className="space-y-4">
                <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    checked={applyForm.declaration}
                    onChange={e =>
                      setApplyForm({
                        ...applyForm,
                        declaration: e.target.checked,
                      })
                    }
                    className="mt-1 h-4 w-4 rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span className="text-xs text-slate-700 leading-relaxed">
                    I hereby declare that all provided faculty credentials,
                    appointment dates, and salary band details are true to the
                    best of my knowledge under university bylaws.
                  </span>
                </div>
                <TextBox
                  label="Digital Signature *"
                  placeholder="Type Full Name"
                  value={applyForm.signature}
                  onChange={v => setApplyForm({ ...applyForm, signature: v })}
                />
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex justify-between pt-4 border-t border-slate-100">
              <Button
                label="← Previous Step"
                variant="secondary"
                onClick={handleApplyPrev}
                disabled={applyStep === 1}
              />
              {applyStep < 9 ? (
                <Button
                  label="Next Step →"
                  variant="primary"
                  onClick={handleApplyNext}
                />
              ) : (
                <Button
                  label="Submit Seniority Application ✓"
                  variant="primary"
                  onClick={handleApplySubmit}
                />
              )}
            </div>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
