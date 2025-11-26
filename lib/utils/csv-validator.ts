import Papa from 'papaparse';
import { RegistroCSV, CSVValidationResult, CSVHeaderValidationResult, ValidationError } from '@/types';

const REQUIRED_HEADERS = ['fecha', 'monto', 'descripcion', 'referencia'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function validateCSVExtension(file: File): boolean {
  return file.name.toLowerCase().endsWith('.csv');
}

export function validateCSVSize(file: File): boolean {
  return file.size <= MAX_FILE_SIZE;
}

export function validateCSVHeaders(headers: string[]): CSVHeaderValidationResult {
  const normalizedHeaders = headers.map((h) => h.toLowerCase().trim());
  const missing: string[] = [];

  for (const required of REQUIRED_HEADERS) {
    if (!normalizedHeaders.includes(required)) {
      missing.push(required);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

function isValidDate(dateStr: string): boolean {
  // Aceptar formatos: DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD
  const formats = [
    /^\d{2}\/\d{2}\/\d{4}$/,
    /^\d{2}-\d{2}-\d{4}$/,
    /^\d{4}-\d{2}-\d{2}$/,
  ];

  if (!formats.some((format) => format.test(dateStr))) {
    return false;
  }

  // Intentar parsear la fecha
  try {
    const parts = dateStr.split(/[/-]/);
    let day: number, month: number, year: number;

    if (dateStr.includes('/') || dateStr.startsWith('0') || dateStr.startsWith('1') || dateStr.startsWith('2') || dateStr.startsWith('3')) {
      if (parts[0].length === 4) {
        // YYYY-MM-DD
        year = parseInt(parts[0]);
        month = parseInt(parts[1]);
        day = parseInt(parts[2]);
      } else {
        // DD/MM/YYYY or DD-MM-YYYY
        day = parseInt(parts[0]);
        month = parseInt(parts[1]);
        year = parseInt(parts[2]);
      }
    } else {
      return false;
    }

    const date = new Date(year, month - 1, day);
    return (
      date.getDate() === day &&
      date.getMonth() === month - 1 &&
      date.getFullYear() === year
    );
  } catch {
    return false;
  }
}

function isValidMonto(montoStr: string): boolean {
  const cleaned = montoStr.toString().replace(/[,$]/g, '').trim();
  const num = parseFloat(cleaned);
  return !isNaN(num) && isFinite(num);
}

export function validateCSVData(rows: any[]): CSVValidationResult {
  const errors: ValidationError[] = [];

  rows.forEach((row, index) => {
    const rowNum = index + 2; // +2 porque: +1 para índice base-1, +1 para header

    // Validar fecha
    if (!row.fecha || !isValidDate(row.fecha.toString().trim())) {
      errors.push({
        row: rowNum,
        field: 'fecha',
        message: 'Formato de fecha inválido. Use DD/MM/YYYY, DD-MM-YYYY o YYYY-MM-DD',
      });
    }

    // Validar monto
    if (!row.monto || !isValidMonto(row.monto)) {
      errors.push({
        row: rowNum,
        field: 'monto',
        message: 'El monto debe ser un número válido',
      });
    }

    // Validar descripción
    if (!row.descripcion || row.descripcion.toString().trim() === '') {
      errors.push({
        row: rowNum,
        field: 'descripcion',
        message: 'La descripción es requerida',
      });
    }

    // Validar referencia
    if (!row.referencia || row.referencia.toString().trim() === '') {
      errors.push({
        row: rowNum,
        field: 'referencia',
        message: 'La referencia es requerida',
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function parseCSV(file: File): Promise<RegistroCSV[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.toLowerCase().trim(),
      complete: (results) => {
        try {
          const registros: RegistroCSV[] = results.data.map((row: any) => ({
            fecha: row.fecha?.toString().trim() || '',
            monto: parseFloat(row.monto?.toString().replace(/[,$]/g, '') || '0'),
            descripcion: row.descripcion?.toString().trim() || '',
            referencia: row.referencia?.toString().trim() || '',
          }));
          resolve(registros);
        } catch (error) {
          reject(new Error('Error al procesar el archivo CSV'));
        }
      },
      error: (error) => {
        reject(new Error(`Error al parsear CSV: ${error.message}`));
      },
    });
  });
}

