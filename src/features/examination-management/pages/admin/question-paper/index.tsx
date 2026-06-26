import { Route, Routes } from 'react-router-dom';
import QuestionPaperList from './QuestionPaperList';
import QuestionPaperPattern from './QuestionPaperPattern';

export default function QuestionPaperPages() {
  return (
    <Routes>
      <Route index element={<QuestionPaperList />} />
      <Route path="patterns" element={<QuestionPaperPattern />} />
    </Routes>
  );
}
