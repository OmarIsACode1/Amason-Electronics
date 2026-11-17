// Obtener los elementos del formulario
const formulario = document.getElementById('form-login');
const campoCorreo = document.getElementById('correo');
const campoPassword = document.getElementById('password');
const mensaje = document.getElementById('mensaje');

// Escuchar cuando el usuario envía el formulario
formulario.addEventListener('submit', async (event) => {
    // Evitar que el formulario recargue la página
    event.preventDefault();

    // Obtener los datos ingresados
    const correo = campoCorreo.value;
    const password = campoPassword.value;

    try {
        // Enviar las credenciales al backend
        const respuesta = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                correo: correo,
                password: password
            })
        });

        // Convertir la respuesta JSON
        const datos = await respuesta.json();

        // Comprobar si ocurrió un error
        if (!respuesta.ok) {
            mensaje.textContent = datos.mensaje || 'No se pudo iniciar sesión.';
            mensaje.style.color = 'red';
            return;
        }

        // Guardar el token JWT
        localStorage.setItem('token', datos.token);

        // Redirigir al panel de productos
        window.location.href = '/productos.html';
    } catch (error) {
        // Manejar errores de conexión
        console.error('Error:', error);
        mensaje.textContent = 'No fue posible conectar con el servidor.';
        mensaje.style.color = 'red';
    }
});