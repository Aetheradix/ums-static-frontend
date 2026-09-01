import { useNavigate } from 'react-router-dom';
import { FormPage } from 'shared/new-components';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { AffiliationFeeMasterUrls } from '../urls';

export default function CreateCourseFee() {
  const navigate = useNavigate();

  const [hasExtraSeats, setHasExtraSeats] = useState(false);
  const [degreeLevel, setDegreeLevel] = useState<string>('');
  const [courseGroup, setCourseGroup] = useState<string>('');
  const [appType, setAppType] = useState<string>('');
  const [collegeType, setCollegeType] = useState<string>('All');
  const [gstApplicable, setGstApplicable] = useState<number | null>(18);

  return (
    <FormPage
      title="Create Course Affiliation Fee"
      description="Configure a new fee rule for regular or professional courses (Seat based)."
    >
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Section 1: Course Criteria */}
          <div className="col-span-full mb-2 mt-4 first:mt-0">
            <h5 className="border-b pb-2">Step 1: Course Details</h5>
          </div>

          <div className="">
            <label className="block mb-2 font-medium">
              Degree Level <span className="text-red-500">*</span>
            </label>
            <Dropdown
              value={degreeLevel}
              onChange={e => setDegreeLevel(e.value)}
              options={[
                { label: 'Graduate (UG)', value: 'UG' },
                { label: 'Post Graduate (PG)', value: 'PG' },
                { label: 'Diploma', value: 'DIP' },
              ]}
              className="w-full"
              placeholder="Select Degree Level"
            />
          </div>

          <div className="">
            <label className="block mb-2 font-medium">
              Course Group <span className="text-red-500">*</span>
            </label>
            <Dropdown
              value={courseGroup}
              onChange={e => setCourseGroup(e.value)}
              options={[
                { label: 'General', value: 'Gen' },
                { label: 'Professional', value: 'Prof' },
              ]}
              className="w-full"
              placeholder="Select Course Group"
            />
          </div>

          <div className="">
            <label className="block mb-2 font-medium">
              Application Type <span className="text-red-500">*</span>
            </label>
            <Dropdown
              value={appType}
              onChange={e => {
                setAppType(e.value);
              }}
              options={
                degreeLevel === 'DIP'
                  ? [
                      { label: 'Affiliation Fee', value: 'Affiliation' },
                      { label: 'Annual Continuity Fee', value: 'Cont' },
                    ]
                  : [
                      { label: '1st Year (New Affiliation)', value: '1' },
                      { label: '2nd Year (Renewal)', value: '2' },
                      { label: '3rd Year (Renewal)', value: '3' },
                      { label: '4th Year (Renewal)', value: '4' },
                      { label: '5th Year (Renewal)', value: '5' },
                      { label: 'Annual Continuity Fee', value: 'Cont' },
                    ]
              }
              className="w-full"
              placeholder="Select Application Type"
            />
          </div>

          <div className="">
            <label className="block mb-2 font-medium">
              College Type <span className="text-red-500">*</span>
            </label>
            <Dropdown
              value={collegeType}
              onChange={e => setCollegeType(e.value)}
              options={[
                { label: 'All (Govt & Private)', value: 'All' },
                { label: 'Govt. College Only', value: 'Govt' },
                { label: 'Private College Only', value: 'Private' },
              ]}
              className="w-full"
              placeholder="Select College Type"
            />
          </div>

          {/* Section 2: Fee Structure */}
          <div className="col-span-full mb-2 mt-4">
            <h5 className="border-b pb-2">Step 2: Fee Configuration</h5>
          </div>

          <div className="">
            <label className="block mb-2 font-medium">
              Base Fee Amount (₹) <span className="text-red-500">*</span>
            </label>
            <InputNumber
              className="w-full"
              placeholder="e.g. 40000"
              mode="currency"
              currency="INR"
              locale="en-IN"
            />
          </div>

          <div className="">
            <label className="block mb-2 font-medium">GST Applicable (%)</label>
            <InputNumber
              className="w-full"
              placeholder="e.g. 18"
              suffix=" %"
              value={gstApplicable}
              onValueChange={e => setGstApplicable(e.value ?? null)}
            />
          </div>

          <div className="">
            <label className="block mb-2 font-medium">
              Late Fee Amount (₹)
            </label>
            <InputNumber
              className="w-full"
              placeholder="e.g. 2000"
              mode="currency"
              currency="INR"
              locale="en-IN"
            />
          </div>

          <div className="">
            <label className="block mb-2 font-medium">
              Late Fee Applies After (Days)
            </label>
            <InputNumber className="w-full" placeholder="e.g. 15" />
          </div>

          <div className="">
            <label className="block mb-2 font-medium">
              Base Seats Capacity (1 Unit)
            </label>
            <InputNumber className="w-full" placeholder="e.g. 60" />
          </div>

          <div className="flex flex-col justify-end">
            <div className="flex items-center pb-1">
              <InputSwitch
                inputId="extraSeatsToggle"
                checked={hasExtraSeats}
                onChange={e => setHasExtraSeats(e.value ?? false)}
              />
              <label
                htmlFor="extraSeatsToggle"
                className="ml-2 font-medium cursor-pointer"
              >
                Apply Extra Seats Increment Logic?
              </label>
            </div>
          </div>

          {hasExtraSeats && (
            <>
              <div className="">
                <label className="block mb-2 font-medium">
                  Extra Seat Block Size
                </label>
                <InputNumber className="w-full" placeholder="e.g. 60" />
              </div>

              <div className="">
                <label className="block mb-2 font-medium">
                  Extra Block Fee Amount (₹)
                </label>
                <InputNumber
                  className="w-full"
                  placeholder="e.g. 20000"
                  mode="currency"
                  currency="INR"
                  locale="en-IN"
                />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
          <Button
            label="Cancel"
            severity="secondary"
            outlined
            onClick={() => navigate(AffiliationFeeMasterUrls.list())}
          />
          <Button
            label="Save Rule"
            onClick={() => navigate(AffiliationFeeMasterUrls.list())}
          />
        </div>
      </div>
    </FormPage>
  );
}
