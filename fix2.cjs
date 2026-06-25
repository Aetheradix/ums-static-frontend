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
            content = content.replace(/const \[data, setData\] = useState/g, 'const [data] = useState');
            content = content.replace(/(<FormPopup[^>]*?)size="small"([^>]*?>)/g, '$1size="default"$2');
            content = content.replace(/onView=\{[^\}]+\}/g, '');
            if (file === 'GenerateCertificate.tsx') {
                content = content.replace(/DatePicker, TextBox, /g, '');
            }
            fs.writeFileSync(fullPath, content);
        }
    }
}
processDir('e:/UMS Static/src/features/lms');
