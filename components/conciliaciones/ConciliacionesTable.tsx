'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Conciliacion } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { formatDate, formatCurrency } from '@/lib/utils/formatters';

interface ConciliacionesTableProps {
  conciliaciones: Conciliacion[];
}

export function ConciliacionesTable({ conciliaciones }: ConciliacionesTableProps) {
  const router = useRouter();

  if (conciliaciones.length === 0) {
    return null;
  }

  const handleRowClick = (id: string) => {
    router.push(`/conciliaciones/${id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm md:text-base">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cuenta
              </th>
              <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="hidden sm:table-cell px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Coincidencias
              </th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Diferencias
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {conciliaciones.map((conciliacion) => (
              <tr
                key={conciliacion.id}
                onClick={() => handleRowClick(conciliacion.id)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {conciliacion.nombre}
                  </div>
                </td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{conciliacion.cuenta}</div>
                </td>
                <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">
                    {formatDate(conciliacion.fechaCreacion)}
                  </div>
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                  <Badge variant={conciliacion.estado}>{conciliacion.estado}</Badge>
                </td>
                <td className="hidden sm:table-cell px-3 md:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {conciliacion.resultado.resumen.coincidencias} /{' '}
                    {conciliacion.resultado.resumen.totalTransaccionesBanco}
                  </div>
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-error">
                    {formatCurrency(conciliacion.resultado.resumen.montoDiferencias)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

