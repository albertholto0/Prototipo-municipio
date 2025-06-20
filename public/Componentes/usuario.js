function obtenerUsuarioActual() {
    const usuario = localStorage.getItem('usuarioActual');
    return usuario ? JSON.parse(usuario) : null;
}

// Funcion para verificar el rol del usuario
function esAdministrador() {
    const usuario = obtenerUsuarioActual();
    return usuario && usuario.rol_usuario && usuario.rol_usuario.toLowerCase().includes('admin');
}

// Funcion para obtener usuario y contraseña del usuario actual
function obtenerCredenciales() {
    const usuario = obtenerUsuarioActual();
    return usuario ? { usuario: usuario.usuario, contraseña: usuario.password_usuario } : null;
}