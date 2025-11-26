export interface RegistroCSV {
  fecha: string;
  monto: number;
  descripcion: string;
  referencia: string;
}

export interface ArchivoCSV {
  nombre: string;
  registros: RegistroCSV[];
}

export interface ResumenConciliacion {
  totalTransaccionesBanco: number;
  totalTransaccionesSistema: number;
  coincidencias: number;
  noEnSistema: number;
  noEnBanco: number;
  montoDiferencias: number;
}

export interface ResultadoConciliacion {
  resumen: ResumenConciliacion;
  observaciones: string[];
}

export type EstadoConciliacion = 'Completada' | 'En Proceso' | 'Error';

export interface Conciliacion {
  id: string;
  nombre: string;
  cuenta: string;
  fechaCorte: Date;
  fechaCreacion: Date;
  usuario: string;
  estado: EstadoConciliacion;
  archivoBanco: ArchivoCSV;
  archivoSistema: ArchivoCSV;
  resultado: ResultadoConciliacion;
}

export interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export interface CSVValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface CSVHeaderValidationResult {
  valid: boolean;
  missing: string[];
}

