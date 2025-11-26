# Conciliador Bancario MVP

Sistema de conciliación bancaria para ejecutivos que permite subir extractos bancarios y registros internos en formato CSV, ejecutar una conciliación asistida por IA (mock) y visualizar reportes de hallazgos.

## 🚀 Características

- ✅ Autenticación mock con NextAuth
- 📊 Dashboard con histórico de conciliaciones
- 📁 Carga de archivos CSV con validación completa
- 🤖 Motor de conciliación mock con análisis inteligente
- 📈 Visualización de KPIs y gráficos comparativos
- 🔍 Filtros y búsqueda en histórico
- 📱 Diseño responsive (desktop-first)

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Autenticación:** NextAuth.js
- **Gráficos:** Chart.js + react-chartjs-2
- **Parseo CSV:** PapaParse
- **Gestión de Estado:** React Context API
- **Persistencia:** LocalStorage (temporal)

## 📋 Prerequisitos

- Node.js 18+ 
- npm o yarn

## 🔧 Instalación

1. Clonar el repositorio
```bash
git clone <repository-url>
cd conciliador-bancario
```

2. Instalar dependencias
```bash
npm install
```

3. Ejecutar en modo desarrollo
```bash
npm run dev
```

4. Abrir en el navegador
```
http://localhost:3000
```

## 🔐 Credenciales de Acceso

**Usuario:** `admin`  
**Contraseña:** `admin`

## 📁 Estructura del Proyecto

```
/app
  /(auth)
    /login              # Página de login
  /(dashboard)
    /dashboard          # Dashboard principal
    /conciliaciones
      /nueva            # Wizard de nueva conciliación
      /[id]             # Detalle de conciliación
  /api
    /auth/[...nextauth] # API de NextAuth
/components
  /ui                   # Componentes base (Button, Card, Input, etc.)
  /conciliaciones       # Componentes específicos
  /layout               # Sidebar, Header
  /providers            # Session Provider
/lib
  /contexts             # Context API (Conciliaciones)
  /utils                # Utilidades (validación CSV, formatters)
  /mock                 # Motor de conciliación mock y datos seed
/types                  # Interfaces TypeScript
```

## 📊 Formato de CSV Requerido

Los archivos CSV deben contener las siguientes columnas (orden no importa, case-insensitive):

- `fecha` - Formato: DD/MM/YYYY, DD-MM-YYYY o YYYY-MM-DD
- `monto` - Número (puede incluir separadores de miles y decimales)
- `descripcion` - Texto descriptivo de la transacción
- `referencia` - Identificador único de la transacción

### Ejemplo de CSV Válido

```csv
fecha,monto,descripcion,referencia
26/11/2025,1500.00,Transferencia entrante,REF001
25/11/2025,2300.50,Depósito,REF002
24/11/2025,850.75,Pago servicios,REF003
```

## 🧪 Testing

Para probar la aplicación:

1. Iniciar sesión con `admin` / `admin`
2. En el dashboard verás 5 conciliaciones de ejemplo pre-cargadas
3. Crear una nueva conciliación:
   - Completar metadatos (nombre, cuenta, fecha de corte)
   - Subir dos archivos CSV válidos
   - El sistema validará el formato y estructura
   - Ejecutar la conciliación
   - Ver el reporte completo con KPIs y observaciones

## 🌐 Deploy en Vercel

1. Conectar el repositorio con Vercel
2. Configurar variables de entorno:
   - `AUTH_SECRET` - Clave secreta para NextAuth
   - `NEXTAUTH_URL` - URL de producción
3. Deploy automático en cada push a main

## 🔄 Próximos Pasos (Post-MVP)

- [ ] Backend real con API REST
- [ ] Base de datos MongoDB con Prisma
- [ ] Integración con OpenAI para análisis real
- [ ] Almacenamiento de archivos en AWS S3
- [ ] Multi-usuario y multi-empresa
- [ ] Exportación de reportes (PDF, Excel)
- [ ] Detalle por transacción individual
- [ ] Historial de cambios y auditoría
- [ ] Notificaciones y alertas

## 📝 Notas de Desarrollo

- La aplicación usa datos mock y no persiste entre sesiones del navegador (localStorage)
- El motor de conciliación es simulado y realiza matching básico por referencia y monto
- NextAuth está configurado en modo mock solo para demostración
- No se almacenan credenciales reales en el código

## 📄 Licencia

MIT

## 👥 Equipo

Desarrollado para ejecutivos bancarios como MVP interno.
