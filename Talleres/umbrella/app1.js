// 1) Función que cuenta las tareas y muestra el total
function actualizarContador() {
  // .length nos dice cuántos elementos encontró u()
  const total = u('#lista li').length;

  // .text() cambia el texto de un elemento
  u('#contador').text('Tareas pendientes: ' + total);
}


// 2) Agregar una tarea al dar clic en el botón
// .on('evento', funcion) escucha eventos (click, keyup, submit...)
u('#btn-agregar').on('click', function () {
  // .first() regresa el elemento HTML real, para leer su .value
  const texto = u('#nueva-tarea').first().value.trim();

  // Si el input está vacío, no hacemos nada
  if (texto === '') {
    return;
  }

  // .append() agrega HTML dentro del elemento seleccionado
  u('#lista').append('<li class="nueva">' + texto + '</li>');

  // Limpiamos el input
  u('#nueva-tarea').first().value = '';

  actualizarContador();
});


// 3) Eliminar una tarea al darle clic
// Escuchamos en la lista y filtramos por 'li' (delegación de eventos).
// Así también funciona con las tareas que se agregan después.
u('#lista').on('click', 'li', function (e) {
  // .remove() elimina el elemento de la página
  u(e.target).remove();
  actualizarContador();
});


// 4) Mostramos el contador al cargar la página
actualizarContador();