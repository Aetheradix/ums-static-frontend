import { ApiService } from 'services';
import { fullOnboardingUrl } from './urls';

export async function createFullOnboarding(
  form: EmployeeManagement.FullOnboardingForm
) {
  const { error, data } = await ApiService.post<number>(
    fullOnboardingUrl,
    form
  );

  return !error ? data : undefined;
}
