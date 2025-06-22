window.cerrarModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'none';
};

window.abrirModalInfoUsuario = function() {
    const usuario = localStorage.getItem('usuarioActual');
    const infoUsuarioDiv = document.getElementById('infoUsuario');
    if (!infoUsuarioDiv) return;

    if (usuario) {
        const user = JSON.parse(usuario);
        infoUsuarioDiv.innerHTML = `
            <p><strong>Nombre:</strong> ${user.nombres || ''} ${user.apellido_paterno || ''} ${user.apellido_materno || ''}</p>
            <p><strong>Usuario:</strong> ${user.usuario || ''}</p>
            <p><strong>Rol:</strong> ${user.rol_usuario || ''}</p>
        `;
    } else {
        infoUsuarioDiv.innerHTML = '<p>No hay información de usuario disponible.</p>';
    }
    const modal = document.getElementById('modalMostrarInfo');
    if (modal) modal.style.display = 'block';
};

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-cancel')) {
        const modal = e.target.closest('.modal-overlay');
        if (modal) modal.style.display = 'none';
    }
});

window.abrirModalConfiguracionUsuario = function() {
    
};
