'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useConciliaciones } from '@/lib/contexts/ConciliacionesContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConciliacionesTable } from '@/components/conciliaciones/ConciliacionesTable';

export default function DashboardPage() {
  const router = useRouter();
  const { filterConciliaciones } = useConciliaciones();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredConciliaciones = useMemo(() => {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return filterConciliaciones(searchQuery, start, end);
  }, [searchQuery, startDate, endDate, filterConciliaciones]);

  const handleNewConciliacion = () => {
    router.push('/conciliaciones/nueva');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Conciliaciones Recientes</h1>
          <p className="text-gray-600 mt-1">
            Gestiona y revisa las conciliaciones bancarias
          </p>
        </div>
        <Button onClick={handleNewConciliacion} variant="primary">
          + Nueva Conciliación
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="search">Buscar por nombre o cuenta</Label>
            <Input
              id="search"
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="startDate">Fecha inicio</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="endDate">Fecha fin</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        {(searchQuery || startDate || endDate) && (
          <div className="mt-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setStartDate('');
                setEndDate('');
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>

      {/* Tabla o Empty State */}
      {filteredConciliaciones.length === 0 ? (
        <EmptyState
          title="No hay conciliaciones"
          description={
            searchQuery || startDate || endDate
              ? 'No se encontraron conciliaciones con los filtros aplicados'
              : 'Aún no has creado ninguna conciliación. Comienza creando tu primera conciliación.'
          }
          actionLabel="Nueva Conciliación"
          onAction={handleNewConciliacion}
        />
      ) : (
        <ConciliacionesTable conciliaciones={filteredConciliaciones} />
      )}
    </div>
  );
}

