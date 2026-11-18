// Obtener los elementos del formulario
const formulario = document.getElementById('form-register');
const campoNombre = document.getElementById('nombre');
const campoCorreo = document.getElementById('correo');
const campoPassword = document.getElementById('password');
const mensaje = document.getElementById('mensaje');

// Escuchar cuando el usuario envía el formulario
formulario.addEventListener('submit', async (event) => {
    // Evitar que el formulario recargue la página
    event.preventDefault();

    // Obtener los datos ingresados
    const nombre = campoNombre.value;
    const correo = campoCorreo.value;
    const password = campoPassword.value;

    try {
        // Enviar los datos al backend
        const respuesta = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: nombre,
                correo: correo,
                password: password
            })
        });

        // Convertir la respuesta JSON
        const datos = await respuesta.json();

        // Comprobar si ocurrió un error
        if (!respuesta.ok) {
            mensaje.textContent = datos.mensaje || 'No se pudo registrar el usuario.';
            mensaje.style.color = 'red';
            return;
        }

        // Mostrar confirmación
        mensaje.textContent = '¡Registro exitoso! Ahora puedes iniciar sesión.';
        mensaje.style.color = 'green';

        // Limpiar el formulario
        formulario.reset();

    } catch (error) {
        // Manejar errores de conexión
        console.error('Error:', error);
        mensaje.textContent = 'No fue posible conectar con el servidor.';
        mensaje.style.color = 'red';
    }
});