import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { vfUrls } from '../urls';

const OPTIONS = [
  {
    icon: 'user-plus',
    title: 'New Registration',
    description:
      'Applying to DAVV as visiting faculty for the first time. Fill the full registration form with your personal details, qualification, teaching assignment and documents.',
    action: 'Start New Registration',
    to: vfUrls.public.newRegistration,
    tone: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300',
  },
  {
    icon: 'replay',
    title: 'Re-apply',
    description:
      'Already registered with DAVV? Enter your PAN and mobile number — your details are filled in automatically. Apply for another subject or another UTD Department.',
    action: 'Re-apply',
    to: vfUrls.public.reapply,
    tone: 'bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300',
  },
];

/** First screen of the public forum — choose a new registration or re-apply. */
export default function RegistrationStart() {
  const navigate = useNavigate();
  return (
    <FormPage
      title="Visiting Faculty Registration — DAVV"
      description="Choose how you want to apply. A registered visiting faculty keeps the same Unique ID in every department."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {OPTIONS.map(o => (
          <FormCard key={o.title}>
            <div className="flex h-full flex-col gap-4 p-2">
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${o.tone}`}
              >
                <i className={`pi pi-${o.icon} text-2xl`} />
              </span>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {o.title}
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {o.description}
                </p>
              </div>
              <div>
                <Button
                  label={o.action}
                  icon="arrow-right"
                  variant="primary"
                  onClick={() => navigate(o.to)}
                />
              </div>
            </div>
          </FormCard>
        ))}
      </div>
    </FormPage>
  );
}
