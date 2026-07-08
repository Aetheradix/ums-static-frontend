import { useState } from 'react';
import { Button } from 'primereact/button';
import { DropDownList } from 'shared/components/forms';
import { ToastService } from 'services';
import { FormPage, FormCard } from 'shared/new-components';
import { admissionsUrls } from '../../urls';

export default function CoursePreference() {
  const [preferences, setPreferences] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const availableCourses = [
    { label: 'B.Tech Computer Science and Engineering', value: 'BTech_CSE' },
    { label: 'B.Tech Electronics and Communication', value: 'BTech_ECE' },
    { label: 'B.Tech Mechanical Engineering', value: 'BTech_ME' },
    { label: 'B.Tech Civil Engineering', value: 'BTech_CE' },
    { label: 'B.Tech Information Technology', value: 'BTech_IT' },
  ].filter(course => !preferences.includes(course.value));

  const handleAddPreference = () => {
    if (selectedCourse && preferences.length < 3) {
      setPreferences([...preferences, selectedCourse]);
      setSelectedCourse(null);
    } else if (preferences.length >= 3) {
      ToastService.error('You can only select up to 3 preferences.');
    }
  };

  const handleRemovePreference = (index: number) => {
    const newPrefs = [...preferences];
    newPrefs.splice(index, 1);
    setPreferences(newPrefs);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newPrefs = [...preferences];
    [newPrefs[index - 1], newPrefs[index]] = [
      newPrefs[index],
      newPrefs[index - 1],
    ];
    setPreferences(newPrefs);
  };

  const moveDown = (index: number) => {
    if (index === preferences.length - 1) return;
    const newPrefs = [...preferences];
    [newPrefs[index + 1], newPrefs[index]] = [
      newPrefs[index],
      newPrefs[index + 1],
    ];
    setPreferences(newPrefs);
  };

  const handleSubmit = () => {
    if (preferences.length === 0) {
      ToastService.error('Please add at least one course preference.');
      return;
    }
    ToastService.success('Course preferences saved successfully!');
  };

  const getCourseLabel = (val: string) => {
    const allCourses = [
      { label: 'B.Tech Computer Science and Engineering', value: 'BTech_CSE' },
      { label: 'B.Tech Electronics and Communication', value: 'BTech_ECE' },
      { label: 'B.Tech Mechanical Engineering', value: 'BTech_ME' },
      { label: 'B.Tech Civil Engineering', value: 'BTech_CE' },
      { label: 'B.Tech Information Technology', value: 'BTech_IT' },
    ];
    return allCourses.find(c => c.value === val)?.label || val;
  };

  return (
    <FormPage
      title="Course Preference"
      description="Select and prioritize the courses you wish to apply for. You can add up to 3 preferences."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Admissions', to: admissionsUrls.root },
        { label: 'Course Preference' },
      ]}
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-6 p-fluid">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FormCard title="Available Courses">
            <div className="flex flex-col gap-5 mt-2">
              <div className="flex flex-col gap-2">
                <DropDownList
                  label="Select Course"
                  value={selectedCourse || ''}
                  data={availableCourses}
                  textField="label"
                  valueField="value"
                  onChange={v => setSelectedCourse(v as string)}
                  defaultOptionText="Choose a program..."
                />
              </div>
              <Button
                label="Add to Preferences"
                icon="pi pi-plus"
                onClick={handleAddPreference}
                disabled={!selectedCourse || preferences.length >= 3}
                className="w-full md:w-auto self-start"
              />
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg shadow-sm flex items-start gap-3">
              <i className="pi pi-info-circle text-blue-500 mt-1"></i>
              <p className="text-sm text-blue-800 m-0">
                You can add a maximum of 3 course preferences. The order in
                which you arrange them represents your priority during seat
                allocation.
              </p>
            </div>

            {preferences.length >= 3 && (
              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 text-orange-700 rounded text-sm font-medium flex items-center gap-2">
                <i className="pi pi-exclamation-triangle"></i>
                Maximum limit of 3 preferences reached.
              </div>
            )}
          </FormCard>

          <FormCard title="Your Preferences (Ordered by Priority)">
            {preferences.length === 0 ? (
              <div className="p-8 mt-2 text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center gap-3">
                <i className="pi pi-list text-4xl text-gray-400"></i>
                <p>
                  No preferences added yet. Please select a course from the
                  available list.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 mt-2">
                {preferences.map((pref, index) => (
                  <div
                    key={pref}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:border-blue-300 transition-colors gap-3"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                        {index + 1}
                      </div>
                      <span className="font-semibold text-gray-800">
                        {getCourseLabel(pref)}
                      </span>
                    </div>
                    <div className="flex gap-1 self-end sm:self-auto bg-gray-50 p-1 rounded border border-gray-200">
                      <Button
                        icon="pi pi-angle-up"
                        text
                        severity="secondary"
                        size="small"
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                        tooltip="Move Up"
                        tooltipOptions={{ position: 'top' }}
                      />
                      <Button
                        icon="pi pi-angle-down"
                        text
                        severity="secondary"
                        size="small"
                        onClick={() => moveDown(index)}
                        disabled={index === preferences.length - 1}
                        tooltip="Move Down"
                        tooltipOptions={{ position: 'top' }}
                      />
                      <div className="w-px bg-gray-300 my-1 mx-1"></div>
                      <Button
                        icon="pi pi-trash"
                        text
                        severity="danger"
                        size="small"
                        onClick={() => handleRemovePreference(index)}
                        tooltip="Remove"
                        tooltipOptions={{ position: 'top' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end">
              <Button
                label="Save Preferences"
                icon="pi pi-check"
                severity="success"
                onClick={handleSubmit}
                disabled={preferences.length === 0}
                size="large"
                className="shadow-md"
              />
            </div>
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
