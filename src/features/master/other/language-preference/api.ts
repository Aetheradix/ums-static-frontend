import { ApiService } from 'services';

const LANGUAGE_PREFERENCE_URL = `master/language-preference`;

export function getLanguagePreferences() {
  return ApiService.getList<Master.Other.LanguagePreferenceItem>(
    LANGUAGE_PREFERENCE_URL
  );
}
