const fs = require('fs');
const path = require('path');

const files = [
  'InfrastructureStep.tsx',
  'ComplianceAndOpinionStep.tsx',
  'AcademicStaffStep.tsx',
  'AcademicFacilitiesStep.tsx'
];

const dir = 'd:/SourceTree/Ums Static Frontend/src/features/affiliation-management-system/inspection-report/components';

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Regex to match <DropDownList ... label="Something" ... />
  // We want to add placeholder={`Select Something`} just after the label prop
  content = content.replace(/<DropDownList([\s\S]*?)label="([^"]+)"([\s\S]*?)\/>/g, (match, p1, label, p3) => {
    // If it already has a placeholder, skip
    if (match.includes('placeholder=')) {
      return match;
    }
    
    // Clean up label to remove Question mark
    let cleanLabel = label.replace(/\?/g, '').trim();
    // if it includes " (if rented)" or something, we can remove it for the placeholder, but keeping it is fine.
    cleanLabel = cleanLabel.replace(/\(.*\)/g, '').trim();
    
    return `<DropDownList${p1}label="${label}" placeholder="Select ${cleanLabel}"${p3}/>`;
  });

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});
