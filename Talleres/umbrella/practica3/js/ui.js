// =====================================================
// ui.js — Todo lo que dibuja o modifica la interfaz
// =====================================================
import u from '../lib/umbrella.esm.js';
import { escaparHTML, iniciales, formatoTelefono } from './utils.js';
import { CAMPOS_VALIDADOS } from './validacion.js';

// ---------- Plantilla de un contacto ----------
// Todo dato que viene del usuario pasa por escaparHTML().
function plantillaContacto(c) {
  const nombre = escaparHTML(c.nombre);
  const empresa = c.empresa ? ` · ${escaparHTML(c.empresa)}` : '';

  return `
    <li class="contacto" data-id="${escaparHTML(c.id)}">
      <span class="avatar" aria-hidden="true">${escaparHTML(iniciales(c.nombre))}</span>
      <div>
        <div class="nombre">${nombre}</div>
        <div class="detalle">${escaparHTML(c.email)}${empresa}</div>
        <div class="detalle">${escaparHTML(formatoTelefono(c.telefono))}</div>
      </div>
      <div class="acciones">
        <button class="btn-favorito" type="button" data-accion="favorito"
                aria-pressed="${c.favorito}" aria-label="Marcar a ${nombre} como favorito">★</button>
        <button class="btn btn-texto" type="button" data-accion="editar">Editar</button>
        <button class="btn btn-peligro" type="button" data-accion="eliminar">Eliminar</button>
      </div>
    </li>`;
}

// ---------- Lista ----------
export function renderLista(contactos, total) {
  u('#lista-contactos').html(contactos.map(plantillaContacto).join(''));
  u('#estado-vacio').toggleClass('oculto', contactos.length > 0);
  u('#resumen').text(`Mostrando ${contactos.length} de ${total} contactos`);
}

export function marcarEditando(id) {
  u('.contacto').removeClass('editando');
  if (id) u(`.contacto[data-id="${id}"]`).addClass('editando');
}

// ---------- Estados de carga ----------
export function mostrarCargando(activo) {
  u('#estado-cargando').toggleClass('oculto', !activo);
}

export function mostrarError(mensaje) {
  u('#estado-error').text(mensaje).toggleClass('oculto', !mensaje);
}

// ---------- Formulario ----------
/** Convierte el formulario en un objeto: { nombre: '...', email: '...' } */
export function leerFormulario() {
  // .serialize() regresa "nombre=Ana&email=..." y URLSearchParams lo convierte
  const params = new URLSearchParams(u('#form-contacto').serialize());
  const datos = Object.fromEntries(params);

  // Limpiamos espacios al inicio y al final de cada valor
  for (const clave in datos) datos[clave] = datos[clave].trim();
  return datos;
}

export function llenarFormulario(contacto) {
  const form = u('#form-contacto').first();
  ['id', 'nombre', 'email', 'telefono', 'empresa'].forEach((campo) => {
    form.elements[campo].value = contacto[campo] ?? '';
  });

  u('#titulo-form').text('Editar contacto');
  u('#btn-guardar').text('Guardar cambios');
  u('#btn-cancelar').removeClass('oculto');
  u('#nombre').first().focus();
}

export function limpiarFormulario() {
  u('#form-contacto').first().reset();
  u('#form-contacto [name="id"]').first().value = '';
  mostrarErrores({});

  u('#titulo-form').text('Nuevo contacto');
  u('#btn-guardar').text('Agregar contacto');
  u('#btn-cancelar').addClass('oculto');
}

/** Muestra u oculta el mensaje de error de cada campo. */
export function mostrarErrores(errores) {
  CAMPOS_VALIDADOS.forEach((campo) => {
    const mensaje = errores[campo] || '';
    u(`#error-${campo}`).text(mensaje);
    // Con null, Umbrella QUITA el atributo
    u(`#${campo}`).attr('aria-invalid', mensaje ? 'true' : null);
  });

  // Llevamos el foco al primer campo con error
  const primero = CAMPOS_VALIDADOS.find((campo) => errores[campo]);
  if (primero) u(`#${primero}`).first().focus();
}

// ---------- Notificaciones ----------
export function notificar(mensaje, tipo = 'info') {
  const toast = u(`<div class="toast ${tipo}" role="status">${escaparHTML(mensaje)}</div>`);
  u('#toasts').append(toast);
  setTimeout(() => toast.remove(), 3000);
}
