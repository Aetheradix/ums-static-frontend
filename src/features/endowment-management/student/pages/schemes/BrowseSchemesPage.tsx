import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextArea, TextBox } from 'shared/components/forms';
import {
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { statusVariant } from '../../../mocks';
import { useCreateApplication, useSchemes } from '../../../queries';

export default function BrowseSchemesPage() {
  const { data: schemes } = useSchemes();
  const createApplication = useCreateApplication();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<any>(null);

  const [sop, setSop] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [declared, setDeclared] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  // Only show schemes that are Open for students to apply
  const openSchemes =
    schemes?.filter(
      s =>
        s.mode === 'Open' &&
        ['Open', 'Selection in Progress'].includes(s.status)
    ) || [];

  const handleApplyClick = (scheme: any) => {
    setSelectedScheme(scheme);
    setIsPopupOpen(true);
  };

  const handleSubmit = () => {
    if (!sop) {
      ToastService.error('Please enter Statement of Purpose');
      return;
    }
    if (!bankAccount || !ifscCode) {
      ToastService.error('Please enter bank details');
      return;
    }
    if (!declared) {
      ToastService.error('Please accept the declaration');
      return;
    }
    createApplication.mutate(
      {
        schemeName: selectedScheme.name,
        studentName: 'Current Student',
        cgpa: 9.0, // Mocked from student profile
        sop,
        bankAccount,
        ifscCode,
      },
      {
        onSuccess: () => {
          ToastService.success('Application submitted successfully!');
          setIsPopupOpen(false);
          setSelectedScheme(null);
          setSop('');
          setBankAccount('');
          setIfscCode('');
          setDeclared(false);
          setIsFileUploaded(false);
        },
      }
    );
  };

  const columns: Controls.ColumnProps<any>[] = [
    { header: 'Scheme Name', field: 'name' },
    { header: 'Award Type', field: 'awardType' },
    {
      header: 'Award Amount',
      field: 'budget',
      cell: (row: any) => <span>₹{row.budget?.toLocaleString()}</span>,
    },
    { header: 'Close Date', field: 'closeDate' },
    {
      header: 'Status',
      field: 'status',
      cell: (row: any) => (
        <StatusBadge label={row.status} variant={statusVariant(row.status)} />
      ),
    },
    {
      header: 'Action',
      field: 'action',
      cell: (row: any) => (
        <Button
          label="Apply Now"
          size="small"
          variant="primary"
          disabled={row.status !== 'Open'}
          onClick={() => handleApplyClick(row)}
        />
      ),
    },
  ];

  return (
    <FormPage
      title="Browse Schemes"
      description="View currently open schemes and apply."
      breadcrumbs={[
        { label: 'Endowment Management', to: '/endowment-management' },
        { label: 'Student Portal', to: '/endowment-management/student' },
        { label: 'Browse Schemes' },
      ]}
    >
      <GridPanel
        title="Eligible Schemes"
        columns={columns}
        data={openSchemes}
      />

      {isPopupOpen && selectedScheme && (
        <FormPopup
          visible={isPopupOpen}
          title="Apply for Scheme"
          onHide={() => setIsPopupOpen(false)}
          size="lg"
          footer={
            <div className="flex gap-2 justify-end w-full">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setIsPopupOpen(false)}
              />
              <Button
                label="Submit Application"
                variant="primary"
                onClick={handleSubmit}
              />
            </div>
          }
        >
          <div className="space-y-4 p-4 max-h-[500px] overflow-y-auto">
            <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-green-800 flex items-center gap-2">
              <span className="material-symbols-outlined">check_circle</span>
              <div>
                <strong>You are eligible to apply!</strong>
                <p className="text-sm mt-1">
                  Your current CGPA (9.0) and Department (CSE) meet the scheme
                  criteria.
                </p>
              </div>
            </div>

            <div className="space-y-4 mt-4">
              <h4 className="font-bold text-gray-700 border-b pb-2">
                Application Details
              </h4>
              <TextArea
                label="Statement of Purpose (Why do you need this award?)"
                rows={4}
                value={sop}
                onChange={val => setSop(String(val))}
                required
              />

              <div className="border border-gray-200 rounded p-4 space-y-3">
                <h5 className="font-medium text-gray-700">
                  Supporting Documents
                </h5>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">
                    Income Certificate{' '}
                    {isFileUploaded && (
                      <span className="text-emerald-600 ml-2 font-bold">
                        (Uploaded)
                      </span>
                    )}
                  </span>
                  <Button
                    label={isFileUploaded ? 'Change File' : 'Upload'}
                    size="small"
                    variant="outlined"
                    icon="upload_file"
                    onClick={() => {
                      setIsFileUploaded(true);
                      ToastService.success(
                        'Income Certificate uploaded successfully!'
                      );
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <TextBox
                  label="Bank Account Number"
                  value={bankAccount}
                  onChange={val => setBankAccount(String(val))}
                  required
                />
                <TextBox
                  label="IFSC Code"
                  value={ifscCode}
                  onChange={val => setIfscCode(String(val))}
                  required
                />
              </div>

              <div className="flex items-start gap-2 mt-4">
                <input
                  type="checkbox"
                  id="declaration"
                  className="mt-1 w-4 h-4 text-blue-600"
                  checked={declared}
                  onChange={e => setDeclared(e.target.checked)}
                />
                <label htmlFor="declaration" className="text-sm text-gray-700">
                  I hereby declare that all the information provided above is
                  true and correct to the best of my knowledge. I understand
                  that any false information may lead to rejection of my
                  application.
                </label>
              </div>
            </div>
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
