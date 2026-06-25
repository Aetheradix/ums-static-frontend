const fs = require('fs');
const path = require('path');

const srcDir = 'c:\\\\Users\\\\home\\\\Documents\\\\ums-frontend\\\\src';
const dashDir = path.join(srcDir, 'features', 'dashboard');
const sharedLayoutDir = path.join(srcDir, 'shared', 'components', 'workspace-layout');

// Create directories
fs.mkdirSync(sharedLayoutDir, { recursive: true });
fs.mkdirSync(path.join(dashDir, 'pages'), { recursive: true });

// 1. Read dashboard.css and split it
const cssPath = path.join(dashDir, 'styles', 'dashboard.css');
const fullCss = fs.readFileSync(cssPath, 'utf8');

const layoutCssParts = [];
const dashCssParts = [];

let currentPart = '';
let inLayout = true;

const lines = fullCss.split('\\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('/* WelcomeBanner */')) {
    layoutCssParts.push(currentPart);
    currentPart = line + '\\n';
    inLayout = false;
  } else if (line.includes('/* FooterNav */')) {
    dashCssParts.push(currentPart);
    currentPart = line + '\\n';
    inLayout = true;
  } else if (line.includes('/* --- Responsive Design --- */')) {
    if (inLayout) layoutCssParts.push(currentPart);
    else dashCssParts.push(currentPart);
    currentPart = line + '\\n';
    layoutCssParts.push('/* --- Responsive Design --- */\\n');
    dashCssParts.push('/* --- Responsive Design --- */\\n');
    currentPart = '';
  } else {
     currentPart += line + '\\n';
  }
}
if (inLayout) layoutCssParts.push(currentPart);
else dashCssParts.push(currentPart);

let layoutCssContent = layoutCssParts.join('').replace(/\\.ums-dashboard/g, '.ums-workspace');
let dashCssContent = dashCssParts.join('');

fs.writeFileSync(path.join(sharedLayoutDir, 'WorkspaceLayout.css'), layoutCssContent);
fs.writeFileSync(cssPath, dashCssContent);

// 2. Move and update layout components
const layoutComponents = ['TopBar.tsx', 'Header.tsx', 'FooterNav.tsx', 'FooterBar.tsx'];
for (const comp of layoutComponents) {
  const oldPath = path.join(dashDir, 'components', comp);
  if (fs.existsSync(oldPath)) {
    let content = fs.readFileSync(oldPath, 'utf8');
    content = content.replace('../styles/dashboard.css', './WorkspaceLayout.css');
    fs.writeFileSync(path.join(sharedLayoutDir, 'Workspace' + comp), content);
    fs.unlinkSync(oldPath);
  }
}

// 3. Create WorkspaceLayout.tsx
const layoutTsx = `import React from 'react';
import WorkspaceTopBar from './WorkspaceTopBar';
import WorkspaceHeader from './WorkspaceHeader';
import WorkspaceFooterNav from './WorkspaceFooterNav';
import WorkspaceFooterBar from './WorkspaceFooterBar';
import './WorkspaceLayout.css';

export const WorkspaceLayout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <div className="ums-workspace">
      <WorkspaceTopBar />
      <WorkspaceHeader />
      <main className="workspace-main-content">
        {children}
      </main>
      <WorkspaceFooterNav />
      <WorkspaceFooterBar />
    </div>
  );
};

export default WorkspaceLayout;
`;
fs.writeFileSync(path.join(sharedLayoutDir, 'WorkspaceLayout.tsx'), layoutTsx);

// 4. Create DashboardPage.tsx
const dashPageTsx = `import React from 'react';
import WelcomeBanner from '../components/WelcomeBanner';
import ServiceFilters from '../components/ServiceFilters';
import ServicesGrid from '../components/ServicesGrid';
import '../styles/dashboard.css';

const DashboardPage: React.FC = () => {
  return (
    <div className="db-main-content">
      <div className="dashboard-container">
        <WelcomeBanner />
        <ServiceFilters />
        <ServicesGrid />
      </div>
    </div>
  );
};

export default DashboardPage;
`;
fs.writeFileSync(path.join(dashDir, 'pages', 'DashboardPage.tsx'), dashPageTsx);

// 5. Update dashboard index.tsx
const indexTsx = `import React from 'react';
import { Route, Routes } from 'react-router';
import DashboardPage from './pages/DashboardPage';
import WorkspaceLayout from '../../shared/components/workspace-layout/WorkspaceLayout';

const DashboardRoutes: React.FC = () => {
  return (
    <WorkspaceLayout>
      <Routes>
        <Route path="/*" element={<DashboardPage />} />
      </Routes>
    </WorkspaceLayout>
  );
};

export default DashboardRoutes;
`;
fs.writeFileSync(path.join(dashDir, 'index.tsx'), indexTsx);

console.log('Refactoring complete');
