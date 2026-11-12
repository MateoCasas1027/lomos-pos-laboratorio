# Lomos & Lomos Express — Laboratorio IV CRUD

Proyecto académico de **Programación Web, Universidad Libre, 2026-II**. Implementa un CRUD con **React, hooks `useState` y `useEffect`, helper `helpFetch`, Bootstrap y `json-server`**. Se inspira en el proyecto personal Lomos POS: https://mateocasas1107.github.io/lomos-pos/ . Esta implementación es independiente y usa datos ficticios.

## Requisitos
- Node.js 18 o superior.
- Terminal de VS Code o GitHub Codespaces.

## Instalación

```bash
npm install
```

## Ejecutar (DOS TERMINALES)

**Terminal 1 — API REST, puerto 3001:**
```bash
npm run api
```

**Terminal 2 — interfaz React, puerto 5173:**
```bash
npm run dev
```

Abrir http://localhost:5173 en VS Code local; en Codespaces, abrir la URL del puerto **5173** desde la pestaña **Ports**. Verificar que el puerto **3001** también esté reenviado y accesible desde el navegador. La URL del puerto de la API se genera automáticamente reemplazando `-5173.app.github.dev` por `-3001.app.github.dev` cuando se usa Codespaces. En Codespaces, si el puerto de la API está configurado en privado, usar la opción de visibilidad **Public** para la demostración; **no incluir datos reales**. Ambos servicios corren en paralelo.

> Nota: `json-server` guarda la información en `db.json` cuando se crean, editan o eliminan registros. No es `localStorage` del navegador. El enunciado menciona ambos, pero la implementación emplea la API ficticia exigida por el título y la guía.

## Módulos y endpoints
- Productos: `GET/POST http://localhost:3001/productos`, `PUT/DELETE /productos/:id`
- Clientes: `/clientes`
- Proveedores: `/proveedores`
- Compras: `/compras`
- Ventas: `/ventas`

## Funcionamiento
1. Seleccionar uno de los cinco módulos.
2. Crear un registro desde el formulario.
3. Verlo en la tabla (lectura).
4. Pulsar **Editar**, modificar y guardar.
5. Pulsar **Eliminar** y confirmar.

Los módulos de compras y ventas son **registros CRUD académicos**; no actualizan automáticamente existencias, no calculan impuestos ni emiten facturas fiscales. No utilizar como sistema de ventas de producción.

## Archivos clave
- `index.html`: entrada HTML.
- `src/index.jsx`: monta React e importa Bootstrap.
- `src/Negocio.jsx`: interfaz principal, módulos y hooks.
- `src/components/CrudTable.jsx`: formulario y operaciones CRUD.
- `src/helpers/helpFetch.js`: helper `fetch` y operaciones REST.
- `db.json`: datos de prueba y persistencia del servidor.

## Evidencias para entregar
- Captura del Codespace o repositorio GitHub.
- Captura de las dos terminales (puertos 3001 y 5173).
- Captura del frontend en navegador con datos.
- Captura posterior a crear, editar y eliminar un registro.
- Enlace público al repositorio.

**Limitación de GitHub Pages:** GitHub Pages solo publica contenido estático, así que no ejecuta el proceso `json-server`; para demostrar este laboratorio, usar VS Code local o Codespaces con ambos servidores activos.
