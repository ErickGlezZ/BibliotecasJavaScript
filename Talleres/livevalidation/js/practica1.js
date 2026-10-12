// =====================================================
// PRÁCTICA 1 - LIVEVALIDATION (VERSIÓN CORREGIDA)
// =====================================================
//
// En este archivo solamente escribimos NUESTRA lógica.
//
// La biblioteca ya fue cargada anteriormente mediante:
//
// <script src="js/livevalidation_standalone.js"></script>
//
// Por eso podemos utilizar:
// LiveValidation
// Validate.Presence
// Validate.Format
// Validate.Email
// Validate.Length
//
// Correcciones principales:
//
// 1. Validate.Length NO usa failureMessage: se usan
//    tooShortMessage / tooLongMessage. Antes la contraseña
//    mostraba el mensaje por defecto en inglés.
// 2. Para letras y espacios se usa Validate.Format (la regla
//    pensada para expresiones regulares) en lugar de Custom,
//    y se evita que un nombre sea solo espacios.
// 3. registrar() ahora valida TODOS los campos antes de
//    mostrar "Registro realizado exitosamente". Antes
//    se podía registrar con el formulario vacío.
//
// HTML necesario:
//   - Los inputs deben ser type="text" o type="password".
//     LiveValidation lanza error con type="email" o "number".
//   - Agrega novalidate al <form> para evitar los globos
//     de error del navegador.
// =====================================================


// Tiempo de espera (ms) tras dejar de escribir antes de validar.
var ESPERA = 400;


// =====================================================
// 1. VALIDACIÓN DEL NOMBRE
// =====================================================

// El texto "nombre" debe coincidir exactamente con
// el id del input HTML:
//
// <input id="nombre">

var nombre = new LiveValidation("nombre", {
  validMessage: "✓ Nombre válido",
  wait: ESPERA
});

// Validate.Presence comprueba que el campo no esté vacío.
nombre.add(Validate.Presence, {
  failureMessage: "El nombre es obligatorio"
});

nombre.add(Validate.Length, {
  minimum: 2,
  maximum: 50,
  tooShortMessage: "Debe tener al menos 2 caracteres",
  tooLongMessage: "No puede tener más de 50 caracteres"
});

// Validate.Format valida con una expresión regular.
// Letras (con acentos y ñ) separadas por espacios simples;
// no permite empezar con espacio ni dejar solo espacios.
nombre.add(Validate.Format, {
  pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+(?: [a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+)*$/,
  failureMessage: "El nombre solo puede contener letras y espacios"
});


// =====================================================
// 2. VALIDACIÓN DEL CORREO
// =====================================================

var correo = new LiveValidation("correo", {
  validMessage: "✓ Correo válido",
  wait: ESPERA
});

// Primero comprobamos que exista información.
correo.add(Validate.Presence, {
  failureMessage: "El correo es obligatorio"
});

// Después comprobamos que tenga formato de correo electrónico.
correo.add(Validate.Email, {
  failureMessage: "Introduce un correo válido (ejemplo@dominio.com)"
});


// =====================================================
// 3. VALIDACIÓN DE LA CONTRASEÑA
// =====================================================

var password = new LiveValidation("password", {
  validMessage: "✓ Contraseña válida",
  wait: ESPERA
});

// La contraseña es obligatoria.
password.add(Validate.Presence, {
  failureMessage: "La contraseña es obligatoria"
});

// Validate.Length permite establecer longitud mínima y máxima.
// Usa sus propios mensajes (NO failureMessage).
password.add(Validate.Length, {
  minimum: 8,
  maximum: 64,
  tooShortMessage: "La contraseña debe tener al menos 8 caracteres",
  tooLongMessage: "La contraseña no puede tener más de 64 caracteres"
});


// =====================================================
// 4. REGISTRO
// =====================================================
//
// Esta función se llama desde el HTML (botón o formulario).
// Valida todos los campos antes de continuar.
//
// Ejemplos de uso en el HTML:
//
//   <form id="formulario" novalidate onsubmit="return registrar(event)">
//
// o bien:
//
//   <button type="button" onclick="registrar()">Registrar</button>
// =====================================================

var campos = [nombre, correo, password];

function registrar(evento) {

  // Evita el envío nativo del formulario (si hay evento).
  if (evento && evento.preventDefault) {
    evento.preventDefault();
  }

  var primerInvalido = null;

  campos.forEach(function (lv) {
    // validate() fuerza la validación y muestra el mensaje,
    // incluso si el campo nunca fue tocado.
    var ok = lv.validate();

    if (!ok && !primerInvalido) {
      primerInvalido = lv.element;
    }
  });

  // Si hay errores, enfocamos el primero y no registramos.
  if (primerInvalido) {
    primerInvalido.focus();
    return false;
  }

  alert("Registro realizado exitosamente");
  location.reload();

  return false;
}