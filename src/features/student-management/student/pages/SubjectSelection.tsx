import { useState } from 'react';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { FormPage, FormCard, StatusBadge } from 'shared/new-components';
import { studentManagementUrls } from '../../urls';

interface ElectiveGroup {
  id: string;
  groupName: string;
  minSelection: number;
  maxSelection: number;
  availableSubjects: { label: string; value: string; credits: number }[];
  selectedSubjects: string[];
}

const mockGroups: ElectiveGroup[] = [
  {
    id: 'EG-01',
    groupName: 'Professional Electives (PE-1)',
    minSelection: 1,
    maxSelection: 1,
    availableSubjects: [
      {
        label: 'CS-301: Advanced Algorithms (3 Cr)',
        value: 'CS-301',
        credits: 3,
      },
      { label: 'CS-302: Machine Learning (3 Cr)', value: 'CS-302', credits: 3 },
      { label: 'CS-303: Cloud Computing (3 Cr)', value: 'CS-303', credits: 3 },
    ],
    selectedSubjects: [],
  },
  {
    id: 'EG-02',
    groupName: 'Open Electives (OE-1)',
    minSelection: 1,
    maxSelection: 2,
    availableSubjects: [
      { label: 'HU-201: Psychology (2 Cr)', value: 'HU-201', credits: 2 },
      {
        label: 'MG-201: Principles of Management (2 Cr)',
        value: 'MG-201',
        credits: 2,
      },
      { label: 'EC-201: IoT Basics (2 Cr)', value: 'EC-201', credits: 2 },
    ],
    selectedSubjects: [],
  },
];

export default function SubjectSelection() {
  const [groups, setGroups] = useState<ElectiveGroup[]>(mockGroups);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelectionChange = (groupId: string, value: string[]) => {
    setGroups(
      groups.map(g =>
        g.id === groupId ? { ...g, selectedSubjects: value } : g
      )
    );
  };

  const isGroupValid = (g: ElectiveGroup) =>
    g.selectedSubjects.length >= g.minSelection &&
    g.selectedSubjects.length <= g.maxSelection;
  const isFormValid = groups.every(isGroupValid);
  const totalCreditsSelected = groups.reduce((total, group) => {
    const selected = group.availableSubjects.filter(sub =>
      group.selectedSubjects.includes(sub.value)
    );
    return total + selected.reduce((sum, sub) => sum + sub.credits, 0);
  }, 0);

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  return (
    <FormPage
      title="Subject & Elective Selection"
      description="Choose your elective subjects for the upcoming semester"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Student Portal', to: studentManagementUrls.student.root },
        { label: 'Subject Selection' },
      ]}
    >
      {isSubmitted ? (
        <FormCard className="shadow-lg border-t-4 border-green-500 overflow-hidden relative">
          <div className="absolute right-0 top-0 w-64 h-64 bg-green-50 rounded-bl-full -mr-16 -mt-16 opacity-50"></div>
          <div className="flex flex-col items-center justify-center p-12 text-center relative z-10">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <i className="pi pi-check text-5xl text-green-600 font-bold"></i>
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-3">
              Selection Submitted Successfully!
            </h2>
            <p className="text-gray-600 max-w-lg text-lg leading-relaxed">
              Your elective choices have been recorded. You have selected a
              total of{' '}
              <strong className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded mx-1">
                {totalCreditsSelected}
              </strong>{' '}
              elective credits.
              <br />
              <span className="text-sm mt-4 block text-gray-500 italic">
                Changes can no longer be made online. Contact the department for
                modifications.
              </span>
            </p>
          </div>
        </FormCard>
      ) : (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm">
            <div>
              <h4 className="text-blue-900 font-black text-xl m-0 mb-2 flex items-center gap-2">
                <i className="pi pi-book text-indigo-500"></i> Semester 3 -
                Elective Choices
              </h4>
              <p className="text-sm text-blue-700 m-0 font-medium">
                Please fulfill the minimum selection requirements for each group
                to proceed.
              </p>
            </div>
            <div className="text-left md:text-right mt-4 md:mt-0 bg-white px-6 py-3 rounded-lg shadow-sm border border-blue-100">
              <span className="text-xs text-indigo-500 uppercase font-bold tracking-wider block mb-1">
                Total Selected Credits
              </span>
              <div className="text-3xl font-black text-indigo-900 leading-none">
                {totalCreditsSelected}{' '}
                <span className="text-lg text-indigo-400 font-bold ml-1">
                  Cr
                </span>
              </div>
            </div>
          </div>

          {groups.map(group => {
            const valid = isGroupValid(group);
            return (
              <FormCard
                key={group.id}
                className={`transition-all duration-300 shadow-sm hover:shadow-md ${valid ? 'border-l-4 border-green-500 bg-white' : 'border-l-4 border-orange-500 bg-white'}`}
              >
                <div className="flex flex-col gap-5 p-2">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 m-0 mb-1">
                        {group.groupName}
                      </h3>
                      <p className="text-sm text-gray-500 m-0 font-medium">
                        Select between{' '}
                        <strong className="text-gray-700">
                          {group.minSelection}
                        </strong>{' '}
                        and{' '}
                        <strong className="text-gray-700">
                          {group.maxSelection}
                        </strong>{' '}
                        subject(s).
                      </p>
                    </div>
                    <StatusBadge
                      label={valid ? 'Requirement Met' : 'Action Required'}
                      variant={valid ? 'approved' : 'pending'}
                    />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Select Subjects
                    </label>
                    <MultiSelect
                      value={group.selectedSubjects}
                      options={group.availableSubjects}
                      onChange={e => handleSelectionChange(group.id, e.value)}
                      placeholder="Click to select subjects"
                      display="chip"
                      className="w-full shadow-sm border-gray-300"
                      maxSelectedLabels={group.maxSelection}
                      panelClassName="shadow-lg rounded-lg border border-gray-100"
                    />

                    {group.selectedSubjects.length > group.maxSelection && (
                      <div className="mt-3 flex items-center gap-2 text-red-600 bg-red-50 p-2 rounded text-sm font-medium border border-red-100">
                        <i className="pi pi-times-circle"></i>
                        <span>
                          You have selected too many subjects for this group.
                          Maximum allowed is {group.maxSelection}.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </FormCard>
            );
          })}

          <div className="flex justify-end mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-inner">
            <Button
              label="Submit Elective Choices"
              icon="pi pi-send"
              size="large"
              disabled={!isFormValid}
              onClick={handleSubmit}
              className="shadow-md font-bold bg-indigo-600 border-indigo-600 hover:bg-indigo-700 hover:border-indigo-700 w-full md:w-auto"
            />
          </div>
        </div>
      )}
    </FormPage>
  );
}
