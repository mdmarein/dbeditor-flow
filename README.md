# DBEditor Flow

Editor de CSV/XLSX standalone, extraído del editor de DataB Flow. Sin dependencias npm, sin build step: un servidor HTTP mínimo en Node.js sirviendo un frontend estático con módulos ES.

## Requisitos

- Node.js >= 14

## Uso

```bash
npm start
```

Levanta el servidor en `http://localhost:3100` (configurable con `PORT`) y abre el navegador automáticamente. También hay un modo watch para desarrollo:

```bash
npm run dev
```

Alternativas sin terminal:

- **Mac / Linux**: `./start.sh`
- **Windows**: doble clic en `start.bat`

### Acceso directo de escritorio (opcional)

- **macOS**: `bash tools/make-mac-app.sh` crea `DBEditor Flow.app` en el Desktop (bundle real, con ícono y firma ad-hoc). Doble clic arranca el servidor en segundo plano y abre el navegador; si ya está corriendo, solo abre el navegador.
- **Windows**: doble clic en `tools/make-win-shortcut.bat` crea un acceso directo "DBEditor Flow" en el Desktop que usa `tools/launch-windows.vbs` para arrancar el servidor sin ventana de consola.
- **Linux**: no hay generador de acceso directo dedicado; usar `./start.sh` desde una terminal.

## Estructura

```
dbeditor-flow/
├── server.js                     # Servidor HTTP (sin deps), rutas API, estáticos
├── start.sh / start.bat          # Arranque manual (Mac/Linux · Windows)
├── tools/
│   ├── make-mac-app.sh           # Genera DBEditor Flow.app para el Desktop (macOS)
│   ├── make-win-shortcut.bat     # Genera acceso directo para el Desktop (Windows)
│   ├── launch-windows.vbs        # Lanzador silencioso (usado por el acceso directo de Windows)
│   └── icons/                    # AppIcon.icns · dbeditor-flow.ico · dbeditor-flow_icon.png
├── data/
│   └── prep-formats.json         # Presets de formato número/fecha guardados por el usuario
└── public/
    ├── index.html                 # Shell: pantalla de import + editor
    ├── css/styles.css
    ├── img/                       # Favicons (16/32/192/512 + .ico) · logo · ícono
    └── js/
        ├── editor-core.js         # Lógica de la UI: tabla, sidebar, herramientas, edición inline
        └── modules/
            ├── parser.js           # Parser/serializer CSV (RFC 4180), auto-detección de separador
            ├── xlsx-parser.js      # Parser XLSX sin dependencias (ZIP + DecompressionStream nativo)
            ├── prep.js             # Transformaciones puras de columnas (split, merge, formato, etc.)
            ├── i18n.js             # Diccionario ES/EN
            └── utils.js            # Helpers de DOM, toast, etc.
```

## Cómo funciona

1. **Carga de archivo**: pantalla de drop/selección en `index.html`. Acepta `.csv`, `.tsv`, `.xlsx`. Todo se procesa client-side; no se envía nada al servidor.
2. **Parsing**: CSV/TSV vía `parser.js` (auto-detecta separador: tab > `;` > `,`); XLSX vía `xlsx-parser.js`, que descomprime el ZIP usando `DecompressionStream` nativo del browser — requiere Chrome 80+, Firefox 113+ o Safari 16.4+.
3. **Edición**: `editor-core.js` renderiza la tabla paginada y una sidebar con herramientas: eliminar columnas, agregar, reordenar, renombrar, split, merge, formato de números/fechas, mayúsculas/minúsculas, limpiar espacios, quitar por posición, agregar texto y buscar/reemplazar. Cada transformación es una función pura en `prep.js` — nunca muta el estado en el lugar.
4. **Undo/redo**: historial de snapshots completos del CSV (`_prepHistory` / `_redoHistory`) en memoria.
5. **Persistencia**: el único estado que persiste en el servidor son los presets de formato numérico/fecha (`data/prep-formats.json`). El tema y el idioma se guardan en `localStorage`.

## API

| Ruta | Método | Descripción |
|---|---|---|
| `/api/prep-formats` | GET | Devuelve presets de formato (número, moneda, porcentaje, fecha) |
| `/api/prep-formats` | POST | Guarda/actualiza los presets |
| `/api/health` | GET | Health check |

Cualquier ruta no reconocida sirve estáticos desde `public/` con fallback a `index.html`.

## Notas de desarrollo

- Sin bundler ni transpilación: los módulos JS del frontend son ES modules nativos (`<script type="module">`).
- Las claves de `localStorage` (`datab-lang`, `datab-theme`, `editor_*`) son heredadas de DataB Flow y se mantienen por compatibilidad.
- `server.js` no tiene dependencias npm — usa solo los módulos nativos de Node (`http`, `fs`, `path`, `url`).

## Licencia

AGPL-3.0-only — ver [LICENSE.md](LICENSE.md).
