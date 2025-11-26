import { Conciliacion } from '@/types';

export function filterByDateRange(
  conciliaciones: Conciliacion[],
  startDate?: Date,
  endDate?: Date
): Conciliacion[] {
  let filtered = [...conciliaciones];

  if (startDate) {
    filtered = filtered.filter((c) => c.fechaCreacion >= startDate);
  }

  if (endDate) {
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);
    filtered = filtered.filter((c) => c.fechaCreacion <= endOfDay);
  }

  return filtered;
}

export function searchByName(
  conciliaciones: Conciliacion[],
  query: string
): Conciliacion[] {
  if (!query) return conciliaciones;

  const lowerQuery = query.toLowerCase();
  return conciliaciones.filter(
    (c) =>
      c.nombre.toLowerCase().includes(lowerQuery) ||
      c.cuenta.toLowerCase().includes(lowerQuery)
  );
}

