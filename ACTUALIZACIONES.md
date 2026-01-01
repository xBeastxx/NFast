# 🚀 Configuración de Actualizaciones Automáticas

## Resumen
NFast PRO está configurado para actualizaciones automáticas desde GitHub Releases usando `electron-updater`.

## ✅ Configuración Completada

### 1. **package.json**
- ✅ Configurado `publish` para GitHub
- ✅ Owner: `xBeastxx`
- ✅ Repo: `NFast`

### 2. **main.ts**
- ✅ Auto-updater habilitado
- ✅ Busca actualizaciones al iniciar la app
- ✅ Notifica automáticamente cuando hay una actualización

### 3. **Archivos Generados**
Cuando ejecutas `npm run package`, se generan automáticamente:
- `NFast PRO Setup 1.0.1.exe` - Instalador
- `latest.yml` - Archivo de metadatos para actualizaciones
- `NFast PRO Setup 1.0.1.exe.blockmap` - Mapa para actualizaciones delta

## 📝 Cómo Publicar una Actualización

### Paso 1: Actualizar Versión
Edita `package.json`:
```json
{
  "version": "1.0.2"  // <- Incrementa la versión
}
```

### Paso 2: Compilar
```bash
npm run package
```

Esto generará en la carpeta `release/`:
- `NFast PRO Setup 1.0.2.exe`
- `latest.yml`
- `NFast PRO Setup 1.0.2.exe.blockmap`

### Paso 3: Crear Release en GitHub

#### Opción A: Mediante GitHub Web
1. Ve a: `https://github.com/xBeastxx/NFast/releases`
2. Clic en "Create a new release"
3. Tag version: `v1.0.2` (debe coincidir con la versión del package.json)
4. Release title: `NFast PRO v1.0.2`
5. Arrastra los siguientes archivos:
   - ✅ **REQUERIDO**: `NFast PRO Setup 1.0.2.exe`
   - ✅ **REQUERIDO**: `latest.yml`
   - ⚙️ **OPCIONAL**: `NFast PRO Setup 1.0.2.exe.blockmap` (para actualizaciones delta)
6. Publica el release

> **Nota**: El archivo `.blockmap` es opcional. Sin él, las actualizaciones funcionan igual pero descargan el instalador completo. Con él, solo se descargan los cambios (ahorro de ancho de banda).

#### Opción B: Mediante GitHub CLI
```bash
# Instalar GitHub CLI si no lo tienes
# https://cli.github.com/

# Crear release
gh release create v1.0.2 \
  --title "NFast PRO v1.0.2" \
  --notes "Descripción de los cambios" \
  "release/NFast PRO Setup 1.0.2.exe" \
  "release/latest.yml" \
  "release/NFast PRO Setup 1.0.2.exe.blockmap"
```

### Paso 4: Las Apps se Actualizan Automáticamente
- Cuando los usuarios abran NFast PRO, automáticamente:
  1. Busca actualizaciones en GitHub Releases
  2. Descarga la nueva versión si está disponible
  3. Notifica al usuario
  4. Se instala al reiniciar la app

## 🔐 Token de GitHub (Opcional para CI/CD)

Si quieres automatizar la subida desde la línea de comandos:

1. Crea un Personal Access Token en GitHub:
   - Ve a: Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Genera un nuevo token con permisos: `repo`

2. Guarda el token como variable de entorno:
   ```bash
   export GH_TOKEN="tu_token_aquí"
   ```

3. Publica directamente:
   ```bash
   npm run package -- --publish always
   ```

## 📋 Estructura de latest.yml

Ejemplo del archivo `latest.yml` generado automáticamente:
```yaml
version: 1.0.2
files:
  - url: NFast PRO Setup 1.0.2.exe
    sha512: [hash del archivo]
    size: [tamaño en bytes]
path: NFast PRO Setup 1.0.2.exe
sha512: [hash del archivo]
releaseDate: '2025-01-01T19:00:00.000Z'
```

## 🎯 Verificar que Funciona

1. Compila la versión actual: `npm run package`
2. Instala la app en tu PC
3. Incrementa la versión en `package.json`
4. Compila de nuevo: `npm run package`
5. Sube la nueva versión a GitHub Releases
6. Abre la app instalada
7. Deberías ver en la consola de desarrollador (Ctrl+Shift+I):
   ```
   [Updater] Checking for updates...
   [Updater] Update available: {...}
   ```

## ⚠️ Notas Importantes

- **Versión Semántica**: Usa formato `X.Y.Z` (ejemplo: 1.0.2)
- **Tag en GitHub**: Debe ser `vX.Y.Z` (ejemplo: v1.0.2)
- **latest.yml**: SIEMPRE debe estar en el release
- **Archivos Mínimos Requeridos**: Instalador (.exe) + latest.yml
- **Blockmap**: Opcional, pero recomendado para optimizar descargas
- **Repositorio Público**: El repositorio debe ser público o configurar autenticación

## 🐛 Solución de Problemas

### No encuentra actualizaciones
- Verifica que el repositorio sea `xBeastxx/NFast`
- Verifica que hayas creado un release (no solo un tag)
- Verifica que `latest.yml` esté en el release

### Error de permisos
- Si el repo es privado, configura `GH_TOKEN`

### Actualización no se instala
- Verifica que el `blockmap` esté en el release
- Cierra completamente la app y vuelve a abrirla

## 📚 Recursos
- [electron-updater docs](https://www.electron.build/auto-update)
- [GitHub Releases docs](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)
