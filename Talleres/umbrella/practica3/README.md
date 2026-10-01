# Agenda de contactos con Umbrella JS (nivel profesional)

Aplicación CRUD (crear, leer, actualizar y eliminar) de contactos, organizada en módulos como un proyecto real.

## Funcionalidades
- Carga inicial de datos desde un archivo JSON con `fetch` (como si fuera una API), con estados de carga y error.
- Agregar y editar contactos con el mismo formulario.
- Validación por campo con mensajes, correo duplicado y accesibilidad (`aria-invalid`, foco en el primer error).
- Búsqueda con *debounce*, orden y filtro de favoritos.
- Eliminar con confirmación y notificaciones (toasts).
- Persistencia en `localStorage` y botón para restablecer los datos originales.
- Protección contra XSS al mostrar datos escritos por el usuario.

## Requisitos
- VS Code con la extensión **Live Server** (al abrir la carpeta, VS Code la sugiere automáticamente).
- **Importante:** abrir `index.html` con doble clic NO funciona. Los módulos (`import`/`export`) y `fetch` necesitan un servidor. Clic derecho en `index.html` > **Open with Live Server**.

## Estructura
```
umbrella-pro/
├── index.html            Estructura de la página
├── css/estilos.css       Estilos con variables CSS
├── data/contactos.json   Datos iniciales (simula una API)
├── lib/umbrella.esm.js   Umbrella JS en versión módulo
└── js/
    ├── main.js           Punto de entrada: conecta todo y registra eventos
    ├── store.js          Datos: carga, CRUD, filtros y localStorage (no toca el DOM)
    ├── ui.js             Interfaz: todo lo que dibuja o modifica la página
    ├── validacion.js     Reglas del formulario
    └── utils.js          Funciones genéricas (escapar HTML, debounce, etc.)
```

**Idea clave:** cada archivo tiene una sola responsabilidad. `store.js` no sabe que existe HTML; `ui.js` no sabe de dónde vienen los datos; `main.js` los conecta. Es el mismo principio de responsabilidad única que en SOLID.

## Flujo de la aplicación
```
Evento del usuario (main.js)
   → modifica los datos (store.js)
   → actualizarVista()
   → store.consultar(filtros)
   → ui.renderLista()
```
Toda la interfaz se redibuja desde una sola función (`actualizarVista`). Así nunca queda desincronizada con los datos.

## Umbrella JS en esta práctica
| Método | Uso en el proyecto |
|---|---|
| `import u from '../lib/umbrella.esm.js'` | Umbrella como módulo, sin variables globales |
| `.on('click', '[data-accion]', fn)` | Un solo listener para todos los botones de la lista |
| `e.currentTarget` | Umbrella lo apunta al elemento que coincidió con el selector delegado |
| `.closest()` + `.data()` | Del botón al `<li>` para leer `data-id` y `data-accion` |
| `.handle('submit', fn)` | Envío del formulario sin recargar la página |
| `.serialize()` | Convierte el formulario en texto; con `URLSearchParams` se vuelve objeto |
| `.attr('aria-invalid', null)` | Pasar `null` quita el atributo |
| `.toggleClass('oculto', bool)` | Mostrar u ocultar estados |
| `.html()` | Dibujar toda la lista de una vez |
| `u('<div>...</div>')` | Crear elementos nuevos (notificaciones) |
| `u(document).on('keydown')` | Atajo: Escape cancela la edición |

## Orden sugerido para explicarla
1. **Estructura y Live Server:** mostrar el error que sale al abrir con doble clic y explicar por qué.
2. **store.js:** los datos viven aquí. Explicar `async/await` en `cargar()` y la copia en `obtenerTodos()`.
3. **main.js → actualizarVista():** el flujo central.
4. **Delegación con acciones:** el objeto `acciones` y el listener único con `data-accion`. Agregar una acción nueva es solo agregar un método al objeto.
5. **Formulario:** `serialize()`, validación, correo duplicado y modo edición.
6. **Seguridad:** agregar un contacto llamado `<b>Hola</b>`. Se ve como texto, no en negritas. Luego quitar `escaparHTML` en `ui.js` para mostrar la diferencia.
7. **Debounce:** poner un `console.log` en el filtro y comparar con y sin debounce.

## Retos
1. **Exportar:** botón que descargue los contactos como archivo JSON.
2. **Deshacer:** al eliminar, mostrar un toast con botón "Deshacer" durante 5 segundos.
3. **Grupos:** agregar un campo `grupo` (Trabajo, Escuela, Familia) con filtro por grupo.
4. **Validación en vivo:** validar cada campo al salir de él (evento `blur`) y no solo al enviar.
5. **API real:** reemplazar `data/contactos.json` por una API propia (por ejemplo, en FastAPI) cambiando solo `store.js`.
