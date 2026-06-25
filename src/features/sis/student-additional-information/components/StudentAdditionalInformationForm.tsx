import { ActionButtons } from 'features/components';
import SelectLanguagePreference from 'features/components/SelectLanguagePreference';
import SelectRelationshipTypes from 'features/components/SelectRelationshipTypes';
import { useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import { FileUpload, Switch, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid } from 'shared/new-components';
import { getPhotoUrl } from 'shared/utils/photoUrl';
// import CollegeInformationSection from './CollegeInformationSection';
import { useStudentAdditionalInformationForm } from './form.hook';

interface Props {
  onSubmit: (data: SIS.StudentAdditionalInformationForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<SIS.StudentAdditionalInformationForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function StudentAdditionalInformationForm(props: Props) {
  const { control, handleSubmit, reset } = useStudentAdditionalInformationForm(
    props.onSubmit,
    props.fetchData
  );

  const profilePhotoUrl = useWatch({ control, name: 'profilePhotoUrl' });

  useEffect(() => {
    if (props.fetchData && typeof props.fetchData !== 'function') {
      reset(props.fetchData);
    }
  }, [props.fetchData, reset]);

  return (
    <form onSubmit={handleSubmit}>
      <FormCard>
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-9">
            <FormGrid>
              <TextBox
                label="Student Id"
                name="studentId"
                control={control}
                required
              />
              <TextBox
                label="Academic Id"
                name="studentAcademicId"
                control={control}
                required
              />
              <TextBox
                label="Emergency Contact Name"
                placeholder="Enter Name"
                name="emergencyContactName"
                control={control}
                required
              />
              <TextBox
                label="Emergency Contact Number"
                placeholder="Number"
                name="emergencyContact"
                control={control}
                required
              />
              <SelectRelationshipTypes
                label="Relation"
                name="emergencyRelation"
                control={control}
                required
              />
              <SelectLanguagePreference
                label="Language"
                name="languagePreferance"
                control={control}
                required={false}
              />

              <div className="col-span-full mt-6">
                <div className="flex flex-row flex-wrap items-center gap-x-12 gap-y-4 bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-bold text-slate-600">
                      Email Notification
                    </label>
                    <Switch
                      name="emailNotification"
                      control={control}
                      className="mb-0"
                    />
                  </div>

                  <div className="hidden md:block h-6 w-px bg-slate-200"></div>

                  <div className="flex items-center gap-4">
                    <label className="text-sm font-bold text-slate-600">
                      SMS Notification
                    </label>
                    <Switch
                      name="smsNotification"
                      control={control}
                      className="mb-0"
                    />
                  </div>

                  <div className="hidden md:block h-6 w-px bg-slate-200"></div>

                  <div className="flex items-center gap-4">
                    <label className="text-sm font-bold text-slate-600">
                      Push Notification
                    </label>
                    <Switch
                      name="pushNotification"
                      control={control}
                      className="mb-0"
                    />
                  </div>
                </div>
              </div>
            </FormGrid>
          </div>

          <div className="col-span-12 lg:col-span-3 flex flex-col items-center justify-center border-l-0 lg:border-l pl-0 lg:pl-8 py-4">
            <FileUpload
              label="Student Profile Photo"
              name="profilePhoto"
              control={control}
              preview={getPhotoUrl(profilePhotoUrl)}
              accept=".jpg,.jpeg,.png"
              uploadNote="*Only .jpg, .png (Max 100KB)"
              required={!props.isEditMode}
            />
          </div>
        </div>

        {/* <CollegeInformationSection control={control} setValue={setValue} /> */}
      </FormCard>

      <div className="mt-8">
        <ActionButtons
          update={props.isEditMode}
          isLoading={props.isSaving}
          onSave={handleSubmit}
          onReset={reset}
        />
      </div>
    </form>
  );
}
