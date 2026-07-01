import { Route, Routes } from 'react-router-dom';
import { PortalSelector } from 'shared/new-components';
import { learningUrls } from '../urls';
import CourseStructureMapping from './pages/CourseStructureMapping';
import FacultyMapping from './pages/FacultyMapping';
import StudentEnrollment from './pages/StudentEnrollment';
import CourseAssignment from './pages/CourseAssignment';
import BatchMapping from './pages/BatchMapping';

export default function Configuration() {
  return (
    <Routes>
      <Route
        index
        element={
          <PortalSelector
            moduleTitle="Configuration — Learning Management"
            moduleDescription="Map course content syllabus structures, assign faculty roles, map sections, and enroll student batches."
            backPath={learningUrls.admin.portal}
            backLabel="Admin Portal"
            portals={[
              {
                title: 'Course Structure Mapping',
                description: 'Structure courses with respective modules, lessons and topics.',
                icon: 'account_tree',
                colorScheme: 'blue',
                path: learningUrls.admin.configuration + '/course-structure',
              },
              {
                title: 'Faculty Mapping',
                description: 'Map department faculty members to direct training courses.',
                icon: 'people',
                colorScheme: 'green',
                path: learningUrls.admin.configuration + '/faculty-mapping',
              },
              {
                title: 'Student Enrollment',
                description: 'Enroll active student cohorts and groups into learning modules.',
                icon: 'group_add',
                colorScheme: 'orange',
                path: learningUrls.admin.configuration + '/student-enrollment',
              },
              {
                title: 'Course Assignment',
                description: 'Manage course coordinator assignments and ownership roles.',
                icon: 'assignment_ind',
                colorScheme: 'purple',
                path: learningUrls.admin.configuration + '/course-assignment',
              },
              {
                title: 'Batch Mapping',
                description: 'Map batch cohorts to academic sections and semesters.',
                icon: 'grid_on',
                colorScheme: 'indigo',
                path: learningUrls.admin.configuration + '/batch-mapping',
              },
            ]}
          />
        }
      />
      <Route path="course-structure/*" element={<CourseStructureMapping />} />
      <Route path="faculty-mapping/*" element={<FacultyMapping />} />
      <Route path="student-enrollment/*" element={<StudentEnrollment />} />
      <Route path="course-assignment/*" element={<CourseAssignment />} />
      <Route path="batch-mapping/*" element={<BatchMapping />} />
    </Routes>
  );
}
