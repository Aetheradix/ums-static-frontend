import { Outlet } from 'react-router-dom';
import WorkspaceFooterBar from 'shared/components/workspace-layout/WorkspaceFooterBar';
import WorkspaceTopBar from 'shared/components/workspace-layout/WorkspaceTopBar';

/** Chrome for the public forum — no app sidebar, no sign-in. */
export default function PublicShell() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8faff] font-sans text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <WorkspaceTopBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <WorkspaceFooterBar />
    </div>
  );
}
