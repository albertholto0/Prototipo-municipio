const searchInput = document.getElementById("searchInput"); // Input para búsqueda
const paginationContainer = document.getElementById('pagination');
const ItemsPorPagina = 5;
let currentPage = 1;

//Este script se encarga de cargar los usuarios desde el servidor y mostrarlos en la tabla
document.addEventListener('DOMContentLoaded', () => {
  const tablaBody = document.getElementById('users-table-body');
  let usuarios = []; // Guardar todos los usuarios aquí

  // Mostrar usuarios con paginación
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
      
      // Aplica estilo de usuario inactivo si no está activo
      if (!esActivo) {
          fila.classList.add('inactive-user');
      }

      fila.innerHTML = `
          <td>${usuario.nombres} ${usuario.apellido_paterno} ${usuario.apellido_materno}</td>
          <td>${usuario.usuario}</td>
          <td>${usuario.rol_usuario}</td>
          <td>${usuario.fecha_acceso || 'null'}</td>
          <td>${usuario.hora_acceso || 'null'}</td>
          <td>${usuario.estado}</td>
          <td id="action-buttons">
              <button class="action-btn modify" onclick="openModifyModal('${usuario.usuario}')">
                  <img src="/public/Assets/editor.png" alt="Modificar" class="action-icon">
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

  // Renderizar paginación
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
      if (!response.ok) {
        throw new Error(`Error HTTP! estado: ${response.status}`);
      }
      usuarios = await response.json();
      mostrarUsuarios(usuarios, 1);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      tablaBody.innerHTML = '<tr><td colspan="7">Error al cargar los datos :/ </td></tr>';
      paginationContainer.innerHTML = '';
    }
  };

  // Búsqueda
  searchInput.addEventListener('input', () => {
    const valor = searchInput.value.toLowerCase();
    const filtrados = usuarios.filter(usuario =>
    (`${usuario.nombres} ${usuario.apellido_paterno} ${usuario.apellido_materno}`.toLowerCase().includes(valor) ||
      usuario.usuario.toLowerCase().includes(valor))
    );
    mostrarUsuarios(filtrados, 1);
  });

  cargarUsuarios();
});

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('userModal');
  const registerBtn = document.getElementById('registerBtn');
  const userForm = document.getElementById('userForm');
  const cancelBtn = document.querySelector('.cancel-btn');

  registerBtn.addEventListener('click', () => {
    document.getElementById('modalTitle').textContent = 'Registrar Nuevo Usuario';
    userForm.reset();
    modal.style.display = 'block';
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
});