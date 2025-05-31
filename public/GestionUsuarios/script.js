const searchInput = document.getElementById("searchInput"); // Input para búsqueda

//Este script se encarga de cargar los usuarios desde el servidor y mostrarlos en la tabla
document.addEventListener('DOMContentLoaded', () => {
  const tablaBody = document.getElementById('users-table-body');
  let usuarios = []; // Guardar todos los usuarios aquí

  const mostrarUsuarios = (usuariosFiltrados) => {
    tablaBody.innerHTML = '';

    if (usuariosFiltrados.length === 0) {
      tablaBody.innerHTML = '<tr><td colspan="7">No hay usuarios registrados</td></tr>';
      return;
    }

    usuariosFiltrados.forEach(usuario => {
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
  };

  const cargarUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/usuarios');
      if (!response.ok) {
        throw new Error(`Error HTTP! estado: ${response.status}`);
      }
      usuarios = await response.json();
      mostrarUsuarios(usuarios);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      tablaBody.innerHTML = '<tr><td colspan="7">Error al cargar los datos :/ </td></tr>';
    }
  };

  searchInput.addEventListener('input', () => {
    const valor = searchInput.value.toLowerCase();
    const filtrados = usuarios.filter(usuario =>
      (`${usuario.nombres} ${usuario.apellido_paterno} ${usuario.apellido_materno}`.toLowerCase().includes(valor) ||
      usuario.usuario.toLowerCase().includes(valor))
    );
    mostrarUsuarios(filtrados);
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