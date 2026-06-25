const fs = require('fs');
const path = require('path');
function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            content = content.replace(/variant="secondary"/g, 'variant="outlined"');
            content = content.replace(/size="sm"/g, 'size="small"');
            content = content.replace(/size="md"/g, 'size="lg"');
            content = content.replace(/options=\{/g, 'textField="label" data={');
            content = content.replace(/onDelete=\{[^\}]+\}/g, '');
            fs.writeFileSync(fullPath, content);
        }
    }
}
processDir('e:/UMS Static/src/features/lms');
if (fs.existsSync('e:/UMS Static/src/features/lms/content-management/pages/TopicManagement.tsx')) {
    fs.unlinkSync('e:/UMS Static/src/features/lms/content-management/pages/TopicManagement.tsx');
}
