// === CONEXIÓN CON EL SERVIDOR (api.php) ===

// =========================
// OBTENER LISTA DE PRODUCTOS DESDE LA BASE
// =========================
async function obtenerProductos() {
  try {
    const respuesta = await fetch('api.php');
    const datos = await respuesta.json();
    console.log("✅ Datos recibidos:", datos);
    if (datos.ok) {
      return datos.productos;
    } else {
      alert("⚠️ " + datos.mensaje);
      return [];
    }
  } catch (error) {
    console.error("❌ Error:", error);
    alert("❌ No se pudo conectar con el servidor. Verifica que XAMPP esté encendido.");
    return [];
  }
}

// =========================
// GUARDAR PRODUCTO NUEVO
// =========================
async function guardarProducto(producto) {
  try {
    const respuesta = await fetch('api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto)
    });
    const resultado = await respuesta.json();
    alert(resultado.mensaje);
    return resultado.ok;
  } catch (err) {
    alert("❌ Error al guardar el producto.");
    console.error(err);
    return false;
  }
}

// =========================
// ELIMINAR PRODUCTO
// =========================
async function eliminarProducto(id) {
  try {
    const respuesta = await fetch('api.php', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    });
    const resultado = await respuesta.json();
    alert(resultado.mensaje);
    return resultado.ok;
  } catch (err) {
    alert("❌ Error al eliminar el producto.");
    console.error(err);
    return false;
  }
}

// =========================
// FORMULARIO DE REGISTRO
// =========================
function inicializarFormularioRegistrar() {
  const formulario = document.getElementById('form-registrar');
  if (!formulario) return;

  formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    const codigo = document.getElementById('codigo').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const categoria = document.getElementById('categoria').value.trim();
    const proveedor = document.getElementById('proveedor').value.trim();
    const precio = parseFloat(document.getElementById('precio').value);
    const cantidad = parseInt(document.getElementById('cantidad').value);

    if (!codigo || !nombre || isNaN(precio) || isNaN(cantidad)) {
      alert("⚠️ Completa todos los campos correctamente.");
      return;
    }

    const producto = { codigo, nombre, categoria, proveedor, precio, cantidad };
    const guardado = await guardarProducto(producto);

    if (guardado) {
      formulario.reset();
      if (typeof inicializarTablaProductos === "function") {
        inicializarTablaProductos();
      }
    }
  });
}

// =========================
// DIBUJAR LA TABLA
// =========================
async function inicializarTablaProductos() {
  const cuerpo = document.getElementById('tabla-productos-cuerpo');
  if (!cuerpo) {
    console.log("❌ No se encontró el cuerpo de la tabla");
    return;
  }

  cuerpo.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:20px;">Cargando productos...</td></tr>';
  
  const productos = await obtenerProductos();
  console.log("✅ Productos a dibujar:", productos);

  if (productos.length === 0) {
    cuerpo.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:20px;">No hay productos registrados.</td></tr>';
    return;
  }

  cuerpo.innerHTML = '';

  productos.forEach((p) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${p.codigo}</td>
      <td>${p.nombre}</td>
      <td>${p.categoria || '-'}</td>
      <td>${p.proveedor || '-'}</td>
      <td>$ ${Number(p.precio).toLocaleString('es-CO')}</td>
      <td>${p.cantidad}</td>
      <td>$ ${Number(p.subtotal).toLocaleString('es-CO')}</td>
      <td>
        <button class="btn-eliminar" data-id="${p.id}">🗑️ Eliminar</button>
      </td>
    `;
    cuerpo.appendChild(fila);
  });

  // Botones eliminar
  document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      if (confirm('¿Estás seguro de eliminar este producto?')) {
        await eliminarProducto(id);
        inicializarTablaProductos();
      }
    });
  });
}

// =========================
// INICIAR TODO AL CARGAR
// =========================
document.addEventListener('DOMContentLoaded', () => {
  console.log("✅ Página cargada, dibujando tabla...");
  inicializarTablaProductos();
  inicializarFormularioRegistrar();
});