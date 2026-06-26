import { useGrievance } from '../context';

export default function GrievanceNotification() {
  const { notification } = useGrievance();

  if (!notification) return null;

  const isError = notification.type === 'error';
  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        padding: '12px 24px',
        borderRadius: '6px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: '#fff',
        backgroundColor: isError ? '#ef4444' : '#10b981',
        animation: 'slideIn 0.3s ease-out',
        fontWeight: 600,
        fontSize: '14px',
      }}
    >
      <i
        className={`pi ${isError ? 'pi-exclamation-triangle' : 'pi-check-circle'}`}
        style={{ fontSize: '18px' }}
      />
      <span>{notification.message}</span>
    </div>
  );
}
