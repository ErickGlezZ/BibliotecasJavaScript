// =====================================================
// SMART HIRE
// PRÁCTICA AVANZADA DE LIVEVALIDATION (VERSIÓN MEJORADA)
// =====================================================
//
// Mejoras principales respecto a la versión anterior:
//
// 1. Length y Numericality usan SUS mensajes propios
//    (tooShortMessage, tooLowMessage, etc.). En ellos
//    failureMessage NO funciona y salían en inglés.
// 2. Todos los campos tienen Presence (obligatorios).
// 3. Varias reglas por campo, cada una con su mensaje.
// 4. Validate.Custom con "args" y validaciones entre campos.
// 5. La confirmación se revalida al cambiar la contraseña.
// 6. El botón solo se habilita si TODO es realmente válido
//    (antes solo comprobaba que no hubiera campos vacíos).
// 7. Al enviar se fuerza la validación de todos los campos,
//    se muestran los errores y se enfoca el primero.
// =====================================================


// =====================================================
// CONFIGURACIÓN COMÚN
// =====================================================

// Espera (ms) tras dejar de escribir antes de validar.
// Solo afecta a los campos de texto, no a select/checkbox.
var ESPERA = 400;

// Expresión para nombres y apellidos:
// letras (con acentos y ñ), separadas por espacio, ' o -
var LETRAS = "A-Za-zÁÉÍÓÚÜÑáéíóúüñ";
var PATRON_NOMBRE = new RegExp(
  "^[" + LETRAS + "]+(?:[ '\\-][" + LETRAS + "]+)*$"
);


// =====================================================
// 1. NOMBRE
// =====================================================

var nombre = new LiveValidation("nombre", {
  validMessage: "✓ Nombre válido",
  wait: ESPERA
});

nombre.add(Validate.Presence, {
  failureMessage: "El nombre es obligatorio"
});

nombre.add(Validate.Length, {
  minimum: 2,
  maximum: 50,
  tooShortMessage: "Debe tener al menos 2 caracteres",
  tooLongMessage: "No puede tener más de 50 caracteres"
});

nombre.add(Validate.Format, {
  pattern: PATRON_NOMBRE,
  failureMessage: "Solo se permiten letras y espacios"
});


// =====================================================
// 2. APELLIDOS
// =====================================================

var apellidos = new LiveValidation("apellidos", {
  validMessage: "✓ Apellidos válidos",
  wait: ESPERA
});

apellidos.add(Validate.Presence, {
  failureMessage: "Los apellidos son obligatorios"
});

apellidos.add(Validate.Length, {
  minimum: 2,
  maximum: 60,
  tooShortMessage: "Debe tener al menos 2 caracteres",
  tooLongMessage: "No puede tener más de 60 caracteres"
});

apellidos.add(Validate.Format, {
  pattern: PATRON_NOMBRE,
  failureMessage: "Solo se permiten letras y espacios"
});


// =====================================================
// 3. CORREO
// =====================================================

var correo = new LiveValidation("correo", {
  validMessage: "✓ Correo válido",
  wait: ESPERA
});

correo.add(Validate.Presence, {
  failureMessage: "El correo es obligatorio"
});

correo.add(Validate.Email, {
  failureMessage: "Introduce un correo válido (ejemplo@dominio.com)"
});

correo.add(Validate.Length, {
  maximum: 100,
  tooLongMessage: "El correo no puede superar los 100 caracteres"
});


// =====================================================
// 4. TELÉFONO
// =====================================================

var telefono = new LiveValidation("telefono", {
  validMessage: "✓ Teléfono válido",
  wait: ESPERA
});

telefono.add(Validate.Presence, {
  failureMessage: "El teléfono es obligatorio"
});

// Primero se revisa que solo haya números...
telefono.add(Validate.Format, {
  pattern: /^[0-9]+$/,
  failureMessage: "El teléfono solo puede contener números"
});

// ...y luego que sean exactamente 10.
telefono.add(Validate.Format, {
  pattern: /^[0-9]{10}$/,
  failureMessage: "Debe contener exactamente 10 dígitos"
});


// =====================================================
// 5. NOMBRE DE USUARIO
// =====================================================

var usuario = new LiveValidation("usuario", {
  validMessage: "✓ Usuario válido",
  wait: ESPERA
});

usuario.add(Validate.Presence, {
  failureMessage: "El usuario es obligatorio"
});

usuario.add(Validate.Length, {
  minimum: 5,
  maximum: 20,
  tooShortMessage: "Debe tener al menos 5 caracteres",
  tooLongMessage: "No puede tener más de 20 caracteres"
});

usuario.add(Validate.Format, {
  pattern: /^[A-Za-z0-9_]+$/,
  failureMessage: "Solo letras, números y guion bajo (_), sin espacios"
});


// =====================================================
// VALIDACIÓN PERSONALIZADA: USUARIOS RESERVADOS
// =====================================================
//
// Validate.Custom recibe:
//   against(valor, args)  -> debe devolver true/false
//   args                  -> objeto con datos extra
//
// Aquí pasamos la lista de reservados por "args" en lugar
// de crearla dentro de la función.
// =====================================================

usuario.add(Validate.Custom, {

  against: function (valor, args) {
    return args.reservados.indexOf(valor.trim().toLowerCase()) === -1;
  },

  args: {
    reservados: ["admin", "root", "usuario", "test", "administrator"]
  },

  failureMessage: "Este nombre de usuario no está permitido"

});


// =====================================================
// 6. CONTRASEÑA
// =====================================================
//
// Una regla Format por requisito, cada una con su propio
// mensaje. LiveValidation se detiene en la primera que falla,
// así el usuario ve exactamente qué le falta.
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

password.add(Validate.Format, {
  pattern: /[A-Z]/,
  failureMessage: "Debe incluir al menos una letra mayúscula"
});

password.add(Validate.Format, {
  pattern: /[a-z]/,
  failureMessage: "Debe incluir al menos una letra minúscula"
});

password.add(Validate.Format, {
  pattern: /[0-9]/,
  failureMessage: "Debe incluir al menos un número"
});

password.add(Validate.Format, {
  pattern: /[^A-Za-z0-9]/,
  failureMessage: "Debe incluir al menos un carácter especial"
});

// Validación entre campos: la contraseña no puede
// contener el nombre de usuario.
password.add(Validate.Custom, {

  against: function (valor, args) {
    var user = document.getElementById(args.campoUsuario).value
      .trim()
      .toLowerCase();

    // Si aún no hay usuario escrito, esta regla no aplica.
    if (user === "") return true;

    return valor.toLowerCase().indexOf(user) === -1;
  },

  args: { campoUsuario: "usuario" },

  failureMessage: "La contraseña no puede contener tu nombre de usuario"

});


// =====================================================
// 7. CONFIRMACIÓN
// =====================================================

var confirmar = new LiveValidation("confirmar", {
  validMessage: "✓ Las contraseñas coinciden",
  wait: ESPERA
});

confirmar.add(Validate.Presence, {
  failureMessage: "Debes confirmar la contraseña"
});

confirmar.add(Validate.Confirmation, {
  match: "password",
  failureMessage: "Las contraseñas no coinciden"
});

// Si cambia la contraseña, se revalida la confirmación
// (solo si ya se había escrito algo en ella).
document.getElementById("password").addEventListener("input", function () {
  if (confirmar.element.value !== "") {
    confirmar.validate();
  }
});

// Si cambia el usuario, se revalida la contraseña
// (por la regla de "no contener el usuario").
document.getElementById("usuario").addEventListener("input", function () {
  if (password.element.value !== "") {
    password.validate();
  }
});


// =====================================================
// 8. EXPERIENCIA
// =====================================================
//
// Importante: Number("") es 0, así que sin Presence un campo
// vacío pasaría la validación del mínimo.
// =====================================================

var experiencia = new LiveValidation("experiencia", {
  validMessage: "✓ Experiencia válida",
  wait: ESPERA
});

experiencia.add(Validate.Presence, {
  failureMessage: "Indica tus años de experiencia (0 si no tienes)"
});

experiencia.add(Validate.Numericality, {
  onlyInteger: true,
  minimum: 0,
  maximum: 50,
  notANumberMessage: "Debe ser un número",
  notAnIntegerMessage: "Debe ser un número entero",
  tooLowMessage: "No puede ser negativo",
  tooHighMessage: "El máximo permitido es 50 años"
});


// =====================================================
// 9. ÁREA PROFESIONAL
// =====================================================
//
// Requiere que la primera <option> del <select> tenga
// value="" para que Presence detecte "sin selección".
// =====================================================

var area = new LiveValidation("area", {
  validMessage: "✓ Área seleccionada"
});

area.add(Validate.Presence, {
  failureMessage: "Selecciona un área profesional"
});

// Aseguramos que el valor sea uno de los permitidos.
area.add(Validate.Inclusion, {
  within: ["desarrollo", "datos", "seguridad", "redes"],
  failureMessage: "Selecciona una opción válida de la lista"
});


// =====================================================
// 10. TÉRMINOS
// =====================================================

var terminos = new LiveValidation("terminos", {
  validMessage: "✓ Términos aceptados",

  // Coloca el mensaje después del contenedor del checkbox
  // (evita que quede pegado al texto del <label>).
  insertAfterWhatNode: document.getElementById("terminos").parentNode
});

terminos.add(Validate.Acceptance, {
  failureMessage: "Debes aceptar los términos"
});


// =====================================================
// LISTA DE TODOS LOS CAMPOS VALIDADOS
// =====================================================

var campos = [
  nombre, apellidos, correo, telefono, usuario,
  password, confirmar, experiencia, area, terminos
];


// =====================================================
// 11. REQUISITOS VISUALES DE CONTRASEÑA
// =====================================================
//
// Esta parte NO es LiveValidation: es JavaScript normal
// que muestra qué requisitos cumple la contraseña.
// =====================================================

var campoPassword = document.getElementById("password");

var TEXTOS_REQUISITOS = {
  longitud: "Al menos 8 caracteres",
  mayuscula: "Una letra mayúscula",
  minuscula: "Una letra minúscula",
  numero: "Un número",
  especial: "Un carácter especial"
};

function actualizarRequisito(id, correcto) {
  var elemento = document.getElementById(id);
  if (!elemento) return;

  elemento.textContent = (correcto ? "✓ " : "✗ ") + TEXTOS_REQUISITOS[id];
  elemento.className = correcto ? "correcto" : "incorrecto";
}

function actualizarRequisitos() {
  var valor = campoPassword.value;

  actualizarRequisito("longitud", valor.length >= 8);
  actualizarRequisito("mayuscula", /[A-Z]/.test(valor));
  actualizarRequisito("minuscula", /[a-z]/.test(valor));
  actualizarRequisito("numero", /[0-9]/.test(valor));
  actualizarRequisito("especial", /[^A-Za-z0-9]/.test(valor));
}

campoPassword.addEventListener("input", actualizarRequisitos);
actualizarRequisitos(); // estado inicial


// =====================================================
// 12. HABILIDADES DINÁMICAS
// =====================================================

var HABILIDADES = {
  desarrollo: ["HTML", "CSS", "JavaScript", "PHP", "Java"],
  datos: ["Python", "SQL", "Excel", "Power BI", "Machine Learning"],
  seguridad: [
    "Redes", "Linux", "Seguridad Web",
    "Criptografía", "Análisis de vulnerabilidades"
  ],
  redes: ["TCP/IP", "Routing", "Switching", "Cisco", "Cableado estructurado"]
};

var selectArea = document.getElementById("area");
var habilidadesContainer = document.getElementById("habilidadesContainer");
var habilidades = document.getElementById("habilidades");

selectArea.addEventListener("change", function () {

  var opciones = HABILIDADES[selectArea.value] || [];

  habilidades.innerHTML = "";

  if (opciones.length === 0) {
    habilidadesContainer.style.display = "none";
    return;
  }

  habilidadesContainer.style.display = "block";

  opciones.forEach(function (opcion) {

    var label = document.createElement("label");
    var checkbox = document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.name = "habilidades";
    checkbox.value = opcion;

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(" " + opcion));

    habilidades.appendChild(label);
    habilidades.appendChild(document.createElement("br"));

  });

});


// =====================================================
// 13. ESTADO GENERAL DEL FORMULARIO
// =====================================================
//
// En lugar de revisar solo si los campos están vacíos,
// le preguntamos a CADA validador de LiveValidation si su
// campo cumple todas sus reglas.
//
// doValidations() ejecuta las reglas SIN mostrar mensajes
// (a diferencia de validate()), ideal para comprobar el
// estado de forma silenciosa.
// =====================================================

var formulario = document.getElementById("formulario");
var boton = document.getElementById("btnRegistrar");
var estado = document.getElementById("estadoFormulario");

function campoEsValido(lv) {
  return lv.element.disabled || lv.doValidations();
}

function actualizarEstado() {

  var todoCorrecto = campos.every(campoEsValido);

  if (todoCorrecto) {
    estado.textContent = "✓ El formulario está listo para enviarse.";
    estado.className = "estado correcto";
  } else {
    estado.textContent = "Completa todos los campos correctamente.";
    estado.className = "estado incorrecto";
  }

  boton.disabled = !todoCorrecto;
}

formulario.addEventListener("input", actualizarEstado);
formulario.addEventListener("change", actualizarEstado);
actualizarEstado(); // estado inicial: botón deshabilitado


// =====================================================
// 14. ENVÍO DEL FORMULARIO
// =====================================================
//
// Aunque el botón se deshabilita, el usuario aún podría
// enviar con la tecla Enter. Por eso se valida de nuevo,
// forzando que cada campo muestre su mensaje.
// =====================================================

formulario.addEventListener("submit", function (event) {

  // Siempre bloqueamos el envío; solo lo permitimos si todo es válido.
  event.preventDefault();

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
    primerInvalido.focus();
    return;
  }

  alert("✓ Perfil creado correctamente.");

  // Aquí iría el envío real: formulario.submit();
});