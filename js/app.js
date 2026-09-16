// === VARIABLES GLOBALES ===
const formulario = document.getElementById('form-producto');
const tablaCuerpo = document.getElementById('tabla-cuerpo');
const valorTotalInventario = document.getElementById('total-inventario');

let productos = [];
let indiceEdicion = null; // Para saber si estamos editando

// === CARGAR DATOS AL INICIAR ===
window.addEventListener('DOMContentLoaded', () => {
    cargarDeLocalStorage();
    renderizarTabla();
});

// === MANEJAR ENVÍO DEL FORMULARIO ===
formulario.addEventListener('submit', (e) => {
    e.preventDefault(); // Evitar recargar la página

    // Obtener valores del formulario
    const codigo = document.getElementById('codigo').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const precio = parseFloat(document.getElementById('precio').value);
    const stock = parseInt(document.getElementById('stock').value);

    // Crear objeto producto
    const producto = { codigo, nombre, precio, stock };

    if (indiceEdicion !== null) {
        // ✅ EDITAR producto existente
        productos[indiceEdicion] = producto;
        indiceEdicion = null;
        document.getElementById('btn-guardar').textContent = 'Guardar Producto';
    } else {
        // ✅ AGREGAR nuevo producto
        // Verificar si el código ya existe
        const existe = productos.some(p => p.codigo === codigo);
        if (existe) {
            alert('⚠️ Ya existe un producto con ese código.');
            return;
        }
        productos.push(producto);
    }

    guardarEnLocalStorage();
    renderizarTabla();
    formulario.reset(); // Limpiar formulario
});

// === RENDERIZAR LA TABLA ===
function renderizarTabla() {
    tablaCuerpo.innerHTML = ''; // Limpiar tabla

    let totalGeneral = 0;

    productos.forEach((producto, indice) => {
        const subtotal = producto.precio * producto.stock;
        totalGeneral += subtotal;

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${producto.codigo}</td>
            <td>${producto.nombre}</td>
            <td>$${producto.precio.toLocaleString('es-CO')}</td>
            <td>${producto.stock}</td>
            <td>$${subtotal.toLocaleString('es-CO')}</td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editarProducto(${indice})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${indice})">Eliminar</button>
            </td>
        `;
        tablaCuerpo.appendChild(fila);
    });

    // Mostrar valor total del inventario
    valorTotalInventario.textContent = `Valor Total del Inventario: $${totalGeneral.toLocaleString('es-CO')}`;

    // Actualizar el resumen (total, disponibles, agotados)
    const resumenTotal = document.getElementById('resumen-total');
    const resumenDisponibles = document.getElementById('resumen-disponibles');
    const resumenAgotados = document.getElementById('resumen-agotados');

    if (resumenTotal) resumenTotal.textContent = productos.length;
    if (resumenDisponibles) {
        resumenDisponibles.textContent = productos.reduce((acc, p) => acc + p.stock, 0);
    }
    if (resumenAgotados) {
        resumenAgotados.textContent = productos.filter(p => p.stock === 0).length;
    }

    // Actualizar "Últimos productos registrados"
    const ultimosProductos = document.getElementById('ultimos-productos');
    if (ultimosProductos) {
        ultimosProductos.innerHTML = '';
        productos.slice(-3).reverse().forEach(p => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'producto';
            tarjeta.innerHTML = `
                <h3>${p.nombre}</h3>
                <p><strong>Código:</strong> ${p.codigo}</p>
                <p><strong>Precio:</strong> $${p.precio.toLocaleString('es-CO')}</p>
                <p><strong>Stock:</strong> ${p.stock}</p>
            `;
            ultimosProductos.appendChild(tarjeta);
        });
    }
}

// === EDITAR PRODUCTO ===
function editarProducto(indice) {
    const producto = productos[indice];

    // Llenar formulario con los datos
    document.getElementById('codigo').value = producto.codigo;
    document.getElementById('nombre').value = producto.nombre;
    document.getElementById('precio').value = producto.precio;
    document.getElementById('stock').value = producto.stock;

    // Cambiar botón y guardar posición
    indiceEdicion = indice;
    document.getElementById('btn-guardar').textContent = 'Actualizar Producto';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// === ELIMINAR PRODUCTO ===
function eliminarProducto(indice) {
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
        productos.splice(indice, 1);
        guardarEnLocalStorage();
        renderizarTabla();
    }
}

// === GUARDAR EN LOCAL STORAGE ===
function guardarEnLocalStorage() {
    localStorage.setItem('inventarioProductos', JSON.stringify(productos));
}

// === CARGAR DESDE LOCAL STORAGE ===
function cargarDeLocalStorage() {
    const datosGuardados = localStorage.getItem('inventarioProductos');
    if (datosGuardados) {
        productos = JSON.parse(datosGuardados);
    }
}