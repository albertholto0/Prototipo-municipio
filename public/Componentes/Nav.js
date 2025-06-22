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
    infoBtn.addEventListener('click', () => {
        window.abrirModalInfoUsuario();
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