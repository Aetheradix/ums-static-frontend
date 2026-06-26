import { ApiService } from 'services';

const LANGUAGE_PREFERENCE_URL = `master/language-preference`;

export function getLanguagePreferences() {
  //   return ApiService.getList<Master.Other.LanguagePreferenceItem>(
  //     LANGUAGE_PREFERENCE_URL
  //   );
  ApiService;
  LANGUAGE_PREFERENCE_URL;
  return Promise.resolve([
    { id: 1, name: 'English', text: 'English', isActive: true },
    { id: 2, name: 'Hindi', text: 'Hindi', isActive: true },
    { id: 3, name: 'Regional', text: 'Regional', isActive: true },
  ] as unknown as Master.Other.LanguagePreferenceItem[]);
}
