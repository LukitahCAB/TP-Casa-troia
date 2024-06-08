// Almacenar los rubros y productos en memoria
let rubros = [];
let productos = [];
let nextProductId = 1; // Inicializar el próximo ID de producto a 1
let productoActual = null; // Variable para almacenar el producto que se está editando

document.addEventListener("DOMContentLoaded", () => {
    // Definir las funciones actualizarRubros y actualizarProductos
    function actualizarRubros() {
        const rubroProductoSelect = document.getElementById('rubroProducto');
        const sinRubrosMensaje = document.getElementById('sinRubrosMensaje');
        const botonCrearRubro = document.getElementById('botonCrearRubro');

        if (rubroProductoSelect && sinRubrosMensaje && botonCrearRubro) {
            if (rubros.length === 0) {
                sinRubrosMensaje.classList.remove('d-none');
                botonCrearRubro.classList.remove('d-none');
            } else {
                sinRubrosMensaje.classList.add('d-none');
                botonCrearRubro.classList.add('d-none');
            }
            rubroProductoSelect.innerHTML = rubros.map(rubro => `<option value="${rubro.nombre}">${rubro.nombre}</option>`).join('');
        }
    }

    function actualizarProductos() {
        const productosTableBody = document.getElementById('productosTableBody');
        if (productosTableBody) {
            productosTableBody.innerHTML = productos.map(producto => `
                <tr>
                    <td>${producto.id}</td>
                    <td>${producto.nombre}</td>
                    <td>${producto.rubro}</td>
                    <td>${producto.stock}</td>
                    <td class="text-center align-middle">
                        <div class="btn-group">
                            <button class="btn btn-secondary btn-sm" onclick="copiarProducto(${producto.id})">Copiar</button>
                            <button class="btn btn-primary btn-sm" onclick="modificarProducto(${producto.id})">Modificar</button>
                            <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${producto.id})">Eliminar</button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }
    }

    function actualizarTablaStock() {
        const stockTableBody = document.getElementById('stockTableBody');
        if (stockTableBody) {
            stockTableBody.innerHTML = productos.map(producto => `
                <tr>
                    <td>${producto.id}</td>
                    <td>${producto.nombre}</td>
                    <td>${producto.stock}</td>
                </tr>
            `).join('');
        }
    }

    function actualizarTablaPrecios() {
        const preciosTableBody = document.getElementById('preciosTableBody');
        if (preciosTableBody) {
            preciosTableBody.innerHTML = productos.map(producto => `
                <tr>
                    <td>${producto.id}</td>
                    <td>${producto.nombre}</td>
                    <td>${producto.rubro}</td>
                    <td>${producto.precio}</td>
                </tr>
            `).join('');
        }
    }

    // Cargar el archivo JSON y actualizar las variables
    fetch('/datos/pdEjemplos.txt')
        .then(response => response.json())
        .then(data => {
            rubros = data.rubros;
            productos = data.productos;
            nextProductId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
            actualizarRubros();
            actualizarProductos();
            actualizarTablaStock();
            actualizarTablaPrecios();
        })
        .catch(error => console.error('Error cargando el archivo JSON:', error));

    const crearRubroForm = document.getElementById('crearRubroForm');
    const crearProductoForm = document.getElementById('crearProductoForm');
    const crearProductoModal = new bootstrap.Modal(document.getElementById('crearProductoModal'));
    const crearRubroModal = new bootstrap.Modal(document.getElementById('crearRubroModal'));

    // Manejar la creación de un nuevo rubro
    crearRubroForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const nombreRubro = document.getElementById('nombreRubro').value;
        const ordenRubro = parseInt(document.getElementById('ordenRubro').value);

        if (ordenRubro < 0) {
            alert("El orden del rubro no puede ser negativo.");
            return;
        }

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
        const precioProducto = parseFloat(document.getElementById('precioProducto').value);
        const stockProducto = document.getElementById('stockProducto').value === 'true';

        if (precioProducto < 0) {
            alert("El precio del producto no puede ser negativo.");
            return;
        }

        if (productoActual) {
            // Modificar producto existente
            productoActual.nombre = nombreProducto;
            productoActual.rubro = rubroProducto;
            productoActual.precio = precioProducto;
            productoActual.controlaStock = stockProducto;
            productoActual = null;
        } else {
            // Crear nuevo producto
            const nuevoProducto = {
                id: nextProductId++,
                nombre: nombreProducto,
                rubro: rubroProducto,
                precio: precioProducto,
                controlaStock: stockProducto,
                stock: 0 // Inicialmente, el stock es 0
            };
            productos.push(nuevoProducto);
        }

        actualizarProductos();
        actualizarTablaStock();
        actualizarTablaPrecios();
        crearProductoForm.reset();
        crearProductoModal.hide();
    });

    // Abrir modal de crear rubro desde el modal de crear producto
    document.getElementById('botonCrearRubro').addEventListener('click', () => {
        crearProductoModal.hide();
        crearRubroModal.show();
    });

    // Mostrar el modal de crear producto y verificar si hay rubros
    window.mostrarCrearProductoModal = function() {
        if (rubros.length === 0) {
            crearRubroModal.show();
        } else {
            resetearFormularioProducto();
            crearProductoModal.show();
        }
    };

    // Funciones para los botones de acción (copiar, modificar, eliminar)
    window.copiarProducto = function(id) {
        const producto = productos.find(p => p.id === id);
        if (producto) {
            const nuevoProducto = { ...producto, id: nextProductId++ };
            productos.push(nuevoProducto);
            actualizarProductos();
            actualizarTablaStock();
            actualizarTablaPrecios();
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
        actualizarTablaStock();
        actualizarTablaPrecios();
    };

    // Función para resetear el formulario de creación de productos
    function resetearFormularioProducto() {
        productoActual = null;
        document.getElementById('crearProductoForm').reset();
        document.getElementById('precioProducto').value = 0;
    }
});
