const fs = require('fs');
const path = require('path');

const files = [
  "e:/UMS Static/src/features/lms/progress-tracking/pages/CourseProgress.tsx",
  "e:/UMS Static/src/features/lms/masters/pages/CourseMasterList.tsx",
  "e:/UMS Static/src/features/lms/masters/pages/CourseCategoryList.tsx",
  "e:/UMS Static/src/features/lms/masters/pages/ContentTypeList.tsx",
  "e:/UMS Static/src/features/lms/masters/pages/CertificationMasterList.tsx",
  "e:/UMS Static/src/features/lms/masters/pages/AssessmentTypeList.tsx",
  "e:/UMS Static/src/features/lms/content-management/pages/ModuleManagement.tsx",
  "e:/UMS Static/src/features/lms/content-management/pages/ContentUpload.tsx",
  "e:/UMS Static/src/features/lms/configuration/pages/StudentEnrollment.tsx",
  "e:/UMS Static/src/features/lms/configuration/pages/FacultyMapping.tsx",
  "e:/UMS Static/src/features/lms/configuration/pages/CourseStructureMapping.tsx",
  "e:/UMS Static/src/features/lms/certification/pages/ViewCertificate.tsx",
  "e:/UMS Static/src/features/lms/certification/pages/GenerateCertificate.tsx",
  "e:/UMS Static/src/features/lms/assessment/pages/QuizManagement.tsx",
  "e:/UMS Static/src/features/lms/assessment/pages/AssignmentSubmissions.tsx"
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Add import if not exists
  if (!content.includes('learningUrls')) {
    // try to determine depth to urls.ts
    // file is in src/features/lms/<module>/pages/<file>
    // urls.ts is in src/features/lms/urls.ts
    // so path to urls is ../../urls
    const importStatement = `import { learningUrls } from '../../urls';\n`;
    
    // Find the last import
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
      const endOfLastImport = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, endOfLastImport + 1) + importStatement + content.slice(endOfLastImport + 1);
    } else {
      content = importStatement + content;
    }
  }

  // extract title
  const titleMatch = content.match(/title="([^"]+)"/);
  const title = titleMatch ? titleMatch[1] : 'LMS Module';

  const breadcrumbsStr = `breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Learning Management System', to: learningUrls.portal },
        { label: '${title}' }
      ]}`;

  if (!content.includes('breadcrumbs={')) {
    content = content.replace(/<FormPage\s+title="[^"]+"\s*(?:description="[^"]+")?/, (match) => {
      return `${match}\n      ${breadcrumbsStr}`;
    });
  }

  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
}
