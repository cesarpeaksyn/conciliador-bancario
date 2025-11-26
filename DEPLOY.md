# Guía de Despliegue en Vercel

## Preparación

1. Asegúrate de tener una cuenta en [Vercel](https://vercel.com)
2. Instala la CLI de Vercel (opcional):
```bash
npm install -g vercel
```

## Método 1: Deploy desde la Web (Recomendado)

### Paso 1: Conectar Repositorio

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Conecta tu repositorio de Git (GitHub, GitLab o Bitbucket)
3. Selecciona el repositorio `conciliador-bancario`
4. Vercel detectará automáticamente que es un proyecto Next.js

### Paso 2: Configurar Variables de Entorno

En la sección de "Environment Variables", agrega:

```
AUTH_SECRET=tu-clave-secreta-muy-segura-aqui
NEXTAUTH_URL=https://tu-dominio.vercel.app
```

**Generar AUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Paso 3: Deploy

1. Haz clic en "Deploy"
2. Espera a que el build termine (2-3 minutos)
3. ¡Tu aplicación estará en vivo!

## Método 2: Deploy desde la CLI

### Paso 1: Login

```bash
vercel login
```

### Paso 2: Deploy

```bash
vercel
```

Sigue las instrucciones interactivas:
- Configurar nuevo proyecto
- Vincular al directorio actual
- Configurar settings (usa los defaults)

### Paso 3: Configurar Variables de Entorno

```bash
vercel env add AUTH_SECRET
vercel env add NEXTAUTH_URL
```

### Paso 4: Deploy a Producción

```bash
vercel --prod
```

## Post-Deployment

### Verificar la Aplicación

1. Abre la URL de Vercel en tu navegador
2. Deberías ver la página de login
3. Prueba con:
   - Usuario: `admin`
   - Contraseña: `admin`

### Configurar Dominio Personalizado (Opcional)

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Domains
3. Agrega tu dominio personalizado
4. Sigue las instrucciones para configurar DNS

### Monitoreo

- **Analytics:** Ve a la pestaña Analytics en Vercel
- **Logs:** Ve a la pestaña Deployments → [deployment] → Logs
- **Performance:** Vercel proporciona métricas de Web Vitals automáticamente

## Troubleshooting

### Error: "AUTH_SECRET is not defined"

Asegúrate de haber configurado las variables de entorno en Vercel Dashboard:
1. Settings → Environment Variables
2. Agrega `AUTH_SECRET` y `NEXTAUTH_URL`
3. Redeploy el proyecto

### Error de Build

Si el build falla:
1. Verifica que `npm run build` funcione localmente
2. Revisa los logs en Vercel Dashboard
3. Asegúrate de que todas las dependencias estén en `package.json`

### Error 404 en rutas

Vercel automáticamente configura las rutas de Next.js correctamente.
Si hay problemas:
1. Verifica que `next.config.ts` esté configurado correctamente
2. Revisa que no haya conflictos en middleware

## Actualizaciones Automáticas

Una vez conectado con Git:
- Cada push a `main` despliega automáticamente a producción
- Cada push a otras ramas crea un preview deployment
- Pull requests obtienen su propia URL de preview

## Rollback

Si algo sale mal:
1. Ve a Deployments en Vercel Dashboard
2. Encuentra el deployment anterior que funcionaba
3. Haz clic en los 3 puntos → "Promote to Production"

## Configuración Avanzada

### Build Settings

En `vercel.json` (opcional):
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

### Headers y Redirects

Si necesitas configurar headers personalizados, edita `next.config.ts`:
```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },
};
```

## Costos

- **Hobby Plan (Gratis):**
  - 100 GB bandwidth
  - Ideal para este MVP
  - Sin costo

- **Pro Plan ($20/mes por equipo):**
  - 1 TB bandwidth
  - Analytics avanzados
  - Recomendado para producción

## Seguridad

Para producción, considera:
1. Cambiar las credenciales mock por autenticación real
2. Implementar rate limiting
3. Configurar CORS apropiadamente
4. Usar variables de entorno para secretos
5. Habilitar HTTPS (automático en Vercel)

## Soporte

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Next.js](https://nextjs.org/docs)
- [Foro de la Comunidad](https://github.com/vercel/next.js/discussions)

