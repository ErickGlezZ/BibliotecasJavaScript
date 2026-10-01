// ============================================
// utils.js — Funciones genéricas reutilizables
// ============================================

/**
 * Escapa caracteres especiales para insertar texto de forma segura en HTML.
 * Evita ataques XSS: si alguien escribe <script> en un campo, se muestra como texto.
 */
export function escaparHTML(texto = '') {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Retrasa la ejecución de una función hasta que el usuario deja de escribir.
 * Así el buscador no filtra en cada tecla, solo cuando hay una pausa.
 */
export function debounce(funcion, espera = 250) {
  let temporizador;
  return (...args) => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => funcion(...args), espera);
  };
}

/** Genera un id único y corto. */
export function generarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/** "Ana López" -> "AL" */
export function iniciales(nombre) {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join('');
}

/** "4941234567" -> "494 123 4567" */
export function formatoTelefono(telefono) {
  return telefono.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
}
