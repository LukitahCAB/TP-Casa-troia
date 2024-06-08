// Almacenar los rubros y productos en memoria
let rubros = [];
let productos = [];
let nextProductId = 1; // Inicializar el próximo ID de producto a 1
let productoActual = null; // Variable para almacenar el producto que se está editando

document.addEventListener("DOMContentLoaded", () => {
    const crearRubroForm = document.getElementById('crearRubroForm');
    const crearProductoForm = document.getElementById('crearProductoForm');
    const rubroProductoSelect = document.getElementById('rubroProducto');
    const productosTableBody = document.getElementById('productosTableBody');
    const crearProductoModal = new bootstrap.Modal(document.getElementById('crearProductoModal'));
    const crearRubroModal = new bootstrap.Modal(document.getElementById('crearRubroModal'));
    const sinRubrosMensaje = document.getElementById('sinRubrosMensaje');
    const botonCrearRubro = document.getElementById('botonCrearRubro');

    // Manejar la creación de un nuevo rubro
    crearRubroForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const nombreRubro = document.getElementById('nombreRubro').value;
        const ordenRubro = document.getElementById('ordenRubro').value;

        const nuevoRubro = { id: Date.now(), nombre: nombreRubro, orden: ordenRubro };
        rubros.push(nuevoRubro);

        actualizarRubros();
        crearRubroForm.reset();
        crearRubroModal.hide();
    });

    // Manejar la creación/modificación de un producto
    crearProductoForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const nombreProducto = document.getElementById('nombreProducto').value;
        const rubroProducto = document.getElementById('rubroProducto').value;
        const precioProducto = document.getElementById('precioProducto').value || 0;
        const stockProducto = document.getElementById('stockProducto').value === 'true';

        if (productoActual) {
            // Modificar producto existente
            productoActual.nombre = nombreProducto;
            productoActual.rubro = rubroProducto;
            productoActual.precio = parseFloat(precioProducto);
            productoActual.controlaStock = stockProducto;
            productoActual = null;
        } else {
            // Crear nuevo producto
            const nuevoProducto = {
                id: nextProductId++,
                nombre: nombreProducto,
                rubro: rubroProducto,
                precio: parseFloat(precioProducto),
                controlaStock: stockProducto,
                stock: 0 // Inicialmente, el stock es 0
            };
            productos.push(nuevoProducto);
        }

        actualizarProductos();
        crearProductoForm.reset();
        crearProductoModal.hide();
    });

    // Actualizar el listado de rubros en el select
    function actualizarRubros() {
        if (rubros.length === 0) {
            sinRubrosMensaje.classList.remove('d-none');
            botonCrearRubro.classList.remove('d-none');
        } else {
            sinRubrosMensaje.classList.add('d-none');
            botonCrearRubro.classList.add('d-none');
        }
        rubroProductoSelect.innerHTML = rubros.map(rubro => `<option value="${rubro.nombre}">${rubro.nombre}</option>`).join('');
    }

    // Actualizar la tabla de productos
    function actualizarProductos() {
        productosTableBody.innerHTML = productos.map(producto => `
            <tr>
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${producto.rubro}</td>
                <td>${producto.stock}</td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="copiarProducto(${producto.id})">Copiar</button>
                    <button class="btn btn-primary btn-sm" onclick="modificarProducto(${producto.id})">Modificar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${producto.id})">Eliminar</button>
                </td>
            </tr>
        `).join('');
    }

    // Funciones para los botones de acción (copiar, modificar, eliminar)
    window.copiarProducto = function(id) {
        const producto = productos.find(p => p.id === id);
        if (producto) {
            const nuevoProducto = { ...producto, id: nextProductId++ };
            productos.push(nuevoProducto);
            actualizarProductos();
        }
    };

    window.modificarProducto = function(id) {
        productoActual = productos.find(p => p.id === id);
        if (productoActual) {
            document.getElementById('nombreProducto').value = productoActual.nombre;
            document.getElementById('rubroProducto').value = productoActual.rubro;
            document.getElementById('precioProducto').value = productoActual.precio;
            document.getElementById('stockProducto').value = productoActual.controlaStock ? 'true' : 'false';
            crearProductoModal.show();
        }
    };

    window.eliminarProducto = function(id) {
        productos = productos.filter(p => p.id !== id);
        actualizarProductos();
    };

    // Abrir modal de crear rubro desde el modal de crear producto
    botonCrearRubro.addEventListener('click', () => {
        crearProductoModal.hide();
        crearRubroModal.show();
    });

    // Mostrar el modal de crear producto y verificar si hay rubros
    window.mostrarCrearProductoModal = function() {
        if (rubros.length === 0) {
            crearRubroModal.show();
        } else {
            crearProductoModal.show();
        }
    };
});
