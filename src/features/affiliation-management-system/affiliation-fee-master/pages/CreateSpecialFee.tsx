import { useNavigate } from 'react-router-dom';
import { FormPage } from 'shared/new-components';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { AffiliationFeeMasterUrls } from '../urls';

export default function CreateSpecialFee() {
  const navigate = useNavigate();

  const [category, setCategory] = useState<string>('Special Services');
  const [appType, setAppType] = useState<string>('');
  const [degreeLevel, setDegreeLevel] = useState<string>('');
  const [courseGroup, setCourseGroup] = useState<string>('All');
  const [collegeType, setCollegeType] = useState<string>('All');
  const [gstApplicable, setGstApplicable] = useState<number | null>(18);

  return (
    <FormPage
      title="Create Special/Administrative Fee"
      description="Configure a new fixed fee for special administrative actions (e.g. Name Change)."
    >
      <div className="card">
        <div className="grid">
          {/* Section 1: Criteria */}
          <div className="col-12 mb-4">
            <h5 className="border-bottom-1 pb-2">Step 1: Fee Category</h5>
          </div>

          <div className="col-12 md:col-6 lg:col-4 mb-3">
            <label className="block mb-2 font-medium">
              Fee Category <span className="text-red-500">*</span>
            </label>
            <Dropdown
              value={category}
              onChange={e => {
                setCategory(e.value);
                setAppType('');
                setDegreeLevel('');
                setCourseGroup('All');
              }}
              options={[
                {
                  label: 'Special Services (Modifications)',
                  value: 'Special Services',
                },
                {
                  label: 'Permanent Affiliation',
                  value: 'Permanent Affiliation',
                },
                { label: 'Research Center', value: 'Research Center' },
                { label: 'Diploma / PG Diploma', value: 'Diploma' },
              ]}
              className="w-full"
              placeholder="Select Category"
            />
          </div>

          <div className="col-12 md:col-6 lg:col-4 mb-3">
            <label className="block mb-2 font-medium">
              Service / Application Type <span className="text-red-500">*</span>
            </label>
            <Dropdown
              value={appType}
              onChange={e => setAppType(e.value)}
              options={
                category === 'Special Services'
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
              placeholder="Select Service Type"
            />
          </div>

          {category === 'Research Center' && (
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
                  { label: 'All Levels', value: 'All' },
                ]}
                className="w-full"
                placeholder="Select Degree Level"
              />
            </div>
          )}
          {category !== 'Special Services' && (
            <div className="col-12 md:col-6 lg:col-4 mb-3">
              <label className="block mb-2 font-medium">
                Course Group <span className="text-red-500">*</span>
              </label>
              <Dropdown
                value={courseGroup}
                onChange={e => setCourseGroup(e.value)}
                options={[
                  { label: 'All / Not Applicable', value: 'All' },
                  { label: 'General', value: 'Gen' },
                  { label: 'Professional', value: 'Prof' },
                ]}
                className="w-full"
                placeholder="Select Course Group"
              />
            </div>
          )}

          <div className="col-12 md:col-6 lg:col-4 mb-3">
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
          <div className="col-12 mt-4 mb-4">
            <h5 className="border-bottom-1 pb-2">Step 2: Fee Configuration</h5>
          </div>

          <div className="col-12 md:col-6 lg:col-4 mb-3">
            <label className="block mb-2 font-medium">
              Fixed Fee Amount (₹) <span className="text-red-500">*</span>
            </label>
            <InputNumber
              className="w-full"
              placeholder="e.g. 50000"
              mode="currency"
              currency="INR"
              locale="en-IN"
            />
          </div>

          <div className="col-12 md:col-6 lg:col-4 mb-3">
            <label className="block mb-2 font-medium">GST Applicable (%)</label>
            <InputNumber
              className="w-full"
              placeholder="e.g. 18"
              suffix=" %"
              value={gstApplicable}
              onValueChange={e => setGstApplicable(e.value ?? null)}
            />
          </div>
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
