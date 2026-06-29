import Chart from 'chart.js/auto';
import { useEffect, useRef, useState } from 'react';
import { DropDownList } from 'shared/components/forms';
import { FormPage, GridPanel } from 'shared/new-components';
import { mockQuestions, mockSubjects } from '../../data';

const bloomLabels: Record<number, string> = {
  1: 'Remember',
  2: 'Understand',
  3: 'Apply',
  4: 'Analyze',
  5: 'Evaluate',
  6: 'Create',
};

export default function BloomsTaxonomyReport() {
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const chartRef = useRef<HTMLCanvasElement>(null);

  const questions =
    subjectFilter === 'all'
      ? mockQuestions
      : mockQuestions.filter(q => q.subjectId === Number(subjectFilter));

  const distribution = [1, 2, 3, 4, 5, 6].map(level => ({
    level,
    count: questions.filter(q => q.bloomLevel === level).length,
    label: `L${level} - ${bloomLabels[level]}`,
  }));

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: distribution.map(d => d.label),
        datasets: [
          {
            label: 'Questions',
            data: distribution.map(d => d.count),
            backgroundColor: [
              '#60a5fa',
              '#34d399',
              '#fbbf24',
              '#f472b6',
              '#a78bfa',
              '#fb923c',
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
      },
    });
    return () => chart.destroy();
  }, [subjectFilter]);

  return (
    <FormPage
      title="Bloom's Taxonomy Analysis"
      description="Question distribution across cognitive levels"
    >
      <div className="mb-6">
        <div className="max-w-2xl mx-auto">
          <canvas ref={chartRef} />
        </div>
      </div>
      <GridPanel
        title="Bloom's Distribution"
        data={distribution}
        columns={[
          { field: 'label', header: 'Level' },
          { field: 'count', header: 'Count' },
          {
            header: 'Percentage',
            cell: row => (
              <>
                {questions.length > 0
                  ? ((row.count / questions.length) * 100).toFixed(1)
                  : 0}
                %
              </>
            ),
          },
        ]}
        dataKey="level"
        pagination={{ rows: 10 }}
        toolbar={
          <DropDownList
            value={subjectFilter}
            onChange={v => setSubjectFilter(v as string)}
            data={[
              { value: 'all', label: 'All Subjects' },
              ...mockSubjects
                .filter(s => s.isActive)
                .map(s => ({ value: String(s.id), label: s.name })),
            ]}
            textField="label"
            valueField="value"
          />
        }
      />
    </FormPage>
  );
}
