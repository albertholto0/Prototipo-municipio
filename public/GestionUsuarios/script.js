const searchInput = document.getElementById("searchInput"); // Input para búsqueda
const paginationContainer = document.getElementById('pagination');
const ItemsPorPagina = 5;
let currentPage = 1;

//Este script se encarga de cargar los usuarios desde el servidor y mostrarlos en la tabla
document.addEventListener('DOMContentLoaded', () => {
  const tablaBody = document.getElementById('users-table-body');
  const paginationContainer = document.getElementById('pagination');
  const searchInput = document.getElementById("searchInput");
  const ItemsPorPagina = 5;
  let currentPage = 1;
  let usuarios = [];


  const renderPagination = (usuariosFiltrados, page) => {
    const totalPages = Math.ceil(usuariosFiltrados.length / ItemsPorPagina);
    paginationContainer.innerHTML = '';
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.className = 'pagination-btn' + (i === page ? ' active' : '');
      btn.addEventListener('click', () => {
        currentPage = i;
        mostrarUsuarios(usuariosFiltrados, currentPage);
      });
      paginationContainer.appendChild(btn);
    }
  };

  // Cargar usuarios desde el servidor
  const cargarUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/usuarios');
      if (!response.ok) throw new Error(`Error HTTP! estado: ${response.status}`);
      usuarios = await response.json();
      mostrarUsuarios(usuarios, 1);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      tablaBody.innerHTML = '<tr><td colspan="7">Error al cargar los datos :/ </td></tr>';
      paginationContainer.innerHTML = '';
    }
  };

  searchInput.addEventListener('input', () => {
    const valor = searchInput.value.toLowerCase();
    const filtrados = usuarios.filter(usuario =>
    (`${usuario.nombres} ${usuario.apellido_paterno} ${usuario.apellido_materno}`.toLowerCase().includes(valor) ||
      usuario.usuario.toLowerCase().includes(valor))
    );
    mostrarUsuarios(filtrados, 1);
  });

  cargarUsuarios();

  // Modal para agregar nuevo usuario
  const modal = document.getElementById('userModal');
  const registerBtn = document.getElementById('registerBtn');
  const userForm = document.getElementById('userForm');
  const cancelBtn = modal.querySelector('.btn-cancel');

  registerBtn.addEventListener('click', () => {
    userForm.reset();
    modal.style.display = 'block';
    document.getElementById('modalTitle').textContent = 'Agregar nuevo Usuario';
  });

  cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  userForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombres = document.getElementById('userName').value;
    const apellido_paterno = document.getElementById('userLastName').value;
    const apellido_materno = document.getElementById('userSecondLastName').value;
    const usuario = document.getElementById('userUsername').value;
    const password = document.getElementById('userPassword').value;
    const rol_usuario = document.getElementById('userRole').value;

    try {
      const response = await fetch('http://localhost:5000/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombres,
          apellido_paterno,
          apellido_materno,
          usuario,
          password,
          rol_usuario
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Error al registrar usuario');

      alert(data.message || 'Usuario registrado exitosamente');
      modal.style.display = 'none';
      window.location.reload();
    } catch (error) {
      alert(error.message || 'Error al registrar usuario');
    }
  });

  // Función para abrir el modal de edición
  window.openModifyModal = async (username) => {
    try {
      const response = await fetch(`http://localhost:5000/api/usuarios/${username}`);
      if (!response.ok) throw new Error(`Error HTTP! estado: ${response.status}`);

      const user = await response.json();

      const modal = document.getElementById('editUserModal');
      document.getElementById('editUserId').value = user.id_usuario;
      document.getElementById('editUserName').value = user.nombres;
      document.getElementById('editUserLastName').value = user.apellido_paterno || '';
      document.getElementById('editUserSecondLastName').value = user.apellido_materno || '';
      document.getElementById('editUserUsername').value = user.usuario;
      document.getElementById('editUserRole').value = user.rol_usuario;

      // Configurar el botón de resetear contraseña
      const resetBtn = document.getElementById('resetPasswordBtn');
      resetBtn.onclick = () => resetPassword(user.id_usuario, user.usuario);

      modal.style.display = 'block';
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      alert('Error al cargar datos del usuario');
    }
  };

  // Función para resetear contraseña
  window.resetPassword = async (userId, username) => {
    if (!confirm(`¿Estás seguro de resetear la contraseña de ${username}? La nueva contraseña será el mismo nombre de usuario.`)) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/usuarios/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: userId,
          newPassword: username // La nueva contraseña será el nombre de usuario
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Error al resetear contraseña');

      alert(data.message || 'Contraseña reseteada exitosamente');
    } catch (error) {
      console.error('Error al resetear contraseña:', error);
      alert(error.message || 'Error al resetear contraseña');
    }
  };

  // Event listener para el botón cancelar del modal de edición
  document.querySelector('#editUserModal .btn-cancel').addEventListener('click', () => {
    document.getElementById('editUserModal').style.display = 'none';
  });

  // Event listener para el formulario de edición
  document.getElementById('editUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id_usuario = document.getElementById('editUserId').value;
    const nombres = document.getElementById('editUserName').value;
    const apellido_paterno = document.getElementById('editUserLastName').value;
    const apellido_materno = document.getElementById('editUserSecondLastName').value;
    const usuario = document.getElementById('editUserUsername').value;
    const rol_usuario = document.getElementById('editUserRole').value;

    try {
      const response = await fetch('http://localhost:5000/api/usuarios', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario,
          nombres,
          apellido_paterno,
          apellido_materno,
          usuario,
          rol_usuario
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Error al actualizar usuario');

      alert(data.message || 'Usuario actualizado exitosamente');
      document.getElementById('editUserModal').style.display = 'none';
      window.location.reload();
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      alert(error.message || 'Error al actualizar usuario');
    }
  });

  // Aquí se define la función para mostrar los usuarios en la tabla
  const mostrarUsuarios = (usuariosFiltrados, page = 1) => {
    tablaBody.innerHTML = '';

    if (usuariosFiltrados.length === 0) {
      tablaBody.innerHTML = '<tr><td colspan="7">No hay usuarios registrados</td></tr>';
      paginationContainer.innerHTML = '';
      return;
    }

    const start = (page - 1) * ItemsPorPagina;
    const end = start + ItemsPorPagina;
    const pageItems = usuariosFiltrados.slice(start, end);

    pageItems.forEach(usuario => {
      const fila = document.createElement('tr');
      const esActivo = usuario.estado && usuario.estado.toLowerCase() === 'activo';
      if (!esActivo) fila.classList.add('inactive-user');

      fila.innerHTML = `
            <td>${usuario.nombres} ${usuario.apellido_paterno} ${usuario.apellido_materno}</td>
            <td>${usuario.usuario}</td>
            <td>${usuario.rol_usuario}</td>
            <td>${usuario.estado}</td>
            <td id="action-buttons">
                <button class="action-btn modify" onclick="openModifyModal('${usuario.usuario}')">
                    <img src="/public/Assets/editor.png" alt="Modificar" class="action-icon">
                </button>
               <button class="action-btn info" onclick="openInfoModal('${usuario.usuario}')">
                    <img src="/public/Assets/information.png" alt="Info" class="action-icon">
                </button>
                ${esActivo
          ? `<button class="action-btn down" onclick="openDownModal('${usuario.usuario}')">
                        <img src="/public/Assets/baja.png" alt="Baja" class="action-icon">
                       </button>`
          : `<button class="action-btn up" onclick="openUpModal('${usuario.usuario}')">
                        <img src="/public/Assets/alta.png" alt="Alta" class="action-icon">
                       </button>`
        }
            </td>
        `;
      tablaBody.appendChild(fila);
    });
    renderPagination(usuariosFiltrados, page);
  };
  // En script.js, agregar estas funciones
  window.openDownModal = async (username) => {
    try {
      const response = await fetch(`http://localhost:5000/api/usuarios/${username}`);
      if (!response.ok) throw new Error(`Error HTTP! estado: ${response.status}`);

      const user = await response.json();

      if (confirm(`¿Estás seguro de dar de baja al usuario ${username}?`)) {
        const toggleResponse = await fetch('http://localhost:5000/api/usuarios/toggle-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_usuario: user.id_usuario })
        });

        const data = await toggleResponse.json();

        if (!toggleResponse.ok) throw new Error(data.error || 'Error al cambiar estado');

        alert('Estado del usuario actualizado exitosamente');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error al cambiar estado del usuario:', error);
      alert(error.message || 'Error al cambiar estado del usuario');
    }
  };

  window.openUpModal = async (username) => {
    try {
      const response = await fetch(`http://localhost:5000/api/usuarios/${username}`);
      if (!response.ok) throw new Error(`Error HTTP! estado: ${response.status}`);

      const user = await response.json();

      if (confirm(`¿Estás seguro de dar de alta al usuario ${username}?`)) {
        const toggleResponse = await fetch('http://localhost:5000/api/usuarios/toggle-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_usuario: user.id_usuario })
        });

        const data = await toggleResponse.json();

        if (!toggleResponse.ok) throw new Error(data.error || 'Error al cambiar estado');

        alert('Estado del usuario actualizado exitosamente');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error al cambiar estado del usuario:', error);
      alert(error.message || 'Error al cambiar estado del usuario');
    }
  };
  // Función para abrir el modal de información del usuario
  window.openInfoModal = async (username) => {
    try {
      const response = await fetch(`http://localhost:5000/api/usuarios/${username}`);
      if (!response.ok) throw new Error(`Error HTTP! estado: ${response.status}`);

      const user = await response.json();
            
      const responseHistorial = await fetch(`http://localhost:5000/api/historialAccesos/${user.id_usuario}`);
      if (!responseHistorial.ok) throw new Error(`Error HTTP! estado: ${responseHistorial.status}`);

      const historial = await responseHistorial.json();

      const modal = document.getElementById('infoUserModal');
      document.getElementById('infoUserName').textContent = `${user.nombres} ${user.apellido_paterno} ${user.apellido_materno}`;
      document.getElementById('infoUserUsername').textContent = user.usuario;
      document.getElementById('infoUserRole').textContent = user.rol_usuario;

      let fechaSolo = 'No disponible';
      if (historial.fecha_acceso) {
        const fecha = new Date(historial.fecha_acceso);
        fechaSolo = fecha.toLocaleDateString('es-MX');
      }
      document.getElementById('infoDateLastAccess').textContent = fechaSolo;

      document.getElementById('infoHourLastAccess').textContent = historial.hora_acceso || 'No disponible';
      document.getElementById('infoUserStatus').textContent = user.estado;

      modal.style.display = 'block';
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      alert('Error al cargar datos del usuario');
    }
  }

}
);