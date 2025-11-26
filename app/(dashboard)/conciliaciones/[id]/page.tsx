'use client';

import { useParams, useRouter } from 'next/navigation';
import { useConciliaciones } from '@/lib/contexts/ConciliacionesContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { KPICard } from '@/components/conciliaciones/KPICard';
import { ComparisonChart } from '@/components/conciliaciones/ComparisonChart';
import { formatDate, formatCurrency, formatPercentage } from '@/lib/utils/formatters';

export default function DetalleConciliacionPage() {
  const params = useParams();
  const router = useRouter();
  const { getConciliacionById } = useConciliaciones();

  const id = params.id as string;
  const conciliacion = getConciliacionById(id);

  if (!conciliacion) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Conciliación no encontrada
            </h2>
            <p className="text-gray-600 mb-6">
              No se encontró la conciliación con el ID especificado
            </p>
            <Button onClick={() => router.push('/dashboard')}>
              Volver al Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const { resumen } = conciliacion.resultado;
  const tasaCoincidencia = formatPercentage(
    resumen.coincidencias,
    resumen.totalTransaccionesBanco
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <button
            onClick={() => router.push('/dashboard')}
            className="hover:text-primary transition-colors"
          >
            Dashboard
          </button>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Detalle de Conciliación</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{conciliacion.nombre}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-sm text-gray-600">
                Cuenta: <span className="font-medium">{conciliacion.cuenta}</span>
              </span>
              <span className="text-sm text-gray-600">
                Corte: <span className="font-medium">{formatDate(conciliacion.fechaCorte)}</span>
              </span>
              <span className="text-sm text-gray-600">
                Creada: <span className="font-medium">{formatDate(conciliacion.fechaCreacion)}</span>
              </span>
              <Badge variant={conciliacion.estado}>{conciliacion.estado}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <KPICard
          title="Total Banco"
          value={resumen.totalTransaccionesBanco}
          subtitle="transacciones"
          color="primary"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <KPICard
          title="Total Sistema"
          value={resumen.totalTransaccionesSistema}
          subtitle="transacciones"
          color="success"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
        />
        <KPICard
          title="Coincidencias"
          value={resumen.coincidencias}
          subtitle={`${tasaCoincidencia} del total`}
          color="success"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <KPICard
          title="No en Sistema"
          value={resumen.noEnSistema}
          subtitle="transacciones faltantes"
          color="warning"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          }
        />
        <KPICard
          title="No en Banco"
          value={resumen.noEnBanco}
          subtitle="transacciones extra"
          color="warning"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          }
        />
        <KPICard
          title="Diferencias en Monto"
          value={formatCurrency(resumen.montoDiferencias)}
          subtitle="total de discrepancias"
          color="error"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
      </div>

      {/* Chart */}
      <div className="mb-6">
        <ComparisonChart
          totalBanco={resumen.totalTransaccionesBanco}
          totalSistema={resumen.totalTransaccionesSistema}
          coincidencias={resumen.coincidencias}
        />
      </div>

      {/* Observaciones IA */}
      <Card className="mb-6">
        <div className="flex items-start">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
            <svg
              className="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Observaciones de IA
            </h3>
            <ul className="space-y-2">
              {conciliacion.resultado.observaciones.map((obs, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>{obs}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Información de Archivos */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Archivos Procesados
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h4 className="text-sm font-medium text-gray-900">
                Extracto Bancario
              </h4>
            </div>
            <p className="text-xs text-gray-600">{conciliacion.archivoBanco.nombre}</p>
            <p className="text-xs text-gray-500 mt-1">
              {conciliacion.archivoBanco.registros.length} registros
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <svg
                className="w-5 h-5 text-success"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h4 className="text-sm font-medium text-gray-900">
                Registros Sistema
              </h4>
            </div>
            <p className="text-xs text-gray-600">{conciliacion.archivoSistema.nombre}</p>
            <p className="text-xs text-gray-500 mt-1">
              {conciliacion.archivoSistema.registros.length} registros
            </p>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="secondary" onClick={() => router.push('/dashboard')}>
          ← Volver al Dashboard
        </Button>
        <Button onClick={() => router.push('/conciliaciones/nueva')}>
          Nueva Conciliación
        </Button>
      </div>
    </div>
  );
}

