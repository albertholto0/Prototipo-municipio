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

        // Depuración - verifica qué recibes realmente
        console.log('Respuesta completa del servidor:', data);

        if (data.success && data.usuario) {
            // Guarda TODOS los datos del usuario
            const usuarioParaGuardar = {
                id: data.usuario.id,
                id_usuario: data.usuario.id_usuario,
                nombre: data.usuario.nombre,
                rol: data.usuario.rol
            };

            localStorage.setItem('usuarioActual', JSON.stringify(usuarioParaGuardar));

            // Verifica lo guardado
            console.log('Datos guardados en localStorage:',
                JSON.parse(localStorage.getItem('usuarioActual')));
        }


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