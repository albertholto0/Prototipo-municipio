document.addEventListener("DOMContentLoaded", () => {
  // Cargar el logo desde localStorage cuando se recarga la página
  const savedLogo = localStorage.getItem("logo");
  if (savedLogo) {
    const logoElements = document.querySelectorAll(".logo-image");
    logoElements.forEach((element) => {
      element.src = savedLogo; // Actualizar el logo en todas las pestañas
    });
  }
});
