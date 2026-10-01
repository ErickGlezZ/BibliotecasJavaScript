// ===========================================
// validacion.js — Reglas del formulario
// ===========================================
// Cada regla regresa true si es válido, o un texto con el error.

const reglas = {
  nombre: (valor) =>
    valor.length >= 3 || 'El nombre debe tener al menos 3 caracteres',

  email: (valor) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor) || 'Escribe un correo válido',

  telefono: (valor) =>
    /^\d{10}$/.test(valor) || 'El teléfono debe tener 10 dígitos, sin espacios',
};

/**
 * Valida un objeto de datos y regresa los errores encontrados.
 * Ejemplo: { email: 'Escribe un correo válido' }. Objeto vacío = todo bien.
 */
export function validar(datos) {
  const errores = {};

  for (const [campo, regla] of Object.entries(reglas)) {
    const resultado = regla(datos[campo] ?? '');
    if (resultado !== true) errores[campo] = resultado;
  }

  return errores;
}

export const CAMPOS_VALIDADOS = Object.keys(reglas);
