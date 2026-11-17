// Obtener el token JWT
const token = localStorage.getItem('token');

// Si no existe un token, regresar al login
if (!token) {
    window.location.href = '/login.html';
}

// Obtener elementos HTML
const formulario = document.getElementById('form-producto');
const listaProductos = document.getElementById('lista-productos');

const campoNombre = document.getElementById('nombre');
const campoDescripcion = document.getElementById('descripcion');
const campoPrecio = document.getElementById('precio');
const campoExistencias = document.getElementById('existencias');

const mensajeProducto = document.getElementById('mensaje-producto');
const mensajeLista = document.getElementById('mensaje-lista');

const btnGuardar = document.getElementById('btn-guardar');
const btnCancelar = document.getElementById('btn-cancelar');
const btnLogout = document.getElementById('btn-logout');

const tituloFormulario = document.getElementById('titulo-formulario');

// Identificador del producto que estamos editando
let productoEditando = null;

// FUNCIÓN PARA CONSULTAR PRODUCTOS
const cargarProductos = async () => {
    try {
        const respuesta = await fetch('/api/products', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (respuesta.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login.html';
            return;
        }

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            mensajeLista.textContent = datos.mensaje;
            return;
        }

        mostrarProductos(datos.productos);

    } catch (error) {
        console.error('Error al consultar productos:', error);
        mensajeLista.textContent = 'No se pudieron cargar los productos.';
    }
};

// FUNCIÓN PARA MOSTRAR PRODUCTOS
const mostrarProductos = (productos) => {
    listaProductos.innerHTML = '';

    if (productos.length === 0) {
        mensajeLista.textContent = 'Todavía no tienes productos registrados.';
        return;
    }

    mensajeLista.textContent = '';

    productos.forEach(producto => {
        const fila = document.createElement('tr');

        const valores = [
            producto.nombre,
            producto.descripcion,
            `$${Number(producto.precio).toFixed(2)}`,
            producto.existencias
        ];

        valores.forEach(valor => {
            const celda = document.createElement('td');
            celda.textContent = valor;
            fila.appendChild(celda);
        });

        // Crear columna de acciones
        const celdaAcciones = document.createElement('td');

        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.type = 'button';
        btnEditar.className = 'btn-editar';

        btnEditar.addEventListener('click', () => {
            prepararEdicion(producto);
        });

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.type = 'button';
        btnEliminar.className = 'btn-eliminar';

        btnEliminar.addEventListener('click', () => {
            eliminarProducto(producto._id);
        });

        celdaAcciones.appendChild(btnEditar);
        celdaAcciones.appendChild(btnEliminar);

        fila.appendChild(celdaAcciones);
        listaProductos.appendChild(fila);
    });
};

// REGISTRAR O ACTUALIZAR PRODUCTO
formulario.addEventListener('submit', async (event) => {
    event.preventDefault();

    const producto = {
        nombre: campoNombre.value.trim(),
        descripcion: campoDescripcion.value.trim(),
        precio: Number(campoPrecio.value),
        existencias: Number(campoExistencias.value)
    };

    const editando = productoEditando !== null;

    const url = editando
        ? `/api/products/${productoEditando}`
        : '/api/products';

    const metodo = editando ? 'PUT' : 'POST';

    try {
        const respuesta = await fetch(url, {
            method: metodo,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(producto)
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            mensajeProducto.textContent = datos.mensaje || 'No se pudo guardar el producto.';
            mensajeProducto.style.color = 'red';
            return;
        }

        mensajeProducto.textContent = datos.mensaje;
        mensajeProducto.style.color = 'green';

        formulario.reset();
        cancelarEdicion();

        await cargarProductos();

    } catch (error) {
        console.error('Error al guardar producto:', error);
        mensajeProducto.textContent = 'Error de conexión con el servidor.';
        mensajeProducto.style.color = 'red';
    }
});

// PREPARAR LA EDICIÓN DE UN PRODUCTO
const prepararEdicion = (producto) => {
    productoEditando = producto._id;

    campoNombre.value = producto.nombre;
    campoDescripcion.value = producto.descripcion;
    campoPrecio.value = producto.precio;
    campoExistencias.value = producto.existencias;

    tituloFormulario.textContent = 'Editar producto';
    btnGuardar.textContent = 'Guardar cambios';
    btnCancelar.hidden = false;

    mensajeProducto.textContent = '';
};

// CANCELAR EDICIÓN
const cancelarEdicion = () => {
    productoEditando = null;

    tituloFormulario.textContent = 'Registrar producto';
    btnGuardar.textContent = 'Registrar producto';
    btnCancelar.hidden = true;
};

btnCancelar.addEventListener('click', () => {
    formulario.reset();
    cancelarEdicion();
    mensajeProducto.textContent = '';
});

// ELIMINAR PRODUCTO
const eliminarProducto = async (id) => {
    const confirmar = confirm('¿Estás seguro de eliminar este producto?');

    if (!confirmar) {
        return;
    }

    try {
        const respuesta = await fetch(`/api/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            mensajeLista.textContent = datos.mensaje;
            return;
        }

        mensajeLista.textContent = 'Producto eliminado correctamente.';

        await cargarProductos();

    } catch (error) {
        console.error('Error al eliminar producto:', error);
        mensajeLista.textContent = 'No se pudo eliminar el producto.';
    }
};

// CERRAR SESIÓN
btnLogout.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
});

// CARGAR PRODUCTOS AL ABRIR LA PÁGINA
if (token) {
    cargarProductos();
}