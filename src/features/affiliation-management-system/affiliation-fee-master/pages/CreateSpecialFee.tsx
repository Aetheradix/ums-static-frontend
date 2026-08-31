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
