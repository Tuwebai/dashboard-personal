# dashboard-personal

## Deploy en Netlify

### Build
- Comando: `npm run build`
- Publish directory: `dist`
- Node: `22`

### Variables de entorno
Cargá estas variables en **Site configuration > Environment variables** de Netlify y marcá las sensibles como secretas:

- `VITE_PERSISTENCE_MODE`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `VITE_FIREBASE_ENABLE_ANONYMOUS_AUTH`
- `VITE_FIREBASE_PERSISTENCE_DOC_PATH`

Usá `.env.example` como referencia. No subas valores reales al repo.

### Configuración incluida en el repo
- `netlify.toml` define build y publish
- rewrite SPA para rutas de Vite/React
- headers base de seguridad
- cache larga para `/assets/*`

### Checklist de producción
- Agregar el dominio de Netlify en Firebase Authentication > Authorized domains
- Verificar Firestore rules antes del primer deploy productivo
- Confirmar que el sitio use las variables reales en Netlify, no `.env` local
