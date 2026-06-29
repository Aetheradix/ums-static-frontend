const fs = require('fs');

const fileRoutes = {
  "e:/UMS Static/src/features/lms/masters/index.tsx": "course",
  "e:/UMS Static/src/features/lms/configuration/index.tsx": "course-structure",
  "e:/UMS Static/src/features/lms/content-management/index.tsx": "module",
  "e:/UMS Static/src/features/lms/assessment/index.tsx": "quiz-management",
  "e:/UMS Static/src/features/lms/progress-tracking/index.tsx": "course-progress",
  "e:/UMS Static/src/features/lms/certification/index.tsx": "generate"
};

for (const [file, defaultRoute] of Object.entries(fileRoutes)) {
  let content = fs.readFileSync(file, 'utf8');

  // Add index route
  if (!content.includes('<Route index')) {
    const indexRoute = `      <Route index element={<Navigate to="${defaultRoute}" replace />} />`;
    content = content.replace(/<Routes>\r?\n/, `<Routes>\n${indexRoute}\n`);
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
