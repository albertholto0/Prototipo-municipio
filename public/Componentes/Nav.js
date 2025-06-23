// Cargar CSS dinámicamente
const injectStyles = () => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/public/Componentes/Nav.css";
  document.head.appendChild(link);
};

// Cargar HTML dinámicamente
const injectHTML = async () => {
  try {
    const response = await fetch("/public/Componentes/Nav.html"); // Ajusta la ruta
    const html = await response.text();
    const placeholder = document.getElementById("nav-placeholder");
    if (placeholder) {
      placeholder.innerHTML = html;
      setupEventListeners();
    }
  } catch (error) {
    console.error("Error cargando el nav:", error);
  }
};

// Función para configurar todos los event listeners
const setupEventListeners = () => {
  // Manejar el dropdown del usuario
  const userIcon = document.getElementById('userIcon');
  const dropdown = document.getElementById('userDropdown');

  if (userIcon && dropdown) {
    userIcon.addEventListener('click', (e) => {
      if (e.target.tagName === 'IMG') {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
      }
    });

    // Cerrar dropdown al hacer click fuera
    document.addEventListener('click', (e) => {
      if (!userIcon.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });
  }

  // Configurar botones
  const settingsBtn = document.getElementById('settingsBtn');
  const infoBtn = document.getElementById('userInfoBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      window.abrirModalConfiguracionUsuario();
    });
  }

  if (infoBtn) {
    infoBtn.addEventListener('click', async () => {
      try {
        const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
        console.log('Usuario completo desde localStorage:', usuarioActual);

        if (!usuarioActual || (!usuarioActual.id && !usuarioActual.id_usuario)) {
          throw new Error('Datos de usuario incompletos');
        }

        // Usa id_usuario si existe, sino id
        const userId = usuarioActual.id_usuario || usuarioActual.id;

        const response = await fetch(`http://localhost:5000/api/usuarios/id/${userId}`);

        if (!response.ok) throw new Error('Error al obtener usuario');

        const user = await response.json();
        console.log('Datos del usuario desde API:', user);

        // Llenar el modal con los datos del usuario
        const modal = document.getElementById('navUserInfoModal');
        if (!modal) throw new Error('No se encontró el modal en el DOM');

        // Asignar los valores a los elementos del modal
        document.getElementById('navInfoUserName').textContent =
          `${user.nombres || ''} ${user.apellido_paterno || ''} ${user.apellido_materno || ''}`.trim();
        document.getElementById('navInfoUserUsername').textContent = user.usuario || 'N/A';
        document.getElementById('navInfoUserRole').textContent = user.rol_usuario || 'N/A';
        document.getElementById('navInfoUserLastAccess').textContent = user.ultimo_acceso || 'No disponible';
        document.getElementById('navInfoUserStatus').textContent = user.estado || 'N/A';

        // Si hay foto de perfil, actualizar la imagen
        if (user.foto_perfil) {
          document.getElementById('navInfoUserPhoto').src = user.foto_perfil;
        }

        // Mostrar el modal
        modal.style.display = 'block';
      } catch (error) {
        console.error('Error:', error);
        alert(error.message);
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      window.location.href = '/public/InicioSesion/inicio_sesion.html';
    });
  }
};



// Inicializar todo
document.addEventListener("DOMContentLoaded", () => {
  injectStyles();
  injectHTML();
});