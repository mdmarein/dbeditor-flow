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

## Estructura

```
dbeditor-flow/
├── server.js                    # Servidor HTTP (sin deps), rutas API, estáticos
├── data/
│   └── prep-formats.json        # Presets de formato número/fecha guardados por el usuario
└── public/
    ├── index.html                # Shell: pantalla de import + editor
    ├── css/styles.css
    └── js/
        ├── editor-core.js        # Lógica de la UI: tabla, sidebar, herramientas, edición inline
        └── modules/
            ├── parser.js          # Parser/serializer CSV (RFC 4180), auto-detección de separador
            ├── xlsx-parser.js     # Parser XLSX desde cero (ZIP + DecompressionStream nativo)
            ├── prep.js            # Transformaciones puras de columnas (split, merge, formato, etc.)
            ├── i18n.js            # Diccionario ES/EN
            └── utils.js           # Helpers de DOM, toast, etc.
```

## Cómo funciona

1. **Carga de archivo**: `index.html` muestra una pantalla de drop/selección (`#editor-dropscreen`). Acepta `.csv`, `.tsv`, `.xlsx`. Todo se procesa client-side, no se sube nada al servidor.
2. **Parsing**: CSV/TSV vía `parser.js` (detecta separador automáticamente); XLSX vía `xlsx-parser.js`, que descomprime el ZIP a mano usando `DecompressionStream` — requiere un browser moderno (Chrome 80+, Firefox 113+, Safari 16.4+).
3. **Edición**: `editor-core.js` renderiza la tabla paginada y una sidebar de herramientas (eliminar, agregar, reordenar, renombrar, split, merge, formato, mayúsculas/minúsculas, espacios, quitar por posición, agregar texto, buscar/reemplazar). Cada transformación pasa por `prep.js`, que son funciones puras `(csv) => csv` — nunca mutan el estado en el lugar.
4. **Undo/redo**: se mantiene un historial de snapshots del CSV completo (`_prepHistory` / `_redoHistory`) en `editor-core.js`.
5. **Persistencia liviana**: el único estado que toca el servidor son los presets de formato (`GET/POST /api/prep-formats`), guardados en `data/prep-formats.json`. El resto de las preferencias (separadores de merge, tema, idioma) vive en `localStorage` del navegador.

## API

| Ruta | Método | Descripción |
|---|---|---|
| `/api/prep-formats` | GET | Devuelve los presets de formato (número, moneda, porcentaje, fecha) |
| `/api/prep-formats` | POST | Guarda/actualiza los presets |
| `/api/health` | GET | Health check |

Cualquier ruta no reconocida sirve estáticos desde `public/` con fallback a `index.html` (SPA-style).

## Notas de desarrollo

- No hay bundler ni transpilación: todo el JS del frontend son módulos ES nativos (`<script type="module">`), así que cualquier browser reciente los corre tal cual.
- Las claves de `localStorage` (`datab-lang`, `datab-theme`, `editor_*`) se heredan de DataB Flow por compatibilidad; no fueron renombradas al separar este editor como proyecto standalone.
- `server.js` no tiene dependencias — usa solo los módulos nativos de Node (`http`, `fs`, `path`, `url`).

## Licencia

AGPL-3.0-only — ver [LICENSE.md](LICENSE.md).
