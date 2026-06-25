import { Route, Routes } from 'react-router-dom';
import Block from './block';
import District from './district';
import Division from './division';
import State from './state';
import Tehsil from './tehsil';

export default function Location() {
  return (
    <Routes>
      <Route path="states/*" element={<State />} />
      <Route path="divisions/*" element={<Division />} />
      <Route path="districts/*" element={<District />} />
      <Route path="tehsils/*" element={<Tehsil />} />
      <Route path="blocks/*" element={<Block />} />
    </Routes>
  );
}
