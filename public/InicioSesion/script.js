function mostrarError(mensaje) {
    alert(mensaje);
}

document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const usuario = document.querySelector('input[name="nombre_usuario"]').value;
    const contraseña = document.querySelector('input[name="contraseña"]').value;

    try {
        const response = await fetch('http://localhost:5000/api/usuarios');
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
        const usuarios = await response.json();
        
        // Validamos que los datos recibidos sean un array
        if (!Array.isArray(usuarios)) {
            mostrarError('Error en los datos recibidos del servidor');
            return;
        }
        
        // Buscamos el usuario ingresado
        const user = usuarios.find(u => u.usuario === usuario);

        if (!user) {
            mostrarError('Usuario no encontrado');
            return;
        }

        // Validamos el estado del usuario
        if (user.estado && user.estado.toLowerCase() !== 'activo') {
            mostrarError('Cuenta inactiva. Contacta al administrador.');
            return;
        }

        // Validamos la contraseña
        if (user.password_usuario !== contraseña) {
            mostrarError('Contraseña incorrecta');
            return;
        }

        // Validamos el rol del usuario
        if (!user.rol_usuario || !user.rol_usuario.toLowerCase().includes('admin')) {
            mostrarError('No tienes permisos de administrador');
            return;
        }

        // Si todo está bien, redirigimos al usuario a la pantalla principal
        window.location.href = '/public/Inicio/pantallaPrincipal.html';
        
    } catch (error) {
        console.error('Error en login:', error);
        mostrarError('Error de conexión con el servidor');
    }
});