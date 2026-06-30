import { useResearch } from '../context';

/**
 * Floating toast notification bar — rendered once in the ResearchManagement
 * root and reads from the shared context. Mirrors the HostelNotification design.
 */
export default function ResearchNotification() {
  const { notification } = useResearch();
  if (!notification) return null;

  const isSuccess = notification.type === 'success';

  return (
    <div
      className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl flex items-center gap-3 transition-all duration-300 ${
        isSuccess
          ? 'bg-emerald-600 text-white border-l-4 border-emerald-900'
          : 'bg-rose-600 text-white border-l-4 border-rose-900'
      }`}
      style={{ maxWidth: '420px' }}
    >
      <i
        className={`pi ${isSuccess ? 'pi-check-circle' : 'pi-exclamation-triangle'} text-lg shrink-0`}
      />
      <span className="text-sm font-semibold leading-snug">
        {notification.message}
      </span>
    </div>
  );
}
