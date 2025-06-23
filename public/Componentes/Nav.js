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
  // Verificación de contraseña
  const verifyPasswordBtn = document.getElementById('navVerifyPasswordBtn');
  if (verifyPasswordBtn) {
    verifyPasswordBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      console.log('Botón de verificación clickeado'); // Debug 1

      const currentPassword = document.getElementById('currentPassword').value;
      const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
      const userId = usuarioActual?.id_usuario || usuarioActual?.id;
      const passwordError = document.getElementById('passwordError');

      if (!userId) {
        console.error('No se pudo obtener el ID del usuario');
        return;
      }

      console.log('Datos enviados:', { id_usuario: userId, password: currentPassword }); // Debug 2

      try {
        const response = await fetch('http://localhost:5000/api/usuarios/verify-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_usuario: userId,
            password: currentPassword
          })
        });

        console.log('Respuesta del servidor:', response); // Debug 3

        const data = await response.json();
        console.log('Datos de respuesta:', data); // Debug 4

        if (response.ok) {
          console.log('Contraseña correcta, mostrando formulario'); // Debug 5
          document.getElementById('passwordVerificationStep').style.display = 'none';
          document.getElementById('navUserConfForm').style.display = 'block';
          passwordError.style.display = 'none';

          // Cargar datos del usuario en el formulario
          const userResponse = await fetch(`http://localhost:5000/api/usuarios/id/${userId}`);
          const user = await userResponse.json();

          document.getElementById('navUserConfName').value = user.nombres || '';
          document.getElementById('navUserConfLastName').value = user.apellido_paterno || '';
          document.getElementById('navUserConfSecondLastName').value = user.apellido_materno || '';
          document.getElementById('navUserConfUsername').value = user.usuario || '';
        } else {
          console.log('Contraseña incorrecta'); // Debug 6
          passwordError.style.display = 'block';
        }
      } catch (error) {
        console.error('Error al verificar contraseña:', error); // Debug 7
        passwordError.style.display = 'block';
        passwordError.textContent = 'Error al conectar con el servidor';
      }
    });
  }

  // Envío del formulario de actualización
const userConfForm = document.getElementById('navUserConfForm');
if (userConfForm) {
    userConfForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
        if (!usuarioActual) {
            alert('No hay sesión activa');
            return;
        }

        const userId = usuarioActual.id_usuario || usuarioActual.id;
        if (!userId) {
            alert('No se pudo identificar al usuario');
            return;
        }

        // Obtener valores del formulario
        const nombres = document.getElementById('navUserConfName').value;
        const apellido_paterno = document.getElementById('navUserConfLastName').value;
        const apellido_materno = document.getElementById('navUserConfSecondLastName').value;
        const usuario = document.getElementById('navUserConfUsername').value;
        const newPassword = document.getElementById('navUserConfNewPassword').value;

        try {
            // 1. Actualizar datos básicos
            const updateResponse = await fetch('http://localhost:5000/api/usuarios', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_usuario: userId,
                    nombres,
                    apellido_paterno,
                    apellido_materno,
                    usuario,
                    rol_usuario: usuarioActual.rol_usuario,
                    foto_perfil: usuarioActual.foto_perfil || null
                })
            });

            if (!updateResponse.ok) {
                const errorData = await updateResponse.json();
                throw new Error(errorData.error || 'Error al actualizar datos del usuario');
            }

            // 2. Si hay nueva contraseña, actualizarla
            if (newPassword) {
                const passwordResponse = await fetch('http://localhost:5000/api/usuarios/reset-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id_usuario: userId,
                        newPassword
                    })
                });

                if (!passwordResponse.ok) {
                    const errorData = await passwordResponse.json();
                    throw new Error(errorData.error || 'Error al actualizar contraseña');
                }
            }

            // Actualizar localStorage con los nuevos datos
            const updatedUser = {
                ...usuarioActual,
                nombres,
                apellido_paterno,
                apellido_materno,
                usuario
            };
            localStorage.setItem('usuarioActual', JSON.stringify(updatedUser));

            alert('¡Datos actualizados correctamente!');
            document.getElementById('navUserConfModal').style.display = 'none';
            
            // Opcional: Recargar los datos mostrados en la página
            if (document.getElementById('navInfoUserName')) {
                document.getElementById('navInfoUserName').textContent = 
                    `${nombres} ${apellido_paterno} ${apellido_materno}`;
                document.getElementById('navInfoUserUsername').textContent = usuario;
            }

        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            alert(`Error al actualizar: ${error.message}`);
        }
    });
}

  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      const modal = document.getElementById('navUserConfModal');
      modal.style.display = 'block';

      document.getElementById('passwordVerificationStep').style.display = 'block';
      document.getElementById('navUserConfForm').style.display = 'none';
      document.getElementById('currentPassword').value = '';
      document.getElementById('passwordError').style.display = 'none';
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