import type { Rubric } from '../data';

interface Props {
  rubric: Rubric;
  className?: string;
}

export default function RubricViewer({ rubric, className = '' }: Props) {
  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      <div className="bg-gray-50 px-3 py-2 font-medium text-sm border-b">
        {rubric.name}
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <th className="px-3 py-1.5">Criterion</th>
            <th className="px-3 py-1.5">Description</th>
            <th className="px-3 py-1.5 text-right">Max</th>
          </tr>
        </thead>
        <tbody>
          {rubric.criteria.map((c, i) => (
            <tr key={i} className="border-t">
              <td className="px-3 py-1.5 font-medium">{c.name}</td>
              <td className="px-3 py-1.5 text-gray-600">{c.description}</td>
              <td className="px-3 py-1.5 text-right">{c.maxMarks}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t font-medium bg-gray-50">
            <td colSpan={2} className="px-3 py-1.5">
              Total
            </td>
            <td className="px-3 py-1.5 text-right">{rubric.totalMarks}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
