<!-- Banner: public/img/dbeditor-flow-banner.png (pendiente) -->

# DBEditor Flow

**Editor de CSV y XLSX**

![version](https://img.shields.io/badge/version-1.0.0-blue) ![license](https://img.shields.io/badge/license-AGPL--3.0-green) ![node](https://img.shields.io/badge/node-%3E%3D14-brightgreen)

Editor standalone de archivos CSV, TSV y XLSX. Sin dependencias npm, sin build step — un servidor HTTP mínimo en Node.js sirve un frontend estático con módulos ES nativos. Extraído del editor integrado de DataB Flow.

---

## ¿Qué hace?

Cargás un archivo CSV, TSV o XLSX y lo editás directamente en una interfaz tipo planilla:

- Edita celdas directamente con doble clic
- Dividir columnas por delimitador
- Eliminar, agregar, reordenar y renombrar columnas
- Formatear: mayúsculas/minúsculas, recorte de espacios, búsqueda y reemplazo, agregar texto, presets de número/moneda/porcentaje/fecha
- Quitar caracteres por posición (inicio o fin)
- Merge: combinar dos columnas en una
- Deshacer / rehacer (hasta 30 pasos)
- Exportá el resultado en CSV con un clic
- Interfaz bilingüe (**español / inglés**) y con **tema claro y oscuro**

---

## Antes de empezar: instalar Node.js

DBEditor Flow necesita **Node.js v14 o superior**. Si ya lo tenés instalado, podés saltar este paso.

### Mac

1. Abrí el navegador y entrá a **https://nodejs.org**
2. Hacé clic en el botón verde **"LTS"** (versión recomendada)
3. Se descarga un archivo `.pkg` — hacé doble clic y seguí el instalador
4. Para verificar, abrí la app **Terminal** (`⌘ + Espacio`, escribí "Terminal") y ejecutá:
   ```bash
   node --version
   ```
   Tiene que aparecer algo como `v22.0.0` o superior.

### Windows

1. Abrí el navegador y entrá a **https://nodejs.org**
2. Hacé clic en el botón verde **"LTS"** (versión recomendada)
3. Se descarga un archivo `.msi` — hacé doble clic y seguí el instalador (dejá todas las opciones por defecto)
4. Para verificar, abrí el **Símbolo del sistema** (buscá "cmd" en el menú Inicio) y ejecutá:
   ```
   node --version
   ```
   Tiene que aparecer algo como `v22.0.0` o superior.

### Linux (Ubuntu / Debian)

Abrí una terminal y ejecutá:

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Para otras distros (Fedora, Arch, etc.), seguí las instrucciones en **https://nodejs.org/en/download/package-manager**

---

## Descargar DBEditor Flow

### Opción A — ZIP (más fácil, sin instalar nada extra)

1. Entrá a la página del proyecto en GitHub
2. Hacé clic en el botón verde **"Code"**
3. Seleccioná **"Download ZIP"**
4. Descomprimí el archivo en la carpeta que prefieras (ej: `Documentos/dbeditor-flow`)

### Opción B — git clone

```bash
git clone https://github.com/mdmarein/dbeditor-flow.git
cd dbeditor-flow
```

---

## Cómo correr la aplicación

Hay dos formas de iniciar DBEditor Flow: desde la terminal o como una app con ícono en el escritorio.

---

### Opción 1 — Desde la terminal

#### Mac / Linux

Abrí una terminal en la carpeta del proyecto y escribí:

```bash
node server.js
```

#### Windows

Abrí el Símbolo del sistema en la carpeta del proyecto y escribí:

```
node server.js
```

---

### Opción 2 — Instalar como app con ícono (recomendado)

Podés crear un acceso directo con ícono en tu escritorio para abrir DBEditor Flow con doble clic, sin necesidad de usar la terminal.

#### Mac — Crear "DBEditor Flow.app"

1. Abrí una terminal en la carpeta del proyecto
2. Ejecutá:
   ```bash
   bash tools/make-mac-app.sh
   ```
3. Se crea **"DBEditor Flow.app"** en tu escritorio
4. **Primera vez:** clic derecho sobre el ícono → **Abrir** (macOS pide confirmación una sola vez)
5. **Las siguientes veces:** doble clic normal

> El app inicia el servidor automáticamente y abre el navegador en `http://localhost:3100`.  
> Si el servidor ya está corriendo, solo abre el navegador.

#### Windows — Crear acceso directo

1. Abrí la carpeta del proyecto en el Explorador de archivos
2. Entrá a la carpeta `tools`
3. Hacé doble clic en **`make-win-shortcut.bat`**
4. Se crea **"DBEditor Flow"** en tu escritorio
5. Doble clic en el ícono para iniciar la app

> Si aparece un error de permisos, clic derecho → **Ejecutar como administrador**.

---

### Abrir la aplicación en el navegador

Si usás la opción terminal, con el servidor corriendo abrí tu navegador y entrá a:

```
http://localhost:3100
```

Si usás el ícono instalado, el navegador se abre automáticamente.

Para cerrar el servidor desde la terminal: presioná `Ctrl + C`.

**Cambiar puerto (opcional):**
```bash
PORT=8080 node server.js          # Mac / Linux
set PORT=8080 && node server.js   # Windows
```

---

## Guía de uso

### Importar archivo

Arrastrá tu archivo CSV, TSV o XLSX a la pantalla (o hacé clic para buscarlo). La app detecta automáticamente:
- El separador (coma `,`, punto y coma `;` o tabulación `\t`) — para CSV/TSV
- El encoding del archivo — para CSV/TSV

Para archivos **XLSX**: se lee la primera hoja. Las fórmulas muestran el valor cacheado. Los formatos de fecha aparecen como número serial de Excel (se pueden reformatear con la herramienta de formato incluida). Requiere Chrome 80+, Firefox 113+ o Safari 16.4+.

### Editar

La tabla aparece paginada. Podés editar una celda con doble clic, o usar las herramientas del sidebar:

| Herramienta | Qué hace |
|-------------|----------|
| **Dividir** | Separa una columna en dos por delimitador |
| **Eliminar** | Borra una o varias columnas |
| **Agregar** | Inserta una columna vacía |
| **Reordenar** | Cambia el orden de las columnas |
| **Renombrar** | Cambia el nombre del header |
| **Merge** | Combina dos columnas en una |
| **Formato** | Aplica presets de número, moneda, porcentaje o fecha |
| **Mayúsculas/minúsculas** | Convierte el case de los valores |
| **Espacios** | Recorta espacios al inicio/fin o los elimina todos |
| **Agregar texto** | Añade prefijo o sufijo a los valores |
| **Buscar y reemplazar** | Reemplaza texto en la columna |
| **Quitar por posición** | Elimina N caracteres desde el inicio o el final |

### Deshacer / rehacer

Botones `↩` y `↪` en el header — deshacé hasta 30 pasos.

### Exportar

Botón **Descargar CSV** — descarga el archivo con todos los cambios aplicados.

---

## Idioma y tema

- **Idioma**: botón `EN`/`ES` en el header. Cambiar de idioma recarga la página.
- **Tema**: botón de sol/luna en el header, oscuro por defecto. No recarga la página.

Ambas preferencias se guardan en `localStorage` y persisten entre sesiones.

---

## API

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/api/prep-formats` | GET | Devuelve presets de formato (número, moneda, porcentaje, fecha) |
| `/api/prep-formats` | POST | Guarda/actualiza los presets |
| `/api/health` | GET | Health check |

Cualquier ruta no reconocida sirve estáticos desde `public/` con fallback a `index.html`.

---

## Estructura del proyecto

```
dbeditor-flow/
├── server.js                     Servidor HTTP (sin deps), 3 endpoints REST + estáticos
├── start.sh / start.bat          Arranque manual (Mac/Linux · Windows)
├── tools/
│   ├── make-mac-app.sh           Genera DBEditor Flow.app para el Desktop (macOS)
│   ├── make-win-shortcut.bat     Genera acceso directo para el Desktop (Windows)
│   ├── launch-windows.vbs        Lanzador silencioso (usado por el acceso directo de Windows)
│   └── icons/                    AppIcon.icns · dbeditor-flow.ico · dbeditor-flow_icon.png
├── data/
│   └── prep-formats.json         Presets de formato número/fecha guardados por el usuario
└── public/
    ├── index.html                 Shell: pantalla de import + editor
    ├── css/styles.css
    ├── img/                       Favicons (16/32/192/512 + .ico) · logo · ícono
    └── js/
        ├── editor-core.js         Lógica de la UI: tabla, sidebar, herramientas, edición inline
        └── modules/
            ├── parser.js           Parser/serializer CSV (RFC 4180), auto-detección de separador
            ├── xlsx-parser.js      Parser XLSX sin dependencias (ZIP + DecompressionStream nativo)
            ├── prep.js             Transformaciones puras de columnas (split, merge, formato, etc.)
            ├── i18n.js             Diccionario ES/EN
            └── utils.js            Helpers de DOM, toast, etc.
```

---

## Arquitectura

### ¿Qué es?

Un editor standalone de archivos CSV, TSV y XLSX. Corre localmente en el navegador (`localhost:3100`), con backend Node.js y frontend en JavaScript vanilla. Sin dependencias npm. 100% offline — el servidor solo sirve archivos estáticos y guarda presets de formato; toda la edición ocurre en el cliente.

### Tech Stack

| Capa | Tecnología |
|------|-----------|
| **Backend** | Node.js puro (sin Express), CommonJS, 0 dependencias externas, 3 endpoints REST |
| **Frontend** | JavaScript ES6 modules + Vanilla JS, CSS3 con variables para temas claro/oscuro |
| **XLSX** | Parser ZIP + XML nativo (`DecompressionStream` + `DOMParser`) — sin librerías externas |
| **Undo/Redo** | Historial de snapshots completos del CSV en memoria (hasta 30 pasos) |
| **Storage** | `data/prep-formats.json` para presets, `localStorage` para preferencias de UI |

### Flujo de datos

```
CSV/TSV/XLSX → Parsing client-side → Tabla paginada
    → Herramientas de edición (sidebar) → Transformaciones puras en prep.js
    → Undo/Redo (snapshots en memoria)
    → Export CSV
```

### Decisiones de arquitectura clave

- **Zero deps** — sin `npm install`, fácil de deployar en cualquier entorno con Node.js
- **Todo client-side** — parsing, edición y export ocurren en el browser; el servidor solo sirve archivos estáticos y persiste presets de formato
- **XLSX sin librerías** — el parser XLSX descomprime el `.xlsx` (que es un ZIP) usando `DecompressionStream` nativo del browser; requiere Chrome 80+, Firefox 113+ o Safari 16.4+
- **Transformaciones puras** — cada operación es una función `(csv) => newCsv` en `prep.js`, nunca muta el estado en su lugar; facilita undo/redo por snapshots
- **Keys de localStorage heredadas** — `datab-lang`, `datab-theme`, `editor_*` son herencia de DataB Flow, mantenidas por compatibilidad

---

## Licencia

GNU Affero General Public License v3.0 — ver [LICENSE.md](LICENSE.md).

---

*DBEditor Flow · Editor de CSV y XLSX · © 2026 mdmarein · GNU AGPLv3*
