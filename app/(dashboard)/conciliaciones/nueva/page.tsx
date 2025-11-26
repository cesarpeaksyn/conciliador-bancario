'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useConciliaciones } from '@/lib/contexts/ConciliacionesContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { FileUploader } from '@/components/conciliaciones/FileUploader';
import {
  validateCSVExtension,
  validateCSVSize,
  validateCSVHeaders,
  validateCSVData,
  parseCSV,
} from '@/lib/utils/csv-validator';
import { runMockConciliation } from '@/lib/mock/conciliacion-engine';
import { RegistroCSV } from '@/types';

type Step = 1 | 2 | 3 | 4;

export default function NuevaConciliacionPage() {
  const router = useRouter();
  const { createConciliacion } = useConciliaciones();

  const [step, setStep] = useState<Step>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Paso 1: Metadatos
  const [nombre, setNombre] = useState('');
  const [cuenta, setCuenta] = useState('');
  const [fechaCorte, setFechaCorte] = useState('');

  // Paso 2: Archivos
  const [archivoBanco, setArchivoBanco] = useState<File | null>(null);
  const [archivoSistema, setArchivoSistema] = useState<File | null>(null);
  const [fileErrors, setFileErrors] = useState({ banco: '', sistema: '' });

  // Paso 3: Datos parseados
  const [registrosBanco, setRegistrosBanco] = useState<RegistroCSV[]>([]);
  const [registrosSistema, setRegistrosSistema] = useState<RegistroCSV[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleStep1Next = () => {
    if (!nombre || !cuenta || !fechaCorte) {
      setError('Todos los campos son requeridos');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleFileSelect = (type: 'banco' | 'sistema', file: File) => {
    setError('');
    setFileErrors({ ...fileErrors, [type]: '' });

    if (!validateCSVExtension(file)) {
      setFileErrors({ ...fileErrors, [type]: 'El archivo debe ser un CSV' });
      return;
    }

    if (!validateCSVSize(file)) {
      setFileErrors({ ...fileErrors, [type]: 'El archivo excede el tamaño máximo de 10MB' });
      return;
    }

    if (type === 'banco') {
      setArchivoBanco(file);
    } else {
      setArchivoSistema(file);
    }
  };

  const handleStep2Next = async () => {
    if (!archivoBanco || !archivoSistema) {
      setError('Debes subir ambos archivos CSV');
      return;
    }

    setIsProcessing(true);
    setError('');
    setValidationErrors([]);

    try {
      // Parsear ambos archivos
      const [bancoData, sistemaData] = await Promise.all([
        parseCSV(archivoBanco),
        parseCSV(archivoSistema),
      ]);

      // Validar headers
      if (bancoData.length > 0) {
        const headers = Object.keys(bancoData[0]);
        const headerValidation = validateCSVHeaders(headers);
        if (!headerValidation.valid) {
          throw new Error(
            `Archivo Banco: Faltan columnas requeridas: ${headerValidation.missing.join(', ')}`
          );
        }
      }

      if (sistemaData.length > 0) {
        const headers = Object.keys(sistemaData[0]);
        const headerValidation = validateCSVHeaders(headers);
        if (!headerValidation.valid) {
          throw new Error(
            `Archivo Sistema: Faltan columnas requeridas: ${headerValidation.missing.join(', ')}`
          );
        }
      }

      // Validar datos
      const bancoValidation = validateCSVData(bancoData);
      const sistemaValidation = validateCSVData(sistemaData);

      const errors: string[] = [];

      if (!bancoValidation.valid) {
        bancoValidation.errors.slice(0, 3).forEach((err) => {
          errors.push(`Banco fila ${err.row} - ${err.field}: ${err.message}`);
        });
        if (bancoValidation.errors.length > 3) {
          errors.push(`...y ${bancoValidation.errors.length - 3} errores más en archivo Banco`);
        }
      }

      if (!sistemaValidation.valid) {
        sistemaValidation.errors.slice(0, 3).forEach((err) => {
          errors.push(`Sistema fila ${err.row} - ${err.field}: ${err.message}`);
        });
        if (sistemaValidation.errors.length > 3) {
          errors.push(`...y ${sistemaValidation.errors.length - 3} errores más en archivo Sistema`);
        }
      }

      if (errors.length > 0) {
        setValidationErrors(errors);
        setStep(3);
        return;
      }

      setRegistrosBanco(bancoData);
      setRegistrosSistema(sistemaData);
      setStep(3);
    } catch (err: any) {
      setError(err.message || 'Error al procesar los archivos');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStep3Execute = async () => {
    setIsProcessing(true);
    setError('');
    setStep(4);

    try {
      // Ejecutar conciliación mock
      const resultado = await runMockConciliation(registrosBanco, registrosSistema);

      // Crear la conciliación
      const nuevaConciliacion = {
        id: Date.now().toString(),
        nombre,
        cuenta,
        fechaCorte: new Date(fechaCorte),
        fechaCreacion: new Date(),
        usuario: 'Ejecutivo Bancario',
        estado: 'Completada' as const,
        archivoBanco: {
          nombre: archivoBanco!.name,
          registros: registrosBanco,
        },
        archivoSistema: {
          nombre: archivoSistema!.name,
          registros: registrosSistema,
        },
        resultado,
      };

      createConciliacion(nuevaConciliacion);

      // Redirigir al detalle
      setTimeout(() => {
        router.push(`/conciliaciones/${nuevaConciliacion.id}`);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Error al ejecutar la conciliación');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Nueva Conciliación</h1>
        <p className="text-gray-600 mt-1">
          Crea una nueva conciliación bancaria siguiendo los pasos
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step > s ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-600">Metadatos</span>
          <span className="text-xs text-gray-600">Archivos</span>
          <span className="text-xs text-gray-600">Validación</span>
          <span className="text-xs text-gray-600">Procesar</span>
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} />
        </div>
      )}

      {/* Paso 1: Metadatos */}
      {step === 1 && (
        <Card className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Paso 1: Información de Conciliación
          </h2>
          <div className="space-y-6">
            <div>
              <Label htmlFor="nombre" required>
                Nombre de Conciliación
              </Label>
              <Input
                id="nombre"
                type="text"
                placeholder="Ej: Conciliación Noviembre 2025"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="cuenta" required>
                Cuenta
              </Label>
              <Input
                id="cuenta"
                type="text"
                placeholder="Ej: CTA-001-2025"
                value={cuenta}
                onChange={(e) => setCuenta(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="fechaCorte" required>
                Fecha de Corte
              </Label>
              <Input
                id="fechaCorte"
                type="date"
                value={fechaCorte}
                onChange={(e) => setFechaCorte(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end border-t border-gray-200 pt-6">
            <Button onClick={handleStep1Next} size="lg">
              Siguiente →
            </Button>
          </div>
        </Card>
      )}

      {/* Paso 2: Carga de Archivos */}
      {step === 2 && (
        <Card className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Paso 2: Subir Archivos CSV
          </h2>
          <div className="space-y-6">
            <FileUploader
              label="Extracto Bancario"
              onFileSelect={(file) => handleFileSelect('banco', file)}
              file={archivoBanco}
              onRemove={() => setArchivoBanco(null)}
              error={fileErrors.banco}
            />
            <FileUploader
              label="Registros del Sistema"
              onFileSelect={(file) => handleFileSelect('sistema', file)}
              file={archivoSistema}
              onRemove={() => setArchivoSistema(null)}
              error={fileErrors.sistema}
            />
          </div>
          <div className="mt-8 flex justify-between border-t border-gray-200 pt-6">
            <Button variant="secondary" onClick={() => setStep(1)} size="lg">
              ← Atrás
            </Button>
            <Button
              onClick={handleStep2Next}
              disabled={!archivoBanco || !archivoSistema || isProcessing}
              size="lg"
            >
              {isProcessing ? 'Validando...' : 'Validar Archivos →'}
            </Button>
          </div>
        </Card>
      )}

      {/* Paso 3: Validación */}
      {step === 3 && (
        <Card className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Paso 3: Validación y Confirmación
          </h2>

          {validationErrors.length > 0 ? (
            <div className="mb-6">
              <ErrorMessage
                title="Errores de Validación"
                message="Se encontraron errores en los archivos CSV:"
              />
              <ul className="mt-4 space-y-2">
                {validationErrors.map((err, idx) => (
                  <li key={idx} className="text-sm text-error">
                    • {err}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex justify-between border-t border-gray-200 pt-6">
                <Button variant="secondary" onClick={() => setStep(2)} size="lg">
                  ← Atrás
                </Button>
                <Button variant="danger" disabled size="lg">
                  No se puede continuar
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-600 mr-3 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-green-800">
                        Archivos válidos
                      </h3>
                      <p className="text-sm text-green-700 mt-1">
                        Los archivos CSV han sido validados correctamente
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Extracto Bancario
                    </h4>
                    <p className="text-2xl font-bold text-primary">
                      {registrosBanco.length}
                    </p>
                    <p className="text-xs text-gray-600">transacciones</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Registros Sistema
                    </h4>
                    <p className="text-2xl font-bold text-primary">
                      {registrosSistema.length}
                    </p>
                    <p className="text-xs text-gray-600">transacciones</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between border-t border-gray-200 pt-6">
                <Button variant="secondary" onClick={() => setStep(2)} size="lg">
                  ← Atrás
                </Button>
                <Button onClick={handleStep3Execute} size="lg">
                  Ejecutar Conciliación →
                </Button>
              </div>
            </>
          )}
        </Card>
      )}

      {/* Paso 4: Procesamiento */}
      {step === 4 && (
        <Card className="mb-8">
          <div className="text-center py-16">
            <Spinner size="lg" className="mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Procesando Conciliación
            </h2>
            <p className="text-gray-600 text-lg">
              Analizando las transacciones con IA...
            </p>
            <div className="mt-6 flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

