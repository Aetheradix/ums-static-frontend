import { ApiService } from 'services';
import { quickOnboardingUrl } from './urls';

export async function createQuickOnboarding(
  form: EmployeeManagement.QuickOnboardingForm
) {
  const { error, data } = await ApiService.post<number>(
    quickOnboardingUrl,
    form
  );

  return !error ? data : undefined;
}
