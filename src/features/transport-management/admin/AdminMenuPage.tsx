import TransportMenuPage from '../components/TransportMenuPage';

export default function AdminMenuPage() {
  return (
    <TransportMenuPage
      slug="transport-admin-login"
      sectionLabel="Admin Login"
      sectionIcon="local_shipping"
      emptyMessage="No pages configured for Admin Login."
    />
  );
}
