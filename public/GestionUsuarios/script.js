document.addEventListener('DOMContentLoaded', () => {
  const tablaBody = document.getElementById('users-table-body');

  const cargarUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/usuarios');

      if (!response.ok) {
        throw new Error(`Error HTTP! estado: ${response.status}`);
      }

      const usuarios = await response.json();

      tablaBody.innerHTML = '';

      if (usuarios.length === 0) {
        tablaBody.innerHTML = '<tr><td colspan="7">No hay usuarios registrados</td></tr>';
        return;
      }

      usuarios.forEach(usuario => {
        const fila = document.createElement('tr');

        fila.innerHTML = `
          <td>${usuario.nombres} ${usuario.apellido_paterno} ${usuario.apellido_materno}</td>
          <td>${usuario.usuario}</td>
          <td>${usuario.rol_usuario}</td>
          <td>${usuario.fecha_acceso || ''}</td>
          <td>${usuario.hora_acceso || 'null'}</td>
          <td>${usuario.estado}</td>
          <td id="action-buttons">
              <button class="action-btn modify" onclick="openModifyModal('${usuario.usuario}')">
                  <img src="/public/Assets/editor.png" alt="Modificar" class="action-icon">
              </button>
          </td>
        `;

        tablaBody.appendChild(fila);
      });

    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      tablaBody.innerHTML = '<tr><td colspan="7">Error al cargar los datos :/ </td></tr>';
    }
  };

  cargarUsuarios();
});