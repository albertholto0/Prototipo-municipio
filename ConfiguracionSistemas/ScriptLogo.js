document.addEventListener("DOMContentLoaded", () => {
  const logo = document.getElementById("logoDisplay");

  const updateLogo = () => {
    const logoSrc = localStorage.getItem("logo");
    if (logo) {
      logo.src = logoSrc || "logo_ixtlan.png"; // Si no hay logo en localStorage, usar el logo por defecto
    }
  };

  updateLogo(); // Llamar la función para actualizar el logo cuando se cargue la página

  // Detectar cambios en localStorage y actualizar el logo en tiempo real
  window.addEventListener("storage", updateLogo);
});
