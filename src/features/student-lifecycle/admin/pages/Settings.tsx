import { FormCard, FormPage, FormGrid } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Icon } from 'shared/components/Icon/Icon';
import { DEFAULT_MATRIX } from '../../data/domain';
import { useLifecycleStore } from '../../store/useLifecycleStore';
import { ToastService } from 'services';
import { studentLifecycleUrls, studentServicesUrl } from '../../urls';
import { toRoman } from '../../utils';

const FEATURES_LIST: {
  key: 'fees' | 'services' | 'notifications';
  label: string;
  desc: string;
}[] = [
  {
    key: 'fees',
    label: 'Fees & Online Payments',
    desc: 'Enables tuition bills and secure checkout portal.',
  },
  {
    key: 'services',
    label: 'Student Services Certificates',
    desc: 'Bonafide, migration, and transcript requests CBA system.',
  },
  {
    key: 'notifications',
    label: 'Broadcast Notifications Inbox',
    desc: 'Interactive announcement feed boards for students.',
  },
];

export default function AdminSettings() {
  const currentAdminRole = useLifecycleStore(s => s.currentAdminRole);

  const instituteName = useLifecycleStore(s => s.instituteName);
  const currentSemester = useLifecycleStore(s => s.currentSemester);
  const session = useLifecycleStore(s => s.session);
  const attendanceThreshold = useLifecycleStore(s => s.attendanceThreshold);
  const feeStructure = useLifecycleStore(s => s.feeStructure);
  const studentFeatures = useLifecycleStore(s => s.studentFeatures);

  const updateSettings = useLifecycleStore(s => s.updateSettings);
  const updateFeeStructure = useLifecycleStore(s => s.updateFeeStructure);
  const toggleStudentFeature = useLifecycleStore(s => s.toggleStudentFeature);

  const perms = DEFAULT_MATRIX[currentAdminRole] || [];
  const canEdit = perms.includes('settings.edit');

  if (!canEdit) {
    return (
      <FormPage
        title="Portal Settings"
        description="Access Denied. You do not have permissions to modify portal settings."
      >
        <FormCard>
          <div className="p-8 text-center text-red-500 flex flex-col items-center justify-center gap-3">
            <Icon name="block" className="text-5xl" />
            <p className="font-bold">Unauthorized Access</p>
          </div>
        </FormCard>
      </FormPage>
    );
  }

  const breadcrumbs = [
    { label: 'Home', to: '/home' },
    { label: 'Student Services', to: studentServicesUrl },
    { label: 'Student Lifecycle', to: studentLifecycleUrls.admin.root },
    { label: 'Portal Settings' },
  ];

  return (
    <FormPage
      title="Portal Configuration Settings"
      description="Configure global session terms, continuous assessment rules, fee models, and student features toggles."
      breadcrumbs={breadcrumbs}
    >
      <div className="grid gap-6 lg:grid-cols-2 w-full">
        {/* General settings */}
        <FormCard title="General Parameters">
          <div className="flex flex-col gap-4">
            <FormGrid columns={1}>
              <TextBox
                label="Institute Name"
                value={instituteName}
                onChange={val => {
                  updateSettings({ instituteName: val ?? '' });
                  ToastService.success('Institute name updated.');
                }}
              />
            </FormGrid>

            <FormGrid columns={2}>
              <DropDownList
                label="Current Semester"
                value={currentSemester}
                data={Array.from({ length: 8 }, (_, i) => i + 1).map(n => ({
                  text: `Semester ${toRoman(n)}`,
                  value: n,
                }))}
                textField="text"
                valueField="value"
                onChange={val => {
                  updateSettings({ currentSemester: Number(val) });
                  ToastService.success(
                    `Active semester set to Semester ${toRoman(Number(val))}.`
                  );
                }}
              />

              <TextBox
                label="Academic Session"
                value={session}
                onChange={val => {
                  updateSettings({ session: val ?? '' });
                  ToastService.success('Academic session updated.');
                }}
              />
            </FormGrid>

            <FormGrid columns={1}>
              <TextBox
                label="Attendance Detainment Threshold (%)"
                type="number"
                value={String(attendanceThreshold)}
                onChange={val => {
                  const num = Math.max(0, Math.min(100, Number(val) || 0));
                  updateSettings({ attendanceThreshold: num });
                  ToastService.success(`Detainment threshold set to ${num}%.`);
                }}
              />
            </FormGrid>
          </div>
        </FormCard>

        {/* Fees structure */}
        <FormCard title="Fee Structures Model">
          <div className="flex flex-col gap-4">
            <FormGrid columns={1}>
              <TextBox
                label="Tuition Fees per Semester (₹)"
                type="number"
                value={String(feeStructure.tuition)}
                onChange={val => {
                  updateFeeStructure({ tuition: Number(val) || 0 });
                  ToastService.success('Tuition fee rate updated.');
                }}
              />
            </FormGrid>

            <FormGrid columns={1}>
              <TextBox
                label="Examination Fees per Term (₹)"
                type="number"
                value={String(feeStructure.exam)}
                onChange={val => {
                  updateFeeStructure({ exam: Number(val) || 0 });
                  ToastService.success('Examination fee rate updated.');
                }}
              />
            </FormGrid>

            <FormGrid columns={1}>
              <TextBox
                label="Hostel Fees per Year (₹)"
                type="number"
                value={String(feeStructure.hostel)}
                onChange={val => {
                  updateFeeStructure({ hostel: Number(val) || 0 });
                  ToastService.success('Hostel fee rate updated.');
                }}
              />
            </FormGrid>
          </div>
        </FormCard>

        {/* Feature toggles */}
        <FormCard
          title="Student Portal Feature Controls"
          className="lg:col-span-2"
        >
          <ul className="flex flex-col gap-4">
            {FEATURES_LIST.map(f => {
              const isOn = studentFeatures[f.key];
              return (
                <li
                  key={f.key}
                  className="flex justify-between items-center bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800/50 hover:border-slate-300 dark:border-slate-700 transition-colors"
                >
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      {f.label}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                      {f.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      toggleStudentFeature(f.key);
                      ToastService.success(
                        `Module "${f.label}" ${!isOn ? 'enabled' : 'disabled'} in student dashboard.`
                      );
                    }}
                    className={`relative w-11 h-6 rounded-full transition-all duration-200 outline-none ${
                      isOn ? 'bg-primary' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white dark:bg-slate-900 rounded-full transition-all duration-200 ${
                        isOn ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </FormCard>
      </div>
    </FormPage>
  );
}
