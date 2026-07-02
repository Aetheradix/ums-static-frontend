import TransportMenuPage from '../components/TransportMenuPage';

export default function StudentMenuPage() {
  return (
    <TransportMenuPage
      slug="student-transport"
      sectionLabel="Student Services"
      sectionIcon="commute"
      emptyMessage="No pages configured for Student Login."
    />
  );
}
