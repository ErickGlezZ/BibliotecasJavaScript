// =========================================================
// main.js — Punto de entrada: conecta datos, UI y eventos
// =========================================================
import u from '../lib/umbrella.esm.js';
import * as store from './store.js';
import * as ui from './ui.js';
import { validar } from './validacion.js';
import { debounce } from './utils.js';

// Criterios actuales de búsqueda
const filtros = {
  texto: '',
  soloFavoritos: false,
  orden: 'nombre-asc',
};

// Id del contacto que se está editando (null = modo "nuevo")
let idEditando = null;

// ---------- Render central ----------
// Cada vez que cambian los datos o los filtros, se llama a esta función.
function actualizarVista() {
  const visibles = store.consultar(filtros);
  ui.renderLista(visibles, store.obtenerTodos().length);
  ui.marcarEditando(idEditando);
}

function salirDeEdicion() {
  idEditando = null;
  ui.limpiarFormulario();
  ui.marcarEditando(null);
}

// ---------- Acciones de cada contacto ----------
const acciones = {
  favorito(id) {
    store.alternarFavorito(id);
    actualizarVista();
  },

  editar(id) {
    const contacto = store.obtenerPorId(id);
    if (!contacto) return;
    idEditando = id;
    ui.mostrarErrores({});
    ui.llenarFormulario(contacto);
    ui.marcarEditando(id);
  },

  eliminar(id) {
    const contacto = store.obtenerPorId(id);
    if (!contacto) return;
    if (!confirm(`¿Eliminar a ${contacto.nombre}?`)) return;

    store.eliminar(id);
    if (idEditando === id) salirDeEdicion();
    actualizarVista();
    ui.notificar('Contacto eliminado');
  },
};

// ---------- Eventos ----------
function registrarEventos() {
  // Un solo listener para todos los botones de la lista (delegación).
  // Umbrella pone en e.currentTarget el botón que coincide con '[data-accion]'.
  u('#lista-contactos').on('click', '[data-accion]', (e) => {
    const boton = u(e.currentTarget);
    const id = boton.closest('.contacto').data('id');
    const accion = boton.data('accion');

    acciones[accion]?.(id);
  });

  // Guardar (crear o actualizar). .handle() evita que el form recargue la página.
  u('#form-contacto').handle('submit', () => {
    const { id, ...datos } = ui.leerFormulario();
    const errores = validar(datos);

    if (store.existeEmail(datos.email, idEditando)) {
      errores.email = 'Ya existe un contacto con ese correo';
    }

    ui.mostrarErrores(errores);
    if (Object.keys(errores).length > 0) return;

    if (idEditando) {
      store.actualizar(idEditando, datos);
      ui.notificar('Cambios guardados', 'exito');
    } else {
      store.crear(datos);
      ui.notificar('Contacto agregado', 'exito');
    }

    salirDeEdicion();
    actualizarVista();
  });

  u('#btn-cancelar').on('click', salirDeEdicion);

  // Buscador con debounce: filtra 250 ms después de dejar de escribir
  u('#buscador').on('input', debounce((e) => {
    filtros.texto = e.target.value;
    actualizarVista();
  }, 250));

  u('#orden').on('change', (e) => {
    filtros.orden = e.target.value;
    actualizarVista();
  });

  u('#solo-favoritos').on('change', (e) => {
    filtros.soloFavoritos = e.target.checked;
    actualizarVista();
  });

  // Tecla Escape cancela la edición
  u(document).on('keydown', (e) => {
    if (e.key === 'Escape' && idEditando) salirDeEdicion();
  });

  u('#btn-restablecer').on('click', async () => {
    if (!confirm('Se borrarán tus cambios y se cargarán los datos originales. ¿Continuar?')) return;
    salirDeEdicion();
    await iniciar(true);
    ui.notificar('Datos restablecidos');
  });
}

// ---------- Arranque ----------
async function iniciar(restablecer = false) {
  ui.mostrarError('');
  ui.mostrarCargando(true);

  try {
    await (restablecer ? store.restablecer() : store.cargar());
    actualizarVista();
  } catch (error) {
    console.error(error);
    ui.mostrarError(`${error.message}. ¿Abriste el proyecto con Live Server?`);
  } finally {
    ui.mostrarCargando(false);
  }
}

registrarEventos();
iniciar();
