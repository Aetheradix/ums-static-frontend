const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    const dirent = fs.statSync(dirFile);
    if (dirent.isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else if (dirFile.endsWith('.tsx')) {
      filelist.push(dirFile);
    }
  }
  return filelist;
};

const files = walkSync('e:/UMS Static/src/features/leave-management');
let modifiedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Pattern 1: repeat(4,1fr), gap: 1rem, mb: 1.5rem
  content = content.replace(/style=\{\{\s*display:\s*'grid',\s*gridTemplateColumns:\s*'repeat\(4,\s*1fr\)',\s*gap:\s*'1rem',\s*marginBottom:\s*'1\.5rem'\s*\}\}/g, 'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"');
  
  // Pattern 2: repeat(4,1fr), gap: 0.75rem, mb: 1.5rem (some might have 0.75 gap)
  content = content.replace(/style=\{\{\s*display:\s*'grid',\s*gridTemplateColumns:\s*'repeat\(4,\s*1fr\)',\s*gap:\s*'0\.75rem'\s*\}\}/g, 'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"');
  content = content.replace(/style=\{\{\s*display:\s*'grid',\s*gridTemplateColumns:\s*'repeat\(4,\s*1fr\)',\s*gap:\s*'1rem'\s*\}\}/g, 'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"');

  // Pattern 3: 1fr 1fr, gap: 1.5rem, mb: 1.5rem
  content = content.replace(/style=\{\{\s*display:\s*'grid',\s*gridTemplateColumns:\s*'1fr 1fr',\s*gap:\s*'1\.5rem',\s*marginBottom:\s*'1\.5rem'\s*\}\}/g, 'className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"');
  
  // Pattern 4: 1fr 1fr, gap: 1rem
  content = content.replace(/style=\{\{\s*display:\s*'grid',\s*gridTemplateColumns:\s*'1fr 1fr',\s*gap:\s*'1rem'\s*\}\}/g, 'className="grid grid-cols-1 lg:grid-cols-2 gap-4"');

  // Pattern 5: repeat(3,1fr), gap: 0.75rem, mb: 1rem
  content = content.replace(/style=\{\{\s*display:\s*'grid',\s*gridTemplateColumns:\s*'repeat\(3,\s*1fr\)',\s*gap:\s*'0\.75rem',\s*marginBottom:\s*'1rem'\s*\}\}/g, 'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4"');
  content = content.replace(/style=\{\{\s*display:\s*'grid',\s*gridTemplateColumns:\s*'repeat\(3,\s*1fr\)',\s*gap:\s*'1rem'\s*\}\}/g, 'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"');
  content = content.replace(/style=\{\{\s*display:\s*'grid',\s*gridTemplateColumns:\s*'repeat\(3,\s*1fr\)',\s*gap:\s*'0\.75rem'\s*\}\}/g, 'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"');
  
  // Pattern 6: repeat(2,1fr), gap: 0.75rem, mb: 1rem
  content = content.replace(/style=\{\{\s*display:\s*'grid',\s*gridTemplateColumns:\s*'repeat\(2,\s*1fr\)',\s*gap:\s*'0\.75rem',\s*marginBottom:\s*'1rem'\s*\}\}/g, 'className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4"');
  content = content.replace(/style=\{\{\s*display:\s*'grid',\s*gridTemplateColumns:\s*'repeat\(2,\s*1fr\)',\s*gap:\s*'1rem'\s*\}\}/g, 'className="grid grid-cols-1 sm:grid-cols-2 gap-4"');

  // Pattern 7: 2fr 1fr, gap: 1.5rem
  content = content.replace(/style=\{\{\s*display:\s*'grid',\s*gridTemplateColumns:\s*'2fr 1fr',\s*gap:\s*'1\.5rem',\s*marginBottom:\s*'1\.5rem'\s*\}\}/g, 'className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6"');
  content = content.replace(/style=\{\{\s*display:\s*'grid',\s*gridTemplateColumns:\s*'2fr 1fr',\s*gap:\s*'1\.5rem'\s*\}\}/g, 'className="grid grid-cols-1 lg:grid-cols-3 gap-6"');

  if (content !== original) {
    // For the 2fr 1fr grids which are changed to grid-cols-3, we need to ensure the first child spans 2 columns.
    // However, it's safer to just use a custom class or inline style `flex flex-col lg:flex-row gap-6` for those if grid-cols-3 doesn't automatically span.
    // Actually, `grid grid-cols-1 lg:grid-cols-3` + making the first child `col-span-2` is hard via regex.
    // Wait, replacing '2fr 1fr' with `flex flex-col lg:grid lg:grid-cols-[2fr_1fr]` is fully Tailwind v4 compatible!
    
    // Let me revert the 2fr 1fr changes and use arbitrary values:
    content = content.replace(/className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6"/g, 'className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-6"');
    content = content.replace(/className="grid grid-cols-1 lg:grid-cols-3 gap-6"/g, 'className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6"');
    
    fs.writeFileSync(file, content);
    modifiedCount++;
    console.log('Modified:', file);
  }
}

console.log('Total files modified:', modifiedCount);
