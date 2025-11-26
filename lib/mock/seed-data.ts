import { Conciliacion } from "@/types";

export const seedConciliaciones: Conciliacion[] = [
  {
    id: "1",
    nombre: "Conciliación Octubre 2025",
    cuenta: "CTA-001-2025",
    fechaCorte: new Date("2025-10-31"),
    fechaCreacion: new Date("2025-11-01"),
    usuario: "Ejecutivo Bancario",
    estado: "Completada",
    archivoBanco: {
      nombre: "extracto_octubre_banco.csv",
      registros: [
        { fecha: "31/10/2025", monto: 1500.00, descripcion: "Transferencia", referencia: "REF001" },
        { fecha: "30/10/2025", monto: 2300.50, descripcion: "Depósito", referencia: "REF002" },
      ],
    },
    archivoSistema: {
      nombre: "registros_octubre_sistema.csv",
      registros: [
        { fecha: "31/10/2025", monto: 1500.00, descripcion: "Transferencia", referencia: "REF001" },
        { fecha: "30/10/2025", monto: 2300.50, descripcion: "Depósito", referencia: "REF002" },
      ],
    },
    resultado: {
      resumen: {
        totalTransaccionesBanco: 120,
        totalTransaccionesSistema: 118,
        coincidencias: 110,
        noEnSistema: 10,
        noEnBanco: 8,
        montoDiferencias: 1520.35,
      },
      observaciones: [
        "Diferencias concentradas en fechas fin de mes",
        "Posibles transacciones duplicadas en sistema",
        "Se recomienda revisar transacciones del día 31",
      ],
    },
  },
  {
    id: "2",
    nombre: "Conciliación Septiembre 2025",
    cuenta: "CTA-001-2025",
    fechaCorte: new Date("2025-09-30"),
    fechaCreacion: new Date("2025-10-01"),
    usuario: "Ejecutivo Bancario",
    estado: "Completada",
    archivoBanco: {
      nombre: "extracto_septiembre_banco.csv",
      registros: [],
    },
    archivoSistema: {
      nombre: "registros_septiembre_sistema.csv",
      registros: [],
    },
    resultado: {
      resumen: {
        totalTransaccionesBanco: 95,
        totalTransaccionesSistema: 95,
        coincidencias: 92,
        noEnSistema: 3,
        noEnBanco: 3,
        montoDiferencias: 450.00,
      },
      observaciones: [
        "Conciliación con baja tasa de diferencias",
        "Resultados dentro de parámetros esperados",
      ],
    },
  },
  {
    id: "3",
    nombre: "Conciliación Agosto 2025",
    cuenta: "CTA-002-2025",
    fechaCorte: new Date("2025-08-31"),
    fechaCreacion: new Date("2025-09-01"),
    usuario: "Ejecutivo Bancario",
    estado: "Completada",
    archivoBanco: {
      nombre: "extracto_agosto_banco.csv",
      registros: [],
    },
    archivoSistema: {
      nombre: "registros_agosto_sistema.csv",
      registros: [],
    },
    resultado: {
      resumen: {
        totalTransaccionesBanco: 150,
        totalTransaccionesSistema: 145,
        coincidencias: 138,
        noEnSistema: 12,
        noEnBanco: 7,
        montoDiferencias: 3250.80,
      },
      observaciones: [
        "Mayor volumen de transacciones respecto a meses anteriores",
        "Detectadas diferencias significativas en la segunda quincena",
        "Se sugiere auditoría adicional",
      ],
    },
  },
  {
    id: "4",
    nombre: "Conciliación Julio 2025",
    cuenta: "CTA-001-2025",
    fechaCorte: new Date("2025-07-31"),
    fechaCreacion: new Date("2025-08-01"),
    usuario: "Ejecutivo Bancario",
    estado: "Completada",
    archivoBanco: {
      nombre: "extracto_julio_banco.csv",
      registros: [],
    },
    archivoSistema: {
      nombre: "registros_julio_sistema.csv",
      registros: [],
    },
    resultado: {
      resumen: {
        totalTransaccionesBanco: 88,
        totalTransaccionesSistema: 90,
        coincidencias: 85,
        noEnSistema: 3,
        noEnBanco: 5,
        montoDiferencias: 725.50,
      },
      observaciones: [
        "Conciliación estándar sin incidencias mayores",
        "Diferencias mínimas esperadas en operativa normal",
      ],
    },
  },
  {
    id: "5",
    nombre: "Conciliación Junio 2025",
    cuenta: "CTA-003-2025",
    fechaCorte: new Date("2025-06-30"),
    fechaCreacion: new Date("2025-07-01"),
    usuario: "Ejecutivo Bancario",
    estado: "Completada",
    archivoBanco: {
      nombre: "extracto_junio_banco.csv",
      registros: [],
    },
    archivoSistema: {
      nombre: "registros_junio_sistema.csv",
      registros: [],
    },
    resultado: {
      resumen: {
        totalTransaccionesBanco: 105,
        totalTransaccionesSistema: 108,
        coincidencias: 100,
        noEnSistema: 5,
        noEnBanco: 8,
        montoDiferencias: 1890.25,
      },
      observaciones: [
        "Se identificaron transacciones pendientes de registro",
        "Recomendación: mejorar tiempo de registro en sistema",
      ],
    },
  },
];

