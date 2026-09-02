import { useNavigate } from 'react-router-dom';
import { FormPage } from 'shared/new-components';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { AffiliationFeeMasterUrls } from '../urls';

export default function Edit() {
  const navigate = useNavigate();

  const [hasExtraSeats, setHasExtraSeats] = useState(false);
  const [isLateFeeApplicable, setIsLateFeeApplicable] = useState(false);

  const [category, setCategory] = useState<string>('General Course');
  const [degreeLevel, setDegreeLevel] = useState<string>('UG');
  const [courseGroup, setCourseGroup] = useState<string>('Gen');
  const [appType, setAppType] = useState<string>('1');
  const [collegeType, setCollegeType] = useState<string>('All');
  const [gstApplicable, setGstApplicable] = useState<number | null>(18);
  const [academicYear, setAcademicYear] = useState<string>('2024-25');

  return (
    <FormPage
      title="Edit Fee Rule"
      description="Update existing fee rule configuration."
    >
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Section 1: Application & Course Criteria */}
          <div className="col-span-full mb-2 mt-4 first:mt-0">
            <h5 className="border-b pb-2">Rule Criteria (Applicability)</h5>
          </div>

          <div className="">
            <label className="block mb-2 font-medium">
              Academic Year (Session) <span className="text-red-500">*</span>
            </label>
            <Dropdown
              value={academicYear}
              onChange={e => setAcademicYear(e.value)}
              options={[
                { label: '2023-24', value: '2023-24' },
                { label: '2024-25', value: '2024-25' },
                { label: '2025-26', value: '2025-26' },
                { label: '2026-27', value: '2026-27' },
              ]}
              className="w-full"
              placeholder="Select Academic Year"
            />
          </div>

          <div className="">
            <label className="block mb-2 font-medium">
              Fee Category <span className="text-red-500">*</span>
            </label>
            <Dropdown
              value={category}
              onChange={e => {
                setCategory(e.value);
                setDegreeLevel('');
                setCourseGroup('');
                setAppType('');
                setHasExtraSeats(false);
              }}
              options={[
                { label: 'General Course', value: 'General Course' },
                { label: 'Professional Course', value: 'Professional Course' },
                { label: 'Diploma / PG Diploma', value: 'Diploma' },
                { label: 'Research Center', value: 'Research Center' },
                {
                  label: 'Special Services (Modifications)',
                  value: 'Special Services',
                },
                {
                  label: 'Permanent Affiliation',
                  value: 'Permanent Affiliation',
                },
              ]}
              className="w-full"
              placeholder="Select Category"
            />
          </div>

          {!['Special Services', 'Permanent Affiliation'].includes(
            category
          ) && (
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
                  { label: 'All / Not Applicable', value: 'All' },
                ]}
                className="w-full"
                placeholder="Select Degree Level"
              />
            </div>
          )}

          {[
            'General Course',
            'Professional Course',
            'Permanent Affiliation',
            'Research Center',
            'Diploma',
          ].includes(category) && (
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
                  { label: 'All / Not Applicable', value: 'All' },
                ]}
                className="w-full"
                placeholder="Select Course Group"
              />
            </div>
          )}

          <div className="">
            <label className="block mb-2 font-medium">
              Application Type / Reason <span className="text-red-500">*</span>
            </label>
            <Dropdown
              value={appType}
              onChange={e => setAppType(e.value)}
              options={
                ['General Course', 'Professional Course'].includes(category)
                  ? [
                      { label: '1st Year (New Affiliation)', value: '1' },
                      { label: '2nd Year (Renewal)', value: '2' },
                      { label: '3rd Year (Renewal)', value: '3' },
                      { label: '4th Year (Renewal)', value: '4' },
                      { label: '5th Year (Renewal)', value: '5' },
                      { label: 'Annual Continuity Fee', value: 'Cont' },
                    ]
                  : category === 'Special Services'
                    ? [
                        { label: 'College Name Change', value: 'Name Change' },
                        { label: 'Location Change', value: 'Location Change' },
                        {
                          label: 'Decrease Seat Intake',
                          value: 'Decrease Seats',
                        },
                        {
                          label: 'Close Course/Programme',
                          value: 'Close Course',
                        },
                        { label: 'Close College', value: 'Close College' },
                        {
                          label: 'Change Trust/Society/Company',
                          value: 'Trust Change',
                        },
                        { label: 'Add-on Course (1 Year)', value: 'Add-on' },
                      ]
                    : [
                        { label: 'Affiliation Fee', value: 'Affiliation' },
                        { label: 'Annual Continuity Fee', value: 'Continuity' },
                      ]
              }
              className="w-full"
              placeholder="Select Type"
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
            <h5 className="border-b pb-2">Fee Configuration</h5>
          </div>

          <div className="">
            <label className="block mb-2 font-medium">
              {[
                'Special Services',
                'Permanent Affiliation',
                'Research Center',
              ].includes(category)
                ? 'Fixed Fee Amount (₹)'
                : 'Base Fee Amount (₹)'}{' '}
              <span className="text-red-500">*</span>
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

          {![
            'Special Services',
            'Permanent Affiliation',
            'Research Center',
          ].includes(category) && (
            <>
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

              <div className="flex flex-col justify-end">
                <div className="flex items-center pb-1">
                  <InputSwitch
                    inputId="lateFeeToggle"
                    checked={isLateFeeApplicable}
                    onChange={e => setIsLateFeeApplicable(e.value ?? false)}
                  />
                  <label
                    htmlFor="lateFeeToggle"
                    className="ml-2 font-medium cursor-pointer"
                  >
                    Apply Late Fee Now?
                  </label>
                </div>
              </div>
            </>
          )}

          {['General Course', 'Professional Course'].includes(category) && (
            <>
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
                      placeholder="e.g. 20000 (50% of Base)"
                      mode="currency"
                      currency="INR"
                      locale="en-IN"
                    />
                  </div>
                </>
              )}
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
