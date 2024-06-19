// Almacenar los rubros y productos en memoria
let rubros = [];
let productos = [];
let nextProductId = 1; // Inicializar el próximo ID de producto a 1
let productoActual = null; // Variable para almacenar el producto que se está editando

// Almacenar las ventas, presupuestos y cajas en memoria
let ventas = [];
let presupuestos = [];
let cajas = [];
let nextVentaId = 1; // Inicializar el próximo ID de venta a 1
let productosVenta = []; // Almacenar los productos de la venta actual
let productosPresupuesto = []; // Almacenar los productos del presupuesto actual

// Función para actualizar la tabla de productos
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

// Función para actualizar la tabla de precios
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

// Función para actualizar la tabla de ventas
function actualizarTablaVentas() {
    const ventasTableBody = document.getElementById('ventasTableBody');
    if (ventasTableBody) {
        ventasTableBody.innerHTML = ventas.map(venta => `
            <tr>
                <td>${venta.id}</td>
                <td>${venta.total}</td>
                <td class="text-center align-middle">
                    <button class="btn btn-primary btn-sm" onclick="modificarVenta(${venta.id})">Modificar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarVenta(${venta.id})">Eliminar</button>
                </td>
            </tr>
        `).join('');
    }
}

// Función para actualizar la tabla de presupuestos
function actualizarTablaPresupuestos() {
    const presupuestosTableBody = document.getElementById('presupuestosTableBody');
    if (presupuestosTableBody) {
        presupuestosTableBody.innerHTML = presupuestos.map(presupuesto => `
            <tr>
                <td>${presupuesto.id}</td>
                <td>${presupuesto.total}</td>
                <td class="text-center align-middle">
                    <button class="btn btn-primary btn-sm" onclick="modificarPresupuesto(${presupuesto.id})">Modificar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarPresupuesto(${presupuesto.id})">Eliminar</button>
                </td>
            </tr>
        `).join('');
    }
}

// Función para actualizar la tabla de cajas
function actualizarTablaCajas() {
    const cajasTableBody = document.getElementById('cajasTableBody');
    if (cajasTableBody) {
        cajasTableBody.innerHTML = cajas.map(caja => `
            <tr>
                <td>${caja.fecha}</td>
                <td>${caja.ventas.length}</td>
                <td>${caja.productosVendidos}</td>
                <td>${caja.total}</td>
            </tr>
        `).join('');
    }
}

// Función para los botones de acción (copiar, modificar, eliminar) y modales
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

// Función para mostrar el modal de modificar precios
function mostrarModificarPreciosModal() {
    const modalContent = document.getElementById('modificarPreciosContent');
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
                            <th>Precio</th>
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
                            <input type="number" class="form-control" id="precio-${producto.id}" value="${producto.precio}" min="0">
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

    const modificarPreciosModal = new bootstrap.Modal(document.getElementById('modificarPreciosModal'));
    modificarPreciosModal.show();
}

function guardarCambiosPrecios() {
    productos.forEach(producto => {
        const precioInput = document.getElementById(`precio-${producto.id}`);
        if (precioInput) {
            producto.precio = parseFloat(precioInput.value);
        }
    });

    actualizarTablaPrecios();
    const modificarPreciosModal = bootstrap.Modal.getInstance(document.getElementById('modificarPreciosModal'));
    modificarPreciosModal.hide();
}

// Función para mostrar el modal de nueva venta
function mostrarCrearVentaModal() {
    productosVenta = []; // Reiniciar los productos de la venta actual
    actualizarTablaProductosVenta();
    const productoVenta = document.getElementById('productoVenta');
    if (productoVenta) {
        productoVenta.innerHTML = productos.map(producto => `<option value="${producto.id}">${producto.nombre}</option>`).join('');
    }

    const crearVentaModal = new bootstrap.Modal(document.getElementById('crearVentaModal'));
    crearVentaModal.show();
}

function agregarProductoVenta() {
    const productoId = parseInt(document.getElementById('productoVenta').value);
    const cantidadVenta = parseInt(document.getElementById('cantidadVenta').value);

    const producto = productos.find(p => p.id === productoId);
    if (!producto) {
        alert("Producto no encontrado.");
        return;
    }

    if (producto.stock < cantidadVenta) {
        alert("Stock insuficiente.");
        return;
    }

    const subtotal = producto.precio * cantidadVenta;
    const productoVenta = {
        id: producto.id,
        nombre: producto.nombre,
        cantidad: cantidadVenta,
        precio: producto.precio,
        subtotal: subtotal
    };

    productosVenta.push(productoVenta);
    actualizarTablaProductosVenta();
}

function actualizarTablaProductosVenta() {
    const productosVentaTableBody = document.getElementById('productosVentaTableBody');
    if (productosVentaTableBody) {
        productosVentaTableBody.innerHTML = productosVenta.map(producto => `
            <tr>
                <td>${producto.nombre}</td>
                <td>${producto.cantidad}</td>
                <td>${producto.precio}</td>
                <td>${producto.subtotal}</td>
            </tr>
        `).join('');

        const totalVenta = productosVenta.reduce((total, producto) => total + producto.subtotal, 0);
        document.getElementById('totalVenta').innerText = `Total: ${totalVenta}`;
    }
}

function guardarVenta() {
    const formaPago = document.getElementById('formaPago').value;
    const totalVenta = productosVenta.reduce((total, producto) => total + producto.subtotal, 0);

    const nuevaVenta = {
        id: nextVentaId++,
        productos: productosVenta,
        formaPago: formaPago,
        total: totalVenta
    };

    ventas.push(nuevaVenta);

    // Reducir el stock de los productos vendidos
    productosVenta.forEach(pv => {
        const producto = productos.find(p => p.id === pv.id);
        if (producto) {
            producto.stock -= pv.cantidad;
        }
    });

    actualizarProductos();
    actualizarTablaVentas();
    actualizarTablaStock();
    actualizarTablaCajas();

    const crearVentaModal = bootstrap.Modal.getInstance(document.getElementById('crearVentaModal'));
    crearVentaModal.hide();
}

// Función para mostrar el modal de nuevo presupuesto
function mostrarCrearPresupuestoModal() {
    productosPresupuesto = []; // Reiniciar los productos del presupuesto actual
    actualizarTablaProductosPresupuesto();
    const productoPresupuesto = document.getElementById('productoPresupuesto');
    if (productoPresupuesto) {
        productoPresupuesto.innerHTML = productos.map(producto => `<option value="${producto.id}">${producto.nombre}</option>`).join('');
    }

    const crearPresupuestoModal = new bootstrap.Modal(document.getElementById('crearPresupuestoModal'));
    crearPresupuestoModal.show();
}

function agregarProductoPresupuesto() {
    const productoId = parseInt(document.getElementById('productoPresupuesto').value);
    const cantidadPresupuesto = parseInt(document.getElementById('cantidadPresupuesto').value);

    const producto = productos.find(p => p.id === productoId);
    if (!producto) {
        alert("Producto no encontrado.");
        return;
    }

    const subtotal = producto.precio * cantidadPresupuesto;
    const productoPresupuesto = {
        id: producto.id,
        nombre: producto.nombre,
        cantidad: cantidadPresupuesto,
        precio: producto.precio,
        subtotal: subtotal
    };

    productosPresupuesto.push(productoPresupuesto);
    actualizarTablaProductosPresupuesto();
}

function actualizarTablaProductosPresupuesto() {
    const productosPresupuestoTableBody = document.getElementById('productosPresupuestoTableBody');
    if (productosPresupuestoTableBody) {
        productosPresupuestoTableBody.innerHTML = productosPresupuesto.map(producto => `
            <tr>
                <td>${producto.nombre}</td>
                <td>${producto.cantidad}</td>
                <td>${producto.precio}</td>
                <td>${producto.subtotal}</td>
            </tr>
        `).join('');

        const totalPresupuesto = productosPresupuesto.reduce((total, producto) => total + producto.subtotal, 0);
        document.getElementById('totalPresupuesto').innerText = `Total: ${totalPresupuesto}`;
    }
}

function guardarPresupuesto() {
    const formaPago = document.getElementById('formaPagoPresupuesto').value;
    const totalPresupuesto = productosPresupuesto.reduce((total, producto) => total + producto.subtotal, 0);

    const nuevoPresupuesto = {
        id: nextVentaId++, // Usar el mismo contador que ventas
        productos: productosPresupuesto,
        formaPago: formaPago,
        total: totalPresupuesto
    };

    presupuestos.push(nuevoPresupuesto);

    actualizarTablaPresupuestos();

    const crearPresupuestoModal = bootstrap.Modal.getInstance(document.getElementById('crearPresupuestoModal'));
    crearPresupuestoModal.hide();
}

// Función para crear una caja diaria
function crearCajaDiaria() {
    const fecha = new Date().toLocaleDateString();
    const ventasDelDia = ventas.filter(venta => new Date(venta.fecha).toLocaleDateString() === fecha);
    const productosVendidos = ventasDelDia.reduce((total, venta) => total + venta.productos.reduce((subtotal, p) => subtotal + p.cantidad, 0), 0);
    const totalVentas = ventasDelDia.reduce((total, venta) => total + venta.total, 0);
    const formasPago = [...new Set(ventasDelDia.map(venta => venta.formaPago))].join(', ');

    const nuevaCaja = {
        fecha: fecha,
        ventas: ventasDelDia,
        productosVendidos: productosVendidos,
        total: totalVentas,
        formasPago: formasPago
    };

    cajas.push(nuevaCaja);
    actualizarTablaCajas();
}

// Asegurarse de que las funciones estén en el ámbito global
window.mostrarCrearProductoModal = mostrarCrearProductoModal;
window.mostrarModificarStockModal = mostrarModificarStockModal;
window.guardarCambiosStock = guardarCambiosStock;
window.copiarProducto = copiarProducto;
window.modificarProducto = modificarProducto;
window.eliminarProducto = eliminarProducto;
window.mostrarModificarPreciosModal = mostrarModificarPreciosModal;
window.guardarCambiosPrecios = guardarCambiosPrecios;
window.mostrarCrearVentaModal = mostrarCrearVentaModal;
window.agregarProductoVenta = agregarProductoVenta;
window.guardarVenta = guardarVenta;
window.mostrarCrearPresupuestoModal = mostrarCrearPresupuestoModal;
window.agregarProductoPresupuesto = agregarProductoPresupuesto;
window.guardarPresupuesto = guardarPresupuesto;
window.crearCajaDiaria = crearCajaDiaria;

document.addEventListener("DOMContentLoaded", async () => {
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

    async function actualizarProductos() {
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

    async function actualizarTablaPrecios() {
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

    async function actualizarTablaVentas() {
        const ventasTableBody = document.getElementById('ventasTableBody');
        if (ventasTableBody) {
            ventasTableBody.innerHTML = ventas.map(venta => `
                <tr>
                    <td>${venta.id}</td>
                    <td>${venta.total}</td>
                    <td class="text-center align-middle">
                        <button class="btn btn-primary btn-sm" onclick="modificarVenta(${venta.id})">Modificar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarVenta(${venta.id})">Eliminar</button>
                    </td>
                </tr>
            `).join('');
        }
    }

    async function actualizarTablaPresupuestos() {
        const presupuestosTableBody = document.getElementById('presupuestosTableBody');
        if (presupuestosTableBody) {
            presupuestosTableBody.innerHTML = presupuestos.map(presupuesto => `
                <tr>
                    <td>${presupuesto.id}</td>
                    <td>${presupuesto.total}</td>
                    <td class="text-center align-middle">
                        <button class="btn btn-primary btn-sm" onclick="modificarPresupuesto(${presupuesto.id})">Modificar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarPresupuesto(${presupuesto.id})">Eliminar</button>
                    </td>
                </tr>
            `).join('');
        }
    }

    async function actualizarTablaCajas() {
        const cajasTableBody = document.getElementById('cajasTableBody');
        if (cajasTableBody) {
            cajasTableBody.innerHTML = cajas.map(caja => `
                <tr>
                    <td>${caja.fecha}</td>
                    <td>${caja.ventas.length}</td>
                    <td>${caja.productosVendidos}</td>
                    <td>${caja.total}</td>
                </tr>
            `).join('');
        }
    }

    // Cargar el archivo JSON y actualizar las variables
    try {
        const response = await fetch('/datos/pdEjemplos.txt');
        const data = await response.json();
        rubros = data.rubros;
        productos = data.productos;
        nextProductId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
        actualizarRubros();
        actualizarProductos();
        actualizarTablaStock();
        actualizarTablaPrecios();
        actualizarTablaVentas();
        actualizarTablaPresupuestos();
        actualizarTablaCajas();
    } catch (error) {
        console.error('Error cargando el archivo JSON:', error);
    }

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
    window.mostrarCrearProductoModal = mostrarCrearProductoModal;
    window.mostrarModificarStockModal = mostrarModificarStockModal;
    window.guardarCambiosStock = guardarCambiosStock;
    window.copiarProducto = copiarProducto;
    window.modificarProducto = modificarProducto;
    window.eliminarProducto = eliminarProducto;
    window.mostrarModificarPreciosModal = mostrarModificarPreciosModal;
    window.guardarCambiosPrecios = guardarCambiosPrecios;
    window.mostrarCrearVentaModal = mostrarCrearVentaModal;
    window.agregarProductoVenta = agregarProductoVenta;
    window.guardarVenta = guardarVenta;
    window.mostrarCrearPresupuestoModal = mostrarCrearPresupuestoModal;
    window.agregarProductoPresupuesto = agregarProductoPresupuesto;
    window.guardarPresupuesto = guardarPresupuesto;
    window.crearCajaDiaria = crearCajaDiaria;
});
