const fs = require('fs');

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

  // Fix the broken import by finding exactly "import {\nimport { learningUrls } from '../../urls';\n"
  // or similar.
  const badPattern = /import \{\r?\nimport \{ learningUrls \} from '\.\.\/\.\.\/urls';\r?\n/;
  if (badPattern.test(content)) {
    content = content.replace(badPattern, "import { learningUrls } from '../../urls';\nimport {\n");
    fs.writeFileSync(file, content);
    console.log(`Fixed ${file}`);
  }
}
