// ======================================================
// store.js — Estado de la aplicación y persistencia
// ======================================================
// Este módulo NO toca el DOM. Solo maneja los datos.
// Separar datos de interfaz hace el código más fácil de probar y mantener.

import { generarId } from './utils.js';

const CLAVE_STORAGE = 'agenda-contactos:v1';
const URL_DATOS_INICIALES = 'data/contactos.json';

let contactos = [];

function guardar() {
  try {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(contactos));
  } catch (error) {
    console.warn('No se pudo guardar en localStorage:', error);
  }
}

function leerGuardados() {
  try {
    const texto = localStorage.getItem(CLAVE_STORAGE);
    return texto ? JSON.parse(texto) : null;
  } catch {
    return null; // Si el JSON está dañado, se ignora
  }
}

/**
 * Carga los contactos: primero de localStorage y, si no hay, del archivo JSON.
 * Es async porque fetch() tarda (igual que una petición a una API real).
 */
export async function cargar() {
  const guardados = leerGuardados();
  if (guardados) {
    contactos = guardados;
    return contactos;
  }

  const respuesta = await fetch(URL_DATOS_INICIALES);
  if (!respuesta.ok) {
    throw new Error(`No se pudieron cargar los datos (HTTP ${respuesta.status})`);
  }
  contactos = await respuesta.json();
  guardar();
  return contactos;
}

export async function restablecer() {
  localStorage.removeItem(CLAVE_STORAGE);
  return cargar();
}

// ---------- Consultas ----------
export function obtenerTodos() {
  return [...contactos]; // copia: nadie modifica el arreglo original por accidente
}

export function obtenerPorId(id) {
  return contactos.find((c) => c.id === id);
}

export function existeEmail(email, idIgnorar = null) {
  return contactos.some(
    (c) => c.email.toLowerCase() === email.toLowerCase() && c.id !== idIgnorar
  );
}

/** Filtra y ordena según los criterios de la interfaz. */
export function consultar({ texto = '', soloFavoritos = false, orden = 'nombre-asc' }) {
  const busqueda = texto.toLowerCase().trim();

  const resultado = contactos.filter((c) => {
    if (soloFavoritos && !c.favorito) return false;
    if (!busqueda) return true;
    return [c.nombre, c.email, c.empresa]
      .some((campo) => (campo || '').toLowerCase().includes(busqueda));
  });

  const comparadores = {
    'nombre-asc': (a, b) => a.nombre.localeCompare(b.nombre, 'es'),
    'nombre-desc': (a, b) => b.nombre.localeCompare(a.nombre, 'es'),
    recientes: (a, b) => b.creado - a.creado,
  };

  return resultado.sort(comparadores[orden]);
}

// ---------- Operaciones CRUD ----------
export function crear(datos) {
  const nuevo = { ...datos, id: generarId(), favorito: false, creado: Date.now() };
  contactos.push(nuevo);
  guardar();
  return nuevo;
}

export function actualizar(id, datos) {
  contactos = contactos.map((c) => (c.id === id ? { ...c, ...datos, id } : c));
  guardar();
}

export function eliminar(id) {
  contactos = contactos.filter((c) => c.id !== id);
  guardar();
}

export function alternarFavorito(id) {
  const contacto = obtenerPorId(id);
  if (contacto) actualizar(id, { favorito: !contacto.favorito });
}
