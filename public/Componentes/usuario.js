function obtenerUsuarioActual() {
    const usuario = localStorage.getItem('usuarioActual');
    return usuario ? JSON.parse(usuario) : null;
}

// Funcion para verificar el rol del usuario
function esAdministrador() {
    const usuario = obtenerUsuarioActual();
    return usuario && usuario.rol_usuario && usuario.rol_usuario.toLowerCase().includes('admin');
}