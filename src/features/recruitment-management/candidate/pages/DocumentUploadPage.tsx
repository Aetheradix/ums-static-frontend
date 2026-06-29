import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { Checkbox, DropDownList, PickList } from 'shared/components/forms';
import FormWizard from 'shared/components/forms/FormWizard';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { MY_CANDIDATE } from '../../mock/data';

// ─── Mock Districts ───────────────────────────────────────────────────────────
const DISTRICTS = [
  { label: 'Agar Malwa', value: 'AGAR_MALWA' },
  { label: 'Indore', value: 'INDORE' },
  { label: 'Bhopal', value: 'BHOPAL' },
  { label: 'Gwalior', value: 'GWALIOR' },
  { label: 'Jabalpur', value: 'JABALPUR' },
  { label: 'Sagar', value: 'SAGAR' },
];

const ALL_DIVISIONS = [
  { id: '1', label: 'Gwalior' },
  { id: '2', label: 'Indore' },
  { id: '3', label: 'Jabalpur' },
  { id: '4', label: 'Narmadapuram' },
  { id: '5', label: 'Rewa' },
  { id: '6', label: 'Sagar' },
];

// ─── Step 1: Candidate Details ────────────────────────────────────────────────
function StepCandidateDetails() {
  const c = MY_CANDIDATE;
  const rows = [
    ['Roll Number', 'NA'],
    ['Application Number', c.applicationNo],
    ['Test Paper Name', 'NA'],
    ['Subject', 'NA'],
    ['Varg Name', 'Varg2'],
    ['Candidate Name', c.name.toUpperCase()],
    ['Father / Husband Name', c.fatherName.toUpperCase()],
    ['Mother Name', 'SAROJ BAI'],
    ['Date of Birth', c.dob],
    ['Gender', 'Male'],
    ['Mobile Number', c.mobile],
    ['Email', 'testmail1@gmail.com'],
  ];

  return (
    <FormCard title="Candidate Details" icon="badge">
      <FormGrid columns={4}>
        {rows.map(([label, value]) => (
          <div key={label} className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              {label}
            </span>
            <span className="text-[13px] text-slate-300 border-l-2 border-violet-500 pl-2 font-medium">
              {value}
            </span>
          </div>
        ))}
      </FormGrid>
    </FormCard>
  );
}

// ─── Step 2: Document Upload ──────────────────────────────────────────────────
function StepDocumentUpload({
  files,
  setFiles,
  uploadedDocs,
  setUploadedDocs,
  locked,
}: {
  files: Record<string, File | null>;
  setFiles: (f: Record<string, File | null>) => void;
  uploadedDocs: Record<string, boolean>;
  setUploadedDocs: (d: Record<string, boolean>) => void;
  locked: boolean;
}) {
  const docs = MY_CANDIDATE.documents;

  const handleFileChange = (docName: string, file: File | null) => {
    setFiles({ ...files, [docName]: file });
  };

  const handleUpload = (docName: string) => {
    if (!files[docName]) {
      ToastService.error(`Please choose a file for "${docName}" first.`);
      return;
    }
    setUploadedDocs({ ...uploadedDocs, [docName]: true });
    ToastService.success(`"${docName}" uploaded successfully.`);
  };

  return (
    <FormCard title="Upload Documents" icon="upload_file">
      <p className="text-xs text-red-400 font-medium mb-4">
        Note: Only PDF (.pdf) and JPG (.jpg) files are allowed. Maximum file
        size: 1 MB
      </p>
      <div className="overflow-x-auto rounded-lg border border-slate-400/15">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="px-4 py-3 text-left text-[13px] font-semibold w-14">
                S.No
              </th>
              <th className="px-4 py-3 text-left text-[13px] font-semibold">
                Document Name
              </th>
              <th className="px-4 py-3 text-center text-[13px] font-semibold w-52">
                {locked ? 'File Name' : 'Upload / View'}
              </th>
              <th className="px-4 py-3 text-center text-[13px] font-semibold w-36">
                {locked ? 'Status' : 'Upload'}
              </th>
            </tr>
          </thead>
          <tbody>
            {docs.map((doc, i) => {
              const isUploaded = uploadedDocs[doc.type] || doc.uploaded;
              const chosenFile = files[doc.type];
              return (
                <tr
                  key={i}
                  className="border-b border-slate-400/10 hover:bg-slate-400/5"
                >
                  <td className="px-4 py-3 text-[13px] text-slate-400 text-center">
                    {i + 1}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-slate-300">
                    {doc.type}
                    {doc.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center align-middle">
                    {locked ? (
                      isUploaded ? (
                        <Button
                          label="View"
                          icon="eye"
                          type="button"
                          variant="primary"
                          size="small"
                        />
                      ) : (
                        <span className="text-slate-500 text-xs">
                          Not uploaded
                        </span>
                      )
                    ) : (
                      <label className="cursor-pointer inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-[12px] font-semibold px-4 py-1.5 rounded">
                        <span className="material-symbols-rounded text-[14px]">
                          {chosenFile ? 'check' : 'add'}
                        </span>
                        {chosenFile ? chosenFile.name : 'Choose File'}
                        <input
                          type="file"
                          accept=".pdf,.jpg"
                          className="hidden"
                          onChange={e =>
                            handleFileChange(
                              doc.type,
                              e.target.files?.[0] ?? null
                            )
                          }
                        />
                      </label>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center align-middle">
                    {locked ? (
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${
                          isUploaded
                            ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10'
                            : 'text-red-400 border-red-400/30 bg-red-500/10'
                        }`}
                      >
                        <span className="material-symbols-rounded text-[13px]">
                          {isUploaded ? 'check_circle' : 'cancel'}
                        </span>
                        {isUploaded ? 'Uploaded & Locked' : 'Missing'}
                      </span>
                    ) : (
                      <Button
                        label="Upload"
                        icon="upload"
                        type="button"
                        variant={isUploaded ? 'success' : 'outlined'}
                        size="small"
                        onClick={() => handleUpload(doc.type)}
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </FormCard>
  );
}

// ─── Step 3: Location Preferences ────────────────────────────────────────────
function StepLocationPreference({
  district,
  setDistrict,
  sourceDivisions,
  setSourceDivisions,
  targetDivisions,
  setTargetDivisions,
}: {
  district: string | null;
  setDistrict: (v: string | null) => void;
  sourceDivisions: { id: string; label: string }[];
  setSourceDivisions: (v: { id: string; label: string }[]) => void;
  targetDivisions: { id: string; label: string }[];
  setTargetDivisions: (v: { id: string; label: string }[]) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <FormCard
        title="Document Verification Center Preference"
        icon="location_on"
      >
        <FormGrid columns={3}>
          <DropDownList
            id="district-pref"
            label="District"
            required
            data={DISTRICTS}
            textField="label"
            valueField="value"
            value={district}
            defaultOptionText="Select District"
            onChange={v => setDistrict(v as string | null)}
          />
        </FormGrid>
      </FormCard>

      <FormCard title="Joining Location Preference" icon="swap_horiz">
        <p className="text-xs text-slate-500 mb-3">
          Select divisions and arrange them in your preferred priority order.
        </p>
        <PickList
          source={sourceDivisions}
          target={targetDivisions}
          sourceHeader="Available Divisions"
          targetHeader="Selected Divisions (Priority Order)"
          dataKey="id"
          onChange={e => {
            setSourceDivisions(e.source);
            setTargetDivisions(e.target);
          }}
        />
      </FormCard>
    </div>
  );
}

// ─── Step 4: Declaration & Lock ───────────────────────────────────────────────
function StepDeclaration({
  declaration,
  setDeclaration,
  locked,
  otp,
  setOtp,
  showOtpBox,
  setShowOtpBox,
  onLock,
}: {
  declaration: boolean;
  setDeclaration: (v: boolean) => void;
  locked: boolean;
  otp: string;
  setOtp: (v: string) => void;
  showOtpBox: boolean;
  setShowOtpBox: (v: boolean) => void;
  onLock: () => void;
}) {
  const c = MY_CANDIDATE;

  if (locked) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
        <span className="material-symbols-rounded text-emerald-500 text-[72px] drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]">
          lock
        </span>
        <h2 className="text-2xl font-bold text-emerald-500">
          Documents Locked Successfully
        </h2>
        <p className="text-slate-400 text-sm max-w-md">
          Your documents have been locked and submitted. No further changes can
          be made. Thank you for completing your document upload process.
        </p>
      </div>
    );
  }

  return (
    <FormCard title="Declaration & Lock Profile" icon="verified_user">
      <div className="flex flex-col gap-6">
        {/* Declaration checkbox */}
        <div className="bg-slate-400/5 border border-slate-400/15 rounded-xl p-4 flex items-start gap-3">
          <Checkbox
            id="declaration-check"
            checked={declaration}
            onChange={setDeclaration}
          />
          <label
            htmlFor="declaration-check"
            className="text-[13px] text-slate-400 leading-relaxed cursor-pointer mt-0.5"
          >
            I hereby declare that all the information provided above is true and
            correct to the best of my knowledge. I understand that any false
            information may lead to the rejection of my application or
            cancellation of my candidature at any stage of the recruitment
            process.
            <span className="text-red-500 ml-1">*</span>
          </label>
        </div>

        {/* OTP section */}
        {!showOtpBox ? (
          <Button
            label="Request OTP & Lock Profile"
            icon="lock"
            type="button"
            variant="primary"
            disabled={!declaration}
            onClick={() => {
              if (!declaration) {
                ToastService.error('Please accept the declaration first.');
                return;
              }
              setShowOtpBox(true);
              ToastService.success(
                `OTP sent to ****${c.mobile.slice(-4)}. Enter it to confirm.`
              );
            }}
          />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3 text-[13px] text-amber-400 flex items-center gap-2">
              <span className="material-symbols-rounded text-[16px]">info</span>
              An OTP has been sent to <strong>****{c.mobile.slice(-4)}</strong>.
              This action is <strong>irreversible</strong>.
            </div>
            <div className="flex flex-col gap-1.5 max-w-xs">
              <label className="text-xs text-slate-400 font-medium">
                Enter 6-digit OTP
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •"
                className="w-full px-4 py-3 bg-slate-400/10 border border-slate-400/20 rounded-xl text-white text-xl tracking-[8px] text-center outline-none focus:border-violet-500 transition-colors font-mono"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button
                label="Confirm & Lock"
                icon="lock"
                type="button"
                variant="primary"
                disabled={otp.length !== 6}
                onClick={onLock}
              />
              <Button
                label="Cancel"
                type="button"
                variant="outlined"
                onClick={() => {
                  setShowOtpBox(false);
                  setOtp('');
                }}
              />
            </div>
          </div>
        )}
      </div>
    </FormCard>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DocumentUploadPage() {
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, boolean>>({});
  const [district, setDistrict] = useState<string | null>(null);
  const [sourceDivisions, setSourceDivisions] = useState(ALL_DIVISIONS);
  const [targetDivisions, setTargetDivisions] = useState<
    { id: string; label: string }[]
  >([]);
  const [declaration, setDeclaration] = useState(false);
  const [locked, setLocked] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtpBox, setShowOtpBox] = useState(false);

  const handleLock = () => {
    if (otp.length !== 6) return;
    setLocked(true);
    setShowOtpBox(false);
    ToastService.success('Profile locked successfully. Documents submitted.');
  };

  const steps = [
    {
      label: 'Candidate Details',
      icon: 'id-card',
      content: <StepCandidateDetails />,
    },
    {
      label: 'Document Upload',
      icon: 'upload',
      content: (
        <StepDocumentUpload
          files={files}
          setFiles={setFiles}
          uploadedDocs={uploadedDocs}
          setUploadedDocs={setUploadedDocs}
          locked={locked}
        />
      ),
    },
    {
      label: 'Location Preference',
      icon: 'map-marker',
      content: (
        <StepLocationPreference
          district={district}
          setDistrict={setDistrict}
          sourceDivisions={sourceDivisions}
          setSourceDivisions={setSourceDivisions}
          targetDivisions={targetDivisions}
          setTargetDivisions={setTargetDivisions}
        />
      ),
    },
    {
      label: 'Declaration & Lock',
      icon: 'lock',
      content: (
        <StepDeclaration
          declaration={declaration}
          setDeclaration={setDeclaration}
          locked={locked}
          otp={otp}
          setOtp={setOtp}
          showOtpBox={showOtpBox}
          setShowOtpBox={setShowOtpBox}
          onLock={handleLock}
        />
      ),
    },
  ];

  return (
    <FormPage
      title="Document Upload"
      breadcrumbs={[
        { label: 'Candidate', to: '/recruitment-management/candidate' },
        { label: 'Document Upload' },
      ]}
    >
      <FormWizard
        steps={steps}
        onComplete={handleLock}
        hideReset={locked}
        customActions={(_activeIndex: number, isLastStep: boolean) =>
          isLastStep && locked ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-500 text-[13px] font-semibold">
              <span className="material-symbols-rounded text-[16px]">lock</span>
              Profile Locked
            </span>
          ) : null
        }
      />
    </FormPage>
  );
}
