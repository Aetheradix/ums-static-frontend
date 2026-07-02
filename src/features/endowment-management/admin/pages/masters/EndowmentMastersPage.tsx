import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, Switch, TextBox } from 'shared/components/forms';
import { FormPopup, GridPanel, Tabs } from 'shared/new-components';
import {
  useAwardTypes,
  useEligibilityParams,
  useEndowmentTypes,
  useFundCategories,
} from '../../../queries';

export default function EndowmentMastersPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [popupData, setPopupData] = useState<any>(null);

  const { data: types } = useEndowmentTypes();
  const { data: categories } = useFundCategories();
  const { data: awardTypes } = useAwardTypes();
  const { data: eligibilityParams } = useEligibilityParams();

  // We mock the other samarth-grounded masters directly here for simplicity
  const [contributionAreas] = useState([
    { id: 1, name: 'Student Welfare', active: true },
    { id: 2, name: 'Infrastructure', active: true },
    { id: 3, name: 'Research', active: true },
  ]);

  const [paymentPurposes] = useState([
    { id: 1, name: 'Endowment Corpus', active: true },
    { id: 2, name: 'Current Scheme Use', active: true },
  ]);

  const [salutations] = useState([
    { id: 1, name: 'Mr.', active: true },
    { id: 2, name: 'Ms.', active: true },
    { id: 3, name: 'Dr.', active: true },
    { id: 4, name: 'Prof.', active: true },
  ]);

  const [userTypes] = useState([
    { id: 1, name: 'Alumni', active: true },
    { id: 2, name: 'Corporate', active: true },
    { id: 3, name: 'Public', active: true },
  ]);

  const handleSave = () => {
    ToastService.success('Master record saved successfully (Mock)');
    setPopupData(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 0: // Endowment Type
        return (
          <GridPanel
            title="Endowment Types"
            actionButtons={
              <Button
                label="Add Type"
                icon="add"
                onClick={() =>
                  setPopupData({ tab: 0, title: 'Add Endowment Type' })
                }
              />
            }
            columns={[
              { header: 'Type Name', field: 'name' },
              { header: 'Corpus Spendable?', field: 'spendable' },
              {
                header: 'Active',
                field: 'active',
                cell: (row: any) => (
                  <Switch checked={row.active} onChange={() => {}} />
                ),
              },
            ]}
            data={types || []}
          />
        );
      case 1: // Fund Category
        return (
          <GridPanel
            title="Fund Categories"
            actionButtons={
              <Button
                label="Add Category"
                icon="add"
                onClick={() =>
                  setPopupData({ tab: 1, title: 'Add Fund Category' })
                }
              />
            }
            columns={[
              { header: 'Category Name', field: 'name' },
              { header: 'Beneficiary Type', field: 'beneficiaryType' },
              {
                header: 'Active',
                field: 'active',
                cell: (row: any) => (
                  <Switch checked={row.active} onChange={() => {}} />
                ),
              },
            ]}
            data={categories || []}
          />
        );
      case 2: // Award Type
        return (
          <GridPanel
            title="Award Types"
            actionButtons={
              <Button
                label="Add Award Type"
                icon="add"
                onClick={() =>
                  setPopupData({ tab: 2, title: 'Add Award Type' })
                }
              />
            }
            columns={[
              { header: 'Award Type Name', field: 'name' },
              { header: 'Award Nature', field: 'nature' },
              { header: 'Certificate Issued?', field: 'certificate' },
              {
                header: 'Active',
                field: 'active',
                cell: (row: any) => (
                  <Switch checked={row.active} onChange={() => {}} />
                ),
              },
            ]}
            data={awardTypes || []}
          />
        );
      case 3: // Eligibility Parameter
        return (
          <GridPanel
            title="Eligibility Parameters"
            actionButtons={
              <Button
                label="Add Parameter"
                icon="add"
                onClick={() =>
                  setPopupData({ tab: 3, title: 'Add Eligibility Parameter' })
                }
              />
            }
            columns={[
              { header: 'Parameter Name', field: 'name' },
              { header: 'Data Type', field: 'type' },
              {
                header: 'Active',
                field: 'active',
                cell: (row: any) => (
                  <Switch checked={row.active} onChange={() => {}} />
                ),
              },
            ]}
            data={eligibilityParams || []}
          />
        );
      case 4: // Samarth Lookups
        return (
          <div className="space-y-6">
            <GridPanel
              title="Contribution Areas"
              actionButtons={
                <Button label="Add" icon="add" onClick={() => {}} />
              }
              columns={[{ header: 'Name', field: 'name' }]}
              data={contributionAreas}
            />
            <GridPanel
              title="Payment Purposes"
              actionButtons={
                <Button label="Add" icon="add" onClick={() => {}} />
              }
              columns={[{ header: 'Name', field: 'name' }]}
              data={paymentPurposes}
            />
            <GridPanel
              title="Salutations"
              actionButtons={
                <Button label="Add" icon="add" onClick={() => {}} />
              }
              columns={[{ header: 'Name', field: 'name' }]}
              data={salutations}
            />
            <GridPanel
              title="User Types"
              actionButtons={
                <Button label="Add" icon="add" onClick={() => {}} />
              }
              columns={[{ header: 'Name', field: 'name' }]}
              data={userTypes}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Master Configuration
          </h2>
          <p className="text-gray-600">
            Configure global lookups for the Endowment system.
          </p>
        </div>
      </div>

      <Tabs
        tabs={[
          { title: 'Endowment Types', content: null },
          { title: 'Fund Categories', content: null },
          { title: 'Award Types', content: null },
          { title: 'Eligibility Parameters', content: null },
          { title: 'Samarth Lookups', content: null },
        ]}
        activeIndex={activeTab}
        onTabChange={e => setActiveTab(e.index)}
      />

      {renderContent()}

      {popupData && (
        <FormPopup
          visible={!!popupData}
          title={popupData.title}
          onHide={() => setPopupData(null)}
          size="default"
          footer={
            <div className="flex gap-2 justify-end w-full">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setPopupData(null)}
              />
              <Button label="Save" variant="primary" onClick={handleSave} />
            </div>
          }
        >
          <div className="space-y-4 p-4">
            {popupData.tab === 0 && (
              <>
                <TextBox label="Type Name" required />
                <DropDownList
                  label="Corpus Spendable?"
                  data={['Yes', 'No'].map(v => ({ text: v, value: v }))}
                  required
                />
              </>
            )}
            {popupData.tab === 1 && (
              <>
                <TextBox label="Category Name" required />
                <DropDownList
                  label="Beneficiary Type"
                  data={['Student', 'Faculty', 'Institution', 'Both'].map(
                    v => ({ text: v, value: v })
                  )}
                  required
                />
              </>
            )}
            {popupData.tab === 2 && (
              <>
                <TextBox label="Award Type Name" required />
                <DropDownList
                  label="Award Nature"
                  data={['Monetary', 'Non-Monetary', 'Both'].map(v => ({
                    text: v,
                    value: v,
                  }))}
                  required
                />
                <DropDownList
                  label="Certificate Issued?"
                  data={['Yes', 'No'].map(v => ({ text: v, value: v }))}
                  required
                />
              </>
            )}
            {popupData.tab === 3 && (
              <>
                <TextBox label="Parameter Name" required />
                <DropDownList
                  label="Data Type"
                  data={['Number', 'Dropdown', 'Boolean'].map(v => ({
                    text: v,
                    value: v,
                  }))}
                  required
                />
              </>
            )}
            <div className="flex items-center justify-between border-t pt-4">
              <span className="text-sm font-medium">Active</span>
              <Switch checked={true} onChange={() => {}} />
            </div>
          </div>
        </FormPopup>
      )}
    </div>
  );
}
