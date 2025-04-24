document.addEventListener("DOMContentLoaded", () => {
  // Cargar logo desde localStorage al iniciar
  const savedLogo = localStorage.getItem("logo");
  if (savedLogo) {
    const logoElements = document.querySelectorAll(".logo-image");
    logoElements.forEach((element) => {
      element.src = savedLogo; // Actualizar el logo en todas las pestañas
    });
  }

  // Cuando se cambie el logo, guardarlo en localStorage
  const logoInput = document.getElementById("logo");
  if (logoInput) {
    logoInput.addEventListener("change", (event) => {
      const logoFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = function (e) {
        const logoURL = e.target.result;
        localStorage.setItem("logo", logoURL); // Guardar la URL del logo en localStorage

        // Actualizar el logo en todas las pestañas abiertas
        const logoElements = document.querySelectorAll(".logo-image");
        logoElements.forEach((element) => {
          element.src = logoURL;
        });
      };
      reader.readAsDataURL(logoFile); // Leer el archivo de imagen
    });
  }
});
