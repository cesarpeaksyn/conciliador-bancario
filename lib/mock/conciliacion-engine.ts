import { RegistroCSV, ResultadoConciliacion } from '@/types';

export async function runMockConciliation(
  bancoCsv: RegistroCSV[],
  sistemaCsv: RegistroCSV[]
): Promise<ResultadoConciliacion> {
  // Simular delay de procesamiento (1-2 segundos)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const totalBanco = bancoCsv.length;
  const totalSistema = sistemaCsv.length;

  // Algoritmo simple de matching por referencia y monto
  const matchedRefs = new Set<string>();
  let coincidencias = 0;

  bancoCsv.forEach((regBanco) => {
    const match = sistemaCsv.find(
      (regSistema) =>
        regSistema.referencia === regBanco.referencia &&
        Math.abs(regSistema.monto - regBanco.monto) < 0.01 // Tolerancia de centavos
    );
    if (match) {
      coincidencias++;
      matchedRefs.add(regBanco.referencia);
    }
  });

  const noEnSistema = totalBanco - coincidencias;
  const noEnBanco = totalSistema - coincidencias;

  // Calcular diferencias en monto
  let montoDiferencias = 0;
  
  // Sumar montos que están en banco pero no en sistema
  bancoCsv.forEach((reg) => {
    if (!matchedRefs.has(reg.referencia)) {
      montoDiferencias += Math.abs(reg.monto);
    }
  });

  // Sumar montos que están en sistema pero no en banco
  sistemaCsv.forEach((reg) => {
    if (!matchedRefs.has(reg.referencia)) {
      montoDiferencias += Math.abs(reg.monto);
    }
  });

  // Generar observaciones basadas en los hallazgos
  const observaciones: string[] = [];

  const tasaCoincidencia = totalBanco > 0 ? (coincidencias / totalBanco) * 100 : 0;

  if (tasaCoincidencia >= 95) {
    observaciones.push('Excelente nivel de coincidencia entre banco y sistema');
  } else if (tasaCoincidencia >= 85) {
    observaciones.push('Nivel aceptable de coincidencias, revisar diferencias menores');
  } else if (tasaCoincidencia >= 70) {
    observaciones.push('Se detectaron diferencias significativas que requieren atención');
  } else {
    observaciones.push('Alto nivel de discrepancias, se recomienda auditoría detallada');
  }

  if (noEnSistema > 0) {
    observaciones.push(
      `Se encontraron ${noEnSistema} transacción(es) en extracto bancario que no están registradas en el sistema`
    );
  }

  if (noEnBanco > 0) {
    observaciones.push(
      `Se encontraron ${noEnBanco} transacción(es) en sistema que no aparecen en extracto bancario`
    );
  }

  if (montoDiferencias > 10000) {
    observaciones.push(
      'Las diferencias monetarias superan el umbral de alerta, revisar con prioridad'
    );
  }

  // Análisis de fechas (mock - asumimos patrón si hay diferencias al final)
  const fechasFinMes = bancoCsv.filter((r) => {
    const dia = r.fecha.split(/[/-]/)[0];
    return parseInt(dia) >= 28;
  });

  if (fechasFinMes.length > totalBanco * 0.3 && noEnSistema > 0) {
    observaciones.push('Diferencias concentradas en fechas fin de mes');
  }

  // Detectar posibles duplicados
  const referencias = bancoCsv.map((r) => r.referencia);
  const duplicados = referencias.filter(
    (ref, index) => referencias.indexOf(ref) !== index
  );

  if (duplicados.length > 0) {
    observaciones.push('Posibles transacciones duplicadas detectadas');
  }

  return {
    resumen: {
      totalTransaccionesBanco: totalBanco,
      totalTransaccionesSistema: totalSistema,
      coincidencias,
      noEnSistema,
      noEnBanco,
      montoDiferencias: Math.round(montoDiferencias * 100) / 100,
    },
    observaciones,
  };
}

