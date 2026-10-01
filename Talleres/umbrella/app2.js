// ---------- 1. DATOS ----------
const productos = [
  { id: 1, nombre: 'Agua natural',  precio: 12,  categoria: 'bebidas',   emoji: '💧' },
  { id: 2, nombre: 'Refresco',      precio: 18,  categoria: 'bebidas',   emoji: '🥤' },
  { id: 3, nombre: 'Café',          precio: 25,  categoria: 'bebidas',   emoji: '☕' },
  { id: 4, nombre: 'Papas',         precio: 20,  categoria: 'snacks',    emoji: '🍟' },
  { id: 5, nombre: 'Galletas',      precio: 15,  categoria: 'snacks',    emoji: '🍪' },
  { id: 6, nombre: 'Chocolate',     precio: 22,  categoria: 'snacks',    emoji: '🍫' },
  { id: 7, nombre: 'Cuaderno',      precio: 45,  categoria: 'papeleria', emoji: '📓' },
  { id: 8, nombre: 'Pluma',         precio: 10,  categoria: 'papeleria', emoji: '🖊️' },
  { id: 9, nombre: 'Lápiz',         precio: 6,   categoria: 'papeleria', emoji: '✏️' }
];

// Carrito: objeto { idProducto: cantidad }. Se recupera de localStorage si existe.
let carrito = JSON.parse(localStorage.getItem('carrito')) || {};
let descuento = 0; // porcentaje (0.10 = 10%)


// ---------- 2. FUNCIONES DE APOYO ----------
function formatoDinero(cantidad) {
  return '$' + cantidad.toFixed(2);
}

function buscarProducto(id) {
  return productos.find(function (p) { return p.id === id; });
}

function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}


// ---------- 3. RENDER DEL CATÁLOGO ----------
function mostrarProductos() {
  // .empty() borra todo el contenido del contenedor
  u('#productos').empty();

  productos.forEach(function (p) {
    // data-id y data-categoria guardan información dentro del HTML
    u('#productos').append(
      '<article class="producto" data-id="' + p.id + '" data-categoria="' + p.categoria + '">' +
        '<span class="emoji">' + p.emoji + '</span>' +
        '<span class="nombre">' + p.nombre + '</span>' +
        '<span class="categoria">' + p.categoria + '</span>' +
        '<span class="precio">' + formatoDinero(p.precio) + '</span>' +
        '<button class="btn-agregar">Agregar</button>' +
      '</article>'
    );
  });
}


// ---------- 4. FILTROS (categoría + búsqueda) ----------
let categoriaActual = 'todos';

function aplicarFiltros() {
  const texto = u('#buscador').first().value.toLowerCase().trim();
  let visibles = 0;

  // .each() recorre cada elemento encontrado
  u('.producto').each(function (nodo) {
    const tarjeta = u(nodo);
    const nombre = tarjeta.find('.nombre').text().toLowerCase();
    const categoria = tarjeta.data('categoria');

    const coincideCategoria = categoriaActual === 'todos' || categoria === categoriaActual;
    const coincideTexto = nombre.includes(texto);
    const mostrar = coincideCategoria && coincideTexto;

    // toggleClass con segundo parámetro: true = agrega, false = quita
    tarjeta.toggleClass('oculto', !mostrar);
    if (mostrar) visibles++;
  });

  u('#sin-resultados').toggleClass('oculto', visibles > 0);
}

// Botones de categoría (delegación en el contenedor #filtros)
u('#filtros').on('click', '.filtro', function (e) {
  const boton = u(e.target);

  // Quitamos 'activo' a los hermanos y se lo ponemos al botón presionado
  boton.siblings().removeClass('activo');
  boton.addClass('activo');

  categoriaActual = boton.data('categoria');
  aplicarFiltros();
});

// Búsqueda en tiempo real: 'input' se dispara con cada tecla
u('#buscador').on('input', aplicarFiltros);


// ---------- 5. CARRITO ----------
function agregarAlCarrito(id) {
  carrito[id] = (carrito[id] || 0) + 1;
  guardarCarrito();
  mostrarCarrito();

  // Pequeña animación: quitamos y volvemos a poner la clase
  const insignia = u('#insignia-carrito');
  insignia.removeClass('rebote');
  void insignia.first().offsetWidth; // truco para reiniciar la animación CSS
  insignia.addClass('rebote');
}

function cambiarCantidad(id, cambio) {
  carrito[id] = (carrito[id] || 0) + cambio;
  if (carrito[id] <= 0) {
    delete carrito[id];
  }
  guardarCarrito();
  mostrarCarrito();
}

function mostrarCarrito() {
  const lista = u('#lista-carrito');
  lista.empty();

  let subtotal = 0;
  let piezas = 0;

  Object.keys(carrito).forEach(function (id) {
    const producto = buscarProducto(Number(id));
    const cantidad = carrito[id];
    subtotal += producto.precio * cantidad;
    piezas += cantidad;

    lista.append(
      '<li data-id="' + producto.id + '">' +
        '<span>' + producto.emoji + ' ' + producto.nombre + '</span>' +
        '<span class="cantidad">' +
          '<button class="menos">−</button>' +
          '<span>' + cantidad + '</span>' +
          '<button class="mas">+</button>' +
        '</span>' +
      '</li>'
    );
  });

  const montoDescuento = subtotal * descuento;

  u('#subtotal').text(formatoDinero(subtotal));
  u('#descuento').text('-' + formatoDinero(montoDescuento));
  u('#total').text(formatoDinero(subtotal - montoDescuento));
  u('#insignia-carrito').text('Carrito: ' + piezas);

  // Mostrar u ocultar el mensaje de carrito vacío
  u('#carrito-vacio').toggleClass('oculto', piezas > 0);
}

// Botón "Agregar" de cada tarjeta.
// Usamos .closest() para subir desde el botón hasta su tarjeta y leer data-id.
u('#productos').on('click', '.btn-agregar', function (e) {
  const id = Number(u(e.target).closest('.producto').data('id'));
  agregarAlCarrito(id);
});

// Botones + y − del carrito (una sola escucha para todos)
u('#lista-carrito').on('click', 'button', function (e) {
  const boton = u(e.target);
  const id = Number(boton.closest('li').data('id'));

  if (boton.hasClass('mas')) {
    cambiarCantidad(id, 1);
  } else {
    cambiarCantidad(id, -1);
  }
});

// Vaciar carrito
u('#btn-vaciar').on('click', function () {
  if (confirm('¿Seguro que quieres vaciar el carrito?')) {
    carrito = {};
    guardarCarrito();
    mostrarCarrito();
  }
});


// ---------- 6. FORMULARIO DEL CUPÓN ----------
// .handle() es como .on() pero además hace e.preventDefault(),
// así el formulario NO recarga la página.
u('#form-cupon').handle('submit', function () {
  const codigo = u('#cupon').first().value.trim().toUpperCase();
  const mensaje = u('#mensaje-cupon');

  if (codigo === 'UMBRELLA10') {
    descuento = 0.10;
    mensaje.text('Cupón aplicado: 10% de descuento').removeClass('error').addClass('ok');
  } else {
    descuento = 0;
    mensaje.text('Cupón no válido').removeClass('ok').addClass('error');
  }

  mostrarCarrito();
});


// ---------- 7. INICIO ----------
mostrarProductos();
mostrarCarrito();