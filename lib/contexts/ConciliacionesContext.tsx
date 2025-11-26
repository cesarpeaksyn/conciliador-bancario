'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Conciliacion } from '@/types';
import { seedConciliaciones } from '@/lib/mock/seed-data';

interface ConciliacionesContextType {
  conciliaciones: Conciliacion[];
  createConciliacion: (conciliacion: Conciliacion) => void;
  getConciliaciones: () => Conciliacion[];
  getConciliacionById: (id: string) => Conciliacion | undefined;
  filterConciliaciones: (query: string, startDate?: Date, endDate?: Date) => Conciliacion[];
}

const ConciliacionesContext = createContext<ConciliacionesContextType | undefined>(undefined);

const STORAGE_KEY = 'conciliaciones-bancarias';

export function ConciliacionesProvider({ children }: { children: ReactNode }) {
  const [conciliaciones, setConciliaciones] = useState<Conciliacion[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar desde localStorage al montar
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convertir strings de fecha a objetos Date
        const conciliacionesWithDates = parsed.map((c: any) => ({
          ...c,
          fechaCorte: new Date(c.fechaCorte),
          fechaCreacion: new Date(c.fechaCreacion),
        }));
        setConciliaciones(conciliacionesWithDates);
      } catch (error) {
        console.error('Error al cargar conciliaciones:', error);
        setConciliaciones(seedConciliaciones);
      }
    } else {
      // Si no hay datos, usar seed data
      setConciliaciones(seedConciliaciones);
    }
    setIsLoaded(true);
  }, []);

  // Guardar en localStorage cuando cambien las conciliaciones
  useEffect(() => {
    if (isLoaded && conciliaciones.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conciliaciones));
    }
  }, [conciliaciones, isLoaded]);

  const createConciliacion = (conciliacion: Conciliacion) => {
    setConciliaciones((prev) => [conciliacion, ...prev]);
  };

  const getConciliaciones = () => {
    return [...conciliaciones].sort(
      (a, b) => b.fechaCreacion.getTime() - a.fechaCreacion.getTime()
    );
  };

  const getConciliacionById = (id: string) => {
    return conciliaciones.find((c) => c.id === id);
  };

  const filterConciliaciones = (query: string, startDate?: Date, endDate?: Date) => {
    let filtered = [...conciliaciones];

    // Filtro por texto
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.nombre.toLowerCase().includes(lowerQuery) ||
          c.cuenta.toLowerCase().includes(lowerQuery)
      );
    }

    // Filtro por rango de fechas
    if (startDate) {
      filtered = filtered.filter((c) => c.fechaCreacion >= startDate);
    }
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      filtered = filtered.filter((c) => c.fechaCreacion <= endOfDay);
    }

    return filtered.sort(
      (a, b) => b.fechaCreacion.getTime() - a.fechaCreacion.getTime()
    );
  };

  return (
    <ConciliacionesContext.Provider
      value={{
        conciliaciones,
        createConciliacion,
        getConciliaciones,
        getConciliacionById,
        filterConciliaciones,
      }}
    >
      {children}
    </ConciliacionesContext.Provider>
  );
}

export function useConciliaciones() {
  const context = useContext(ConciliacionesContext);
  if (context === undefined) {
    throw new Error('useConciliaciones debe ser usado dentro de ConciliacionesProvider');
  }
  return context;
}

