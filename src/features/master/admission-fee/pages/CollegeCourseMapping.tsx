import { useState } from 'react';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import { Checkbox as PrimeCheckbox } from 'primereact/checkbox';
import {
  useFeeStore,
  type CollegeCourseMapping as MappingType,
} from '../store/useFeeStore';
import { ToastService } from 'services';

export default function CollegeCourseMapping() {
  const {
    colleges,
    courses,
    collegeMappings,
    addCollegeMapping,
    updateCollegeMapping,
  } = useFeeStore();
  const [popup, setPopup] = useState<{
    mode: 'closed' | 'create' | 'edit';
    data?: MappingType;
  }>({ mode: 'closed' });

  const [selectedCollege, setSelectedCollege] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const handleCreateOpen = () => {
    setSelectedCollege(colleges[0]?.id || '');
    setSelectedCourses([]);
    setPopup({ mode: 'create' });
  };

  const handleEditOpen = (mapping: MappingType) => {
    setSelectedCollege(mapping.collegeId);
    setSelectedCourses(mapping.courseIds);
    setPopup({ mode: 'edit', data: mapping });
  };

  const handleCourseToggle = (courseId: string) => {
    setSelectedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSave = () => {
    if (!selectedCollege) {
      ToastService.error('College is required');
      return;
    }
    if (selectedCourses.length === 0) {
      ToastService.error('Select at least one course');
      return;
    }

    if (popup.mode === 'create') {
      const exists = collegeMappings.some(m => m.collegeId === selectedCollege);
      if (exists) {
        ToastService.error(
          'Mapping for this college already exists. Please edit it instead.'
        );
        return;
      }
      addCollegeMapping({
        collegeId: selectedCollege,
        courseIds: selectedCourses,
      });
      ToastService.success('College to Course mapping created.');
    } else if (popup.mode === 'edit' && popup.data) {
      updateCollegeMapping(popup.data.id, {
        collegeId: selectedCollege,
        courseIds: selectedCourses,
      });
      ToastService.success('College to Course mapping updated.');
    }
    setPopup({ mode: 'closed' });
  };

  const getCollegeName = (collegeId: string) => {
    return colleges.find(c => c.id === collegeId)?.name || 'Unknown College';
  };

  const getCourseNames = (courseIds: string[]) => {
    return (
      courseIds
        .map(id => courses.find(c => c.id === id)?.name)
        .filter(Boolean)
        .join(', ') || 'No Courses'
    );
  };

  return (
    <FormPage
      title="College Course Mapping Master"
      description="Map colleges to courses available for admission fee structures."
    >
      <FormCard>
        <GridPanel
          data={collegeMappings}
          onEdit={handleEditOpen}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '50px',
              header: 'S.No',
            },
            {
              header: 'College Name',
              cell: (item: MappingType) => (
                <span>{getCollegeName(item.collegeId)}</span>
              ),
            },
            {
              header: 'Mapped Courses',
              cell: (item: MappingType) => (
                <span>{getCourseNames(item.courseIds)}</span>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Create Mapping"
              icon="plus"
              variant="outlined"
              onClick={handleCreateOpen}
            />
          }
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={popup.mode === 'create' ? 'Create Mapping' : 'Edit Mapping'}
        subtitle="Select a college and check the courses associated with it."
      >
        <div className="flex flex-col gap-4 py-2">
          <DropDownList
            label="College"
            disabled={popup.mode === 'edit'}
            data={colleges.map(c => ({
              text: `${c.name} (${c.code})`,
              value: c.id,
            }))}
            textField="text"
            valueField="value"
            value={selectedCollege}
            onChange={val => setSelectedCollege(val as string)}
            required
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Select Courses *
            </label>
            <div className="border rounded-md p-3 flex flex-col gap-2 max-h-60 overflow-y-auto">
              {courses.map(course => (
                <label
                  key={course.id}
                  className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 p-1 rounded"
                >
                  <PrimeCheckbox
                    checked={selectedCourses.includes(course.id)}
                    onChange={() => handleCourseToggle(course.id)}
                  />
                  <span>
                    {course.name} ({course.code})
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setPopup({ mode: 'closed' })}
            />
            <Button
              label="Save Mapping"
              variant="primary"
              onClick={handleSave}
            />
          </div>
        </div>
      </FormPopup>
    </FormPage>
  );
}
