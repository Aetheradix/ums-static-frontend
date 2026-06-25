import { Route, Routes } from 'react-router-dom';
import ProgrammeFee from './programme-fee';

export default function Settings() {
  return (
    <Routes>
      <Route path="programme-fee/*" element={<ProgrammeFee />} />
    </Routes>
  );
}
