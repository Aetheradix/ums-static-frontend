import { useState } from 'react';
import {
  FormCard,
  FormPage,
  FormPopup,
  Stepper,
  FormGrid,
} from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Icon } from 'shared/components/Icon/Icon';
import type { CertificateType } from '../../types';
import { useLifecycleStore } from '../../store/useLifecycleStore';
import { listStudents } from '../../data';
import {
  CERTIFICATE_CATALOG,
  EXTERNAL_PORTALS,
} from '../../data/domain/constants';
import { generateCertificate } from '../../pdf';
import { formatDate, formatINR } from '../../utils';
import { ToastService } from 'services';
import { studentLifecycleUrls, studentServicesUrl } from '../../urls';

const STATUS_STEPS = [
  { label: 'Submitted', description: 'Application registered' },
  { label: 'Under Review', description: 'Pending registrar approval' },
  { label: 'Ready for Collection', description: 'Available at counters' },
];

function statusIndex(status: string): number {
  if (status === 'Issued') return 2;
  const labels = STATUS_STEPS.map(s => s.label);
  const idx = labels.indexOf(status);
  return idx === -1 ? 0 : idx;
}

export default function StudentServicesPage() {
  const currentStudentNo = useLifecycleStore(s => s.currentStudentNo);
  const certificates = useLifecycleStore(s => s.certificates);
  const addCertificate = useLifecycleStore(s => s.addCertificate);

  const students = listStudents();
  const student = students.find(s => s.enrollmentNo === currentStudentNo);

  const [activeType, setActiveType] = useState<CertificateType | null>(null);
  const [purpose, setPurpose] = useState('');
  const [copies, setCopies] = useState('1');
  const [delivery, setDelivery] = useState<'Collect at Counter' | 'Speed Post'>(
    'Collect at Counter'
  );

  if (!student) {
    return (
      <FormPage
        title="Services & Certificates"
        description="No active student profile found."
      >
        <FormCard>
          <div className="p-8 text-center text-red-500">
            Error: Student profile not loaded.
          </div>
        </FormCard>
      </FormPage>
    );
  }

  const openApply = (type: CertificateType) => {
    setActiveType(type);
    setPurpose('');
    setCopies('1');
    setDelivery('Collect at Counter');
  };

  const submitApplication = () => {
    if (!activeType) return;
    addCertificate({
      type: activeType,
      copies: Number(copies),
      purpose: purpose || 'Not specified',
      delivery,
    });
    ToastService.success(
      `Your request for ${activeType} certificate has been registered.`
    );
    setActiveType(null);
  };

  const breadcrumbs = [
    { label: 'Home', to: '/home' },
    { label: 'Student Services', to: studentServicesUrl },
    { label: 'Student Lifecycle', to: studentLifecycleUrls.student.root },
    { label: 'Services & Certificates' },
  ];

  const headerAction = (
    <a
      href={EXTERNAL_PORTALS.cbaCertificates.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg shadow-sm hover:bg-primary-hover transition-colors"
    >
      <Icon name="open-in-new" className="text-xs" />
      <span>Official CBA Portal</span>
    </a>
  );

  return (
    <FormPage
      title="Services & Certificates"
      description="Apply for bonafide, transcript, migration, and other certificates via Counter-Base Applications (CBA) system."
      breadcrumbs={breadcrumbs}
      headerAction={headerAction}
    >
      <div className="flex flex-col gap-6 w-full">
        {/* Apply Cards Section */}
        <FormCard className="p-5">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <Icon name="verified" className="text-primary text-xl" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200">
              Apply for a Certificate
            </h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(
              Object.entries(CERTIFICATE_CATALOG) as [
                CertificateType,
                (typeof CERTIFICATE_CATALOG)[CertificateType],
              ][]
            ).map(([type, meta]) => (
              <div
                key={type}
                className="flex flex-col p-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/60 rounded-xl hover:border-slate-300 dark:border-slate-700 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="description" className="text-primary text-md" />
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    {type}
                  </h4>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal flex-1">
                  {meta.description}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/40 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400">
                    {meta.fee ? formatINR(meta.fee) : 'Free'} ·{' '}
                    {meta.processingDays}d
                  </span>
                  <button
                    onClick={() => openApply(type)}
                    className="px-2.5 py-1.5 bg-primary text-white text-[10px] font-bold rounded-lg hover:bg-primary-hover transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </FormCard>

        {/* My Requests Trackers */}
        <FormCard>
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <Icon name="list-alt" className="text-primary text-xl" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200">
              My Requests & Trackers
            </h3>
          </div>

          {certificates.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">
              No certificate requests submitted yet.
            </p>
          ) : (
            <ul className="flex flex-col gap-5 divide-y divide-slate-100 dark:divide-slate-800/50">
              {certificates.map((req, idx) => {
                const isReady =
                  req.status === 'Ready for Collection' ||
                  req.status === 'Issued';
                return (
                  <li
                    key={req.id}
                    className={`flex flex-col gap-4 ${idx > 0 ? 'pt-5' : ''}`}
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                            {req.type} Certificate
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              isReady
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 border-emerald-200'
                                : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 border-blue-200'
                            }`}
                          >
                            {req.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium mt-1">
                          {req.copies} copies · {req.delivery} · Requested on{' '}
                          {formatDate(req.requestedOn)}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                          <span className="font-semibold text-slate-400 text-[10px] uppercase block mb-0.5">
                            Purpose
                          </span>
                          {req.purpose}
                        </p>
                      </div>

                      {isReady && (
                        <button
                          onClick={() =>
                            generateCertificate(student, req.type, {
                              id: req.id,
                              purpose: req.purpose,
                              copies: req.copies,
                            })
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-hover shadow-sm transition-colors shrink-0"
                        >
                          <Icon name="download" className="text-xs" />
                          <span>Download Certificate</span>
                        </button>
                      )}
                    </div>

                    {/* Progress tracking timeline */}
                    <div className="max-w-xl pl-2 mt-2">
                      <Stepper
                        steps={STATUS_STEPS}
                        activeStep={statusIndex(req.status)}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </FormCard>
      </div>

      {/* Application Form Dialog */}
      <FormPopup
        visible={activeType !== null}
        onHide={() => setActiveType(null)}
        title={`Apply — ${activeType} Certificate`}
        subtitle={activeType ? CERTIFICATE_CATALOG[activeType].description : ''}
        footer={
          <div className="flex justify-end gap-2 w-full">
            <button
              onClick={() => setActiveType(null)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-50 dark:bg-slate-950 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={submitApplication}
              className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-hover transition-colors"
            >
              Submit Application
            </button>
          </div>
        }
      >
        {activeType && (
          <div className="flex flex-col gap-4">
            <FormGrid columns={1}>
              <TextBox
                label="Purpose *"
                value={purpose}
                onChange={val => setPurpose(val ?? '')}
                placeholder="Why do you need this certificate? e.g. Passport application"
              />
            </FormGrid>

            <FormGrid columns={2}>
              <DropDownList
                label="Number of Copies"
                value={copies}
                data={[1, 2, 3, 4, 5].map(n => ({
                  text: String(n),
                  value: String(n),
                }))}
                textField="text"
                valueField="value"
                onChange={val => setCopies(val as string)}
              />

              <DropDownList
                label="Delivery Mode"
                value={delivery}
                data={[
                  { text: 'Collect at Counter', value: 'Collect at Counter' },
                  { text: 'Speed Post', value: 'Speed Post' },
                ]}
                textField="text"
                valueField="value"
                onChange={val => setDelivery(val as any)}
              />
            </FormGrid>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/40/60 border border-blue-100 dark:border-blue-900/30 rounded-lg flex flex-col gap-1 text-[10px] text-slate-500 dark:text-slate-400">
              <div className="flex justify-between font-semibold">
                <span>Application Fee:</span>
                <span className="text-slate-700 dark:text-slate-300">
                  {CERTIFICATE_CATALOG[activeType].fee
                    ? formatINR(CERTIFICATE_CATALOG[activeType].fee)
                    : 'Free'}
                </span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Processing Timeline:</span>
                <span className="text-slate-700 dark:text-slate-300">
                  ~{CERTIFICATE_CATALOG[activeType].processingDays} Working Days
                </span>
              </div>
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
