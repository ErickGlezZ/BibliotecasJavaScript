// =====================================================
// PRÁCTICA 2 - LIVEVALIDATION (VERSIÓN CORREGIDA)
// =====================================================
//
// Correcciones principales:
//
// 1. LiveValidation NO soporta <input type="number">.
//    El campo "edad" debe ser type="text" (ver HTML abajo).
//    Como seguro, el JS lo convierte antes de crear el validador.
// 2. Se reemplaza massValidate (no siempre existe en la
//    versión standalone) por un ciclo con validate().
// 3. Length y Numericality usan sus mensajes propios.
// 4. Todos los campos son obligatorios (Presence).
// 5. La confirmación se revalida al cambiar la contraseña.
// 6. Al enviar se muestran todos los errores y se enfoca
//    el primer campo inválido.
//
// HTML necesario:
//   <form id="formulario" novalidate>
//   <input type="text" id="telefono" inputmode="numeric" maxlength="10">
//   <input type="text" id="edad" inputmode="numeric">
// =====================================================


// Tiempo de espera común para validar mientras se escribe.
// Solo afecta a campos de texto, no a checkbox.
var ESPERA = 500;


// Seguro: si en el HTML quedó type="number", lo cambiamos
// ANTES de crear el validador (si no, la biblioteca lanza
// un error y el resto del script no se ejecuta).
document.getElementById("edad").type = "text";


// =====================================================
// USUARIO
// =====================================================

var usuario = new LiveValidation("usuario", {
  validMessage: "✓ Usuario válido",
  wait: ESPERA
});

usuario.add(Validate.Presence, {
  failureMessage: "El usuario es obligatorio"
});

// Length NO usa failureMessage: se usan estos mensajes específicos.
usuario.add(Validate.Length, {
  minimum: 5,
  maximum: 20,
  tooShortMessage: "Debe tener al menos 5 caracteres",
  tooLongMessage: "No puede tener más de 20 caracteres"
});

// Sin espacios ni símbolos raros.
usuario.add(Validate.Format, {
  pattern: /^[A-Za-z0-9_]+$/,
  failureMessage: "Solo letras, números y guion bajo (_), sin espacios"
});


// =====================================================
// TELÉFONO
// =====================================================

var telefono = new LiveValidation("telefono", {
  validMessage: "✓ Teléfono válido",
  wait: ESPERA
});

telefono.add(Validate.Presence, {
  failureMessage: "El teléfono es obligatorio"
});

// Primero: solo números.
telefono.add(Validate.Format, {
  pattern: /^[0-9]+$/,
  failureMessage: "El teléfono solo puede contener números"
});

// Después: exactamente 10 dígitos.
telefono.add(Validate.Format, {
  pattern: /^[0-9]{10}$/,
  failureMessage: "El teléfono debe contener exactamente 10 dígitos"
});


// =====================================================
// EDAD
// =====================================================

var edad = new LiveValidation("edad", {
  validMessage: "✓ Edad válida",
  wait: ESPERA
});

// Presence es necesario: Number("") vale 0 y sin esta regla
// un campo vacío se evaluaría como "demasiado bajo".
edad.add(Validate.Presence, {
  failureMessage: "La edad es obligatoria"
});

// Numericality NO usa failureMessage: se usan estos mensajes específicos.
edad.add(Validate.Numericality, {
  onlyInteger: true,
  minimum: 18,
  maximum: 100,
  notANumberMessage: "La edad debe ser un número",
  notAnIntegerMessage: "La edad debe ser un número entero",
  tooLowMessage: "Debes tener al menos 18 años",
  tooHighMessage: "La edad no puede ser mayor a 100"
});


// =====================================================
// CONTRASEÑA
// =====================================================

var password = new LiveValidation("password", {
  validMessage: "✓ Contraseña válida",
  wait: ESPERA
});

password.add(Validate.Presence, {
  failureMessage: "La contraseña es obligatoria"
});

password.add(Validate.Length, {
  minimum: 8,
  maximum: 64,
  tooShortMessage: "Debe tener al menos 8 caracteres",
  tooLongMessage: "No puede tener más de 64 caracteres"
});

// Una regla Format por requisito, cada una con su mensaje:
// el usuario ve exactamente qué le falta.
password.add(Validate.Format, {
  pattern: /[A-Z]/,
  failureMessage: "Debe incluir al menos una mayúscula"
});

password.add(Validate.Format, {
  pattern: /[0-9]/,
  failureMessage: "Debe incluir al menos un número"
});


// =====================================================
// CONFIRMAR CONTRASEÑA
// =====================================================

var confirmar = new LiveValidation("confirmar", {
  validMessage: "✓ Las contraseñas coinciden",
  wait: ESPERA
});

confirmar.add(Validate.Presence, {
  failureMessage: "Debes confirmar la contraseña"
});

// Confirmation compara este campo con el campo "password".
confirmar.add(Validate.Confirmation, {
  match: "password",
  failureMessage: "Las contraseñas no coinciden"
});

// Si cambia la contraseña, se revalida la confirmación
// (solo si el usuario ya escribió algo en ella).
document.getElementById("password").addEventListener("input", function () {
  if (confirmar.element.value !== "") {
    confirmar.validate();
  }
});


// =====================================================
// TÉRMINOS
// =====================================================

var terminos = new LiveValidation("terminos", {
  validMessage: "✓ Términos aceptados",

  // Coloca el mensaje después del contenedor del checkbox,
  // para que no quede pegado al texto del <label>.
  insertAfterWhatNode: document.getElementById("terminos").parentNode
});

terminos.add(Validate.Acceptance, {
  failureMessage: "Debes aceptar los términos y condiciones"
});


// =====================================================
// ENVÍO DEL FORMULARIO
// =====================================================

var campos = [usuario, telefono, edad, password, confirmar, terminos];

document.getElementById("formulario").addEventListener("submit", function (e) {

  // Siempre bloqueamos el envío; solo lo permitimos si todo es válido.
  e.preventDefault();

  var primerInvalido = null;

  campos.forEach(function (lv) {
    // validate() fuerza la validación y muestra el mensaje,
    // incluso si el campo nunca fue tocado.
    var ok = lv.validate();

    if (!ok && !primerInvalido) {
      primerInvalido = lv.element;
    }
  });

  if (primerInvalido) {
    primerInvalido.focus();   // lleva al usuario al primer error
    return;
  }

  alert("✓ Formulario válido: cuenta creada");

  // Aquí iría el envío real: this.submit();
});