import { Route, Routes } from 'react-router-dom';
import { PortalSelector } from 'shared/new-components';
import { learningUrls } from '../urls';
import CourseMasterList from './pages/CourseMasterList';
import CourseCategoryList from './pages/CourseCategoryList';
import ContentTypeList from './pages/ContentTypeList';
import AssessmentTypeList from './pages/AssessmentTypeList';
import CertificationMasterList from './pages/CertificationMasterList';

export default function Masters() {
  return (
    <Routes>
      <Route
        index
        element={
          <PortalSelector
            moduleTitle="Masters — Learning Management"
            moduleDescription="Configure course templates, category tags, content classifications and assessment formats."
            backPath={learningUrls.admin.portal}
            backLabel="Admin Portal"
            portals={[
              {
                title: 'Create Course',
                description:
                  'Define course titles, codes, descriptions and syllabus frameworks.',
                icon: 'school',
                colorScheme: 'blue',
                path: learningUrls.admin.masters + '/course',
              },
              {
                title: 'Create Course Categories',
                description:
                  'Classify courses into departmental or domain tags.',
                icon: 'category',
                colorScheme: 'purple',
                path: learningUrls.admin.masters + '/course-category',
              },
              {
                title: 'Configure Content Types',
                description:
                  'Setup types of educational resources (e.g. video, PDF, notes).',
                icon: 'description',
                colorScheme: 'teal',
                path: learningUrls.admin.masters + '/content-type',
              },
              {
                title: 'Configure Assessment Types',
                description:
                  'Manage formats of evaluation like quiz, presentation, assignment.',
                icon: 'assignment',
                colorScheme: 'orange',
                path: learningUrls.admin.masters + '/assessment-type',
              },
              {
                title: 'Assign Faculty',
                description:
                  'Assign teaching faculty to specific courses and sessions.',
                icon: 'person_add',
                colorScheme: 'green',
                path: learningUrls.admin.configuration + '/faculty-mapping',
              },
            ]}
          />
        }
      />
      <Route path="course/*" element={<CourseMasterList />} />
      <Route path="course-category/*" element={<CourseCategoryList />} />
      <Route path="content-type/*" element={<ContentTypeList />} />
      <Route path="assessment-type/*" element={<AssessmentTypeList />} />
      <Route path="certification/*" element={<CertificationMasterList />} />
    </Routes>
  );
}
