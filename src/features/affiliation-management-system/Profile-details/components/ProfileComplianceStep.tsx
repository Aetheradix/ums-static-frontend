import { useWatch } from 'react-hook-form';
import type { Control, FormState, Path } from 'react-hook-form';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid } from 'shared/new-components';
import type { ProfileDetailsFormData } from './form.hook';

interface ProfileComplianceStepProps {
  register: (name: Path<ProfileDetailsFormData>) => {
    control: Control<ProfileDetailsFormData>;
    name: Path<ProfileDetailsFormData>;
  };
  control: Control<ProfileDetailsFormData>;
  formState: FormState<ProfileDetailsFormData>;
}

export default function ProfileComplianceStep({
  register,
  control,
  formState,
}: ProfileComplianceStepProps) {
  const yesNoOptions = [
    { id: 'yes', name: 'Yes' },
    { id: 'no', name: 'No' },
  ];

  const isInternetAvailable = useWatch({
    control,
    name: 'internetAvailable',
  });

  const isStatutoryNormsAdhered = useWatch({
    control,
    name: 'statutoryNormsAdhered',
  });

  const isLabAvailableAsPerNorms = useWatch({
    control,
    name: 'labAvailableAsPerNorms',
  });

  const isResidentialQuartersAvailable = useWatch({
    control,
    name: 'residentialQuartersAvailable',
  });

  const isMpGovtPermission = useWatch({
    control,
    name: 'mpGovtPermission',
  });

  const isOtherMajorInstrumentsAvailable = useWatch({
    control,
    name: 'otherMajorInstrumentsAvailable',
  });

  const isObjectionToInfoPublic = useWatch({
    control,
    name: 'objectionToInfoPublic',
  });

  return (
    <>
      <div className="mb-4 text-blue-700 font-semibold border-l-2 border-blue-500 pl-2">
        Sections 8-10: Budget, Compliance & Fees
      </div>

      <FormCard title="SECTION 8: BUDGET & BOOKS OF ACCOUNT" icon="money-bill">
        <div className="flex flex-col gap-4">
          <TextBox
            label="Source of funding of the society"
            placeholder="Enter Details"
            {...register('sourceOfFunding')}
            errorMessage={formState.errors.sourceOfFunding?.message as string}
          />
          <TextBox
            label="Annual projected income & expenditure for the course"
            placeholder="Enter Details"
            {...register('annualProjectedIncome')}
            errorMessage={
              formState.errors.annualProjectedIncome?.message as string
            }
          />
          <FormGrid columns={2}>
            <DropDownList
              label="Regular books of accounts maintained?"
              name="regularBooksMaintained"
              control={control}
              placeholder="Select"
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={
                formState.errors.regularBooksMaintained?.message as string
              }
            />
            <DropDownList
              label="Accounts audited regularly by CA?"
              name="accountsAudited"
              control={control}
              placeholder="Select"
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={formState.errors.accountsAudited?.message as string}
            />
          </FormGrid>
        </div>
      </FormCard>

      <FormCard title="SECTION 9: STATUTORY COMPLIANCE" icon="check-circle">
        <div className="flex flex-col gap-4">
          <TextBox
            label="Conditions laid down by statutory body & compliance status (AICTE/NCTE/BCI/MCI etc.)"
            placeholder="Enter Details"
            {...register('statutoryConditions')}
            errorMessage={
              formState.errors.statutoryConditions?.message as string
            }
          />
          <FormGrid columns={2}>
            <TextBox
              label="Session / year up to which permission granted"
              placeholder="Enter Year/Session"
              {...register('sessionPermissionGranted')}
              errorMessage={
                formState.errors.sessionPermissionGranted?.message as string
              }
            />
            <DropDownList
              label="MP Govt. Permission Issued? (Dept. Higher/Technical/Medical Education)"
              name="mpGovtPermission"
              control={control}
              placeholder="Select"
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={
                formState.errors.mpGovtPermission?.message as string
              }
            />
          </FormGrid>
          {isMpGovtPermission === 'yes' && (
            <TextArea
              label="Conditions imposed by MP Govt. & compliance status"
              placeholder="Enter Details"
              rows={3}
              {...register('mpGovtConditions')}
              errorMessage={
                formState.errors.mpGovtConditions?.message as string
              }
            />
          )}
        </div>
      </FormCard>

      <FormCard
        title="SECTION 10: UNIVERSITY REQUIREMENTS & COMPLIANCE"
        icon="building"
      >
        <div className="flex flex-col gap-4">
          <FormGrid columns={1}>
            <DropDownList
              label="Statute 28 fulfilled?"
              name="statute28Fulfilled"
              control={control}
              placeholder="Select"
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={
                formState.errors.statute28Fulfilled?.message as string
              }
            />
          </FormGrid>
          <TextBox
            label="Fee Deposits to University (Affiliation, Renewal, Sports, Cultural, Exam & Other Fees)"
            placeholder="Enter Details"
            {...register('endowmentFundDetails')}
            errorMessage={
              formState.errors.endowmentFundDetails?.message as string
            }
          />
          <TextBox
            label="Deposit in the Endowment Found?"
            placeholder="Enter Details"
            {...register('endowmentFundDeposit')}
            errorMessage={
              formState.errors.endowmentFundDeposit?.message as string
            }
          />
          <FormGrid columns={3}>
            <DropDownList
              label="Statutory norms adhered?"
              name="statutoryNormsAdhered"
              control={control}
              placeholder="Select"
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={
                formState.errors.statutoryNormsAdhered?.message as string
              }
            />
            <DropDownList
              label="Whether College has Adhered to Fee Structure?"
              name="feeStructureAdhered"
              control={control}
              placeholder="Select"
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={
                formState.errors.feeStructureAdhered?.message as string
              }
            />
            <DropDownList
              label="Reservation norms followed?"
              name="reservationNormsFollowed"
              control={control}
              placeholder="Select"
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={
                formState.errors.reservationNormsFollowed?.message as string
              }
            />
          </FormGrid>
          {isStatutoryNormsAdhered === 'yes' && (
            <TextBox
              label="Statutory Norms Remarks"
              placeholder="Enter Details"
              {...register('statutoryNormsRemarks')}
              errorMessage={
                formState.errors.statutoryNormsRemarks?.message as string
              }
            />
          )}
        </div>
      </FormCard>
      <div className="mb-4 mt-6 text-blue-700 font-semibold border-l-2 border-blue-500 pl-2">
        Sections 11-13: Equipment, Computers & Misc
      </div>

      <FormCard title="SECTION 11: COMPUTERS" icon="desktop">
        <div className="flex flex-col gap-4">
          <FormGrid columns={4}>
            <TextBox
              label="Latest Computers"
              placeholder="Count/Details"
              {...register('latestComputers')}
              errorMessage={formState.errors.latestComputers?.message as string}
            />
            <TextBox
              label="Old Computers"
              placeholder="Count/Details"
              {...register('oldComputers')}
              errorMessage={formState.errors.oldComputers?.message as string}
            />
            <TextBox
              label="Printers"
              placeholder="Count/Details"
              {...register('printers')}
              errorMessage={formState.errors.printers?.message as string}
            />
            <TextBox
              label="Scanners"
              placeholder="Count/Details"
              {...register('scanners')}
              errorMessage={formState.errors.scanners?.message as string}
            />
          </FormGrid>
          <FormGrid columns={isInternetAvailable === 'yes' ? 2 : 1}>
            <DropDownList
              label="Internet Available?"
              name="internetAvailable"
              control={control}
              placeholder="Select"
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={
                formState.errors.internetAvailable?.message as string
              }
            />
            {isInternetAvailable === 'yes' && (
              <TextBox
                label="Internet Connection Type"
                placeholder="Details"
                {...register('internetConnectionType')}
                errorMessage={
                  formState.errors.internetConnectionType?.message as string
                }
              />
            )}
          </FormGrid>
          <FormGrid columns={4}>
            <TextBox
              label="Computer Trained Staff"
              placeholder="Details"
              {...register('computerTrainedStaff')}
              errorMessage={
                formState.errors.computerTrainedStaff?.message as string
              }
            />
            <div className="col-span-2">
              <TextBox
                label="Computer : Student Ratio"
                placeholder="Ratio"
                {...register('computerStudentRatio')}
                errorMessage={
                  formState.errors.computerStudentRatio?.message as string
                }
              />
            </div>
            <TextBox
              label="Working Computers"
              placeholder="Count"
              {...register('workingComputers')}
              errorMessage={
                formState.errors.workingComputers?.message as string
              }
            />
          </FormGrid>
          <TextBox
            label="Down Time"
            placeholder="Details"
            {...register('downTime')}
            errorMessage={formState.errors.downTime?.message as string}
          />
          <TextBox
            label="Licensed Software Available"
            placeholder="Details"
            {...register('licensedSoftwareAvailable')}
            errorMessage={
              formState.errors.licensedSoftwareAvailable?.message as string
            }
          />
          <TextBox
            label="Packages in use"
            placeholder="Details"
            {...register('packagesInUse')}
            errorMessage={formState.errors.packagesInUse?.message as string}
          />
          <TextBox
            label="Future Plans (Computers)"
            placeholder="Details"
            {...register('futurePlansComputers')}
            errorMessage={
              formState.errors.futurePlansComputers?.message as string
            }
          />
        </div>
      </FormCard>

      <FormCard title="SECTION 12: EQUIPMENT" icon="cog">
        <div className="flex flex-col gap-4">
          <FormGrid columns={isLabAvailableAsPerNorms === 'yes' ? 2 : 1}>
            <DropDownList
              label="Lab Available as per Norms?"
              name="labAvailableAsPerNorms"
              control={control}
              placeholder="Select"
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={
                formState.errors.labAvailableAsPerNorms?.message as string
              }
            />
            {isLabAvailableAsPerNorms === 'yes' && (
              <TextBox
                label="Lab Floor Space"
                placeholder="Details"
                {...register('equipmentLabFloorSpace')}
                errorMessage={
                  formState.errors.equipmentLabFloorSpace?.message as string
                }
              />
            )}
          </FormGrid>
          {isLabAvailableAsPerNorms === 'yes' && (
            <>
              <TextBox
                label="Number & Description of Equipment"
                placeholder="Details"
                {...register('equipmentDescription')}
                errorMessage={
                  formState.errors.equipmentDescription?.message as string
                }
              />
              <TextBox
                label="Workshop Details"
                placeholder="Details"
                {...register('equipmentWorkshopDetails')}
                errorMessage={
                  formState.errors.equipmentWorkshopDetails?.message as string
                }
              />
              <DropDownList
                label="Other Major Instruments Available?"
                name="otherMajorInstrumentsAvailable"
                control={control}
                placeholder="Select"
                data={yesNoOptions}
                textField="name"
                valueField="id"
                errorMessage={
                  formState.errors.otherMajorInstrumentsAvailable
                    ?.message as string
                }
              />
              {isOtherMajorInstrumentsAvailable === 'yes' && (
                <TextBox
                  label="Major Instrument Details"
                  placeholder="Details"
                  {...register('majorInstrumentsDetails')}
                  errorMessage={
                    formState.errors.majorInstrumentsDetails?.message as string
                  }
                />
              )}
            </>
          )}
          <FormGrid columns={4}>
            <DropDownList
              label="Hospital Availability?"
              name="equipmentHospitalAvailability"
              control={control}
              placeholder="Select"
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={
                formState.errors.equipmentHospitalAvailability
                  ?.message as string
              }
            />
            <DropDownList
              label="First Aid Facility?"
              name="equipmentFirstAidFacility"
              control={control}
              placeholder="Select"
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={
                formState.errors.equipmentFirstAidFacility?.message as string
              }
            />
            <DropDownList
              label="Fire Fighting Facility?"
              name="fireFightingFacility"
              control={control}
              placeholder="Select"
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={
                formState.errors.fireFightingFacility?.message as string
              }
            />
            <div />
          </FormGrid>
        </div>
      </FormCard>

      <FormCard title="SECTION 13: MISCELLANEOUS" icon="folder-open">
        <div className="flex flex-col gap-4">
          <DropDownList
            label="Residential Quarters Available / Provisioned?"
            name="residentialQuartersAvailable"
            control={control}
            placeholder="Select"
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={
              formState.errors.residentialQuartersAvailable?.message as string
            }
          />
          {isResidentialQuartersAvailable === 'yes' && (
            <TextBox
              label="Residential Quarters Details"
              placeholder="Details"
              {...register('residentialQuartersDetails')}
              errorMessage={
                formState.errors.residentialQuartersDetails?.message as string
              }
            />
          )}
          <DropDownList
            label="Any Objection to Making Submitted Info Public?"
            name="objectionToInfoPublic"
            control={control}
            placeholder="Select"
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={
              formState.errors.objectionToInfoPublic?.message as string
            }
          />
          {isObjectionToInfoPublic === 'yes' && (
            <TextBox
              label="Transparency Remark"
              placeholder="Remarks"
              {...register('transparencyRemarks')}
              errorMessage={
                formState.errors.transparencyRemarks?.message as string
              }
            />
          )}
        </div>
      </FormCard>
    </>
  );
}
