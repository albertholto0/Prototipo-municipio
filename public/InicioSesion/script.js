function mostrarError(mensaje) {
    alert(mensaje);
}

document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const usuario = document.querySelector('input[name="nombre_usuario"]').value;
    const contraseña = document.querySelector('input[name="contraseña"]').value;

    try {
        const response = await fetch('http://localhost:5000/api/inicioSesion/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre_usuario: usuario,
                contraseña: contraseña
            })
        });

        const data = await response.json();

        if (!response.ok) {
            mostrarError(data.error || 'Error en la autenticación');
            return;
        }

        // Guardar datos del usuario en localStorage
        localStorage.setItem('usuarioActual', JSON.stringify(data.usuario));
        
        
        if (data.usuario.rol && data.usuario.rol.toLowerCase().includes('administrador')) {
            alert('Bienvenido administrador');
            window.location.href = '/public/Inicio/pantallaPrincipal.html';
        } else {
            alert('Bienvenido cajero');
            window.location.href = '/public/Inicio/pantallaPrincipal.html';
        }

    } catch (error) {
        console.error('Error en login:', error);
        mostrarError('Error de conexión con el servidor');
    }
});