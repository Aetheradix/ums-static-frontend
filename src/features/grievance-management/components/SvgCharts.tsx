import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface ChartDataItem {
  label: string;
  value: number;
  color: string;
}

/* ── Pie / Doughnut Chart ──────────────────────────────── */
export function PieChart({
  data,
  title,
}: {
  data: ChartDataItem[];
  title?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.label),
        datasets: [
          {
            data: data.map(d => d.value),
            backgroundColor: data.map(d => d.color),
            borderWidth: 2,
            borderColor: '#ffffff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [data]);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      {title && (
        <p
          style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#374151',
            marginBottom: '0.5rem',
          }}
        >
          {title}
        </p>
      )}
      <canvas ref={canvasRef} />
    </div>
  );
}

/* ── Bar Chart ─────────────────────────────────────────── */
export function BarChart({
  data,
  title,
}: {
  data: ChartDataItem[];
  title?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.label),
        datasets: [
          {
            label: 'Complaints',
            data: data.map(d => d.value),
            backgroundColor: data.map(d => d.color),
            borderRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 9 } } },
          y: {
            grid: { color: '#f1f5f9' },
            ticks: { stepSize: 1, font: { size: 9 } },
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [data]);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      {title && (
        <p
          style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#374151',
            marginBottom: '0.5rem',
          }}
        >
          {title}
        </p>
      )}
      <canvas ref={canvasRef} />
    </div>
  );
}

/* ── Trend Line Chart ──────────────────────────────────── */
interface TrendDataset {
  label: string;
  data: number[];
  color: string;
}

export function TrendChart({
  labels,
  datasets,
  title,
}: {
  labels: string[];
  datasets: TrendDataset[];
  title?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: datasets.map(ds => ({
          label: ds.label,
          data: ds.data,
          borderColor: ds.color,
          backgroundColor: ds.color + '18',
          tension: 0.35,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 10, font: { size: 10 } },
          },
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 9 } } },
          y: { grid: { color: '#f1f5f9' }, ticks: { font: { size: 9 } } },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [labels, datasets]);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      {title && (
        <p
          style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#374151',
            marginBottom: '0.5rem',
          }}
        >
          {title}
        </p>
      )}
      <canvas ref={canvasRef} />
    </div>
  );
}
