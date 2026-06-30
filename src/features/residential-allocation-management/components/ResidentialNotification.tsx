import { useResidentialAllocation } from '../context';

export default function ResidentialNotification() {
  const { notification } = useResidentialAllocation();

  if (!notification) return null;

  return (
    <div
      className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl flex items-center gap-3 transition-all duration-300 transform translate-y-0 animate-bounce ${
        notification.type === 'success'
          ? 'bg-emerald-600 text-white border-l-4 border-emerald-950'
          : 'bg-rose-600 text-white border-l-4 border-rose-950'
      }`}
    >
      <i
        className={`pi ${
          notification.type === 'success'
            ? 'pi-check-circle'
            : 'pi-exclamation-triangle'
        } text-lg shrink-0`}
      />
      <span className="font-semibold text-sm">{notification.message}</span>
    </div>
  );
}
