import { Route, Routes } from 'react-router-dom';
import Caste from './caste';
import Post from './post';
import Qualification from './qualification';
import Religion from './religion';
import Class from './class';
import Section from './section';
import DesignationHr from './designation';
import DesignationType from './designation-type';

export default function HR() {
  return (
    <Routes>
      <Route path="caste/*" element={<Caste />} />
      <Route path="post/*" element={<Post />} />
      <Route path="qualification/*" element={<Qualification />} />
      <Route path="religion/*" element={<Religion />} />
      <Route path="class/*" element={<Class />} />
      <Route path="section/*" element={<Section />} />
      <Route path="designation/*" element={<DesignationHr />} />
      <Route path="designation-type/*" element={<DesignationType />} />
    </Routes>
  );
}
