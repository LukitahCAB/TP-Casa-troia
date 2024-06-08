// Almacenar los rubros y productos en memoria
let rubros = [];
let productos = [];
let nextProductId = 1; // Inicializar el próximo ID de producto a 1
let productoActual = null; // Variable para almacenar el producto que se está editando

// Función para actualizar la tabla de stock
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

// Funciones para los botones de acción (copiar, modificar, eliminar) y modales
function mostrarModificarStockModal() {
    const modalContent = document.getElementById('modificarStockContent');
    modalContent.innerHTML = '';

    rubros.forEach(rubro => {
        const productosRubro = productos.filter(p => p.rubro === rubro.nombre);
        if (productosRubro.length > 0) {
            let rubroSection = `
                <h5>${rubro.nombre}</h5>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Stock</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            productosRubro.forEach(producto => {
                rubroSection += `
                    <tr>
                        <td>${producto.id}</td>
                        <td>${producto.nombre}</td>
                        <td>
                            <input type="number" class="form-control" id="stock-${producto.id}" value="${producto.stock}" min="0">
                        </td>
                    </tr>
                `;
            });

            rubroSection += `
                    </tbody>
                </table>
            `;

            modalContent.innerHTML += rubroSection;
        }
    });

    const modificarStockModal = new bootstrap.Modal(document.getElementById('modificarStockModal'));
    modificarStockModal.show();
}

function guardarCambiosStock() {
    productos.forEach(producto => {
        const stockInput = document.getElementById(`stock-${producto.id}`);
        if (stockInput) {
            producto.stock = parseInt(stockInput.value, 10);
        }
    });

    actualizarTablaStock();
    const modificarStockModal = bootstrap.Modal.getInstance(document.getElementById('modificarStockModal'));
    modificarStockModal.hide();
}

function copiarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        const nuevoProducto = { ...producto, id: nextProductId++ };
        productos.push(nuevoProducto);
        actualizarProductos();
        actualizarTablaStock();
        actualizarTablaPrecios();
    }
}

function modificarProducto(id) {
    productoActual = productos.find(p => p.id === id);
    if (productoActual) {
        document.getElementById('nombreProducto').value = productoActual.nombre;
        document.getElementById('rubroProducto').value = productoActual.rubro;
        document.getElementById('precioProducto').value = productoActual.precio;
        document.getElementById('stockProducto').value = productoActual.controlaStock ? 'true' : 'false';
        const crearProductoModal = new bootstrap.Modal(document.getElementById('crearProductoModal'));
        crearProductoModal.show();
    }
}

function eliminarProducto(id) {
    productos = productos.filter(p => p.id !== id);
    actualizarProductos();
    actualizarTablaStock();
    actualizarTablaPrecios();
}

// Función para resetear el formulario de creación de productos
function resetearFormularioProducto() {
    productoActual = null;
    document.getElementById('crearProductoForm').reset();
    document.getElementById('precioProducto').value = 0;
}

function mostrarCrearProductoModal() {
    if (rubros.length === 0) {
        const crearRubroModal = new bootstrap.Modal(document.getElementById('crearRubroModal'));
        crearRubroModal.show();
    } else {
        resetearFormularioProducto();
        const crearProductoModal = new bootstrap.Modal(document.getElementById('crearProductoModal'));
        crearProductoModal.show();
    }
}

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

    // Asegurarse de que las funciones estén en el ámbito global
    window.mostrarModificarStockModal = mostrarModificarStockModal;
    window.guardarCambiosStock = guardarCambiosStock;
    window.mostrarCrearProductoModal = mostrarCrearProductoModal;
    window.copiarProducto = copiarProducto;
    window.modificarProducto = modificarProducto;
    window.eliminarProducto = eliminarProducto;
});
