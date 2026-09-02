import { Navigate, Route, Routes } from 'react-router-dom';
import { HmsProvider } from '../context/HmsContext';
import AdmissionForm from './AdmissionForm';
import PublicHome from './PublicHome';
import PublicShell from './PublicShell';
import TrackApplication from './TrackApplication';

/**
 * The public forum — reachable at `/hostel-admission` without signing in.
 * It shares the module's data store, so an application submitted here lands
 * in the warden's approval queue.
 */
export default function HmsPublicForum() {
  return (
    <HmsProvider>
      <Routes>
        <Route element={<PublicShell />}>
          <Route index element={<PublicHome />} />
          <Route path="apply" element={<AdmissionForm />} />
          <Route path="track" element={<TrackApplication />} />
          <Route
            path="*"
            element={<Navigate to="/hostel-admission" replace />}
          />
        </Route>
      </Routes>
    </HmsProvider>
  );
}
