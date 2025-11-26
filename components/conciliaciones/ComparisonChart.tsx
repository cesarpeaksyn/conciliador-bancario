'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Card } from '@/components/ui/Card';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ComparisonChartProps {
  totalBanco: number;
  totalSistema: number;
  coincidencias: number;
}

export function ComparisonChart({
  totalBanco,
  totalSistema,
  coincidencias,
}: ComparisonChartProps) {
  const data = {
    labels: ['Transacciones'],
    datasets: [
      {
        label: 'Banco',
        data: [totalBanco],
        backgroundColor: '#3b82f6',
      },
      {
        label: 'Sistema',
        data: [totalSistema],
        backgroundColor: '#10b981',
      },
      {
        label: 'Coincidencias',
        data: [coincidencias],
        backgroundColor: '#1e40af',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Comparación de Transacciones
      </h3>
      <div style={{ height: '300px' }}>
        <Bar data={data} options={options} />
      </div>
    </Card>
  );
}

