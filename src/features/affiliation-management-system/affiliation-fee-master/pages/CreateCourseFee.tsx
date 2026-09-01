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

  return (
    <FormPage
      title="Create Course Affiliation Fee"
      description="Configure a new fee rule for regular or professional courses (Seat based)."
    >
      <div className="card">
        <div className="grid">
          {/* Section 1: Course Criteria */}
          <div className="col-12 mb-4">
            <h5 className="border-bottom-1 pb-2">Step 1: Course Details</h5>
          </div>

          <div className="col-12 md:col-6 lg:col-4 mb-3">
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

          <div className="col-12 md:col-6 lg:col-4 mb-3">
            <label className="block mb-2 font-medium">
              Course Group <span className="text-red-500">*</span>
            </label>
            <Dropdown
              value={courseGroup}
              onChange={e => setCourseGroup(e.value)}
              options={[
                {
                  label: 'General (B.A., B.Com, B.Sc, M.A., etc.)',
                  value: 'Gen',
                },
                {
                  label: 'Professional (B.B.A, M.B.A, L.L.B, etc.)',
                  value: 'Prof',
                },
              ]}
              className="w-full"
              placeholder="Select Course Group"
            />
          </div>

          <div className="col-12 md:col-6 lg:col-4 mb-3">
            <label className="block mb-2 font-medium">
              Application Year <span className="text-red-500">*</span>
            </label>
            <Dropdown
              value={appType}
              onChange={e => setAppType(e.value)}
              options={[
                { label: '1st Year (New Affiliation)', value: '1' },
                { label: '2nd Year (Renewal)', value: '2' },
                { label: '3rd Year (Renewal)', value: '3' },
                { label: '4th Year (Renewal)', value: '4' },
                { label: '5th Year (Renewal)', value: '5' },
                { label: 'Annual Continuity Fee', value: 'Cont' },
              ]}
              className="w-full"
              placeholder="Select Year"
            />
          </div>

          {/* Section 2: Fee Structure */}
          <div className="col-12 mt-4 mb-4">
            <h5 className="border-bottom-1 pb-2">Step 2: Fee Configuration</h5>
          </div>

          <div className="col-12 md:col-6 lg:col-4 mb-3">
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

          <div className="col-12 md:col-6 lg:col-4 mb-3">
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

          <div className="col-12 md:col-6 lg:col-4 mb-3">
            <label className="block mb-2 font-medium">
              Late Fee Applies After (Days)
            </label>
            <InputNumber className="w-full" placeholder="e.g. 15" />
          </div>

          <div className="col-12 md:col-6 lg:col-4 mb-3">
            <label className="block mb-2 font-medium">
              Base Seats Capacity (1 Unit)
            </label>
            <InputNumber className="w-full" placeholder="e.g. 60" />
          </div>

          <div className="col-12 md:col-6 lg:col-4 mb-3 flex align-items-center">
            <InputSwitch
              checked={hasExtraSeats}
              onChange={e => setHasExtraSeats(e.value ?? false)}
            />
            <label className="ml-2 font-medium">
              Apply Extra Seats Increment Logic?
            </label>
          </div>

          {hasExtraSeats && (
            <>
              <div className="col-12 md:col-6 lg:col-4 mb-3">
                <label className="block mb-2 font-medium">
                  Extra Seat Block Size
                </label>
                <InputNumber className="w-full" placeholder="e.g. 60" />
              </div>

              <div className="col-12 md:col-6 lg:col-4 mb-3">
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

        <div className="flex justify-content-end gap-2 mt-4 pt-4 border-top-1 border-gray-200">
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
