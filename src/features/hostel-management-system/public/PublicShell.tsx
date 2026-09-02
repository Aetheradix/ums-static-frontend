import { Outlet } from 'react-router-dom';
import WorkspaceFooterBar from 'shared/components/workspace-layout/WorkspaceFooterBar';
import WorkspaceTopBar from 'shared/components/workspace-layout/WorkspaceTopBar';

/** Chrome for the public forum — no app sidebar, no sign-in. */
export default function PublicShell() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8faff] font-sans text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <WorkspaceTopBar />
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <WorkspaceFooterBar />
    </div>
  );
}
