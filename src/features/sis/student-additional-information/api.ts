import { ApiService } from 'services';

const SIS_API_ROOT = `student`;

export function getStudentAdditionalInformations() {
  return ApiService.getList<SIS.StudentAdditionalInformationItem>(SIS_API_ROOT);
}

export async function getStudentAdditionalInformation(id: number) {
  const { data } = await ApiService.get<SIS.StudentAdditionalInformationItem>(
    `${SIS_API_ROOT}/${id}`
  );
  return data;
}

export async function createStudentAdditionalInformation(
  form: SIS.StudentAdditionalInformationForm
) {
  const formData = new FormData();

  formData.append('StudentId', form.studentId.toString());
  formData.append('StudentAcademicId', form.studentAcademicId.toString());
  formData.append('EmergencyContactName', form.emergencyContactName);
  formData.append('EmergencyContact', form.emergencyContact);
  formData.append('EmergencyRelation', form.emergencyRelation);
  formData.append('EmailNotification', form.emailNotification.toString());
  formData.append('SMSNotification', form.smsNotification.toString());
  formData.append('PushNotification', form.pushNotification.toString());

  if (form.languagePreferance) {
    formData.append('LanguagePreferance', form.languagePreferance);
  }

  if (form.profilePhoto instanceof File) {
    formData.append('ProfilePhoto', form.profilePhoto);
  }

  const { error, data } =
    await ApiService.postFormData<SIS.StudentAdditionalInformationItem>(
      SIS_API_ROOT,
      formData
    );

  return !error ? data : undefined;
}

export async function updateStudentAdditionalInformation(
  id: number,
  form: SIS.StudentAdditionalInformationForm
): Promise<boolean> {
  const formData = new FormData();

  formData.append('StudentId', form.studentId.toString());
  formData.append('StudentAcademicId', form.studentAcademicId.toString());
  formData.append('EmergencyContactName', form.emergencyContactName);
  formData.append('EmergencyContact', form.emergencyContact);
  formData.append('EmergencyRelation', form.emergencyRelation);
  formData.append('EmailNotification', form.emailNotification.toString());
  formData.append('SMSNotification', form.smsNotification.toString());
  formData.append('PushNotification', form.pushNotification.toString());

  if (form.languagePreferance) {
    formData.append('LanguagePreferance', form.languagePreferance);
  }

  if (form.profilePhoto instanceof File) {
    formData.append('ProfilePhoto', form.profilePhoto);
  }

  const result = await ApiService.putFormData(
    `${SIS_API_ROOT}/${id}`,
    formData
  );

  return !result.error;
}
