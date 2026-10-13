import { Navigate, Route, Routes } from 'react-router-dom';
import PublicShell from './PublicShell';
import RegistrationForm from './RegistrationForm';
import TrackApplication from './TrackApplication';
import { vfUrls } from '../urls';

/**
 * The public forum — reachable at `/visiting-faculty-registration` without
 * signing in. It shares the module store, so a registration submitted here
 * lands in the selected department's login.
 */
export default function VisitingFacultyPublic() {
  return (
    <Routes>
      <Route element={<PublicShell />}>
        <Route index element={<RegistrationForm />} />
        <Route path="track" element={<TrackApplication />} />
        <Route
          path="*"
          element={<Navigate to={vfUrls.public.register} replace />}
        />
      </Route>
    </Routes>
  );
}
